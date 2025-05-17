import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import DepartmentManagement from './DepartmentManagement';
import SystemSettings from './SystemSettings';
import Support from './Support';
import { Bell, User, Search , Menu } from 'lucide-react';
import themeColors from '../../theme/colors';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 576);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      const smallScreen = window.innerWidth < 576;

      setIsMobile(mobile);
      setIsSmallScreen(smallScreen);

      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      } else if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const mainContentStyle = {
    marginLeft: isMobile ? '0' : (sidebarOpen ? '250px' : '70px'),
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    width: isMobile ? '100%' : 'auto',
    overflowX: 'hidden'
  };

  return (
    <div className="d-flex h-100 bg-light">
      {/* Mobile sidebar toggle button - only show when sidebar is closed */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="position-fixed bottom-0 end-0 m-3 btn rounded-circle shadow"
          aria-label="Toggle sidebar"
          style={{
            background: themeColors.gradient,
            color: '#ffffff',
            border: 'none',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Header */}
        <header className="bg-white shadow-sm py-3 px-3 px-sm-4 d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-2 mb-sm-0">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="btn btn-sm me-2 p-1 d-flex align-items-center justify-content-center"
                style={{
                  background: 'transparent',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  width: '32px',
                  height: '32px'
                }}
              >
                <Menu size={18} color={themeColors.primary} />
              </button>
            )}
            <h1 className="h5 mb-0 fw-bold" style={{ color: themeColors.primary }}>Admin Portal</h1>
          </div>
          <div className="d-flex align-items-center">
            {/* Search Bar */}
            <div className="position-relative me-2 me-sm-3 d-none d-md-block">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                style={{
                  borderRadius: '20px',
                  paddingLeft: '35px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  width: isSmallScreen ? '150px' : '200px'
                }}
              />
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }}
              />
            </div>

            {/* Notifications */}
            <div className="position-relative me-2 me-sm-3">
              <button
                className="btn btn-light btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  width: '32px',
                  height: '32px'
                }}
              >
                <Bell size={16} color="#6c757d" />
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ background: themeColors.gradient, fontSize: '0.65rem' }}
                >
                  3
                  <span className="visually-hidden">unread notifications</span>
                </span>
              </button>
            </div>

            {/* User Profile */}
            <div className="dropdown">
              <button
                className="btn btn-sm dropdown-toggle d-flex align-items-center p-0"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ border: 'none' }}
              >
                <div
                  className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: themeColors.light,
                    color: themeColors.primary,
                    fontWeight: 'bold'
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="d-none d-md-inline" style={{ color: themeColors.primary }}>
                  {user?.username || 'Admin User'}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="dropdownMenuButton">
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        </header>

        <main className="p-2 p-sm-3 p-md-4">
          <div className="container-fluid px-0 px-sm-2">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="roles" element={<RoleManagement />} />
              <Route path="departments" element={<DepartmentManagement />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="support" element={<Support />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
