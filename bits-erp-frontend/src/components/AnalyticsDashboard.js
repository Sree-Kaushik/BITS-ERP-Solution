import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Table, Badge } from 'react-bootstrap';

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data
      setAnalytics({
        academicPerformance: {
          currentCGPA: 8.5,
          semesterGPA: 8.8,
          totalCredits: 120,
          completedCredits: 96,
          pendingCredits: 24,
          attendanceRate: 92,
          assignmentsCompleted: 85,
          projectsCompleted: 12
        },
        subjectWisePerformance: [
          { subject: 'Database Systems', score: 90, grade: 'A+', trend: 'up' },
          { subject: 'Data Structures', score: 85, grade: 'A', trend: 'up' },
          { subject: 'Computer Networks', score: 88, grade: 'A', trend: 'stable' },
          { subject: 'Operating Systems', score: 82, grade: 'A', trend: 'down' },
          { subject: 'Software Engineering', score: 87, grade: 'A', trend: 'up' }
        ],
        monthlyProgress: [
          { month: 'Jan', gpa: 8.2 },
          { month: 'Feb', gpa: 8.4 },
          { month: 'Mar', gpa: 8.3 },
          { month: 'Apr', gpa: 8.6 },
          { month: 'May', gpa: 8.5 },
          { month: 'Jun', gpa: 8.8 }
        ],
        skillsAssessment: [
          { skill: 'Programming', level: 90 },
          { skill: 'Database', level: 85 },
          { skill: 'Networking', level: 75 },
          { skill: 'Security', level: 70 },
          { skill: 'AI/ML', level: 80 },
          { skill: 'Web Dev', level: 88 }
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading analytics...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">
            <i className="fas fa-chart-line me-2"></i>
            Advanced Analytics Dashboard
          </h2>
          <p className="text-muted">Comprehensive academic performance insights</p>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary h-100">
            <Card.Body>
              <div className="display-4 text-primary fw-bold">
                {analytics.academicPerformance?.currentCGPA}
              </div>
              <small className="text-muted">Current CGPA</small>
              <ProgressBar 
                now={(analytics.academicPerformance?.currentCGPA / 10) * 100} 
                variant="primary" 
                className="mt-2"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success h-100">
            <Card.Body>
              <div className="display-4 text-success fw-bold">
                {analytics.academicPerformance?.attendanceRate}%
              </div>
              <small className="text-muted">Attendance Rate</small>
              <ProgressBar 
                now={analytics.academicPerformance?.attendanceRate} 
                variant="success" 
                className="mt-2"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info h-100">
            <Card.Body>
              <div className="display-4 text-info fw-bold">
                {analytics.academicPerformance?.completedCredits}
              </div>
              <small className="text-muted">Credits Completed</small>
              <ProgressBar 
                now={(analytics.academicPerformance?.completedCredits / analytics.academicPerformance?.totalCredits) * 100} 
                variant="info" 
                className="mt-2"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <div className="display-4 text-warning fw-bold">
                {analytics.academicPerformance?.assignmentsCompleted}%
              </div>
              <small className="text-muted">Assignments Completed</small>
              <ProgressBar 
                now={analytics.academicPerformance?.assignmentsCompleted} 
                variant="warning" 
                className="mt-2"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Trends */}
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Monthly Progress Trend
              </h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Month</th>
                    <th>GPA</th>
                    <th>Progress</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.monthlyProgress?.map((month, index) => (
                    <tr key={index}>
                      <td className="fw-bold">{month.month}</td>
                      <td>{month.gpa}</td>
                      <td>
                        <ProgressBar 
                          now={(month.gpa / 10) * 100} 
                          variant={month.gpa >= 8.5 ? 'success' : month.gpa >= 8.0 ? 'primary' : 'warning'}
                          label={`${month.gpa}/10`}
                        />
                      </td>
                      <td>
                        {index > 0 && (
                          <i className={`fas fa-arrow-${
                            month.gpa > analytics.monthlyProgress[index - 1].gpa ? 'up text-success' : 
                            month.gpa < analytics.monthlyProgress[index - 1].gpa ? 'down text-danger' : 
                            'right text-warning'
                          }`}></i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-cogs me-2"></i>
                Skills Assessment
              </h5>
            </Card.Header>
            <Card.Body>
              {analytics.skillsAssessment?.map((skill, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold">{skill.skill}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <ProgressBar 
                    now={skill.level} 
                    variant={skill.level >= 85 ? 'success' : skill.level >= 75 ? 'primary' : 'warning'}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Subject Performance */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-book-open me-2"></i>
                Subject-wise Performance Analysis
              </h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Performance</th>
                    <th>Trend</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.subjectWisePerformance?.map((subject, index) => (
                    <tr key={index}>
                      <td className="fw-bold">{subject.subject}</td>
                      <td>{subject.score}%</td>
                      <td>
                        <Badge bg={subject.score >= 90 ? 'success' : subject.score >= 80 ? 'primary' : 'warning'}>
                          {subject.grade}
                        </Badge>
                      </td>
                      <td>
                        <ProgressBar 
                          now={subject.score} 
                          variant={subject.score >= 90 ? 'success' : subject.score >= 80 ? 'primary' : 'warning'}
                          label={`${subject.score}%`}
                        />
                      </td>
                      <td>
                        <i className={`fas fa-arrow-${
                          subject.trend === 'up' ? 'up text-success' : 
                          subject.trend === 'down' ? 'down text-danger' : 
                          'right text-warning'
                        }`}></i>
                      </td>
                      <td>
                        <Badge bg={subject.score >= 85 ? 'success' : subject.score >= 70 ? 'warning' : 'danger'}>
                          {subject.score >= 85 ? 'Excellent' : subject.score >= 70 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AnalyticsDashboard;
