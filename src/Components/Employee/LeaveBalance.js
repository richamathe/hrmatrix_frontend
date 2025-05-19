import React, { useState, useEffect } from 'react';
import {
  Calendar, PlusCircle, Info, AlertCircle, CheckCircle, XCircle,
  Clock, ChevronRight, HelpCircle, Bell
} from 'lucide-react';
import {
  Button, Card, Row, Col, Table, Badge, Form,
  Modal, Alert, Tabs, Tab, Spinner, ProgressBar,
  OverlayTrigger, Tooltip, ListGroup
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { leaveService } from '../../services/leaveService';
import notificationService from '../../services/notificationService';
import { Link } from 'react-router-dom';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

const LeaveBalance = () => {
  const user = useSelector((state) => state.auth.user);
  const employeeId = user?.id || '1'; // Default to '1' for testing

  const [loading, setLoading] = useState(true);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [leaveNotifications, setLeaveNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // State for leave request form
  const [leaveRequest, setLeaveRequest] = useState({
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  // Load leave data
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        setLoading(true);

        // Get leave balances
        const balancesResponse = await leaveService.getLeaveBalances(employeeId);
        setLeaveBalances(balancesResponse.data.balances);

        // Get leave requests
        const requestsResponse = await leaveService.getLeaveRequests(employeeId);
        setLeaveRequests(requestsResponse.data.requests);

        // Get holidays
        const holidaysResponse = await leaveService.getHolidays();
        setHolidays(holidaysResponse.data.holidays);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching leave data:', error);
        toast.error('Failed to load leave data');
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [employeeId]);

  // Load leave notifications and subscribe to updates
  useEffect(() => {
    const fetchLeaveNotifications = async () => {
      try {
        // Get all notifications for the employee
        const notifications = await notificationService.getNotifications(employeeId);

        // Filter for leave-related notifications
        const leaveRelated = notifications.filter(
          notification => notification.type === 'leave'
        );

        setLeaveNotifications(leaveRelated);
      } catch (error) {
        console.error('Error fetching leave notifications:', error);
      }
    };

    fetchLeaveNotifications();

    // Subscribe to new notifications
    const unsubscribe = notificationService.subscribe((newNotification) => {
      if (newNotification.employeeId === employeeId && newNotification.type === 'leave') {
        // Add the new notification to the list
        setLeaveNotifications(prev => [newNotification, ...prev]);

        // Show toast notification for leave status updates
        if (newNotification.title.includes('Approved') || newNotification.title.includes('Rejected')) {
          toast.info(
            <div>
              <strong>{newNotification.title}</strong>
              <p>{newNotification.message}</p>
            </div>,
            { autoClose: 7000 }
          );

          // Refresh leave requests to get the updated status
          leaveService.getLeaveRequests(employeeId)
            .then(response => {
              setLeaveRequests(response.data.requests);
            })
            .catch(error => {
              console.error('Error refreshing leave requests:', error);
            });
        }
      }
    });

    return () => unsubscribe();
  }, [employeeId]);

  // Handle input change for leave request form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveRequest(prev => ({ ...prev, [name]: value }));

    // Calculate days if both dates are set
    if ((name === 'fromDate' || name === 'toDate') && leaveRequest.fromDate && leaveRequest.toDate) {
      const fromDate = name === 'fromDate' ? value : leaveRequest.fromDate;
      const toDate = name === 'toDate' ? value : leaveRequest.toDate;

      // Ensure fromDate is not after toDate
      if (new Date(fromDate) > new Date(toDate)) {
        if (name === 'fromDate') {
          setLeaveRequest(prev => ({ ...prev, toDate: value }));
        } else {
          setLeaveRequest(prev => ({ ...prev, fromDate: value }));
        }
      }
    }
  };

  // Submit leave request
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Calculate days
      const fromDate = new Date(leaveRequest.fromDate);
      const toDate = new Date(leaveRequest.toDate);
      const diffTime = Math.abs(toDate - fromDate);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Prepare request data
      const requestData = {
        employeeId,
        employeeName: user?.name || 'Employee',
        department: user?.department || 'Department',
        leaveType: leaveRequest.leaveType,
        fromDate: leaveRequest.fromDate,
        toDate: leaveRequest.toDate,
        days,
        reason: leaveRequest.reason
      };

      // Submit request
      const response = await leaveService.submitLeaveRequest(requestData);

      // Add to leave requests
      setLeaveRequests(prev => [response.data.request, ...prev]);

      // Reset form and close modal
      setLeaveRequest({
        leaveType: 'Casual Leave',
        fromDate: '',
        toDate: '',
        reason: ''
      });
      setShowRequestForm(false);

      // Show success notification
      toast.success('Leave request submitted successfully!');

      // Create a notification for the employee
      await notificationService.addNotification({
        employeeId,
        type: 'leave',
        title: 'Leave Request Submitted',
        message: `Your ${requestData.leaveType} request for ${formatDate(requestData.fromDate)} to ${formatDate(requestData.toDate)} has been submitted and is pending approval.`
      });

      // Refresh leave requests to ensure we have the latest data
      try {
        const refreshedRequests = await leaveService.getLeaveRequests(employeeId);
        setLeaveRequests(refreshedRequests.data.requests);
      } catch (refreshError) {
        console.error('Error refreshing leave requests:', refreshError);
        // Continue even if refresh fails
      }
    } catch (error) {
      console.error('Leave request error:', error);
      toast.error(error.message || 'Failed to submit leave request');
    }
  };

  // Prepare data for pie chart
  const preparePieChartData = (leaveType) => {
    const balance = leaveBalances[leaveType];
    if (!balance) return null;

    return {
      labels: ['Used', 'Remaining'],
      datasets: [
        {
          data: [balance.used, balance.remaining],
          backgroundColor: ['#dc3545', '#6a11cb'],
          borderColor: ['#dc3545', '#6a11cb'],
          borderWidth: 1,
        },
      ],
    };
  };

  // Get leave status for a specific date
  const getDateLeaveStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];

    // Check if date is in any approved leave request
    for (const leave of leaveRequests) {
      if (leave.status !== 'Approved') continue;

      const fromDate = new Date(leave.fromDate);
      const toDate = new Date(leave.toDate);

      if (date >= fromDate && date <= toDate) {
        return { type: 'leave', leave };
      }
    }

    // Check if date is a holiday
    const holiday = holidays.find(h => h.date === dateStr);
    if (holiday) {
      return { type: 'holiday', holiday };
    }

    return null;
  };

  // Custom tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const status = getDateLeaveStatus(date);
    if (!status) return null;

    let badgeClass = '';
    let title = '';

    if (status.type === 'leave') {
      badgeClass = 'bg-success';
      title = `Leave: ${status.leave.leaveType}`;
    } else if (status.type === 'holiday') {
      badgeClass = 'bg-info';
      title = `Holiday: ${status.holiday.name}`;
    }

    return (
      <div className="position-absolute bottom-0 start-0 end-0">
        <div className={`${badgeClass} text-white small py-0 px-1 text-center`} style={{ fontSize: '9px' }}>
          {title}
        </div>
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get upcoming approved leaves
  const upcomingLeaves = leaveRequests
    .filter(leave => leave.status === 'Approved' && new Date(leave.fromDate) >= new Date())
    .sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))
    .slice(0, 3);

  // Get upcoming holidays
  const upcomingHolidays = holidays
    .filter(holiday => new Date(holiday.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 ">Leave Management</h2>
        <div className="d-flex">
          <Button
            variant="outline-primary"
            className="d-flex align-items-center me-2"
            onClick={() => setShowNotifications(true)}
            style={{ borderColor: '#6a11cb', color: '#6a11cb' }}
          >
            <Bell size={18} className="me-2" />
            <span className="d-none d-md-inline">Notifications</span>
            {leaveNotifications.filter(n => !n.read).length > 0 && (
              <Badge
                bg="danger"
                pill
                className="ms-2"
              >
                {leaveNotifications.filter(n => !n.read).length}
              </Badge>
            )}
          </Button>
          <Button
            variant="primary"
            className="d-flex align-items-center"
            onClick={() => setShowRequestForm(true)}
            style={{ background: 'linear-gradient(135deg, #6a11cb, #2575fc)', border: 'none' }}
          >
            <PlusCircle size={18} className="me-2" />
            Apply for Leave
          </Button>
        </div>
      </div>

      {/* Leave Balance Cards */}
      <Row className="g-4 mb-4">
        {Object.entries(leaveBalances).map(([type, balance]) => (
          <Col md={6} lg={3} key={type}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title text-capitalize mb-0">
                    {type.replace(/([A-Z])/g, ' $1').trim()} Leave
                  </h5>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {type === 'casual' && 'For personal matters and emergencies'}
                        {type === 'sick' && 'For health-related absences'}
                        {type === 'earned' && 'Accumulated based on service duration'}
                        {type === 'paternity' && 'For new fathers'}
                        {type === 'maternity' && 'For expectant and new mothers'}
                      </Tooltip>
                    }
                  >
                    <HelpCircle size={16} className="text-muted" />
                  </OverlayTrigger>
                </div>

                <div className="d-flex justify-content-between align-items-end mb-2">
                  <div>
                    <p className="text-muted mb-0 small">Remaining</p>
                    <h3 className="fw-bold mb-0" style={{ color: '#6a11cb' }}>{balance.remaining}</h3>
                  </div>
                  <div className="text-end">
                    <p className="text-muted mb-0 small">Used: {balance.used}</p>
                    <p className="text-muted mb-0 small">Total: {balance.total}</p>
                  </div>
                </div>

                <ProgressBar
                  now={(balance.used / balance.total) * 100}
                  variant={balance.remaining > 3 ? "primary" : "warning"}
                  className="mt-2"
                  style={{
                    '--bs-progress-bar-bg': balance.remaining > 3 ? '#6a11cb' : '#ffc107'
                  }}
                />

                <div className="mt-3" style={{ height: '100px' }}>
                  <Pie
                    data={preparePieChartData(type)}
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { boxWidth: 10, padding: 10 }
                        }
                      },
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          {/* Leave History and Calendar Tabs */}
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="history" title="Leave History">
                  <div className="table-responsive">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Type</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Days</th>
                          <th>Reason</th>
                          <th>Status</th>
                          <th>Applied On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveRequests.length > 0 ? (
                          leaveRequests.map((leave, index) => (
                            <tr key={leave.id || index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Calendar size={16} className="me-2 text-primary" />
                                  {leave.leaveType}
                                </div>
                              </td>
                              <td>{formatDate(leave.fromDate)}</td>
                              <td>{formatDate(leave.toDate)}</td>
                              <td>{leave.days}</td>
                              <td>{leave.reason}</td>
                              <td>
                                {leave.status === 'Approved' && (
                                  <Badge bg="success">Approved</Badge>
                                )}
                                {leave.status === 'Pending' && (
                                  <Badge bg="warning">Pending</Badge>
                                )}
                                {leave.status === 'Rejected' && (
                                  <Badge bg="danger">Rejected</Badge>
                                )}
                              </td>
                              <td>{formatDate(leave.appliedOn)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">No leave history found</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
                <Tab eventKey="calendar" title="Calendar View">
                  <div className="p-3">
                    <Alert variant="info" className="mb-3">
                      <small>The calendar shows your approved leaves and holidays. Click on a date to see details.</small>
                    </Alert>
                    <div className="d-flex justify-content-center">
                      <ReactCalendar
                        onChange={setCalendarDate}
                        value={calendarDate}
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
                          const status = getDateLeaveStatus(value);

                          if (status) {
                            if (status.type === 'leave') {
                              toast.info(
                                <div>
                                  <p className="mb-1"><strong>Date:</strong> {formatDate(value)}</p>
                                  <p className="mb-1"><strong>Leave Type:</strong> {status.leave.leaveType}</p>
                                  <p className="mb-1"><strong>Reason:</strong> {status.leave.reason}</p>
                                  <p className="mb-0"><strong>Status:</strong> {status.leave.status}</p>
                                </div>,
                                { autoClose: 5000 }
                              );
                            } else if (status.type === 'holiday') {
                              toast.info(
                                <div>
                                  <p className="mb-1"><strong>Date:</strong> {formatDate(value)}</p>
                                  <p className="mb-0"><strong>Holiday:</strong> {status.holiday.name}</p>
                                </div>,
                                { autoClose: 5000 }
                              );
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {/* Upcoming Leaves & Holidays */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Upcoming Leaves</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {upcomingLeaves.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {upcomingLeaves.map((leave, index) => (
                    <li key={index} className="list-group-item">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-success p-2 me-3">
                          <CheckCircle size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="mb-0 fw-medium">{leave.leaveType}</p>
                          <p className="mb-0 small text-muted">
                            {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 text-center text-muted">
                  No upcoming leaves
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Upcoming Holidays</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {upcomingHolidays.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {upcomingHolidays.map((holiday, index) => (
                    <li key={index} className="list-group-item">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-info p-2 me-3">
                          <Calendar size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="mb-0 fw-medium">{holiday.name}</p>
                          <p className="mb-0 small text-muted">{formatDate(holiday.date)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 text-center text-muted">
                  No upcoming holidays
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leave Request Modal */}
      <Modal show={showRequestForm} onHide={() => setShowRequestForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply for Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Leave Type</Form.Label>
                  <Form.Select
                    name="leaveType"
                    value={leaveRequest.leaveType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    type="text"
                    name="reason"
                    value={leaveRequest.reason}
                    onChange={handleInputChange}
                    placeholder="Reason for leave"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="fromDate"
                    value={leaveRequest.fromDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="toDate"
                    value={leaveRequest.toDate}
                    onChange={handleInputChange}
                    min={leaveRequest.fromDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {leaveRequest.fromDate && leaveRequest.toDate && (
              <Alert variant="info" className="mb-3">
                <div className="d-flex align-items-center">
                  <Info size={18} className="me-2" />
                  <div>
                    <p className="mb-0">
                      <strong>Duration:</strong> {
                        (() => {
                          const fromDate = new Date(leaveRequest.fromDate);
                          const toDate = new Date(leaveRequest.toDate);
                          const diffTime = Math.abs(toDate - fromDate);
                          const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                          return `${days} day${days > 1 ? 's' : ''}`;
                        })()
                      }
                    </p>
                  </div>
                </div>
              </Alert>
            )}

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowRequestForm(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit Request
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Leave Notifications Modal */}
      <Modal show={showNotifications} onHide={() => setShowNotifications(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Leave Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {leaveNotifications.length > 0 ? (
            <ListGroup variant="flush">
              {leaveNotifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className={`px-3 py-3 ${!notification.read ? 'bg-light' : ''}`}
                >
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      {notification.title.includes('Approved') ? (
                        <div className="rounded-circle bg-success p-2">
                          <CheckCircle size={18} className="text-white" />
                        </div>
                      ) : notification.title.includes('Rejected') ? (
                        <div className="rounded-circle bg-danger p-2">
                          <XCircle size={18} className="text-white" />
                        </div>
                      ) : (
                        <div className="rounded-circle bg-info p-2">
                          <Bell size={18} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className={`mb-0 ${!notification.read ? 'fw-bold' : ''}`}>
                          {notification.title}
                        </h6>
                        <small className="text-muted">
                          {new Date(notification.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                      <p className="mb-0">{notification.message}</p>
                      {!notification.read && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 mt-1 text-primary"
                          onClick={async () => {
                            try {
                              await notificationService.markAsRead(notification.id);
                              setLeaveNotifications(prev =>
                                prev.map(n => n.id === notification.id ? {...n, read: true} : n)
                              );
                            } catch (error) {
                              console.error('Error marking notification as read:', error);
                            }
                          }}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center py-4">
              <Bell size={40} className="text-muted mb-3" />
              <p className="mb-0">No leave notifications</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotifications(false)}>
            Close
          </Button>
          {leaveNotifications.some(n => !n.read) && (
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await notificationService.markAllAsRead(employeeId);
                  setLeaveNotifications(prev =>
                    prev.map(n => ({...n, read: true}))
                  );
                  toast.success('All notifications marked as read');
                } catch (error) {
                  console.error('Error marking all notifications as read:', error);
                  toast.error('Failed to mark notifications as read');
                }
              }}
            >
              Mark All as Read
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeaveBalance;
