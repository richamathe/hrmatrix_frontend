import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./Components/LoginPage";
import "./App.css";
import Header from "./Components/Header";

// HR Components
import HRSidebar from "./Components/HR/Sidebar";
import HRDashboard from "./Components/HR/Dashboard";
import HREmployees from "./Components/HR/Employees";
import HRAttendance from "./Components/HR/Attendance";
import HRLeaveManagement from "./Components/HR/LeaveManagement";
import HRPayroll from "./Components/HR/Payroll";
import HRHelpSupport from "./Components/HR/HelpSupport";

// Employee Components
import EmployeeDashboard from "./Components/Employee/EmployeeDashboard";

// Admin Components
import AdminDashboard from "./Components/Admin/AdminDashboard";

// Common Components
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setIsLoggedIn, logout, setLogInUser } from "./redux/slices/authSlice";
import ManageAccount from "./Components/ManageAccount";
import Profile from "./Components/Profile";
import LandingPage from "./Components/LandingPage";
import SignupPage from "./Components/SignupPage";
import RoleSelector from "./Components/RoleSelector";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const availableRoles = useSelector((state) => state.auth.availableRoles || []);

  const handleLogin = () => {
    dispatch(setIsLoggedIn(true));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Determine user role
  const isHR = user?.role === 'hr';
  const isAdmin = user?.role === 'admin';

  // Check if user has multiple roles and needs to select one
  const needsRoleSelection = isAuthenticated && availableRoles.length > 1;

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public routes accessible without authentication */}
        <Route path="/" element={<LandingPage />} />

        {/* Login route with role selection handling */}
        <Route path="/login" element={
          isAuthenticated ? (
            needsRoleSelection ?
              <RoleSelector availableRoles={availableRoles} /> :
              (isAdmin ? <Navigate to="/admin/dashboard" /> :
               isHR ? <Navigate to="/hr/dashboard" /> :
               <Navigate to="/employee/dashboard" />)
          ) : <LoginPage onLogin={handleLogin} />
        } />

        {/* Role selection route */}
        <Route path="/select-role" element={
          isAuthenticated ?
            <RoleSelector availableRoles={availableRoles} /> :
            <Navigate to="/login" />
        } />

        {/* Signup route */}
        <Route path="/sign" element={
          isAuthenticated ? (
            needsRoleSelection ?
              <RoleSelector availableRoles={availableRoles} /> :
              (isAdmin ? <Navigate to="/admin/dashboard" /> :
               isHR ? <Navigate to="/hr/dashboard" /> :
               <Navigate to="/employee/dashboard" />)
          ) : <SignupPage />
        } />

        {/* HR Routes */}
        <Route path="/hr/*" element={
          isAuthenticated && isHR ? (
            <div>
              <div className="header-gradient">
                <Header />
              </div>
              <div className="asd">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-2 px-0 ss">
                      <div className="sidebar-gradient">
                        <HRSidebar />
                      </div>
                    </div>
                    <div className="col-lg-10">
                      <div className="child-section">
                        <Routes>
                          <Route path="/dashboard" element={<HRDashboard />} />
                          <Route path="/employees" element={<HREmployees />} />
                          <Route path="/attendance" element={<HRAttendance />} />
                          <Route path="/leave" element={<HRLeaveManagement />} />
                          <Route path="/payroll" element={<HRPayroll />} />
                          <Route path="/support" element={<HRHelpSupport />} />
                          <Route path="/account" element={<ManageAccount />} />
                          <Route path="/profile" element={<Profile />} />
                        </Routes>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : <Navigate to="/login" />
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />
        } />

        {/* Employee Routes */}
        <Route path="/employee/*" element={
          isAuthenticated ? <EmployeeDashboard /> : <Navigate to="/login" />
        } />

        {/* Redirect legacy routes */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            isAdmin ? <Navigate to="/admin/dashboard" /> :
            isHR ? <Navigate to="/hr/dashboard" /> :
            <Navigate to="/employee/dashboard" />
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
};

export default App;