import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Dropdown, Modal } from 'react-bootstrap';
import { Search, Filter, UserPlus, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import themeColors from '../../theme/colors';

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock user data
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', department: 'IT', status: 'Active', lastLogin: '2023-06-10 09:30 AM' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'HR', department: 'Human Resources', status: 'Active', lastLogin: '2023-06-10 10:15 AM' },
    { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', role: 'Employee', department: 'Finance', status: 'Inactive', lastLogin: '2023-06-05 02:45 PM' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Manager', department: 'Marketing', status: 'Active', lastLogin: '2023-06-09 11:20 AM' },
    { id: 5, name: 'Michael Wilson', email: 'michael.wilson@example.com', role: 'Employee', department: 'Engineering', status: 'Active', lastLogin: '2023-06-10 08:45 AM' },
    { id: 6, name: 'Sarah Brown', email: 'sarah.brown@example.com', role: 'HR', department: 'Human Resources', status: 'Active', lastLogin: '2023-06-08 03:30 PM' },
    { id: 7, name: 'David Miller', email: 'david.miller@example.com', role: 'Employee', department: 'Operations', status: 'Inactive', lastLogin: '2023-05-30 01:15 PM' },
    { id: 8, name: 'Jennifer Taylor', email: 'jennifer.taylor@example.com', role: 'Manager', department: 'Sales', status: 'Active', lastLogin: '2023-06-09 09:50 AM' }
  ];

  const handleOpenModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return <Badge bg="success">Active</Badge>;
    } else {
      return <Badge bg="danger">Inactive</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return <Badge style={{ backgroundColor: themeColors.primary }}>{role}</Badge>;
      case 'HR':
        return <Badge style={{ backgroundColor: themeColors.secondary }}>{role}</Badge>;
      case 'Manager':
        return <Badge style={{ backgroundColor: '#2ecc71' }}>{role}</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="fw-bold" style={{
            background: themeColors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>User Management</h2>
          <p className="text-muted mb-0">Manage system users and their access</p>
        </div>
        <div>
          <Button
            style={{
              background: themeColors.gradient,
              border: 'none'
            }}
            onClick={() => handleOpenModal('add')}
            className="btn-sm btn-md-lg"
          >
            <UserPlus size={16} className="me-1 me-sm-2" />
            <span className="d-none d-sm-inline">Add New User</span>
            <span className="d-inline d-sm-none">Add User</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-3 p-sm-4">
          <div className="row g-2 g-md-3">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <InputGroup size="sm">
                <InputGroup.Text style={{ backgroundColor: 'white', borderRight: 'none' }}>
                  <Search size={16} color="#6c757d" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users..."
                  style={{ borderLeft: 'none' }}
                />
              </InputGroup>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex flex-wrap gap-2">
                <div className="flex-grow-1">
                  <Form.Select size="sm">
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                  </Form.Select>
                </div>
                <div className="flex-grow-1">
                  <Form.Select size="sm">
                    <option value="">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                  </Form.Select>
                </div>
                <div className="flex-grow-1">
                  <Form.Select size="sm">
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4">Name</th>
                  <th className="border-0 py-3 d-none d-md-table-cell">Email</th>
                  <th className="border-0 py-3">Role</th>
                  <th className="border-0 py-3 d-none d-lg-table-cell">Department</th>
                  <th className="border-0 py-3">Status</th>
                  <th className="border-0 py-3 d-none d-xl-table-cell">Last Login</th>
                  <th className="border-0 py-3 pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2 me-sm-3" style={{
                          width: '36px',
                          height: '36px',
                          background: themeColors.light,
                          color: themeColors.primary,
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          {user.name.charAt(0)}
                        </div>
                        <div className="text-truncate" style={{ maxWidth: '120px' }}>{user.name}</div>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <div className="text-truncate" style={{ maxWidth: '150px' }}>{user.email}</div>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td className="d-none d-lg-table-cell">{user.department}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td className="d-none d-xl-table-cell">{user.lastLogin}</td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="light"
                          size="sm"
                          className="me-1 d-inline d-md-none p-1"
                          onClick={() => handleOpenModal('view', user)}
                          style={{ width: '30px', height: '30px' }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Dropdown align="end" className="d-none d-md-block">
                          <Dropdown.Toggle variant="light" size="sm" className="border-0 bg-transparent" id={`dropdown-${user.id}`}>
                            <MoreVertical size={16} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleOpenModal('view', user)}>
                              <Eye size={14} className="me-2" /> View Details
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleOpenModal('edit', user)}>
                              <Edit size={14} className="me-2" /> Edit User
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="text-danger" onClick={() => handleOpenModal('delete', user)}>
                              <Trash2 size={14} className="me-2" /> Delete User
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="bg-white py-2 py-sm-3">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
            <div className="mb-2 mb-sm-0">
              <small className="text-muted">Showing 1 to 8 of 8 entries</small>
            </div>
            <div className="d-flex">
              <Button variant="outline-secondary" size="sm" disabled className="py-1 px-2 px-sm-3">
                <span className="d-none d-sm-inline">Previous</span>
                <span className="d-inline d-sm-none">&laquo;</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="ms-2 py-1 px-2 px-sm-3"
                disabled
                style={{ background: themeColors.gradient, border: 'none' }}
              >
                <span className="d-none d-sm-inline">Next</span>
                <span className="d-inline d-sm-none">&raquo;</span>
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Modal for Add/Edit/View/Delete User */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="sm">
        <Modal.Header closeButton className="py-2 py-sm-3">
          <Modal.Title className="fs-5">
            {modalType === 'add' && 'Add New User'}
            {modalType === 'edit' && 'Edit User'}
            {modalType === 'view' && 'User Details'}
            {modalType === 'delete' && 'Confirm Delete'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 p-sm-4">
          {modalType === 'delete' ? (
            <p className="mb-0">Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.</p>
          ) : (
            <p className="text-center text-muted mb-0">
              This is a placeholder for the {modalType} user form. In a real implementation, this would include fields for user details.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="py-2 py-sm-3 border-top-0">
          <Button variant="secondary" size="sm" onClick={handleCloseModal} className="px-3">
            {modalType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {modalType !== 'view' && (
            <Button
              size="sm"
              className="px-3"
              style={{
                background: modalType === 'delete' ? '#e74c3c' : themeColors.gradient,
                border: 'none'
              }}
            >
              {modalType === 'add' && 'Add User'}
              {modalType === 'edit' && 'Save Changes'}
              {modalType === 'delete' && 'Delete User'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
