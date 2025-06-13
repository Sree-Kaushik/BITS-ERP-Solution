import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function GradeEntry() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examinations, setExaminations] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchExaminations();
      fetchStudents();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      // Mock courses data
      setCourses([
        {
          course_id: '1',
          course_code: 'CS F212',
          course_name: 'Database Systems',
          credits: 3
        },
        {
          course_id: '2',
          course_code: 'CS F213',
          course_name: 'Object Oriented Programming',
          credits: 4
        },
        {
          course_id: '3',
          course_code: 'CS F301',
          course_name: 'Software Engineering',
          credits: 3
        }
      ]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExaminations = async () => {
    try {
      // Mock examinations data
      setExaminations([
        {
          exam_id: '1',
          exam_name: 'Mid Semester Exam',
          exam_type: 'mid_semester',
          total_marks: 100,
          exam_date: '2025-06-20'
        },
        {
          exam_id: '2',
          exam_name: 'Assignment 1',
          exam_type: 'assignment',
          total_marks: 50,
          exam_date: '2025-06-10'
        },
        {
          exam_id: '3',
          exam_name: 'Quiz 1',
          exam_type: 'quiz',
          total_marks: 25,
          exam_date: '2025-06-05'
        }
      ]);
    } catch (error) {
      console.error('Error fetching examinations:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      // Mock students data
      setStudents([
        {
          student_id: '2021A7PS001P',
          name: 'Arjun Sharma',
          email: 'arjun.sharma@bits-pilani.ac.in'
        },
        {
          student_id: '2021A7PS002P',
          name: 'Priya Patel',
          email: 'priya.patel@bits-pilani.ac.in'
        },
        {
          student_id: '2021A7PS003P',
          name: 'Rahul Kumar',
          email: 'rahul.kumar@bits-pilani.ac.in'
        },
        {
          student_id: '2021A7PS004P',
          name: 'Sneha Reddy',
          email: 'sneha.reddy@bits-pilani.ac.in'
        }
      ]);

      // Initialize grades
      const initialGrades = {};
      setStudents(prevStudents => {
        prevStudents.forEach(student => {
          initialGrades[student.student_id] = {
            marks: '',
            grade: '',
            remarks: ''
          };
        });
        setGrades(initialGrades);
        return prevStudents;
      });
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const calculateGrade = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'F';
  };

  const getGradePoints = (grade) => {
    const gradePoints = {
      'A+': 10, 'A': 9, 'B+': 8, 'B': 7,
      'C+': 6, 'C': 5, 'D': 4, 'F': 0
    };
    return gradePoints[grade] || 0;
  };

  const handleMarksChange = (studentId, marks) => {
    const selectedExamData = examinations.find(exam => exam.exam_id === selectedExam);
    const totalMarks = selectedExamData?.total_marks || 100;
    
    const grade = marks ? calculateGrade(parseFloat(marks), totalMarks) : '';
    
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: marks,
        grade: grade
      }
    }));
  };

  const submitGrades = async () => {
    try {
      // Validate all grades are entered
      const incompleteGrades = students.filter(student => 
        !grades[student.student_id]?.marks || grades[student.student_id]?.marks === ''
      );

      if (incompleteGrades.length > 0) {
        toast.error(`Please enter marks for all students. Missing: ${incompleteGrades.length} students`);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Grades submitted successfully!');
      setShowModal(false);
      
      // Reset grades
      const resetGrades = {};
      students.forEach(student => {
        resetGrades[student.student_id] = {
          marks: '',
          grade: '',
          remarks: ''
        };
      });
      setGrades(resetGrades);
      
    } catch (error) {
      toast.error('Failed to submit grades');
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'success', 'A': 'success', 'B+': 'primary', 'B': 'primary',
      'C+': 'info', 'C': 'info', 'D': 'warning', 'F': 'danger'
    };
    return colors[grade] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading grade entry...</span>
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
              <i className="fas fa-edit text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Grade Entry</h2>
                <small className="text-muted">Enter and manage student grades</small>
              </div>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              disabled={!selectedCourse || !selectedExam}
            >
              <i className="fas fa-save me-2"></i>
              Submit Grades
            </Button>
          </div>
        </Col>
      </Row>

      {/* Course and Exam Selection */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-cog me-2"></i>
                Selection Criteria
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
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
                  <Form.Group className="mb-3">
                    <Form.Label>Examination</Form.Label>
                    <Form.Select
                      value={selectedExam}
                      onChange={(e) => setSelectedExam(e.target.value)}
                      disabled={!selectedCourse}
                    >
                      <option value="">Select an examination</option>
                      {examinations.map(exam => (
                        <option key={exam.exam_id} value={exam.exam_id}>
                          {exam.exam_name} (Max: {exam.total_marks} marks)
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              {selectedCourse && selectedExam && (
                <Alert variant="info">
                  <strong>Selected:</strong> {courses.find(c => c.course_id === selectedCourse)?.course_name} - {examinations.find(e => e.exam_id === selectedExam)?.exam_name}
                  <br />
                  <strong>Total Marks:</strong> {examinations.find(e => e.exam_id === selectedExam)?.total_marks}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Grade Entry Table */}
      {selectedCourse && selectedExam && (
        <Row>
          <Col>
            <Card>
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="fas fa-table me-2"></i>
                  Grade Entry - {examinations.find(e => e.exam_id === selectedExam)?.exam_name}
                </h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Marks (/{examinations.find(e => e.exam_id === selectedExam)?.total_marks})</th>
                      <th>Grade</th>
                      <th>Grade Points</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.student_id}>
                        <td className="fw-bold">{student.student_id}</td>
                        <td>{student.name}</td>
                        <td>
                          <Form.Control
                            type="number"
                            min="0"
                            max={examinations.find(e => e.exam_id === selectedExam)?.total_marks}
                            value={grades[student.student_id]?.marks || ''}
                            onChange={(e) => handleMarksChange(student.student_id, e.target.value)}
                            placeholder="Enter marks"
                            style={{ width: '120px' }}
                          />
                        </td>
                        <td>
                          {grades[student.student_id]?.grade && (
                            <Badge bg={getGradeColor(grades[student.student_id].grade)}>
                              {grades[student.student_id].grade}
                            </Badge>
                          )}
                        </td>
                        <td>
                          {grades[student.student_id]?.grade && (
                            <span className="fw-bold">
                              {getGradePoints(grades[student.student_id].grade)}
                            </span>
                          )}
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={grades[student.student_id]?.remarks || ''}
                            onChange={(e) => setGrades(prev => ({
                              ...prev,
                              [student.student_id]: {
                                ...prev[student.student_id],
                                remarks: e.target.value
                              }
                            }))}
                            placeholder="Optional remarks"
                            style={{ width: '150px' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Alert variant="light">
                  <Row>
                    <Col md={3}>
                      <strong>Total Students:</strong> {students.length}
                    </Col>
                    <Col md={3}>
                      <strong>Graded:</strong> {Object.values(grades).filter(g => g.marks !== '').length}
                    </Col>
                    <Col md={3}>
                      <strong>Pending:</strong> {Object.values(grades).filter(g => g.marks === '').length}
                    </Col>
                    <Col md={3}>
                      <strong>Average:</strong> {
                        Object.values(grades).filter(g => g.marks !== '').length > 0 
                          ? (Object.values(grades)
                              .filter(g => g.marks !== '')
                              .reduce((sum, g) => sum + parseFloat(g.marks), 0) / 
                             Object.values(grades).filter(g => g.marks !== '').length).toFixed(1)
                          : 'N/A'
                      }
                    </Col>
                  </Row>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Submit Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-check me-2"></i>
            Confirm Grade Submission
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <strong>Warning:</strong> Once submitted, grades cannot be easily modified. Please review all entries carefully.
          </Alert>
          
          <div className="mb-3">
            <strong>Course:</strong> {courses.find(c => c.course_id === selectedCourse)?.course_name}<br />
            <strong>Examination:</strong> {examinations.find(e => e.exam_id === selectedExam)?.exam_name}<br />
            <strong>Students:</strong> {students.length}<br />
            <strong>Grades Entered:</strong> {Object.values(grades).filter(g => g.marks !== '').length}
          </div>

          <p>Are you sure you want to submit these grades?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitGrades}>
            <i className="fas fa-save me-2"></i>
            Submit Grades
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GradeEntry;
