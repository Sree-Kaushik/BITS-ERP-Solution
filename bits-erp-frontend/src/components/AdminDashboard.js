import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = () => {
    // Mock admin data
    setAdminStats({
      totalStudents: 2847,
      totalFaculty: 156,
      totalCourses: 89,
      activeUsers: 1234,
      systemUptime: 99.8,
      storageUsed: 67,
      pendingApprovals: 23,
      supportTickets: 12
    });

    setRecentActivities([
      { id: 1, action: 'New student registration', user: 'Arjun Sharma', time: '2 minutes ago', type: 'registration' },
      { id: 2, action: 'Grade submitted', user: 'Dr. Rajesh Kumar', time: '5 minutes ago', type: 'academic' },
      { id: 3, action: 'Fee payment received', user: 'Priya Patel', time: '10 minutes ago', type: 'financial' },
      { id: 4, action: 'System backup completed', user: 'System', time: '1 hour ago', type: 'system' },
      { id: 5, action: 'New course created', user: 'Prof. Sarah Wilson', time: '2 hours ago', type: 'academic' }
    ]);

    setSystemAlerts([
      { id: 1, message: 'Server maintenance scheduled for tonight at 2 AM', type: 'warning', priority: 'medium' },
      { id: 2, message: 'Database backup completed successfully', type: 'success', priority: 'low' },
      { id: 3, message: 'High CPU usage detected on server 2', type: 'danger', priority: 'high' }
    ]);

    setLoading(false);
  };

  const getActivityIcon = (type) => {
    const icons = {
      registration: 'fas fa-user-plus text-success',
      academic: 'fas fa-graduation-cap text-primary',
      financial: 'fas fa-credit-card text-warning',
      system: 'fas fa-cog text-info'
    };
    return icons[type] || 'fas fa-info-circle';
  };

  const getAlertVariant = (type) => {
    const variants = {
      success: 'success',
      warning: 'warning',
      danger: 'danger',
      info: 'info'
    };
    return variants[type] || 'info';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading admin dashboard...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-tachometer-alt text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">Admin Dashboard</h2>
              <small className="text-muted">System overview and management controls</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* System Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary h-100">
            <Card.Body>
              <i className="fas fa-users text-primary mb-2" style={{ fontSize: '2rem' }}></i>
              <h3 className="text-primary">{adminStats.totalStudents}</h3>
              <small className="text-muted">Total Students</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success h-100">
            <Card.Body>
              <i className="fas fa-chalkboard-teacher text-success mb-2" style={{ fontSize: '2rem' }}></i>
              <h3 className="text-success">{adminStats.totalFaculty}</h3>
              <small className="text-muted">Faculty Members</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info h-100">
            <Card.Body>
              <i className="fas fa-book-open text-info mb-2" style={{ fontSize: '2rem' }}></i>
              <h3 className="text-info">{adminStats.totalCourses}</h3>
              <small className="text-muted">Active Courses</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <i className="fas fa-user-clock text-warning mb-2" style={{ fontSize: '2rem' }}></i>
              <h3 className="text-warning">{adminStats.activeUsers}</h3>
              <small className="text-muted">Active Users</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Health */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-heartbeat me-2"></i>
                System Health
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>System Uptime</span>
                  <span>{adminStats.systemUptime}%</span>
                </div>
                <ProgressBar now={adminStats.systemUptime} variant="success" />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Storage Used</span>
                  <span>{adminStats.storageUsed}%</span>
                </div>
                <ProgressBar now={adminStats.storageUsed} variant={adminStats.storageUsed > 80 ? 'danger' : 'primary'} />
              </div>
              
              <div className="d-flex justify-content-between">
                <div className="text-center">
                  <div className="h4 text-warning">{adminStats.pendingApprovals}</div>
                  <small>Pending Approvals</small>
                </div>
                <div className="text-center">
                  <div className="h4 text-danger">{adminStats.supportTickets}</div>
                  <small>Support Tickets</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                System Alerts
              </h5>
            </Card.Header>
            <Card.Body>
              {systemAlerts.map((alert) => (
                <Alert key={alert.id} variant={getAlertVariant(alert.type)} className="mb-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <span>{alert.message}</span>
                    <Badge bg={alert.priority === 'high' ? 'danger' : alert.priority === 'medium' ? 'warning' : 'info'}>
                      {alert.priority}
                    </Badge>
                  </div>
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Activities
              </h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>User</th>
                    <th>Time</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        <i className={getActivityIcon(activity.type)} style={{ marginRight: '8px' }}></i>
                        {activity.action}
                      </td>
                      <td>{activity.user}</td>
                      <td>{activity.time}</td>
                      <td>
                        <Badge bg="secondary">{activity.type}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <Button variant="outline-primary" className="w-100" href="/manage-students">
                    <i className="fas fa-users d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    Manage Students
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-success" className="w-100" href="/manage-faculty">
                    <i className="fas fa-chalkboard-teacher d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    Manage Faculty
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-info" className="w-100" href="/reports">
                    <i className="fas fa-chart-bar d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    View Reports
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-warning" className="w-100" href="/system-settings">
                    <i className="fas fa-cogs d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    System Settings
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
