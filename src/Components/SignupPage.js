import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import loginLogo from "../assets/images/loginLogo.png";
import { registerUser, clearError } from '../redux/slices/authSlice';
import './SignupPage.css';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isLoggedIn, user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    mobile: '',
    email: '',
    gender: 'Male',
    dob: '',
    joiningDate: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    department: 'IT',
    address: ''
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const departments = ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales'];

  useEffect(() => {
    dispatch(clearError());
    if (isLoggedIn && user) {
      const redirectPath = user.role === 'hr' ? '/hr/dashboard' : '/employee/dashboard';
      navigate(redirectPath);
    }
  }, [dispatch, isLoggedIn, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.designation.trim()) errors.designation = 'Designation is required';
    if (!formData.mobile.trim()) errors.mobile = 'Mobile number is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.dob) errors.dob = 'Date of birth is required';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    
    // Append all form fields to FormData
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') { // Don't send confirmPassword to backend
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append profile photo if exists
    if (profilePhoto) {
      formDataToSend.append('profilePhoto', profilePhoto);
    }

    try {
      const result = await dispatch(registerUser(formDataToSend)).unwrap();
      toast.success('Registration successful!');
      
      // Redirect based on user role
      if (result.user.role === 'hr') {
        navigate('/hr/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (error) {
      toast.error(error || 'Registration failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="mb-3 text-center">
          <img src={loginLogo} alt="logo" style={{ height: "auto", width: "200px" }} />
        </div>

        <div className="text-center mb-4">
          <h2 className="signup-title">Sign Up</h2>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Photo Upload */}
          <div className="form-group text-center mb-4">
            <div className="profile-photo-container">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile Preview" className="profile-preview" />
              ) : (
                <div className="profile-placeholder">
                  <i className="bi bi-person-circle"></i>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="form-control mt-2"
              style={{ maxWidth: '300px', margin: '0 auto' }}
            />
          </div>

          {/* Name */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                name="name"
                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {formErrors.name && <div className="text-danger small">{formErrors.name}</div>}
          </div>

          {/* Designation */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-briefcase"></i>
              </span>
              <input
                type="text"
                name="designation"
                className={`form-control ${formErrors.designation ? 'is-invalid' : ''}`}
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
            {formErrors.designation && <div className="text-danger small">{formErrors.designation}</div>}
          </div>

          {/* Mobile */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-phone"></i>
              </span>
              <input
                type="tel"
                name="mobile"
                className={`form-control ${formErrors.mobile ? 'is-invalid' : ''}`}
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            {formErrors.mobile && <div className="text-danger small">{formErrors.mobile}</div>}
          </div>

          {/* Email */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {formErrors.email && <div className="text-danger small">{formErrors.email}</div>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-gender-ambiguous"></i>
              </span>
              <select
                name="gender"
                className={`form-control ${formErrors.gender ? 'is-invalid' : ''}`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {formErrors.gender && <div className="text-danger small">{formErrors.gender}</div>}
          </div>

          {/* Role */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-person-badge"></i>
              </span>
              <select
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
              </select>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-calendar"></i>
              </span>
              <input
                type="date"
                name="dob"
                className={`form-control ${formErrors.dob ? 'is-invalid' : ''}`}
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            {formErrors.dob && <div className="text-danger small">{formErrors.dob}</div>}
          </div>

          {/* Joining Date */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-calendar-check"></i>
              </span>
              <input
                type="date"
                name="joiningDate"
                className={`form-control ${formErrors.joiningDate ? 'is-invalid' : ''}`}
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>
            {formErrors.joiningDate && <div className="text-danger small">{formErrors.joiningDate}</div>}
          </div>

          {/* Department */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-building"></i>
              </span>
              <select
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {formErrors.password && <div className="text-danger small">{formErrors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                name="confirmPassword"
                className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {formErrors.confirmPassword && <div className="text-danger small">{formErrors.confirmPassword}</div>}
          </div>

          {/* Address */}
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <i className="bi bi-geo-alt"></i>
              </span>
              <textarea
                name="address"
                className="form-control"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;