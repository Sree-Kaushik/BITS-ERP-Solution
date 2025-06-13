import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, ProgressBar, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function HostelManagement() {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [myAllocation, setMyAllocation] = useState(null);
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showRoomDetailsModal, setShowRoomDetailsModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [messBill, setMessBill] = useState({});
  const [roommates, setRoommates] = useState([]);

  const [applicationForm, setApplicationForm] = useState({
    hostel_preference_1: '',
    hostel_preference_2: '',
    hostel_preference_3: '',
    room_type: 'single',
    special_requirements: '',
    emergency_contact: '',
    parent_consent: false,
    medical_conditions: '',
    reason: ''
  });

  const [complaintForm, setComplaintForm] = useState({
    category: 'maintenance',
    priority: 'medium',
    subject: '',
    description: '',
    location: '',
    attachments: []
  });

  const [visitorForm, setVisitorForm] = useState({
    visitor_name: '',
    visitor_phone: '',
    visitor_id: '',
    relationship: '',
    visit_date: '',
    visit_time: '',
    duration: '2',
    purpose: '',
    approval_required: true
  });

  useEffect(() => {
    fetchHostelData();
    fetchMyAllocation();
    fetchApplications();
    fetchComplaints();
    fetchVisitors();
    fetchMessBill();
  }, []);

  const fetchHostelData = () => {
    // Enhanced mock hostel data
    setHostels([
      {
        hostel_id: '1',
        name: 'Vivekananda Bhawan',
        type: 'boys',
        total_rooms: 200,
        occupied_rooms: 185,
        available_rooms: 15,
        facilities: ['WiFi', 'Gym', 'Common Room', 'Laundry', 'Mess', 'Library'],
        room_types: {
          single: { count: 50, rent: 8000, available: 5 },
          double: { count: 100, rent: 6000, available: 8 },
          triple: { count: 50, rent: 4500, available: 2 }
        },
        warden: 'Dr. Rajesh Kumar',
        contact: '+91-1596-242001',
        rules: [
          'No visitors after 10 PM',
          'Maintain cleanliness',
          'No loud music after 11 PM',
          'Register all visitors'
        ],
        mess_timings: {
          breakfast: '7:00 AM - 9:30 AM',
          lunch: '12:00 PM - 2:30 PM',
          snacks: '4:00 PM - 6:00 PM',
          dinner: '7:30 PM - 10:00 PM'
        },
        location: 'Near Main Gate',
        rating: 4.2,
        reviews_count: 156
      },
      {
        hostel_id: '2',
        name: 'Saraswati Bhawan',
        type: 'girls',
        total_rooms: 180,
        occupied_rooms: 170,
        available_rooms: 10,
        facilities: ['WiFi', 'Gym', 'Common Room', 'Laundry', 'Mess', 'Medical Room'],
        room_types: {
          single: { count: 40, rent: 8500, available: 2 },
          double: { count: 90, rent: 6500, available: 6 },
          triple: { count: 50, rent: 5000, available: 2 }
        },
        warden: 'Dr. Priya Sharma',
        contact: '+91-1596-242002',
        rules: [
          'No visitors after 9 PM',
          'Maintain cleanliness',
          'No loud music after 10 PM',
          'Register all visitors'
        ],
        mess_timings: {
          breakfast: '7:00 AM - 9:30 AM',
          lunch: '12:00 PM - 2:30 PM',
          snacks: '4:00 PM - 6:00 PM',
          dinner: '7:30 PM - 10:00 PM'
        },
        location: 'Near Library',
        rating: 4.5,
        reviews_count: 142
      },
      {
        hostel_id: '3',
        name: 'Gandhi Bhawan',
        type: 'boys',
        total_rooms: 150,
        occupied_rooms: 140,
        available_rooms: 10,
        facilities: ['WiFi', 'Sports Room', 'Common Room', 'Laundry', 'Mess'],
        room_types: {
          single: { count: 30, rent: 7500, available: 3 },
          double: { count: 80, rent: 5500, available: 5 },
          triple: { count: 40, rent: 4000, available: 2 }
        },
        warden: 'Prof. Amit Singh',
        contact: '+91-1596-242003',
        rules: [
          'No visitors after 10 PM',
          'Maintain cleanliness',
          'No smoking',
          'Register all visitors'
        ],
        mess_timings: {
          breakfast: '7:00 AM - 9:30 AM',
          lunch: '12:00 PM - 2:30 PM',
          snacks: '4:00 PM - 6:00 PM',
          dinner: '7:30 PM - 10:00 PM'
        },
        location: 'Near Sports Complex',
        rating: 4.0,
        reviews_count: 98
      }
    ]);
    setLoading(false);
  };

  const fetchMyAllocation = () => {
    // Mock current allocation
    setMyAllocation({
      allocation_id: '1',
      hostel_name: 'Vivekananda Bhawan',
      room_number: 'A-205',
      room_type: 'double',
      floor: 2,
      block: 'A',
      allocation_date: '2024-08-15',
      rent: 6000,
      security_deposit: 5000,
      status: 'active',
      checkout_date: null,
      warden: 'Dr. Rajesh Kumar',
      roommate: 'Rahul Kumar (2021A7PS002P)',
      facilities_in_room: ['Bed', 'Study Table', 'Chair', 'Wardrobe', 'Fan', 'WiFi'],
      room_condition: 'good',
      last_maintenance: '2024-05-15'
    });

    setRoommates([
      {
        student_id: '2021A7PS002P',
        name: 'Rahul Kumar',
        branch: 'Computer Science',
        year: 3,
        contact: '+91-9876543211',
        hometown: 'Delhi'
      }
    ]);
  };

  const fetchApplications = () => {
    setApplications([
      {
        application_id: '1',
        application_date: '2024-06-01',
        hostel_preference_1: 'Vivekananda Bhawan',
        hostel_preference_2: 'Gandhi Bhawan',
        room_type: 'double',
        status: 'approved',
        approval_date: '2024-06-15',
        allocated_hostel: 'Vivekananda Bhawan',
        allocated_room: 'A-205',
        remarks: 'Allocated as per preference'
      }
    ]);
  };

  const fetchComplaints = () => {
    setComplaints([
      {
        complaint_id: '1',
        category: 'maintenance',
        subject: 'AC not working',
        description: 'Air conditioner in room A-205 is not cooling properly',
        priority: 'high',
        status: 'in_progress',
        submission_date: '2024-06-10',
        expected_resolution: '2024-06-12',
        assigned_to: 'Maintenance Team',
        location: 'Room A-205'
      },
      {
        complaint_id: '2',
        category: 'mess',
        subject: 'Food quality issue',
        description: 'Food served in dinner was not fresh',
        priority: 'medium',
        status: 'resolved',
        submission_date: '2024-06-08',
        resolution_date: '2024-06-09',
        assigned_to: 'Mess Committee',
        location: 'Mess Hall'
      }
    ]);
  };

  const fetchVisitors = () => {
    setVisitors([
      {
        visitor_id: '1',
        visitor_name: 'Mr. Sharma',
        visitor_phone: '+91-9876543210',
        relationship: 'Father',
        visit_date: '2024-06-15',
        visit_time: '14:00',
        checkout_time: '17:00',
        purpose: 'Family visit',
        status: 'completed',
        approval_status: 'approved'
      },
      {
        visitor_id: '2',
        visitor_name: 'Priya Patel',
        visitor_phone: '+91-9876543211',
        relationship: 'Friend',
        visit_date: '2024-06-20',
        visit_time: '10:00',
        checkout_time: null,
        purpose: 'Academic discussion',
        status: 'pending',
        approval_status: 'pending'
      }
    ]);
  };

  const fetchMessBill = () => {
    setMessBill({
      month: 'June 2024',
      total_amount: 4500,
      paid_amount: 4500,
      pending_amount: 0,
      due_date: '2024-07-05',
      status: 'paid',
      breakdown: {
        monthly_charges: 4000,
        extra_meals: 300,
        guest_meals: 200,
        late_fee: 0
      },
      meal_count: {
        breakfast: 28,
        lunch: 30,
        dinner: 29,
        guest_meals: 4
      }
    });
  };

  const submitApplication = async () => {
    try {
      if (!applicationForm.hostel_preference_1 || !applicationForm.emergency_contact) {
        toast.error('Please fill all required fields');
        return;
      }

      if (!applicationForm.parent_consent) {
        toast.error('Parent consent is required');
        return;
      }

      const newApplication = {
        application_id: Date.now().toString(),
        application_date: new Date().toISOString().split('T')[0],
        ...applicationForm,
        status: 'pending',
        approval_date: null,
        allocated_hostel: null,
        allocated_room: null,
        remarks: null
      };

      setApplications(prev => [...prev, newApplication]);
      setShowApplicationModal(false);
      toast.success('Hostel application submitted successfully!');
      
      // Reset form
      setApplicationForm({
        hostel_preference_1: '',
        hostel_preference_2: '',
        hostel_preference_3: '',
        room_type: 'single',
        special_requirements: '',
        emergency_contact: '',
        parent_consent: false,
        medical_conditions: '',
        reason: ''
      });
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const submitComplaint = async () => {
    try {
      if (!complaintForm.subject || !complaintForm.description) {
        toast.error('Please fill all required fields');
        return;
      }

      const newComplaint = {
        complaint_id: Date.now().toString(),
        ...complaintForm,
        status: 'submitted',
        submission_date: new Date().toISOString().split('T')[0],
        expected_resolution: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assigned_to: 'Support Team',
        location: myAllocation?.room_number || 'Not specified'
      };

      setComplaints(prev => [...prev, newComplaint]);
      setShowComplaintModal(false);
      toast.success('Complaint submitted successfully!');
      
      // Reset form
      setComplaintForm({
        category: 'maintenance',
        priority: 'medium',
        subject: '',
        description: '',
        location: '',
        attachments: []
      });
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  const submitVisitorRequest = async () => {
    try {
      if (!visitorForm.visitor_name || !visitorForm.visitor_phone || !visitorForm.visit_date) {
        toast.error('Please fill all required fields');
        return;
      }

      const newVisitor = {
        visitor_id: Date.now().toString(),
        ...visitorForm,
        status: 'pending',
        approval_status: 'pending',
        checkout_time: null
      };

      setVisitors(prev => [...prev, newVisitor]);
      setShowVisitorModal(false);
      toast.success('Visitor request submitted successfully!');
      
      // Reset form
      setVisitorForm({
        visitor_name: '',
        visitor_phone: '',
        visitor_id: '',
        relationship: '',
        visit_date: '',
        visit_time: '',
        duration: '2',
        purpose: '',
        approval_required: true
      });
    } catch (error) {
      toast.error('Failed to submit visitor request');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      in_progress: 'info',
      resolved: 'success',
      submitted: 'primary',
      completed: 'success'
    };
    return variants[status] || 'secondary';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'danger',
      medium: 'warning',
      low: 'info'
    };
    return colors[priority] || 'secondary';
  };

  const getOccupancyPercentage = (occupied, total) => {
    return Math.round((occupied / total) * 100);
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
              <i className="fas fa-building text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Hostel Management</h2>
                <small className="text-muted">Complete hostel accommodation and services management</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              {!myAllocation && (
                <Button variant="primary" onClick={() => setShowApplicationModal(true)}>
                  <i className="fas fa-plus me-2"></i>
                  Apply for Hostel
                </Button>
              )}
              {myAllocation && (
                <>
                  <Button variant="outline-warning" onClick={() => setShowComplaintModal(true)}>
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Lodge Complaint
                  </Button>
                  <Button variant="outline-info" onClick={() => setShowVisitorModal(true)}>
                    <i className="fas fa-user-plus me-2"></i>
                    Register Visitor
                  </Button>
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Current Allocation Status */}
      {myAllocation && (
        <Row className="mb-4">
          <Col>
            <Card className="border-success">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="fas fa-home me-2"></i>
                  My Current Allocation
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <div className="mb-2">
                      <strong>Hostel:</strong> {myAllocation.hostel_name}
                    </div>
                    <div className="mb-2">
                      <strong>Room:</strong> {myAllocation.room_number} ({myAllocation.room_type})
                    </div>
                    <div className="mb-2">
                      <strong>Floor:</strong> {myAllocation.floor} | <strong>Block:</strong> {myAllocation.block}
                    </div>
                    <div className="mb-2">
                      <strong>Allocation Date:</strong> {new Date(myAllocation.allocation_date).toLocaleDateString()}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <strong>Monthly Rent:</strong> ₹{myAllocation.rent.toLocaleString()}
                    </div>
                    <div className="mb-2">
                      <strong>Security Deposit:</strong> ₹{myAllocation.security_deposit.toLocaleString()}
                    </div>
                    <div className="mb-2">
                      <strong>Warden:</strong> {myAllocation.warden}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong> 
                      <Badge bg={getStatusBadge(myAllocation.status)} className="ms-2">
                        {myAllocation.status.toUpperCase()}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <strong>Roommate:</strong> {myAllocation.roommate || 'None'}
                    </div>
                    <div className="mb-2">
                      <strong>Room Condition:</strong> 
                      <Badge bg="info" className="ms-2">{myAllocation.room_condition}</Badge>
                    </div>
                    <div className="mb-2">
                      <strong>Last Maintenance:</strong> {new Date(myAllocation.last_maintenance).toLocaleDateString()}
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => {
                        setSelectedRoom(myAllocation);
                        setShowRoomDetailsModal(true);
                      }}
                    >
                      <i className="fas fa-info-circle me-1"></i>
                      Room Details
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabs for different sections */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="overview" title={
                  <span>
                    <i className="fas fa-building me-2"></i>
                    Hostels Overview
                  </span>
                }>
                  {/* Hostels Overview */}
                  <Row>
                    {hostels.map((hostel) => (
                      <Col md={6} lg={4} key={hostel.hostel_id} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm">
                          <Card.Header className={`bg-${hostel.type === 'boys' ? 'primary' : 'danger'} text-white`}>
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">{hostel.name}</h6>
                              <Badge bg="light" text="dark">
                                {hostel.type.toUpperCase()}
                              </Badge>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-1">
                                <span>Occupancy</span>
                                <span>{hostel.occupied_rooms}/{hostel.total_rooms}</span>
                              </div>
                              <ProgressBar 
                                now={getOccupancyPercentage(hostel.occupied_rooms, hostel.total_rooms)}
                                variant={getOccupancyPercentage(hostel.occupied_rooms, hostel.total_rooms) > 90 ? 'danger' : 'success'}
                              />
                            </div>

                            <div className="mb-3">
                              <strong>Room Types & Rent:</strong>
                              {Object.entries(hostel.room_types).map(([type, details]) => (
                                <div key={type} className="d-flex justify-content-between small">
                                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
                                  <span>₹{details.rent} ({details.available} available)</span>
                                </div>
                              ))}
                            </div>

                            <div className="mb-3">
                              <strong>Facilities:</strong>
                              <div className="mt-1">
                                {hostel.facilities.slice(0, 4).map((facility, index) => (
                                  <Badge key={index} bg="outline-secondary" className="me-1 mb-1">
                                    {facility}
                                  </Badge>
                                ))}
                                {hostel.facilities.length > 4 && (
                                  <Badge bg="outline-info">+{hostel.facilities.length - 4} more</Badge>
                                )}
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span><strong>Warden:</strong></span>
                                <span>{hostel.warden}</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span><strong>Contact:</strong></span>
                                <span>{hostel.contact}</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span><strong>Rating:</strong></span>
                                <span>
                                  <i className="fas fa-star text-warning"></i> {hostel.rating} ({hostel.reviews_count})
                                </span>
                              </div>
                            </div>

                            <Button 
                              variant="outline-primary" 
                              className="w-100"
                              onClick={() => {
                                setSelectedHostel(hostel);
                                setShowRoomDetailsModal(true);
                              }}
                            >
                              <i className="fas fa-info-circle me-2"></i>
                              View Details
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab>

                <Tab eventKey="applications" title={
                  <span>
                    <i className="fas fa-file-alt me-2"></i>
                    My Applications ({applications.length})
                  </span>
                }>
                  {/* Applications */}
                  {applications.length === 0 ? (
                    <Alert variant="info">
                      <i className="fas fa-info-circle me-2"></i>
                      No hostel applications found. Click "Apply for Hostel" to submit your application.
                    </Alert>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Application Date</th>
                          <th>Preferences</th>
                          <th>Room Type</th>
                          <th>Status</th>
                          <th>Allocation</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={app.application_id}>
                            <td>{new Date(app.application_date).toLocaleDateString()}</td>
                            <td>
                              <div>1. {app.hostel_preference_1}</div>
                              {app.hostel_preference_2 && <div>2. {app.hostel_preference_2}</div>}
                              {app.hostel_preference_3 && <div>3. {app.hostel_preference_3}</div>}
                            </td>
                            <td>
                              <Badge bg="info">{app.room_type}</Badge>
                            </td>
                            <td>
                              <Badge bg={getStatusBadge(app.status)}>
                                {app.status.toUpperCase()}
                              </Badge>
                              {app.approval_date && (
                                <div><small>Approved: {new Date(app.approval_date).toLocaleDateString()}</small></div>
                              )}
                            </td>
                            <td>
                              {app.allocated_hostel ? (
                                <div>
                                  <div className="fw-bold">{app.allocated_hostel}</div>
                                  <small>Room: {app.allocated_room}</small>
                                </div>
                              ) : (
                                <span className="text-muted">Not allocated</span>
                              )}
                            </td>
                            <td>{app.remarks || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                <Tab eventKey="complaints" title={
                  <span>
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Complaints ({complaints.length})
                  </span>
                }>
                  {/* Complaints */}
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Subject</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Expected Resolution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((complaint) => (
                        <tr key={complaint.complaint_id}>
                          <td>{new Date(complaint.submission_date).toLocaleDateString()}</td>
                          <td>
                            <Badge bg="secondary">{complaint.category}</Badge>
                          </td>
                          <td>
                            <div className="fw-bold">{complaint.subject}</div>
                            <small className="text-muted">{complaint.location}</small>
                          </td>
                          <td>
                            <Badge bg={getPriorityColor(complaint.priority)}>
                              {complaint.priority.toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusBadge(complaint.status)}>
                              {complaint.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td>{complaint.assigned_to}</td>
                          <td>
                            {complaint.expected_resolution ? 
                              new Date(complaint.expected_resolution).toLocaleDateString() : 
                              complaint.resolution_date ? 
                              `Resolved: ${new Date(complaint.resolution_date).toLocaleDateString()}` :
                              '-'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab>

                <Tab eventKey="visitors" title={
                  <span>
                    <i className="fas fa-users me-2"></i>
                    Visitors ({visitors.length})
                  </span>
                }>
                  {/* Visitors */}
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Visitor Name</th>
                        <th>Contact</th>
                        <th>Relationship</th>
                        <th>Visit Date & Time</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Approval</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((visitor) => (
                        <tr key={visitor.visitor_id}>
                          <td className="fw-bold">{visitor.visitor_name}</td>
                          <td>{visitor.visitor_phone}</td>
                          <td>
                            <Badge bg="info">{visitor.relationship}</Badge>
                          </td>
                          <td>
                            <div>{new Date(visitor.visit_date).toLocaleDateString()}</div>
                            <small>{visitor.visit_time} - {visitor.checkout_time || 'Ongoing'}</small>
                          </td>
                          <td>{visitor.purpose}</td>
                          <td>
                            <Badge bg={getStatusBadge(visitor.status)}>
                              {visitor.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusBadge(visitor.approval_status)}>
                              {visitor.approval_status.toUpperCase()}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab>

                {myAllocation && (
                  <Tab eventKey="mess" title={
                    <span>
                      <i className="fas fa-utensils me-2"></i>
                      Mess Bill
                    </span>
                  }>
                    {/* Mess Bill */}
                    <Row>
                      <Col md={6}>
                        <Card className="mb-3">
                          <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">Current Month Bill - {messBill.month}</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Monthly Charges:</span>
                              <span>₹{messBill.breakdown?.monthly_charges.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Extra Meals:</span>
                              <span>₹{messBill.breakdown?.extra_meals.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Guest Meals:</span>
                              <span>₹{messBill.breakdown?.guest_meals.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Late Fee:</span>
                              <span>₹{messBill.breakdown?.late_fee.toLocaleString()}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                              <span>Total Amount:</span>
                              <span>₹{messBill.total_amount?.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Paid Amount:</span>
                              <span className="text-success">₹{messBill.paid_amount?.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Pending:</span>
                              <span className={messBill.pending_amount > 0 ? 'text-danger' : 'text-success'}>
                                ₹{messBill.pending_amount?.toLocaleString()}
                              </span>
                            </div>
                            <div className="mt-3">
                              <Badge bg={getStatusBadge(messBill.status)} className="w-100 p-2">
                                {messBill.status?.toUpperCase()}
                              </Badge>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="mb-3">
                          <Card.Header className="bg-info text-white">
                            <h6 className="mb-0">Meal Count - {messBill.month}</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Breakfast:</span>
                              <span>{messBill.meal_count?.breakfast} meals</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Lunch:</span>
                              <span>{messBill.meal_count?.lunch} meals</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Dinner:</span>
                              <span>{messBill.meal_count?.dinner} meals</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Guest Meals:</span>
                              <span>{messBill.meal_count?.guest_meals} meals</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                              <span>Total Meals:</span>
                              <span>
                                {(messBill.meal_count?.breakfast + messBill.meal_count?.lunch + 
                                  messBill.meal_count?.dinner + messBill.meal_count?.guest_meals)} meals
                              </span>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab>
                )}
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Application Modal */}
      <Modal show={showApplicationModal} onHide={() => setShowApplicationModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus me-2"></i>
            Apply for Hostel Accommodation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>First Preference *</Form.Label>
                  <Form.Select
                    value={applicationForm.hostel_preference_1}
                    onChange={(e) => setApplicationForm({...applicationForm, hostel_preference_1: e.target.value})}
                    required
                  >
                    <option value="">Select Hostel</option>
                    {hostels.map(hostel => (
                      <option key={hostel.hostel_id} value={hostel.name}>
                        {hostel.name} ({hostel.type})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Second Preference</Form.Label>
                  <Form.Select
                    value={applicationForm.hostel_preference_2}
                    onChange={(e) => setApplicationForm({...applicationForm, hostel_preference_2: e.target.value})}
                  >
                    <option value="">Select Hostel</option>
                    {hostels.map(hostel => (
                      <option key={hostel.hostel_id} value={hostel.name}>
                        {hostel.name} ({hostel.type})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Third Preference</Form.Label>
                  <Form.Select
                    value={applicationForm.hostel_preference_3}
                    onChange={(e) => setApplicationForm({...applicationForm, hostel_preference_3: e.target.value})}
                  >
                    <option value="">Select Hostel</option>
                    {hostels.map(hostel => (
                      <option key={hostel.hostel_id} value={hostel.name}>
                        {hostel.name} ({hostel.type})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Type Preference</Form.Label>
                  <Form.Select
                    value={applicationForm.room_type}
                    onChange={(e) => setApplicationForm({...applicationForm, room_type: e.target.value})}
                  >
                    <option value="single">Single Room</option>
                    <option value="double">Double Room</option>
                    <option value="triple">Triple Room</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Emergency Contact *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={applicationForm.emergency_contact}
                    onChange={(e) => setApplicationForm({...applicationForm, emergency_contact: e.target.value})}
                    placeholder="+91-XXXXXXXXXX"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Special Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={applicationForm.special_requirements}
                onChange={(e) => setApplicationForm({...applicationForm, special_requirements: e.target.value})}
                placeholder="Any special requirements or medical conditions..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Hostel Application</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={applicationForm.reason}
                onChange={(e) => setApplicationForm({...applicationForm, reason: e.target.value})}
                placeholder="Why do you need hostel accommodation?"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="I have parent/guardian consent for hostel accommodation"
                checked={applicationForm.parent_consent}
                onChange={(e) => setApplicationForm({...applicationForm, parent_consent: e.target.checked})}
                required
              />
            </Form.Group>

            <Alert variant="info">
              <i className="fas fa-info-circle me-2"></i>
              Application processing may take 3-5 working days. You will be notified via email and SMS.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApplicationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitApplication}>
            <i className="fas fa-paper-plane me-2"></i>
            Submit Application
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Complaint Modal */}
      <Modal show={showComplaintModal} onHide={() => setShowComplaintModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-exclamation-circle me-2"></i>
            Lodge Complaint
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({...complaintForm, category: e.target.value})}
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="cleanliness">Cleanliness</option>
                    <option value="mess">Mess</option>
                    <option value="security">Security</option>
                    <option value="facilities">Facilities</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={complaintForm.priority}
                    onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Control
                type="text"
                value={complaintForm.subject}
                onChange={(e) => setComplaintForm({...complaintForm, subject: e.target.value})}
                placeholder="Brief description of the issue"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Detailed Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                placeholder="Provide detailed information about the complaint..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specific Location</Form.Label>
              <Form.Control
                type="text"
                value={complaintForm.location}
                onChange={(e) => setComplaintForm({...complaintForm, location: e.target.value})}
                placeholder="e.g., Room A-205, Common Room, Mess Hall"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Attachments (Optional)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*,.pdf"
              />
              <Form.Text className="text-muted">
                Upload photos or documents related to the complaint
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowComplaintModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={submitComplaint}>
            <i className="fas fa-exclamation-circle me-2"></i>
            Submit Complaint
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Visitor Registration Modal */}
      <Modal show={showVisitorModal} onHide={() => setShowVisitorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user-plus me-2"></i>
            Register Visitor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Visitor Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={visitorForm.visitor_name}
                    onChange={(e) => setVisitorForm({...visitorForm, visitor_name: e.target.value})}
                    placeholder="Full name of visitor"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={visitorForm.visitor_phone}
                    onChange={(e) => setVisitorForm({...visitorForm, visitor_phone: e.target.value})}
                    placeholder="+91-XXXXXXXXXX"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ID Proof Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={visitorForm.visitor_id}
                    onChange={(e) => setVisitorForm({...visitorForm, visitor_id: e.target.value})}
                    placeholder="Aadhar/PAN/Driving License"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Relationship</Form.Label>
                  <Form.Select
                    value={visitorForm.relationship}
                    onChange={(e) => setVisitorForm({...visitorForm, relationship: e.target.value})}
                  >
                    <option value="">Select Relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Friend">Friend</option>
                    <option value="Relative">Relative</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Visit Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={visitorForm.visit_date}
                    onChange={(e) => setVisitorForm({...visitorForm, visit_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Visit Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={visitorForm.visit_time}
                    onChange={(e) => setVisitorForm({...visitorForm, visit_time: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (hours)</Form.Label>
                  <Form.Select
                    value={visitorForm.duration}
                    onChange={(e) => setVisitorForm({...visitorForm, duration: e.target.value})}
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="6">6 hours</option>
                    <option value="8">8 hours</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Purpose of Visit</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={visitorForm.purpose}
                onChange={(e) => setVisitorForm({...visitorForm, purpose: e.target.value})}
                placeholder="Reason for the visit..."
              />
            </Form.Group>

            <Alert variant="warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Visitor registration requires warden approval. Please ensure you inform your visitor about hostel rules and timings.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVisitorModal(false)}>
            Cancel
          </Button>
          <Button variant="info" onClick={submitVisitorRequest}>
            <i className="fas fa-user-plus me-2"></i>
            Register Visitor
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Room/Hostel Details Modal */}
      <Modal show={showRoomDetailsModal} onHide={() => setShowRoomDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-info-circle me-2"></i>
            {selectedRoom ? 'Room Details' : 'Hostel Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom ? (
            /* Room Details */
            <div>
              <Row>
                <Col md={6}>
                  <h6>Room Information</h6>
                  <div className="mb-2"><strong>Room Number:</strong> {selectedRoom.room_number}</div>
                  <div className="mb-2"><strong>Room Type:</strong> {selectedRoom.room_type}</div>
                  <div className="mb-2"><strong>Floor:</strong> {selectedRoom.floor}</div>
                  <div className="mb-2"><strong>Block:</strong> {selectedRoom.block}</div>
                  <div className="mb-2"><strong>Monthly Rent:</strong> ₹{selectedRoom.rent.toLocaleString()}</div>
                  <div className="mb-2"><strong>Security Deposit:</strong> ₹{selectedRoom.security_deposit.toLocaleString()}</div>
                </Col>
                <Col md={6}>
                  <h6>Facilities in Room</h6>
                  {selectedRoom.facilities_in_room?.map((facility, index) => (
                    <Badge key={index} bg="outline-primary" className="me-1 mb-1">
                      {facility}
                    </Badge>
                  ))}
                  
                  <div className="mt-3">
                    <div className="mb-2"><strong>Room Condition:</strong> 
                      <Badge bg="info" className="ms-2">{selectedRoom.room_condition}</Badge>
                    </div>
                    <div className="mb-2"><strong>Last Maintenance:</strong> {new Date(selectedRoom.last_maintenance).toLocaleDateString()}</div>
                  </div>
                </Col>
              </Row>

              {roommates.length > 0 && (
                <div className="mt-4">
                  <h6>Roommate Information</h6>
                  {roommates.map((roommate, index) => (
                    <Card key={index} className="mb-2">
                      <Card.Body className="py-2">
                        <Row>
                          <Col md={6}>
                            <div><strong>{roommate.name}</strong></div>
                            <small className="text-muted">{roommate.student_id}</small>
                          </Col>
                          <Col md={3}>
                            <div>{roommate.branch}</div>
                            <small className="text-muted">Year {roommate.year}</small>
                          </Col>
                          <Col md={3}>
                            <div>{roommate.contact}</div>
                            <small className="text-muted">{roommate.hometown}</small>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : selectedHostel ? (
            /* Hostel Details */
            <div>
              <Row>
                <Col md={6}>
                  <h6>Hostel Information</h6>
                  <div className="mb-2"><strong>Name:</strong> {selectedHostel.name}</div>
                  <div className="mb-2"><strong>Type:</strong> {selectedHostel.type}</div>
                  <div className="mb-2"><strong>Total Rooms:</strong> {selectedHostel.total_rooms}</div>
                  <div className="mb-2"><strong>Available Rooms:</strong> {selectedHostel.available_rooms}</div>
                  <div className="mb-2"><strong>Warden:</strong> {selectedHostel.warden}</div>
                  <div className="mb-2"><strong>Contact:</strong> {selectedHostel.contact}</div>
                  <div className="mb-2"><strong>Location:</strong> {selectedHostel.location}</div>
                  <div className="mb-2"><strong>Rating:</strong> 
                    <span className="ms-2">
                      <i className="fas fa-star text-warning"></i> {selectedHostel.rating} ({selectedHostel.reviews_count} reviews)
                    </span>
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Room Types & Pricing</h6>
                  {Object.entries(selectedHostel.room_types).map(([type, details]) => (
                    <div key={type} className="mb-2 p-2 border rounded">
                      <div className="d-flex justify-content-between">
                        <strong>{type.charAt(0).toUpperCase() + type.slice(1)} Room</strong>
                        <span>₹{details.rent}/month</span>
                      </div>
                      <small className="text-muted">
                        {details.count} total rooms, {details.available} available
                      </small>
                    </div>
                  ))}
                </Col>
              </Row>

              <div className="mt-4">
                <h6>Facilities</h6>
                <div>
                  {selectedHostel.facilities.map((facility, index) => (
                    <Badge key={index} bg="outline-primary" className="me-2 mb-2">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h6>Mess Timings</h6>
                <Row>
                  {Object.entries(selectedHostel.mess_timings).map(([meal, timing]) => (
                    <Col md={6} key={meal}>
                      <div className="mb-2">
                        <strong>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</strong> {timing}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              <div className="mt-4">
                <h6>Hostel Rules</h6>
                <ul>
                  {selectedHostel.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoomDetailsModal(false)}>
            Close
          </Button>
          {selectedHostel && !myAllocation && (
            <Button variant="primary" onClick={() => {
              setShowRoomDetailsModal(false);
              setApplicationForm({...applicationForm, hostel_preference_1: selectedHostel.name});
              setShowApplicationModal(true);
            }}>
              <i className="fas fa-plus me-2"></i>
              Apply for This Hostel
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default HostelManagement;
