import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Alert, Table } from 'react-bootstrap';

function StudyPlanner() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    subject: '',
    type: 'study',
    priority: 'medium',
    duration: 60,
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  });

  useEffect(() => {
    loadStudyPlan();
  }, []);

  const loadStudyPlan = () => {
    // Mock study plan data
    const mockEvents = [
      {
        id: 1,
        title: 'Database Systems Study',
        date: '2025-06-12',
        time: '09:00',
        duration: 120,
        subject: 'Database Systems',
        type: 'study',
        priority: 'high',
        notes: 'Focus on SQL queries and normalization'
      },
      {
        id: 2,
        title: 'Data Structures Assignment',
        date: '2025-06-13',
        time: '14:00',
        duration: 120,
        subject: 'Data Structures',
        type: 'assignment',
        priority: 'medium',
        notes: 'Complete tree traversal problems'
      },
      {
        id: 3,
        title: 'Computer Networks Exam Prep',
        date: '2025-06-15',
        time: '10:00',
        duration: 180,
        subject: 'Computer Networks',
        type: 'exam',
        priority: 'high',
        notes: 'Review OSI model and TCP/IP'
      }
    ];
    setEvents(mockEvents);
  };

  const handleAddEvent = () => {
    const event = {
      id: events.length + 1,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      duration: newEvent.duration,
      subject: newEvent.subject,
      type: newEvent.type,
      priority: newEvent.priority,
      notes: newEvent.notes
    };

    setEvents([...events, event]);
    setShowModal(false);
    setNewEvent({
      title: '',
      subject: '',
      type: 'study',
      priority: 'medium',
      duration: 60,
      notes: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00'
    });
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const getTypeColor = (type) => {
    const colors = {
      study: 'success',
      assignment: 'warning',
      exam: 'danger',
      project: 'info',
      revision: 'primary'
    };
    return colors[type] || 'secondary';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'danger',
      medium: 'warning',
      low: 'info'
    };
    return colors[priority] || 'secondary';
  };

  const generateAIRecommendations = () => {
    return [
      {
        type: 'study',
        subject: 'Database Systems',
        recommendation: 'Focus on SQL queries and normalization - exam in 3 days',
        priority: 'high',
        estimatedTime: '2 hours'
      },
      {
        type: 'revision',
        subject: 'Data Structures',
        recommendation: 'Review tree algorithms - assignment due tomorrow',
        priority: 'medium',
        estimatedTime: '1.5 hours'
      },
      {
        type: 'practice',
        subject: 'Computer Networks',
        recommendation: 'Practice subnetting problems - weak area identified',
        priority: 'medium',
        estimatedTime: '1 hour'
      }
    ];
  };

  const getTodaysEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date === today);
  };

  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date > today).slice(0, 5);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">
            <i className="fas fa-brain me-2"></i>
            Smart Study Planner
          </h2>
          <p className="text-muted">AI-powered personalized study scheduling</p>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Add Study Session
          </Button>
        </Col>
      </Row>

      {/* AI Recommendations */}
      <Row className="mb-4">
        <Col>
          <Card className="border-info">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-lightbulb me-2"></i>
                AI Study Recommendations
              </h5>
            </Card.Header>
            <Card.Body>
              {generateAIRecommendations().map((rec, index) => (
                <Alert key={index} variant="light" className="border-start border-info border-3">
                  <Row className="align-items-center">
                    <Col>
                      <strong>{rec.subject}</strong>
                      <p className="mb-1">{rec.recommendation}</p>
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>
                        Estimated time: {rec.estimatedTime}
                      </small>
                    </Col>
                    <Col md="auto">
                      <Badge bg={rec.priority === 'high' ? 'danger' : 'warning'}>
                        {rec.priority.toUpperCase()}
                      </Badge>
                    </Col>
                    <Col md="auto">
                      <Button size="sm" variant="outline-primary">
                        Schedule
                      </Button>
                    </Col>
                  </Row>
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Today's Schedule and Upcoming Events */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-calendar-day me-2"></i>
                Today's Schedule
              </h5>
            </Card.Header>
            <Card.Body>
              {getTodaysEvents().length === 0 ? (
                <Alert variant="info">No study sessions scheduled for today.</Alert>
              ) : (
                <div>
                  {getTodaysEvents().map((event) => (
                    <Card key={event.id} className="mb-2 border-start border-success border-3">
                      <Card.Body className="py-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{event.title}</h6>
                            <small className="text-muted">
                              <i className="fas fa-clock me-1"></i>
                              {event.time} ({event.duration} min)
                            </small>
                            <br />
                            <Badge bg={getTypeColor(event.type)} className="me-1">
                              {event.type}
                            </Badge>
                            <Badge bg={getPriorityColor(event.priority)}>
                              {event.priority}
                            </Badge>
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-calendar-alt me-2"></i>
                Upcoming Events
              </h5>
            </Card.Header>
            <Card.Body>
              {getUpcomingEvents().length === 0 ? (
                <Alert variant="info">No upcoming events scheduled.</Alert>
              ) : (
                <div>
                  {getUpcomingEvents().map((event) => (
                    <Card key={event.id} className="mb-2 border-start border-primary border-3">
                      <Card.Body className="py-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{event.title}</h6>
                            <small className="text-muted">
                              <i className="fas fa-calendar me-1"></i>
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </small>
                            <br />
                            <Badge bg={getTypeColor(event.type)} className="me-1">
                              {event.type}
                            </Badge>
                            <Badge bg={getPriorityColor(event.priority)}>
                              {event.priority}
                            </Badge>
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* All Events Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                All Study Sessions
              </h5>
            </Card.Header>
            <Card.Body>
              {events.length === 0 ? (
                <Alert variant="info">No study sessions scheduled.</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Duration</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="fw-bold">{event.title}</td>
                        <td>{event.subject}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{event.time}</td>
                        <td>{event.duration} min</td>
                        <td>
                          <Badge bg={getTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getPriorityColor(event.priority)}>
                            {event.priority}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
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

      {/* Add Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus me-2"></i>
            Add Study Session
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Study session title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Select
                    value={newEvent.subject}
                    onChange={(e) => setNewEvent({...newEvent, subject: e.target.value})}
                  >
                    <option value="">Select Subject</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  >
                    <option value="study">Study</option>
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam Prep</option>
                    <option value="revision">Revision</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value)})}
                    min="15"
                    max="480"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEvent.notes}
                onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                placeholder="Additional notes or study goals"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEvent} disabled={!newEvent.title}>
            <i className="fas fa-save me-2"></i>
            Add Session
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default StudyPlanner;
