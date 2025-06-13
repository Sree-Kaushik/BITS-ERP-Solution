import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';

function FeedbackForm() {
  const [feedback, setFeedback] = useState({
    category: '',
    rating: 5,
    subject: '',
    message: '',
    suggestions: '',
    anonymous: false,
    allowContact: true
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!feedback.category || !feedback.subject || !feedback.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate feedback submission
    setTimeout(() => {
      setSubmitted(true);
      toast.success('Thank you for your feedback! We appreciate your input.');
    }, 1000);
  };

  const handleReset = () => {
    setFeedback({
      category: '',
      rating: 5,
      subject: '',
      message: '',
      suggestions: '',
      anonymous: false,
      allowContact: true
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="text-center shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                <h3 className="text-success mb-3">Feedback Submitted Successfully!</h3>
                <p className="text-muted mb-4">
                  Thank you for taking the time to share your feedback with us. 
                  Your input helps us improve the BITS Campus ERP system.
                </p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Button variant="primary" onClick={handleReset}>
                    <i className="fas fa-plus me-2"></i>
                    Submit Another Feedback
                  </Button>
                  <Button variant="outline-primary" href="/dashboard">
                    <i className="fas fa-home me-2"></i>
                    Back to Dashboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-comment text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">Send Feedback</h2>
              <small className="text-muted">Help us improve your experience with BITS Campus ERP</small>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-star me-2"></i>
                Your Feedback Matters
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Alert variant="info" className="mb-4">
                <i className="fas fa-info-circle me-2"></i>
                Your feedback helps us understand what's working well and what needs improvement. 
                All feedback is reviewed by our development team.
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Feedback Category *</Form.Label>
                      <Form.Select
                        value={feedback.category}
                        onChange={(e) => setFeedback({...feedback, category: e.target.value})}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="user-interface">User Interface/Design</option>
                        <option value="functionality">Functionality</option>
                        <option value="performance">Performance</option>
                        <option value="bug-report">Bug Report</option>
                        <option value="feature-request">Feature Request</option>
                        <option value="general">General Feedback</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Overall Rating</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Range
                          min={1}
                          max={5}
                          value={feedback.rating}
                          onChange={(e) => setFeedback({...feedback, rating: parseInt(e.target.value)})}
                          className="me-3"
                        />
                        <div className="text-center" style={{ minWidth: '60px' }}>
                          <div className="h5 mb-0 text-primary">{feedback.rating}</div>
                          <div className="small text-muted">
                            {'★'.repeat(feedback.rating)}{'☆'.repeat(5-feedback.rating)}
                          </div>
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    value={feedback.subject}
                    onChange={(e) => setFeedback({...feedback, subject: e.target.value})}
                    placeholder="Brief summary of your feedback"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Detailed Feedback *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={feedback.message}
                    onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                    placeholder="Please provide detailed feedback about your experience..."
                    required
                  />
                  <Form.Text className="text-muted">
                    {feedback.message.length}/1000 characters
                  </Form.Text>
                  <ProgressBar 
                    now={(feedback.message.length / 1000) * 100} 
                    variant={feedback.message.length > 800 ? 'warning' : 'primary'}
                    className="mt-1"
                    style={{ height: '3px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Suggestions for Improvement</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={feedback.suggestions}
                    onChange={(e) => setFeedback({...feedback, suggestions: e.target.value})}
                    placeholder="Any specific suggestions or ideas for improvement..."
                  />
                </Form.Group>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Check
                        type="switch"
                        label="Submit feedback anonymously"
                        checked={feedback.anonymous}
                        onChange={(e) => setFeedback({...feedback, anonymous: e.target.checked})}
                      />
                      <Form.Text className="text-muted">
                        Your identity will not be shared with the feedback
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Check
                        type="switch"
                        label="Allow follow-up contact"
                        checked={feedback.allowContact}
                        onChange={(e) => setFeedback({...feedback, allowContact: e.target.checked})}
                        disabled={feedback.anonymous}
                      />
                      <Form.Text className="text-muted">
                        We may contact you for clarification
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button variant="outline-secondary" type="button" onClick={handleReset}>
                    <i className="fas fa-undo me-2"></i>
                    Reset Form
                  </Button>
                  <Button variant="primary" type="submit">
                    <i className="fas fa-paper-plane me-2"></i>
                    Submit Feedback
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Feedback Guidelines */}
      <Row className="mt-4">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body>
              <h6 className="text-primary mb-3">
                <i className="fas fa-lightbulb me-2"></i>
                Feedback Guidelines
              </h6>
              <Row>
                <Col md={6}>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Be specific about issues or suggestions
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Include steps to reproduce bugs
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Mention your browser and device type
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Suggest practical improvements
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Keep feedback constructive and professional
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Include screenshots if relevant
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FeedbackForm;
