import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function AttendanceManagement() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudents();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      // Mock courses data for faculty
      setCourses([
        {
          course_id: '1',
          course_code: 'CS F212',
          course_name: 'Database Systems',
          enrolled_students: 45
        },
        {
          course_id: '2',
          course_code: 'CS F213',
          course_name: 'Object Oriented Programming',
          enrolled_students: 52
        },
        {
          course_id: '3',
          course_code: 'CS F301',
          course_name: 'Software Engineering',
          enrolled_students: 38
        }
      ]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Mock students data
      setStudents([
        {
          student_id: '2021A7PS001P',
          name: 'Arjun Sharma',
          email: 'arjun.sharma@bits-pilani.ac.in',
          attendance_percentage: 92
        },
        {
          student_id: '2021A7PS002P',
          name: 'Priya Patel',
          email: 'priya.patel@bits-pilani.ac.in',
          attendance_percentage: 88
        },
        {
          student_id: '2021A7PS003P',
          name: 'Rahul Kumar',
          email: 'rahul.kumar@bits-pilani.ac.in',
          attendance_percentage: 95
        },
        {
          student_id: '2021A7PS004P',
          name: 'Sneha Reddy',
          email: 'sneha.reddy@bits-pilani.ac.in',
          attendance_percentage: 78
        }
      ]);

      // Initialize attendance for today
      const todayAttendance = {};
      setStudents(prevStudents => {
        prevStudents.forEach(student => {
          todayAttendance[student.student_id] = true; // Default to present
        });
        setAttendance(todayAttendance);
        return prevStudents;
      });
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const submitAttendance = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const presentCount = Object.values(attendance).filter(Boolean).length;
      const totalCount = students.length;
      
      toast.success(`Attendance submitted successfully! ${presentCount}/${totalCount} students present.`);
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to submit attendance');
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'success';
    if (percentage >= 75) return 'warning';
    return 'danger';
  };

  const generateAttendanceReport = () => {
    if (!selectedCourse) {
      toast.error('Please select a course first');
      return;
    }
    
    toast.info('Generating attendance report...');
    // Simulate report generation
    setTimeout(() => {
      toast.success('Attendance report generated successfully!');
    }, 2000);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading attendance...</span>
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
              <i className="fas fa-clipboard-check text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Attendance Management</h2>
                <small className="text-muted">Mark and track student attendance</small>
              </div>
            </div>
            <div>
              <Button variant="outline-info" className="me-2" onClick={generateAttendanceReport}>
                <i className="fas fa-chart-bar me-2"></i>
                Generate Report
              </Button>
              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
                disabled={!selectedCourse}
              >
                <i className="fas fa-plus me-2"></i>
                Mark Attendance
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Course Selection */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-book me-2"></i>
                Select Course
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Course</Form.Label>
                    <Form.Select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                      <option value="">Select a course</option>
                      {courses.map(course => (
                        <option key={course.course_id} value={course.course_id}>
                          {course.course_code} - {course.course_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Students List */}
      {selectedCourse && (
        <Row>
          <Col>
            <Card>
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="fas fa-users me-2"></i>
                  Students - {courses.find(c => c.course_id === selectedCourse)?.course_name}
                </h5>
              </Card.Header>
              <Card.Body>
                {students.length === 0 ? (
                  <Alert variant="info">
                    No students enrolled in this course.
                  </Alert>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Overall Attendance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.student_id}>
                          <td className="fw-bold">{student.student_id}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="me-2">{student.attendance_percentage}%</span>
                              <Badge bg={getAttendanceColor(student.attendance_percentage)}>
                                {student.attendance_percentage >= 85 ? 'Good' : 
                                 student.attendance_percentage >= 75 ? 'Average' : 'Poor'}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <Badge bg={student.attendance_percentage >= 75 ? 'success' : 'danger'}>
                              {student.attendance_percentage >= 75 ? 'Eligible' : 'At Risk'}
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
        </Row>
      )}

      {/* Mark Attendance Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-clipboard-check me-2"></i>
            Mark Attendance - {new Date(selectedDate).toLocaleDateString()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && (
            <>
              <Alert variant="info">
                <strong>Course:</strong> {courses.find(c => c.course_id === selectedCourse)?.course_name}
                <br />
                <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
              </Alert>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Present</th>
                    <th>Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.student_id}>
                      <td className="fw-bold">{student.student_id}</td>
                      <td>{student.name}</td>
                      <td>
                        <Form.Check
                          type="radio"
                          name={`attendance_${student.student_id}`}
                          checked={attendance[student.student_id] === true}
                          onChange={() => handleAttendanceChange(student.student_id, true)}
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="radio"
                          name={`attendance_${student.student_id}`}
                          checked={attendance[student.student_id] === false}
                          onChange={() => handleAttendanceChange(student.student_id, false)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Alert variant="light">
                <div className="d-flex justify-content-between">
                  <span>
                    <strong>Present:</strong> {Object.values(attendance).filter(Boolean).length}
                  </span>
                  <span>
                    <strong>Absent:</strong> {Object.values(attendance).filter(val => val === false).length}
                  </span>
                  <span>
                    <strong>Total:</strong> {students.length}
                  </span>
                </div>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitAttendance}>
            <i className="fas fa-save me-2"></i>
            Submit Attendance
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AttendanceManagement;
