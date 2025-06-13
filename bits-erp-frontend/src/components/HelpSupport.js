import React, { useState } from 'react';
import { Container, Row, Col, Card, Accordion, Form, Button, Alert, Badge, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ticketForm, setTicketForm] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: ''
  });

  const faqData = [
    {
      id: 1,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Account Settings > Change Password. You can also use the "Forgot Password" link on the login page.'
    },
    {
      id: 2,
      category: 'grades',
      question: 'When are grades typically posted?',
      answer: 'Grades are usually posted within 2-3 weeks after the exam. You will receive a notification when new grades are available.'
    },
    {
      id: 3,
      category: 'fees',
      question: 'How can I pay my fees online?',
      answer: 'Visit the Fee Management section and click "Pay Now". We accept credit cards, debit cards, UPI, and net banking.'
    },
    {
      id: 4,
      category: 'library',
      question: 'How many books can I borrow at once?',
      answer: 'Students can borrow up to 5 books at a time. Faculty members can borrow up to 10 books.'
    },
    {
      id: 5,
      category: 'hostel',
      question: 'How do I apply for hostel accommodation?',
      answer: 'Go to Hostel Management section and click "Apply for Room". Fill out the application form and submit required documents.'
    },
    {
      id: 6,
      category: 'technical',
      question: 'The website is not loading properly. What should I do?',
      answer: 'Try clearing your browser cache, disable browser extensions, or try using a different browser. If the issue persists, contact technical support.'
    }
  ];

  const contactInfo = [
    {
      department: 'Academic Office',
      phone: '+91-1596-242001',
      email: 'academic@bits-pilani.ac.in',
      hours: '9:00 AM - 5:00 PM (Mon-Fri)'
    },
    {
      department: 'Technical Support',
      phone: '+91-1596-242002',
      email: 'support@bits-pilani.ac.in',
      hours: '24/7'
    },
    {
      department: 'Finance Office',
      phone: '+91-1596-242003',
      email: 'finance@bits-pilani.ac.in',
      hours: '9:00 AM - 5:00 PM (Mon-Fri)'
    },
    {
      department: 'Hostel Office',
      phone: '+91-1596-242004',
      email: 'hostel@bits-pilani.ac.in',
      hours: '9:00 AM - 6:00 PM (Mon-Sat)'
    }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    
    if (!ticketForm.category || !ticketForm.subject || !ticketForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate ticket submission
    toast.success('Support ticket submitted successfully! Ticket ID: #' + Math.random().toString(36).substr(2, 9).toUpperCase());
    
    // Reset form
    setTicketForm({
      category: '',
      priority: 'medium',
      subject: '',
      description: ''
    });
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-question-circle text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">Help & Support</h2>
              <small className="text-muted">Get help and find answers to common questions</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 border-primary">
            <Card.Body>
              <i className="fas fa-book text-primary mb-2" style={{ fontSize: '2rem' }}></i>
              <h6>User Guide</h6>
              <Button variant="outline-primary" size="sm">
                Download PDF
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-success">
            <Card.Body>
              <i className="fas fa-video text-success mb-2" style={{ fontSize: '2rem' }}></i>
              <h6>Video Tutorials</h6>
              <Button variant="outline-success" size="sm">
                Watch Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-info">
            <Card.Body>
              <i className="fas fa-comments text-info mb-2" style={{ fontSize: '2rem' }}></i>
              <h6>Live Chat</h6>
              <Button variant="outline-info" size="sm">
                Start Chat
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-warning">
            <Card.Body>
              <i className="fas fa-ticket-alt text-warning mb-2" style={{ fontSize: '2rem' }}></i>
              <h6>Submit Ticket</h6>
              <Button variant="outline-warning" size="sm" href="#submit-ticket">
                Create Ticket
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-question me-2"></i>
                Frequently Asked Questions
              </h5>
            </Card.Header>
            <Card.Body>
              {/* Search and Filter */}
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="account">Account</option>
                    <option value="grades">Grades</option>
                    <option value="fees">Fees</option>
                    <option value="library">Library</option>
                    <option value="hostel">Hostel</option>
                    <option value="technical">Technical</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* FAQ Accordion */}
              <Accordion>
                {filteredFAQs.map((faq) => (
                  <Accordion.Item eventKey={faq.id.toString()} key={faq.id}>
                    <Accordion.Header>
                      <div className="d-flex align-items-center">
                        <Badge bg="secondary" className="me-2">
                          {faq.category}
                        </Badge>
                        {faq.question}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {faq.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No FAQs found matching your search criteria.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact Information */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-phone me-2"></i>
                Contact Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {contactInfo.map((contact, index) => (
                  <Col md={6} key={index} className="mb-3">
                    <Card className="h-100 border-0 bg-light">
                      <Card.Body>
                        <h6 className="text-primary">{contact.department}</h6>
                        <p className="mb-1">
                          <i className="fas fa-phone me-2"></i>
                          <a href={`tel:${contact.phone}`} className="text-decoration-none">
                            {contact.phone}
                          </a>
                        </p>
                        <p className="mb-1">
                          <i className="fas fa-envelope me-2"></i>
                          <a href={`mailto:${contact.email}`} className="text-decoration-none">
                            {contact.email}
                          </a>
                        </p>
                        <p className="mb-0 small text-muted">
                          <i className="fas fa-clock me-2"></i>
                          {contact.hours}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Submit Ticket */}
      <Row id="submit-ticket">
        <Col>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="fas fa-ticket-alt me-2"></i>
                Submit Support Ticket
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmitTicket}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="technical">Technical Issue</option>
                        <option value="account">Account Problem</option>
                        <option value="grades">Grades Inquiry</option>
                        <option value="fees">Fee Related</option>
                        <option value="library">Library Issue</option>
                        <option value="hostel">Hostel Related</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    placeholder="Brief description of your issue"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    placeholder="Provide detailed information about your issue..."
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button variant="secondary" type="button" onClick={() => setTicketForm({
                    category: '',
                    priority: 'medium',
                    subject: '',
                    description: ''
                  })}>
                    Clear Form
                  </Button>
                  <Button variant="primary" type="submit">
                    <i className="fas fa-paper-plane me-2"></i>
                    Submit Ticket
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HelpSupport;
