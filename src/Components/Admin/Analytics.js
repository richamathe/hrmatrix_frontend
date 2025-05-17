import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import themeColors from '../../theme/colors';

const Analytics = () => {
  // Mock data for attendance overview
  const attendanceData = [
    { month: 'Jan', present: 90, absent: 5, late: 5 },
    { month: 'Feb', present: 85, absent: 10, late: 5 },
    { month: 'Mar', present: 88, absent: 7, late: 5 },
    { month: 'Apr', present: 92, absent: 3, late: 5 },
    { month: 'May', present: 89, absent: 6, late: 5 },
    { month: 'Jun', present: 94, absent: 2, late: 4 }
  ];

  // Mock data for department performance
  const departmentData = [
    { name: 'HR', performance: 85, target: 90 },
    { name: 'Engineering', performance: 92, target: 85 },
    { name: 'Marketing', performance: 78, target: 80 },
    { name: 'Finance', performance: 88, target: 85 },
    { name: 'Operations', performance: 82, target: 80 }
  ];

  // Mock data for system usage
  const systemUsageData = [
    { time: '00:00', users: 10 },
    { time: '03:00', users: 5 },
    { time: '06:00', users: 15 },
    { time: '09:00', users: 120 },
    { time: '12:00', users: 150 },
    { time: '15:00', users: 180 },
    { time: '18:00', users: 90 },
    { time: '21:00', users: 30 }
  ];

  return (
    <div>
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{
            background: themeColors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Analytics Dashboard</h2>
          <p className="text-muted mb-0">Detailed system analytics and statistics</p>
        </div>
        <div>
          <Button 
            variant="light" 
            className="me-2"
            style={{ 
              borderColor: themeColors.border,
              color: themeColors.primary
            }}
          >
            Export Data
          </Button>
          <Button 
            style={{ 
              background: themeColors.gradient,
              border: 'none'
            }}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title" style={{ fontWeight: 600, color: themeColors.primary }}>System Usage</h5>
                  <p className="text-muted mb-0">User activity throughout the day</p>
                </div>
                <div>
                  <select className="form-select form-select-sm">
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last 7 Days</option>
                  </select>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={systemUsageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    name="Active Users" 
                    stroke={themeColors.secondary} 
                    fill={themeColors.light}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={6} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title" style={{ fontWeight: 600, color: themeColors.primary }}>Attendance Overview</h5>
                  <p className="text-muted mb-0">Monthly attendance statistics</p>
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
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" name="Present" fill="#2ecc71" />
                  <Bar dataKey="absent" name="Absent" fill="#e74c3c" />
                  <Bar dataKey="late" name="Late" fill="#f39c12" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title" style={{ fontWeight: 600, color: themeColors.primary }}>Department Performance</h5>
                  <p className="text-muted mb-0">Performance vs Target</p>
                </div>
                <div>
                  <select className="form-select form-select-sm">
                    <option>This Quarter</option>
                    <option>Last Quarter</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={departmentData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performance" name="Current Performance" fill={themeColors.secondary} />
                  <Bar dataKey="target" name="Target" fill="#e0e0e0" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <p className="text-center text-muted mt-4">
        This is a placeholder for the Analytics dashboard. In a real implementation, this would include more detailed analytics, filters, and interactive elements.
      </p>
    </div>
  );
};

export default Analytics;
