import React from 'react';
import { Calendar, Clock, FileText, DollarSign, Bell, ChevronRight } from 'lucide-react';

const DashboardHome = ({ employeeData }) => {
  // Mock data for dashboard
  const attendanceStats = {
    present: 18,
    absent: 0,
    late: 2,
    total: 20,
    percentage: 90
  };

  const leaveBalance = {
    annual: 14,
    sick: 10,
    personal: 4
  };

  const upcomingHolidays = [
    { name: 'Labor Day', date: 'May 1, 2025' },
    { name: 'Memorial Day', date: 'May 27, 2025' },
    { name: 'Independence Day', date: 'July 4, 2025' }
  ];

  const recentPayslips = [
    { month: 'April 2025', amount: '$4,500', date: '04/25/2025' },
    { month: 'March 2025', amount: '$4,500', date: '03/25/2025' },
    { month: 'February 2025', amount: '$4,500', date: '02/25/2025' }
  ];

  const notifications = [
    { id: 1, message: 'Your leave request has been approved', time: '2 hours ago' },
    { id: 2, message: 'New company policy update', time: 'Yesterday' },
    { id: 3, message: 'Your April payslip is ready', time: '3 days ago' }
  ];

  return (
    <div className="mb-4">
      <h2 className="fs-3 fw-bold text-dark mb-4">Dashboard</h2>

      {/* Welcome Card */}
      <div className="bg-theme rounded shadow-sm p-4 text-white mb-4" style={{ background: themeColors.gradient }}>
        <h3 className="fs-5 fw-semibold mb-2">Welcome back, {employeeData.name}!</h3>
        <p className="opacity-75">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="row g-4 mb-4 flex-wrap">
        {/* Attendance Card */}
        <div className="col-12 col-md-4">
          <div className="bg-white rounded shadow-sm p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="fs-5 fw-semibold text-dark">Attendance</h3>
              <Clock className="text-theme" size={20} />
            </div>
            <div className="d-flex align-items-end justify-content-between">
              <div>
                <p className="fs-2 fw-bold text-dark mb-0">{attendanceStats.percentage}%</p>
                <p className="small text-muted">This month</p>
              </div>
              <div className="text-end">
                <p className="small text-secondary">Present: <span className="fw-medium text-success">{attendanceStats.present}</span></p>
                <p className="small text-secondary">Late: <span className="fw-medium text-warning">{attendanceStats.late}</span></p>
                <p className="small text-secondary">Absent: <span className="fw-medium text-danger">{attendanceStats.absent}</span></p>
              </div>
            </div>
          </div>
        </div>
        {/* Leave Balance Card */}
        <div className="col-12 col-md-4">
          <div className="bg-white rounded shadow-sm p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="fs-5 fw-semibold text-dark">Leave Balance</h3>
              <Calendar className="text-theme" size={20} />
            </div>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <p className="small text-secondary mb-0">Annual Leave</p>
                <p className="fw-medium text-dark mb-0">{leaveBalance.annual} days</p>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <p className="small text-secondary mb-0">Sick Leave</p>
                <p className="fw-medium text-dark mb-0">{leaveBalance.sick} days</p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="small text-secondary mb-0">Personal Leave</p>
                <p className="fw-medium text-dark mb-0">{leaveBalance.personal} days</p>
              </div>
            </div>
          </div>
        </div>
        {/* Upcoming Holidays Card */}
        <div className="col-12 col-md-4">
          <div className="bg-white rounded shadow-sm p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="fs-5 fw-semibold text-dark">Upcoming Holidays</h3>
              <Calendar className="text-theme" size={20} />
            </div>
            <div>
              {upcomingHolidays.map((holiday, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                  <p className="small text-secondary mb-0">{holiday.name}</p>
                  <p className="fw-medium text-dark mb-0">{holiday.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payslips */}
      <div className="bg-white rounded shadow-sm overflow-hidden mb-4">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h3 className="fs-5 fw-semibold text-dark mb-0">Recent Payslips</h3>
          <DollarSign className="text-theme" size={20} />
        </div>
        <div>
          {recentPayslips.map((payslip, index) => (
            <div key={index} className="p-3 border-bottom hover-bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="fw-medium text-dark mb-0">{payslip.month}</p>
                  <p className="small text-muted mb-0">Paid on {payslip.date}</p>
                </div>
                <div className="d-flex align-items-center">
                  <p className="fw-medium text-dark me-3 mb-0">{payslip.amount}</p>
                  <button className="btn btn-sm btn-link text-theme p-0">
                    <FileText size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h3 className="fs-5 fw-semibold text-dark mb-0">Recent Notifications</h3>
          <Bell className="text-theme" size={20} />
        </div>
        <div>
          {notifications.map((notification) => (
            <div key={notification.id} className="p-3 border-bottom hover-bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <p className="text-dark mb-0">{notification.message}</p>
                <p className="small text-muted mb-0">{notification.time}</p>
              </div>
            </div>
          ))}
          <div className="p-3 text-center">
            <a href="/employee/notifications" className="text-decoration-none text-theme d-inline-flex align-items-center">
              View all notifications
              <ChevronRight size={16} className="ms-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
