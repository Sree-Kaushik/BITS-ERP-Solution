import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function CourseManagement() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');
  
  const [courseForm, setCourseForm] = useState({
    course_code: '',
    course_name: '',
    credits: 3,
    semester_type: 'monsoon',
    academic_year: 2025,
    faculty_id: '',
    department: '',
    max_students: 50,
    description: '',
    prerequisites: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Mock course data
      setCourses([
        {
          course_id: '1',
          course_code: 'CS F212',
          course_name: 'Database Systems',
          credits: 3,
          semester_type: 'monsoon',
          academic_year: 2025,
          faculty_name: 'Dr. Rajesh Kumar',
          department: 'Computer Science',
          enrolled_students: 45,
          max_students: 50,
          status: 'active',
          description: 'Introduction to database concepts and SQL',
          prerequisites: 'CS F211'
        },
        {
          course_id: '2',
          course_code: 'CS F213',
          course_name: 'Object Oriented Programming',
          credits: 4,
          semester_type: 'monsoon',
          academic_year: 2025,
          faculty_name: 'Prof. Priya Sharma',
          department: 'Computer Science',
          enrolled_students: 52,
          max_students: 60,
          status: 'active',
          description: 'Advanced programming concepts using OOP',
          prerequisites: 'CS F111'
        },
        {
          course_id: '3',
          course_code: 'MATH F211',
          course_name: 'Mathematics III',
          credits: 3,
          semester_type: 'spring',
          academic_year: 2025,
          faculty_name: 'Dr. Amit Singh',
          department: 'Mathematics',
          enrolled_students: 38,
          max_students: 45,
          status: 'active',
          description: 'Advanced calculus and differential equations',
          prerequisites: 'MATH F112'
        }
      ]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCourse) {
        // Update existing course
        setCourses(prev => 
          prev.map(course => 
            course.course_id === editingCourse.course_id 
              ? { ...course, ...courseForm, faculty_name: 'Updated Faculty' }
              : course
          )
        );
        toast.success('Course updated successfully!');
      } else {
        // Add new course
        const newCourse = {
          course_id: Date.now().toString(),
          ...courseForm,
          faculty_name: 'New Faculty',
          enrolled_students: 0,
          status: 'active'
        };
        setCourses(prev => [...prev, newCourse]);
        toast.success('Course created successfully!');
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  const resetForm = () => {
    setCourseForm({
      course_code: '',
      course_name: '',
      credits: 3,
      semester_type: 'monsoon',
      academic_year: 2025,
      faculty_id: '',
      department: '',
      max_students: 50,
      description: '',
      prerequisites: ''
    });
    setEditingCourse(null);
  };

  const editCourse = (course) => {
    setCourseForm({
      course_code: course.course_code,
      course_name: course.course_name,
      credits: course.credits,
      semester_type: course.semester_type,
      academic_year: course.academic_year,
      faculty_id: course.faculty_id || '',
      department: course.department,
      max_students: course.max_students,
      description: course.description,
      prerequisites: course.prerequisites
    });
    setEditingCourse(course);
    setShowModal(true);
  };

  const deleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev.filter(course => course.course_id !== courseId));
      toast.success('Course deleted successfully!');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.faculty_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = filterSemester === 'all' || course.semester_type === filterSemester;
    
    return matchesSearch && matchesSemester;
  });

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      inactive: 'secondary',
      completed: 'primary'
    };
    return variants[status] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading courses...</span>
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
              <i className="fas fa-book-open text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Course Management</h2>
                <small className="text-muted">Manage university courses and curriculum</small>
              </div>
            </div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus me-2"></i>
              Add Course
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Search Courses</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by course code, name, or faculty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Semester</Form.Label>
                    <Form.Select
                      value={filterSemester}
                      onChange={(e) => setFilterSemester(e.target.value)}
                    >
                      <option value="all">All Semesters</option>
                      <option value="monsoon">Monsoon</option>
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Courses Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Courses ({filteredCourses.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {filteredCourses.length === 0 ? (
                <Alert variant="info">
                  No courses found matching your search criteria.
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Credits</th>
                      <th>Faculty</th>
                      <th>Enrollment</th>
                      <th>Semester</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.course_id}>
                        <td className="fw-bold">{course.course_code}</td>
                        <td>{course.course_name}</td>
                        <td>
                          <Badge bg="info">{course.credits}</Badge>
                        </td>
                        <td>{course.faculty_name}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-2">
                              {course.enrolled_students}/{course.max_students}
                            </span>
                            <div style={{ width: '60px' }}>
                              <div 
                                className="progress" 
                                style={{ height: '6px' }}
                              >
                                <div 
                                  className="progress-bar" 
                                  style={{ 
                                    width: `${(course.enrolled_students / course.max_students) * 100}%`,
                                    backgroundColor: course.enrolled_students >= course.max_students ? '#dc3545' : '#0d6efd'
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{course.semester_type} {course.academic_year}</td>
                        <td>
                          <Badge bg={getStatusBadge(course.status)}>
                            {course.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => editCourse(course)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-info"
                              size="sm"
                              href={`/courses/${course.course_id}/students`}
                            >
                              <i className="fas fa-users"></i>
                            </Button>
                            {user?.role === 'admin' && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => deleteCourse(course.course_id)}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            )}
                          </div>
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

      {/* Add/Edit Course Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-book me-2"></i>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseForm.course_code}
                    onChange={(e) => setCourseForm({...courseForm, course_code: e.target.value})}
                    placeholder="e.g., CS F212"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseForm.course_name}
                    onChange={(e) => setCourseForm({...courseForm, course_name: e.target.value})}
                    placeholder="e.g., Database Systems"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Credits</Form.Label>
                  <Form.Select
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({...courseForm, credits: parseInt(e.target.value)})}
                  >
                    <option value={1}>1 Credit</option>
                    <option value={2}>2 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={4}>4 Credits</option>
                    <option value={5}>5 Credits</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    value={courseForm.semester_type}
                    onChange={(e) => setCourseForm({...courseForm, semester_type: e.target.value})}
                  >
                    <option value="monsoon">Monsoon</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Academic Year</Form.Label>
                  <Form.Select
                    value={courseForm.academic_year}
                    onChange={(e) => setCourseForm({...courseForm, academic_year: parseInt(e.target.value)})}
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    value={courseForm.department}
                    onChange={(e) => setCourseForm({...courseForm, department: e.target.value})}
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics & Communication</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Chemical">Chemical Engineering</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Students</Form.Label>
                  <Form.Control
                    type="number"
                    value={courseForm.max_students}
                    onChange={(e) => setCourseForm({...courseForm, max_students: parseInt(e.target.value)})}
                    min="1"
                    max="200"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Prerequisites</Form.Label>
              <Form.Control
                type="text"
                value={courseForm.prerequisites}
                onChange={(e) => setCourseForm({...courseForm, prerequisites: e.target.value})}
                placeholder="e.g., CS F111, MATH F112"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={courseForm.description}
                onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                placeholder="Course description and objectives..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowModal(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <i className="fas fa-save me-2"></i>
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default CourseManagement;
