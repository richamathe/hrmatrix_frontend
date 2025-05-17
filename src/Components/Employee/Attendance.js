import { useState, useEffect } from 'react';
import {
  Calendar, Clock, ArrowRight, CheckCircle, XCircle,
  Calendar as CalendarIcon, AlertCircle, FileText,
  BarChart2, User
} from 'lucide-react';
import {
  Button, Card, Row, Col, Table, Badge, Form,
  Modal, Alert, Tabs, Tab, Spinner, Container
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { attendanceService } from '../../services/attendanceService';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import themeColors from '../../theme/colors';
import { leaveService } from '../../services/leaveService';

// Add font family and theme styles
const fontStyles = {
  fontFamily: "'Open Sans', sans-serif",
  color: '#000'
};

const Attendance = () => {
  const user = useSelector((state) => state.auth.user);
  const employeeId = user?.id || '1'; // Default to '1' for testing

  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState({ status: 'pending', checkIn: '', checkOut: '' });
  const [activeTab, setActiveTab] = useState('daily');

  // Leave request modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveFormData, setLeaveFormData] = useState({
    from_date: '',
    to_date: '',
    reason: '',
    type: 'Casual Leave'
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Load attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);

        // Get attendance records
        const response = await attendanceService.getEmployeeAttendance();
        const records = response.data.records;
        setAttendanceData(records);

        // Find today's attendance
        const todayRecord = records.find(record => record.date === today);
        if (todayRecord) {
          setTodayAttendance({
            status: todayRecord.status,
            checkIn: todayRecord.checkIn ? attendanceService.formatTimeForDisplay(todayRecord.checkIn) : '',
            checkOut: todayRecord.checkOut ? attendanceService.formatTimeForDisplay(todayRecord.checkOut) : ''
          });
        }

        // Get leave requests (from leaveService)
        const leaveResponse = await leaveService.getMyLeaves();
        setLeaveRequests(leaveResponse.data.leaves);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error('Failed to load attendance data');
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [today]);

  // Calculate attendance stats
  const presentDays = attendanceData.filter(day => day.status === 'Present').length;
  const totalWorkdays = attendanceData.filter(day => day.status !== 'Weekend').length;
  const attendancePercentage = totalWorkdays > 0 ? Math.round((presentDays / totalWorkdays) * 100) : 0;

  // Calculate weekly working hours
  const calculateWeeklyWorkingHours = () => {
    // Get current week's dates
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // Start from Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday
    endOfWeek.setHours(23, 59, 59, 999);

    // Filter records for current week
    const weeklyRecords = attendanceData.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startOfWeek && recordDate <= endOfWeek;
    });

    // Calculate total working hours
    let totalMinutes = 0;

    weeklyRecords.forEach(record => {
      if (record.checkIn && record.checkOut) {
        const workingHoursData = attendanceService.calculateWorkingHours(record.checkIn, record.checkOut);
        if (workingHoursData) {
          totalMinutes += (workingHoursData.hours * 60) + workingHoursData.minutes;
        }
      }
    });

    // Convert to hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      hours,
      minutes,
      formatted: `${hours}h ${minutes}m`,
      totalHours: parseFloat((totalMinutes / 60).toFixed(1))
    };
  };

  const weeklyWorkingHours = calculateWeeklyWorkingHours();

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      const response = await attendanceService.checkIn();
      const record = response.data.record;

      // Update today's attendance
      setTodayAttendance({
        status: record.status,
        checkIn: attendanceService.formatTimeForDisplay(record.checkIn),
        checkOut: ''
      });

      // Update attendance data
      setAttendanceData(prev => {
        const index = prev.findIndex(item => item.date === today);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = record;
          return updated;
        } else {
          return [...prev, record];
        }
      });

      toast.success('Check-in recorded successfully!');
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error(error.message || 'Failed to record check-in');
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    try {
      const response = await attendanceService.checkOut();
      const record = response.data.record;

      // Update today's attendance
      setTodayAttendance(prev => ({
        ...prev,
        checkOut: attendanceService.formatTimeForDisplay(record.checkOut)
      }));

      // Update attendance data
      setAttendanceData(prev => {
        const index = prev.findIndex(item => item.date === today);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = record;
          return updated;
        }
        return prev;
      });

      toast.success('Check-out recorded successfully!');
    } catch (error) {
      console.error('Check-out error:', error);
      toast.error(error.message || 'Failed to record check-out');
    }
  };

  // Handle leave request form change
  const handleLeaveFormChange = (e) => {
    const { name, value } = e.target;
    setLeaveFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit leave request
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    try {
      const leaveData = {
        type: leaveFormData.type,
        from_date: leaveFormData.from_date,
        to_date: leaveFormData.to_date,
        reason: leaveFormData.reason
      };

      const response = await leaveService.requestLeave(leaveData);

      // Add to leave requests
      setLeaveRequests(prev => [...prev, response.data.leave]);

      // Reset form and close modal
      setLeaveFormData({
        from_date: '',
        to_date: '',
        reason: '',
        type: 'Casual Leave'
      });
      setShowLeaveModal(false);

      toast.success('Leave request submitted successfully!');
    } catch (error) {
      console.error('Leave request error:', error);
      toast.error(error.message || 'Failed to submit leave request');
    }
  };

  // Prepare calendar data for react-calendar
  const [calendarValue, setCalendarValue] = useState(new Date());

  // Function to get attendance status for a specific date
  const getAttendanceStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const record = attendanceData.find(r => r.date === dateStr);

    if (record) {
      return record.status;
    }

    // Check if date is in any leave request
    for (const leave of leaveRequests) {
      const fromDate = new Date(leave.from_date);
      const toDate = new Date(leave.to_date);

      if (date >= fromDate && date <= toDate) {
        return `Leave (${leave.status})`;
      }
    }

    return null;
  };

  // Custom tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const status = getAttendanceStatus(date);
    if (!status) return null;

    let badgeClass = '';
    switch (status) {
      case 'Present':
        badgeClass = 'bg-success';
        break;
      case 'Absent':
        badgeClass = 'bg-danger';
        break;
      case 'Late':
        badgeClass = 'bg-warning';
        break;
      case 'Leave (Approved)':
        badgeClass = 'bg-secondary';
        break;
      case 'Leave (Pending)':
        badgeClass = 'bg-info';
        break;
      default:
        badgeClass = 'bg-primary';
    }

    return (
      <div className="position-absolute bottom-0 start-0 end-0">
        <div className={`${badgeClass} text-white small py-0 px-1 text-center`} style={{ fontSize: '9px' }}>
          {status}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" style={{ color: themeColors.primary }} />
      </div>
    );
  }

  return (
    <Container fluid className="px-0" style={fontStyles}>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{
          color: themeColors.primary,
          padding: '5px 0',
          fontWeight: 600
        }}>Attendance Management</h2>
        <Button
          variant="primary"
          onClick={() => setShowLeaveModal(true)}
          className="d-flex align-items-center rounded-pill px-4 py-2"
          style={{
            background: 'white',
            border: `1px solid ${themeColors.secondary}`,
            color: themeColors.secondary,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            fontWeight: 500
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = themeColors.secondary;
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = themeColors.secondary;
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
          }}
        >
          <FileText size={16} className="me-2" />
          Apply for Leave
        </Button>
      </div>

      {/* Today's Attendance Section */}
      <Row className="g-4 mb-4 flex-wrap">
        <Col xs={12} md={6}>
          <Card className="shadow-sm h-100 border-0" style={{ borderRadius: '12px', background: themeColors.lightBg }}>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
              <h5 className="fw-bold mb-3" style={{ color: themeColors.primary }}>
                Daily Attendance
              </h5>
              <div className="d-flex align-items-center mb-2">
                <Clock color={themeColors.secondary} size={22} className="me-2" />
                <span className="fw-bold" style={{ fontSize: '1.1rem' }}>Check In</span>
              </div>
              <div className="display-6 fw-semibold mb-2" style={{ color: todayAttendance.checkIn ? '#28a745' : '#6c757d' }}>
                {todayAttendance.checkIn ? todayAttendance.checkIn : '--:--'}
              </div>
              <Button
                variant={todayAttendance.checkIn ? 'outline-success' : 'primary'}
                onClick={handleCheckIn}
                disabled={!!todayAttendance.checkIn}
                className="rounded-pill px-4 mt-2"
                style={{ minWidth: 120, fontSize: '1.1rem', fontWeight: 600 }}
              >
                {todayAttendance.checkIn ? 'Checked In' : 'Check In'}
              </Button>
              <div className="mt-2 text-danger small" style={{ minHeight: 24 }}>
                {!todayAttendance.checkIn && new Date().getHours() >= 11 && 'Check-in not allowed after 11:00 AM.'}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="shadow-sm h-100 border-0" style={{ borderRadius: '12px', background: themeColors.lightBg }}>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
              <h5 className="fw-bold mb-3" style={{ color: themeColors.primary }}>
                Daily Attendance
              </h5>
              <div className="d-flex align-items-center mb-2">
                <Clock color={themeColors.secondary} size={22} className="me-2" />
                <span className="fw-bold" style={{ fontSize: '1.1rem' }}>Check Out</span>
              </div>
              <div className="display-6 fw-semibold mb-2" style={{ color: todayAttendance.checkOut ? '#dc3545' : '#6c757d' }}>
                {todayAttendance.checkOut ? todayAttendance.checkOut : '--:--'}
              </div>
              <Button
                variant={todayAttendance.checkOut ? 'outline-danger' : 'primary'}
                onClick={handleCheckOut}
                disabled={!todayAttendance.checkIn || !!todayAttendance.checkOut}
                className="rounded-pill px-4 mt-2"
                style={{ minWidth: 120, fontSize: '1.1rem', fontWeight: 600 }}
              >
                {todayAttendance.checkOut ? 'Checked Out' : 'Check Out'}
              </Button>
              <div className="mt-2 text-muted small" style={{ minHeight: 24 }}>
                {!todayAttendance.checkIn && 'Check in first to enable check out.'}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Responsive Attendance Table */}
      <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Card.Header className="bg-light border-0">
          <h5 className="mb-0 fw-bold" style={{ color: themeColors.primary }}>Daily Attendance Records</h5>
        </Card.Header>
        <div className="table-responsive" style={{ minHeight: 200 }}>
          <Table hover className="align-middle mb-0" style={{ fontSize: '0.97rem' }}>
            <thead className="sticky-top" style={{ background: themeColors.lightBg, top: 0, zIndex: 1 }}>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((record, index) => {
                  let workingHours = '';
                  if (record.checkIn && record.checkOut) {
                    const workingHoursData = attendanceService.calculateWorkingHours(record.checkIn, record.checkOut);
                    workingHours = workingHoursData ? workingHoursData.formatted : '-';
                  }
                  const date = new Date(record.date);
                  const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const isToday = record.date === today;
                  return (
                    <tr key={index} className={isToday ? 'table-primary' : ''}>
                      <td>{displayDate}</td>
                      <td>{dayName}</td>
                      <td>
                        {record.status === 'Present' && <Badge bg="success">Present</Badge>}
                        {record.status === 'Absent' && <Badge bg="danger">Absent</Badge>}
                        {record.status === 'Late' && <Badge bg="warning">Late</Badge>}
                        {record.status === 'Leave' && <Badge bg="secondary">Leave</Badge>}
                        {record.status === 'Weekend' && <Badge bg="info">Weekend</Badge>}
                        {record.status === 'Pending' && <Badge bg="primary">Pending</Badge>}
                      </td>
                      <td>{record.checkIn ? attendanceService.formatTimeForDisplay(record.checkIn) : '-'}</td>
                      <td>{record.checkOut ? attendanceService.formatTimeForDisplay(record.checkOut) : '-'}</td>
                      <td>{workingHours || '-'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No attendance records found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Attendance Stats */}
      <Row className="g-4 mb-4">
        <Col lg={4} md={6} sm={12}>
          <Card className="shadow-sm h-100" style={{
            borderRadius: '8px',
            border: 'none',
            background: 'white',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}>
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded p-2 p-sm-3 me-2 me-sm-3" style={{
                  background: themeColors.light,
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                  <User color={themeColors.secondary} size={20} />
                </div>
                <h5 className="card-title mb-0" style={{ fontWeight: 500 }}>Present Days</h5>
              </div>
              <div className="text-center mt-3">
                <h3 className="mb-1" style={{
                  color: themeColors.primary,
                  fontWeight: 600
                }}>{presentDays}</h3>
                <p className="mb-0" style={{ color: '#333' }}>Out of <span className="fw-medium">{totalWorkdays}</span> working days</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12}>
          <Card className="shadow-sm h-100" style={{
            borderRadius: '8px',
            border: 'none',
            background: 'white',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}>
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded p-2 p-sm-3 me-2 me-sm-3" style={{
                  background: themeColors.light,
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                  <BarChart2 color={themeColors.secondary} size={20} />
                </div>
                <h5 className="card-title mb-0" style={{ fontWeight: 500 }}>Attendance Rate</h5>
              </div>
              <div className="text-center mt-3">
                <h3 className="mb-1" style={{
                  color: themeColors.primary,
                  fontWeight: 600
                }}>{attendancePercentage}%</h3>
                <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${attendancePercentage}%`,
                      background: themeColors.secondary,
                      borderRadius: '4px'
                    }}
                    aria-valuenow={attendancePercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12}>
          <Card className="shadow-sm h-100" style={{
            borderRadius: '8px',
            border: 'none',
            background: 'white',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}>
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded p-2 p-sm-3 me-2 me-sm-3" style={{
                  background: themeColors.light,
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                  <Clock color={themeColors.secondary} size={20} />
                </div>
                <h5 className="card-title mb-0" style={{ fontWeight: 500 }}>Weekly Hours</h5>
              </div>
              <div className="text-center mt-3">
                <h3 className="mb-1" style={{
                  color: themeColors.primary,
                  fontWeight: 600
                }}>{weeklyWorkingHours.totalHours}</h3>
                <p className="mb-0" style={{ color: '#333' }}>This week: <span className="fw-medium">{weeklyWorkingHours.formatted}</span></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Attendance Records Tabs */}
      <Card className="shadow-sm mb-4" style={{
        borderRadius: '8px',
        border: 'none',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}>
        <div style={{ height: '4px', background: themeColors.secondary }}></div>
        <Card.Body className="p-3 p-sm-4">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
            style={{
              borderBottom: `1px solid ${themeColors.border}`,
              gap: '10px',
              display: 'flex'
            }}
            variant="pills"
          >
            <Tab eventKey="daily" title={
              <div className="d-flex align-items-center px-3 py-2" style={{
                background: activeTab === 'daily' ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}>
                <CalendarIcon size={16} className="me-2" style={{
                  color: activeTab === 'daily' ? '#3498db' : '#95a5a6',
                  transition: 'color 0.2s ease'
                }} />
                <span style={{
                  color: activeTab === 'daily' ? '#2c3e50' : '#7f8c8d',
                  fontWeight: activeTab === 'daily' ? 600 : 400,
                  transition: 'all 0.2s ease'
                }}>Daily View</span>
              </div>
            }>
              <div className="table-responsive">
                <Table hover style={{ color: '#333', fontSize: '0.95rem' }} className="align-middle">
                  <thead style={{ background: themeColors.lightBg }}>
                    <tr>
                      <th style={{ fontWeight: 500 }}>Date</th>
                      <th style={{ fontWeight: 500 }}>Day</th>
                      <th style={{ fontWeight: 500 }}>Status</th>
                      <th style={{ fontWeight: 500 }}>Check In</th>
                      <th style={{ fontWeight: 500 }}>Check Out</th>
                      <th style={{ fontWeight: 500 }}>Working Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.length > 0 ? (
                      attendanceData.map((record, index) => {
                        // Calculate working hours
                        let workingHours = '';
                        if (record.checkIn && record.checkOut) {
                          const workingHoursData = attendanceService.calculateWorkingHours(record.checkIn, record.checkOut);
                          workingHours = workingHoursData ? workingHoursData.formatted : '-';
                        }

                        // Format date for display
                        const date = new Date(record.date);
                        const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                        // Check if this is today's record
                        const isToday = record.date === today;

                        return (
                          <tr key={index} className={isToday ? 'table-primary' : ''}>
                            <td>{displayDate}</td>
                            <td>{dayName}</td>
                            <td>
                              {record.status === 'Present' && (
                                <Badge bg="success">Present</Badge>
                              )}
                              {record.status === 'Absent' && (
                                <Badge bg="danger">Absent</Badge>
                              )}
                              {record.status === 'Late' && (
                                <Badge bg="warning">Late</Badge>
                              )}
                              {record.status === 'Leave' && (
                                <Badge bg="secondary">Leave</Badge>
                              )}
                              {record.status === 'Weekend' && (
                                <Badge bg="info">Weekend</Badge>
                              )}
                              {record.status === 'Pending' && (
                                <Badge bg="primary">Pending</Badge>
                              )}
                            </td>
                            <td>{record.checkIn ? attendanceService.formatTimeForDisplay(record.checkIn) : '-'}</td>
                            <td>{record.checkOut ? attendanceService.formatTimeForDisplay(record.checkOut) : '-'}</td>
                            <td>{workingHours || '-'}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No attendance records found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>
            <Tab eventKey="calendar" title={
              <div className="d-flex align-items-center px-3 py-2" style={{
                background: activeTab === 'calendar' ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}>
                <Calendar size={16} className="me-2" style={{
                  color: activeTab === 'calendar' ? '#3498db' : '#95a5a6',
                  transition: 'color 0.2s ease'
                }} />
                <span style={{
                  color: activeTab === 'calendar' ? '#2c3e50' : '#7f8c8d',
                  fontWeight: activeTab === 'calendar' ? 600 : 400,
                  transition: 'all 0.2s ease'
                }}>Calendar View</span>
              </div>
            }>
              <div className="p-3">
                <div className="mb-3">
                  <Alert variant="info" style={{
                    background: 'rgba(13, 202, 240, 0.1)',
                    borderColor: 'rgba(13, 202, 240, 0.2)',
                    borderRadius: '10px'
                  }}>
                    <div className="d-flex align-items-center">
                      <AlertCircle size={16} className="me-2 text-info" />
                      <small style={{ color: '#333' }}>The calendar shows your attendance status for each day. Click on a date to see details.</small>
                    </div>
                  </Alert>
                </div>
                <div className="d-flex justify-content-center">
                  <div style={{ maxWidth: '100%' }}>
                    <ReactCalendar
                      className="border-0 shadow-sm"
                      style={{ borderRadius: '16px' }}
                      onChange={setCalendarValue}
                      value={calendarValue}
                      tileContent={tileContent}
                      tileClassName={({ date, view }) => {
                        if (view === 'month') {
                          // Highlight today
                          const today = new Date();
                          if (date.getDate() === today.getDate() &&
                              date.getMonth() === today.getMonth() &&
                              date.getFullYear() === today.getFullYear()) {
                            return 'bg-light';
                          }
                        }
                        return null;
                      }}
                      onClickDay={(value) => {
                        const dateStr = value.toISOString().split('T')[0];
                        const record = attendanceData.find(r => r.date === dateStr);

                        if (record) {
                          const checkIn = record.checkIn ? attendanceService.formatTimeForDisplay(record.checkIn) : '--:--';
                          const checkOut = record.checkOut ? attendanceService.formatTimeForDisplay(record.checkOut) : '--:--';

                          // Calculate working hours
                          let workingHours = '--:--';
                          if (record.checkIn && record.checkOut) {
                            const workingHoursData = attendanceService.calculateWorkingHours(record.checkIn, record.checkOut);
                            workingHours = workingHoursData ? workingHoursData.formatted : '--:--';
                          }

                          toast.info(
                            <div>
                              <p className="mb-1"><strong>Date:</strong> {new Date(dateStr).toLocaleDateString()}</p>
                              <p className="mb-1"><strong>Status:</strong> {record.status}</p>
                              <p className="mb-1"><strong>Check In:</strong> {checkIn}</p>
                              <p className="mb-1"><strong>Check Out:</strong> {checkOut}</p>
                              <p className="mb-0"><strong>Working Hours:</strong> {workingHours}</p>
                            </div>,
                            { autoClose: 5000 }
                          );
                        } else {
                          // Check if date is in any leave request
                          for (const leave of leaveRequests) {
                            const fromDate = new Date(leave.from_date);
                            const toDate = new Date(leave.to_date);

                            if (value >= fromDate && value <= toDate) {
                              toast.info(
                                <div>
                                  <p className="mb-1"><strong>Date:</strong> {value.toLocaleDateString()}</p>
                                  <p className="mb-1"><strong>Status:</strong> Leave ({leave.status})</p>
                                  <p className="mb-0"><strong>Reason:</strong> {leave.reason}</p>
                                </div>,
                                { autoClose: 5000 }
                              );
                              return;
                            }
                          }

                          toast.info(`No attendance record for ${value.toLocaleDateString()}`);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="leave" title={
              <div className="d-flex align-items-center px-3 py-2" style={{
                background: activeTab === 'leave' ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}>
                <FileText size={16} className="me-2" style={{
                  color: activeTab === 'leave' ? '#3498db' : '#95a5a6',
                  transition: 'color 0.2s ease'
                }} />
                <span style={{
                  color: activeTab === 'leave' ? '#2c3e50' : '#7f8c8d',
                  fontWeight: activeTab === 'leave' ? 600 : 400,
                  transition: 'all 0.2s ease'
                }}>Leave Requests</span>
              </div>
            }>
              <div className="table-responsive">
                <Table hover style={{ color: '#333' }}>
                  <thead style={{ background: themeColors.lightBg }}>
                    <tr>
                      <th style={{ fontWeight: 500 }}>From Date</th>
                      <th style={{ fontWeight: 500 }}>To Date</th>
                      <th style={{ fontWeight: 500 }}>Days</th>
                      <th style={{ fontWeight: 500 }}>Type</th>
                      <th style={{ fontWeight: 500 }}>Reason</th>
                      <th style={{ fontWeight: 500 }}>Applied On</th>
                      <th style={{ fontWeight: 500 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.length > 0 ? (
                      leaveRequests.map((leave, index) => {
                        // Calculate number of days
                        const fromDate = new Date(leave.from_date);
                        const toDate = new Date(leave.to_date);
                        const diffTime = Math.abs(toDate - fromDate);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                        return (
                          <tr key={index}>
                            <td>{new Date(leave.from_date).toLocaleDateString()}</td>
                            <td>{new Date(leave.to_date).toLocaleDateString()}</td>
                            <td>{diffDays}</td>
                            <td>{leave.type || 'Casual Leave'}</td>
                            <td>{leave.reason}</td>
                            <td>{new Date(leave.applied_on).toLocaleDateString()}</td>
                            <td>
                              {leave.status === 'Pending' && (
                                <Badge bg="warning">Pending</Badge>
                              )}
                              {leave.status === 'Approved' && (
                                <Badge bg="success">Approved</Badge>
                              )}
                              {leave.status === 'Rejected' && (
                                <Badge bg="danger">Rejected</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">No leave requests found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Leave Request Modal */}
      <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: `1px solid ${themeColors.border}` }}>
          <Modal.Title style={{ color: themeColors.darkText, fontWeight: 600 }}>Apply for Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLeaveSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select
                name="type"
                value={leaveFormData.type}
                onChange={handleLeaveFormChange}
                required
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="from_date"
                    value={leaveFormData.from_date}
                    onChange={handleLeaveFormChange}
                    min={today}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="to_date"
                    value={leaveFormData.to_date}
                    onChange={handleLeaveFormChange}
                    min={leaveFormData.from_date || today}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={leaveFormData.reason}
                onChange={handleLeaveFormChange}
                placeholder="Please provide a reason for your leave"
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="light"
                className="me-2 rounded-pill px-3"
                onClick={() => setShowLeaveModal(false)}
                style={{
                  background: 'white',
                  border: '1px solid #dee2e6',
                  color: '#6c757d',
                  fontWeight: 500
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="rounded-pill px-3"
                style={{
                  background: 'white',
                  border: `1px solid ${themeColors.secondary}`,
                  color: themeColors.secondary,
                  boxShadow: 'none',
                  fontWeight: 500
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = themeColors.secondary;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = themeColors.secondary;
                }}
              >
                Submit Request
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Attendance;
