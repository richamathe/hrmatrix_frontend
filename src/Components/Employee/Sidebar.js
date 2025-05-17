import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, Home, User, Bell, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import NotificationBadge from './NotificationBadge';
import '../../styles/theme.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [collapsed]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const sidebarStyle = {
    width: collapsed ? '70px' : '250px',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, rgb(44, 62, 80), rgb(52, 152, 219))',
    height: '100vh',
    position: 'fixed',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: 1000,
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    color: '#fff',
    padding: '15px 0'
  };

  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: collapsed ? '0' : '12px',
    color: '#ffffff'
  };

  const navLinkClass = ({ isActive }) => {
    return `nav-link d-flex align-items-center p-2 rounded ${
      isActive ? 'active' : ''
    } ${collapsed ? 'justify-content-center' : ''}`;
  };

  // Custom styles for active links
  const activeNavLinkStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    fontWeight: '500'
  };

  return (
    <>
      {isMobile && !collapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={toggleSidebar}
        />
      )}

      <div style={sidebarStyle} className="sidenav shadow">
        <div className="d-flex align-items-center justify-content-between px-3 mb-4">
          {!collapsed && (
            <div className="d-flex align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)' }}>
                <User size={20} color="#ffffff" />
              </div>
              <h3 className="fs-5 fw-semibold mb-0 emp-portal">Employee Portal</h3>
            </div>
          )}
          <button
            className="btn p-1 text-white"
            onClick={toggleSidebar}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              width: collapsed ? '100%' : 'auto',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {collapsed ? <Menu size={20} color="#ffffff" /> : <X size={20} color="#ffffff" />}
          </button>
        </div>

        <div className="px-3">
          {!collapsed && (
            <p className="text-white-50 text-uppercase small fw-medium mb-2 ps-2 side-text">MAIN</p>
          )}
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <NavLink
                to="/employee/dashboard"
                className={navLinkClass}
                style={{
                  padding: collapsed ? '10px 0' : '10px',
                  margin: collapsed ? '0 auto' : '0',
                  ...(location.pathname === '/employee/dashboard' ? activeNavLinkStyle : {})
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== '/employee/dashboard') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== '/employee/dashboard') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
                onFocus={(e) => {
                  if (location.pathname !== '/employee/dashboard') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onBlur={(e) => {
                  if (location.pathname !== '/employee/dashboard') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
              >
                <div style={iconContainerStyle}>
                  <Home size={18} color="#ffffff" />
                </div>
                {!collapsed && (
                  <>
                    <span>Dashboard</span>
                    <ChevronRight
                      size={16}
                      className="ms-auto"
                      style={{ opacity: location.pathname === '/employee/dashboard' ? 1 : 0 }}
                    />
                  </>
                )}
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink
                to="/employee/attendance"
                className={navLinkClass}
                style={{
                  padding: collapsed ? '10px 0' : '10px',
                  margin: collapsed ? '0 auto' : '0',
                  ...(location.pathname === '/employee/attendance' ? activeNavLinkStyle : {})
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== '/employee/attendance') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== '/employee/attendance') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
                onFocus={(e) => {
                  if (location.pathname !== '/employee/attendance') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onBlur={(e) => {
                  if (location.pathname !== '/employee/attendance') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
              >
                <div style={iconContainerStyle}>
                  <Calendar size={18} color="#ffffff" />
                </div>
                {!collapsed && (
                  <>
                    <span>Attendance</span>
                    <ChevronRight
                      size={16}
                      className="ms-auto"
                      style={{ opacity: location.pathname === '/employee/attendance' ? 1 : 0 }}
                    />
                  </>
                )}
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink
                to="/employee/team-members"
                className={navLinkClass}
                style={{
                  padding: collapsed ? '10px 0' : '10px',
                  margin: collapsed ? '0 auto' : '0',
                  ...(location.pathname === '/employee/team-members' ? activeNavLinkStyle : {})
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== '/employee/team-members') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== '/employee/team-members') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
                onFocus={(e) => {
                  if (location.pathname !== '/employee/team-members') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onBlur={(e) => {
                  if (location.pathname !== '/employee/team-members') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
              >
                <div style={iconContainerStyle}>
                  <Users size={18} color="#ffffff" />
                </div>
                {!collapsed && (
                  <>
                    <span>Team Members</span>
                    <ChevronRight
                      size={16}
                      className="ms-auto"
                      style={{ opacity: location.pathname === '/employee/team-members' ? 1 : 0 }}
                    />
                  </>
                )}
              </NavLink>
            </li>
          </ul>

          {!collapsed && (
            <p className="text-white-50 text-uppercase small fw-medium mb-2 ps-2 mt-4">PERSONAL</p>
          )}
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <NavLink
                to="/employee/notifications"
                className={navLinkClass}
                style={{
                  padding: collapsed ? '10px 0' : '10px',
                  margin: collapsed ? '0 auto' : '0',
                  ...(location.pathname === '/employee/notifications' ? activeNavLinkStyle : {})
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== '/employee/notifications') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== '/employee/notifications') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
                onFocus={(e) => {
                  if (location.pathname !== '/employee/notifications') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onBlur={(e) => {
                  if (location.pathname !== '/employee/notifications') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
              >
                <div style={iconContainerStyle} className="position-relative">
                  <Bell size={18} color="#ffffff" />
                  <NotificationBadge />
                </div>
                {!collapsed && (
                  <>
                    <span>Notifications</span>
                    <ChevronRight
                      size={16}
                      className="ms-auto"
                      style={{ opacity: location.pathname === '/employee/notifications' ? 1 : 0 }}
                    />
                  </>
                )}
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink
                to="/employee/profile"
                className={navLinkClass}
                style={{
                  padding: collapsed ? '10px 0' : '10px',
                  margin: collapsed ? '0 auto' : '0',
                  ...(location.pathname === '/employee/profile' ? activeNavLinkStyle : {})
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== '/employee/profile') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== '/employee/profile') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
                onFocus={(e) => {
                  if (location.pathname !== '/employee/profile') {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#2c3e50';
                    }
                  }
                }}
                onBlur={(e) => {
                  if (location.pathname !== '/employee/profile') {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.color = '';
                    const iconContainer = e.currentTarget.querySelector('div');
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      const icon = iconContainer.querySelector('svg');
                      if (icon) icon.style.color = '#ffffff';
                    }
                  }
                }}
              >
                <div style={iconContainerStyle}>
                  <User size={18} color="#ffffff" />
                </div>
                {!collapsed && (
                  <>
                    <span>Profile</span>
                    <ChevronRight
                      size={16}
                      className="ms-auto"
                      style={{ opacity: location.pathname === '/employee/profile' ? 1 : 0 }}
                    />
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={`${collapsed ? 'px-2' : 'px-3'} position-absolute bottom-0 start-0 w-100 p-3`}>
          <button
            className="btn d-flex align-items-center w-100 p-2 rounded"
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#000000';
              const iconContainer = e.currentTarget.querySelector('div');
              if (iconContainer) {
                iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                const icon = iconContainer.querySelector('svg');
                if (icon) icon.style.color = '#2c3e50';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'white';
              const iconContainer = e.currentTarget.querySelector('div');
              if (iconContainer) {
                iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                const icon = iconContainer.querySelector('svg');
                if (icon) icon.style.color = '#ffffff';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#000000';
              const iconContainer = e.currentTarget.querySelector('div');
              if (iconContainer) {
                iconContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                const icon = iconContainer.querySelector('svg');
                if (icon) icon.style.color = '#2c3e50';
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'white';
              const iconContainer = e.currentTarget.querySelector('div');
              if (iconContainer) {
                iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                const icon = iconContainer.querySelector('svg');
                if (icon) icon.style.color = '#ffffff';
              }
            }}
          >
            <div style={{
              ...iconContainerStyle,
              marginRight: collapsed ? '0' : '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <LogOut size={18} color="#ffffff" />
            </div>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
