import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn, setLogInUser } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import logo from '../assets/images/logoMatrix.png';
import dash from '../assets/images/dash.svg';
import users from '../assets/images/users.svg';
import attendance from '../assets/images/attendance.svg';
import leave from '../assets/images/leave.svg';
import dollar from '../assets/images/dollar.svg';
import manage from '../assets/images/manage.svg';
import support from '../assets/images/support.svg';
import logout from '../assets/images/logout.svg';

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
    dispatch(setIsLoggedIn(false));
    dispatch(setLogInUser(null));
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
        <div className={`sidenav sidenavopen`}>
          <div className='mb-2 logo-l'>
            <img src={logo} alt='logo' className='logo' />
          </div>
          <Link to='dashboard' className={isActive('/')}>
            <img src={dash} alt='dashboard' className='sidebar-icon' />{' '}
            Dashboard
          </Link>
          <Link to='/projects' className={isActive('/projects')}>
            <img src={users} alt='user' className='sidebar-icon' />
            Employee
          </Link>
          <Link to='/team' className={isActive('/team')}>
            <img src={attendance} alt='team' className='sidebar-icon' />{' '}
            Attendance
          </Link>
          <Link to='/list' className={isActive('/list')}>
            <img src={leave} alt='list' className='sidebar-icon' /> Leave Management
          </Link>
          <Link to='/payroll' className={isActive('/payroll')}>
            <img src={dollar} alt='manage' className='sidebar-icon' /> 
            Payroll
          </Link>
          <Link to='/manageaccount' className={isActive('/manageaccount')}>
            <img src={manage} alt='manage' className='sidebar-icon' /> 
            Manage Account
          </Link>
          <Link to='/profile' className={isActive('/profile')}>
            <img src={manage} alt='manage' className='sidebar-icon' /> 
            Profile
          </Link>
          <Link to='/support' className={isActive('/support')}>
            <img src={support} alt='help' className='sidebar-icon' /> Help/Support
          </Link>
        
          {/* <Link to='/sign' className={isActive('/sign')}>
            <img src={help} alt='help' className='sidebar-icon' /> Signup
          </Link> */}
          <Link to='/' onClick={() => handleLogout()}>
            <img src={logout} alt='logout' className='sidebar-icon' /> Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
