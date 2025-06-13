import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function ReportsManagement() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('');
  const [filters, setFilters] = useState({
    campus: 'all',
    branch: 'all',
    semester: 'all',
    academicYear: '2025',
    dateFrom: '',
    dateTo: ''
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'student_performance', label: 'Student Performance Report' },
    { value: 'attendance_summary', label: 'Attendance Summary Report' },
    { value: 'fee_collection', label: 'Fee Collection Report' },
    { value: 'course_enrollment', label: 'Course Enrollment Report' },
    { value: 'faculty_workload', label: 'Faculty Workload Report' },
    { value: 'library_usage', label: 'Library Usage Report' },
    { value: 'hostel_occupancy', label: 'Hostel Occupancy Report' }
  ];

  const generateReport = async () => {
    if (!reportType) {
      toast.error('Please select a report type');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock report data based on type
      const mockData = generateMockData(reportType);
      setReportData(mockData);
      
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (type) => {
    switch (type) {
      case 'student_performance':
        return {
          title: 'Student Performance Report',
          summary: {
            totalStudents: 2847,
            averageCGPA: 7.8,
            passRate: 92.5,
            topPerformers: 156
          },
          data: [
            { branch: 'Computer Science', students: 856, avgCGPA: 8.2, passRate: 94.2 },
            { branch: 'Electronics', students: 742, avgCGPA: 7.9, passRate: 91.8 },
            { branch: 'Mechanical', students: 634, avgCGPA: 7.6, passRate: 89.5 },
            { branch: 'Chemical', students: 615, avgCGPA: 7.7, passRate: 93.1 }
          ]
        };
      
      case 'attendance_summary':
        return {
          title: 'Attendance Summary Report',
          summary: {
            overallAttendance: 87.3,
            studentsAbove75: 2456,
            studentsBelow75: 391,
            criticalCases: 45
          },
          data: [
            { course: 'CS F212 - Database Systems', attendance: 89.2, students: 45 },
            { course: 'CS F213 - OOP', attendance: 92.1, students: 52 },
            { course: 'MATH F211 - Mathematics III', attendance: 84.7, students: 38 },
            { course: 'PHY F110 - Physics', attendance: 78.9, students: 67 }
          ]
        };
      
      case 'fee_collection':
        return {
          title: 'Fee Collection Report',
          summary: {
            totalCollected: '₹12,45,67,890',
            totalPending: '₹2,34,56,780',
            collectionRate: 84.2,
            overdueAmount: '₹45,67,890'
          },
          data: [
            { semester: 'Monsoon 2025', collected: '₹6,78,90,123', pending: '₹1,23,45,678', rate: 84.6 },
            { semester: 'Spring 2025', collected: '₹5,66,77,767', pending: '₹1,11,11,102', rate: 83.6 }
          ]
        };
      
      default:
        return {
          title: 'General Report',
          summary: { message: 'Report data will be displayed here' },
          data: []
        };
    }
  };

  const exportReport = (format) => {
    if (!reportData) {
      toast.error('Please generate a report first');
      return;
    }
    
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const getPerformanceColor = (value, type) => {
    if (type === 'cgpa') {
      if (value >= 8.5) return 'success';
      if (value >= 7.5) return 'primary';
      if (value >= 6.5) return 'warning';
      return 'danger';
    }
    
    if (type === 'percentage') {
      if (value >= 90) return 'success';
      if (value >= 80) return 'primary';
      if (value >= 70) return 'warning';
      return 'danger';
    }
    
    return 'secondary';
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-chart-bar text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">Reports Management</h2>
              <small className="text-muted">Generate and analyze institutional reports</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Report Configuration */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-cog me-2"></i>
                Report Configuration
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Report Type</Form.Label>
                    <Form.Select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="">Select Report Type</option>
                      {reportTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Academic Year</Form.Label>
                    <Form.Select
                      value={filters.academicYear}
                      onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
                    >
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Campus</Form.Label>
                    <Form.Select
                      value={filters.campus}
                      onChange={(e) => setFilters({...filters, campus: e.target.value})}
                    >
                      <option value="all">All Campuses</option>
                      <option value="pilani">Pilani</option>
                      <option value="goa">Goa</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="dubai">Dubai</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Branch</Form.Label>
                    <Form.Select
                      value={filters.branch}
                      onChange={(e) => setFilters({...filters, branch: e.target.value})}
                    >
                      <option value="all">All Branches</option>
                      <option value="cs">Computer Science</option>
                      <option value="ece">Electronics & Communication</option>
                      <option value="mech">Mechanical Engineering</option>
                      <option value="chem">Chemical Engineering</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Semester</Form.Label>
                    <Form.Select
                      value={filters.semester}
                      onChange={(e) => setFilters({...filters, semester: e.target.value})}
                    >
                      <option value="all">All Semesters</option>
                      <option value="monsoon">Monsoon</option>
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date From</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date To</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  onClick={generateReport}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-chart-line me-2"></i>
                      Generate Report
                    </>
                  )}
                </Button>
                
                {reportData && (
                  <>
                    <Button variant="outline-success" onClick={() => exportReport('excel')}>
                      <i className="fas fa-file-excel me-2"></i>
                      Export Excel
                    </Button>
                    <Button variant="outline-danger" onClick={() => exportReport('pdf')}>
                      <i className="fas fa-file-pdf me-2"></i>
                      Export PDF
                    </Button>
                    <Button variant="outline-info" onClick={() => exportReport('csv')}>
                      <i className="fas fa-file-csv me-2"></i>
                      Export CSV
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Report Results */}
      {reportData && (
        <>
          {/* Report Summary */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-chart-pie me-2"></i>
                    {reportData.title} - Summary
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {Object.entries(reportData.summary).map(([key, value]) => (
                      <Col md={3} key={key} className="mb-3">
                        <Card className="text-center border-0 bg-light">
                          <Card.Body>
                            <div className="h4 text-primary">{value}</div>
                            <small className="text-muted">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </small>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Detailed Report Data */}
          {reportData.data && reportData.data.length > 0 && (
            <Row>
              <Col>
                <Card>
                  <Card.Header className="bg-info text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-table me-2"></i>
                      Detailed Report Data
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          {Object.keys(reportData.data[0]).map(key => (
                            <th key={key}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.map((row, index) => (
                          <tr key={index}>
                            {Object.entries(row).map(([key, value]) => (
                              <td key={key}>
                                {key.includes('Rate') || key.includes('CGPA') || key.includes('attendance') ? (
                                                                    <Badge bg={getPerformanceColor(parseFloat(value), key.includes('CGPA') ? 'cgpa' : 'percentage')}>
                                    {value}
                                  </Badge>
                                ) : (
                                  value
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}

      {/* Quick Reports */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Quick Reports
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <Button variant="outline-primary" className="w-100" onClick={() => {
                    setReportType('student_performance');
                    generateReport();
                  }}>
                    <i className="fas fa-user-graduate d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    Student Performance
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-success" className="w-100" onClick={() => {
                    setReportType('attendance_summary');
                    generateReport();
                  }}>
                    <i className="fas fa-calendar-check d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    Attendance Summary
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-info" className="w-100" onClick={() => {
                    setReportType('fee_collection');
                    generateReport();
                  }}>
                    <i className="fas fa-money-bill-wave d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    Fee Collection
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-warning" className="w-100" onClick={() => {
                    setReportType('course_enrollment');
                    generateReport();
                  }}>
                    <i className="fas fa-book-open d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                    Course Enrollment
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ReportsManagement;

