import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Alert, ProgressBar, Modal, Button, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Grades() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    semester: 'all',
    year: 'all',
    course: 'all',
    gradeRange: 'all'
  });
  const [stats, setStats] = useState({});
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [semesterWiseData, setSemesterWiseData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState({});
  const [performanceTrends, setPerformanceTrends] = useState([]);

  const calculateStats = useCallback((gradesList) => {
    if (gradesList.length === 0) return {};
    
    const totalCredits = gradesList.reduce((sum, grade) => sum + grade.credits, 0);
    const totalGradePoints = gradesList.reduce((sum, grade) => sum + (grade.grade_points * grade.credits), 0);
    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    
    const gradeDistribution = gradesList.reduce((acc, grade) => {
      acc[grade.grade] = (acc[grade.grade] || 0) + 1;
      return acc;
    }, {});

    const passedCourses = gradesList.filter(grade => grade.is_passed).length;
    const failedCourses = gradesList.length - passedCourses;
    const averageScore = gradesList.reduce((sum, grade) => sum + grade.total_marks, 0) / gradesList.length;

    // Calculate semester-wise performance
    const semesterData = gradesList.reduce((acc, grade) => {
      const key = `${grade.semester_type}_${grade.academic_year}`;
      if (!acc[key]) {
        acc[key] = {
          semester: grade.semester_type,
          year: grade.academic_year,
          courses: [],
          totalCredits: 0,
          totalGradePoints: 0
        };
      }
      acc[key].courses.push(grade);
      acc[key].totalCredits += grade.credits;
      acc[key].totalGradePoints += (grade.grade_points * grade.credits);
      return acc;
    }, {});

    const semesterWisePerformance = Object.values(semesterData).map(sem => ({
      ...sem,
      sgpa: sem.totalCredits > 0 ? (sem.totalGradePoints / sem.totalCredits).toFixed(2) : 0
    }));

    return {
      totalCourses: gradesList.length,
      totalCredits,
      cgpa,
      gradeDistribution,
      averageScore: averageScore.toFixed(1),
      passedCourses,
      failedCourses,
      passPercentage: ((passedCourses / gradesList.length) * 100).toFixed(1),
      semesterWisePerformance,
      highestGrade: Math.max(...gradesList.map(g => g.grade_points)),
      lowestGrade: Math.min(...gradesList.map(g => g.grade_points)),
      improvementNeeded: gradesList.filter(g => g.grade_points < 6).length
    };
  }, []);

  const filterGrades = useCallback((gradesList) => {
    let filtered = gradesList;
    
    if (filter.semester !== 'all') {
      filtered = filtered.filter(grade => grade.semester_type === filter.semester);
    }
    
    if (filter.year !== 'all') {
      filtered = filtered.filter(grade => grade.academic_year.toString() === filter.year);
    }
    
    if (filter.course !== 'all') {
      filtered = filtered.filter(grade => grade.course_code === filter.course);
    }

    if (filter.gradeRange !== 'all') {
      switch (filter.gradeRange) {
        case 'excellent':
          filtered = filtered.filter(grade => grade.grade_points >= 9);
          break;
        case 'good':
          filtered = filtered.filter(grade => grade.grade_points >= 7 && grade.grade_points < 9);
          break;
        case 'average':
          filtered = filtered.filter(grade => grade.grade_points >= 5 && grade.grade_points < 7);
          break;
        case 'poor':
          filtered = filtered.filter(grade => grade.grade_points < 5);
          break;
        default:
          break;
      }
    }
    
    setFilteredGrades(filtered);
    setStats(calculateStats(filtered));
  }, [filter, calculateStats]);

  useEffect(() => {
    fetchGrades();
  }, [user]);

  useEffect(() => {
    filterGrades(grades);
  }, [grades, filter, filterGrades]);

  const fetchGrades = async () => {
    try {
      const studentId = user?.student_id || '2021A7PS001P';
      const response = await axios.get(`/api/students/${studentId}/grades`);
      setGrades(response.data.grades);
    } catch (error) {
      console.error('Error fetching grades:', error);
      // Enhanced mock data
      const mockGrades = [
        {
          grade_id: '1',
          course_code: 'CS F212',
          course_name: 'Database Systems',
          credits: 3,
          internal_marks: 28,
          external_marks: 62,
          total_marks: 90,
          grade: 'A+',
          grade_points: 10.00,
          is_passed: true,
          exam_name: 'Monsoon 2024 Regular Exam',
          semester_type: 'monsoon',
          academic_year: 2024,
          faculty: 'Dr. Rajesh Kumar',
          course_type: 'core',
          difficulty_level: 'medium'
        },
        {
          grade_id: '2',
          course_code: 'CS F211',
          course_name: 'Data Structures',
          credits: 4,
          internal_marks: 25,
          external_marks: 55,
          total_marks: 80,
          grade: 'A',
          grade_points: 9.00,
          is_passed: true,
          exam_name: 'Spring 2024 Regular Exam',
          semester_type: 'spring',
          academic_year: 2024,
          faculty: 'Prof. Priya Sharma',
          course_type: 'core',
          difficulty_level: 'hard'
        },
        {
          grade_id: '3',
          course_code: 'MATH F211',
          course_name: 'Mathematics III',
          credits: 3,
          internal_marks: 22,
          external_marks: 48,
          total_marks: 70,
          grade: 'B+',
          grade_points: 8.00,
          is_passed: true,
          exam_name: 'Monsoon 2024 Regular Exam',
          semester_type: 'monsoon',
          academic_year: 2024,
          faculty: 'Dr. Amit Singh',
          course_type: 'core',
          difficulty_level: 'hard'
        },
        {
          grade_id: '4',
          course_code: 'CS F213',
          course_name: 'Object Oriented Programming',
          credits: 4,
          internal_marks: 30,
          external_marks: 65,
          total_marks: 95,
          grade: 'A+',
          grade_points: 10.00,
          is_passed: true,
          exam_name: 'Spring 2025 Regular Exam',
          semester_type: 'spring',
          academic_year: 2025,
          faculty: 'Prof. Sarah Wilson',
          course_type: 'core',
          difficulty_level: 'medium'
        },
        {
          grade_id: '5',
          course_code: 'PHY F110',
          course_name: 'Physics',
          credits: 3,
          internal_marks: 18,
          external_marks: 42,
          total_marks: 60,
          grade: 'B',
          grade_points: 7.00,
          is_passed: true,
          exam_name: 'Monsoon 2023 Regular Exam',
          semester_type: 'monsoon',
          academic_year: 2023,
          faculty: 'Dr. Physics Prof',
          course_type: 'core',
          difficulty_level: 'medium'
        }
      ];
      setGrades(mockGrades);
    } finally {
      setLoading(false);
    }
  };

  const generateTranscript = () => {
    const transcriptData = {
      studentInfo: {
        name: user?.username || 'Student Name',
        studentId: user?.student_id || '2021A7PS001P',
        program: 'B.E. Computer Science',
        campus: 'BITS Pilani'
      },
      academicRecord: stats.semesterWisePerformance || [],
      overallStats: stats,
      generatedDate: new Date().toLocaleDateString()
    };

    // Generate transcript content
    const transcriptContent = `
BIRLA INSTITUTE OF TECHNOLOGY & SCIENCE, PILANI
OFFICIAL ACADEMIC TRANSCRIPT
===============================================

Student Information:
Name: ${transcriptData.studentInfo.name}
Student ID: ${transcriptData.studentInfo.studentId}
Program: ${transcriptData.studentInfo.program}
Campus: ${transcriptData.studentInfo.campus}

Academic Performance Summary:
Total Courses: ${stats.totalCourses}
Total Credits: ${stats.totalCredits}
Cumulative GPA: ${stats.cgpa}
Pass Percentage: ${stats.passPercentage}%

Semester-wise Performance:
${stats.semesterWisePerformance?.map(sem => 
  `${sem.semester} ${sem.year}: SGPA ${sem.sgpa} (${sem.courses.length} courses)`
).join('\n')}

Generated on: ${transcriptData.generatedDate}

This is a computer-generated transcript.
    `;

    const blob = new Blob([transcriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${user?.student_id || 'student'}.txt`;
    a.click();
    
    toast.success('Transcript downloaded successfully!');
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'success',
      'A': 'success',
      'B+': 'primary',
      'B': 'primary',
      'C+': 'info',
      'C': 'info',
      'D': 'warning',
      'F': 'danger'
    };
    return colors[grade] || 'secondary';
  };

  const getPerformanceIcon = (gradePoints) => {
    if (gradePoints >= 9) return 'fas fa-trophy text-warning';
    if (gradePoints >= 7) return 'fas fa-medal text-primary';
    if (gradePoints >= 5) return 'fas fa-thumbs-up text-success';
    return 'fas fa-exclamation-triangle text-danger';
  };

  const getUniqueValues = (key) => {
    const values = [...new Set(grades.map(grade => grade[key]))];
    return values.sort();
  };

  const getCurrentSemesterGrades = () => {
    const currentYear = new Date().getFullYear();
    return grades.filter(grade => grade.academic_year === currentYear);
  };

  const getPreviousSemesterGrades = () => {
    const currentYear = new Date().getFullYear();
    return grades.filter(grade => grade.academic_year < currentYear);
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
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-chart-line text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Academic Performance</h2>
                <small className="text-muted">Comprehensive grade analysis and performance tracking</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-info" onClick={() => setShowAnalyticsModal(true)}>
                <i className="fas fa-chart-bar me-2"></i>
                Analytics
              </Button>
              <Button variant="outline-success" onClick={generateTranscript}>
                <i className="fas fa-download me-2"></i>
                Transcript
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Performance Statistics */}
      <Row className="mb-4">
        <Col md={2}>
          <Card className="text-center border-primary h-100">
            <Card.Body>
              <i className="fas fa-graduation-cap text-primary mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h3 className="text-primary">{stats.cgpa || 'N/A'}</h3>
              <small className="text-muted">Current CGPA</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-success h-100">
            <Card.Body>
              <i className="fas fa-book text-success mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h3 className="text-success">{stats.totalCourses || 0}</h3>
              <small className="text-muted">Total Courses</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-info h-100">
            <Card.Body>
              <i className="fas fa-credit-card text-info mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h3 className="text-info">{stats.totalCredits || 0}</h3>
              <small className="text-muted">Total Credits</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <i className="fas fa-percentage text-warning mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h3 className="text-warning">{stats.averageScore || 'N/A'}</h3>
              <small className="text-muted">Average Score</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-secondary h-100">
            <Card.Body>
              <i className="fas fa-check-circle text-secondary mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h3 className="text-secondary">{stats.passPercentage || 'N/A'}%</h3>
              <small className="text-muted">Pass Rate</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-dark h-100">
            <Card.Body>
              <i className="fas fa-exclamation-triangle text-dark mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h3 className="text-dark">{stats.improvementNeeded || 0}</h3>
              <small className="text-muted">Need Improvement</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0"><i className="fas fa-filter me-2"></i>Filter Grades</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Semester</Form.Label>
                    <Form.Select
                      value={filter.semester}
                      onChange={(e) => setFilter({...filter, semester: e.target.value})}
                    >
                      <option value="all">All Semesters</option>
                      <option value="monsoon">Monsoon</option>
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Academic Year</Form.Label>
                    <Form.Select
                      value={filter.year}
                      onChange={(e) => setFilter({...filter, year: e.target.value})}
                    >
                      <option value="all">All Years</option>
                      {getUniqueValues('academic_year').map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Course</Form.Label>
                    <Form.Select
                      value={filter.course}
                      onChange={(e) => setFilter({...filter, course: e.target.value})}
                    >
                      <option value="all">All Courses</option>
                      {getUniqueValues('course_code').map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Performance</Form.Label>
                    <Form.Select
                      value={filter.gradeRange}
                      onChange={(e) => setFilter({...filter, gradeRange: e.target.value})}
                    >
                      <option value="all">All Grades</option>
                      <option value="excellent">Excellent (A+, A)</option>
                      <option value="good">Good (B+, B)</option>
                      <option value="average">Average (C+, C)</option>
                      <option value="poor">Poor (D, F)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for different views */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="current" title={
                  <span>
                    <i className="fas fa-clock me-2"></i>
                    Current Semester ({getCurrentSemesterGrades().length})
                  </span>
                }>
                  {/* Current Semester Grades */}
                  {getCurrentSemesterGrades().length === 0 ? (
                    <Alert variant="info">No grades available for current semester.</Alert>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>Course Code</th>
                          <th>Course Name</th>
                          <th>Credits</th>
                          <th>Internal</th>
                          <th>External</th>
                          <th>Total</th>
                          <th>Grade</th>
                          <th>Grade Points</th>
                          <th>Performance</th>
                          <th>Faculty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentSemesterGrades().map((grade) => (
                          <tr key={grade.grade_id}>
                            <td className="fw-bold">{grade.course_code}</td>
                            <td>{grade.course_name}</td>
                            <td>{grade.credits}</td>
                            <td>{grade.internal_marks}</td>
                            <td>{grade.external_marks}</td>
                            <td className="fw-bold">{grade.total_marks}</td>
                            <td>
                              <Badge bg={getGradeColor(grade.grade)}>
                                {grade.grade}
                              </Badge>
                            </td>
                            <td>{grade.grade_points}</td>
                            <td>
                              <i className={getPerformanceIcon(grade.grade_points)}></i>
                            </td>
                            <td>{grade.faculty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                <Tab eventKey="all" title={
                  <span>
                    <i className="fas fa-list me-2"></i>
                    All Grades ({filteredGrades.length})
                  </span>
                }>
                  {/* All Grades */}
                  {filteredGrades.length === 0 ? (
                    <Alert variant="info">No grades found for the selected filters.</Alert>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>Course Code</th>
                          <th>Course Name</th>
                          <th>Credits</th>
                          <th>Internal</th>
                          <th>External</th>
                          <th>Total</th>
                          <th>Grade</th>
                          <th>Grade Points</th>
                          <th>Semester</th>
                          <th>Year</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGrades.map((grade) => (
                          <tr key={grade.grade_id}>
                            <td className="fw-bold">{grade.course_code}</td>
                            <td>{grade.course_name}</td>
                            <td>{grade.credits}</td>
                            <td>{grade.internal_marks}</td>
                            <td>{grade.external_marks}</td>
                            <td className="fw-bold">{grade.total_marks}</td>
                            <td>
                              <Badge bg={getGradeColor(grade.grade)}>
                                {grade.grade}
                              </Badge>
                            </td>
                            <td>{grade.grade_points}</td>
                            <td>{grade.semester_type}</td>
                            <td>{grade.academic_year}</td>
                            <td>
                              <Badge bg={grade.is_passed ? 'success' : 'danger'}>
                                {grade.is_passed ? 'Passed' : 'Failed'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                <Tab eventKey="semester" title={
                  <span>
                    <i className="fas fa-calendar me-2"></i>
                    Semester-wise
                  </span>
                }>
                  {/* Semester-wise Performance */}
                  {stats.semesterWisePerformance?.length === 0 ? (
                    <Alert variant="info">No semester-wise data available.</Alert>
                  ) : (
                    <Row>
                      {stats.semesterWisePerformance?.map((semester, index) => (
                        <Col md={6} key={index} className="mb-3">
                          <Card className="h-100">
                            <Card.Header className="bg-primary text-white">
                              <h6 className="mb-0">
                                {semester.semester.charAt(0).toUpperCase() + semester.semester.slice(1)} {semester.year}
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                  <h4 className="text-primary">{semester.sgpa}</h4>
                                  <small className="text-muted">SGPA</small>
                                </div>
                                <div className="text-end">
                                  <div className="fw-bold">{semester.courses.length} Courses</div>
                                  <small className="text-muted">{semester.totalCredits} Credits</small>
                                </div>
                              </div>
                              
                              <div className="small">
                                {semester.courses.map((course, idx) => (
                                  <div key={idx} className="d-flex justify-content-between mb-1">
                                    <span>{course.course_code}</span>
                                    <Badge bg={getGradeColor(course.grade)}>
                                      {course.grade}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Grade Distribution */}
      {stats.gradeDistribution && Object.keys(stats.gradeDistribution).length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0"><i className="fas fa-chart-pie me-2"></i>Grade Distribution</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                    <Col md={3} key={grade} className="mb-3">
                      <div className="text-center">
                        <Badge bg={getGradeColor(grade)} className="mb-2 fs-6">
                          {grade}
                        </Badge>
                        <div className="fw-bold">{count} courses</div>
                        <ProgressBar 
                          now={(count / stats.totalCourses) * 100}
                          variant={getGradeColor(grade)}
                          className="mt-2"
                        />
                        <small className="text-muted">
                          {((count / stats.totalCourses) * 100).toFixed(1)}%
                        </small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Analytics Modal */}
      <Modal show={showAnalyticsModal} onHide={() => setShowAnalyticsModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-chart-bar me-2"></i>
            Performance Analytics
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6>Performance Summary</h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-2">
                    <strong>Highest Grade Points:</strong> {stats.highestGrade}
                  </div>
                  <div className="mb-2">
                    <strong>Lowest Grade Points:</strong> {stats.lowestGrade}
                  </div>
                  <div className="mb-2">
                    <strong>Courses Passed:</strong> {stats.passedCourses}/{stats.totalCourses}
                  </div>
                  <div className="mb-2">
                    <strong>Pass Percentage:</strong> {stats.passPercentage}%
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6>Recommendations</h6>
                </Card.Header>
                <Card.Body>
                  {stats.cgpa >= 8.5 ? (
                    <Alert variant="success">
                      <i className="fas fa-trophy me-2"></i>
                      Excellent performance! Keep up the great work.
                    </Alert>
                  ) : stats.cgpa >= 7 ? (
                    <Alert variant="primary">
                      <i className="fas fa-thumbs-up me-2"></i>
                      Good performance. Focus on improving weaker subjects.
                    </Alert>
                  ) : (
                    <Alert variant="warning">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Consider seeking academic support and improving study habits.
                    </Alert>
                  )}
                  
                  {stats.improvementNeeded > 0 && (
                    <Alert variant="info">
                      <i className="fas fa-info-circle me-2"></i>
                      {stats.improvementNeeded} course(s) need attention.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalyticsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={generateTranscript}>
            <i className="fas fa-download me-2"></i>
            Download Report
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Grades;
