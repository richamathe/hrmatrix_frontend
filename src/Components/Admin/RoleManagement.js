import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Dropdown, Modal } from 'react-bootstrap';
import { Search, Shield, Edit, Trash2, MoreVertical, Eye, Plus } from 'lucide-react';
import themeColors from '../../theme/colors';

const RoleManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  // Mock role data
  const roles = [
    { 
      id: 1, 
      name: 'Admin', 
      description: 'Full system access with all privileges', 
      userCount: 15,
      permissions: [
        'User Management', 'Role Management', 'Department Management', 
        'System Settings', 'Reports', 'Payroll', 'Attendance', 'Leave Management'
      ]
    },
    { 
      id: 2, 
      name: 'HR', 
      description: 'Human Resources management access', 
      userCount: 30,
      permissions: [
        'Employee Management', 'Attendance', 'Leave Management', 
        'Payroll', 'Reports'
      ]
    },
    { 
      id: 3, 
      name: 'Manager', 
      description: 'Department management access', 
      userCount: 45,
      permissions: [
        'Team Management', 'Attendance', 'Leave Approval', 
        'Reports'
      ]
    },
    { 
      id: 4, 
      name: 'Employee', 
      description: 'Basic employee access', 
      userCount: 158,
      permissions: [
        'Profile', 'Attendance', 'Leave Request', 
        'Payslip View'
      ]
    }
  ];

  const handleOpenModal = (type, role = null) => {
    setModalType(type);
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  return (
    <div>
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{
            background: themeColors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Role Management</h2>
          <p className="text-muted mb-0">Manage system roles and permissions</p>
        </div>
        <div>
          <Button 
            style={{ 
              background: themeColors.gradient,
              border: 'none'
            }}
            onClick={() => handleOpenModal('add')}
          >
            <Plus size={16} className="me-2" /> Add New Role
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <InputGroup>
                <InputGroup.Text style={{ backgroundColor: 'white', borderRight: 'none' }}>
                  <Search size={18} color="#6c757d" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search roles..."
                  style={{ borderLeft: 'none' }}
                />
              </InputGroup>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Roles Table */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4">Role</th>
                  <th className="border-0 py-3">Description</th>
                  <th className="border-0 py-3">Users</th>
                  <th className="border-0 py-3">Permissions</th>
                  <th className="border-0 py-3 pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.id}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{
                          width: '40px',
                          height: '40px',
                          background: themeColors.light,
                          color: themeColors.primary,
                          fontWeight: 'bold'
                        }}>
                          <Shield size={18} />
                        </div>
                        <div className="fw-medium" style={{ color: themeColors.primary }}>{role.name}</div>
                      </div>
                    </td>
                    <td>{role.description}</td>
                    <td>
                      <Badge bg="secondary" className="rounded-pill">{role.userCount} users</Badge>
                    </td>
                    <td>
                      <div style={{ maxWidth: '300px' }}>
                        {role.permissions.slice(0, 3).map((permission, index) => (
                          <Badge 
                            key={index} 
                            className="me-1 mb-1" 
                            style={{ 
                              backgroundColor: themeColors.light, 
                              color: themeColors.primary,
                              fontWeight: 'normal'
                            }}
                          >
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge 
                            className="mb-1" 
                            style={{ 
                              backgroundColor: themeColors.light, 
                              color: themeColors.primary,
                              fontWeight: 'normal'
                            }}
                          >
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="light" size="sm" className="border-0 bg-transparent" id={`dropdown-${role.id}`}>
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleOpenModal('view', role)}>
                            <Eye size={14} className="me-2" /> View Details
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleOpenModal('edit', role)}>
                            <Edit size={14} className="me-2" /> Edit Role
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="text-danger" onClick={() => handleOpenModal('delete', role)}>
                            <Trash2 size={14} className="me-2" /> Delete Role
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal for Add/Edit/View/Delete Role */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'add' && 'Add New Role'}
            {modalType === 'edit' && 'Edit Role'}
            {modalType === 'view' && 'Role Details'}
            {modalType === 'delete' && 'Confirm Delete'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'delete' ? (
            <p>Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone and may affect {selectedRole?.userCount} users.</p>
          ) : (
            <p className="text-center text-muted">
              This is a placeholder for the {modalType} role form. In a real implementation, this would include fields for role details and permission management.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {modalType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {modalType !== 'view' && (
            <Button 
              style={{ 
                background: modalType === 'delete' ? '#e74c3c' : themeColors.gradient,
                border: 'none'
              }}
            >
              {modalType === 'add' && 'Add Role'}
              {modalType === 'edit' && 'Save Changes'}
              {modalType === 'delete' && 'Delete Role'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoleManagement;
