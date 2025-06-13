import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Alert, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function AcademicCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reminders, setReminders] = useState([]);
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    type: 'academic',
    priority: 'medium',
    location: '',
    attendees: '',
    isRecurring: false,
    recurringType: 'weekly',
    reminderBefore: 24
  });

  useEffect(() => {
    fetchEvents();
    fetchReminders();
  }, []);

  const fetchEvents = async () => {
    try {
      // Enhanced mock data with more event types
      setEvents([
        {
          id: '1',
          title: 'Mid Semester Examinations',
          description: 'Mid semester exams for all courses',
          date: '2025-06-20',
          time: '09:00',
          endTime: '12:00',
          type: 'exam',
          priority: 'high',
          location: 'Various Exam Halls',
          attendees: 'All Students',
          isRecurring: false,
          createdBy: 'Academic Office',
          status: 'confirmed',
          attachments: ['exam_schedule.pdf'],
          registrationRequired: true,
          maxAttendees: 1000
        },
        {
          id: '2',
          title: 'Guest Lecture: AI in Healthcare',
          description: 'Special lecture by Dr. Sarah Johnson on AI applications in healthcare',
          date: '2025-06-15',
          time: '14:00',
          endTime: '16:00',
          type: 'lecture',
          priority: 'medium',
          location: 'Auditorium A',
          attendees: 'CS & Bio Students',
          isRecurring: false,
          createdBy: 'CS Department',
          status: 'confirmed',
          registrationRequired: true,
          maxAttendees: 200
        },
        {
          id: '3',
          title: 'Cultural Festival - OASIS',
          description: 'Annual cultural festival with various competitions and events',
          date: '2025-06-25',
          time: '10:00',
          endTime: '22:00',
          type: 'cultural',
          priority: 'high',
          location: 'Main Campus',
          attendees: 'All Students',
          isRecurring: true,
          recurringType: 'yearly',
          createdBy: 'Student Union',
          status: 'confirmed'
        },
        {
          id: '4',
          title: 'Career Fair 2025',
          description: 'Annual placement drive with top companies',
          date: '2025-06-30',
          time: '09:00',
          endTime: '17:00',
          type: 'placement',
          priority: 'high',
          location: 'Convention Center',
          attendees: 'Final Year Students',
          isRecurring: false,
          createdBy: 'Placement Office',
          status: 'confirmed',
          registrationRequired: true
        },
        {
          id: '5',
          title: 'Research Symposium',
          description: 'Student research presentation and poster session',
          date: '2025-06-18',
          time: '09:00',
          endTime: '17:00',
          type: 'research',
          priority: 'medium',
          location: 'Research Center',
          attendees: 'Research Students',
          isRecurring: false,
          createdBy: 'Research Office',
          status: 'confirmed'
        }
      ]);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchReminders = () => {
    // Mock reminders
    setReminders([
      { id: '1', eventId: '1', message: 'Mid Semester Exams start in 2 days', type: 'exam' },
      { id: '2', eventId: '2', message: 'Guest lecture registration closes today', type: 'lecture' }
    ]);
  };

  const handleAddEvent = () => {
    if (user?.role !== 'admin' && user?.role !== 'faculty') {
      toast.error('Only admin and faculty can add events');
      return;
    }
    setEventForm({
      title: '',
      description: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      time: '',
      endTime: '',
      type: 'academic',
      priority: 'medium',
      location: '',
      attendees: '',
      isRecurring: false,
      recurringType: 'weekly',
      reminderBefore: 24
    });
    setShowEventModal(true);
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      const newEvent = {
        id: Date.now().toString(),
        ...eventForm,
        createdBy: user?.username,
        status: 'confirmed',
        registrationRequired: false
      };
      
      setEvents(prev => [...prev, newEvent]);
      setShowEventModal(false);
      toast.success('Event added successfully!');
      
      // Set reminder
      if (eventForm.reminderBefore > 0) {
        setTimeout(() => {
          toast.info(`Reminder: ${eventForm.title} is coming up!`);
        }, 5000); // Demo reminder after 5 seconds
      }
    } catch (error) {
      toast.error('Failed to add event');
    }
  };

  const registerForEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event?.registrationRequired) {
      toast.success(`Successfully registered for ${event.title}`);
    }
  };

  const exportCalendar = (format) => {
    const filteredEvents = getFilteredEvents();
    const exportData = filteredEvents.map(event => ({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type
    }));
    
    if (format === 'ics') {
      // Generate ICS file content
      let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:BITS-ERP\n';
      filteredEvents.forEach(event => {
        icsContent += `BEGIN:VEVENT\n`;
        icsContent += `SUMMARY:${event.title}\n`;
        icsContent += `DTSTART:${event.date.replace(/-/g, '')}T${event.time.replace(':', '')}00\n`;
        icsContent += `DESCRIPTION:${event.description}\n`;
        icsContent += `LOCATION:${event.location}\n`;
        icsContent += `END:VEVENT\n`;
      });
      icsContent += 'END:VCALENDAR';
      
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'academic_calendar.ics';
      a.click();
    }
    
    toast.success(`Calendar exported as ${format.toUpperCase()}`);
  };

  const getFilteredEvents = () => {
    return events.filter(event => {
      const matchesType = filterType === 'all' || event.type === filterType;
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      exam: 'danger',
      lecture: 'primary',
      cultural: 'warning',
      placement: 'success',
      research: 'info',
      academic: 'secondary',
      sports: 'dark'
    };
    return colors[type] || 'secondary';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: 'fas fa-exclamation-triangle text-danger',
      medium: 'fas fa-info-circle text-warning',
      low: 'fas fa-check-circle text-success'
    };
    return icons[priority] || 'fas fa-info-circle';
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => 
        new Date(event.date).toDateString() === current.toDateString()
      );
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        events: dayEvents
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-calendar-alt text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Academic Calendar</h2>
                <small className="text-muted">Comprehensive academic event management</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-info" size="sm">
                  <i className="fas fa-download me-1"></i>
                  Export
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => exportCalendar('ics')}>
                    <i className="fas fa-calendar me-2"></i>
                    Export as ICS
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => exportCalendar('pdf')}>
                    <i className="fas fa-file-pdf me-2"></i>
                    Export as PDF
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => exportCalendar('csv')}>
                    <i className="fas fa-file-csv me-2"></i>
                    Export as CSV
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              {(user?.role === 'admin' || user?.role === 'faculty') && (
                <Button variant="primary" onClick={handleAddEvent}>
                  <i className="fas fa-plus me-2"></i>
                  Add Event
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Reminders */}
      {reminders.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="warning" className="border-start border-warning border-3">
              <h6><i className="fas fa-bell me-2"></i>Upcoming Reminders</h6>
              {reminders.map(reminder => (
                <div key={reminder.id} className="mb-1">
                  <i className="fas fa-clock me-2"></i>
                  {reminder.message}
                </div>
              ))}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Controls */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <Button variant="outline-primary" size="sm" onClick={() => navigateMonth(-1)}>
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                    <h5 className="mx-3 mb-0">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h5>
                    <Button variant="outline-primary" size="sm" onClick={() => navigateMonth(1)}>
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Events</option>
                    <option value="exam">Examinations</option>
                    <option value="lecture">Lectures</option>
                    <option value="cultural">Cultural</option>
                    <option value="placement">Placement</option>
                    <option value="research">Research</option>
                    <option value="sports">Sports</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Calendar Grid */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="calendar-grid">
                {/* Week Headers */}
                <div className="row mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="col text-center fw-bold text-muted">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                {Array.from({ length: 6 }, (_, weekIndex) => (
                  <div key={weekIndex} className="row mb-1">
                    {generateCalendarDays().slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`col p-2 border calendar-day ${
                          !day.isCurrentMonth ? 'text-muted bg-light' : ''
                        } ${day.isToday ? 'bg-primary text-white' : ''}`}
                        style={{ minHeight: '100px', cursor: 'pointer' }}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <span className={`fw-bold ${day.isToday ? 'text-white' : ''}`}>
                            {day.date.getDate()}
                          </span>
                          {day.events.length > 0 && (
                            <Badge bg="danger" pill>
                              {day.events.length}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mt-1">
                          {day.events.slice(0, 2).map(event => (
                            <OverlayTrigger
                              key={event.id}
                              placement="top"
                              overlay={
                                <Tooltip>
                                  <strong>{event.title}</strong><br />
                                  {event.time} - {event.location}
                                </Tooltip>
                              }
                            >
                              <div
                                className={`small p-1 mb-1 rounded cursor-pointer bg-${getEventTypeColor(event.type)} text-white`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                  setShowDetailsModal(true);
                                }}
                                style={{ fontSize: '10px' }}
                              >
                                <i className={getPriorityIcon(event.priority)} style={{ fontSize: '8px' }}></i>
                                {event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}
                              </div>
                            </OverlayTrigger>
                          ))}
                          {day.events.length > 2 && (
                            <div className="small text-muted">
                              +{day.events.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Event List */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Upcoming Events ({getFilteredEvents().length})
              </h5>
            </Card.Header>
            <Card.Body>
              {getFilteredEvents().slice(0, 10).map(event => (
                <div key={event.id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <Badge bg={getEventTypeColor(event.type)} className="me-2">
                          {event.type}
                        </Badge>
                        <h6 className="mb-0 me-2">{event.title}</h6>
                        <i className={getPriorityIcon(event.priority)}></i>
                      </div>
                      <p className="text-muted mb-2">{event.description}</p>
                      <div className="small text-muted">
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                        <i className="fas fa-map-marker-alt ms-3 me-1"></i>
                        {event.location}
                        <i className="fas fa-users ms-3 me-1"></i>
                        {event.attendees}
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowDetailsModal(true);
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      {event.registrationRequired && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => registerForEvent(event.id)}
                        >
                          <i className="fas fa-user-plus"></i>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Event Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus me-2"></i>
            Add New Event
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEvent}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Examination</option>
                    <option value="lecture">Lecture</option>
                    <option value="cultural">Cultural</option>
                    <option value="placement">Placement</option>
                    <option value="research">Research</option>
                    <option value="sports">Sports</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={eventForm.endTime}
                    onChange={(e) => setEventForm({...eventForm, endTime: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    placeholder="Venue or online link"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={eventForm.priority}
                    onChange={(e) => setEventForm({...eventForm, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Recurring Event"
                    checked={eventForm.isRecurring}
                    onChange={(e) => setEventForm({...eventForm, isRecurring: e.target.checked})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {eventForm.isRecurring && (
                  <Form.Group className="mb-3">
                    <Form.Label>Recurring Type</Form.Label>
                    <Form.Select
                      value={eventForm.recurringType}
                      onChange={(e) => setEventForm({...eventForm, recurringType: e.target.value})}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </Form.Select>
                  </Form.Group>
                )}
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Reminder (hours before)</Form.Label>
              <Form.Select
                value={eventForm.reminderBefore}
                onChange={(e) => setEventForm({...eventForm, reminderBefore: parseInt(e.target.value)})}
              >
                <option value={0}>No Reminder</option>
                <option value={1}>1 Hour</option>
                <option value={24}>1 Day</option>
                <option value={48}>2 Days</option>
                <option value={168}>1 Week</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEventModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <i className="fas fa-save me-2"></i>
              Add Event
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Event Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-calendar-day me-2"></i>
            Event Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4>{selectedEvent.title}</h4>
                <div>
                  <Badge bg={getEventTypeColor(selectedEvent.type)} className="me-2">
                    {selectedEvent.type}
                  </Badge>
                  <i className={getPriorityIcon(selectedEvent.priority)}></i>
                </div>
              </div>
              
              <p className="text-muted mb-3">{selectedEvent.description}</p>
              
              <Row>
                <Col md={6}>
                  <div className="mb-2">
                    <strong><i className="fas fa-calendar me-2"></i>Date:</strong> 
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </div>
                  <div className="mb-2">
                    <strong><i className="fas fa-clock me-2"></i>Time:</strong> 
                    {selectedEvent.time} {selectedEvent.endTime && `- ${selectedEvent.endTime}`}
                  </div>
                  <div className="mb-2">
                    <strong><i className="fas fa-map-marker-alt me-2"></i>Location:</strong> 
                    {selectedEvent.location}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-2">
                    <strong><i className="fas fa-users me-2"></i>Attendees:</strong> 
                    {selectedEvent.attendees}
                  </div>
                  <div className="mb-2">
                    <strong><i className="fas fa-user me-2"></i>Created by:</strong> 
                    {selectedEvent.createdBy}
                  </div>
                  <div className="mb-2">
                    <strong><i className="fas fa-info-circle me-2"></i>Status:</strong> 
                    <Badge bg="success">{selectedEvent.status}</Badge>
                  </div>
                </Col>
              </Row>

              {selectedEvent.registrationRequired && (
                <Alert variant="info" className="mt-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Registration is required for this event.
                  {selectedEvent.maxAttendees && (
                    <span> Maximum attendees: {selectedEvent.maxAttendees}</span>
                  )}
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {selectedEvent?.registrationRequired && (
            <Button 
              variant="success" 
              onClick={() => registerForEvent(selectedEvent.id)}
            >
              <i className="fas fa-user-plus me-2"></i>
              Register
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AcademicCalendar;
