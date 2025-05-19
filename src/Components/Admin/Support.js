import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Badge, Table, InputGroup } from 'react-bootstrap';
import { 
  Search, 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Send, 
  ChevronRight, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';
import themeColors from '../../theme/colors';

const Support = () => {
  const [activeTab, setActiveTab] = useState('tickets');

  // Mock support tickets
  const supportTickets = [
    { 
      id: 'TKT-001', 
      subject: 'Cannot access payroll module', 
      user: 'John Doe',
      department: 'Finance',
      status: 'Open',
      priority: 'High',
      createdAt: '2023-06-10 09:30 AM',
      lastUpdated: '2023-06-10 11:45 AM'
    },
    { 
      id: 'TKT-002', 
      subject: 'Error when generating reports', 
      user: 'Jane Smith',
      department: 'HR',
      status: 'In Progress',
      priority: 'Medium',
      createdAt: '2023-06-09 02:15 PM',
      lastUpdated: '2023-06-10 10:30 AM'
    },
    { 
      id: 'TKT-003', 
      subject: 'Need to reset password for new employee', 
      user: 'Robert Johnson',
      department: 'IT',
      status: 'Open',
      priority: 'Low',
      createdAt: '2023-06-10 08:45 AM',
      lastUpdated: '2023-06-10 08:45 AM'
    },
    { 
      id: 'TKT-004', 
      subject: 'System is slow during peak hours', 
      user: 'Emily Davis',
      department: 'Operations',
      status: 'In Progress',
      priority: 'High',
      createdAt: '2023-06-08 11:20 AM',
      lastUpdated: '2023-06-09 03:15 PM'
    },
    { 
      id: 'TKT-005', 
      subject: 'Need to add new department', 
      user: 'Michael Wilson',
      department: 'HR',
      status: 'Closed',
      priority: 'Medium',
      createdAt: '2023-06-05 09:10 AM',
      lastUpdated: '2023-06-07 02:30 PM'
    }
  ];

  // Mock FAQs
  const faqs = [
    {
      id: 1,
      question: 'How do I reset a user password?',
      answer: 'To reset a user password, go to User Management, find the user, click on the actions menu, and select "Reset Password". You can either set a temporary password or send a password reset link to the user\'s email.'
    },
    {
      id: 2,
      question: 'How do I add a new department?',
      answer: 'To add a new department, navigate to Department Management, click on "Add Department" button, fill in the required details such as department name, description, and manager, then click "Save".'
    },
    {
      id: 3,
      question: 'How do I generate payroll reports?',
      answer: 'To generate payroll reports, go to the Payroll module, select the reporting period, choose the report type from the dropdown menu, select the departments or employees to include, and click on "Generate Report".'
    },
    {
      id: 4,
      question: 'How do I set up automated backups?',
      answer: 'To set up automated backups, go to System Settings, select the Backup tab, configure the backup frequency, select the data to include, specify the backup location, and click "Save Settings".'
    },
    {
      id: 5,
      question: 'How do I manage user roles and permissions?',
      answer: 'To manage user roles and permissions, go to Role Management, select the role you want to modify, click "Edit", adjust the permissions as needed, and click "Save Changes".'
    }
  ];

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <Badge bg="primary">Open</Badge>;
      case 'In Progress':
        return <Badge bg="warning" text="dark">In Progress</Badge>;
      case 'Closed':
        return <Badge bg="success">Closed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge bg="danger">High</Badge>;
      case 'Medium':
        return <Badge bg="warning" text="dark">Medium</Badge>;
      case 'Low':
        return <Badge bg="info">Low</Badge>;
      default:
        return <Badge bg="secondary">{priority}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{
            background: themeColors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Help & Support</h2>
          <p className="text-muted mb-0">Support tickets and knowledge base</p>
        </div>
      </div>

      <div className="d-flex mb-4">
        <Button
          variant={activeTab === 'tickets' ? 'primary' : 'light'}
          className="me-2 d-flex align-items-center"
          onClick={() => setActiveTab('tickets')}
          style={activeTab === 'tickets' ? {
            background: themeColors.gradient,
            border: 'none'
          } : {}}
        >
          <MessageSquare size={16} className="me-2" /> Support Tickets
        </Button>
        <Button
          variant={activeTab === 'faq' ? 'primary' : 'light'}
          className="d-flex align-items-center"
          onClick={() => setActiveTab('faq')}
          style={activeTab === 'faq' ? {
            background: themeColors.gradient,
            border: 'none'
          } : {}}
        >
          <HelpCircle size={16} className="me-2" /> FAQ
        </Button>
      </div>

      {activeTab === 'tickets' && (
        <>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <InputGroup>
                    <InputGroup.Text style={{ backgroundColor: 'white', borderRight: 'none' }}>
                      <Search size={18} color="#6c757d" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search tickets..."
                      style={{ borderLeft: 'none' }}
                    />
                  </InputGroup>
                </div>
                <div className="col-md-2">
                  <Form.Select>
                    <option value="">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </Form.Select>
                </div>
                <div className="col-md-2">
                  <Form.Select>
                    <option value="">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </div>
                <div className="col-md-2">
                  <Form.Select>
                    <option value="">All Departments</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </Form.Select>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Tickets Table */}
          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="table align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3 ps-4">Ticket ID</th>
                      <th className="border-0 py-3">Subject</th>
                      <th className="border-0 py-3">User</th>
                      <th className="border-0 py-3">Department</th>
                      <th className="border-0 py-3">Status</th>
                      <th className="border-0 py-3">Priority</th>
                      <th className="border-0 py-3">Created</th>
                      <th className="border-0 py-3 pe-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportTickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td className="py-3 ps-4">{ticket.id}</td>
                        <td>{ticket.subject}</td>
                        <td>{ticket.user}</td>
                        <td>{ticket.department}</td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td>{getPriorityBadge(ticket.priority)}</td>
                        <td>{ticket.createdAt}</td>
                        <td className="pe-4 text-end">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="d-flex align-items-center"
                            style={{ 
                              marginLeft: 'auto',
                              borderColor: themeColors.border,
                              color: themeColors.primary
                            }}
                          >
                            View <ChevronRight size={14} className="ms-1" />
                          </Button>
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
                  <small className="text-muted">Showing 1 to {supportTickets.length} of {supportTickets.length} entries</small>
                </div>
                <div>
                  <Button variant="outline-secondary" size="sm" disabled>Previous</Button>
                  <Button variant="primary" size="sm" className="ms-2" disabled>Next</Button>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </>
      )}

      {activeTab === 'faq' && (
        <>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <div className="row">
                <div className="col-md-6 mx-auto">
                  <InputGroup>
                    <InputGroup.Text style={{ backgroundColor: 'white', borderRight: 'none' }}>
                      <Search size={18} color="#6c757d" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search knowledge base..."
                      style={{ borderLeft: 'none' }}
                    />
                  </InputGroup>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h4 className="mb-4">Frequently Asked Questions</h4>
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div className="accordion-item border-0 mb-3" key={faq.id}>
                    <h2 className="accordion-header" id={`heading${faq.id}`}>
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#collapse${faq.id}`} 
                        aria-expanded="false" 
                        aria-controls={`collapse${faq.id}`}
                        style={{ 
                          backgroundColor: themeColors.light,
                          color: themeColors.primary,
                          fontWeight: '500'
                        }}
                      >
                        <HelpCircle size={16} className="me-2" /> {faq.question}
                      </button>
                    </h2>
                    <div 
                      id={`collapse${faq.id}`} 
                      className="accordion-collapse collapse" 
                      aria-labelledby={`heading${faq.id}`} 
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body pt-0">
                        <p className="mb-0 ps-4 mt-3">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Support;
