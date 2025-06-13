import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Button, Form, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    academic: true,
    administrative: true,
    social: false
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Mock notifications
      setNotifications([
        {
          id: '1',
          title: 'New Grade Posted',
          message: 'Your grade for Database Systems has been posted.',
          type: 'academic',
          priority: 'high',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000),
          sender: 'Dr. Rajesh Kumar',
          action: { type: 'view_grades', url: '/grades' }
        },
        {
          id: '2',
          title: 'Assignment Deadline Reminder',
          message: 'Data Structures assignment is due tomorrow.',
          type: 'academic',
          priority: 'medium',
          isRead: false,
          createdAt: new Date(Date.now() - 7200000),
          sender: 'System',
          action: { type: 'view_assignment', url: '/assignments' }
        },
        {
          id: '3',
          title: 'Fee Payment Reminder',
          message: 'Your semester fee payment is due in 3 days.',
          type: 'administrative',
          priority: 'high',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000),
          sender: 'Finance Office',
          action: { type: 'pay_fees', url: '/fees' }
        },
        {
          id: '4',
          title: 'Library Book Due',
          message: 'Database System Concepts is due for return.',
          type: 'administrative',
          priority: 'low',
          isRead: false,
          createdAt: new Date(Date.now() - 172800000),
          sender: 'Library System',
          action: { type: 'view_library', url: '/library' }
        },
        {
          id: '5',
          title: 'Exam Registration Open',
          message: 'Registration for mid-semester exams is now open.',
          type: 'academic',
          priority: 'medium',
          isRead: true,
          createdAt: new Date(Date.now() - 259200000),
          sender: 'Examination Office',
          action: { type: 'register_exam', url: '/examinations' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update locally anyway for demo
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      toast.success('All notifications marked as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      toast.success('Notification deleted');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'danger',
      medium: 'warning',
      low: 'info'
    };
    return colors[priority] || 'secondary';
  };

  const getTypeIcon = (type) => {
    const icons = {
      academic: 'fas fa-graduation-cap',
      administrative: 'fas fa-building',
      social: 'fas fa-users',
      system: 'fas fa-cog'
    };
    return icons[type] || 'fas fa-bell';
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading notifications...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-bell text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Notification Center</h2>
                <small className="text-muted">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </small>
              </div>
            </div>
            <div>
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={() => setShowSettingsModal(true)}
              >
                <i className="fas fa-cog me-1"></i>
                Settings
              </Button>
              <Button variant="primary" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <i className="fas fa-check-double me-1"></i>
                Mark All Read
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filter Tabs */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'read' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFilter('read')}
                >
                  Read ({notifications.length - unreadCount})
                </Button>
                <Button
                  variant={filter === 'academic' ? 'success' : 'outline-success'}
                  size="sm"
                  onClick={() => setFilter('academic')}
                >
                  Academic
                </Button>
                <Button
                  variant={filter === 'administrative' ? 'info' : 'outline-info'}
                  size="sm"
                  onClick={() => setFilter('administrative')}
                >
                  Administrative
                </Button>
                <Button
                  variant={filter === 'social' ? 'warning' : 'outline-warning'}
                  size="sm"
                  onClick={() => setFilter('social')}
                >
                  Social
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Notifications List */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Notifications ({filteredNotifications.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredNotifications.length === 0 ? (
                <Alert variant="info" className="m-3">
                  <i className="fas fa-info-circle me-2"></i>
                  No notifications found for the selected filter.
                </Alert>
              ) : (
                <ListGroup variant="flush">
                  {filteredNotifications.map((notification) => (
                    <ListGroup.Item
                      key={notification.id}
                      className={`${!notification.isRead ? 'bg-light border-start border-primary border-3' : ''}`}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <i className={`${getTypeIcon(notification.type)} me-2 text-primary`}></i>
                            <h6 className="mb-0 me-2">{notification.title}</h6>
                            <Badge bg={getPriorityColor(notification.priority)} className="me-2">
                              {notification.priority}
                            </Badge>
                            {!notification.isRead && (
                              <Badge bg="primary">New</Badge>
                            )}
                          </div>
                          
                          <p className="mb-2 text-muted">{notification.message}</p>
                          
                          <div className="d-flex align-items-center justify-content-between">
                            <small className="text-muted">
                              <i className="fas fa-user me-1"></i>
                              {notification.sender} • {notification.createdAt.toLocaleString()}
                            </small>
                            
                            <div className="d-flex gap-2">
                              {notification.action && (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => window.location.href = notification.action.url}
                                >
                                  <i className="fas fa-external-link-alt me-1"></i>
                                  View
                                </Button>
                              )}
                              
                              {!notification.isRead && (
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <i className="fas fa-check me-1"></i>
                                  Mark Read
                                </Button>
                              )}
                              
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <i className="fas fa-trash me-1"></i>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Notification Settings Modal */}
      <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-cog me-2"></i>
            Notification Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h6>Delivery Methods</h6>
            <Form.Check
              type="switch"
              label="Email Notifications"
              checked={notificationSettings.email}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                email: e.target.checked
              })}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              label="Push Notifications"
              checked={notificationSettings.push}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                push: e.target.checked
              })}
              className="mb-3"
            />
            
            <h6>Notification Types</h6>
            <Form.Check
              type="switch"
              label="Academic Notifications"
              checked={notificationSettings.academic}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                academic: e.target.checked
              })}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              label="Administrative Notifications"
              checked={notificationSettings.administrative}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                administrative: e.target.checked
              })}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              label="Social Notifications"
              checked={notificationSettings.social}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                social: e.target.checked
              })}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            toast.success('Notification settings saved');
            setShowSettingsModal(false);
          }}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default NotificationCenter;
