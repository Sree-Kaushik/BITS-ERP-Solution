import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Alert, Tabs, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function TimeTable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState('week');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [activeTab, setActiveTab] = useState('timetable');
  const [examSchedule, setExamSchedule] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'personal',
    day: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    reminder: 15,
    recurring: false,
    color: '#007bff'
  });

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTimetable();
    fetchPersonalEvents();
    fetchExamSchedule();
    fetchHolidays();
    checkConflicts();
  }, [user, selectedWeek]);

  const fetchTimetable = async () => {
    try {
      // Enhanced mock timetable data with more details
      const mockTimetable = {
        Monday: {
          '09:00': {
            id: '1',
            subject: 'Database Systems',
            code: 'CS F212',
            type: 'lecture',
            instructor: 'Dr. Rajesh Kumar',
            room: 'F101',
            duration: 90,
            credits: 3,
            attendance: 92,
            nextClass: 'SQL Queries and Joins',
            materials: ['Textbook Ch. 4', 'Slides', 'Lab Manual'],
            color: '#007bff'
          },
          '11:00': {
            id: '2',
            subject: 'Data Structures',
            code: 'CS F211',
            type: 'tutorial',
            instructor: 'Prof. Priya Sharma',
            room: 'F102',
            duration: 60,
            credits: 4,
            attendance: 88,
            nextClass: 'Binary Trees Implementation',
            materials: ['Problem Set 3', 'Code Examples'],
            color: '#28a745'
          },
          '14:00': {
            id: '3',
            subject: 'Mathematics III',
            code: 'MATH F211',
            type: 'lecture',
            instructor: 'Dr. Amit Singh',
            room: 'M201',
            duration: 90,
            credits: 3,
            attendance: 85,
            nextClass: 'Differential Equations',
            materials: ['Textbook Ch. 7', 'Practice Problems'],
            color: '#ffc107'
          }
        },
        Tuesday: {
          '08:00': {
            id: '4',
            subject: 'Computer Networks',
            code: 'CS F303',
            type: 'lecture',
            instructor: 'Prof. Sarah Wilson',
            room: 'F103',
            duration: 90,
            credits: 3,
            attendance: 90,
            nextClass: 'TCP/IP Protocol Stack',
            materials: ['Network Simulator', 'RFC Documents'],
            color: '#dc3545'
          },
          '10:00': {
            id: '5',
            subject: 'Database Systems Lab',
            code: 'CS F212L',
            type: 'lab',
            instructor: 'Dr. Rajesh Kumar',
            room: 'Lab-1',
            duration: 180,
            credits: 1,
            attendance: 95,
            nextClass: 'MySQL Practical Session',
            materials: ['Lab Manual', 'MySQL Workbench'],
            color: '#6f42c1'
          },
          '15:00': {
            id: '6',
            subject: 'Software Engineering',
            code: 'CS F301',
            type: 'lecture',
            instructor: 'Prof. Michael Brown',
            room: 'F104',
            duration: 90,
            credits: 3,
            attendance: 87,
            nextClass: 'Agile Methodologies',
            materials: ['Case Studies', 'UML Diagrams'],
            color: '#fd7e14'
          }
        },
        Wednesday: {
          '09:00': {
            id: '7',
            subject: 'Database Systems',
            code: 'CS F212',
            type: 'lecture',
            instructor: 'Dr. Rajesh Kumar',
            room: 'F101',
            duration: 90,
            credits: 3,
            attendance: 92,
            nextClass: 'Normalization Techniques',
            materials: ['Textbook Ch. 5', 'Normalization Examples'],
            color: '#007bff'
          },
          '13:00': {
            id: '8',
            subject: 'Technical Communication',
            code: 'HSS F111',
            type: 'lecture',
            instructor: 'Prof. Lisa Anderson',
            room: 'H201',
            duration: 60,
            credits: 2,
            attendance: 78,
            nextClass: 'Presentation Skills',
            materials: ['Communication Handbook', 'Sample Presentations'],
            color: '#20c997'
          },
          '16:00': {
            id: '9',
            subject: 'Data Structures Lab',
            code: 'CS F211L',
            type: 'lab',
            instructor: 'Prof. Priya Sharma',
            room: 'Lab-2',
            duration: 120,
            credits: 1,
            attendance: 91,
            nextClass: 'Graph Algorithms Implementation',
            materials: ['IDE Setup', 'Algorithm Templates'],
            color: '#17a2b8'
          }
        },
        Thursday: {
          '08:00': {
            id: '10',
            subject: 'Computer Networks',
            code: 'CS F303',
            type: 'tutorial',
            instructor: 'Prof. Sarah Wilson',
            room: 'F103',
            duration: 60,
            credits: 3,
            attendance: 90,
            nextClass: 'Network Security Basics',
            materials: ['Tutorial Problems', 'Wireshark Tool'],
            color: '#dc3545'
          },
          '11:00': {
            id: '11',
            subject: 'Mathematics III',
            code: 'MATH F211',
            type: 'tutorial',
            instructor: 'Dr. Amit Singh',
            room: 'M201',
            duration: 60,
            credits: 3,
            attendance: 85,
            nextClass: 'Problem Solving Session',
            materials: ['Problem Set 4', 'Solution Manual'],
            color: '#ffc107'
          },
          '14:00': {
            id: '12',
            subject: 'Software Engineering',
            code: 'CS F301',
            type: 'lecture',
            instructor: 'Prof. Michael Brown',
            room: 'F104',
            duration: 90,
            credits: 3,
            attendance: 87,
            nextClass: 'Design Patterns',
            materials: ['Design Pattern Examples', 'Code Samples'],
            color: '#fd7e14'
          }
        },
        Friday: {
          '09:00': {
            id: '13',
            subject: 'Data Structures',
            code: 'CS F211',
            type: 'lecture',
            instructor: 'Prof. Priya Sharma',
            room: 'F102',
            duration: 90,
            credits: 4,
            attendance: 88,
            nextClass: 'Advanced Data Structures',
            materials: ['Advanced Algorithms Book', 'Research Papers'],
            color: '#28a745'
          },
          '13:00': {
            id: '14',
            subject: 'Physics',
            code: 'PHY F110',
            type: 'lecture',
            instructor: 'Dr. Physics Prof',
            room: 'P101',
            duration: 90,
            credits: 3,
            attendance: 82,
            nextClass: 'Quantum Mechanics Intro',
            materials: ['Physics Textbook', 'Lab Equipment'],
            color: '#e83e8c'
          }
        },
        Saturday: {
          '10:00': {
            id: '15',
            subject: 'Seminar',
            code: 'CS F499',
            type: 'seminar',
            instructor: 'Various Faculty',
            room: 'Auditorium',
            duration: 120,
            credits: 1,
            attendance: 95,
            nextClass: 'Industry Expert Talk',
            materials: ['Research Papers', 'Presentation Guidelines'],
            color: '#6c757d'
          }
        }
      };
      
      setTimetable(mockTimetable);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalEvents = () => {
    const mockPersonalEvents = [
      {
        id: 'p1',
        title: 'Study Group - Database',
        day: 'Monday',
        startTime: '19:00',
        endTime: '21:00',
        type: 'study',
        location: 'Library',
        color: '#17a2b8',
        reminder: 30
      },
      {
        id: 'p2',
        title: 'Gym Workout',
        day: 'Tuesday',
        startTime: '17:00',
        endTime: '18:30',
        type: 'fitness',
        location: 'Campus Gym',
        color: '#28a745',
        reminder: 15
      },
      {
        id: 'p3',
        title: 'Project Meeting',
        day: 'Wednesday',
        startTime: '18:00',
        endTime: '19:30',
        type: 'project',
        location: 'Online',
        color: '#ffc107',
        reminder: 15
      }
    ];
    
    setPersonalEvents(mockPersonalEvents);
  };

  const fetchExamSchedule = () => {
    const mockExamSchedule = [
      {
        id: 'e1',
        subject: 'Database Systems',
        code: 'CS F212',
        date: '2025-06-20',
        time: '09:00',
        duration: 180,
        venue: 'Exam Hall A',
        type: 'mid_semester',
        syllabus: 'Chapters 1-8',
        instructions: 'Bring calculator and ID card'
      },
      {
        id: 'e2',
        subject: 'Data Structures',
        code: 'CS F211',
        date: '2025-06-22',
        time: '14:00',
        duration: 180,
        venue: 'Exam Hall B',
        type: 'mid_semester',
        syllabus: 'Complete syllabus till trees',
        instructions: 'Programming exam on computers'
      },
      {
        id: 'e3',
        subject: 'Mathematics III',
        code: 'MATH F211',
        date: '2025-06-25',
        time: '09:00',
        duration: 180,
        venue: 'Exam Hall C',
        type: 'mid_semester',
        syllabus: 'Differential equations and series',
        instructions: 'Formula sheet allowed'
      }
    ];
    
    setExamSchedule(mockExamSchedule);
  };

  const fetchHolidays = () => {
    const mockHolidays = [
      {
        id: 'h1',
        name: 'Independence Day',
        date: '2025-08-15',
        type: 'national'
      },
      {
        id: 'h2',
        name: 'Diwali',
        date: '2025-10-24',
        type: 'festival'
      },
      {
        id: 'h3',
        name: 'Christmas',
        date: '2025-12-25',
        type: 'festival'
      }
    ];
    
    setHolidays(mockHolidays);
  };

  const checkConflicts = () => {
    const conflictList = [];
    
    // Check for overlapping classes
    Object.keys(timetable).forEach(day => {
      const dayClasses = Object.keys(timetable[day]).map(time => ({
        time,
        ...timetable[day][time]
      }));
      
      for (let i = 0; i < dayClasses.length - 1; i++) {
        const current = dayClasses[i];
        const next = dayClasses[i + 1];
        
        const currentEnd = addMinutes(current.time, current.duration);
        if (currentEnd > next.time) {
          conflictList.push({
            day,
            conflict: `${current.subject} overlaps with ${next.subject}`,
            type: 'overlap'
          });
        }
      }
    });
    
    setConflicts(conflictList);
  };

  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  const handleAddPersonalEvent = () => {
    if (!newEvent.title || !newEvent.day || !newEvent.startTime || !newEvent.endTime) {
      toast.error('Please fill all required fields');
      return;
    }

    const event = {
      id: `p${Date.now()}`,
      ...newEvent
    };

    setPersonalEvents(prev => [...prev, event]);
    setShowEventModal(false);
    toast.success('Personal event added successfully!');
    
    // Reset form
    setNewEvent({
      title: '',
      type: 'personal',
      day: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      reminder: 15,
      recurring: false,
      color: '#007bff'
    });
  };

  const getClassForTimeSlot = (day, time) => {
    const classData = timetable[day]?.[time];
    const personalEvent = personalEvents.find(event => 
      event.day === day && event.startTime === time
    );
    
    return classData || personalEvent || null;
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'success';
    if (attendance >= 80) return 'primary';
    if (attendance >= 75) return 'warning';
    return 'danger';
  };

  const getTypeIcon = (type) => {
    const icons = {
      lecture: 'fas fa-chalkboard-teacher',
      tutorial: 'fas fa-users',
      lab: 'fas fa-flask',
      seminar: 'fas fa-presentation',
      personal: 'fas fa-user',
      study: 'fas fa-book',
      fitness: 'fas fa-dumbbell',
      project: 'fas fa-project-diagram'
    };
    return icons[type] || 'fas fa-calendar';
  };

  const exportTimetable = (format) => {
    if (format === 'pdf') {
      toast.info('PDF export feature coming soon!');
    } else if (format === 'ics') {
      // Generate ICS calendar file
      let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:BITS-ERP-TIMETABLE\n';
      
      Object.keys(timetable).forEach(day => {
        Object.keys(timetable[day]).forEach(time => {
          const classData = timetable[day][time];
          icsContent += `BEGIN:VEVENT\n`;
          icsContent += `SUMMARY:${classData.subject} (${classData.code})\n`;
          icsContent += `DESCRIPTION:Instructor: ${classData.instructor}\\nRoom: ${classData.room}\n`;
          icsContent += `LOCATION:${classData.room}\n`;
          icsContent += `END:VEVENT\n`;
        });
      });
      
      icsContent += 'END:VCALENDAR';
      
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'timetable.ics';
      a.click();
      
      toast.success('Timetable exported as calendar file!');
    }
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);
    
    return days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });
  };

  const weekDates = getCurrentWeekDates();

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading timetable...</span>
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
              <i className="fas fa-calendar-alt text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Smart Timetable</h2>
                <small className="text-muted">Interactive schedule with personal events and analytics</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-success" onClick={() => setShowEventModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Add Event
              </Button>
              <Button variant="outline-info" onClick={() => exportTimetable('ics')}>
                <i className="fas fa-download me-2"></i>
                Export
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="warning">
              <h6><i className="fas fa-exclamation-triangle me-2"></i>Schedule Conflicts Detected</h6>
              {conflicts.map((conflict, index) => (
                <div key={index}>
                  <strong>{conflict.day}:</strong> {conflict.conflict}
                </div>
              ))}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="timetable" title={
          <span>
            <i className="fas fa-calendar-week me-2"></i>
            Weekly Timetable
          </span>
        }>
          {/* Controls */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              >
                <option value="current">Current Week</option>
                <option value="next">Next Week</option>
                <option value="previous">Previous Week</option>
              </Form.Select>
            </Col>
            <Col md={6} className="text-end">
              <div className="btn-group" role="group">
                <Button
                  variant={viewMode === 'week' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('week')}
                >
                  Week View
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('day')}
                >
                  Day View
                </Button>
              </div>
            </Col>
          </Row>

          {/* Timetable Grid */}
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table bordered hover className="mb-0 timetable-table">
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '100px' }}>Time</th>
                      {weekDates.map(({ day, date }) => (
                        <th key={day} className="text-center">
                          <div>{day}</div>
                          <small className="text-muted">{date}</small>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(time => (
                      <tr key={time} style={{ height: '80px' }}>
                        <td className="fw-bold text-center bg-light align-middle">
                          {time}
                        </td>
                        {days.map(day => {
                          const classData = getClassForTimeSlot(day, time);
                          return (
                            <td 
                              key={`${day}-${time}`} 
                              className="position-relative p-1"
                              style={{ 
                                backgroundColor: classData ? `${classData.color}15` : 'transparent',
                                cursor: classData ? 'pointer' : 'default'
                              }}
                              onClick={() => classData && setSelectedSlot(classData)}
                            >
                              {classData && (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>
                                      <strong>{classData.subject || classData.title}</strong><br/>
                                      {classData.instructor && `Instructor: ${classData.instructor}`}<br/>
                                      {classData.room && `Room: ${classData.room}`}<br/>
                                      {classData.attendance && `Attendance: ${classData.attendance}%`}
                                    </Tooltip>
                                  }
                                >
                                  <div 
                                    className="class-slot h-100 p-2 rounded"
                                    style={{ 
                                      backgroundColor: classData.color,
                                      color: 'white',
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    <div className="d-flex align-items-center mb-1">
                                      <i className={`${getTypeIcon(classData.type)} me-1`}></i>
                                      <strong>{classData.code || classData.title}</strong>
                                    </div>
                                    <div className="text-truncate">
                                      {classData.subject || classData.title}
                                    </div>
                                    <small className="d-block text-truncate">
                                      {classData.room || classData.location}
                                    </small>
                                    {classData.attendance && (
                                      <div className="mt-1">
                                        <Badge bg={getAttendanceColor(classData.attendance)} size="sm">
                                          {classData.attendance}%
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </OverlayTrigger>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="exams" title={
          <span>
            <i className="fas fa-clipboard-list me-2"></i>
            Exam Schedule ({examSchedule.length})
          </span>
        }>
          <Card>
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">
                <i className="fas fa-clipboard-list me-2"></i>
                Upcoming Examinations
              </h5>
            </Card.Header>
            <Card.Body>
              {examSchedule.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No upcoming examinations scheduled.
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Date & Time</th>
                      <th>Duration</th>
                      <th>Venue</th>
                      <th>Type</th>
                      <th>Syllabus</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examSchedule.map((exam) => (
                      <tr key={exam.id}>
                        <td>
                          <div className="fw-bold">{exam.subject}</div>
                          <small className="text-muted">{exam.code}</small>
                        </td>
                        <td>
                          <div>{new Date(exam.date).toLocaleDateString()}</div>
                          <small className="text-muted">{exam.time}</small>
                        </td>
                        <td>{exam.duration} minutes</td>
                        <td>{exam.venue}</td>
                        <td>
                          <Badge bg="primary">
                            {exam.type.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td>
                          <small>{exam.syllabus}</small>
                        </td>
                        <td>
                          <Button variant="outline-info" size="sm">
                            <i className="fas fa-info-circle"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="personal" title={
          <span>
            <i className="fas fa-user-clock me-2"></i>
            Personal Events ({personalEvents.length})
          </span>
        }>
          <Card>
            <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-user-clock me-2"></i>
                My Personal Events
              </h5>
              <Button variant="light" size="sm" onClick={() => setShowEventModal(true)}>
                <i className="fas fa-plus me-1"></i>
                Add Event
              </Button>
            </Card.Header>
            <Card.Body>
              {personalEvents.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No personal events added yet. Click "Add Event" to create your first personal event.
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Day & Time</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Reminder</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personalEvents.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle me-2"
                              style={{ 
                                width: '12px', 
                                height: '12px', 
                                backgroundColor: event.color 
                              }}
                            ></div>
                            <div>
                              <div className="fw-bold">{event.title}</div>
                              {event.description && (
                                <small className="text-muted">{event.description}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{event.day}</div>
                          <small className="text-muted">{event.startTime} - {event.endTime}</small>
                        </td>
                        <td>{event.location}</td>
                        <td>
                          <Badge bg="secondary">
                            {event.type}
                          </Badge>
                        </td>
                        <td>{event.reminder} min before</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="analytics" title={
          <span>
            <i className="fas fa-chart-bar me-2"></i>
            Analytics
          </span>
        }>
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Weekly Schedule Distribution</h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Lectures</span>
                      <span>12 hours</span>
                    </div>
                    <div className="progress mb-2">
                      <div className="progress-bar" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Labs</span>
                      <span>6 hours</span>
                    </div>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-success" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Tutorials</span>
                      <span>4 hours</span>
                    </div>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-info" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Attendance Overview</h6>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <h3 className="text-primary">89.2%</h3>
                    <small className="text-muted">Overall Attendance</small>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between">
                      <span>Database Systems</span>
                      <Badge bg="success">92%</Badge>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between">
                      <span>Computer Networks</span>
                      <Badge bg="success">90%</Badge>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between">
                      <span>Data Structures</span>
                      <Badge bg="primary">88%</Badge>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between">
                      <span>Software Engineering</span>
                      <Badge bg="primary">87%</Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Add Personal Event Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus me-2"></i>
            Add Personal Event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Day *</Form.Label>
                  <Form.Select
                    value={newEvent.day}
                    onChange={(e) => setNewEvent({...newEvent, day: e.target.value})}
                  >
                    <option value="">Select Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  >
                    <option value="personal">Personal</option>
                    <option value="study">Study</option>
                    <option value="fitness">Fitness</option>
                    <option value="project">Project</option>
                    <option value="meeting">Meeting</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Event location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Event description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Reminder (minutes before)</Form.Label>
                  <Form.Select
                    value={newEvent.reminder}
                    onChange={(e) => setNewEvent({...newEvent, reminder: parseInt(e.target.value)})}
                  >
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="color"
                    value={newEvent.color}
                    onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Recurring event"
                checked={newEvent.recurring}
                onChange={(e) => setNewEvent({...newEvent, recurring: e.target.checked})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEventModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddPersonalEvent}>
            <i className="fas fa-plus me-2"></i>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Class Details Modal */}
      {selectedSlot && (
        <Modal show={!!selectedSlot} onHide={() => setSelectedSlot(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className={`${getTypeIcon(selectedSlot.type)} me-2`}></i>
              {selectedSlot.subject || selectedSlot.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <h6>Class Information</h6>
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Course Code:</td>
                      <td>{selectedSlot.code}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Instructor:</td>
                      <td>{selectedSlot.instructor}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Room:</td>
                      <td>{selectedSlot.room || selectedSlot.location}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Duration:</td>
                      <td>{selectedSlot.duration} minutes</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Credits:</td>
                      <td>{selectedSlot.credits}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Type:</td>
                      <td>
                        <Badge bg="primary">
                          {selectedSlot.type.charAt(0).toUpperCase() + selectedSlot.type.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6>Performance & Materials</h6>
                {selectedSlot.attendance && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Attendance:</span>
                      <Badge bg={getAttendanceColor(selectedSlot.attendance)}>
                        {selectedSlot.attendance}%
                      </Badge>
                    </div>
                  </div>
                )}
                
                {selectedSlot.nextClass && (
                  <div className="mb-3">
                    <strong>Next Topic:</strong>
                    <div className="text-muted">{selectedSlot.nextClass}</div>
                  </div>
                )}
                
                {selectedSlot.materials && (
                  <div>
                    <strong>Required Materials:</strong>
                    <ul className="mt-2">
                      {selectedSlot.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedSlot(null)}>
              Close
            </Button>
            <Button variant="primary">
              <i className="fas fa-external-link-alt me-2"></i>
              View Course Details
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default TimeTable;

