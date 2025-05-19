import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Dropdown, Modal, Spinner } from 'react-bootstrap';
import { Search, Filter, UserPlus, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import themeColors from '../../theme/colors';
import { userService } from '../../services/userService';

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    password: '',
    designation: '',
    mobile: '',
    gender: '',
    dob: '',
    joiningDate: '',
    address: '',
    position: 'Staff',
    salary: 30000
  });

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      console.log('API Response:', response);
      // Transform the data to match our UI requirements
      const transformedUsers = (response.employees || []).map(employee => ({
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role || 'employee', // Default role if not provided
        department: employee.department,
        status: employee.status || 'Active', // Default status if not provided
        lastLogin: employee.lastLogin || 'Never',
        dob: employee.dob,
        profilePhoto: employee.profilePhoto,
        designation: employee.designation,
        mobile: employee.mobile,
        gender: employee.gender,
        joiningDate: employee.joiningDate,
        address: employee.address
      }));
      setUsers(transformedUsers);
      console.log('Transformed Users:', transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (type === 'edit' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        password: '', // Don't set password for edit
        designation: user.designation || '',
        mobile: user.mobile || '',
        gender: user.gender || '',
        dob: user.dob || '',
        joiningDate: user.joiningDate || '',
        address: user.address || '',
        position: user.position || 'Staff',
        salary: user.salary || 30000
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        department: '',
        password: '',
        designation: '',
        mobile: '',
        gender: '',
        dob: '',
        joiningDate: '',
        address: '',
        position: 'Staff',
        salary: 30000
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      password: '',
      designation: '',
      mobile: '',
      gender: '',
      dob: '',
      joiningDate: '',
      address: '',
      position: 'Staff',
      salary: 30000
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        await userService.createUser(formData);
        toast.success('User created successfully');
      } else if (modalType === 'edit') {
        await userService.updateUser(selectedUser._id, formData);
        toast.success('User updated successfully');
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error('Operation error:', error);
      if (error.message && error.message.includes('not authorized')) {
        toast.error('You do not have permission to perform this action');
      } else {
        toast.error(error.message || 'Operation failed');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await userService.deleteUser(selectedUser._id);
      toast.success('User deleted successfully');
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error('Delete error:', error);
      if (error.message && error.message.includes('not authorized')) {
        toast.error('You do not have permission to delete users');
      } else {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await userService.updateUserStatus(userId, newStatus);
      toast.success('User status updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Status update error:', error);
      if (error.message && error.message.includes('not authorized')) {
        toast.error('You do not have permission to update user status');
      } else {
        toast.error(error.message || 'Failed to update status');
      }
    }
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

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesDepartment = !departmentFilter || user.department === departmentFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" style={{ color: themeColors.primary }} />
      </div>
    );
  }

  return (
    <div className="px-3 px-md-4 py-3 py-md-4">
      {/* Page Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="fw-bold fs-4 fs-md-3" style={{
            background: themeColors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>User Management</h2>
          <p className="text-muted mb-0 small">Manage system users and their access</p>
        </div>
        <div>
          <Button
            style={{
              background: themeColors.gradient,
              border: 'none'
            }}
            onClick={() => handleOpenModal('add')}
            className="btn-sm btn-md-lg w-100 w-md-auto"
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderLeft: 'none' }}
                />
              </InputGroup>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex flex-wrap gap-2">
                <div className="flex-grow-1">
                  <Form.Select 
                    size="sm"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                  </Form.Select>
                </div>
                <div className="flex-grow-1">
                  <Form.Select 
                    size="sm"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                  </Form.Select>
                </div>
                <div className="flex-grow-1">
                  <Form.Select 
                    size="sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
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
                {filteredUsers.map(user => (
                  <tr key={user._id}>
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
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm" className="border-0 bg-transparent p-0">
                          {getStatusBadge(user.status)}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleStatusChange(user._id, 'Active')}>
                            Set Active
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleStatusChange(user._id, 'Inactive')}>
                            Set Inactive
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
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
                          <Dropdown.Toggle variant="light" size="sm" className="border-0 bg-transparent" id={`dropdown-${user._id}`}>
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
              <small className="text-muted">Showing {filteredUsers.length} of {users.length} entries</small>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Modal for Add/Edit/View/Delete User */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="modal-dialog-scrollable">
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
          ) : modalType === 'view' ? (
            <div className="row g-3">
              <div className="col-md-6">
                <p className="mb-1 text-muted">Name</p>
                <p className="mb-3">{selectedUser?.name}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted">Email</p>
                <p className="mb-3">{selectedUser?.email}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted">Role</p>
                <p className="mb-3">{selectedUser?.role}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted">Department</p>
                <p className="mb-3">{selectedUser?.department}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted">Status</p>
                <p className="mb-3">{selectedUser?.status}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted">Last Login</p>
                <p className="mb-3">{selectedUser?.lastLogin}</p>
              </div>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="employee">Employee</option>
                      <option value="hr">HR</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      name="department"
                      value={formData.department}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="HR">HR</option>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Sales">Sales</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Designation</Form.Label>
                    <Form.Control
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleFormChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleFormChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleFormChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Joining Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleFormChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleFormChange}
                      defaultValue="Staff"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleFormChange}
                      defaultValue={30000}
                      min={0}
                    />
                  </Form.Group>
                </div>
                <div className="col-12">
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      required
                    />
                  </Form.Group>
                </div>
                {modalType === 'add' && (
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormChange}
                        required
                        minLength={6}
                      />
                    </Form.Group>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="py-2 py-sm-3">
          {modalType === 'delete' ? (
            <>
              <Button variant="light" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </>
          ) : modalType === 'view' ? (
            <Button variant="light" onClick={handleCloseModal}>Close</Button>
          ) : (
            <>
              <Button variant="light" onClick={handleCloseModal}>Cancel</Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                style={{
                  background: themeColors.gradient,
                  border: 'none'
                }}
              >
                {modalType === 'add' ? 'Add User' : 'Save Changes'}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
