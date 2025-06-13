import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, ProgressBar, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Examinations() {
  const { user } = useAuth();
  const [examinations, setExaminations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const [hallTicket, setHallTicket] = useState(null);
  const [examStats, setExamStats] = useState({});

  useEffect(() => {
    fetchExaminations();
    fetchRegistrations();
    fetchResults();
    fetchExamStats();
  }, []);

  const fetchExaminations = async () => {
    try {
      // Enhanced mock data with more exam types and features
      setExaminations([
        {
          exam_id: '1',
          exam_name: 'Mid Semester Examination',
          course_code: 'CS F212',
          course_name: 'Database Systems',
          exam_type: 'mid_semester',
          exam_date: '2025-06-20',
          exam_time: '09:00',
          duration: 180,
          total_marks: 100,
          venue: 'Exam Hall A',
          seat_number: null,
          instructions: 'Bring calculator and ID card. No mobile phones allowed.',
          syllabus: 'Chapters 1-8, SQL queries, Normalization',
          registration_deadline: '2025-06-15',
          is_registered: false,
          status: 'upcoming',
          faculty: 'Dr. Rajesh Kumar',
          prerequisites: ['CS F111'],
          exam_pattern: {
            mcq: 40,
            short_answer: 30,
            long_answer: 30
          },
          negative_marking: true,
          open_book: false,
          online_mode: false
        },
        {
          exam_id: '2',
          exam_name: 'Comprehensive Examination',
          course_code: 'CS F213',
          course_name: 'Object Oriented Programming',
          exam_type: 'comprehensive',
          exam_date: '2025-07-15',
          exam_time: '14:00',
          duration: 180,
          total_marks: 100,
          venue: 'Exam Hall B',
          seat_number: null,
          instructions: 'Programming exam on computers. Bring student ID.',
          syllabus: 'Complete syllabus including OOP concepts, Java programming',
          registration_deadline: '2025-07-10',
          is_registered: true,
          status: 'upcoming',
          faculty: 'Prof. Priya Sharma',
          prerequisites: ['CS F111', 'CS F112'],
          exam_pattern: {
            practical: 60,
            theory: 40
          },
          negative_marking: false,
          open_book: false,
          online_mode: false
        },
        {
          exam_id: '3',
          exam_name: 'Quiz 1',
          course_code: 'MATH F211',
          course_name: 'Mathematics III',
          exam_type: 'quiz',
          exam_date: '2025-06-18',
          exam_time: '11:00',
          duration: 60,
          total_marks: 25,
          venue: 'Online',
          seat_number: null,
          instructions: 'Online quiz. Ensure stable internet connection.',
          syllabus: 'Differential Equations - Chapters 1-3',
          registration_deadline: '2025-06-17',
          is_registered: true,
          status: 'upcoming',
          faculty: 'Dr. Amit Singh',
          prerequisites: ['MATH F112'],
          exam_pattern: {
            mcq: 100
          },
          negative_marking: true,
          open_book: false,
          online_mode: true
        },
        {
          exam_id: '4',
          exam_name: 'Assignment Submission',
          course_code: 'CS F301',
          course_name: 'Software Engineering',
          exam_type: 'assignment',
          exam_date: '2025-06-25',
          exam_time: '23:59',
          duration: null,
          total_marks: 50,
          venue: 'Online Submission',
          seat_number: null,
          instructions: 'Submit project files in ZIP format. Include documentation.',
          syllabus: 'Complete project implementation with testing',
          registration_deadline: '2025-06-20',
          is_registered: false,
          status: 'upcoming',
          faculty: 'Prof. Sarah Wilson',
          prerequisites: ['CS F212'],
          exam_pattern: {
            project: 100
          },
          negative_marking: false,
          open_book: true,
          online_mode: true
        }
      ]);
    } catch (error) {
      console.error('Error fetching examinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = () => {
    // Mock registration data
    setRegistrations([
      {
        registration_id: '1',
        exam_id: '2',
        student_id: user?.student_id || '2021A7PS001P',
        registration_date: '2025-06-01',
        hall_ticket_number: 'HT2025001',
        seat_number: 'A-15',
        status: 'confirmed',
        payment_status: 'paid',
        amount_paid: 500
      },
      {
        registration_id: '2',
        exam_id: '3',
        student_id: user?.student_id || '2021A7PS001P',
        registration_date: '2025-06-05',
        hall_ticket_number: 'HT2025002',
        seat_number: 'Online',
        status: 'confirmed',
        payment_status: 'paid',
        amount_paid: 100
      }
    ]);
  };

  const fetchResults = () => {
    // Mock results data
    setResults([
      {
        result_id: '1',
        exam_id: '1',
        student_id: user?.student_id || '2021A7PS001P',
        marks_obtained: 85,
        total_marks: 100,
        grade: 'A',
        grade_points: 9.0,
        rank: 15,
        percentile: 92.5,
        result_date: '2025-05-15',
        status: 'published',
        subject_wise_marks: {
          'Section A (MCQ)': 35,
          'Section B (Short Answer)': 25,
          'Section C (Long Answer)': 25
        },
        feedback: 'Excellent performance in theoretical concepts. Improve practical implementation.',
        certificate_url: '/certificates/result_1.pdf'
      }
    ]);
  };

  const fetchExamStats = () => {
    setExamStats({
      totalExams: 12,
      registeredExams: 8,
      completedExams: 4,
      upcomingExams: 4,
      averageScore: 82.5,
      bestGrade: 'A+',
      totalCredits: 24
    });
  };

  const registerForExam = async (examId) => {
    try {
      const exam = examinations.find(e => e.exam_id === examId);
      
      if (new Date(exam.registration_deadline) < new Date()) {
        toast.error('Registration deadline has passed');
        return;
      }

      // Simulate registration process
      const registration = {
        registration_id: Date.now().toString(),
        exam_id: examId,
        student_id: user?.student_id || '2021A7PS001P',
        registration_date: new Date().toISOString().split('T')[0],
        hall_ticket_number: `HT${Date.now()}`,
        seat_number: `A-${Math.floor(Math.random() * 50) + 1}`,
        status: 'confirmed',
        payment_status: 'paid',
        amount_paid: exam.exam_type === 'quiz' ? 100 : 500
      };

      setRegistrations(prev => [...prev, registration]);
      setExaminations(prev => prev.map(e => 
        e.exam_id === examId ? { ...e, is_registered: true } : e
      ));

      // Generate hall ticket
      setHallTicket({
        ...registration,
        exam: exam,
        student_name: user?.username || 'Student Name',
        student_id: user?.student_id || '2021A7PS001P'
      });

      toast.success('Successfully registered for examination!');
      setShowRegisterModal(false);
    } catch (error) {
      toast.error('Failed to register for examination');
    }
  };

  const downloadHallTicket = (registrationId) => {
    const registration = registrations.find(r => r.registration_id === registrationId);
    const exam = examinations.find(e => e.exam_id === registration.exam_id);
    
    // Generate hall ticket content
    const hallTicketContent = `
      BITS PILANI - HALL TICKET
      ========================
      
      Hall Ticket Number: ${registration.hall_ticket_number}
      Student Name: ${user?.username || 'Student Name'}
      Student ID: ${registration.student_id}
      
      Examination Details:
      Course: ${exam.course_code} - ${exam.course_name}
      Exam Type: ${exam.exam_type}
      Date: ${new Date(exam.exam_date).toLocaleDateString()}
      Time: ${exam.exam_time}
      Duration: ${exam.duration} minutes
      Venue: ${exam.venue}
      Seat Number: ${registration.seat_number}
      
      Instructions:
      ${exam.instructions}
      
      Note: Bring this hall ticket and a valid ID card to the examination.
    `;

    const blob = new Blob([hallTicketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hall_ticket_${registration.hall_ticket_number}.txt`;
    a.click();
    
    toast.success('Hall ticket downloaded successfully!');
  };

  const downloadResult = (resultId) => {
    const result = results.find(r => r.result_id === resultId);
    const exam = examinations.find(e => e.exam_id === result.exam_id);
    
    toast.success('Result certificate downloaded!');
  };

  const getExamTypeColor = (type) => {
    const colors = {
      mid_semester: 'primary',
      comprehensive: 'danger',
      quiz: 'info',
      assignment: 'warning',
      practical: 'success'
    };
    return colors[type] || 'secondary';
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'warning',
      ongoing: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const filteredExaminations = examinations.filter(exam => {
    const matchesType = filterType === 'all' || exam.exam_type === filterType;
    const matchesSearch = exam.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTabExams = (tab) => {
    switch (tab) {
      case 'available':
        return filteredExaminations.filter(exam => !exam.is_registered && exam.status === 'upcoming');
      case 'registered':
        return filteredExaminations.filter(exam => exam.is_registered);
      case 'completed':
        return filteredExaminations.filter(exam => exam.status === 'completed');
      default:
        return filteredExaminations;
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading examinations...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-clipboard-list text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">Examination Management</h2>
              <small className="text-muted">Register for exams, view results, and download certificates</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Exam Statistics */}
      <Row className="mb-4">
        <Col md={2}>
          <Card className="text-center border-primary h-100">
            <Card.Body>
              <i className="fas fa-clipboard-list text-primary mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-primary">{examStats.totalExams}</h4>
              <small className="text-muted">Total Exams</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-success h-100">
            <Card.Body>
              <i className="fas fa-user-check text-success mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-success">{examStats.registeredExams}</h4>
              <small className="text-muted">Registered</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-info h-100">
            <Card.Body>
              <i className="fas fa-check-circle text-info mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-info">{examStats.completedExams}</h4>
              <small className="text-muted">Completed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <i className="fas fa-clock text-warning mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-warning">{examStats.upcomingExams}</h4>
              <small className="text-muted">Upcoming</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-secondary h-100">
            <Card.Body>
              <i className="fas fa-chart-line text-secondary mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-secondary">{examStats.averageScore}%</h4>
              <small className="text-muted">Avg Score</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-dark h-100">
            <Card.Body>
              <i className="fas fa-trophy text-dark mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-dark">{examStats.bestGrade}</h4>
              <small className="text-muted">Best Grade</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Search examinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Exam Types</option>
                    <option value="mid_semester">Mid Semester</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="practical">Practical</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for different exam categories */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="available" title={
                  <span>
                    <i className="fas fa-list me-2"></i>
                    Available ({getTabExams('available').length})
                  </span>
                }>
                  {/* Available Examinations */}
                  {getTabExams('available').length === 0 ? (
                    <Alert variant="info">
                      No examinations available for registration at the moment.
                    </Alert>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Exam Type</th>
                          <th>Date & Time</th>
                          <th>Duration</th>
                          <th>Venue</th>
                          <th>Registration Deadline</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getTabExams('available').map((exam) => (
                          <tr key={exam.exam_id}>
                            <td>
                              <div className="fw-bold">{exam.course_code}</div>
                              <small className="text-muted">{exam.course_name}</small>
                            </td>
                            <td>
                              <Badge bg={getExamTypeColor(exam.exam_type)}>
                                {exam.exam_type.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td>
                              <div>{new Date(exam.exam_date).toLocaleDateString()}</div>
                              <small className="text-muted">{exam.exam_time}</small>
                            </td>
                            <td>{exam.duration ? `${exam.duration} min` : 'N/A'}</td>
                            <td>{exam.venue}</td>
                            <td>
                              <div className={new Date(exam.registration_deadline) < new Date() ? 'text-danger' : ''}>
                                {new Date(exam.registration_deadline).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedExam(exam);
                                    setShowRegisterModal(true);
                                  }}
                                  disabled={new Date(exam.registration_deadline) < new Date()}
                                >
                                  <i className="fas fa-user-plus"></i>
                                </Button>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedExam(exam);
                                    // Show exam details modal
                                  }}
                                >
                                  <i className="fas fa-info-circle"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                <Tab eventKey="registered" title={
                  <span>
                    <i className="fas fa-check me-2"></i>
                    Registered ({getTabExams('registered').length})
                  </span>
                }>
                  {/* Registered Examinations */}
                  {getTabExams('registered').length === 0 ? (
                    <Alert variant="info">
                      You haven't registered for any examinations yet.
                    </Alert>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Exam Type</th>
                          <th>Date & Time</th>
                          <th>Venue</th>
                          <th>Hall Ticket</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getTabExams('registered').map((exam) => {
                          const registration = registrations.find(r => r.exam_id === exam.exam_id);
                          return (
                            <tr key={exam.exam_id}>
                              <td>
                                <div className="fw-bold">{exam.course_code}</div>
                                <small className="text-muted">{exam.course_name}</small>
                              </td>
                              <td>
                                <Badge bg={getExamTypeColor(exam.exam_type)}>
                                  {exam.exam_type.replace('_', ' ')}
                                </Badge>
                              </td>
                              <td>
                                <div>{new Date(exam.exam_date).toLocaleDateString()}</div>
                                <small className="text-muted">{exam.exam_time}</small>
                              </td>
                              <td>{exam.venue}</td>
                              <td>
                                {registration && (
                                  <div>
                                    <div className="fw-bold">{registration.hall_ticket_number}</div>
                                    <small className="text-muted">Seat: {registration.seat_number}</small>
                                  </div>
                                )}
                              </td>
                              <td>
                                <Badge bg="success">Confirmed</Badge>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  {registration && (
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      onClick={() => downloadHallTicket(registration.registration_id)}
                                    >
                                      <i className="fas fa-download"></i>
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedExam(exam);
                                      // Show exam details modal
                                    }}
                                  >
                                    <i className="fas fa-info-circle"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                <Tab eventKey="results" title={
                  <span>
                    <i className="fas fa-chart-bar me-2"></i>
                    Results ({results.length})
                  </span>
                }>
                  {/* Exam Results */}
                  {results.length === 0 ? (
                    <Alert variant="info">
                      No exam results available yet.
                    </Alert>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Marks</th>
                          <th>Grade</th>
                          <th>Rank</th>
                          <th>Percentile</th>
                          <th>Result Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result) => {
                          const exam = examinations.find(e => e.exam_id === result.exam_id);
                          return (
                            <tr key={result.result_id}>
                              <td>
                                <div className="fw-bold">{exam?.course_code}</div>
                                <small className="text-muted">{exam?.course_name}</small>
                              </td>
                              <td>
                                <div className="fw-bold">{result.marks_obtained}/{result.total_marks}</div>
                                <ProgressBar 
                                  now={(result.marks_obtained / result.total_marks) * 100}
                                  variant={result.marks_obtained >= 80 ? 'success' : result.marks_obtained >= 60 ? 'primary' : 'warning'}
                                  size="sm"
                                />
                              </td>
                              <td>
                                <Badge bg={result.grade === 'A+' || result.grade === 'A' ? 'success' : 'primary'}>
                                  {result.grade}
                                </Badge>
                              </td>
                              <td>#{result.rank}</td>
                              <td>{result.percentile}%</td>
                              <td>{new Date(result.result_date).toLocaleDateString()}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedResult(result);
                                      setShowResultModal(true);
                                    }}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </Button>
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => downloadResult(result.result_id)}
                                  >
                                    <i className="fas fa-download"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Registration Modal */}
      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user-plus me-2"></i>
            Register for Examination
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExam && (
            <div>
              <Alert variant="info">
                <h6>Examination Details</h6>
                <Row>
                  <Col md={6}>
                    <p><strong>Course:</strong> {selectedExam.course_code} - {selectedExam.course_name}</p>
                    <p><strong>Exam Type:</strong> {selectedExam.exam_type.replace('_', ' ')}</p>
                    <p><strong>Date:</strong> {new Date(selectedExam.exam_date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {selectedExam.exam_time}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Duration:</strong> {selectedExam.duration ? `${selectedExam.duration} minutes` : 'N/A'}</p>
                    <p><strong>Total Marks:</strong> {selectedExam.total_marks}</p>
                    <p><strong>Venue:</strong> {selectedExam.venue}</p>
                    <p><strong>Faculty:</strong> {selectedExam.faculty}</p>
                  </Col>
                </Row>
              </Alert>

              <div className="mb-3">
                <h6>Exam Pattern</h6>
                {Object.entries(selectedExam.exam_pattern).map(([type, percentage]) => (
                  <div key={type} className="d-flex justify-content-between">
                    <span>{type.replace('_', ' ').toUpperCase()}:</span>
                    <span>{percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <h6>Syllabus</h6>
                <p className="text-muted">{selectedExam.syllabus}</p>
              </div>

              <div className="mb-3">
                <h6>Instructions</h6>
                <p className="text-muted">{selectedExam.instructions}</p>
              </div>

              <Alert variant="warning">
                <h6>Important Information</h6>
                <ul className="mb-0">
                  <li>Registration fee: ₹{selectedExam.exam_type === 'quiz' ? '100' : '500'}</li>
                  <li>Registration deadline: {new Date(selectedExam.registration_deadline).toLocaleDateString()}</li>
                  <li>Negative marking: {selectedExam.negative_marking ? 'Yes' : 'No'}</li>
                  <li>Open book: {selectedExam.open_book ? 'Yes' : 'No'}</li>
                  <li>Mode: {selectedExam.online_mode ? 'Online' : 'Offline'}</li>
                </ul>
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => registerForExam(selectedExam?.exam_id)}
          >
            <i className="fas fa-credit-card me-2"></i>
            Pay & Register
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Result Details Modal */}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-chart-bar me-2"></i>
            Detailed Result
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="text-center border-primary">
                    <Card.Body>
                      <h3 className="text-primary">{selectedResult.marks_obtained}/{selectedResult.total_marks}</h3>
                      <p className="mb-0">Total Marks</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="text-center border-success">
                    <Card.Body>
                      <h3 className="text-success">{selectedResult.grade}</h3>
                      <p className="mb-0">Grade ({selectedResult.grade_points} points)</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Card className="text-center border-info">
                    <Card.Body>
                      <h4 className="text-info">#{selectedResult.rank}</h4>
                      <p className="mb-0">Class Rank</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="text-center border-warning">
                    <Card.Body>
                      <h4 className="text-warning">{selectedResult.percentile}%</h4>
                      <p className="mb-0">Percentile</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="mb-4">
                <h6>Section-wise Performance</h6>
                {Object.entries(selectedResult.subject_wise_marks).map(([section, marks]) => (
                  <div key={section} className="mb-2">
                    <div className="d-flex justify-content-between">
                      <span>{section}</span>
                      <span>{marks} marks</span>
                    </div>
                    <ProgressBar 
                      now={(marks / 40) * 100} 
                      variant={marks >= 32 ? 'success' : marks >= 24 ? 'primary' : 'warning'}
                    />
                  </div>
                ))}
              </div>

              {selectedResult.feedback && (
                <Alert variant="info">
                  <h6>Faculty Feedback</h6>
                  <p className="mb-0">{selectedResult.feedback}</p>
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Close
          </Button>
          <Button 
            variant="success" 
            onClick={() => downloadResult(selectedResult?.result_id)}
          >
            <i className="fas fa-download me-2"></i>
            Download Certificate
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Examinations;
