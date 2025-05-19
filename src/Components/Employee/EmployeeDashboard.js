import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Attendance from './Attendance';
import TeamMembers from './TeamMembers';
import Profile from './Profile';
import Notifications from './Notifications';
import Dashboard from './Dashboard';

const EmployeeDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) setSidebarOpen(true);
      if (mobile && sidebarOpen) setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex flex-column flex-md-row h-100 bg-light" style={{ minHeight: '100vh' }}>
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="position-fixed bottom-0 end-0 m-3 btn rounded-circle shadow"
          aria-label="Toggle sidebar"
          style={{
            background: 'white',
            color: '#2c3e50',
            border: '1px solid #e9ecef',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            zIndex: 1100
          }}
        >
          {sidebarOpen ? '×' : '☰'}
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'show' : ''}`} style={{ minHeight: '100vh' }}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <header className="shadow-sm" style={{
          background: 'white',
          borderBottom: '1px solid #e9ecef',
          position: 'sticky',
          top: 0,
          zIndex: 1020
        }}>
          <div className="container-fluid py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="d-flex align-items-center">
                {isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="btn btn-link me-3"
                    aria-label="Menu"
                    style={{ color: '#2c3e50' }}
                  >
                    ☰
                  </button>
                )}
                <h2 className="h4 mb-0" style={{
                  color: '#2c3e50',
                  fontWeight: 600
                }}>Employee Portal</h2>
              </div>
              <div className="d-flex align-items-center mt-3 mt-md-0">
                <div className="me-3 text-end d-none d-sm-block">
                  <p className="mb-0 fw-medium" style={{ color: '#2c3e50' }}>{user?.name}</p>
                  <p className="small mb-0" style={{ color: '#6c757d' }}>{user?.designation} • {user?.department}</p>
                </div>
                <div className="position-relative">
                  <img
                    src={user?.profilePhoto ? `${process.env.REACT_APP_BACKEND_URL}/${user.profilePhoto}` : 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      border: '2px solid #3498db'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 p-3" style={{ background: '#f8f9fa' }}>
          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="team-members" element={<TeamMembers />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
