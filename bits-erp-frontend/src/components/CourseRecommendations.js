import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function CourseRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    fetchCareerPaths();
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/api/ai/course-recommendations');
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Mock AI-generated recommendations
      setRecommendations([
        {
          course_id: 'CS401',
          course_name: 'Machine Learning',
          course_code: 'CS F401',
          credits: 4,
          difficulty: 'hard',
          match_score: 95,
          reasons: [
            'Based on your excellent performance in Data Structures',
            'Aligns with your interest in AI and automation',
            'High demand in current job market',
            'Prerequisite completed with A+ grade'
          ],
          prerequisites: ['CS F211', 'MATH F211'],
          career_relevance: ['Data Scientist', 'ML Engineer', 'AI Researcher'],
          estimated_workload: '8-10 hours/week',
          faculty: 'Dr. Sarah Johnson',
          rating: 4.8,
          enrollment_trend: 'increasing'
        },
        {
          course_id: 'CS402',
          course_name: 'Cybersecurity',
          course_code: 'CS F402',
          credits: 3,
          difficulty: 'medium',
          match_score: 88,
          reasons: [
            'Growing field with excellent job prospects',
            'Matches your interest in network security',
            'Complements your CS background well'
          ],
          prerequisites: ['CS F211', 'CS F212'],
          career_relevance: ['Security Analyst', 'Ethical Hacker', 'Security Consultant'],
          estimated_workload: '6-8 hours/week',
          faculty: 'Prof. Michael Chen',
          rating: 4.6,
          enrollment_trend: 'stable'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCareerPaths = async () => {
    try {
      const response = await axios.get('/api/ai/career-paths');
      setCareerPaths(response.data.paths);
    } catch (error) {
      console.error('Error fetching career paths:', error);
      // Mock career path data
      setCareerPaths([
        {
          path: 'Software Development',
          match_percentage: 92,
          recommended_courses: ['Advanced Programming', 'Software Engineering', 'Web Development'],
          job_outlook: 'Excellent',
          avg_salary: '₹12-25 LPA'
        },
        {
          path: 'Data Science',
          match_percentage: 88,
          recommended_courses: ['Machine Learning', 'Statistics', 'Big Data Analytics'],
          job_outlook: 'Very Good',
          avg_salary: '₹15-30 LPA'
        },
        {
          path: 'Cybersecurity',
          match_percentage: 75,
          recommended_courses: ['Network Security', 'Ethical Hacking', 'Cryptography'],
          job_outlook: 'Excellent',
          avg_salary: '₹10-20 LPA'
        }
      ]);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'primary';
    if (score >= 60) return 'warning';
    return 'secondary';
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: { bg: 'success', text: 'Easy' },
      medium: { bg: 'warning', text: 'Medium' },
      hard: { bg: 'danger', text: 'Hard' }
    };
    return badges[difficulty] || badges.medium;
  };

  const showCourseDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading AI recommendations...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-brain text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">AI Course Recommendations</h2>
              <small className="text-muted">Personalized course suggestions based on your academic performance and interests</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Career Path Recommendations */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0"><i className="fas fa-route me-2"></i>Recommended Career Paths</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {careerPaths.map((path, index) => (
                  <Col md={4} key={index} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold">{path.path}</h6>
                          <Badge bg={getMatchScoreColor(path.match_percentage)}>
                            {path.match_percentage}% Match
                          </Badge>
                        </div>
                        <ProgressBar 
                          now={path.match_percentage} 
                          variant={getMatchScoreColor(path.match_percentage)}
                          className="mb-3"
                        />
                        <div className="mb-2">
                          <small className="text-muted">Job Outlook:</small>
                          <div className="fw-bold">{path.job_outlook}</div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">Average Salary:</small>
                          <div className="fw-bold text-success">{path.avg_salary}</div>
                        </div>
                        <div>
                          <small className="text-muted">Key Courses:</small>
                          <div className="mt-1">
                            {path.recommended_courses.slice(0, 2).map((course, idx) => (
                              <Badge key={idx} bg="outline-primary" className="me-1 mb-1">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Course Recommendations */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0"><i className="fas fa-graduation-cap me-2"></i>Recommended Courses</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {recommendations.map((course) => (
                  <Col md={6} lg={4} key={course.course_id} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm course-card">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="fw-bold mb-1">{course.course_name}</h6>
                            <small className="text-muted">{course.course_code}</small>
                          </div>
                          <Badge bg={getMatchScoreColor(course.match_score)} className="fs-6">
                            {course.match_score}%
                          </Badge>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span>AI Match Score</span>
                            <span className="fw-bold">{course.match_score}%</span>
                          </div>
                          <ProgressBar 
                            now={course.match_score} 
                            variant={getMatchScoreColor(course.match_score)}
                          />
                        </div>

                        <div className="mb-3">
                          <Row className="g-2">
                            <Col>
                              <Badge bg="outline-secondary">
                                <i className="fas fa-star me-1"></i>
                                {course.credits} Credits
                              </Badge>
                            </Col>
                            <Col>
                              <Badge bg={getDifficultyBadge(course.difficulty).bg}>
                                {getDifficultyBadge(course.difficulty).text}
                              </Badge>
                            </Col>
                          </Row>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">Why recommended:</small>
                          <ul className="small mt-1 mb-0">
                            {course.reasons.slice(0, 2).map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">Career Relevance:</small>
                          <div className="mt-1">
                            {course.career_relevance.slice(0, 2).map((career, index) => (
                              <Badge key={index} bg="outline-success" className="me-1 mb-1 small">
                                {career}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="d-grid">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => showCourseDetails(course)}
                          >
                            <i className="fas fa-info-circle me-1"></i>
                            View Details
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Course Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-graduation-cap me-2"></i>
            Course Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && (
            <Row>
              <Col md={8}>
                <h5 className="text-primary">{selectedCourse.course_name}</h5>
                <p className="text-muted mb-3">{selectedCourse.course_code} | {selectedCourse.credits} Credits</p>

                <div className="mb-4">
                  <h6>Why This Course is Recommended:</h6>
                  <ul>
                    {selectedCourse.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h6>Career Opportunities:</h6>
                  <div>
                    {selectedCourse.career_relevance.map((career, index) => (
                      <Badge key={index} bg="success" className="me-2 mb-2">
                        {career}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h6>Prerequisites:</h6>
                  <div>
                    {selectedCourse.prerequisites.map((prereq, index) => (
                      <Badge key={index} bg="outline-primary" className="me-2 mb-2">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <Card className="bg-light">
                  <Card.Body>
                    <div className="text-center mb-3">
                      <div className="display-4 text-primary fw-bold">
                        {selectedCourse.match_score}%
                      </div>
                      <small className="text-muted">AI Match Score</small>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Faculty:</span>
                        <span className="fw-bold">{selectedCourse.faculty}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Rating:</span>
                        <span className="fw-bold">
                          <i className="fas fa-star text-warning"></i> {selectedCourse.rating}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Workload:</span>
                        <span className="fw-bold">{selectedCourse.estimated_workload}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Trend:</span>
                        <Badge bg={selectedCourse.enrollment_trend === 'increasing' ? 'success' : 'info'}>
                          {selectedCourse.enrollment_trend}
                        </Badge>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <i className="fas fa-plus me-1"></i>
            Add to Wishlist
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CourseRecommendations;
