import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginLogo from "../assets/images/loginLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
const LoginPage = ({ onLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const initialValues = { email: "", password: "" };

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Attempting login with:', values);

      // Add test credentials if fields are empty
      if (!values.email) values.email = 'hr@example.com';
      if (!values.password) values.password = 'password123';

      const result = await dispatch(loginUser(values)).unwrap();
      console.log('Login successful, result:', result);
      toast.success("Login Successful!");

      // Check if user has multiple roles
      if (result.availableRoles && result.availableRoles.length > 1) {
        console.log('Multiple roles detected, redirecting to role selection');
        // If multiple roles, redirect to role selection
        navigate('/select-role');
      } else {
        console.log('Single role detected, proceeding with normal login');
        // Otherwise proceed with normal login
        if (onLogin) onLogin();
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled by the reducer and displayed in the UI
      toast.error(error || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content">
        {/* <div className="auth-bg">
          <span className="r" />
          <span className="r s" />
          <span className="r s" />
          <span className="r" />
        </div> */}
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
                <h3 className="mb-4 login-text">Login</h3>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                {/* <Alert variant="info" className="mb-3 text-start">
                  <strong>Test Credentials:</strong>
                  <div><small>HR: hr@example.com / password123</small></div>
                  <div><small>Employee: employee@example.com / password123</small></div>
                </Alert> */}


                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                       <div className="relative-field">
                       <FontAwesomeIcon
                          icon={faUser}
                          className="login-icon"
                        />
                        <Field
                          name="email"
                          type="email"
                          className="form-control field-sp"
                          placeholder="Email Address"
                          autoComplete="email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger text-start small"
                        />
                       </div>
                      </div>
                      <div className="mb-3">
                      <div className="relative-field">
                      <FontAwesomeIcon
                          icon={faLock}
                          className="login-icon"
                        />
                        <Field
                          name="password"
                          type="password"
                         className="form-control field-sp"
                          placeholder="Password"
                          autoComplete="current-password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger text-start small"
                        />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="w-100 log-color"
                      >
                        {isSubmitting || loading ? "Logging in..." : "Login"}
                      </Button>
                    </Form>
                  )}
                </Formik>
                <div className="mt-3 text-center">
                  <span>Don't have an account? </span>
                  <a href="/sign">Create one</a>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
