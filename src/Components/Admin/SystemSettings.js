import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Tab, Nav, Alert } from 'react-bootstrap';
import {
  Save,
  RefreshCw,
  Mail,
  Shield,
  Database,
  Clock,
  Globe,
  Bell,
  FileText,
  CheckCircle
} from 'lucide-react';
import themeColors from '../../theme/colors';

const SystemSettings = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // Show success message
    setShowSuccess(true);
    // Hide after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
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
            backgroundClip: 'text',
            fontSize: 'calc(1.25rem + 0.5vw)'
          }}>System Settings</h2>
          <p className="text-muted mb-0">Configure system-wide settings and preferences</p>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <Alert
          variant="success"
          className="d-flex align-items-center py-2 py-sm-3"
          onClose={() => setShowSuccess(false)}
          dismissible
        >
          <CheckCircle size={16} className="me-2" />
          <div className="fs-sm">Settings saved successfully!</div>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Tab.Container id="settings-tabs" defaultActiveKey="general">
            <Row className="g-0">
              <Col lg={3} md={4} className="border-end d-none d-md-block">
                <div className="p-3 p-lg-4">
                  <h5 className="mb-3 fw-semibold" style={{ color: themeColors.primary }}>Settings</h5>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="general" className="d-flex align-items-center mb-2 py-2">
                        <Globe size={16} className="me-2" /> General
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="email" className="d-flex align-items-center mb-2 py-2">
                        <Mail size={16} className="me-2" /> Email
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="security" className="d-flex align-items-center mb-2 py-2">
                        <Shield size={16} className="me-2" /> Security
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="database" className="d-flex align-items-center mb-2 py-2">
                        <Database size={16} className="me-2" /> Database
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="notifications" className="d-flex align-items-center mb-2 py-2">
                        <Bell size={16} className="me-2" /> Notifications
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="logs" className="d-flex align-items-center mb-2 py-2">
                        <FileText size={16} className="me-2" /> Logs
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="backup" className="d-flex align-items-center mb-2 py-2">
                        <RefreshCw size={16} className="me-2" /> Backup
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Col>

              {/* Mobile Tabs */}
              <Col xs={12} className="d-md-none mb-3">
                <div className="p-3">
                  <Form.Select
                    onChange={(e) => {
                      // This would normally use a ref to the Tab.Container
                      // For demo purposes, we're just showing the UI
                      console.log(`Selected: ${e.target.value}`);
                    }}
                    className="mb-3"
                  >
                    <option value="general">General</option>
                    <option value="email">Email</option>
                    <option value="security">Security</option>
                    <option value="database">Database</option>
                    <option value="notifications">Notifications</option>
                    <option value="logs">Logs</option>
                    <option value="backup">Backup</option>
                  </Form.Select>
                </div>
              </Col>
              <Col lg={9} md={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="general" className="p-3 p-sm-4">
                    <h4 className="mb-3 mb-sm-4">General Settings</h4>
                    <Form onSubmit={handleSaveSettings}>
                      <Row className="g-2 g-md-3 mb-3">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control type="text" defaultValue="HR Management System" size="sm" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Website URL</Form.Label>
                            <Form.Control type="url" defaultValue="https://hrms.example.com" size="sm" />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="g-2 g-md-3 mb-3">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Default Language</Form.Label>
                            <Form.Select defaultValue="en" size="sm">
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Timezone</Form.Label>
                            <Form.Select defaultValue="UTC" size="sm">
                              <option value="UTC">UTC</option>
                              <option value="EST">Eastern Standard Time (EST)</option>
                              <option value="CST">Central Standard Time (CST)</option>
                              <option value="PST">Pacific Standard Time (PST)</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="g-2 g-md-3 mb-3">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date Format</Form.Label>
                            <Form.Select defaultValue="MM/DD/YYYY" size="sm">
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Time Format</Form.Label>
                            <Form.Select defaultValue="12" size="sm">
                              <option value="12">12 Hour</option>
                              <option value="24">24 Hour</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>System Logo</Form.Label>
                        <Form.Control type="file" size="sm" />
                        <Form.Text className="text-muted">
                          Recommended size: 200x50 pixels
                        </Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="maintenance-mode"
                          label="Enable Maintenance Mode"
                        />
                        <Form.Text className="text-muted">
                          When enabled, only administrators can access the system
                        </Form.Text>
                      </Form.Group>
                      <div className="d-flex flex-column flex-sm-row justify-content-end">
                        <Button
                          variant="secondary"
                          className="mb-2 mb-sm-0 me-sm-2 order-2 order-sm-1"
                          size="sm"
                        >
                          Reset
                        </Button>
                        <Button
                          type="submit"
                          className="mb-2 mb-sm-0 order-1 order-sm-2"
                          size="sm"
                          style={{
                            background: themeColors.gradient,
                            border: 'none'
                          }}
                        >
                          <Save size={16} className="me-2" /> Save Changes
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="email" className="p-3 p-sm-4">
                    <h4 className="mb-3 mb-sm-4">Email Settings</h4>
                    <p className="text-muted">Configure email server settings for system notifications.</p>
                    <div className="text-center py-3 py-sm-4">
                      <p>This is a placeholder for Email Settings. In a real implementation, this would include SMTP configuration, email templates, etc.</p>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="security" className="p-3 p-sm-4">
                    <h4 className="mb-3 mb-sm-4">Security Settings</h4>
                    <p className="text-muted">Configure security settings for the system.</p>
                    <div className="text-center py-3 py-sm-4">
                      <p>This is a placeholder for Security Settings. In a real implementation, this would include password policies, 2FA settings, etc.</p>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="database" className="p-3 p-sm-4">
                    <h4 className="mb-3 mb-sm-4">Database Settings</h4>
                    <p className="text-muted">Configure database connection and optimization settings.</p>
                    <div className="text-center py-3 py-sm-4">
                      <p>This is a placeholder for Database Settings. In a real implementation, this would include database configuration options.</p>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="notifications" className="p-3 p-sm-4">
                    <h4 className="mb-3 mb-sm-4">Notification Settings</h4>
                    <p className="text-muted">Configure system-wide notification settings.</p>
                    <div className="text-center py-3 py-sm-4">
                      <p>This is a placeholder for Notification Settings. In a real implementation, this would include notification preferences and channels.</p>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="logs" className="p-3 p-sm-4">
                    <h4 className="mb-3 mb-sm-4">System Logs</h4>
                    <p className="text-muted">View and manage system logs.</p>
                    <div className="text-center py-3 py-sm-4">
                      <p>This is a placeholder for System Logs. In a real implementation, this would include log viewing and management tools.</p>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="backup" className="p-3 p-sm-4">
                    <h4 className="mb-3 mb-sm-4">Backup & Restore</h4>
                    <p className="text-muted">Configure system backup settings and restore points.</p>
                    <div className="text-center py-3 py-sm-4">
                      <p>This is a placeholder for Backup & Restore. In a real implementation, this would include backup scheduling and restoration options.</p>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SystemSettings;
