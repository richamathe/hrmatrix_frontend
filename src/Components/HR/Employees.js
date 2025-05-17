import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { employeeService } from "../../services/api";
import { projectTypes } from "../../Utils/SelectOptions";
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaSearch, FaUserPlus, FaEdit, FaTrash, FaFilter, FaEye, FaUserTie, FaBuilding, FaCalendarAlt, FaIdCard, FaEnvelope, FaPhone, FaVenusMars, FaMapMarkerAlt } from 'react-icons/fa';
import themeColors from '../../theme/colors';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    designation: "",
    mobile: "",
    email: "",
    gender: "",
    dob: "",
    password: "",
    joiningDate: "",
    department: "IT",
    position: "Staff",
    address: "",
    role: "employee"
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = employees.filter((emp) => {
      // Safely check if emp and its properties exist
      if (!emp) return false;

      const name = emp.name?.toLowerCase() || '';
      const mobile = emp.mobile?.toLowerCase() || '';
      const email = emp.email?.toLowerCase() || '';
      const designation = emp.designation?.toLowerCase() || '';
      const department = emp.department?.toLowerCase() || '';

      return (
        name.includes(value) ||
        mobile.includes(value) ||
        email.includes(value) ||
        designation.includes(value) ||
        department.includes(value)
      );
    });

    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Add scroll detection for table shadow effect
  useEffect(() => {
    const tableContainer = document.querySelector('.custom-scrollbar');
    if (tableContainer) {
      const handleScroll = () => {
        if (tableContainer.scrollTop > 0) {
          tableContainer.classList.add('scrolling');
        } else {
          tableContainer.classList.remove('scrolling');
        }
      };

      tableContainer.addEventListener('scroll', handleScroll);
      return () => {
        tableContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [filteredEmployees]);

  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
    setNewEmployee({
      name: "",
      designation: "",
      mobile: "",
      email: "",
      gender: "",
      dob: "",
      password: "",
      joiningDate: "",
      department: "IT",
      position: "Staff",
      address: "",
      role: "employee"
    });
    setCurrentEmployee(null);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setNewEmployee({
      name: employee.name,
      designation: employee.designation,
      mobile: employee.mobile,
      email: employee.email,
      gender: employee.gender,
      dob: employee.dob ? new Date(employee.dob).toISOString().split('T')[0] : "",
      password: "", // Don't show password when editing
      joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : "",
      department: employee.department || "IT",
      position: employee.position || "Staff",
      address: employee.address || "",
      role: employee.role || "employee"
    });
    setIsEditing(true);
    setShow(true);
  };

  const handleAddOrEdit = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.designation ||
      !newEmployee.mobile ||
      !newEmployee.email ||
      !newEmployee.gender ||
      !newEmployee.dob ||
      !newEmployee.joiningDate ||
      !newEmployee.department ||
      !newEmployee.position ||
      (!newEmployee.password && !isEditing)
    ) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    try {
      // Format dates and prepare the employee data
      const formattedEmployee = {
        name: newEmployee.name,
        designation: newEmployee.designation,
        mobile: newEmployee.mobile,
        email: newEmployee.email,
        gender: newEmployee.gender,
        dob: new Date(newEmployee.dob).toISOString(),
        joiningDate: new Date(newEmployee.joiningDate).toISOString(),
        department: newEmployee.department,
        position: newEmployee.position,
        address: newEmployee.address || "",
        role: newEmployee.role || "employee"
      };

      // Only add password for new employees
      if (!isEditing) {
        formattedEmployee.password = newEmployee.password;
      }

      if (isEditing) {
        await employeeService.updateEmployee(currentEmployee._id, formattedEmployee);
        toast.success("Employee updated successfully.");
      } else {
        await employeeService.createEmployee(formattedEmployee);
        toast.success("Employee added successfully.");
      }
      handleClose();
      fetchEmployees();
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message ||
        (isEditing ? "Failed to update employee" : "Failed to add employee");
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(employeeId);
        toast.success("Employee deleted successfully");
        fetchEmployees();
      } catch (error) {
        toast.error("Failed to delete employee");
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <Container fluid className="px-4 py-4">
      <div className="mb-4 pb-3" style={{
        borderBottom: '1px solid #e9ecef',
        background: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="d-flex align-items-center">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: themeColors.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <FaUserTie size={22} style={{ color: themeColors.secondary }} />
              </div>
              <div>
                <h4 style={{
                  fontWeight: '700',
                  color: themeColors.primary,
                  margin: 0,
                  fontSize: '1.5rem'
                }}>
                  Employee Management
                </h4>
                <p style={{
                  color: themeColors.lightText,
                  margin: '4px 0 0 0',
                  fontSize: '0.9rem'
                }}>
                  Manage all your employees in one place
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-end mt-3 mt-lg-0 gap-2">
              <div className="search-container flex-grow-1" style={{ maxWidth: '350px', marginLeft: 'auto' }}>
                <div style={{ position: 'relative' }}>
                  <FaSearch style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: themeColors.lightText
                  }} />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                      padding: '10px 15px 10px 40px',
                      borderRadius: '30px',
                      border: '1px solid #e9ecef',
                      width: '100%',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.15)';
                      e.target.style.borderColor = themeColors.secondary;
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
                      e.target.style.borderColor = '#e9ecef';
                    }}
                  />
                </div>
              </div>
              <Button
                onClick={handleShow}
                style={{
                  background: themeColors.gradient,
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  boxShadow: '0 4px 10px rgba(52, 152, 219, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                className="d-flex align-items-center gap-2"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(52, 152, 219, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(52, 152, 219, 0.2)';
                }}
              >
                <FaUserPlus /> Add Employee
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Table Section */}
      <Row>
        <Col>
          <div style={{
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            padding: '20px',
            overflow: 'hidden'
          }}>
            {loading ? (
              <div className="text-center p-5">
                <Spinner
                  animation="border"
                  style={{
                    color: themeColors.secondary,
                    width: '3rem',
                    height: '3rem'
                  }}
                />
                <p className="mt-3" style={{ color: themeColors.lightText }}>Loading employees...</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center p-5">
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: themeColors.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <FaUserTie size={30} style={{ color: themeColors.secondary }} />
                </div>
                <h5 style={{ color: themeColors.primary, fontWeight: '600' }}>No Employees Found</h5>
                <p style={{ color: themeColors.lightText }}>
                  {searchTerm ? 'Try a different search term or' : 'Get started by'} adding a new employee
                </p>
                <Button
                  onClick={handleShow}
                  style={{
                    background: themeColors.gradient,
                    border: 'none',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    marginTop: '10px',
                    boxShadow: '0 4px 10px rgba(52, 152, 219, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  className="d-flex align-items-center gap-2 mx-auto"
                >
                  <FaUserPlus /> Add Employee
                </Button>
              </div>
            ) : (
              <div className="table-responsive custom-scrollbar" style={{
                maxHeight: '65vh',
                overflowY: 'auto'
              }}>
                <table className="table table-hover align-middle" style={{ marginBottom: 0 }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr style={{
                      background: themeColors.lightBg,
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Name</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Designation</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Mobile</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Email</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Gender</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Date of Birth</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Join Date</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Department</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Position</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none',
                        textAlign: 'center'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee._id} style={{
                        transition: 'all 0.2s ease',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <td style={{ padding: '15px 20px' }}>
                          <div className="d-flex align-items-center">
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              background: themeColors.light,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '12px',
                              fontSize: '16px',
                              fontWeight: '600',
                              color: themeColors.secondary
                            }}>
                              {employee.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{
                                margin: 0,
                                fontWeight: '600',
                                color: themeColors.primary
                              }}>{employee.name}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{employee.designation}</td>
                        <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{employee.mobile}</td>
                        <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{employee.email}</td>
                        <td style={{ padding: '15px 20px' }}>
                          <span style={{
                            padding: '5px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            background: employee.gender === 'male' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                            color: employee.gender === 'male' ? themeColors.secondary : '#2ecc71',
                            display: 'inline-block'
                          }}>
                            {employee.gender}
                          </span>
                        </td>
                        <td style={{ padding: '15px 20px', color: themeColors.darkText }}>
                          {employee.dob ? new Date(employee.dob).toLocaleDateString() : '-'}
                        </td>
                        <td style={{ padding: '15px 20px', color: themeColors.darkText }}>
                          {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : '-'}
                        </td>
                        <td style={{ padding: '15px 20px' }}>
                          <span style={{
                            padding: '5px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            background: 'rgba(52, 152, 219, 0.1)',
                            color: themeColors.secondary,
                            display: 'inline-block'
                          }}>
                            {employee.department || '-'}
                          </span>
                        </td>
                        <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{employee.position || '-'}</td>
                        <td style={{ padding: '15px 20px' }}>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              onClick={() => handleEdit(employee)}
                              style={{
                                background: 'rgba(52, 152, 219, 0.1)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                color: themeColors.secondary,
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(52, 152, 219, 0.2)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(52, 152, 219, 0.1)';
                              }}
                              className="d-flex align-items-center gap-1"
                            >
                              <FaEdit size={14} /> Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(employee._id)}
                              style={{
                                background: 'rgba(231, 76, 60, 0.1)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                color: '#e74c3c',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(231, 76, 60, 0.2)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)';
                              }}
                              className="d-flex align-items-center gap-1"
                            >
                              <FaTrash size={14} /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Modal for Add/Edit Employee */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header
          closeButton
          style={{
            background: themeColors.gradient,
            color: 'white',
            borderBottom: 'none',
            borderRadius: '0.5rem 0.5rem 0 0',
            padding: '1.25rem 1.5rem'
          }}
        >
          <Modal.Title style={{ fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              {isEditing ? <FaEdit size={18} /> : <FaUserPlus size={18} />}
            </div>
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1.5rem' }}>
          <div className="row g-3">
            {/* Personal Information */}
            <div className="col-12">
              <div className="d-flex align-items-center mb-3">
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: themeColors.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}>
                  <FaIdCard size={14} style={{ color: themeColors.secondary }} />
                </div>
                <h5 style={{
                  margin: 0,
                  fontWeight: '600',
                  color: themeColors.primary,
                  fontSize: '1.1rem'
                }}>
                  Personal Information
                </h5>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Name *
              </label>
              <div style={{ position: 'relative' }}>
                <FaUserTie style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: themeColors.lightText,
                  zIndex: 1
                }} size={14} />
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  style={{
                    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                  maxLength={50}
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Email *
              </label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: themeColors.lightText,
                  zIndex: 1
                }} size={14} />
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  style={{
                    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Mobile *
              </label>
              <div style={{ position: 'relative' }}>
                <FaPhone style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: themeColors.lightText,
                  zIndex: 1
                }} size={14} />
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  value={newEmployee.mobile}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, mobile: e.target.value })
                  }
                  style={{
                    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                  maxLength={20}
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Gender *
              </label>
              <div style={{ position: 'relative' }}>
                <FaVenusMars style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: themeColors.lightText,
                  zIndex: 1
                }} size={14} />
                <Select
                  placeholder="Select gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  value={{ value: newEmployee.gender, label: newEmployee.gender }}
                  onChange={(option) =>
                    setNewEmployee({ ...newEmployee, gender: option.value })
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      paddingLeft: '1.5rem',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      boxShadow: 'none',
                      '&:hover': {
                        border: '1px solid #e9ecef',
                      }
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? themeColors.light : state.isFocused ? themeColors.light : 'white',
                      color: state.isSelected ? themeColors.secondary : themeColors.darkText,
                    }),
                  }}
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Date of Birth *
              </label>
              <div style={{ position: 'relative' }}>
                <FaCalendarAlt style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: themeColors.lightText,
                  zIndex: 1
                }} size={14} />
                <input
                  type="date"
                  value={newEmployee.dob}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, dob: e.target.value })
                  }
                  style={{
                    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Address
              </label>
              <div style={{ position: 'relative' }}>
                <FaMapMarkerAlt style={{
                  position: 'absolute',
                  left: '12px',
                  top: '15px',
                  color: themeColors.lightText,
                  zIndex: 1
                }} size={14} />
                <input
                  type="text"
                  placeholder="Enter address"
                  value={newEmployee.address}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, address: e.target.value })
                  }
                  style={{
                    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            {/* Employment Information */}
            <div className="col-12 mt-4">
              <div className="d-flex align-items-center mb-3">
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: themeColors.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}>
                  <FaBuilding size={14} style={{ color: themeColors.secondary }} />
                </div>
                <h5 style={{
                  margin: 0,
                  fontWeight: '600',
                  color: themeColors.primary,
                  fontSize: '1.1rem'
                }}>
                  Employment Information
                </h5>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Designation *
              </label>
              <Select
                placeholder="Select designation"
                options={projectTypes}
                value={projectTypes.find(
                  (option) => option.value === newEmployee.designation
                )}
                onChange={(option) =>
                  setNewEmployee({ ...newEmployee, designation: option.value })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    boxShadow: 'none',
                    '&:hover': {
                      border: '1px solid #e9ecef',
                    }
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? themeColors.light : state.isFocused ? themeColors.light : 'white',
                    color: state.isSelected ? themeColors.secondary : themeColors.darkText,
                  }),
                }}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Department *
              </label>
              <Select
                placeholder="Select department"
                options={[
                  { value: "HR", label: "HR" },
                  { value: "IT", label: "IT" },
                  { value: "Finance", label: "Finance" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "Operations", label: "Operations" },
                  { value: "Sales", label: "Sales" }
                ]}
                value={{ value: newEmployee.department, label: newEmployee.department }}
                onChange={(option) =>
                  setNewEmployee({ ...newEmployee, department: option.value })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    boxShadow: 'none',
                    '&:hover': {
                      border: '1px solid #e9ecef',
                    }
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? themeColors.light : state.isFocused ? themeColors.light : 'white',
                    color: state.isSelected ? themeColors.secondary : themeColors.darkText,
                  }),
                }}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Position *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Enter position"
                  value={newEmployee.position}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, position: e.target.value })
                  }
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={{
                fontWeight: '500',
                color: themeColors.darkText,
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Joining Date *
              </label>
              <div style={{ position: 'relative' }}>
                <FaCalendarAlt style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: themeColors.lightText,
                  zIndex: 1
                }} size={14} />
                <input
                  type="date"
                  value={newEmployee.joiningDate}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, joiningDate: e.target.value })
                  }
                  style={{
                    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                  required
                />
              </div>
            </div>

            {!isEditing && (
              <div className="col-12 col-md-6">
                <label style={{
                  fontWeight: '500',
                  color: themeColors.darkText,
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                    value={newEmployee.password}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, password: e.target.value })
                    }
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      width: '100%',
                      transition: 'all 0.3s ease',
                      fontSize: '0.95rem'
                    }}
                    minLength={6}
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer style={{
          borderTop: '1px solid #e9ecef',
          padding: '1rem 1.5rem'
        }}>
          <Button
            onClick={handleClose}
            style={{
              background: 'white',
              color: themeColors.darkText,
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '0.5rem 1.5rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddOrEdit}
            style={{
              background: themeColors.gradient,
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1.5rem',
              fontWeight: '500',
              boxShadow: '0 4px 10px rgba(52, 152, 219, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(52, 152, 219, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(52, 152, 219, 0.2)';
            }}
          >
            {isEditing ? "Save Changes" : "Add Employee"}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        /* Table Styles */
        .table-responsive.custom-scrollbar {
          /* Custom scrollbar styles */
          &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          &::-webkit-scrollbar-thumb {
            background: ${themeColors.secondary};
            border-radius: 10px;
            opacity: 0.7;
          }

          &::-webkit-scrollbar-thumb:hover {
            background: ${themeColors.primary};
          }

          /* Firefox */
          scrollbar-width: thin;
          scrollbar-color: ${themeColors.secondary} #f1f1f1;
        }

        .table {
          border-collapse: separate;
          border-spacing: 0;
        }

        /* Sticky header styles */
        thead {
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        /* Add a subtle shadow when scrolling */
        .custom-scrollbar.scrolling thead {
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .table tr:hover {
          background-color: ${themeColors.lightBg};
        }

        /* Responsive Styles */
        @media (max-width: 992px) {
          .table-responsive {
            margin: 0 -1rem;
          }

          .table th, .table td {
            white-space: nowrap;
          }
        }

        @media (max-width: 768px) {
          .search-container {
            max-width: 100% !important;
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 576px) {
          .table-responsive {
            margin: 0 -1rem;
          }
        }

        /* Form Input Focus Styles */
        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
          border-color: ${themeColors.secondary} !important;
        }

        /* Select Component Custom Styles */
        .select__control {
          border-radius: 8px !important;
          border: 1px solid #e9ecef !important;
          min-height: 38px !important;
          box-shadow: none !important;
        }

        .select__control:hover {
          border-color: ${themeColors.secondary} !important;
        }

        .select__control--is-focused {
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15) !important;
          border-color: ${themeColors.secondary} !important;
        }

        .select__menu {
          border-radius: 8px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
          overflow: hidden;
        }

        .select__option--is-selected {
          background-color: ${themeColors.light} !important;
          color: ${themeColors.secondary} !important;
        }

        .select__option--is-focused:not(.select__option--is-selected) {
          background-color: rgba(52, 152, 219, 0.05) !important;
          color: ${themeColors.darkText} !important;
        }

        /* Animation for table rows */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        tr {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </Container>
  );
};

export default Employees;
