import React from 'react';
// import Container from "react-bootstrap/Container";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/logoMatrix.png';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import userIcon from '../assets/images/male.png'; // Default user icon
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn, setLogInUser } from '../redux/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const handleLogout = () => {
    dispatch(setIsLoggedIn(false));
    dispatch(setLogInUser(null));
  };
  return (
    <div className='bg-header'>
      <Navbar expand='lg' className='bg-info'>
        <div className='container-fluid'>
          <Navbar.Brand href='#home' className='p-0'>
            <img src={logo} alt='logo' className='logo' />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto search-align'>

              <Nav.Link>
             <span className='profilr-name'>
             {user.fullName}{' '}
             </span>
                    <img
                      src={user?.profilePhoto ? user?.profilePhoto : userIcon}
                      alt='logo'
                      className='profile'
                    />

              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </div>
  );
};

export default Header;
