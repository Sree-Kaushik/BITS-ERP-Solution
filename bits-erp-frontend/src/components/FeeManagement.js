import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, ProgressBar, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function FeeManagement() {
  const { user } = useAuth();
  const [feeStructure, setFeeStructure] = useState([]);
  const [payments, setPayments] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [feeStats, setFeeStats] = useState({});
  const [installmentPlan, setInstallmentPlan] = useState({
    numberOfInstallments: 3,
    installmentAmount: 0,
    dueDate: ''
  });

  const [scholarshipApplication, setScholarshipApplication] = useState({
    type: 'merit',
    reason: '',
    documents: [],
    expectedAmount: 0,
    academicYear: '2025'
  });

  useEffect(() => {
    fetchFeeData();
    fetchPaymentHistory();
    fetchScholarships();
    fetchFeeStats();
  }, [user]);

  const fetchFeeData = async () => {
    try {
      // Enhanced mock data with more fee categories
      setFeeStructure([
        {
          fee_id: '1',
          semester: 6,
          academic_year: 2025,
          semester_type: 'monsoon',
          tuition_fee: 75000,
          exam_fee: 500,
          library_fee: 1000,
          lab_fee: 2000,
          hostel_fee: 8000,
          mess_fee: 12000,
          sports_fee: 500,
          medical_fee: 300,
          development_fee: 2000,
          caution_deposit: 5000,
          total_fee: 106300,
          due_date: '2025-07-31',
          status: 'pending',
          paid_amount: 50000,
          discount_applied: 5000,
          scholarship_amount: 0,
          late_fee: 0,
          installments_allowed: true,
          payment_plan: 'full'
        },
        {
          fee_id: '2',
          semester: 5,
          academic_year: 2025,
          semester_type: 'spring',
          tuition_fee: 75000,
          exam_fee: 500,
          library_fee: 1000,
          lab_fee: 2000,
          hostel_fee: 8000,
          mess_fee: 12000,
          sports_fee: 500,
          medical_fee: 300,
          development_fee: 2000,
          caution_deposit: 0,
          total_fee: 101300,
          due_date: '2025-02-28',
          status: 'paid',
          paid_amount: 101300,
          discount_applied: 0,
          scholarship_amount: 10000,
          late_fee: 0,
          installments_allowed: true,
          payment_plan: 'installment'
        }
      ]);
    } catch (error) {
      console.error('Error fetching fee structure:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      // Enhanced payment history with more details
      setPayments([
        {
          payment_id: '1',
          fee_id: '2',
          amount_paid: 50000,
          payment_date: '2025-01-15',
          payment_method: 'online',
          transaction_id: 'TXN123456789',
          receipt_number: 'RCP001',
          status: 'completed',
          bank_name: 'SBI',
          payment_type: 'installment',
          installment_number: 1,
          late_fee_paid: 0,
          discount_availed: 0
        },
        {
          payment_id: '2',
          fee_id: '2',
          amount_paid: 51300,
          payment_date: '2025-02-20',
          payment_method: 'card',
          transaction_id: 'TXN987654321',
          receipt_number: 'RCP002',
          status: 'completed',
          bank_name: 'HDFC',
          payment_type: 'final',
          installment_number: 2,
          late_fee_paid: 0,
          discount_availed: 0
        },
        {
          payment_id: '3',
          fee_id: '1',
          amount_paid: 50000,
          payment_date: '2025-06-10',
          payment_method: 'upi',
          transaction_id: 'UPI456789123',
          receipt_number: 'RCP003',
          status: 'completed',
          bank_name: 'PhonePe',
          payment_type: 'partial',
          installment_number: 1,
          late_fee_paid: 0,
          discount_availed: 5000
        }
      ]);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const fetchScholarships = () => {
    setScholarships([
      {
        scholarship_id: '1',
        name: 'Merit Scholarship',
        type: 'merit',
        amount: 10000,
        academic_year: '2025',
        status: 'approved',
        application_date: '2025-01-10',
        approval_date: '2025-01-25',
        criteria: 'CGPA > 8.5',
        description: 'Scholarship for academic excellence'
      },
      {
        scholarship_id: '2',
        name: 'Need-based Scholarship',
        type: 'need_based',
        amount: 15000,
        academic_year: '2025',
        status: 'pending',
        application_date: '2025-06-01',
        approval_date: null,
        criteria: 'Family income < 5 LPA',
        description: 'Financial assistance for economically disadvantaged students'
      }
    ]);
  };

  const fetchFeeStats = () => {
    setFeeStats({
      totalFeeAmount: 207600,
      totalPaidAmount: 151300,
      totalPendingAmount: 56300,
      scholarshipReceived: 10000,
      discountReceived: 5000,
      lateFeePaid: 0,
      paymentsMade: 3,
      nextDueDate: '2025-07-31'
    });
  };

  const initiatePayment = async (feeData) => {
    setSelectedFee(feeData);
    setShowPaymentModal(true);
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);

    try {
      // Simulate payment processing with more realistic flow
      await new Promise(resolve => setTimeout(resolve, 3000));

      const paymentData = {
        fee_id: selectedFee.fee_id,
        amount: selectedFee.total_fee - selectedFee.paid_amount,
        payment_method: paymentMethod,
        transaction_id: `TXN${Date.now()}`,
        receipt_number: `RCP${Date.now()}`,
        status: 'completed'
      };

      // Add to payments
      setPayments(prev => [...prev, {
        payment_id: Date.now().toString(),
        ...paymentData,
        payment_date: new Date().toISOString().split('T')[0],
        bank_name: paymentMethod === 'upi' ? 'UPI' : 'Bank',
        payment_type: 'full',
        installment_number: null,
        late_fee_paid: 0,
        discount_availed: selectedFee.discount_applied
      }]);

      // Update fee structure
      setFeeStructure(prev => 
        prev.map(fee => 
          fee.fee_id === selectedFee.fee_id 
            ? { ...fee, status: 'paid', paid_amount: fee.total_fee }
            : fee
        )
      );
      
      toast.success('Payment successful! Receipt will be sent to your email.');
      setShowPaymentModal(false);
      
      // Auto-download receipt
      setTimeout(() => {
        downloadReceipt(paymentData.payment_id);
      }, 1000);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const setupInstallmentPlan = () => {
    if (!selectedFee) return;
    
    const remainingAmount = selectedFee.total_fee - selectedFee.paid_amount;
    const installmentAmount = Math.ceil(remainingAmount / installmentPlan.numberOfInstallments);
    
    setInstallmentPlan(prev => ({
      ...prev,
      installmentAmount
    }));
    
    toast.success(`Installment plan set up: ${installmentPlan.numberOfInstallments} installments of ₹${installmentAmount} each`);
    setShowInstallmentModal(false);
  };

  const applyForScholarship = async () => {
    try {
      const newScholarship = {
        scholarship_id: Date.now().toString(),
        name: `${scholarshipApplication.type} Scholarship`,
        type: scholarshipApplication.type,
        amount: scholarshipApplication.expectedAmount,
        academic_year: scholarshipApplication.academicYear,
        status: 'pending',
        application_date: new Date().toISOString().split('T')[0],
        approval_date: null,
        criteria: scholarshipApplication.reason,
        description: scholarshipApplication.reason
      };

      setScholarships(prev => [...prev, newScholarship]);
      toast.success('Scholarship application submitted successfully!');
      setShowScholarshipModal(false);
      
      // Reset form
      setScholarshipApplication({
        type: 'merit',
        reason: '',
        documents: [],
        expectedAmount: 0,
        academicYear: '2025'
      });
    } catch (error) {
      toast.error('Failed to submit scholarship application');
    }
  };

  const downloadReceipt = async (paymentId) => {
    try {
      const payment = payments.find(p => p.payment_id === paymentId);
      const fee = feeStructure.find(f => f.fee_id === payment?.fee_id);
      
      // Generate receipt content
      const receiptContent = `
BITS PILANI - PAYMENT RECEIPT
=============================

Receipt Number: ${payment?.receipt_number}
Transaction ID: ${payment?.transaction_id}
Payment Date: ${payment?.payment_date}

Student Details:
Name: ${user?.username || 'Student Name'}
Student ID: ${user?.student_id || 'Student ID'}

Payment Details:
Amount Paid: ₹${payment?.amount_paid?.toLocaleString()}
Payment Method: ${payment?.payment_method?.toUpperCase()}
Bank/Gateway: ${payment?.bank_name}
Status: ${payment?.status?.toUpperCase()}

Fee Details:
Semester: ${fee?.semester} (${fee?.semester_type} ${fee?.academic_year})
Total Fee: ₹${fee?.total_fee?.toLocaleString()}
Paid Amount: ₹${fee?.paid_amount?.toLocaleString()}
Pending Amount: ₹${(fee?.total_fee - fee?.paid_amount)?.toLocaleString()}

This is a computer generated receipt.
      `;

      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${payment?.receipt_number}.txt`;
      a.click();
      
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  const getStatusBadge = (status, dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    
    if (status === 'paid') return <Badge bg="success">Paid</Badge>;
    if (status === 'partial') return <Badge bg="warning">Partial</Badge>;
    if (today > due) return <Badge bg="danger">Overdue</Badge>;
    return <Badge bg="primary">Pending</Badge>;
  };

  const calculateProgress = (paid, total) => {
    return Math.round((paid / total) * 100);
  };

  const getScholarshipStatusBadge = (status) => {
    const variants = {
      approved: 'success',
      pending: 'warning',
      rejected: 'danger'
    };
    return variants[status] || 'secondary';
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
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-credit-card text-primary me-3" style={{ fontSize: '2rem' }}></i>
            <div>
              <h2 className="mb-0 text-primary">Fee Management</h2>
              <small className="text-muted">Comprehensive fee management and payment system</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Fee Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary h-100">
            <Card.Body>
              <i className="fas fa-money-bill-wave text-primary mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-primary">₹{feeStats.totalFeeAmount?.toLocaleString()}</h4>
              <small className="text-muted">Total Fee Amount</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success h-100">
            <Card.Body>
              <i className="fas fa-check-circle text-success mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-success">₹{feeStats.totalPaidAmount?.toLocaleString()}</h4>
              <small className="text-muted">Amount Paid</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <i className="fas fa-clock text-warning mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-warning">₹{feeStats.totalPendingAmount?.toLocaleString()}</h4>
              <small className="text-muted">Pending Amount</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info h-100">
            <Card.Body>
              <i className="fas fa-gift text-info mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-info">₹{(feeStats.scholarshipReceived + feeStats.discountReceived)?.toLocaleString()}</h4>
              <small className="text-muted">Scholarships & Discounts</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for different sections */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="overview" title={
                  <span>
                    <i className="fas fa-chart-pie me-2"></i>
                    Overview
                  </span>
                }>
                  {/* Fee Structure Overview */}
                  <Row className="mb-4">
                    <Col>
                      <Card>
                        <Card.Header className="bg-primary text-white">
                          <h5 className="mb-0">
                            <i className="fas fa-file-invoice-dollar me-2"></i>
                            Current Fee Structure
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          {feeStructure.length === 0 ? (
                            <Alert variant="info">No fee structure available.</Alert>
                          ) : (
                            <Table striped bordered hover responsive>
                              <thead className="table-dark">
                                <tr>
                                  <th>Semester</th>
                                  <th>Fee Breakdown</th>
                                  <th>Total Amount</th>
                                  <th>Paid Amount</th>
                                  <th>Progress</th>
                                  <th>Due Date</th>
                                  <th>Status</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {feeStructure.map((fee) => (
                                  <tr key={fee.fee_id}>
                                    <td className="fw-bold">
                                      Sem {fee.semester}<br/>
                                      <small className="text-muted">{fee.semester_type} {fee.academic_year}</small>
                                    </td>
                                    <td>
                                      <small>
                                        Tuition: ₹{fee.tuition_fee.toLocaleString()}<br/>
                                        Hostel: ₹{fee.hostel_fee.toLocaleString()}<br/>
                                        Mess: ₹{fee.mess_fee.toLocaleString()}<br/>
                                        Others: ₹{(fee.exam_fee + fee.library_fee + fee.lab_fee + fee.sports_fee + fee.medical_fee + fee.development_fee).toLocaleString()}
                                      </small>
                                    </td>
                                    <td className="fw-bold">₹{fee.total_fee.toLocaleString()}</td>
                                    <td>₹{fee.paid_amount.toLocaleString()}</td>
                                    <td>
                                      <ProgressBar 
                                        now={calculateProgress(fee.paid_amount, fee.total_fee)}
                                        label={`${calculateProgress(fee.paid_amount, fee.total_fee)}%`}
                                        variant={calculateProgress(fee.paid_amount, fee.total_fee) === 100 ? 'success' : 'primary'}
                                      />
                                    </td>
                                    <td>{new Date(fee.due_date).toLocaleDateString()}</td>
                                    <td>{getStatusBadge(fee.status, fee.due_date)}</td>
                                    <td>
                                      <div className="d-flex gap-1">
                                        {fee.paid_amount < fee.total_fee && (
                                          <>
                                            <Button
                                              variant="success"
                                              size="sm"
                                              onClick={() => initiatePayment(fee)}
                                            >
                                              <i className="fas fa-credit-card me-1"></i>
                                              Pay
                                            </Button>
                                            {fee.installments_allowed && (
                                              <Button
                                                variant="outline-info"
                                                size="sm"
                                                onClick={() => {
                                                  setSelectedFee(fee);
                                                  setShowInstallmentModal(true);
                                                }}
                                              >
                                                <i className="fas fa-calendar-alt me-1"></i>
                                                EMI
                                              </Button>
                                            )}
                                          </>
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
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="payments" title={
                  <span>
                    <i className="fas fa-history me-2"></i>
                    Payment History ({payments.length})
                  </span>
                }>
                  {/* Payment History */}
                  <Card>
                    <Card.Header className="bg-success text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-history me-2"></i>
                        Payment History
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      {payments.length === 0 ? (
                        <Alert variant="info">No payment history available.</Alert>
                      ) : (
                        <Table striped bordered hover responsive>
                          <thead className="table-dark">
                            <tr>
                              <th>Receipt No.</th>
                              <th>Amount</th>
                              <th>Payment Date</th>
                              <th>Method</th>
                              <th>Transaction ID</th>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment) => (
                              <tr key={payment.payment_id}>
                                <td className="fw-bold">{payment.receipt_number}</td>
                                <td>₹{payment.amount_paid.toLocaleString()}</td>
                                <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                <td>
                                  <Badge bg="info">
                                    {payment.payment_method.toUpperCase()}
                                  </Badge>
                                  <br/>
                                  <small className="text-muted">{payment.bank_name}</small>
                                </td>
                                <td><code>{payment.transaction_id}</code></td>
                                <td>
                                  <Badge bg={payment.payment_type === 'full' ? 'success' : 'warning'}>
                                    {payment.payment_type}
                                  </Badge>
                                  {payment.installment_number && (
                                    <div><small>Installment {payment.installment_number}</small></div>
                                  )}
                                </td>
                                <td>
                                  <Badge bg={payment.status === 'completed' ? 'success' : 'warning'}>
                                    {payment.status.toUpperCase()}
                                  </Badge>
                                </td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => downloadReceipt(payment.payment_id)}
                                  >
                                    <i className="fas fa-download me-1"></i>
                                    Receipt
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

                <Tab eventKey="scholarships" title={
                  <span>
                    <i className="fas fa-graduation-cap me-2"></i>
                    Scholarships ({scholarships.length})
                  </span>
                }>
                  {/* Scholarships */}
                  <Row className="mb-3">
                    <Col>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>Scholarships & Financial Aid</h5>
                        <Button 
                          variant="primary" 
                          onClick={() => setShowScholarshipModal(true)}
                        >
                          <i className="fas fa-plus me-2"></i>
                          Apply for Scholarship
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  <Card>
                    <Card.Body>
                      {scholarships.length === 0 ? (
                        <Alert variant="info">
                          No scholarships applied yet. Click "Apply for Scholarship" to get started.
                        </Alert>
                      ) : (
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Scholarship Name</th>
                              <th>Type</th>
                              <th>Amount</th>
                              <th>Academic Year</th>
                              <th>Application Date</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scholarships.map((scholarship) => (
                              <tr key={scholarship.scholarship_id}>
                                <td>
                                  <div className="fw-bold">{scholarship.name}</div>
                                  <small className="text-muted">{scholarship.description}</small>
                                </td>
                                <td>
                                  <Badge bg="secondary">
                                    {scholarship.type.replace('_', ' ')}
                                  </Badge>
                                </td>
                                <td className="fw-bold">₹{scholarship.amount.toLocaleString()}</td>
                                <td>{scholarship.academic_year}</td>
                                <td>{new Date(scholarship.application_date).toLocaleDateString()}</td>
                                <td>
                                  <Badge bg={getScholarshipStatusBadge(scholarship.status)}>
                                    {scholarship.status.toUpperCase()}
                                  </Badge>
                                  {scholarship.approval_date && (
                                    <div><small>Approved: {new Date(scholarship.approval_date).toLocaleDateString()}</small></div>
                                  )}
                                </td>
                                <td>
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                  >
                                    <i className="fas fa-eye"></i>
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
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

            {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-credit-card me-2"></i>Make Payment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={processPayment}>
          <Modal.Body>
            {selectedFee && (
              <>
                <Alert variant="info">
                  <h6>Payment Details</h6>
                  <Row>
                    <Col md={6}>
                      <p className="mb-1"><strong>Semester:</strong> {selectedFee.semester} ({selectedFee.semester_type} {selectedFee.academic_year})</p>
                      <p className="mb-1"><strong>Total Fee:</strong> ₹{selectedFee.total_fee.toLocaleString()}</p>
                      <p className="mb-1"><strong>Already Paid:</strong> ₹{selectedFee.paid_amount.toLocaleString()}</p>
                      <p className="mb-0"><strong>Amount to Pay:</strong> ₹{(selectedFee.total_fee - selectedFee.paid_amount).toLocaleString()}</p>
                    </Col>
                    <Col md={6}>
                      {selectedFee.discount_applied > 0 && (
                        <p className="mb-1"><strong>Discount Applied:</strong> ₹{selectedFee.discount_applied.toLocaleString()}</p>
                      )}
                      {selectedFee.scholarship_amount > 0 && (
                        <p className="mb-1"><strong>Scholarship:</strong> ₹{selectedFee.scholarship_amount.toLocaleString()}</p>
                      )}
                      <p className="mb-1"><strong>Due Date:</strong> {new Date(selectedFee.due_date).toLocaleDateString()}</p>
                    </Col>
                  </Row>
                </Alert>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                      >
                        <option value="online">Net Banking</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="upi">UPI</option>
                        <option value="wallet">Digital Wallet</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Gateway</Form.Label>
                      <Form.Select>
                        <option value="razorpay">Razorpay</option>
                        <option value="payu">PayU</option>
                        <option value="ccavenue">CCAvenue</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Alert variant="warning" className="small">
                  <i className="fas fa-shield-alt me-2"></i>
                  Your payment is secured with 256-bit SSL encryption. Transaction charges may apply based on payment method.
                </Alert>

                <Alert variant="info" className="small">
                  <i className="fas fa-info-circle me-2"></i>
                  Payment confirmation will be sent to your registered email and mobile number.
                </Alert>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={processingPayment}>
              {processingPayment ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock me-2"></i>
                  Pay Securely
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Installment Plan Modal */}
      <Modal show={showInstallmentModal} onHide={() => setShowInstallmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-calendar-alt me-2"></i>Setup Installment Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFee && (
            <>
              <Alert variant="info">
                <strong>Remaining Amount:</strong> ₹{(selectedFee.total_fee - selectedFee.paid_amount).toLocaleString()}
              </Alert>
              
              <Form.Group className="mb-3">
                <Form.Label>Number of Installments</Form.Label>
                <Form.Select
                  value={installmentPlan.numberOfInstallments}
                  onChange={(e) => setInstallmentPlan({
                    ...installmentPlan, 
                    numberOfInstallments: parseInt(e.target.value),
                    installmentAmount: Math.ceil((selectedFee.total_fee - selectedFee.paid_amount) / parseInt(e.target.value))
                  })}
                >
                  <option value={2}>2 Installments</option>
                  <option value={3}>3 Installments</option>
                  <option value={4}>4 Installments</option>
                  <option value={6}>6 Installments</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Installment Amount</Form.Label>
                <Form.Control
                  type="text"
                  value={`₹${installmentPlan.installmentAmount.toLocaleString()}`}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>First Installment Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={installmentPlan.dueDate}
                  onChange={(e) => setInstallmentPlan({...installmentPlan, dueDate: e.target.value})}
                />
              </Form.Group>

              <Alert variant="warning" className="small">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Additional processing fee of ₹100 per installment will be charged.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInstallmentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={setupInstallmentPlan}>
            <i className="fas fa-check me-2"></i>
            Setup Plan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Scholarship Application Modal */}
      <Modal show={showScholarshipModal} onHide={() => setShowScholarshipModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-graduation-cap me-2"></i>Apply for Scholarship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Scholarship Type</Form.Label>
                  <Form.Select
                    value={scholarshipApplication.type}
                    onChange={(e) => setScholarshipApplication({...scholarshipApplication, type: e.target.value})}
                  >
                    <option value="merit">Merit-based Scholarship</option>
                    <option value="need_based">Need-based Scholarship</option>
                    <option value="sports">Sports Scholarship</option>
                    <option value="cultural">Cultural Scholarship</option>
                    <option value="research">Research Scholarship</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Academic Year</Form.Label>
                  <Form.Select
                    value={scholarshipApplication.academicYear}
                    onChange={(e) => setScholarshipApplication({...scholarshipApplication, academicYear: e.target.value})}
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Expected Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                value={scholarshipApplication.expectedAmount}
                onChange={(e) => setScholarshipApplication({...scholarshipApplication, expectedAmount: parseInt(e.target.value)})}
                placeholder="Enter expected scholarship amount"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Application</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={scholarshipApplication.reason}
                onChange={(e) => setScholarshipApplication({...scholarshipApplication, reason: e.target.value})}
                placeholder="Explain why you are applying for this scholarship..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Supporting Documents</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Form.Text className="text-muted">
                Upload relevant documents (Income certificate, Academic transcripts, etc.)
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScholarshipModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={applyForScholarship}>
            <i className="fas fa-paper-plane me-2"></i>
            Submit Application
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FeeManagement;
