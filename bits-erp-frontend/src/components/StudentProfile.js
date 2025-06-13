import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Table, Modal, Alert, Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [academicHistory, setAcademicHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [editForm, setEditForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: '',
    category: 'academic',
    certificate: null
  });

  useEffect(() => {
    fetchProfile();
    fetchAcademicHistory();
    fetchAchievements();
    fetchActivities();
    fetchDocuments();
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Enhanced mock profile data
      const mockProfile = {
        student_id: user?.student_id || '2021A7PS001P',
        first_name: 'Arjun',
        last_name: 'Sharma',
        email: user?.email || 'arjun.sharma@bits-pilani.ac.in',
        phone: '+919876543210',
        date_of_birth: '2003-05-15',
        gender: 'Male',
        nationality: 'Indian',
        blood_group: 'O+',
        campus: 'Pilani',
        branch: 'Computer Science',
        batch_year: 2021,
        current_semester: 6,
        admission_date: '2021-08-01',
        expected_graduation: '2025-05-31',
        cgpa: 8.5,
        credits_completed: 96,
        total_credits_required: 120,
        attendance_percentage: 92,
        address: {
          permanent: '123 Main Street, New Delhi, India - 110001',
          current: 'Hostel Room A-205, BITS Pilani, Rajasthan - 333031'
        },
        emergency_contact: {
          name: 'Mr. Rajesh Sharma',
          relationship: 'Father',
          phone: '+919876543211',
          email: 'rajesh.sharma@email.com'
        },
        parent_details: {
          father_name: 'Mr. Rajesh Sharma',
          father_occupation: 'Software Engineer',
          mother_name: 'Mrs. Priya Sharma',
          mother_occupation: 'Teacher',
          annual_income: '15,00,000'
        },
        academic_status: 'Regular',
        fee_status: 'Paid',
        hostel_details: {
          hostel_name: 'Vivekananda Bhawan',
          room_number: 'A-205',
          roommate: 'Rahul Kumar'
        },
        profile_completion: 85,
        last_updated: '2025-06-01'
      };
      
      setProfile(mockProfile);
      setEditForm(mockProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicHistory = () => {
    const mockHistory = [
      {
        semester: 1,
        year: 2021,
        semester_type: 'monsoon',
        sgpa: 8.2,
        credits: 20,
        status: 'completed'
      },
      {
        semester: 2,
        year: 2022,
        semester_type: 'spring',
        sgpa: 8.4,
        credits: 18,
        status: 'completed'
      },
      {
        semester: 3,
        year: 2022,
        semester_type: 'monsoon',
        sgpa: 8.6,
        credits: 19,
        status: 'completed'
      },
      {
        semester: 4,
        year: 2023,
        semester_type: 'spring',
        sgpa: 8.3,
        credits: 17,
        status: 'completed'
      },
      {
        semester: 5,
        year: 2023,
        semester_type: 'monsoon',
        sgpa: 8.7,
        credits: 22,
        status: 'completed'
      },
      {
        semester: 6,
        year: 2024,
        semester_type: 'spring',
        sgpa: 0,
        credits: 0,
        status: 'ongoing'
      }
    ];
    setAcademicHistory(mockHistory);
  };

  const fetchAchievements = () => {
    const mockAchievements = [
      {
        id: 1,
        title: 'Dean\'s List',
        description: 'Achieved Dean\'s List for academic excellence in Semester 5',
        date: '2023-12-15',
        category: 'academic',
        certificate: 'deans_list_2023.pdf'
      },
      {
        id: 2,
        title: 'Best Project Award',
        description: 'Won best project award for Database Management System project',
        date: '2024-04-20',
        category: 'project',
        certificate: 'best_project_2024.pdf'
      },
      {
        id: 3,
        title: 'Coding Competition Winner',
        description: 'First place in inter-college coding competition',
        date: '2024-02-10',
        category: 'competition',
        certificate: 'coding_competition_2024.pdf'
      }
    ];
    setAchievements(mockAchievements);
  };

  const fetchActivities = () => {
    const mockActivities = [
      {
        id: 1,
        activity: 'Coding Club',
        role: 'Secretary',
        start_date: '2022-08-01',
        end_date: null,
        description: 'Organizing coding workshops and competitions'
      },
      {
        id: 2,
        activity: 'Photography Society',
        role: 'Member',
        start_date: '2021-09-01',
        end_date: '2023-05-31',
        description: 'Campus photography and event coverage'
      },
      {
        id: 3,
        activity: 'NSS Volunteer',
        role: 'Volunteer',
        start_date: '2022-01-01',
        end_date: null,
        description: 'Community service and social work'
      }
    ];
    setActivities(mockActivities);
  };

  const fetchDocuments = () => {
    const mockDocuments = [
      {
        id: 1,
        name: 'Admission Letter',
        type: 'admission',
        uploaded_date: '2021-08-01',
        file_size: '2.3 MB',
        status: 'verified'
      },
      {
        id: 2,
        name: 'Class 12 Marksheet',
        type: 'academic',
        uploaded_date: '2021-08-01',
        file_size: '1.8 MB',
        status: 'verified'
      },
      {
        id: 3,
        name: 'Identity Proof',
        type: 'identity',
        uploaded_date: '2021-08-01',
        file_size: '1.2 MB',
        status: 'verified'
      },
      {
        id: 4,
        name: 'Medical Certificate',
        type: 'medical',
        uploaded_date: '2021-08-01',
        file_size: '0.9 MB',
        status: 'pending'
      }
    ];
    setDocuments(mockDocuments);
  };

  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(editForm);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchievement.title || !newAchievement.date) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const achievement = {
        id: achievements.length + 1,
        ...newAchievement
      };
      
      setAchievements(prev => [...prev, achievement]);
      setShowAchievementModal(false);
      setNewAchievement({
        title: '',
        description: '',
        date: '',
        category: 'academic',
        certificate: null
      });
      toast.success('Achievement added successfully!');
    } catch (error) {
      toast.error('Failed to add achievement');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      verified: 'success',
      pending: 'warning',
      rejected: 'danger',
      completed: 'success',
      ongoing: 'primary'
    };
    return variants[status] || 'secondary';
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'primary',
      project: 'success',
      competition: 'warning',
      extracurricular: 'info'
    };
    return colors[category] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
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
              <div 
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                style={{ width: '60px', height: '60px', fontSize: '1.5rem', fontWeight: 'bold' }}
              >
                {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
              </div>
              <div>
                <h2 className="mb-0 text-primary">{profile.first_name} {profile.last_name}</h2>
                <small className="text-muted">{profile.student_id} • {profile.branch} • Batch {profile.batch_year}</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => setShowPasswordModal(true)}>
                <i className="fas fa-key me-2"></i>
                Change Password
              </Button>
              <Button 
                variant={editing ? "success" : "primary"} 
                onClick={editing ? handleSaveProfile : () => setEditing(true)}
              >
                <i className={`fas ${editing ? 'fa-save' : 'fa-edit'} me-2`}></i>
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Profile Completion */}
      <Row className="mb-4">
        <Col>
          <Card className="border-info">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Profile Completion</h6>
                <span className="fw-bold">{profile.profile_completion}%</span>
              </div>
              <ProgressBar 
                now={profile.profile_completion} 
                variant={profile.profile_completion >= 80 ? 'success' : 'warning'}
              />
              <small className="text-muted">
                Complete your profile to unlock all features and improve your experience.
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="personal" title={
          <span>
            <i className="fas fa-user me-2"></i>
            Personal Information
          </span>
        }>
          <Row>
            <Col md={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Basic Information</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={editing ? editForm.first_name : profile.first_name}
                            onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={editing ? editForm.last_name : profile.last_name}
                            onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={profile.email}
                            disabled
                          />
                          <Form.Text className="text-muted">
                            Email cannot be changed. Contact admin if needed.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            value={editing ? editForm.phone : profile.phone}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            value={editing ? editForm.date_of_birth : profile.date_of_birth}
                            onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            value={editing ? editForm.gender : profile.gender}
                            onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                            disabled={!editing}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Blood Group</Form.Label>
                          <Form.Select
                            value={editing ? editForm.blood_group : profile.blood_group}
                            onChange={(e) => setEditForm({...editForm, blood_group: e.target.value})}
                            disabled={!editing}
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Permanent Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={editing ? editForm.address?.permanent : profile.address?.permanent}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          address: {...editForm.address, permanent: e.target.value}
                        })}
                        disabled={!editing}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Current Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={editing ? editForm.address?.current : profile.address?.current}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          address: {...editForm.address, current: e.target.value}
                        })}
                        disabled={!editing}
                      />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>

              {/* Emergency Contact */}
              <Card className="mt-4">
                <Card.Header>
                  <h5 className="mb-0">Emergency Contact</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={editing ? editForm.emergency_contact?.name : profile.emergency_contact?.name}
                          onChange={(e) => setEditForm({
                            ...editForm, 
                            emergency_contact: {...editForm.emergency_contact, name: e.target.value}
                          })}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Relationship</Form.Label>
                        <Form.Control
                          type="text"
                          value={editing ? editForm.emergency_contact?.relationship : profile.emergency_contact?.relationship}
                          onChange={(e) => setEditForm({
                            ...editForm, 
                            emergency_contact: {...editForm.emergency_contact, relationship: e.target.value}
                          })}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          value={editing ? editForm.emergency_contact?.phone : profile.emergency_contact?.phone}
                          onChange={(e) => setEditForm({
                            ...editForm, 
                            emergency_contact: {...editForm.emergency_contact, phone: e.target.value}
                          })}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={editing ? editForm.emergency_contact?.email : profile.emergency_contact?.email}
                          onChange={(e) => setEditForm({
                            ...editForm, 
                            emergency_contact: {...editForm.emergency_contact, email: e.target.value}
                          })}
                          disabled={!editing}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              {/* Academic Summary */}
              <Card className="mb-4">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0">Academic Summary</h6>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <h3 className="text-primary">{profile.cgpa}</h3>
                    <small className="text-muted">Current CGPA</small>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Credits Completed:</span>
                      <span>{profile.credits_completed}/{profile.total_credits_required}</span>
                    </div>
                    <ProgressBar 
                      now={(profile.credits_completed / profile.total_credits_required) * 100}
                      variant="success"
                      className="mt-1"
                      style={{ height: '6px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Attendance:</span>
                      <span>{profile.attendance_percentage}%</span>
                    </div>
                    <ProgressBar 
                      now={profile.attendance_percentage}
                      variant={profile.attendance_percentage >= 75 ? 'success' : 'danger'}
                      className="mt-1"
                      style={{ height: '6px' }}
                    />
                  </div>

                  <div className="small">
                    <div className="d-flex justify-content-between">
                      <span>Campus:</span>
                      <span>{profile.campus}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Branch:</span>
                      <span>{profile.branch}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Semester:</span>
                      <span>{profile.current_semester}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Expected Graduation:</span>
                      <span>{new Date(profile.expected_graduation).getFullYear()}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Status Cards */}
              <Card className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Academic Status:</span>
                    <Badge bg="success">{profile.academic_status}</Badge>
                  </div>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Fee Status:</span>
                    <Badge bg="success">{profile.fee_status}</Badge>
                  </div>
                </Card.Body>
              </Card>

              {profile.hostel_details && (
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">Hostel Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="small">
                      <div className="d-flex justify-content-between">
                        <span>Hostel:</span>
                        <span>{profile.hostel_details.hostel_name}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Room:</span>
                        <span>{profile.hostel_details.room_number}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Roommate:</span>
                        <span>{profile.hostel_details.roommate}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="academic" title={
          <span>
            <i className="fas fa-graduation-cap me-2"></i>
            Academic History
          </span>
        }>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Semester-wise Performance</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Academic Year</th>
                    <th>Type</th>
                    <th>SGPA</th>
                    <th>Credits</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {academicHistory.map((record) => (
                    <tr key={`${record.semester}-${record.year}`}>
                      <td className="fw-bold">{record.semester}</td>
                      <td>{record.year}</td>
                      <td>
                        <Badge bg="info">
                          {record.semester_type.charAt(0).toUpperCase() + record.semester_type.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        {record.sgpa > 0 ? (
                          <Badge bg={record.sgpa >= 8 ? 'success' : record.sgpa >= 7 ? 'primary' : 'warning'}>
                            {record.sgpa.toFixed(1)}
                          </Badge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>{record.credits}</td>
                      <td>
                        <Badge bg={getStatusBadge(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="achievements" title={
          <span>
            <i className="fas fa-trophy me-2"></i>
            Achievements ({achievements.length})
          </span>
        }>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>My Achievements</h5>
            <Button variant="primary" onClick={() => setShowAchievementModal(true)}>
              <i className="fas fa-plus me-2"></i>
              Add Achievement
            </Button>
          </div>

          <Row>
            {achievements.map((achievement) => (
              <Col md={6} lg={4} key={achievement.id} className="mb-3">
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <Badge bg={getCategoryColor(achievement.category)}>
                      {achievement.category}
                    </Badge>
                    <small className="text-muted">
                      {new Date(achievement.date).toLocaleDateString()}
                    </small>
                  </Card.Header>
                  <Card.Body>
                    <h6 className="fw-bold">{achievement.title}</h6>
                    <p className="small text-muted">{achievement.description}</p>
                    {achievement.certificate && (
                      <Button variant="outline-primary" size="sm">
                        <i className="fas fa-certificate me-1"></i>
                        View Certificate
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="activities" title={
          <span>
            <i className="fas fa-users me-2"></i>
            Activities ({activities.length})
          </span>
        }>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Extracurricular Activities</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Role</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="fw-bold">{activity.activity}</td>
                      <td>
                        <Badge bg="primary">{activity.role}</Badge>
                      </td>
                      <td>
                        <div>{new Date(activity.start_date).toLocaleDateString()}</div>
                        <small className="text-muted">
                          to {activity.end_date ? new Date(activity.end_date).toLocaleDateString() : 'Present'}
                        </small>
                      </td>
                      <td>{activity.description}</td>
                      <td>
                        <Badge bg={activity.end_date ? 'secondary' : 'success'}>
                          {activity.end_date ? 'Completed' : 'Active'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="documents" title={
          <span>
            <i className="fas fa-file-alt me-2"></i>
            Documents ({documents.length})
          </span>
        }>
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Document Repository</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Upload Date</th>
                    <th>File Size</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="fw-bold">{doc.name}</td>
                      <td>
                        <Badge bg="secondary">{doc.type}</Badge>
                      </td>
                      <td>{new Date(doc.uploaded_date).toLocaleDateString()}</td>
                      <td>{doc.file_size}</td>
                      <td>
                        <Badge bg={getStatusBadge(doc.status)}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button variant="outline-primary" size="sm">
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button variant="outline-success" size="sm">
                            <i className="fas fa-download"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-key me-2"></i>
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                placeholder="Enter current password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                placeholder="Enter new password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            <i className="fas fa-save me-2"></i>
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Achievement Modal */}
      <Modal show={showAchievementModal} onHide={() => setShowAchievementModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-trophy me-2"></i>
            Add Achievement
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={newAchievement.title}
                onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                placeholder="Achievement title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newAchievement.description}
                onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                placeholder="Describe your achievement"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={newAchievement.date}
                    onChange={(e) => setNewAchievement({...newAchievement, date: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newAchievement.category}
                    onChange={(e) => setNewAchievement({...newAchievement, category: e.target.value})}
                  >
                    <option value="academic">Academic</option>
                    <option value="project">Project</option>
                    <option value="competition">Competition</option>
                    <option value="extracurricular">Extracurricular</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Certificate (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setNewAchievement({...newAchievement, certificate: e.target.files[0]})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAchievementModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAchievement}>
            <i className="fas fa-plus me-2"></i>
            Add Achievement
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default StudentProfile;
