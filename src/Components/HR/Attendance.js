import React, { useState, useEffect } from "react";
import {
  Button, Card, Row, Col, Table, Badge, Form,
  Modal, Alert, Tabs, Tab, Spinner, Dropdown, InputGroup
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { attendanceService } from '../../services/attendanceService';
import {
  Calendar, Filter, Search, CheckCircle, XCircle, Clock,
  Users, FileText, AlertCircle, User, Briefcase, Calendar as CalendarIcon
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import themeColors from '../../theme/colors';

// Create a style element for custom styles
const createAttendanceStyles = (themeColors) => {
  const style = document.createElement('style');
  style.textContent = `
    /* Custom scrollbar styles */
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${themeColors.secondary};
      border-radius: 10px;
      opacity: 0.7;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${themeColors.primary};
    }

    /* Firefox */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: ${themeColors.secondary} #f1f1f1;
    }

    /* Sticky header styles */
    thead {
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    /* Add a subtle shadow when scrolling */
    .custom-scrollbar.scrolling thead {
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    /* Table styles */
    .table {
      border-collapse: separate;
      border-spacing: 0;
    }

    .table tr:hover {
      background-color: ${themeColors.lightBg};
    }

    /* Tab styles */
    .nav-tabs .nav-link {
      color: ${themeColors.lightText};
      border: none;
      padding: 0.75rem 1.25rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .nav-tabs .nav-link:hover {
      color: ${themeColors.primary};
      background: transparent;
    }

    .nav-tabs .nav-link.active {
      color: ${themeColors.secondary};
      background: transparent;
      border-bottom: 2px solid ${themeColors.secondary};
    }

    /* Animation for table rows */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    tr {
      animation: fadeIn 0.3s ease-out forwards;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
      .custom-scrollbar {
        max-height: 50vh !important;
      }
    }
  `;
  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
};

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');

  // Filters
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date());
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Apply styles when component mounts
  useEffect(() => {
    const cleanup = createAttendanceStyles(themeColors);
    return cleanup;
  }, []);

  // Load attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);

        // Format date for API
        const formattedDate = dateFilter ? dateFilter.toISOString().split('T')[0] : '';

        // Get attendance records
        const response = await attendanceService.getAllAttendance(
          formattedDate,
          departmentFilter,
          statusFilter
        );
        setAttendanceRecords(response.data.records);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error('Failed to load attendance data');
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [dateFilter, departmentFilter, statusFilter]);

  // Filter attendance records
  const filteredAttendanceRecords = attendanceRecords.filter(record => {
    const nameMatch = record.employee_name?.toLowerCase().includes(search.toLowerCase());
    const idMatch = record.employee_id?.toString().includes(search);

    return nameMatch || idMatch;
  });

  // Calculate total working hours for displayed records
  const calculateTotalWorkingHours = () => {
    let totalMinutes = 0;

    filteredAttendanceRecords.forEach(record => {
      if (record.checkIn && record.checkOut) {
        const workingHoursData = attendanceService.calculateWorkingHours(record.checkIn, record.checkOut);
        if (workingHoursData) {
          totalMinutes += (workingHoursData.hours * 60) + workingHoursData.minutes;
        }
      }
    });

    // Convert to hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      hours,
      minutes,
      formatted: `${hours}h ${minutes}m`,
      totalHours: parseFloat((totalMinutes / 60).toFixed(1))
    };
  };

  const totalWorkingHours = calculateTotalWorkingHours();

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setDateFilter(new Date());
    setDepartmentFilter("");
    setStatusFilter("");
  };

  // Add scroll detection for table shadow effect
  useEffect(() => {
    const tableContainers = document.querySelectorAll('.custom-scrollbar');
    if (tableContainers.length > 0) {
      const handleScroll = (e) => {
        if (e.target.scrollTop > 0) {
          e.target.classList.add('scrolling');
        } else {
          e.target.classList.remove('scrolling');
        }
      };

      tableContainers.forEach(container => {
        container.addEventListener('scroll', handleScroll);
      });

      return () => {
        tableContainers.forEach(container => {
          container.removeEventListener('scroll', handleScroll);
        });
      };
    }
  }, [filteredAttendanceRecords]);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner
          animation="border"
          style={{
            color: themeColors.secondary,
            width: '3rem',
            height: '3rem'
          }}
        />
        <p className="mt-3" style={{ color: themeColors.lightText }}>Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div>
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
                <Clock size={22} style={{ color: themeColors.secondary }} />
              </div>
              <div>
                <h4 style={{
                  fontWeight: '700',
                  color: themeColors.primary,
                  margin: 0,
                  fontSize: '1.5rem'
                }}>
                  Attendance Management
                </h4>
                <p style={{
                  color: themeColors.lightText,
                  margin: '4px 0 0 0',
                  fontSize: '0.9rem'
                }}>
                  Track employee attendance and manage leave requests
                </p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-end mt-3 mt-lg-0 gap-2">
              <Button
                variant="outline-secondary"
                onClick={resetFilters}
                style={{
                  borderRadius: '30px',
                  padding: '8px 16px',
                  border: '1px solid #e9ecef',
                  color: themeColors.darkText,
                  background: 'white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
                className="d-flex align-items-center gap-2"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = themeColors.lightBg;
                  e.currentTarget.style.borderColor = themeColors.border;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e9ecef';
                }}
              >
                <Filter size={16} /> Reset Filters
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        marginBottom: '1.5rem'
      }}>
        <div style={{ padding: '1.5rem 1.5rem 0' }}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-0"
            style={{
              borderBottom: 'none'
            }}
          >
            <Tab
              eventKey="attendance"
              title={
                <div className="d-flex align-items-center gap-2">
                  <Clock size={18} />
                  <span>Daily Attendance</span>
                </div>
              }
              tabClassName="border-0"
            >
              {/* Summary Cards */}
              <div className="mb-4 mt-4">
                <Row>
                  <Col md={4} className="mb-3 mb-md-0">
                    <div style={{
                      background: 'white',
                      borderRadius: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      padding: '1.25rem',
                      height: '100%',
                      border: '1px solid #e9ecef'
                    }}>
                      <div className="d-flex align-items-center">
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '10px',
                          background: themeColors.light,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '1rem'
                        }}>
                          <Clock size={24} style={{ color: themeColors.secondary }} />
                        </div>
                        <div>
                          <h6 style={{
                            margin: 0,
                            color: themeColors.lightText,
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}>Total Working Hours</h6>
                          <div className="d-flex align-items-baseline">
                            <h3 style={{
                              margin: '0.25rem 0 0 0',
                              color: themeColors.primary,
                              fontWeight: '700'
                            }}>{totalWorkingHours.totalHours}</h3>
                            <small style={{
                              color: themeColors.lightText,
                              marginLeft: '0.25rem'
                            }}>hours</small>
                          </div>
                          <small style={{
                            color: themeColors.lightText,
                            fontSize: '0.75rem'
                          }}>For selected date: {totalWorkingHours.formatted}</small>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3 mb-md-0">
                    <div style={{
                      background: 'white',
                      borderRadius: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      padding: '1.25rem',
                      height: '100%',
                      border: '1px solid #e9ecef'
                    }}>
                      <div className="d-flex align-items-center">
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '10px',
                          background: themeColors.success,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '1rem'
                        }}>
                          <CheckCircle size={24} style={{ color: themeColors.successText }} />
                        </div>
                        <div>
                          <h6 style={{
                            margin: 0,
                            color: themeColors.lightText,
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}>Present Employees</h6>
                          <div className="d-flex align-items-baseline">
                            <h3 style={{
                              margin: '0.25rem 0 0 0',
                              color: themeColors.primary,
                              fontWeight: '700'
                            }}>{filteredAttendanceRecords.filter(r => r.status === 'Present').length}</h3>
                          </div>
                          <small style={{
                            color: themeColors.lightText,
                            fontSize: '0.75rem'
                          }}>Out of {filteredAttendanceRecords.length} employees</small>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div style={{
                      background: 'white',
                      borderRadius: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      padding: '1.25rem',
                      height: '100%',
                      border: '1px solid #e9ecef'
                    }}>
                      <div className="d-flex align-items-center">
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '10px',
                          background: themeColors.warning,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '1rem'
                        }}>
                          <AlertCircle size={24} style={{ color: themeColors.warningText }} />
                        </div>
                        <div>
                          <h6 style={{
                            margin: 0,
                            color: themeColors.lightText,
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}>Absent/Late</h6>
                          <div className="d-flex align-items-baseline">
                            <h3 style={{
                              margin: '0.25rem 0 0 0',
                              color: themeColors.primary,
                              fontWeight: '700'
                            }}>{filteredAttendanceRecords.filter(r => r.status === 'Absent' || r.status === 'Late' || r.status === 'Leave').length}</h3>
                          </div>
                          <small style={{
                            color: themeColors.lightText,
                            fontSize: '0.75rem'
                          }}>Including leaves and late arrivals</small>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Filters */}
              <div style={{
                background: themeColors.lightBg,
                borderRadius: '10px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <Row className="align-items-end">
                  <Col md={3} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label style={{
                        fontWeight: '500',
                        color: themeColors.darkText,
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>Date</Form.Label>
                      <div style={{ position: 'relative' }}>
                        <CalendarIcon style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: themeColors.lightText,
                          zIndex: 1
                        }} size={16} />
                        <DatePicker
                          selected={dateFilter}
                          onChange={(date) => setDateFilter(date)}
                          dateFormat="yyyy-MM-dd"
                          style={{
                            padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                            borderRadius: '8px',
                            border: '1px solid #e9ecef',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            fontSize: '0.95rem'
                          }}
                          className="form-control ps-4"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label style={{
                        fontWeight: '500',
                        color: themeColors.darkText,
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>Department</Form.Label>
                      <div style={{ position: 'relative' }}>
                        <Briefcase style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: themeColors.lightText,
                          zIndex: 1
                        }} size={16} />
                        <Form.Select
                          value={departmentFilter}
                          onChange={(e) => setDepartmentFilter(e.target.value)}
                          style={{
                            padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                            borderRadius: '8px',
                            border: '1px solid #e9ecef',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            fontSize: '0.95rem'
                          }}
                        >
                          <option value="">All Departments</option>
                          <option value="HR">HR</option>
                          <option value="Development">Development</option>
                          <option value="Design">Design</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Finance">Finance</option>
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label style={{
                        fontWeight: '500',
                        color: themeColors.darkText,
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>Status</Form.Label>
                      <div style={{ position: 'relative' }}>
                        <FileText style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: themeColors.lightText,
                          zIndex: 1
                        }} size={16} />
                        <Form.Select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          style={{
                            padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                            borderRadius: '8px',
                            border: '1px solid #e9ecef',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            fontSize: '0.95rem'
                          }}
                        >
                          <option value="">All Status</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                          <option value="Leave">Leave</option>
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <div style={{ position: 'relative' }}>
                      <Search style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: themeColors.lightText,
                        zIndex: 1
                      }} size={16} />
                      <Form.Control
                        type="text"
                        placeholder="Search by name or ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                  </Col>
                </Row>
              </div>

              {/* Attendance Table */}
              <div className="table-responsive custom-scrollbar" style={{
                maxHeight: '55vh',
                overflowY: 'auto'
              }}>
                <Table hover style={{ marginBottom: 0 }}>
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
                      }}>S.No</th>
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
                      }}>Employee ID</th>
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
                      }}>Check In</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Check Out</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Status</th>
                      <th style={{
                        padding: '15px 20px',
                        fontWeight: '600',
                        color: themeColors.primary,
                        borderBottom: `1px solid ${themeColors.border}`,
                        borderTop: 'none'
                      }}>Working Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendanceRecords.length > 0 ? (
                      filteredAttendanceRecords.map((record, index) => {
                        // Calculate working hours
                        let workingHours = '';
                        if (record.checkIn && record.checkOut) {
                          const workingHoursData = attendanceService.calculateWorkingHours(record.checkIn, record.checkOut);
                          workingHours = workingHoursData ? workingHoursData.formatted : '-';
                        }

                        return (
                          <tr key={record._id || index} style={{
                            transition: 'all 0.2s ease',
                            borderBottom: '1px solid #f0f0f0'
                          }}>
                            <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{index + 1}</td>
                            <td style={{ padding: '15px 20px' }}>
                              <div className="d-flex align-items-center">
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '8px',
                                  background: themeColors.light,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: '12px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: themeColors.secondary
                                }}>
                                  {record.employee_name ? record.employee_name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <p style={{
                                    margin: 0,
                                    fontWeight: '600',
                                    color: themeColors.primary
                                  }}>{record.employee_name}</p>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{record.employee_id}</td>
                            <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{record.department}</td>
                            <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{record.checkIn ? attendanceService.formatTimeForDisplay(record.checkIn) : '-'}</td>
                            <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{record.checkOut ? attendanceService.formatTimeForDisplay(record.checkOut) : '-'}</td>
                            <td style={{ padding: '15px 20px' }}>
                              {record.status === 'Present' && (
                                <span style={{
                                  padding: '5px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  background: themeColors.success,
                                  color: themeColors.successText,
                                  display: 'inline-block'
                                }}>Present</span>
                              )}
                              {record.status === 'Absent' && (
                                <span style={{
                                  padding: '5px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  background: themeColors.danger,
                                  color: themeColors.dangerText,
                                  display: 'inline-block'
                                }}>Absent</span>
                              )}
                              {record.status === 'Late' && (
                                <span style={{
                                  padding: '5px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  background: themeColors.warning,
                                  color: themeColors.warningText,
                                  display: 'inline-block'
                                }}>Late</span>
                              )}
                              {record.status === 'Leave' && (
                                <span style={{
                                  padding: '5px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  background: themeColors.light,
                                  color: themeColors.secondary,
                                  display: 'inline-block'
                                }}>Leave</span>
                              )}
                            </td>
                            <td style={{ padding: '15px 20px', color: themeColors.darkText }}>{workingHours || '-'}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
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
                            <Clock size={30} style={{ color: themeColors.secondary }} />
                          </div>
                          <h5 style={{ color: themeColors.primary, fontWeight: '600' }}>No Attendance Records Found</h5>
                          <p style={{ color: themeColors.lightText }}>
                            Try changing the filters or date selection
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
