import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, Tabs, Tab, InputGroup, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function StudentManagement() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    campus: 'all',
    branch: 'all',
    batch: 'all',
    status: 'all',
    semester: 'all'
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [bulkAction, setBulkAction] = useState('');
  const [studentStats, setStudentStats] = useState({});

  const [newStudent, setNewStudent] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    campus: '',
    branch: '',
    batch_year: new Date().getFullYear(),
    current_semester: 1,
    date_of_birth: '',
    gender: '',
    nationality: 'Indian',
    address: '',
    emergency_contact: '',
    blood_group: '',
    admission_type: 'regular',
    fee_category: 'general'
  });

  useEffect(() => {
    fetchStudents();
    fetchStudentStats();
  }, []);

  const fetchStudents = async () => {
    try {
      // Enhanced mock data with more comprehensive student information
      setStudents([
        {
          student_id: '2021A7PS001P',
          first_name: 'Arjun',
          last_name: 'Sharma',
          email: 'arjun.sharma@bits-pilani.ac.in',
          phone: '+919876543210',
          campus: 'Pilani',
          branch: 'Computer Science',
          batch_year: 2021,
          current_semester: 6,
          cgpa: 8.5,
          attendance_percentage: 92,
          status: 'active',
          date_of_birth: '2003-05-15',
          gender: 'Male',
          nationality: 'Indian',
          address: '123 Main Street, New Delhi, India',
          emergency_contact: '+919876543211',
          blood_group: 'O+',
          admission_type: 'regular',
          fee_category: 'general',
          enrollment_date: '2021-08-01',
          total_credits: 96,
          pending_backlogs: 0,
          disciplinary_actions: 0,
          achievements: ['Dean\'s List 2023', 'Best Project Award'],
          extracurricular: ['Coding Club', 'Photography Society']
        },
        {
          student_id: '2021A1PS002P',
          first_name: 'Priya',
          last_name: 'Patel',
          email: 'priya.patel@bits-pilani.ac.in',
          phone: '+918765432109',
          campus: 'Pilani',
          branch: 'Electronics & Communication',
          batch_year: 2021,
          current_semester: 6,
          cgpa: 9.1,
          attendance_percentage: 95,
          status: 'active',
          date_of_birth: '2003-03-22',
          gender: 'Female',
          nationality: 'Indian',
          address: '456 Park Avenue, Mumbai, India',
          emergency_contact: '+918765432110',
          blood_group: 'A+',
          admission_type: 'regular',
          fee_category: 'general',
          enrollment_date: '2021-08-01',
          total_credits: 98,
          pending_backlogs: 0,
          disciplinary_actions: 0,
          achievements: ['Gold Medalist', 'Research Excellence Award'],
          extracurricular: ['Robotics Club', 'Dance Society']
        },
        {
          student_id: '2022A3PS003G',
          first_name: 'Rahul',
          last_name: 'Kumar',
          email: 'rahul.kumar@bits-pilani.ac.in',
          phone: '+917654321098',
          campus: 'Goa',
          branch: 'Mechanical Engineering',
          batch_year: 2022,
          current_semester: 4,
          cgpa: 7.8,
          attendance_percentage: 88,
          status: 'active',
          date_of_birth: '2004-01-10',
          gender: 'Male',
          nationality: 'Indian',
          address: '789 Beach Road, Goa, India',
          emergency_contact: '+917654321099',
          blood_group: 'B+',
          admission_type: 'regular',
          fee_category: 'general',
          enrollment_date: '2022-08-01',
          total_credits: 64,
          pending_backlogs: 1,
          disciplinary_actions: 0,
          achievements: ['Sports Excellence'],
          extracurricular: ['Football Team', 'Music Club']
        },
        {
          student_id: '2020A4PS004H',
          first_name: 'Sneha',
          last_name: 'Reddy',
          email: 'sneha.reddy@bits-pilani.ac.in',
          phone: '+916543210987',
          campus: 'Hyderabad',
          branch: 'Chemical Engineering',
          batch_year: 2020,
          current_semester: 8,
          cgpa: 8.9,
          attendance_percentage: 93,
          status: 'active',
          date_of_birth: '2002-11-30',
          gender: 'Female',
          nationality: 'Indian',
          address: '321 Tech City, Hyderabad, India',
          emergency_contact: '+916543210988',
          blood_group: 'AB+',
          admission_type: 'regular',
          fee_category: 'general',
          enrollment_date: '2020-08-01',
          total_credits: 128,
          pending_backlogs: 0,
          disciplinary_actions: 0,
          achievements: ['Research Publication', 'Innovation Award'],
          extracurricular: ['Literary Society', 'Environment Club']
        },
        {
          student_id: '2023A5PS005D',
          first_name: 'Ahmed',
          last_name: 'Al-Rashid',
          email: 'ahmed.alrashid@bits-pilani.ac.in',
          phone: '+971501234567',
          campus: 'Dubai',
          branch: 'Computer Science',
          batch_year: 2023,
          current_semester: 2,
          cgpa: 8.2,
          attendance_percentage: 90,
          status: 'active',
          date_of_birth: '2005-07-18',
          gender: 'Male',
          nationality: 'UAE',
          address: 'Dubai Silicon Oasis, UAE',
          emergency_contact: '+971501234568',
          blood_group: 'O-',
          admission_type: 'international',
          fee_category: 'international',
          enrollment_date: '2023-08-01',
          total_credits: 32,
          pending_backlogs: 0,
          disciplinary_actions: 0,
          achievements: ['International Student Excellence'],
          extracurricular: ['Cultural Club', 'Tech Society']
        }
      ]);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentStats = () => {
    setStudentStats({
      totalStudents: 2847,
      activeStudents: 2756,
      inactiveStudents: 91,
      averageCGPA: 7.8,
      averageAttendance: 89.5,
      totalBacklogs: 156,
      graduatingStudents: 712,
      newAdmissions: 734,
      campusDistribution: {
        Pilani: 1234,
        Goa: 856,
        Hyderabad: 567,
        Dubai: 190
      },
      branchDistribution: {
        'Computer Science': 856,
        'Electronics & Communication': 742,
        'Mechanical Engineering': 634,
        'Chemical Engineering': 615
      }
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedStudents = () => {
    let sortableStudents = [...getFilteredStudents()];
    if (sortConfig.key) {
      sortableStudents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  };

  const getFilteredStudents = () => {
    return students.filter(student => {
      const matchesSearch = 
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCampus = filters.campus === 'all' || student.campus === filters.campus;
      const matchesBranch = filters.branch === 'all' || student.branch === filters.branch;
      const matchesBatch = filters.batch === 'all' || student.batch_year.toString() === filters.batch;
      const matchesStatus = filters.status === 'all' || student.status === filters.status;
      const matchesSemester = filters.semester === 'all' || student.current_semester.toString() === filters.semester;
      
      return matchesSearch && matchesCampus && matchesBranch && matchesBatch && matchesStatus && matchesSemester;
    });
  };

  const handleAddStudent = async () => {
    try {
      if (!newStudent.student_id || !newStudent.first_name || !newStudent.last_name || !newStudent.email) {
        toast.error('Please fill all required fields');
        return;
      }

      // Check if student ID already exists
      if (students.find(s => s.student_id === newStudent.student_id)) {
        toast.error('Student ID already exists');
        return;
      }

      const studentToAdd = {
        ...newStudent,
        cgpa: 0,
        attendance_percentage: 0,
        status: 'active',
        enrollment_date: new Date().toISOString().split('T')[0],
        total_credits: 0,
        pending_backlogs: 0,
        disciplinary_actions: 0,
        achievements: [],
        extracurricular: []
      };

      setStudents(prev => [...prev, studentToAdd]);
      setShowModal(false);
      toast.success('Student added successfully!');
      
      // Reset form
      setNewStudent({
        student_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        campus: '',
        branch: '',
        batch_year: new Date().getFullYear(),
        current_semester: 1,
        date_of_birth: '',
        gender: '',
        nationality: 'Indian',
        address: '',
        emergency_contact: '',
        blood_group: '',
        admission_type: 'regular',
        fee_category: 'general'
      });
    } catch (error) {
      toast.error('Failed to add student');
    }
  };

  const handleBulkAction = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select students first');
      return;
    }

    if (!bulkAction) {
      toast.error('Please select an action');
      return;
    }

    try {
      switch (bulkAction) {
        case 'activate':
          setStudents(prev => prev.map(student => 
            selectedStudents.includes(student.student_id) 
              ? { ...student, status: 'active' }
              : student
          ));
          toast.success(`${selectedStudents.length} students activated`);
          break;
        
        case 'deactivate':
          setStudents(prev => prev.map(student => 
            selectedStudents.includes(student.student_id) 
              ? { ...student, status: 'inactive' }
              : student
          ));
          toast.success(`${selectedStudents.length} students deactivated`);
          break;
        
        case 'promote':
          setStudents(prev => prev.map(student => 
            selectedStudents.includes(student.student_id) 
              ? { ...student, current_semester: student.current_semester + 1 }
              : student
          ));
          toast.success(`${selectedStudents.length} students promoted`);
          break;
        
        case 'export':
          exportStudents(selectedStudents);
          break;
        
        default:
          toast.error('Invalid action');
      }
      
      setSelectedStudents([]);
      setBulkAction('');
      setShowBulkModal(false);
    } catch (error) {
      toast.error('Bulk action failed');
    }
  };

  const exportStudents = (studentIds) => {
    const studentsToExport = students.filter(s => studentIds.includes(s.student_id));
    const csvContent = [
      ['Student ID', 'Name', 'Email', 'Campus', 'Branch', 'Batch', 'CGPA', 'Status'].join(','),
      ...studentsToExport.map(s => [
        s.student_id,
        `${s.first_name} ${s.last_name}`,
        s.email,
        s.campus,
        s.branch,
        s.batch_year,
        s.cgpa,
        s.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success('Students exported successfully!');
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      inactive: 'secondary',
      suspended: 'danger',
      graduated: 'primary'
    };
    return variants[status] || 'secondary';
  };

  const getCGPAColor = (cgpa) => {
    if (cgpa >= 8.5) return 'success';
    if (cgpa >= 7.5) return 'primary';
    if (cgpa >= 6.5) return 'warning';
    return 'danger';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'success';
    if (attendance >= 80) return 'primary';
    if (attendance >= 75) return 'warning';
    return 'danger';
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(getFilteredStudents().map(s => s.student_id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId, checked) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading students...</span>
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
              <i className="fas fa-users text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Student Management</h2>
                <small className="text-muted">Comprehensive student information and management system</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-info" onClick={() => setShowBulkModal(true)}>
                <i className="fas fa-tasks me-2"></i>
                Bulk Actions
              </Button>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Add Student
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary h-100">
            <Card.Body>
              <i className="fas fa-users text-primary mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-primary">{studentStats.totalStudents?.toLocaleString()}</h4>
              <small className="text-muted">Total Students</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success h-100">
            <Card.Body>
              <i className="fas fa-user-check text-success mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-success">{studentStats.activeStudents?.toLocaleString()}</h4>
              <small className="text-muted">Active Students</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info h-100">
            <Card.Body>
              <i className="fas fa-chart-line text-info mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-info">{studentStats.averageCGPA}</h4>
              <small className="text-muted">Average CGPA</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <i className="fas fa-graduation-cap text-warning mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-warning">{studentStats.graduatingStudents}</h4>
              <small className="text-muted">Graduating</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="list" title={
          <span>
            <i className="fas fa-list me-2"></i>
            Student List ({getFilteredStudents().length})
          </span>
        }>
          {/* Filters */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-filter me-2"></i>
                Search & Filters
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Search Students</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fas fa-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by name, ID, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Campus</Form.Label>
                    <Form.Select
                      value={filters.campus}
                      onChange={(e) => setFilters({...filters, campus: e.target.value})}
                    >
                      <option value="all">All Campuses</option>
                      <option value="Pilani">Pilani</option>
                      <option value="Goa">Goa</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Dubai">Dubai</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Branch</Form.Label>
                    <Form.Select
                      value={filters.branch}
                      onChange={(e) => setFilters({...filters, branch: e.target.value})}
                    >
                      <option value="all">All Branches</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electronics & Communication">ECE</option>
                      <option value="Mechanical Engineering">Mechanical</option>
                      <option value="Chemical Engineering">Chemical</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Batch Year</Form.Label>
                    <Form.Select
                      value={filters.batch}
                      onChange={(e) => setFilters({...filters, batch: e.target.value})}
                    >
                      <option value="all">All Batches</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="graduated">Graduated</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Students Table */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-table me-2"></i>
                Students ({getSortedStudents().length})
              </h5>
              <div className="d-flex align-items-center gap-2">
                {selectedStudents.length > 0 && (
                  <Badge bg="primary">
                    {selectedStudents.length} selected
                  </Badge>
                )}
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={() => exportStudents(getSortedStudents().map(s => s.student_id))}
                >
                  <i className="fas fa-download me-1"></i>
                  Export All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {getSortedStudents().length === 0 ? (
                <Alert variant="info" className="m-3">
                  <i className="fas fa-info-circle me-2"></i>
                  No students found matching your search criteria.
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>
                        <Form.Check
                          type="checkbox"
                          checked={selectedStudents.length === getFilteredStudents().length && getFilteredStudents().length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th 
                        onClick={() => handleSort('student_id')}
                        style={{ cursor: 'pointer' }}
                      >
                        Student ID
                        {sortConfig.key === 'student_id' && (
                          <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('first_name')}
                        style={{ cursor: 'pointer' }}
                      >
                        Name
                        {sortConfig.key === 'first_name' && (
                          <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                        )}
                      </th>
                      <th>Contact</th>
                      <th>Academic Info</th>
                      <th 
                        onClick={() => handleSort('cgpa')}
                        style={{ cursor: 'pointer' }}
                      >
                        CGPA
                        {sortConfig.key === 'cgpa' && (
                          <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                        )}
                      </th>
                      <th>Attendance</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedStudents().map((student) => (
                      <tr key={student.student_id}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedStudents.includes(student.student_id)}
                            onChange={(e) => handleSelectStudent(student.student_id, e.target.checked)}
                          />
                        </td>
                        <td className="fw-bold">{student.student_id}</td>
                        <td>
                          <div className="fw-bold">{student.first_name} {student.last_name}</div>
                          <small className="text-muted">{student.gender} • {student.nationality}</small>
                        </td>
                        <td>
                          <div>{student.email}</div>
                          <small className="text-muted">{student.phone}</small>
                        </td>
                        <td>
                          <div>{student.campus} • {student.branch}</div>
                          <small className="text-muted">Batch {student.batch_year} • Sem {student.current_semester}</small>
                        </td>
                        <td>
                          <Badge bg={getCGPAColor(student.cgpa)}>
                            {student.cgpa.toFixed(1)}
                          </Badge>
                          <div className="mt-1">
                            <ProgressBar 
                              now={(student.cgpa / 10) * 100}
                              variant={getCGPAColor(student.cgpa)}
                              style={{ height: '4px' }}
                            />
                          </div>
                        </td>
                        <td>
                          <Badge bg={getAttendanceColor(student.attendance_percentage)}>
                            {student.attendance_percentage}%
                          </Badge>
                          <div className="mt-1">
                            <ProgressBar 
                              now={student.attendance_percentage}
                              variant={getAttendanceColor(student.attendance_percentage)}
                              style={{ height: '4px' }}
                            />
                          </div>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(student.status)}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </Badge>
                          {student.pending_backlogs > 0 && (
                            <div className="mt-1">
                              <Badge bg="warning" size="sm">
                                {student.pending_backlogs} Backlog{student.pending_backlogs > 1 ? 's' : ''}
                              </Badge>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => viewStudentDetails(student)}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => toast.info('Edit functionality coming soon')}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            {user?.role === 'admin' && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => toast.info('Delete functionality coming soon')}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            )}
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
                  <h6 className="mb-0">Campus Distribution</h6>
                </Card.Header>
                <Card.Body>
                  {Object.entries(studentStats.campusDistribution || {}).map(([campus, count]) => (
                    <div key={campus} className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>{campus}</span>
                        <span>{count}</span>
                      </div>
                      <ProgressBar 
                        now={(count / studentStats.totalStudents) * 100}
                        variant="primary"
                        style={{ height: '8px' }}
                      />
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Branch Distribution</h6>
                </Card.Header>
                <Card.Body>
                  {Object.entries(studentStats.branchDistribution || {}).map(([branch, count]) => (
                    <div key={branch} className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>{branch}</span>
                        <span>{count}</span>
                      </div>
                      <ProgressBar 
                        now={(count / studentStats.totalStudents) * 100}
                        variant="success"
                        style={{ height: '8px' }}
                      />
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Add Student Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user-plus me-2"></i>
            Add New Student
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student ID *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 2025A7PS001P"
                    value={newStudent.student_id}
                    onChange={(e) => setNewStudent({...newStudent, student_id: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="student@bits-pilani.ac.in"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First name"
                    value={newStudent.first_name}
                    onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last name"
                    value={newStudent.last_name}
                    onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Campus *</Form.Label>
                  <Form.Select
                    value={newStudent.campus}
                    onChange={(e) => setNewStudent({...newStudent, campus: e.target.value})}
                  >
                    <option value="">Select Campus</option>
                    <option value="Pilani">Pilani</option>
                    <option value="Goa">Goa</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Dubai">Dubai</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Branch *</Form.Label>
                  <Form.Select
                    value={newStudent.branch}
                    onChange={(e) => setNewStudent({...newStudent, branch: e.target.value})}
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Batch Year</Form.Label>
                  <Form.Select
                    value={newStudent.batch_year}
                    onChange={(e) => setNewStudent({...newStudent, batch_year: parseInt(e.target.value)})}
                  >
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Semester</Form.Label>
                  <Form.Select
                    value={newStudent.current_semester}
                    onChange={(e) => setNewStudent({...newStudent, current_semester: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="+919876543210"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={newStudent.date_of_birth}
                    onChange={(e) => setNewStudent({...newStudent, date_of_birth: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Student address"
                value={newStudent.address}
                onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddStudent}>
            <i className="fas fa-plus me-2"></i>
            Add Student
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-tasks me-2"></i>
            Bulk Actions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Action</Form.Label>
            <Form.Select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="">Choose an action...</option>
              <option value="activate">Activate Students</option>
              <option value="deactivate">Deactivate Students</option>
              <option value="promote">Promote to Next Semester</option>
              <option value="export">Export Selected Students</option>
            </Form.Select>
          </Form.Group>
          
          <Alert variant="info">
            <i className="fas fa-info-circle me-2"></i>
            {selectedStudents.length} student(s) selected for bulk action.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBulkAction} disabled={!bulkAction}>
            <i className="fas fa-check me-2"></i>
            Execute Action
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Student Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user me-2"></i>
            Student Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <Row>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Personal Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Table borderless size="sm">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Student ID:</td>
                          <td>{selectedStudent.student_id}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Name:</td>
                          <td>{selectedStudent.first_name} {selectedStudent.last_name}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Email:</td>
                          <td>{selectedStudent.email}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Phone:</td>
                          <td>{selectedStudent.phone}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Date of Birth:</td>
                          <td>{selectedStudent.date_of_birth}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Gender:</td>
                          <td>{selectedStudent.gender}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Nationality:</td>
                          <td>{selectedStudent.nationality}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Blood Group:</td>
                          <td>{selectedStudent.blood_group}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Academic Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Table borderless size="sm">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Campus:</td>
                          <td>{selectedStudent.campus}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Branch:</td>
                          <td>{selectedStudent.branch}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Batch Year:</td>
                          <td>{selectedStudent.batch_year}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Current Semester:</td>
                          <td>{selectedStudent.current_semester}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">CGPA:</td>
                          <td>
                            <Badge bg={getCGPAColor(selectedStudent.cgpa)}>
                              {selectedStudent.cgpa}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Attendance:</td>
                          <td>
                            <Badge bg={getAttendanceColor(selectedStudent.attendance_percentage)}>
                              {selectedStudent.attendance_percentage}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Total Credits:</td>
                          <td>{selectedStudent.total_credits}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Pending Backlogs:</td>
                          <td>{selectedStudent.pending_backlogs}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Achievements & Activities</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6>Achievements</h6>
                        {selectedStudent.achievements?.length > 0 ? (
                          <ul>
                            {selectedStudent.achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted">No achievements recorded</p>
                        )}
                      </Col>
                      <Col md={6}>
                        <h6>Extracurricular Activities</h6>
                        {selectedStudent.extracurricular?.length > 0 ? (
                          <ul>
                            {selectedStudent.extracurricular.map((activity, index) => (
                              <li key={index}>{activity}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted">No activities recorded</p>
                        )}
                      </Col>
                    </Row>
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
            <i className="fas fa-edit me-2"></i>
            Edit Student
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default StudentManagement;
