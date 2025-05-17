import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogInUser } from '../redux/slices/authSlice';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import loginLogo from "../assets/images/loginLogo.png";

const RoleSelector = ({ availableRoles }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    try {
      // Update the user's active role
      const updatedUser = authService.setActiveRole(role);
      
      // Update Redux state
      dispatch(setLogInUser(updatedUser));
      
      // Show success message
      toast.success(`Logged in as ${role}`);
      
      // Redirect based on role
      if (role === 'hr') {
        navigate('/hr/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (error) {
      toast.error('Failed to set role. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content">
        <Card className="borderless">
          <Row className="align-items-center">
            <Col>
              <Card.Body className="text-center">
                <div className="mb-3">
                  <img
                    src={loginLogo}
                    alt="logo"
                    style={{ height: "auto", width: "200px"}}
                  />
                </div>
                <h3 className="mb-4 login-text">Select Your Role</h3>
                
                <p className="mb-4">
                  You have multiple roles. Please select which role you want to use:
                </p>
                
                <Container>
                  <Row className="justify-content-center">
                    {availableRoles.includes('hr') && (
                      <Col xs={12} className="mb-3">
                        <Button 
                          className="w-100 btn-theme py-3"
                          onClick={() => handleRoleSelect('hr')}
                        >
                          HR Manager
                        </Button>
                      </Col>
                    )}
                    
                    {availableRoles.includes('employee') && (
                      <Col xs={12} className="mb-3">
                        <Button 
                          className="w-100 btn-theme py-3"
                          onClick={() => handleRoleSelect('employee')}
                        >
                          Employee
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Container>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelector;
