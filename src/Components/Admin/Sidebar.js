import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart2,
  FileText,
  HelpCircle,
  Bell
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
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
    zIndex: 1030, // Higher z-index to ensure it's above other elements
    boxShadow: isMobile ? '0 0 20px rgba(0, 0, 0, 0.2)' : '0 0 15px rgba(0, 0, 0, 0.1)',
    color: '#fff',
    padding: '15px 0',
    left: isMobile && !collapsed ? '0' : (isMobile ? '-250px' : '0'), // Hide sidebar off-screen on mobile when collapsed
    transform: isMobile && !collapsed ? 'translateX(0)' : (isMobile ? 'translateX(-100%)' : 'translateX(0)')
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
            zIndex: 1020,
            backdropFilter: 'blur(2px)'
          }}
          onClick={toggleSidebar}
        />
      )}

      <div style={sidebarStyle} className="sidenav shadow">
        <div className="d-flex align-items-center justify-content-between px-3 mb-4">
          {!collapsed && (
            <div className="d-flex align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)' }}>
                <Shield size={18} color="#ffffff" />
              </div>
              <h3 className="fs-5 fw-semibold mb-0">Admin Portal</h3>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="btn btn-sm text-white p-1 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              width: '28px',
              height: '28px'
            }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        <div className="px-3">
          <div className="mb-4">
            <p className={`text-uppercase text-white-50 ${collapsed ? 'd-none' : ''}`} style={{ fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>
              Dashboard
            </p>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <NavLink
                  to="/admin/dashboard"
                  className={navLinkClass}
                  style={{
                    padding: collapsed ? '10px 0' : '10px',
                    margin: collapsed ? '0 auto' : '0',
                    ...(location.pathname === '/admin/dashboard' ? activeNavLinkStyle : {})
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
                        style={{ opacity: location.pathname === '/admin/dashboard' ? 1 : 0 }}
                      />
                    </>
                  )}
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to="/admin/analytics"
                  className={navLinkClass}
                  style={{
                    padding: collapsed ? '10px 0' : '10px',
                    margin: collapsed ? '0 auto' : '0',
                    ...(location.pathname === '/admin/analytics' ? activeNavLinkStyle : {})
                  }}
                >
                  <div style={iconContainerStyle}>
                    <BarChart2 size={18} color="#ffffff" />
                  </div>
                  {!collapsed && (
                    <>
                      <span>Analytics</span>
                      <ChevronRight
                        size={16}
                        className="ms-auto"
                        style={{ opacity: location.pathname === '/admin/analytics' ? 1 : 0 }}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <p className={`text-uppercase text-white-50 ${collapsed ? 'd-none' : ''}`} style={{ fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>
              Management
            </p>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <NavLink
                  to="/admin/users"
                  className={navLinkClass}
                  style={{
                    padding: collapsed ? '10px 0' : '10px',
                    margin: collapsed ? '0 auto' : '0',
                    ...(location.pathname === '/admin/users' ? activeNavLinkStyle : {})
                  }}
                >
                  <div style={iconContainerStyle}>
                    <Users size={18} color="#ffffff" />
                  </div>
                  {!collapsed && (
                    <>
                      <span>User Management</span>
                      <ChevronRight
                        size={16}
                        className="ms-auto"
                        style={{ opacity: location.pathname === '/admin/users' ? 1 : 0 }}
                      />
                    </>
                  )}
                </NavLink>
              </li>
           
            </ul>
          </div>

          <div className="mb-4">
            <p className={`text-uppercase text-white-50 ${collapsed ? 'd-none' : ''}`} style={{ fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>
              Reports
            </p>
            <ul className="nav flex-column">
              
            </ul>
          </div>

          <div className="mt-auto">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <NavLink
                  to="/admin/settings"
                  className={navLinkClass}
                  style={{
                    padding: collapsed ? '10px 0' : '10px',
                    margin: collapsed ? '0 auto' : '0',
                    ...(location.pathname === '/admin/settings' ? activeNavLinkStyle : {})
                  }}
                >
                  <div style={iconContainerStyle}>
                    <Settings size={18} color="#ffffff" />
                  </div>
                  {!collapsed && (
                    <>
                      <span>Settings</span>
                      <ChevronRight
                        size={16}
                        className="ms-auto"
                        style={{ opacity: location.pathname === '/admin/settings' ? 1 : 0 }}
                      />
                    </>
                  )}
                </NavLink>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="nav-link d-flex align-items-center p-2 rounded w-100 border-0 bg-transparent text-white"
                  style={{
                    padding: collapsed ? '10px 0' : '10px',
                    margin: collapsed ? '0 auto' : '0'
                  }}
                >
                  <div style={iconContainerStyle}>
                    <LogOut size={18} color="#ffffff" />
                  </div>
                  {!collapsed && <span>Logout</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
