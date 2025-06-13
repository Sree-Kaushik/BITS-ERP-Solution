import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Button, Alert, Table, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [quickStats, setQuickStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [motivationalQuote, setMotivationalQuote] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchQuickStats();
    fetchRecentActivities();
    fetchUpcomingEvents();
    fetchNotifications();
    fetchWeatherData();
    fetchMotivationalQuote();
    
    // Show welcome modal for new users
    const isFirstLogin = localStorage.getItem('firstLogin');
    if (!isFirstLogin) {
      setShowWelcomeModal(true);
      localStorage.setItem('firstLogin', 'false');
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Enhanced mock data based on user role
      const mockData = {
        student: {
          currentSemester: 6,
          cgpa: 8.5,
          attendancePercentage: 92,
          creditsCompleted: 96,
          totalCredits: 120,
          pendingAssignments: 3,
          upcomingExams: 2,
          libraryBooks: 2,
          feeStatus: 'paid',
          hostelRoom: 'A-205',
          nextClass: 'Database Systems at 9:00 AM'
        },
        faculty: {
          coursesTeaching: 4,
          totalStudents: 156,
          pendingGrades: 23,
          upcomingClasses: 3,
          researchPapers: 12,
          officeHours: 'Mon, Wed, Fri 2:00-4:00 PM'
        },
        admin: {
          totalStudents: 2847,
          totalFaculty: 156,
          totalCourses: 89,
          systemUptime: 99.8,
          pendingApprovals: 23,
          activeUsers: 1234
        }
      };
      
      setDashboardData(mockData[user?.role] || mockData.student);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickStats = () => {
    const stats = {
      student: {
        todayClasses: 4,
        completedToday: 2,
        studyHoursWeek: 28,
        assignmentsDue: 3,
        libraryVisits: 12,
        campusEvents: 5
      },
      faculty: {
        classesToday: 3,
        studentsPresent: 142,
        gradesToSubmit: 23,
        meetingsScheduled: 2,
        researchHours: 15,
        publicationsThisYear: 4
      },
      admin: {
        newRegistrations: 45,
        systemAlerts: 2,
        supportTickets: 12,
        serverLoad: 23,
        dataBackups: 30,
        securityScans: 7
      }
    };
    
    setQuickStats(stats[user?.role] || stats.student);
  };

  const fetchRecentActivities = () => {
    const activities = {
      student: [
        { id: 1, action: 'Submitted assignment for Data Structures', time: '2 hours ago', icon: 'fas fa-upload', color: 'success' },
        { id: 2, action: 'Attended Database Systems lecture', time: '4 hours ago', icon: 'fas fa-chalkboard-teacher', color: 'primary' },
        { id: 3, action: 'Borrowed book from library', time: '1 day ago', icon: 'fas fa-book', color: 'info' },
        { id: 4, action: 'Registered for mid-semester exams', time: '2 days ago', icon: 'fas fa-clipboard-list', color: 'warning' },
        { id: 5, action: 'Updated profile information', time: '3 days ago', icon: 'fas fa-user-edit', color: 'secondary' }
      ],
      faculty: [
        { id: 1, action: 'Uploaded lecture notes for CS F212', time: '1 hour ago', icon: 'fas fa-upload', color: 'success' },
        { id: 2, action: 'Graded 15 assignments', time: '3 hours ago', icon: 'fas fa-check-circle', color: 'primary' },
        { id: 3, action: 'Conducted office hours session', time: '1 day ago', icon: 'fas fa-users', color: 'info' },
        { id: 4, action: 'Submitted research paper', time: '2 days ago', icon: 'fas fa-file-alt', color: 'warning' },
        { id: 5, action: 'Attended faculty meeting', time: '3 days ago', icon: 'fas fa-handshake', color: 'secondary' }
      ],
      admin: [
        { id: 1, action: 'Approved 12 new student registrations', time: '30 minutes ago', icon: 'fas fa-user-check', color: 'success' },
        { id: 2, action: 'Updated system security policies', time: '2 hours ago', icon: 'fas fa-shield-alt', color: 'primary' },
        { id: 3, action: 'Generated monthly reports', time: '4 hours ago', icon: 'fas fa-chart-bar', color: 'info' },
        { id: 4, action: 'Resolved 8 support tickets', time: '1 day ago', icon: 'fas fa-ticket-alt', color: 'warning' },
        { id: 5, action: 'Conducted system maintenance', time: '2 days ago', icon: 'fas fa-tools', color: 'secondary' }
      ]
    };
    
    setRecentActivities(activities[user?.role] || activities.student);
  };

  const fetchUpcomingEvents = () => {
    const events = [
      { id: 1, title: 'Database Systems Mid-Semester Exam', date: '2025-06-20', time: '09:00 AM', type: 'exam', priority: 'high' },
      { id: 2, title: 'Guest Lecture: AI in Healthcare', date: '2025-06-15', time: '02:00 PM', type: 'lecture', priority: 'medium' },
      { id: 3, title: 'Cultural Festival - OASIS', date: '2025-06-25', time: '10:00 AM', type: 'event', priority: 'low' },
      { id: 4, title: 'Career Fair 2025', date: '2025-06-30', time: '09:00 AM', type: 'career', priority: 'high' },
      { id: 5, title: 'Research Symposium', date: '2025-06-18', time: '09:00 AM', type: 'research', priority: 'medium' }
    ];
    
    setUpcomingEvents(events);
  };

  const fetchNotifications = () => {
    const notifs = [
      { id: 1, message: 'New grade posted for Database Systems', type: 'academic', isRead: false, time: '1 hour ago' },
      { id: 2, message: 'Assignment deadline reminder', type: 'deadline', isRead: false, time: '2 hours ago' },
      { id: 3, message: 'Library book due tomorrow', type: 'library', isRead: true, time: '1 day ago' },
      { id: 4, message: 'Fee payment confirmation received', type: 'financial', isRead: true, time: '2 days ago' }
    ];
    
    setNotifications(notifs);
  };

  const fetchWeatherData = () => {
    // Mock weather data for campus
    setWeatherData({
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      icon: 'fas fa-cloud-sun'
    });
  };

  const fetchMotivationalQuote = () => {
    const quotes = [
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The only way to do great work is to love what you do.",
      "Innovation distinguishes between a leader and a follower.",
      "Stay hungry, stay foolish.",
      "The future belongs to those who believe in the beauty of their dreams."
    ];
    
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'primary';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  const getPriorityColor = (priority) => {
    const colors = { high: 'danger', medium: 'warning', low: 'info' };
    return colors[priority] || 'secondary';
  };

  const getTypeIcon = (type) => {
    const icons = {
      exam: 'fas fa-clipboard-list',
      lecture: 'fas fa-chalkboard-teacher',
      event: 'fas fa-calendar-star',
      career: 'fas fa-briefcase',
      research: 'fas fa-flask'
    };
    return icons[type] || 'fas fa-calendar';
  };

  const handleQuickAction = (action) => {
    const actions = {
      grades: () => navigate('/grades'),
      timetable: () => navigate('/timetable'),
      library: () => navigate('/library'),
      fees: () => navigate('/fees'),
      profile: () => navigate('/profile'),
      attendance: () => navigate('/attendance'),
      courses: () => navigate('/courses'),
      students: () => navigate('/students'),
      reports: () => navigate('/reports'),
      settings: () => navigate('/system-settings')
    };
    
    if (actions[action]) {
      actions[action]();
    } else {
      toast.info(`${action} feature coming soon!`);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-gradient-primary text-white border-0 shadow-lg">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <h2 className="fw-bold mb-2">
                    {getGreeting()}, {user?.username}! 👋
                  </h2>
                  <p className="mb-3 opacity-90">
                    Welcome to your personalized dashboard. Here's what's happening today.
                  </p>
                  <div className="d-flex align-items-center">
                    <Badge bg="light" text="dark" className="me-3">
                      <i className="fas fa-user me-1"></i>
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </Badge>
                    <Badge bg="light" text="dark" className="me-3">
                      <i className="fas fa-university me-1"></i>
                      {user?.campus || 'BITS Pilani'}
                    </Badge>
                    {user?.role === 'student' && (
                      <Badge bg="light" text="dark">
                        <i className="fas fa-graduation-cap me-1"></i>
                        {user?.branch || 'Computer Science'}
                      </Badge>
                    )}
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <div className="mb-2">
                    <i className={`${weatherData.icon} fa-2x mb-2`}></i>
                    <div className="h4 mb-0">{weatherData.temperature}°C</div>
                    <small className="opacity-75">{weatherData.condition}</small>
                  </div>
                  <div className="small opacity-75">
                    <div>Humidity: {weatherData.humidity}%</div>
                    <div>Wind: {weatherData.windSpeed} km/h</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        {user?.role === 'student' && (
          <>
            <Col md={3}>
              <Card className="text-center border-primary h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-graduation-cap text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-primary">{dashboardData.cgpa}</h3>
                  <small className="text-muted">Current CGPA</small>
                  <ProgressBar 
                    now={(dashboardData.cgpa / 10) * 100} 
                    variant="primary" 
                    className="mt-2" 
                    style={{ height: '4px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-success h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-calendar-check text-success mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-success">{dashboardData.attendancePercentage}%</h3>
                  <small className="text-muted">Attendance</small>
                  <ProgressBar 
                    now={dashboardData.attendancePercentage} 
                    variant={getProgressColor(dashboardData.attendancePercentage)} 
                    className="mt-2" 
                    style={{ height: '4px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-info h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-credit-card text-info mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-info">{dashboardData.creditsCompleted}/{dashboardData.totalCredits}</h3>
                  <small className="text-muted">Credits</small>
                  <ProgressBar 
                    now={(dashboardData.creditsCompleted / dashboardData.totalCredits) * 100} 
                    variant="info" 
                    className="mt-2" 
                    style={{ height: '4px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-warning h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-tasks text-warning mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-warning">{dashboardData.pendingAssignments}</h3>
                  <small className="text-muted">Pending Tasks</small>
                  <div className="mt-2">
                    <Badge bg={dashboardData.pendingAssignments > 5 ? 'danger' : 'success'}>
                      {dashboardData.pendingAssignments > 5 ? 'High' : 'Manageable'}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {user?.role === 'faculty' && (
          <>
            <Col md={3}>
              <Card className="text-center border-primary h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-book-open text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-primary">{dashboardData.coursesTeaching}</h3>
                  <small className="text-muted">Courses Teaching</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-success h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-users text-success mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-success">{dashboardData.totalStudents}</h3>
                  <small className="text-muted">Total Students</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-warning h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-clipboard-check text-warning mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-warning">{dashboardData.pendingGrades}</h3>
                  <small className="text-muted">Pending Grades</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-info h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-clock text-info mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-info">{dashboardData.upcomingClasses}</h3>
                  <small className="text-muted">Today's Classes</small>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <Col md={3}>
              <Card className="text-center border-primary h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-users text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-primary">{dashboardData.totalStudents?.toLocaleString()}</h3>
                  <small className="text-muted">Total Students</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-success h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-chalkboard-teacher text-success mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-success">{dashboardData.totalFaculty}</h3>
                  <small className="text-muted">Faculty Members</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-info h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-server text-info mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-info">{dashboardData.systemUptime}%</h3>
                  <small className="text-muted">System Uptime</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-warning h-100 shadow-sm">
                <Card.Body>
                  <i className="fas fa-user-clock text-warning mb-2" style={{ fontSize: '2rem' }}></i>
                  <h3 className="text-warning">{dashboardData.activeUsers?.toLocaleString()}</h3>
                  <small className="text-muted">Active Users</small>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {user?.role === 'student' && (
                  <>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-primary" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('grades')}
                      >
                        <i className="fas fa-chart-line fa-2x mb-2"></i>
                        <span>View Grades</span>
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-success" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('timetable')}
                      >
                        <i className="fas fa-calendar-alt fa-2x mb-2"></i>
                        <span>Timetable</span>
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-info" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('library')}
                      >
                        <i className="fas fa-book fa-2x mb-2"></i>
                        <span>Library</span>
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-warning" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('fees')}
                      >
                        <i className="fas fa-credit-card fa-2x mb-2"></i>
                        <span>Pay Fees</span>
                      </Button>
                    </Col>
                  </>
                )}

                {user?.role === 'faculty' && (
                  <>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-primary" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('attendance')}
                      >
                        <i className="fas fa-check fa-2x mb-2"></i>
                        <span>Mark Attendance</span>
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-success" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('grades')}
                      >
                        <i className="fas fa-edit fa-2x mb-2"></i>
                        <span>Enter Grades</span>
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-info" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('students')}
                      >
                        <i className="fas fa-users fa-2x mb-2"></i>
                        <span>View Students</span>
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-warning" 
                                                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('courses')}
                      >
                        <i className="fas fa-book-open fa-2x mb-2"></i>
                        <span>Manage Courses</span>
                      </Button>
                    </Col>
                  </>
                )}

                {user?.role === 'admin' && (
                  <>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-primary" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('students')}
                      >
                        <i className="fas fa-users fa-2x mb-2"></i>
                        <span>Manage Students</span>
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-success" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('reports')}
                      >
                        <i className="fas fa-chart-bar fa-2x mb-2"></i>
                        <span>View Reports</span>
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-info" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('settings')}
                      >
                        <i className="fas fa-cogs fa-2x mb-2"></i>
                        <span>System Settings</span>
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        variant="outline-warning" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                        onClick={() => handleQuickAction('courses')}
                      >
                        <i className="fas fa-university fa-2x mb-2"></i>
                        <span>Manage Faculty</span>
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Row */}
      <Row>
        {/* Left Column */}
        <Col md={8}>
          {/* Recent Activities */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Activities
              </h5>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/notifications')}>
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {recentActivities.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No recent activities to display.
                </Alert>
              ) : (
                <div className="activity-list">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                      <div className={`me-3 text-${activity.color}`}>
                        <i className={activity.icon} style={{ fontSize: '1.2rem' }}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-medium">{activity.action}</div>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-calendar-alt me-2"></i>
                Upcoming Events
              </h5>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/calendar')}>
                View Calendar
              </Button>
            </Card.Header>
            <Card.Body>
              {upcomingEvents.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No upcoming events scheduled.
                </Alert>
              ) : (
                <Table hover responsive>
                  <tbody>
                    {upcomingEvents.slice(0, 5).map((event) => (
                      <tr key={event.id}>
                        <td className="border-0">
                          <div className={`text-${getPriorityColor(event.priority)} me-2`}>
                            <i className={getTypeIcon(event.type)}></i>
                          </div>
                        </td>
                        <td className="border-0">
                          <div className="fw-medium">{event.title}</div>
                          <small className="text-muted">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </small>
                        </td>
                        <td className="border-0 text-end">
                          <Badge bg={getPriorityColor(event.priority)}>
                            {event.priority}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column */}
        <Col md={4}>
          {/* Motivational Quote */}
          <Card className="mb-4 shadow-sm border-0 bg-gradient-success text-white">
            <Card.Body className="text-center">
              <i className="fas fa-quote-left fa-2x mb-3 opacity-75"></i>
              <p className="mb-3 fst-italic">{motivationalQuote}</p>
              <small className="opacity-75">— Daily Inspiration</small>
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Today's Summary
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Classes Today</span>
                <Badge bg="primary" pill>{quickStats.todayClasses || quickStats.classesToday || 0}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Completed Tasks</span>
                <Badge bg="success" pill>{quickStats.completedToday || quickStats.studentsPresent || quickStats.newRegistrations || 0}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Pending Items</span>
                <Badge bg="warning" pill>{quickStats.assignmentsDue || quickStats.gradesToSubmit || quickStats.supportTickets || 0}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>This Week</span>
                <Badge bg="info" pill>{quickStats.studyHoursWeek || quickStats.researchHours || quickStats.dataBackups || 0}</Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Notifications */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                <i className="fas fa-bell me-2"></i>
                Recent Notifications
              </h6>
              <Badge bg="danger" pill>
                {notifications.filter(n => !n.isRead).length}
              </Badge>
            </Card.Header>
            <Card.Body>
              {notifications.length === 0 ? (
                <div className="text-center text-muted">
                  <i className="fas fa-bell-slash fa-2x mb-2"></i>
                  <div>No notifications</div>
                </div>
              ) : (
                <div className="notification-list">
                  {notifications.slice(0, 4).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`mb-3 pb-2 border-bottom ${!notification.isRead ? 'fw-bold' : ''}`}
                    >
                      <div className="small">{notification.message}</div>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <small className="text-muted">{notification.time}</small>
                        {!notification.isRead && (
                          <Badge bg="primary" pill>New</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => navigate('/notifications')}
                >
                  View All Notifications
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Welcome Modal */}
      <Modal show={showWelcomeModal} onHide={() => setShowWelcomeModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="fas fa-star me-2"></i>
            Welcome to BITS Campus ERP!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <div className="mb-4">
            <i className="fas fa-graduation-cap text-primary" style={{ fontSize: '4rem' }}></i>
          </div>
          <h4 className="mb-3">Get Started with Your Dashboard</h4>
          <p className="mb-4">
            Explore all the features available to you as a {user?.role}. 
            Your personalized dashboard provides quick access to everything you need.
          </p>
          
          <Row className="text-start">
            <Col md={6}>
              <h6><i className="fas fa-check-circle text-success me-2"></i>Quick Actions</h6>
              <p className="small text-muted mb-3">Access frequently used features instantly</p>
              
              <h6><i className="fas fa-check-circle text-success me-2"></i>Real-time Updates</h6>
              <p className="small text-muted mb-3">Stay informed with live notifications</p>
            </Col>
            <Col md={6}>
              <h6><i className="fas fa-check-circle text-success me-2"></i>Personalized Content</h6>
              <p className="small text-muted mb-3">Content tailored to your role and needs</p>
              
              <h6><i className="fas fa-check-circle text-success me-2"></i>Mobile Friendly</h6>
              <p className="small text-muted mb-3">Access from any device, anywhere</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowWelcomeModal(false)} className="px-4">
            <i className="fas fa-rocket me-2"></i>
            Let's Get Started!
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Dashboard;

