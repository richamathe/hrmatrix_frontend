import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, Bell, User, ArrowRight, BarChart2
} from 'lucide-react';
import {
  Button, Card, Row, Col, Badge, Spinner, ListGroup, Container
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import notificationService from '../../services/notificationService';
import Calendar from '../Calendar';
import themeColors from '../../theme/colors';
import { leaveService } from '../../services/leaveService';

// Add font family styles
const fontStyles = {
  fontFamily: "'Open Sans', sans-serif",
  color: '#000'
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [leaveBalances, setLeaveBalances] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const employeeId = user?.id || '1'; // Default to '1' for demo purposes

  // Mock data
  const todayAttendance = {
    status: 'pending',
    checkIn: '09:30 AM',
    checkOut: ''
  };

  const attendancePercentage = 85;
  const presentDays = 17;
  const totalWorkdays = 20;

  // Fetch notifications
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [notificationsData, leaveBalanceData] = await Promise.all([
          notificationService.getNotifications(employeeId),
          leaveService.getMyLeaveBalance()
        ]);
        if (isMounted) {
          setNotifications(notificationsData.slice(0, 3));
          setUnreadCount(notificationsData.filter(n => !n.read).length);
          setLeaveBalances(leaveBalanceData.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLeaveBalances(null);
          setLoading(false);
        }
      }
    };
    fetchData();

    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((newNotification) => {
      if (newNotification.employeeId === employeeId) {
        setNotifications(prev => [newNotification, ...prev.slice(0, 2)]);
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [employeeId]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) {
        return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      return '';
    }
  };

  // Simplified check-in/out handlers
  const handleCheckIn = () => {
    console.log('Check-in clicked');
  };

  const handleCheckOut = () => {
    console.log('Check-out clicked');
  };

  if (loading || !leaveBalances) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" style={{ color: themeColors.secondary }} />
      </div>
    );
  }

  return (
    <Container fluid className="px-0" style={fontStyles}>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 ">
        <h2 className="fw-bold" style={{
          background: themeColors.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          padding: '5px 0',
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 500,
        }}>Employee Dashboard</h2>
        <div className="px-3 py-2 rounded-pill mt-3 mt-md-0" style={{
          background: themeColors.light,
          border: `1px solid ${themeColors.border}`
        }}>
          <span className="fw-medium" style={{ color: themeColors.primary }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Quick Actions Row */}
      <Row className="g-4 mb-4 flex-wrap">
        <Col xs={12} md={6}>
          <Card className="shadow-sm h-100 border-0" style={{ borderRadius: '16px', background: themeColors.lightBg }}>
            <Card.Body className="p-4 d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle p-3 me-3" style={{ background: themeColors.light, border: `1px solid ${themeColors.border}` }}>
                  <Clock className="text-primary" size={22} style={{ color: themeColors.primary }} />
                </div>
                <h5 className="card-title mb-0 fw-bold">Today's Attendance</h5>
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div className="mb-2 mb-md-0">
                  <p className="fw-semibold mb-0">
                    {todayAttendance.checkIn ? (
                      <span className="text-success fw-bold">Checked In: {todayAttendance.checkIn}</span>
                    ) : (
                      <span className="text-muted">Not Checked In</span>
                    )}
                    {todayAttendance.checkOut && (
                      <span className="ms-3 text-danger fw-bold">Checked Out: {todayAttendance.checkOut}</span>
                    )}
                  </p>
                </div>
                <div>
                  {!todayAttendance.checkIn ? (
                    <Button variant="primary" onClick={handleCheckIn} className="rounded-pill px-4 py-2">Check In</Button>
                  ) : !todayAttendance.checkOut ? (
                    <Button variant="danger" onClick={handleCheckOut} className="rounded-pill px-4 py-2">Check Out</Button>
                  ) : null}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="shadow-sm h-100 border-0" style={{ borderRadius: '16px', background: themeColors.lightBg }}>
            <Card.Body className="p-4 d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle p-3 me-3" style={{ background: themeColors.light, border: `1px solid ${themeColors.border}` }}>
                  <BarChart2 className="text-primary" size={22} style={{ color: themeColors.primary }} />
                </div>
                <h5 className="card-title mb-0 fw-bold">Leave Balances</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                {leaveBalances && Object.entries(leaveBalances).map(([type, balance]) => (
                  <div key={type} className="mb-2">
                    <span className="fw-bold text-capitalize">{type}:</span> <span className="fw-medium text-success">{balance.remaining}</span> / <span className="fw-medium">{balance.total}</span> days
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats and Calendar Row */}
      <Row className="g-4 mb-4">
        <Col lg={7} md={12}>
          {/* Stats Cards */}
          <Row className="g-4 mb-4">
            <Col lg={4} md={6} sm={12}>
              <Card className="shadow h-100" style={{
                borderRadius: '16px',
                border: 'none',
                // background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.03), rgba(52, 152, 219, 0.03))',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}>
                <Card.Body className="p-3 p-sm-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle p-2 p-sm-3 me-2 me-sm-3" style={{
                      background: themeColors.light,
                      border: `1px solid ${themeColors.border}`,
                      boxShadow: `0 2px 6px ${themeColors.border}`
                    }}>
                      <User className="text-primary" size={20} style={{ color: themeColors.primary }} />
                    </div>
                    <h5 className="card-title mb-0" style={{ fontWeight: 500 }}>Attendance</h5>
                  </div>
                  <div className="text-center mt-3">
                    <h3 className="mb-1" style={{
                      background: themeColors.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 500
                    }}>{attendancePercentage}%</h3>
                    <p className="mb-0" style={{ color: '#333' }}>Present: <span className="fw-medium">{presentDays} / {totalWorkdays}</span> days</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} sm={12}>
              <Card className="shadow h-100" style={{
                borderRadius: '16px',
                border: 'none',
                // background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.03), rgba(52, 152, 219, 0.03))',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}>
                <Card.Body className="p-3 p-sm-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle p-2 p-sm-3 me-2 me-sm-3" style={{
                      background: themeColors.light,
                      border: `1px solid ${themeColors.border}`,
                      boxShadow: `0 2px 6px ${themeColors.border}`
                    }}>
                      <CalendarIcon className="text-primary" size={20} style={{ color: themeColors.primary }} />
                    </div>
                    <h5 className="card-title mb-0" style={{ fontWeight: 500 }}>Leave Status</h5>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <div className="text-center px-1 px-sm-2">
                      <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          background: 'rgba(52, 152, 219, 0.15)',
                          border: `2px solid ${themeColors.secondary}`
                        }}>
                        <h3 className="mb-0" style={{ fontSize: '1rem', fontWeight: 500, color: themeColors.secondary }}>2</h3>
                      </div>
                      <p className="small mt-2 mb-0" style={{ color: themeColors.darkText }}>Approved</p>
                    </div>
                    <div className="text-center px-1 px-sm-2">
                      <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          background: 'rgba(52, 152, 219, 0.1)',
                          border: `2px solid ${themeColors.secondary}`
                        }}>
                        <h3 className="mb-0" style={{ fontSize: '1rem', fontWeight: 500, color: themeColors.secondary }}>1</h3>
                      </div>
                      <p className="small mt-2 mb-0" style={{ color: themeColors.darkText }}>Pending</p>
                    </div>
                    <div className="text-center px-1 px-sm-2">
                      <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          background: 'rgba(52, 152, 219, 0.05)',
                          border: `2px solid ${themeColors.secondary}`
                        }}>
                        <h3 className="mb-0" style={{ fontSize: '1rem', fontWeight: 500, color: themeColors.secondary }}>0</h3>
                      </div>
                      <p className="small mt-2 mb-0" style={{ color: themeColors.darkText }}>Rejected</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} sm={12}>
              <Card className="shadow h-100" style={{
                borderRadius: '16px',
                border: 'none',
                // background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.03), rgba(52, 152, 219, 0.03))',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}>
                <Card.Body className="p-3 p-sm-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle p-2 p-sm-3 me-2 me-sm-3" style={{
                      background: themeColors.light,
                      border: `1px solid ${themeColors.border}`,
                      boxShadow: `0 2px 6px ${themeColors.border}`
                    }}>
                      <BarChart2 className="text-primary" size={20} style={{ color: themeColors.primary }} />
                    </div>
                    <h5 className="card-title mb-0" style={{ fontWeight: 500 }}>Performance</h5>
                  </div>
                  <div className="text-center mt-3">
                    <h3 className="mb-1" style={{
                      background: themeColors.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 500
                    }}>92%</h3>
                    <p className="mb-0" style={{ color: '#333' }}>Last month: <span className="fw-medium">88%</span></p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Notifications Card */}
          <Card className="shadow mb-4" style={{
            borderRadius: '16px',
            border: 'none',
            overflow: 'hidden',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}>
            <div style={{ height: '8px', background: themeColors.gradient }}></div>
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center mb-2 mb-sm-0">
                  <div className="rounded-circle p-2 p-sm-3 me-2 me-sm-3" style={{
                    background: themeColors.light,
                    border: `1px solid ${themeColors.border}`,
                    boxShadow: `0 2px 6px ${themeColors.border}`
                  }}>
                    <Bell className="text-primary" size={20} style={{ color: themeColors.primary }} />
                  </div>
                  <h5 className="card-title mb-0" style={{ fontWeight: 500 }}>Notifications</h5>
                </div>
                <Link
                  to="/employee/notifications"
                  className="text-decoration-none d-flex align-items-center rounded-pill px-3 py-1"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  }}
                >
                  <small className="fw-medium">View all</small>
                  <ArrowRight size={16} className="ms-1" />
                </Link>
              </div>

              {notifications.length > 0 ? (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-pill px-3 py-1 me-2" style={{ background: themeColors.light }}>
                      <span className="fw-bold" style={{ color: themeColors.primary }}>{unreadCount}</span>
                    </div>
                    <p className="mb-0" style={{ color: '#333' }}>Unread notifications</p>
                  </div>

                  <ListGroup variant="flush" className="mt-3 notification-list">
                    {notifications.map((notification) => (
                      <ListGroup.Item
                        key={notification.id}
                        className={`px-3 py-3 mb-2 border-0 rounded-3 ${!notification.read ? 'bg-light' : ''}`}
                        style={{
                          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1 fw-medium" style={{ color: themeColors.primary }}>
                              {notification.title}
                            </p>
                            <p className="mb-0 text-truncate" style={{ maxWidth: '300px', color: '#333' }}>
                              {notification.message}
                            </p>
                          </div>
                          <span className="badge rounded-pill text-dark" style={{ background: 'rgba(108, 117, 125, 0.1)' }}>
                            {formatDate(notification.date)}
                          </span>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgba(52, 152, 219, 0.1)',
                      border: `2px solid ${themeColors.secondary}`
                    }}>
                    <h3 className="fw-bold mb-0" style={{ color: themeColors.secondary }}>0</h3>
                  </div>
                  <p className="mb-0" style={{ color: themeColors.darkText }}>No new notifications</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Calendar Column */}
        <Col lg={5} md={12}>
          <Card className="shadow h-100" style={{
            borderRadius: '16px',
            border: 'none',
            overflow: 'hidden',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}>
            <div style={{ height: '8px', background: themeColors.gradient }}></div>
            <Card.Body className="p-0">
              <Calendar />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
