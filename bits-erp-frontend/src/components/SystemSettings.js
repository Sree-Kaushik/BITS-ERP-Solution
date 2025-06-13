import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function SystemSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    general: {
      instituteName: 'BITS Pilani',
      academicYear: '2025',
      currentSemester: 'Monsoon',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      currency: 'INR'
    },
    academic: {
      maxCreditsPerSemester: 25,
      minCreditsPerSemester: 18,
      passingGrade: 'C',
      maxGradePoints: 10,
      attendanceRequirement: 75,
      gradeCalculationMethod: 'weighted'
    },
    security: {
      passwordMinLength: 8,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorRequired: false,
      passwordExpiry: 90,
      auditLogging: true
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      reminderDays: 3,
      bulkNotifications: true,
      notificationRetention: 30
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      cloudBackup: true,
      backupTime: '02:00'
    }
  });

  const [systemInfo, setSystemInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSystemInfo();
    loadSettings();
  }, []);

  const fetchSystemInfo = () => {
    // Mock system information
    setSystemInfo({
      version: '2.1.0',
      lastUpdate: '2025-06-01',
      uptime: '15 days, 6 hours',
      totalUsers: 3156,
      activeUsers: 1234,
      databaseSize: '2.3 GB',
      storageUsed: '67%',
      serverLoad: '23%',
      memoryUsage: '45%'
    });
  };

  const loadSettings = () => {
    // In a real app, this would load from API
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demo
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      
      toast.success('System settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const performBackup = async () => {
    try {
      toast.info('Starting system backup...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('System backup completed successfully!');
      setShowBackupModal(false);
    } catch (error) {
      toast.error('Backup failed');
    }
  };

  const restoreSystem = () => {
    if (window.confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
      toast.info('System restore initiated...');
      setTimeout(() => {
        toast.success('System restored successfully!');
      }, 2000);
    }
  };

  const clearCache = () => {
    toast.info('Clearing system cache...');
    setTimeout(() => {
      toast.success('System cache cleared successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'fas fa-cog' },
    { id: 'academic', label: 'Academic', icon: 'fas fa-graduation-cap' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'backup', label: 'Backup', icon: 'fas fa-database' }
  ];

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-cogs text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">System Settings</h2>
              <small className="text-muted">Configure system-wide settings and preferences</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* System Information */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                System Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-primary">{systemInfo.version}</div>
                    <small>Version</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-success">{systemInfo.uptime}</div>
                    <small>Uptime</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-warning">{systemInfo.activeUsers}</div>
                    <small>Active Users</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-info">{systemInfo.databaseSize}</div>
                    <small>Database Size</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Settings Tabs */}
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">Settings Categories</h6>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`list-group-item list-group-item-action ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <i className={`${tab.icon} me-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className={`${tabs.find(t => t.id === activeTab)?.icon} me-2`}></i>
                {tabs.find(t => t.id === activeTab)?.label} Settings
              </h5>
            </Card.Header>
            <Card.Body>
              {/* General Settings */}
              {activeTab === 'general' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Institute Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings.general.instituteName}
                        onChange={(e) => updateSetting('general', 'instituteName', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Academic Year</Form.Label>
                      <Form.Select
                        value={settings.general.academicYear}
                        onChange={(e) => updateSetting('general', 'academicYear', e.target.value)}
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Semester</Form.Label>
                      <Form.Select
                        value={settings.general.currentSemester}
                        onChange={(e) => updateSetting('general', 'currentSemester', e.target.value)}
                      >
                        <option value="Monsoon">Monsoon</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Timezone</Form.Label>
                      <Form.Select
                        value={settings.general.timezone}
                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date Format</Form.Label>
                      <Form.Select
                        value={settings.general.dateFormat}
                        onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Currency</Form.Label>
                      <Form.Select
                        value={settings.general.currency}
                        onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {/* Academic Settings */}
              {activeTab === 'academic' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Credits Per Semester</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.academic.maxCreditsPerSemester}
                        onChange={(e) => updateSetting('academic', 'maxCreditsPerSemester', parseInt(e.target.value))}
                        min="15"
                        max="30"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Min Credits Per Semester</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.academic.minCreditsPerSemester}
                        onChange={(e) => updateSetting('academic', 'minCreditsPerSemester', parseInt(e.target.value))}
                        min="12"
                        max="25"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Passing Grade</Form.Label>
                      <Form.Select
                        value={settings.academic.passingGrade}
                        onChange={(e) => updateSetting('academic', 'passingGrade', e.target.value)}
                      >
                        <option value="D">D</option>
                        <option value="C">C</option>
                        <option value="C+">C+</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Grade Points</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.academic.maxGradePoints}
                        onChange={(e) => updateSetting('academic', 'maxGradePoints', parseInt(e.target.value))}
                        min="4"
                        max="10"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Attendance Requirement (%)</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.academic.attendanceRequirement}
                        onChange={(e) => updateSetting('academic', 'attendanceRequirement', parseInt(e.target.value))}
                        min="60"
                        max="90"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Grade Calculation Method</Form.Label>
                      <Form.Select
                        value={settings.academic.gradeCalculationMethod}
                        onChange={(e) => updateSetting('academic', 'gradeCalculationMethod', e.target.value)}
                      >
                        <option value="weighted">Weighted Average</option>
                        <option value="simple">Simple Average</option>
                        <option value="best_of">Best of N</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password Min Length</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                        min="6"
                        max="20"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Session Timeout (minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        min="15"
                        max="480"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Login Attempts</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        min="3"
                        max="10"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password Expiry (days)</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.security.passwordExpiry}
                        onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                        min="30"
                        max="365"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Require Two-Factor Authentication"
                        checked={settings.security.twoFactorRequired}
                        onChange={(e) => updateSetting('security', 'twoFactorRequired', e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Enable Audit Logging"
                        checked={settings.security.auditLogging}
                        onChange={(e) => updateSetting('security', 'auditLogging', e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Enable Email Notifications"
                        checked={settings.notifications.emailEnabled}
                        onChange={(e) => updateSetting('notifications', 'emailEnabled', e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Enable SMS Notifications"
                        checked={settings.notifications.smsEnabled}
                        onChange={(e) => updateSetting('notifications', 'smsEnabled', e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Enable Push Notifications"
                        checked={settings.notifications.pushEnabled}
                        onChange={(e) => updateSetting('notifications', 'pushEnabled', e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Enable Bulk Notifications"
                        checked={settings.notifications.bulkNotifications}
                        onChange={(e) => updateSetting('notifications', 'bulkNotifications', e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Reminder Days Before Due Date</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.notifications.reminderDays}
                        onChange={(e) => updateSetting('notifications', 'reminderDays', parseInt(e.target.value))}
                        min="1"
                        max="7"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Notification Retention (days)</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.notifications.notificationRetention}
                        onChange={(e) => updateSetting('notifications', 'notificationRetention', parseInt(e.target.value))}
                        min="7"
                        max="365"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {/* Backup Settings */}
              {activeTab === 'backup' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Enable Auto Backup"
                        checked={settings.backup.autoBackup}
                        onChange={(e) => updateSetting('backup', 'autoBackup', e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Enable Cloud Backup"
                        checked={settings.backup.cloudBackup}
                        onChange={(e) => updateSetting('backup', 'cloudBackup', e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Backup Frequency</Form.Label>
                      <Form.Select
                        value={settings.backup.backupFrequency}
                        onChange={(e) => updateSetting('backup', 'backupFrequency', e.target.value)}
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Backup Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={settings.backup.backupTime}
                        onChange={(e) => updateSetting('backup', 'backupTime', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Retention Period (days)</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.backup.retentionPeriod}
                        onChange={(e) => updateSetting('backup', 'retentionPeriod', parseInt(e.target.value))}
                        min="7"
                        max="365"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <div className="d-flex gap-2 mt-3">
                      <Button variant="success" onClick={() => setShowBackupModal(true)}>
                        <i className="fas fa-download me-2"></i>
                        Create Backup Now
                      </Button>
                      <Button variant="warning" onClick={restoreSystem}>
                        <i className="fas fa-upload me-2"></i>
                        Restore from Backup
                      </Button>
                      <Button variant="info" onClick={clearCache}>
                        <i className="fas fa-broom me-2"></i>
                        Clear Cache
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}

              {/* Save Button */}
              <hr />
              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={saveSettings} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Backup Confirmation Modal */}
      <Modal show={showBackupModal} onHide={() => setShowBackupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-download me-2"></i>
            Create System Backup
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Backup Information:</strong>
            <ul className="mb-0 mt-2">
              <li>Database backup will include all user data</li>
              <li>System configuration will be saved</li>
              <li>File uploads and documents will be included</li>
              <li>Estimated backup size: ~2.5 GB</li>
              <li>Estimated time: 5-10 minutes</li>
            </ul>
          </Alert>
          <p>Are you sure you want to create a full system backup now?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBackupModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={performBackup}>
            <i className="fas fa-download me-2"></i>
            Create Backup
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SystemSettings;
