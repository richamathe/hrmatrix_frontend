import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Table,
  ProgressBar
} from 'react-bootstrap';
import {
  Users,
  UserCheck,
  UserX,
  DollarSign,
  Calendar,
  BarChart2,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import themeColors from '../../theme/colors';

const Dashboard = () => {
  // Mock data for statistics
  const stats = {
    totalUsers: 248,
    activeUsers: 215,
    inactiveUsers: 33,
    totalDepartments: 8,
    totalRoles: 5,
    pendingRequests: 12
  };

  // Mock data for attendance overview
  const attendanceData = [
    { month: 'Jan', present: 90, absent: 5, late: 5 },
    { month: 'Feb', present: 85, absent: 10, late: 5 },
    { month: 'Mar', present: 88, absent: 7, late: 5 },
    { month: 'Apr', present: 92, absent: 3, late: 5 },
    { month: 'May', present: 89, absent: 6, late: 5 },
    { month: 'Jun', present: 94, absent: 2, late: 4 }
  ];

  // Mock data for user growth
  const userGrowthData = [
    { month: 'Jan', users: 180 },
    { month: 'Feb', users: 200 },
    { month: 'Mar', users: 210 },
    { month: 'Apr', users: 225 },
    { month: 'May', users: 235 },
    { month: 'Jun', users: 248 }
  ];

  // Mock data for role distribution
  const roleDistributionData = [
    { name: 'Admin', value: 15, color: '#2c3e50' },
    { name: 'HR', value: 30, color: '#3498db' },
    { name: 'Manager', value: 45, color: '#2ecc71' },
    { name: 'Employee', value: 158, color: '#f39c12' }
  ];

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created a new user account', time: '10 minutes ago', type: 'create' },
    { id: 2, user: 'Sarah Johnson', action: 'Updated department structure', time: '1 hour ago', type: 'update' },
    { id: 3, user: 'Michael Chen', action: 'Approved leave request', time: '2 hours ago', type: 'approve' },
    { id: 4, user: 'Emily Wilson', action: 'Reset user password', time: '3 hours ago', type: 'security' },
    { id: 5, user: 'Robert Brown', action: 'Modified system settings', time: '5 hours ago', type: 'system' }
  ];

  // Mock data for pending requests
  const pendingRequests = [
    { id: 1, user: 'Alice Cooper', type: 'Leave Request', department: 'Marketing', status: 'Pending', submitted: '2023-06-10' },
    { id: 2, user: 'Bob Smith', type: 'Role Change', department: 'Engineering', status: 'Pending', submitted: '2023-06-09' },
    { id: 3, user: 'Carol Davis', type: 'Leave Request', department: 'Finance', status: 'Pending', submitted: '2023-06-08' },
    { id: 4, user: 'David Wilson', type: 'Department Transfer', department: 'HR', status: 'Pending', submitted: '2023-06-07' }
  ];

  // Helper function to get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'create':
        return <UserCheck size={16} className="text-success" />;
      case 'update':
        return <FileText size={16} className="text-primary" />;
      case 'approve':
        return <CheckCircle size={16} className="text-success" />;
      case 'security':
        return <AlertCircle size={16} className="text-warning" />;
      // case 'system':
        // return <Settings size={16} className="text-secondary" />;
      default:
        return <Clock size={16} className="text-secondary" />;
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="fw-bold" style={{
            background: themeColors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Admin Dashboard</h2>
          <p className="text-muted mb-0">Welcome to the admin control panel</p>
        </div>
        <div className="d-flex">
          <Button
            variant="light"
            className="me-2 btn-sm btn-md-lg"
            style={{
              borderColor: themeColors.border,
              color: themeColors.primary
            }}
          >
            <span className="d-none d-sm-inline">Export Report</span>
            <span className="d-inline d-sm-none">Export</span>
          </Button>
          <Button
            className="btn-sm btn-md-lg"
            style={{
              background: themeColors.gradient,
              border: 'none'
            }}
          >
            <span className="d-none d-sm-inline">System Status</span>
            <span className="d-inline d-sm-none">Status</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6} sm={12}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle p-2 p-sm-3 me-3" style={{
                  background: themeColors.light,
                  boxShadow: `0 2px 6px ${themeColors.border}`
                }}>
                  <Users size={20} style={{ color: themeColors.primary }} />
                </div>
                <div>
                  <h6 className="card-title mb-0" style={{ fontWeight: 500 }}>Total Users</h6>
                  <small className="text-muted">All registered users</small>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="mb-0 fw-bold" style={{ color: themeColors.primary }}>{stats.totalUsers}</h3>
                <Badge bg="success" className="rounded-pill">+12% ↑</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} sm={12}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle p-2 p-sm-3 me-3" style={{
                  background: 'rgba(46, 204, 113, 0.1)',
                  boxShadow: '0 2px 6px rgba(46, 204, 113, 0.2)'
                }}>
                  <UserCheck size={20} style={{ color: '#27ae60' }} />
                </div>
                <div>
                  <h6 className="card-title mb-0" style={{ fontWeight: 500 }}>Active Users</h6>
                  <small className="text-muted">Currently active</small>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="mb-0 fw-bold" style={{ color: '#27ae60' }}>{stats.activeUsers}</h3>
                <Badge bg="success" className="rounded-pill">+5% ↑</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} sm={12}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle p-2 p-sm-3 me-3" style={{
                  background: 'rgba(231, 76, 60, 0.1)',
                  boxShadow: '0 2px 6px rgba(231, 76, 60, 0.2)'
                }}>
                  <UserX size={20} style={{ color: '#e74c3c' }} />
                </div>
                <div>
                  <h6 className="card-title mb-0" style={{ fontWeight: 500 }}>Inactive Users</h6>
                  <small className="text-muted">Disabled accounts</small>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="mb-0 fw-bold" style={{ color: '#e74c3c' }}>{stats.inactiveUsers}</h3>
                <Badge bg="danger" className="rounded-pill">+2% ↑</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} sm={12}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle p-2 p-sm-3 me-3" style={{
                  background: 'rgba(241, 196, 15, 0.1)',
                  boxShadow: '0 2px 6px rgba(241, 196, 15, 0.2)'
                }}>
                  <AlertCircle size={20} style={{ color: '#f39c12' }} />
                </div>
                <div>
                  <h6 className="card-title mb-0" style={{ fontWeight: 500 }}>Pending Requests</h6>
                  <small className="text-muted">Awaiting approval</small>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="mb-0 fw-bold" style={{ color: '#f39c12' }}>{stats.pendingRequests}</h3>
                <Badge bg="warning" className="rounded-pill text-dark">New</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        <Col lg={8} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title" style={{ fontWeight: 600, color: themeColors.primary }}>User Growth</h5>
                  <p className="text-muted mb-0">Monthly user registration trends</p>
                </div>
                <div>
                  <select className="form-select form-select-sm">
                    <option>Last 6 Months</option>
                    <option>Last 12 Months</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Total Users"
                    stroke={themeColors.secondary}
                    strokeWidth={3}
                    dot={{ r: 4, fill: themeColors.secondary, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: themeColors.secondary, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title" style={{ fontWeight: 600, color: themeColors.primary }}>Role Distribution</h5>
                  <p className="text-muted mb-0">Users by role type</p>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={roleDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {roleDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Users`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities and Pending Requests */}
      <Row className="g-4">
        <Col lg={6} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3 border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0" style={{ fontWeight: 600, color: themeColors.primary }}>Recent Activities</h5>
                <Button variant="link" className="p-0" style={{ color: themeColors.secondary, textDecoration: 'none' }}>
                  View All <ChevronRight size={16} />
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="list-group-item border-0 py-3 px-4">
                    <div className="d-flex">
                      <div className="me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                          width: '36px',
                          height: '36px',
                          background: themeColors.light
                        }}>
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div>
                        <p className="mb-0 fw-medium" style={{ color: themeColors.darkText }}>{activity.action}</p>
                        <div className="d-flex align-items-center mt-1">
                          <small className="text-muted me-2">by {activity.user}</small>
                          <small className="text-muted">• {activity.time}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3 border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0" style={{ fontWeight: 600, color: themeColors.primary }}>Pending Requests</h5>
                <Button variant="link" className="p-0" style={{ color: themeColors.secondary, textDecoration: 'none' }}>
                  View All <ChevronRight size={16} />
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="table align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3 ps-4">User</th>
                      <th className="border-0 py-3">Type</th>
                      <th className="border-0 py-3 d-none d-md-table-cell">Department</th>
                      <th className="border-0 py-3 d-none d-sm-table-cell">Submitted</th>
                      <th className="border-0 py-3 pe-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map(request => (
                      <tr key={request.id}>
                        <td className="py-3 ps-4">{request.user}</td>
                        <td>
                          <Badge
                            bg={request.type === 'Leave Request' ? 'info' : 'primary'}
                            className="rounded-pill"
                            style={{ fontWeight: 'normal' }}
                          >
                            {request.type}
                          </Badge>
                        </td>
                        <td className="d-none d-md-table-cell">{request.department}</td>
                        <td className="d-none d-sm-table-cell">{request.submitted}</td>
                        <td className="pe-4">
                          <div className="d-flex flex-wrap gap-2">
                            <Button size="sm" variant="outline-success" className="py-1 px-2">
                              <span className="d-none d-sm-inline">Approve</span>
                              <span className="d-inline d-sm-none">✓</span>
                            </Button>
                            <Button size="sm" variant="outline-danger" className="py-1 px-2">
                              <span className="d-none d-sm-inline">Reject</span>
                              <span className="d-inline d-sm-none">✕</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
