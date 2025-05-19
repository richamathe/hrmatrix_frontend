import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import logo from '../../assets/images/logoMatrix.png';
import dash from '../../assets/images/dash.svg';
import users from '../../assets/images/users.svg';
import attendance from '../../assets/images/attendance.svg';
import leave from '../../assets/images/leave.svg';
import dollar from '../../assets/images/dollar.svg';
import manage from '../../assets/images/manage.svg';
import support from '../../assets/images/support.svg';
import logoutIcon from '../../assets/images/logout.svg';
import profileIcon from '../../assets/images/user1.svg';

import { faAddressBook, faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faDashboard,
  faDiagramProject,
  faUserPlus,
  faCircleInfo,
  faBars,
  faList12,
  faGear,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [toggle, setToggle] = useState(true);
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path) => (location.pathname === path ? 'active' : '');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };
  return (
    <div>
      <div className='asdd'>
        <FontAwesomeIcon
          icon={faBars}
          className='openclose'
          onClick={() => setToggle(!toggle)}
        />
      </div>
      {toggle && (
        <div className={`sidenav sidenavopen sidebar-gradient`}>
          <div className='mb-2 logo-l'>
            <img src={logo} alt='logo' className='logo' />
          </div>
          <Link to='/hr/dashboard' className={isActive('/hr/dashboard')}>
            <img src={dash} alt='dashboard' className='sidebar-icon' />{' '}
            Dashboard
          </Link>
          <Link to='/hr/employees' className={isActive('/hr/employees')}>
            <img src={users} alt='user' className='sidebar-icon' />
            Employee
          </Link>
          <Link to='/hr/attendance' className={isActive('/hr/attendance')}>
            <img src={attendance} alt='team' className='sidebar-icon' />{' '}
            Attendance
          </Link>
          <Link to='/hr/leave' className={isActive('/hr/leave')}>
            <img src={leave} alt='list' className='sidebar-icon' /> Leave Management
          </Link>
          <Link to='/hr/payroll' className={isActive('/hr/payroll')}>
            <img src={dollar} alt='manage' className='sidebar-icon' />
            Payroll
          </Link>
          {/* <Link to='/hr/account' className={isActive('/hr/account')}>
            <img src={manage} alt='manage' className='sidebar-icon' />
            Manage Account
          </Link> */}
          <Link to='/hr/profile' className={isActive('/hr/profile')}>
            <img src={profileIcon} alt='profile' className='sidebar-icon' />
            Profile
          </Link>
          {/* <Link to='/hr/support' className={isActive('/hr/support')}>
            <img src={support} alt='help' className='sidebar-icon' /> Help/Support
          </Link> */}
          <Link to='/login' onClick={handleLogout}>
            <img src={logoutIcon} alt='logout' className='sidebar-icon' /> Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
