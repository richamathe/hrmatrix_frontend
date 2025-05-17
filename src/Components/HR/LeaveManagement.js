import React, { useState, useEffect } from "react";
import {
  Button, Card, Row, Col, Table, Badge, Form,
  Modal, Alert, Tabs, Tab, Spinner, InputGroup
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Calendar, Filter, Search, CheckCircle, XCircle, Download, Bell } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import notificationService from '../../services/notificationService';
import { leaveService } from '../../services/leaveService';
import themeColors from '../../theme/colors';

const LeaveManagement = () => {
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('requests');

  // Selected leave request for review
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  // Filters
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Manual leave adjustment
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState({
    employeeId: '',
    leaveType: 'Casual Leave',
    days: 1,
    operation: 'add',
    reason: ''
  });

  // Load leave data
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        // Get all leave requests from backend
        const response = await leaveService.getAllLeaves();
        setLeaveRequests(response.data.leaves);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        toast.error('Failed to load leave requests');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle leave request status update
  const handleStatusUpdate = async (status) => {
    if (!selectedLeave) return;

    try {
      // Update leave request status via backend
      const response = await leaveService.updateLeaveStatus(
        selectedLeave._id,
        status
      );

      // Update leave requests list in UI
      setLeaveRequests(prev =>
        prev.map(item =>
          item._id === selectedLeave._id
            ? response.data.leave
            : item
        )
      );

      // Reset and close modal
      setReviewComment('');
      setShowReviewModal(false);

      toast.success(`Leave request ${status.toLowerCase()} successfully. Employee has been notified.`);
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error(error.message || 'There was an error updating the leave request status.');
    }
  };

  // Handle leave balance adjustment
  const handleAdjustLeaveBalance = async () => {
    try {
      // Validate employee ID
      if (!adjustmentData.employeeId.trim()) {
        toast.error('Please enter a valid Employee ID');
        return;
      }

      // Create notification message
      const operation = adjustmentData.operation === 'add' ? 'increased' : 'decreased';
      const message = `Your ${adjustmentData.leaveType} balance has been ${operation} by ${adjustmentData.days} day(s). ${adjustmentData.reason ? `Reason: ${adjustmentData.reason}` : ''}`;

      // Send notification to the employee
      await notificationService.addNotification({
        employeeId: adjustmentData.employeeId,
        type: 'leave',
        title: 'Leave Balance Updated',
        message
      });

      // Show success message
      toast.success(`Leave balance ${operation} successfully. Employee has been notified.`);

      // Reset form and close modal
      setAdjustmentData({
        employeeId: '',
        leaveType: 'Casual Leave',
        days: 1,
        operation: 'add',
        reason: ''
      });
      setShowAdjustmentModal(false);
    } catch (error) {
      console.error('Error adjusting leave balance:', error);
      toast.error('There was an error adjusting the leave balance.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  // Map backend leave data to frontend-friendly fields
  const mappedLeaveRequests = leaveRequests.map(lr => ({
    ...lr,
    employeeName: lr.user?.name || '',
    employeeId: lr.user?._id || '',
    department: lr.user?.department || '',
    leaveType: lr.type,
    fromDate: lr.from_date,
    toDate: lr.to_date,
    appliedOn: lr.applied_on,
  }));

  // Filter leave requests
  const filteredLeaveRequests = mappedLeaveRequests.filter(request => {
    // Search filter
    const nameMatch = request.employeeName?.toLowerCase().includes(search.toLowerCase()) || false;
    const idMatch = request.employeeId?.toString().includes(search) || false;
    const searchMatch = search === "" || nameMatch || idMatch;

    // Date filter
    let dateMatch = true;
    if (dateFilter) {
      const filterDate = dateFilter.toISOString().split('T')[0];
      const fromDate = request.fromDate || '';
      const toDate = request.toDate || '';
      dateMatch = (fromDate <= filterDate && toDate >= filterDate);
    }

    // Department filter
    const departmentMatch = departmentFilter === "" || request.department === departmentFilter;

    // Status filter
    const statusMatch = statusFilter === "" || request.status === statusFilter;

    return searchMatch && dateMatch && departmentMatch && statusMatch;
  });

  // Export leave data to CSV
  const exportToCSV = () => {
    try {
      // Create CSV content
      const headers = ['Employee ID', 'Name', 'Department', 'Leave Type', 'From Date', 'To Date', 'Days', 'Status', 'Applied On', 'Reason'];
      const csvContent = [
        headers.join(','),
        ...filteredLeaveRequests.map(leave => [
          leave.employeeId || '',
          `"${leave.employeeName || ''}"`,
          `"${leave.department || 'Unknown'}"`,
          `"${leave.leaveType || ''}"`,
          leave.fromDate || '',
          leave.toDate || '',
          leave.days || 1,
          leave.status || '',
          leave.appliedOn || '',
          `"${(leave.reason || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leave_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export report');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setDateFilter(null);
    setDepartmentFilter("");
    setStatusFilter("");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="title">Leave Management</h4>
        <div>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setShowAdjustmentModal(true)}
          >
            Adjust Leave Balance
          </Button>
          <Button
            variant="outline-success"
            className="me-2"
            onClick={exportToCSV}
          >
            <Download size={16} className="me-1" />
            Export
          </Button>
          <Button
            variant="outline-secondary"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="requests" title="Leave Requests">
              {/* Filters */}
              <Row className="mb-4 align-items-end">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <DatePicker
                      selected={dateFilter}
                      onChange={(date) => setDateFilter(date)}
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                      isClearable
                      placeholderText="Select date"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="">All Departments</option>
                      <option value="HR">HR</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Design">Design</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text>
                      <Search size={16} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name or ID"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </Col>
              </Row>

              {/* Leave Requests Table */}
              <div className="table-responsive">
                <Table hover>
                  <thead className="table-bg">
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Leave Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Applied On</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaveRequests.length > 0 ? (
                      filteredLeaveRequests.map((request, index) => (
                        <tr key={request._id || index}>
                          <td>{request.employeeName || ''}</td>
                          <td>{request.department || 'Unknown'}</td>
                          <td>{request.leaveType || ''}</td>
                          <td>{formatDate(request.fromDate)}</td>
                          <td>{formatDate(request.toDate)}</td>
                          <td>{request.days || 1}</td>
                          <td>{request.reason || ''}</td>
                          <td>{formatDate(request.appliedOn)}</td>
                          <td>
                            {request.status === 'Approved' && (
                              <Badge bg="success">Approved</Badge>
                            )}
                            {request.status === 'Pending' && (
                              <Badge bg="warning">Pending</Badge>
                            )}
                            {request.status === 'Rejected' && (
                              <Badge bg="danger">Rejected</Badge>
                            )}
                          </td>
                          <td>
                            {request.status === 'Pending' ? (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedLeave(request);
                                  setShowReviewModal(true);
                                }}
                              >
                                Review
                              </Button>
                            ) : (
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  setSelectedLeave(request);
                                  setShowReviewModal(true);
                                }}
                              >
                                View
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">No leave requests found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>

            <Tab eventKey="analytics" title="Leave Analytics">
              <Row className="g-3 flex-wrap">
                {/* Summary Cards: Stack on small screens, row on md+ */}
                <Col xs={12} md={4} className="mb-3 mb-md-0">
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Header className="bg-light border-0">
                      <h5 className="mb-0">Leave Status Summary</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-2 text-center">
                        <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                          <div className="d-flex flex-column align-items-center justify-content-center">
                            <div className="rounded-circle bg-warning d-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                              <Calendar className="text-white" size={24} />
                            </div>
                            <h6 className="mb-0">Pending</h6>
                            <h3 className="mb-0 text-warning">{leaveRequests.filter(r => r.status === 'Pending').length}</h3>
                          </div>
                        </Col>
                        <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                          <div className="d-flex flex-column align-items-center justify-content-center">
                            <div className="rounded-circle bg-success d-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                              <CheckCircle className="text-white" size={24} />
                            </div>
                            <h6 className="mb-0">Approved</h6>
                            <h3 className="mb-0 text-success">{leaveRequests.filter(r => r.status === 'Approved').length}</h3>
                          </div>
                        </Col>
                        <Col xs={12} sm={4}>
                          <div className="d-flex flex-column align-items-center justify-content-center">
                            <div className="rounded-circle bg-danger d-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                              <XCircle className="text-white" size={24} />
                            </div>
                            <h6 className="mb-0">Rejected</h6>
                            <h3 className="mb-0 text-danger">{leaveRequests.filter(r => r.status === 'Rejected').length}</h3>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Department Table: Scrollable on small screens */}
                <Col xs={12} md={8}>
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Header className="bg-light border-0">
                      <h5 className="mb-0">Department-wise Leave Distribution</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive" style={{ minHeight: 180 }}>
                        <Table hover className="mb-0 align-middle">
                          <thead>
                            <tr>
                              <th>Department</th>
                              <th>Total Leaves</th>
                              <th>Approved</th>
                              <th>Pending</th>
                              <th>Rejected</th>
                            </tr>
                          </thead>
                          <tbody>
                            {['Engineering', 'HR', 'Marketing', 'Finance', 'Design', 'IT'].map(dept => {
                              const deptLeaves = leaveRequests.filter(r => r.department === dept);
                              const approved = deptLeaves.filter(r => r.status === 'Approved').length;
                              const pending = deptLeaves.filter(r => r.status === 'Pending').length;
                              const rejected = deptLeaves.filter(r => r.status === 'Rejected').length;

                              return deptLeaves.length > 0 ? (
                                <tr key={dept}>
                                  <td>{dept}</td>
                                  <td>{deptLeaves.length}</td>
                                  <td className="text-success fw-bold">{approved}</td>
                                  <td className="text-warning fw-bold">{pending}</td>
                                  <td className="text-danger fw-bold">{rejected}</td>
                                </tr>
                              ) : null;
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Leave Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedLeave?.status === 'Pending' ? 'Review Leave Request' : 'Leave Request Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <>
              <div className="mb-3">
                <h6>Employee Details</h6>
                <p className="mb-1"><strong>Name:</strong> {selectedLeave.employeeName || ''}</p>
                <p className="mb-1"><strong>Department:</strong> {selectedLeave.department || 'Unknown'}</p>
                <p className="mb-1"><strong>Employee ID:</strong> {selectedLeave.employeeId || ''}</p>
              </div>

              <div className="mb-3">
                <h6>Leave Details</h6>
                <p className="mb-1"><strong>Type:</strong> {selectedLeave.leaveType || ''}</p>
                <p className="mb-1"><strong>From:</strong> {formatDate(selectedLeave.fromDate)}</p>
                <p className="mb-1"><strong>To:</strong> {formatDate(selectedLeave.toDate)}</p>
                <p className="mb-1"><strong>Days:</strong> {selectedLeave.days || 1}</p>
                <p className="mb-1"><strong>Applied On:</strong> {formatDate(selectedLeave.appliedOn)}</p>
                <p className="mb-1"><strong>Status:</strong> {selectedLeave.status || ''}</p>
              </div>

              <div className="mb-3">
                <h6>Reason</h6>
                <p className="p-2 bg-light rounded">{selectedLeave.reason || ''}</p>
              </div>

              {selectedLeave.status !== 'Pending' && selectedLeave.comments && (
                <div className="mb-3">
                  <h6>Comments</h6>
                  <p className="p-2 bg-light rounded">{selectedLeave.comments}</p>
                </div>
              )}

              {selectedLeave.status === 'Pending' && (
                <Form.Group className="mb-3">
                  <Form.Label>Comments (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add comments for the employee"
                  />
                </Form.Group>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>

          {selectedLeave?.status === 'Pending' && (
            <>
              <Button
                variant="danger"
                className="me-2"
                onClick={() => handleStatusUpdate('Rejected')}
              >
                Reject
              </Button>
              <Button
                variant="success"
                onClick={() => handleStatusUpdate('Approved')}
              >
                Approve
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Leave Balance Adjustment Modal */}
      <Modal show={showAdjustmentModal} onHide={() => setShowAdjustmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adjust Leave Balance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="text"
                value={adjustmentData.employeeId}
                onChange={(e) => setAdjustmentData({...adjustmentData, employeeId: e.target.value})}
                placeholder="Enter employee ID"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select
                value={adjustmentData.leaveType}
                onChange={(e) => setAdjustmentData({...adjustmentData, leaveType: e.target.value})}
                required
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Operation</Form.Label>
                  <Form.Select
                    value={adjustmentData.operation}
                    onChange={(e) => setAdjustmentData({...adjustmentData, operation: e.target.value})}
                    required
                  >
                    <option value="add">Add Days</option>
                    <option value="subtract">Subtract Days</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Number of Days</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={adjustmentData.days}
                    onChange={(e) => setAdjustmentData({...adjustmentData, days: parseInt(e.target.value) || 1})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData({...adjustmentData, reason: e.target.value})}
                placeholder="Reason for adjustment"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdjustmentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdjustLeaveBalance}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeaveManagement;
