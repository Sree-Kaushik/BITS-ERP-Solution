import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Badge, Button, Offcanvas, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function NavigationBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    fetchNotifications();
    loadQuickActions();
  }, [user]);

  const fetchNotifications = () => {
    // Mock notifications
    const mockNotifications = [
      {
        id: '1',
        title: 'New Grade Posted',
        message: 'Your grade for Database Systems has been posted.',
        type: 'academic',
        timestamp: new Date(Date.now() - 3600000),
        isRead: false,
        icon: 'fas fa-graduation-cap',
        color: 'primary'
      },
      {
        id: '2',
        title: 'Assignment Deadline',
        message: 'Data Structures assignment due tomorrow.',
        type: 'deadline',
        timestamp: new Date(Date.now() - 7200000),
        isRead: false,
        icon: 'fas fa-clock',
        color: 'warning'
      },
      {
        id: '3',
        title: 'Fee Payment Reminder',
        message: 'Semester fee payment due in 3 days.',
        type: 'financial',
        timestamp: new Date(Date.now() - 86400000),
        isRead: true,
        icon: 'fas fa-credit-card',
        color: 'info'
      },
      {
        id: '4',
        title: 'Library Book Due',
        message: 'Database System Concepts due for return.',
        type: 'library',
        timestamp: new Date(Date.now() - 172800000),
        isRead: false,
        icon: 'fas fa-book',
        color: 'success'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  };

  const loadQuickActions = () => {
    const actions = {
      student: [
        { label: 'View Grades', icon: 'fas fa-chart-line', path: '/grades', color: 'primary' },
        { label: 'Timetable', icon: 'fas fa-calendar', path: '/timetable', color: 'success' },
        { label: 'Library', icon: 'fas fa-book', path: '/library', color: 'info' },
        { label: 'Pay Fees', icon: 'fas fa-credit-card', path: '/fees', color: 'warning' }
      ],
      faculty: [
        { label: 'Mark Attendance', icon: 'fas fa-check', path: '/attendance', color: 'primary' },
        { label: 'Enter Grades', icon: 'fas fa-edit', path: '/grade-entry', color: 'success' },
        { label: 'View Students', icon: 'fas fa-users', path: '/students', color: 'info' },
        { label: 'Courses', icon: 'fas fa-book-open', path: '/courses', color: 'warning' }
      ],
      admin: [
        { label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/dashboard', color: 'primary' },
        { label: 'Manage Users', icon: 'fas fa-users-cog', path: '/user-management', color: 'success' },
        { label: 'Reports', icon: 'fas fa-chart-bar', path: '/reports', color: 'info' },
        { label: 'Settings', icon: 'fas fa-cogs', path: '/system-settings', color: 'warning' }
      ]
    };
    
    setQuickActions(actions[user?.role] || actions.student);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/auth');
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getUserInitials = () => {
    if (!user?.username) return 'U';
    const names = user.username.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    }
    return names[0].charAt(0);
  };

  const getRoleColor = () => {
    const colors = {
      admin: 'danger',
      faculty: 'success',
      student: 'primary'
    };
    return colors[user?.role] || 'primary';
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm border-bottom" fixed="top">
        <Container fluid>
          {/* Brand */}
          <Navbar.Brand as={Link} to="/dashboard" className="fw-bold text-primary d-flex align-items-center">
            <div 
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
              style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}
            >
              B
            </div>
            <div className="d-none d-md-block">
              <div>BITS Campus ERP</div>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Portal
              </small>
            </div>
          </Navbar.Brand>

          {/* Mobile Menu Toggle */}
          <div className="d-lg-none">
            <Button
              variant="outline-primary"
              onClick={() => setShowMobileMenu(true)}
              className="me-2"
            >
              <i className="fas fa-bars"></i>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-block">
            <Nav className="me-auto">
              {/* Academic Menu */}
              <NavDropdown title={<><i className="fas fa-graduation-cap me-1"></i>Academic</>} id="academic-dropdown">
                <NavDropdown.Item as={Link} to="/grades">
                  <i className="fas fa-chart-line me-2 text-primary"></i>
                  Grades & Performance
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/timetable">
                  <i className="fas fa-calendar-alt me-2 text-success"></i>
                  Timetable
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/examinations">
                  <i className="fas fa-clipboard-list me-2 text-warning"></i>
                  Examinations
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/calendar">
                  <i className="fas fa-calendar me-2 text-info"></i>
                  Academic Calendar
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/recommendations">
                  <i className="fas fa-star me-2 text-warning"></i>
                  Course Recommendations
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/analytics">
                  <i className="fas fa-chart-bar me-2 text-primary"></i>
                  Analytics Dashboard
                </NavDropdown.Item>
              </NavDropdown>

              {/* Campus Services Menu */}
              <NavDropdown title={<><i className="fas fa-university me-1"></i>Campus</>} id="campus-dropdown">
                <NavDropdown.Item as={Link} to="/library">
                  <i className="fas fa-book me-2 text-primary"></i>
                  Digital Library
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/hostel">
                  <i className="fas fa-building me-2 text-success"></i>
                  Hostel Management
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/fees">
                  <i className="fas fa-credit-card me-2 text-warning"></i>
                  Fee Management
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/chat">
                  <i className="fas fa-comments me-2 text-info"></i>
                  Campus Chat
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/study-planner">
                  <i className="fas fa-brain me-2 text-purple"></i>
                  Study Planner
                </NavDropdown.Item>
              </NavDropdown>

              {/* Faculty/Admin Menu */}
              {(user?.role === 'faculty' || user?.role === 'admin') && (
                <NavDropdown title={<><i className="fas fa-cogs me-1"></i>Management</>} id="management-dropdown">
                  {user?.role === 'faculty' && (
                    <>
                      <NavDropdown.Item as={Link} to="/students">
                        <i className="fas fa-users me-2 text-primary"></i>
                        Student Management
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/attendance">
                        <i className="fas fa-check me-2 text-success"></i>
                        Attendance Management
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/grade-entry">
                        <i className="fas fa-edit me-2 text-warning"></i>
                        Grade Entry
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/courses">
                        <i className="fas fa-book-open me-2 text-info"></i>
                        Course Management
                      </NavDropdown.Item>
                    </>
                  )}
                  
                  {user?.role === 'admin' && (
                    <>
                      <NavDropdown.Item as={Link} to="/user-management">
                        <i className="fas fa-users-cog me-2 text-primary"></i>
                        User Management
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/reports">
                        <i className="fas fa-chart-bar me-2 text-success"></i>
                        Reports & Analytics
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/system-settings">
                        <i className="fas fa-cogs me-2 text-warning"></i>
                        System Settings
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/manage-faculty">
                        <i className="fas fa-chalkboard-teacher me-2 text-info"></i>
                        Faculty Management
                      </NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>
              )}
            </Nav>

            {/* Search Bar */}
            <Form className="d-flex me-3" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Search anything..."
                className="me-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '250px' }}
              />
              <Button variant="outline-primary" type="submit">
                <i className="fas fa-search"></i>
              </Button>
            </Form>

            {/* Right Side Navigation */}
            <Nav>
              {/* Quick Actions */}
              <NavDropdown 
                title={<><i className="fas fa-bolt me-1"></i>Quick Actions</>} 
                id="quick-actions-dropdown"
                align="end"
              >
                {quickActions.map((action, index) => (
                  <NavDropdown.Item key={index} as={Link} to={action.path}>
                    <i className={`${action.icon} me-2 text-${action.color}`}></i>
                    {action.label}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              {/* Notifications */}
              <Nav.Link 
                onClick={() => setShowNotifications(true)}
                className="position-relative"
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-bell fs-5"></i>
                {unreadCount > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Nav.Link>

              {/* User Profile Menu */}
              <NavDropdown 
                title={
                  <div className="d-flex align-items-center">
                    <div 
                      className={`rounded-circle bg-${getRoleColor()} text-white d-flex align-items-center justify-content-center me-2`}
                      style={{ width: '32px', height: '32px', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                      {getUserInitials()}
                    </div>
                    <div className="d-none d-xl-block">
                      <div className="fw-bold" style={{ fontSize: '0.9rem' }}>
                        {user?.username || 'User'}
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {user?.student_id || user?.employee_id || 'ID'}
                      </small>
                    </div>
                  </div>
                } 
                id="user-dropdown"
                align="end"
              >
                <div className="px-3 py-2 border-bottom">
                  <div className="fw-bold">{user?.username || 'User Name'}</div>
                  <small className="text-muted">{user?.email || 'user@bits-pilani.ac.in'}</small>
                  <div>
                    <Badge bg={getRoleColor()} className="mt-1">
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="fas fa-user me-2 text-primary"></i>
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">
                  <i className="fas fa-cog me-2 text-secondary"></i>
                  Account Settings
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/preferences">
                  <i className="fas fa-sliders-h me-2 text-info"></i>
                  Preferences
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/help">
                  <i className="fas fa-question-circle me-2 text-success"></i>
                  Help & Support
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/feedback">
                  <i className="fas fa-comment me-2 text-warning"></i>
                  Send Feedback
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2 text-danger"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Menu Offcanvas */}
      <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="start">
        <Offcanvas.Header closeButton className="bg-primary text-white">
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <div 
                className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-2"
                style={{ width: '32px', height: '32px', fontSize: '1rem', fontWeight: 'bold' }}
              >
                B
              </div>
              BITS ERP
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          {/* User Info */}
          <div className="p-3 bg-light border-bottom">
            <div className="d-flex align-items-center">
              <div 
                className={`rounded-circle bg-${getRoleColor()} text-white d-flex align-items-center justify-content-center me-3`}
                style={{ width: '48px', height: '48px', fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                {getUserInitials()}
              </div>
              <div>
                <div className="fw-bold">{user?.username || 'User'}</div>
                <small className="text-muted">{user?.student_id || user?.employee_id}</small>
                <div>
                  <Badge bg={getRoleColor()}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-bottom">
            <h6 className="text-muted mb-3">Quick Actions</h6>
            <div className="row g-2">
              {quickActions.map((action, index) => (
                <div key={index} className="col-6">
                  <Button
                    variant={`outline-${action.color}`}
                    className="w-100 text-start"
                    onClick={() => {
                      navigate(action.path);
                      setShowMobileMenu(false);
                    }}
                  >
                    <i className={`${action.icon} me-2`}></i>
                    <small>{action.label}</small>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="list-group list-group-flush">
            <Button
              variant="link"
              className="list-group-item list-group-item-action text-start"
              onClick={() => {
                navigate('/dashboard');
                setShowMobileMenu(false);
              }}
            >
              <i className="fas fa-tachometer-alt me-3 text-primary"></i>
              Dashboard
            </Button>
            
            <Button
              variant="link"
              className="list-group-item list-group-item-action text-start"
              onClick={() => {
                navigate('/profile');
                setShowMobileMenu(false);
              }}
            >
              <i className="fas fa-user me-3 text-success"></i>
              My Profile
            </Button>
            
            <Button
              variant="link"
              className="list-group-item list-group-item-action text-start"
              onClick={() => {
                navigate('/grades');
                setShowMobileMenu(false);
              }}
            >
              <i className="fas fa-chart-line me-3 text-info"></i>
              Grades
            </Button>
            
            <Button
              variant="link"
              className="list-group-item list-group-item-action text-start"
              onClick={() => {
                navigate('/library');
                setShowMobileMenu(false);
              }}
            >
              <i className="fas fa-book me-3 text-warning"></i>
              Library
            </Button>
            
            <Button
              variant="link"
              className="list-group-item list-group-item-action text-start"
              onClick={() => {
                navigate('/settings');
                setShowMobileMenu(false);
              }}
            >
              <i className="fas fa-cog me-3 text-secondary"></i>
              Settings
            </Button>
            
            <Button
              variant="link"
              className="list-group-item list-group-item-action text-start text-danger"
              onClick={() => {
                handleLogout();
                setShowMobileMenu(false);
              }}
            >
              <i className="fas fa-sign-out-alt me-3"></i>
              Logout
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Notifications Offcanvas */}
      <Offcanvas show={showNotifications} onHide={() => setShowNotifications(false)} placement="end">
        <Offcanvas.Header closeButton className="bg-primary text-white">
          <Offcanvas.Title>
            <i className="fas fa-bell me-2"></i>
            Notifications
            {unreadCount > 0 && (
              <Badge bg="warning" className="ms-2">
                {unreadCount}
              </Badge>
            )}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          {unreadCount > 0 && (
            <div className="p-3 border-bottom">
              <Button variant="outline-primary" size="sm" onClick={markAllAsRead} className="w-100">
                <i className="fas fa-check-double me-2"></i>
                Mark All as Read
              </Button>
            </div>
          )}
          
          <div className="list-group list-group-flush">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <i className="fas fa-bell-slash fa-2x mb-3"></i>
                <div>No notifications</div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`list-group-item list-group-item-action ${!notification.isRead ? 'bg-light border-start border-primary border-3' : ''}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-start">
                    <div className={`me-3 text-${notification.color}`}>
                      <i className={notification.icon}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="mb-1">{notification.title}</h6>
                        {!notification.isRead && (
                          <Badge bg="primary" pill>New</Badge>
                        )}
                      </div>
                      <p className="mb-1 small">{notification.message}</p>
                      <small className="text-muted">{getTimeAgo(notification.timestamp)}</small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-top">
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={() => {
                navigate('/notifications');
                setShowNotifications(false);
              }}
            >
              <i className="fas fa-list me-2"></i>
              View All Notifications
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Spacer for fixed navbar */}
      <div style={{ height: '76px' }}></div>
    </>
  );
}

export default NavigationBar;
