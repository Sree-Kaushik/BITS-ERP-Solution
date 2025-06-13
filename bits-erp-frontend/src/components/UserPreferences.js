import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function UserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    notifications: {
      email: true,
      push: true,
      sms: false,
      desktop: true
    },
    dashboard: {
      showGrades: true,
      showAttendance: true,
      showTimetable: true,
      showNotifications: true,
      showCalendar: true,
      defaultView: 'overview'
    },
    privacy: {
      profileVisibility: 'friends',
      showOnlineStatus: true,
      allowMessages: true,
      showLastSeen: false
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // In a real app, this would fetch from API
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to API
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Apply theme immediately
      document.documentElement.setAttribute('data-theme', preferences.theme);
      
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setPreferences({
      theme: 'light',
      language: 'en',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      notifications: {
        email: true,
        push: true,
        sms: false,
        desktop: true
      },
      dashboard: {
        showGrades: true,
        showAttendance: true,
        showTimetable: true,
        showNotifications: true,
        showCalendar: true,
        defaultView: 'overview'
      },
      privacy: {
        profileVisibility: 'friends',
        showOnlineStatus: true,
        allowMessages: true,
        showLastSeen: false
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false,
        screenReader: false
      }
    });
    toast.info('Preferences reset to defaults');
  };

  const updatePreference = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const updateTopLevelPreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-sliders-h text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">User Preferences</h2>
              <small className="text-muted">Customize your experience and interface settings</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* General Settings */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-cog me-2"></i>
                General Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Theme</Form.Label>
                  <Form.Select
                    value={preferences.theme}
                    onChange={(e) => updateTopLevelPreference('theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Choose your preferred color scheme
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Select
                    value={preferences.language}
                    onChange={(e) => updateTopLevelPreference('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Timezone</Form.Label>
                  <Form.Select
                    value={preferences.timezone}
                    onChange={(e) => updateTopLevelPreference('timezone', e.target.value)}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date Format</Form.Label>
                      <Form.Select
                        value={preferences.dateFormat}
                        onChange={(e) => updateTopLevelPreference('dateFormat', e.target.value)}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Time Format</Form.Label>
                      <Form.Select
                        value={preferences.timeFormat}
                        onChange={(e) => updateTopLevelPreference('timeFormat', e.target.value)}
                      >
                        <option value="24h">24 Hour</option>
                        <option value="12h">12 Hour (AM/PM)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-bell me-2"></i>
                Notification Preferences
              </h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Email Notifications"
                    checked={preferences.notifications.email}
                    onChange={(e) => updatePreference('notifications', 'email', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Receive notifications via email
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Push Notifications"
                    checked={preferences.notifications.push}
                    onChange={(e) => updatePreference('notifications', 'push', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Browser push notifications
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="SMS Notifications"
                    checked={preferences.notifications.sms}
                    onChange={(e) => updatePreference('notifications', 'sms', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Text message notifications
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Desktop Notifications"
                    checked={preferences.notifications.desktop}
                    onChange={(e) => updatePreference('notifications', 'desktop', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    System desktop notifications
                  </Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Dashboard Settings */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Default Dashboard View</Form.Label>
                  <Form.Select
                    value={preferences.dashboard.defaultView}
                    onChange={(e) => updatePreference('dashboard', 'defaultView', e.target.value)}
                  >
                    <option value="overview">Overview</option>
                    <option value="grades">Grades</option>
                    <option value="timetable">Timetable</option>
                    <option value="calendar">Calendar</option>
                  </Form.Select>
                </Form.Group>

                <div className="mb-3">
                  <Form.Label>Show Dashboard Widgets</Form.Label>
                  
                  <Form.Check
                    type="switch"
                    label="Grades Widget"
                    checked={preferences.dashboard.showGrades}
                    onChange={(e) => updatePreference('dashboard', 'showGrades', e.target.checked)}
                    className="mb-2"
                  />
                  
                  <Form.Check
                    type="switch"
                    label="Attendance Widget"
                    checked={preferences.dashboard.showAttendance}
                    onChange={(e) => updatePreference('dashboard', 'showAttendance', e.target.checked)}
                    className="mb-2"
                  />
                  
                  <Form.Check
                    type="switch"
                    label="Timetable Widget"
                    checked={preferences.dashboard.showTimetable}
                    onChange={(e) => updatePreference('dashboard', 'showTimetable', e.target.checked)}
                    className="mb-2"
                  />
                  
                  <Form.Check
                    type="switch"
                    label="Notifications Widget"
                    checked={preferences.dashboard.showNotifications}
                    onChange={(e) => updatePreference('dashboard', 'showNotifications', e.target.checked)}
                    className="mb-2"
                  />
                  
                  <Form.Check
                    type="switch"
                    label="Calendar Widget"
                    checked={preferences.dashboard.showCalendar}
                    onChange={(e) => updatePreference('dashboard', 'showCalendar', e.target.checked)}
                  />
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-warning text-dark">
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
                    value={preferences.privacy.profileVisibility}
                    onChange={(e) => updatePreference('privacy', 'profileVisibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Show Online Status"
                    checked={preferences.privacy.showOnlineStatus}
                    onChange={(e) => updatePreference('privacy', 'showOnlineStatus', e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Allow Messages"
                    checked={preferences.privacy.allowMessages}
                    onChange={(e) => updatePreference('privacy', 'allowMessages', e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Show Last Seen"
                    checked={preferences.privacy.showLastSeen}
                    onChange={(e) => updatePreference('privacy', 'showLastSeen', e.target.checked)}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Accessibility Settings */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">
                <i className="fas fa-universal-access me-2"></i>
                Accessibility Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Font Size</Form.Label>
                    <Form.Select
                      value={preferences.accessibility.fontSize}
                      onChange={(e) => updatePreference('accessibility', 'fontSize', e.target.value)}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="extra-large">Extra Large</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <div className="mt-4">
                    <Form.Check
                      type="switch"
                      label="High Contrast Mode"
                      checked={preferences.accessibility.highContrast}
                      onChange={(e) => updatePreference('accessibility', 'highContrast', e.target.checked)}
                      className="mb-2"
                    />
                    
                    <Form.Check
                      type="switch"
                      label="Reduced Motion"
                      checked={preferences.accessibility.reducedMotion}
                      onChange={(e) => updatePreference('accessibility', 'reducedMotion', e.target.checked)}
                      className="mb-2"
                    />
                    
                    <Form.Check
                      type="switch"
                      label="Screen Reader Support"
                      checked={preferences.accessibility.screenReader}
                      onChange={(e) => updatePreference('accessibility', 'screenReader', e.target.checked)}
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Save Your Preferences</h6>
                  <small className="text-muted">Changes will be applied immediately</small>
                </div>
                <div>
                  <Button variant="outline-secondary" onClick={resetToDefaults} className="me-2">
                    <i className="fas fa-undo me-2"></i>
                    Reset to Defaults
                  </Button>
                  <Button variant="primary" onClick={savePreferences} disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Preview Section */}
      <Row className="mt-4">
        <Col>
          <Alert variant="info">
            <h6><i className="fas fa-info-circle me-2"></i>Preview</h6>
            <p className="mb-0">
              Theme: <strong>{preferences.theme}</strong> | 
              Language: <strong>{preferences.language}</strong> | 
              Font Size: <strong>{preferences.accessibility.fontSize}</strong>
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}

export default UserPreferences;
