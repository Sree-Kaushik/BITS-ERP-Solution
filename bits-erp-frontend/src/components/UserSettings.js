import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function UserSettings() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    sessionTimeout: 30
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'friends',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataSharing: false
  });

  useEffect(() => {
    fetchUserSettings();
    fetchActiveSessions();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await axios.get('/api/auth/settings');
      setSecuritySettings(response.data.security);
      setPrivacySettings(response.data.privacy);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const response = await axios.get('/api/auth/sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Mock data
      setSessions([
        {
          id: '1',
          device: 'Chrome on macOS',
          location: 'New Delhi, India',
          lastActive: new Date(),
          current: true,
          ipAddress: '192.168.1.100'
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: 'Mumbai, India',
          lastActive: new Date(Date.now() - 86400000),
          current: false,
          ipAddress: '192.168.1.101'
        }
      ]);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySettingsChange = async (setting, value) => {
    const newSettings = { ...securitySettings, [setting]: value };
    setSecuritySettings(newSettings);

    try {
      await axios.put('/api/auth/security-settings', newSettings);
      toast.success('Security settings updated');
    } catch (error) {
      toast.error('Failed to update security settings');
      // Revert on error
      setSecuritySettings(securitySettings);
    }
  };

  const handlePrivacySettingsChange = async (setting, value) => {
    const newSettings = { ...privacySettings, [setting]: value };
    setPrivacySettings(newSettings);

    try {
      await axios.put('/api/auth/privacy-settings', newSettings);
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update privacy settings');
      // Revert on error
      setPrivacySettings(privacySettings);
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      await axios.delete(`/api/auth/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success('Session terminated');
    } catch (error) {
      toast.error('Failed to terminate session');
    }
  };

  const terminateAllSessions = async () => {
    try {
      await axios.delete('/api/auth/sessions/all');
      toast.success('All sessions terminated. Please login again.');
      logout();
    } catch (error) {
      toast.error('Failed to terminate sessions');
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete('/api/auth/account');
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-cog text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">Account Settings</h2>
              <small className="text-muted">Manage your account preferences and security</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Account Information */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-user me-2"></i>
                Account Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td className="fw-bold text-muted">Username:</td>
                        <td>{user?.username}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-muted">Email:</td>
                        <td>{user?.email}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-muted">Role:</td>
                        <td>
                          <Badge bg="primary">
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" onClick={() => setShowPasswordModal(true)}>
                      <i className="fas fa-key me-2"></i>
                      Change Password
                    </Button>
                    <Button variant="outline-secondary">
                      <i className="fas fa-download me-2"></i>
                      Download My Data
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Security Settings */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-shield-alt me-2"></i>
                Security Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Two-Factor Authentication"
                    checked={securitySettings.twoFactorEnabled}
                    onChange={(e) => handleSecuritySettingsChange('twoFactorEnabled', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Add an extra layer of security to your account
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Email Notifications"
                    checked={securitySettings.emailNotifications}
                    onChange={(e) => handleSecuritySettingsChange('emailNotifications', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Receive security alerts via email
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="SMS Notifications"
                    checked={securitySettings.smsNotifications}
                    onChange={(e) => handleSecuritySettingsChange('smsNotifications', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Receive security alerts via SMS
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Login Alerts"
                    checked={securitySettings.loginAlerts}
                    onChange={(e) => handleSecuritySettingsChange('loginAlerts', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Get notified of new login attempts
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Session Timeout (minutes)</Form.Label>
                  <Form.Select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecuritySettingsChange('sessionTimeout', parseInt(e.target.value))}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={480}>8 hours</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-user-secret me-2"></i>
                Privacy Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Visibility</Form.Label>
                  <Form.Select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacySettingsChange('profileVisibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Show Email Address"
                    checked={privacySettings.showEmail}
                    onChange={(e) => handlePrivacySettingsChange('showEmail', e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Show Phone Number"
                    checked={privacySettings.showPhone}
                    onChange={(e) => handlePrivacySettingsChange('showPhone', e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Allow Messages"
                    checked={privacySettings.allowMessages}
                    onChange={(e) => handlePrivacySettingsChange('allowMessages', e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Data Sharing for Analytics"
                    checked={privacySettings.dataSharing}
                    onChange={(e) => handlePrivacySettingsChange('dataSharing', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Help improve our services with anonymous usage data
                  </Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Active Sessions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-desktop me-2"></i>
                Active Sessions
              </h5>
              <Button variant="outline-danger" size="sm" onClick={terminateAllSessions}>
                <i className="fas fa-sign-out-alt me-1"></i>
                Terminate All
              </Button>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Location</th>
                    <th>IP Address</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td>
                        <i className="fas fa-laptop me-2"></i>
                        {session.device}
                      </td>
                      <td>{session.location}</td>
                      <td><code>{session.ipAddress}</code></td>
                      <td>{session.lastActive.toLocaleString()}</td>
                      <td>
                        <Badge bg={session.current ? 'success' : 'secondary'}>
                          {session.current ? 'Current' : 'Active'}
                        </Badge>
                      </td>
                      <td>
                        {!session.current && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => terminateSession(session.id)}
                          >
                            <i className="fas fa-times me-1"></i>
                            Terminate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Danger Zone */}
      <Row>
        <Col>
          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Danger Zone
              </h5>
            </Card.Header>
            <Card.Body>
              <Alert variant="danger">
                <strong>Warning:</strong> These actions are irreversible. Please proceed with caution.
              </Alert>
              <div className="d-grid gap-2 d-md-flex">
                <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
                  <i className="fas fa-trash me-2"></i>
                  Delete Account
                </Button>
                <Button variant="outline-warning">
                  <i className="fas fa-download me-2"></i>
                  Export Data
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-key me-2"></i>
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordChange}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                minLength={8}
              />
              <Form.Text className="text-muted">
                Must be at least 8 characters long
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Delete Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>This action cannot be undone!</strong>
          </Alert>
          <p>Are you sure you want to delete your account? This will:</p>
          <ul>
            <li>Permanently delete all your data</li>
            <li>Remove access to all services</li>
            <li>Cancel any active subscriptions</li>
          </ul>
          <p>Type <strong>DELETE</strong> to confirm:</p>
          <Form.Control type="text" placeholder="Type DELETE to confirm" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAccount}>
            <i className="fas fa-trash me-2"></i>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserSettings;
