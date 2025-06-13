import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function FacultyDashboard() {
  const { user } = useAuth();
  const [facultyData, setFacultyData] = useState({});
  const [myCourses, setMyCourses] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = () => {
    // Mock faculty data
    setFacultyData({
      totalStudents: 156,
      totalCourses: 4,
      pendingGrades: 23,
      attendanceToMark: 8,
      upcomingClasses: 3,
      officeHours: 'Mon, Wed, Fri 2:00-4:00 PM'
    });

    setMyCourses([
      {
        id: 1,
        code: 'CS F212',
        name: 'Database Systems',
        students: 45,
        semester: 'Monsoon 2025',
        room: 'F101',
        schedule: 'Mon, Wed, Fri 9:00-10:30 AM'
      },
      {
        id: 2,
        code: 'CS F213',
        name: 'Object Oriented Programming',
        students: 52,
        semester: 'Monsoon 2025',
        room: 'F102',
        schedule: 'Tue, Thu 10:30-12:00 PM'
      },
      {
        id: 3,
        code: 'CS F301',
        name: 'Software Engineering',
        students: 38,
        semester: 'Monsoon 2025',
        room: 'F103',
        schedule: 'Mon, Wed 2:00-3:30 PM'
      },
      {
        id: 4,
        code: 'CS F411',
        name: 'Database Lab',
        students: 25,
        semester: 'Monsoon 2025',
        room: 'Lab-1',
        schedule: 'Thu 2:00-5:00 PM'
      }
    ]);

    setPendingTasks([
      { id: 1, task: 'Grade CS F212 Mid-semester exams', priority: 'high', dueDate: '2025-06-15' },
      { id: 2, task: 'Submit attendance for CS F213', priority: 'medium', dueDate: '2025-06-14' },
      { id: 3, task: 'Prepare lecture notes for Software Engineering', priority: 'low', dueDate: '2025-06-16' },
      { id: 4, task: 'Review project submissions', priority: 'medium', dueDate: '2025-06-17' }
    ]);

    setRecentActivities([
      { id: 1, activity: 'Submitted grades for CS F212 Assignment 3', time: '2 hours ago' },
      { id: 2, activity: 'Marked attendance for Database Lab', time: '1 day ago' },
      { id: 3, activity: 'Created new assignment for OOP course', time: '2 days ago' },
      { id: 4, activity: 'Updated course syllabus', time: '3 days ago' }
    ]);

    setLoading(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'danger',
      medium: 'warning',
      low: 'info'
    };
    return colors[priority] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading faculty dashboard...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-chalkboard-teacher text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">Faculty Dashboard</h2>
              <small className="text-muted">Welcome back, {user?.username}!</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Faculty Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary h-100">
            <Card.Body>
              <i className="fas fa-users text-primary mb-2" style={{ fontSize: '2rem' }}></i>
              <h3 className="text-primary">{facultyData.totalStudents}</h3>
              <small className="text-muted">Total Students</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success h-100">
            <Card.Body>
              <i className="fas fa-book-open text-success mb-2" style={{ fontSize: '2rem' }}></i>
              <h3 className="text-success">{facultyData.totalCourses}</h3>
              <small className="text-muted">My Courses</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <i className="fas fa-clipboard-check text-warning mb-2" style={{ fontSize: '2rem' }}></i>
              <h3 className="text-warning">{facultyData.pendingGrades}</h3>
              <small className="text-muted">Pending Grades</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info h-100">
            <Card.Body>
              <i className="fas fa-calendar-check text-info mb-2" style={{ fontSize: '2rem' }}></i>
              <h3 className="text-info">{facultyData.upcomingClasses}</h3>
              <small className="text-muted">Today's Classes</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* My Courses */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-book me-2"></i>
                My Courses - Monsoon 2025
              </h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Students</th>
                    <th>Room</th>
                    <th>Schedule</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myCourses.map((course) => (
                    <tr key={course.id}>
                      <td className="fw-bold">{course.code}</td>
                      <td>{course.name}</td>
                      <td>
                        <Badge bg="info">{course.students} students</Badge>
                      </td>
                      <td>{course.room}</td>
                      <td className="small">{course.schedule}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button variant="outline-primary" size="sm" href="/attendance">
                            <i className="fas fa-check"></i>
                          </Button>
                          <Button variant="outline-success" size="sm" href="/grade-entry">
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button variant="outline-info" size="sm" href="/students">
                            <i className="fas fa-users"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pending Tasks and Recent Activities */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="fas fa-tasks me-2"></i>
                Pending Tasks
              </h5>
            </Card.Header>
            <Card.Body>
              {pendingTasks.map((task) => (
                <Alert key={task.id} variant="light" className="border-start border-3 border-warning">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{task.task}</div>
                      <small className="text-muted">Due: {new Date(task.dueDate).toLocaleDateString()}</small>
                    </div>
                    <Badge bg={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Activities
              </h5>
            </Card.Header>
            <Card.Body>
              {recentActivities.map((activity) => (
                <div key={activity.id} className="mb-3 pb-3 border-bottom">
                  <div className="fw-bold">{activity.activity}</div>
                  <small className="text-muted">{activity.time}</small>
                </div>
              ))}
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
                  <Button variant="outline-primary" className="w-100" href="/attendance">
                    <i className="fas fa-clipboard-check d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    Mark Attendance
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-success" className="w-100" href="/grade-entry">
                    <i className="fas fa-edit d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    Enter Grades
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-info" className="w-100" href="/students">
                    <i className="fas fa-users d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    View Students
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-warning" className="w-100" href="/courses">
                    <i className="fas fa-book-open d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    Manage Courses
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

export default FacultyDashboard;
