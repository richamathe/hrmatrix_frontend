import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Dropdown, Modal, Row, Col } from 'react-bootstrap';
import { Search, Building, Edit, Trash2, MoreVertical, Eye, Plus, Users } from 'lucide-react';
import themeColors from '../../theme/colors';

const DepartmentManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Mock department data
  const departments = [
    { 
      id: 1, 
      name: 'Human Resources', 
      description: 'Manages employee relations and HR processes', 
      employeeCount: 30,
      manager: 'Jane Smith',
      location: 'Headquarters - Floor 3',
      createdAt: '2020-01-15'
    },
    { 
      id: 2, 
      name: 'Engineering', 
      description: 'Software development and technical operations', 
      employeeCount: 85,
      manager: 'Michael Chen',
      location: 'Tech Building - Floor 2',
      createdAt: '2020-01-15'
    },
    { 
      id: 3, 
      name: 'Finance', 
      description: 'Financial operations and accounting', 
      employeeCount: 25,
      manager: 'Robert Johnson',
      location: 'Headquarters - Floor 4',
      createdAt: '2020-01-20'
    },
    { 
      id: 4, 
      name: 'Marketing', 
      description: 'Brand management and marketing campaigns', 
      employeeCount: 40,
      manager: 'Emily Davis',
      location: 'Creative Building - Floor 1',
      createdAt: '2020-02-10'
    },
    { 
      id: 5, 
      name: 'Operations', 
      description: 'Day-to-day business operations', 
      employeeCount: 35,
      manager: 'David Miller',
      location: 'Headquarters - Floor 2',
      createdAt: '2020-03-05'
    },
    { 
      id: 6, 
      name: 'Sales', 
      description: 'Sales and client relationship management', 
      employeeCount: 45,
      manager: 'Jennifer Taylor',
      location: 'Sales Building - Floor 1',
      createdAt: '2020-03-15'
    },
    { 
      id: 7, 
      name: 'IT Support', 
      description: 'Technical support and infrastructure management', 
      employeeCount: 20,
      manager: 'Thomas Anderson',
      location: 'Tech Building - Floor 1',
      createdAt: '2020-04-01'
    },
    { 
      id: 8, 
      name: 'Research & Development', 
      description: 'Product research and innovation', 
      employeeCount: 30,
      manager: 'Sarah Johnson',
      location: 'R&D Building',
      createdAt: '2020-05-10'
    }
  ];

  const handleOpenModal = (type, department = null) => {
    setModalType(type);
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDepartment(null);
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
          }}>Department Management</h2>
          <p className="text-muted mb-0">Manage company departments and structure</p>
        </div>
        <div>
          <Button 
            style={{ 
              background: themeColors.gradient,
              border: 'none'
            }}
            onClick={() => handleOpenModal('add')}
          >
            <Plus size={16} className="me-2" /> Add Department
          </Button>
        </div>
      </div>

      {/* Department Stats */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6} sm={12}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle p-2 p-sm-3 me-3" style={{
                  background: themeColors.light,
                  boxShadow: `0 2px 6px ${themeColors.border}`
                }}>
                  <Building size={20} style={{ color: themeColors.primary }} />
                </div>
                <div>
                  <h6 className="card-title mb-0" style={{ fontWeight: 500 }}>Total Departments</h6>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="mb-0 fw-bold" style={{ color: themeColors.primary }}>{departments.length}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} sm={12}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle p-2 p-sm-3 me-3" style={{
                  background: 'rgba(46, 204, 113, 0.1)',
                  boxShadow: '0 2px 6px rgba(46, 204, 113, 0.2)'
                }}>
                  <Users size={20} style={{ color: '#27ae60' }} />
                </div>
                <div>
                  <h6 className="card-title mb-0" style={{ fontWeight: 500 }}>Total Employees</h6>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="mb-0 fw-bold" style={{ color: '#27ae60' }}>
                  {departments.reduce((total, dept) => total + dept.employeeCount, 0)}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={12} sm={12}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 p-sm-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle p-2 p-sm-3 me-3" style={{
                  background: themeColors.light,
                  boxShadow: `0 2px 6px ${themeColors.border}`
                }}>
                  <Building size={20} style={{ color: themeColors.primary }} />
                </div>
                <div>
                  <h6 className="card-title mb-0" style={{ fontWeight: 500 }}>Department Distribution</h6>
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {departments.map(dept => (
                  <Badge 
                    key={dept.id} 
                    className="py-2 px-3"
                    style={{ 
                      backgroundColor: themeColors.light, 
                      color: themeColors.primary,
                      fontWeight: 'normal'
                    }}
                  >
                    {dept.name}: {dept.employeeCount}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
                  placeholder="Search departments..."
                  style={{ borderLeft: 'none' }}
                />
              </InputGroup>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Departments Table */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4">Department</th>
                  <th className="border-0 py-3">Description</th>
                  <th className="border-0 py-3">Manager</th>
                  <th className="border-0 py-3">Employees</th>
                  <th className="border-0 py-3">Location</th>
                  <th className="border-0 py-3 pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(department => (
                  <tr key={department.id}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{
                          width: '40px',
                          height: '40px',
                          background: themeColors.light,
                          color: themeColors.primary,
                          fontWeight: 'bold'
                        }}>
                          <Building size={18} />
                        </div>
                        <div className="fw-medium" style={{ color: themeColors.primary }}>{department.name}</div>
                      </div>
                    </td>
                    <td>{department.description}</td>
                    <td>{department.manager}</td>
                    <td>
                      <Badge bg="secondary" className="rounded-pill">{department.employeeCount}</Badge>
                    </td>
                    <td>{department.location}</td>
                    <td className="pe-4 text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="light" size="sm" className="border-0 bg-transparent" id={`dropdown-${department.id}`}>
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleOpenModal('view', department)}>
                            <Eye size={14} className="me-2" /> View Details
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleOpenModal('edit', department)}>
                            <Edit size={14} className="me-2" /> Edit Department
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="text-danger" onClick={() => handleOpenModal('delete', department)}>
                            <Trash2 size={14} className="me-2" /> Delete Department
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
        <Card.Footer className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted">Showing 1 to {departments.length} of {departments.length} entries</small>
            </div>
            <div>
              <Button variant="outline-secondary" size="sm" disabled>Previous</Button>
              <Button variant="primary" size="sm" className="ms-2" disabled>Next</Button>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Modal for Add/Edit/View/Delete Department */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'add' && 'Add New Department'}
            {modalType === 'edit' && 'Edit Department'}
            {modalType === 'view' && 'Department Details'}
            {modalType === 'delete' && 'Confirm Delete'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'delete' ? (
            <p>Are you sure you want to delete the department "{selectedDepartment?.name}"? This action cannot be undone and may affect {selectedDepartment?.employeeCount} employees.</p>
          ) : (
            <p className="text-center text-muted">
              This is a placeholder for the {modalType} department form. In a real implementation, this would include fields for department details.
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
              {modalType === 'add' && 'Add Department'}
              {modalType === 'edit' && 'Save Changes'}
              {modalType === 'delete' && 'Delete Department'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
