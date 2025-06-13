import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Badge, Table, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

function AdvancedDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchUpcomingEvents();
    fetchRecentActivities();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Mock data for demo - replace with actual API calls
      setDashboardData({
        totalStudents: 1250,
        activeExams: 3,
        totalCourses: 45,
        pendingGrades: 12,
        libraryBooks: 15000,
        hostelOccupancy: 85,
        attendanceRate: 92,
        cgpaAverage: 8.2,
        semesterProgress: 75,
        upcomingDeadlines: 5
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    // Mock data
    setUpcomingEvents([
      {
        id: 1,
        title: 'Mid Semester Exams',
        date: '2025-06-20',
        type: 'exam',
        description: 'Mid semester examinations begin'
      },
      {
        id: 2,
        title: 'Course Registration',
        date: '2025-06-25',
        type: 'registration',
        description: 'Summer semester course registration'
      },
      {
        id: 3,
        title: 'Library Workshop',
        date: '2025-06-15',
        type: 'event',
        description: 'Digital resources workshop'
      }
    ]);
  };

  const fetchRecentActivities = async () => {
    // Mock data
    setRecentActivities([
      {
        id: 1,
        action: 'Grade Updated',
        subject: 'Database Systems',
        time: '2 hours ago',
        icon: 'fas fa-chart-line',
        color: 'success'
      },
      {
        id: 2,
        action: 'Assignment Submitted',
        subject: 'Data Structures',
        time: '1 day ago',
        icon: 'fas fa-file-upload',
        color: 'primary'
      },
      {
        id: 3,
        action: 'Library Book Issued',
        subject: 'Introduction to Algorithms',
        time: '2 days ago',
        icon: 'fas fa-book',
        color: 'info'
      }
    ]);
  };

  // Chart data
  const cgpaChartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
    datasets: [
      {
        label: 'CGPA Trend',
        data: [7.8, 8.1, 8.3, 8.0, 8.4, 8.2],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  const attendanceChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [92, 8],
        backgroundColor: ['#28a745', '#dc3545'],
        borderWidth: 0
      }
    ]
  };

  const gradeDistributionData = {
    labels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    datasets: [
      {
        label: 'Grade Distribution',
        data: [12, 18, 15, 10, 8, 5, 2, 0],
        backgroundColor: [
          '#28a745', '#20c997', '#17a2b8', '#007bff',
          '#ffc107', '#fd7e14', '#dc3545', '#6c757d'
        ]
      }
    ]
  };

  const getEventBadge = (type) => {
    const badges = {
      'exam': 'danger',
      'registration': 'primary',
      'event': 'info',
      'holiday': 'success'
    };
    return badges[type] || 'secondary';
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-primary text-white">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-1">Welcome back, {user?.username}!</h3>
                  <p className="mb-0">
                    <i className="fas fa-user-tag me-2"></i>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </p>
                </Col>
                <Col md="auto">
                  <div className="text-center">
                    <h4 className="mb-0">{new Date().toLocaleDateString()}</h4>
                    <small>Today</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="text-primary mb-2">
                <i className="fas fa-graduation-cap" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="text-primary">{dashboardData.totalStudents}</h4>
              <small className="text-muted">Total Students</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="text-success mb-2">
                <i className="fas fa-file-alt" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="text-success">{dashboardData.activeExams}</h4>
              <small className="text-muted">Active Exams</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="text-info mb-2">
                <i className="fas fa-book-open" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="text-info">{dashboardData.totalCourses}</h4>
              <small className="text-muted">Total Courses</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="text-warning mb-2">
                <i className="fas fa-clock" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="text-warning">{dashboardData.pendingGrades}</h4>
              <small className="text-muted">Pending Grades</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Student Specific Dashboard */}
      {user?.role === 'student' && (
        <>
          {/* Academic Progress */}
          <Row className="mb-4">
            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0"><i className="fas fa-chart-line me-2"></i>Academic Progress</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Semester Progress</span>
                          <span>{dashboardData.semesterProgress}%</span>
                        </div>
                        <ProgressBar 
                          now={dashboardData.semesterProgress} 
                          variant="primary" 
                          className="mb-2"
                        />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Attendance Rate</span>
                          <span>{dashboardData.attendanceRate}%</span>
                        </div>
                        <ProgressBar 
                          now={dashboardData.attendanceRate} 
                          variant={dashboardData.attendanceRate >= 75 ? 'success' : 'danger'}
                          className="mb-2"
                        />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Current CGPA</span>
                          <span className="fw-bold">{dashboardData.cgpaAverage}</span>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div style={{ height: '200px' }}>
                        <Line 
                          data={cgpaChartData} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false
                              }
                            }
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0"><i className="fas fa-calendar-check me-2"></i>Attendance</h5>
                </Card.Header>
                <Card.Body className="text-center">
                  <div style={{ height: '200px' }}>
                    <Doughnut 
                      data={attendanceChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Grade Distribution */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0"><i className="fas fa-chart-bar me-2"></i>Grade Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '250px' }}>
                    <Bar 
                      data={gradeDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        }
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0"><i className="fas fa-activity me-2"></i>Recent Activities</h5>
                </Card.Header>
                <Card.Body>
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="d-flex align-items-center mb-3">
                      <div className={`text-${activity.color} me-3`}>
                        <i className={activity.icon}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">{activity.action}</div>
                        <small className="text-muted">{activity.subject}</small>
                      </div>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Upcoming Events */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0"><i className="fas fa-calendar-alt me-2"></i>Upcoming Events</h5>
            </Card.Header>
            <Card.Body>
              {upcomingEvents.length === 0 ? (
                <Alert variant="info">No upcoming events.</Alert>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Days Left</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map(event => (
                      <tr key={event.id}>
                        <td className="fw-bold">{event.title}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={getEventBadge(event.type)}>
                            {event.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getDaysUntil(event.date) <= 3 ? 'danger' : 'primary'}>
                            {getDaysUntil(event.date)} days
                          </Badge>
                        </td>
                        <td>{event.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0"><i className="fas fa-bolt me-2"></i>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2} className="text-center mb-3">
                  <div className="quick-action-item">
                    <div className="text-primary mb-2">
                      <i className="fas fa-file-alt" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <small>View Grades</small>
                  </div>
                </Col>
                <Col md={2} className="text-center mb-3">
                  <div className="quick-action-item">
                    <div className="text-success mb-2">
                      <i className="fas fa-calendar" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <small>Timetable</small>
                  </div>
                </Col>
                <Col md={2} className="text-center mb-3">
                  <div className="quick-action-item">
                    <div className="text-info mb-2">
                      <i className="fas fa-book" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <small>Library</small>
                  </div>
                </Col>
                <Col md={2} className="text-center mb-3">
                  <div className="quick-action-item">
                    <div className="text-warning mb-2">
                      <i className="fas fa-home" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <small>Hostel</small>
                  </div>
                </Col>
                <Col md={2} className="text-center mb-3">
                  <div className="quick-action-item">
                    <div className="text-danger mb-2">
                      <i className="fas fa-clipboard-check" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <small>Exams</small>
                  </div>
                </Col>
                <Col md={2} className="text-center mb-3">
                  <div className="quick-action-item">
                    <div className="text-secondary mb-2">
                      <i className="fas fa-user" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <small>Profile</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdvancedDashboard;
