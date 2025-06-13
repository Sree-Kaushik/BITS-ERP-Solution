import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs, InputGroup, ProgressBar, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    role: 'student'
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: 'student',
    studentId: '',
    batchYear: new Date().getFullYear(),
    campus: '',
    branch: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    emergencyContact: '',
    dateOfBirth: '',
    gender: '',
    nationality: 'Indian'
  });

  const [errors, setErrors] = useState({});
  
  const campusOptions = [
    'Pilani', 'Goa', 'Hyderabad', 'Dubai'
  ];

  const branchOptions = [
    'Computer Science', 'Electronics & Communication', 'Mechanical Engineering',
    'Chemical Engineering', 'Civil Engineering', 'Biotechnology', 'Mathematics',
    'Physics', 'Chemistry', 'Economics', 'Pharmacy', 'Management'
  ];

  useEffect(() => {
    checkBiometricSupport();
    checkLockoutStatus();
    loadRememberedUser();
    loadThemePreference();
  }, []);

  const checkBiometricSupport = () => {
    if (window.PublicKeyCredential) {
      setBiometricSupported(true);
    }
  };

  const checkLockoutStatus = () => {
    const lockoutEnd = localStorage.getItem('lockoutEnd');
    if (lockoutEnd && new Date() < new Date(lockoutEnd)) {
      setIsLocked(true);
      const remaining = Math.ceil((new Date(lockoutEnd) - new Date()) / 1000);
      setLockoutTime(remaining);
      
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem('lockoutEnd');
            setLoginAttempts(0);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  };

  const loadRememberedUser = () => {
    const remembered = localStorage.getItem('rememberUser');
    if (remembered) {
      const userData = JSON.parse(remembered);
      setLoginForm(prev => ({
        ...prev,
        username: userData.username,
        role: userData.role
      }));
      setRememberMe(true);
    }
  };

  const loadThemePreference = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 30) return 'danger';
    if (strength < 60) return 'warning';
    if (strength < 80) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginForm.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!loginForm.password) {
      newErrors.password = 'Password is required';
    }
    
    if (!captchaVerified && loginAttempts >= 2) {
      newErrors.captcha = 'Please verify captcha';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerForm.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!registerForm.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!registerForm.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (registerForm.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!registerForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      newErrors.email = 'Invalid email format';
    } else if (!registerForm.email.endsWith('@bits-pilani.ac.in')) {
      newErrors.email = 'Must use BITS Pilani email address';
    }
    
    if (registerForm.role === 'student') {
      if (!registerForm.studentId.trim()) {
        newErrors.studentId = 'Student ID is required';
      } else if (!/^\d{4}[A-Z]\d[A-Z]{2}\d{3}[A-Z]$/.test(registerForm.studentId)) {
        newErrors.studentId = 'Invalid student ID format (e.g., 2021A7PS001P)';
      }
      
      if (!registerForm.campus) {
        newErrors.campus = 'Campus selection is required';
      }
      
      if (!registerForm.branch) {
        newErrors.branch = 'Branch selection is required';
      }
    }
    
    if (!registerForm.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(registerForm.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    
    if (!registerForm.password) {
      newErrors.password = 'Password is required';
    } else if (registerForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!registerForm.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error(`Account locked. Try again in ${Math.ceil(lockoutTime / 60)} minutes.`);
      return;
    }
    
    if (!validateLoginForm()) return;
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const validCredentials = [
        { username: 'admin', password: 'password', role: 'admin', name: 'Administrator' },
        { username: 'faculty_user', password: 'password', role: 'faculty', name: 'Dr. Faculty User' },
        { username: 'john_doe', password: 'password', role: 'student', name: 'John Doe' },
        { username: 'arjun_sharma', password: 'ArjunBits@2025', role: 'student', name: 'Arjun Sharma' }
      ];
      
      const user = validCredentials.find(
        cred => cred.username === loginForm.username && 
               cred.password === loginForm.password &&
               cred.role === loginForm.role
      );
      
      if (user) {
        const userData = {
          username: user.name,
          email: `${loginForm.username}@bits-pilani.ac.in`,
          role: loginForm.role,
          student_id: loginForm.role === 'student' ? '2021A7PS001P' : null,
          employee_id: loginForm.role !== 'student' ? 'EMP001' : null,
          campus: 'Pilani',
          branch: loginForm.role === 'student' ? 'Computer Science' : null
        };
        
        await login(userData);
        
        if (rememberMe) {
          localStorage.setItem('rememberUser', JSON.stringify({
            username: loginForm.username,
            role: loginForm.role
          }));
        }
        
        setLoginAttempts(0);
        localStorage.removeItem('lockoutEnd');
        
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/dashboard');
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          const lockoutEnd = new Date(Date.now() + 15 * 60 * 1000);
          localStorage.setItem('lockoutEnd', lockoutEnd.toISOString());
          setIsLocked(true);
          setLockoutTime(15 * 60);
          toast.error('Too many failed attempts. Account locked for 15 minutes.');
        } else {
          toast.error(`Invalid credentials. ${5 - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const userData = {
        username: `${registerForm.firstName} ${registerForm.lastName}`,
        email: registerForm.email,
        role: registerForm.role,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        student_id: registerForm.studentId,
        campus: registerForm.campus,
        branch: registerForm.branch,
        phone: registerForm.phoneNumber
      };
      
      await register(userData);
      toast.success('Registration successful! Please login with your credentials.');
      setActiveTab('login');
      
      setLoginForm({
        username: registerForm.username,
        password: '',
        role: registerForm.role
      });
      
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricSupported) {
      toast.error('Biometric authentication not supported');
      return;
    }
    
    try {
      toast.info('Place your finger on the sensor...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Biometric authentication successful!');
    } catch (error) {
      toast.error('Biometric authentication failed');
    }
  };

  const generateCaptcha = () => {
    setCaptchaVerified(true);
    toast.success('Captcha verified!');
  };

  const handleForgotPassword = () => {
    if (!loginForm.username) {
      toast.error('Please enter your username first');
      return;
    }
    
    toast.info('Password reset link sent to your registered email address.');
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login will be available soon!`);
  };

  useEffect(() => {
    if (registerForm.password) {
      setPasswordStrength(calculatePasswordStrength(registerForm.password));
    }
  }, [registerForm.password]);

  return (
    <div 
      className={`min-vh-100 d-flex align-items-center ${darkMode ? 'dark-theme' : ''}`}
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative'
      }}
    >
      {/* Background Pattern */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }}
      ></div>

      {/* Theme Toggle */}
      <Button
        variant="outline-light"
        className="position-absolute top-0 end-0 m-3"
        onClick={toggleTheme}
        style={{ zIndex: 1000 }}
      >
        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
      </Button>

      <Container className="position-relative">
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <Card className={`shadow-lg border-0 rounded-4 ${darkMode ? 'bg-dark text-light' : ''}`}>
              <Card.Body className="p-0">
                <Row className="g-0">
                  {/* Left Side - Branding */}
                  <Col md={5} className={`${darkMode ? 'bg-secondary' : 'bg-primary'} text-white p-5 rounded-start-4 d-flex flex-column justify-content-center`}>
                    <div className="text-center">
                      <div 
                        className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center mx-auto mb-4"
                        style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold' }}
                      >
                        BITS
                      </div>
                      <h3 className="fw-bold mb-3">Campus ERP</h3>
                      <p className="mb-4 opacity-75">
                        Your gateway to academic excellence and comprehensive campus life management
                      </p>
                      
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-shield-alt me-2"></i>
                          <small>Advanced Security</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-mobile-alt me-2"></i>
                          <small>Mobile Responsive</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-cloud me-2"></i>
                          <small>Cloud Synchronized</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-clock me-2"></i>
                          <small>24/7 Availability</small>
                        </div>
                      </div>
                      
                      <div className="small opacity-75">
                        <i className="fas fa-lock me-1"></i>
                        256-bit SSL Encryption
                      </div>
                    </div>
                  </Col>

                  {/* Right Side - Forms */}
                  <Col md={7} className="p-5">
                    <div className="text-center mb-4">
                      <h4 className={`fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>Welcome Back!</h4>
                      <p className="text-muted">Access your academic portal</p>
                    </div>

                    {isLocked && (
                      <Alert variant="danger" className="mb-4">
                        <i className="fas fa-lock me-2"></i>
                        Account temporarily locked due to multiple failed attempts.
                        <br />
                        <strong>Time remaining: {Math.floor(lockoutTime / 60)}:{(lockoutTime % 60).toString().padStart(2, '0')}</strong>
                      </Alert>
                    )}

                    <Tabs
                      activeKey={activeTab}
                      onSelect={(k) => setActiveTab(k)}
                      className="mb-4 nav-justified"
                      variant="pills"
                    >
                      <Tab eventKey="login" title={<><i className="fas fa-sign-in-alt me-2"></i>Login</>}>
                        <Form onSubmit={handleLogin}>
                          <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                              value={loginForm.role}
                              onChange={(e) => setLoginForm({...loginForm, role: e.target.value})}
                              className="form-select-lg"
                            >
                              <option value="student">Student</option>
                              <option value="faculty">Faculty</option>
                              <option value="admin">Administrator</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-user"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                placeholder="Enter your username"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                                isInvalid={!!errors.username}
                                className="form-control-lg"
                                disabled={isLocked}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.username}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-lock"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                isInvalid={!!errors.password}
                                className="form-control-lg"
                                disabled={isLocked}
                              />
                              <Button
                                variant="outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLocked}
                              >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </Button>
                              <Form.Control.Feedback type="invalid">
                                {errors.password}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>

                          {loginAttempts >= 2 && !isLocked && (
                            <Form.Group className="mb-3">
                              <div className="d-flex align-items-center">
                                <Form.Control
                                  type="text"
                                  placeholder="Enter captcha: BITS2025"
                                  className="me-2"
                                  disabled={captchaVerified}
                                />
                                <Button
                                  variant="outline-primary"
                                  onClick={generateCaptcha}
                                  disabled={captchaVerified}
                                >
                                  {captchaVerified ? <i className="fas fa-check"></i> : 'Verify'}
                                </Button>
                              </div>
                              {errors.captcha && (
                                <div className="text-danger small mt-1">{errors.captcha}</div>
                              )}
                            </Form.Group>
                          )}

                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <Form.Check
                              type="checkbox"
                              label="Remember me"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              disabled={isLocked}
                            />
                            <Button
                              variant="link"
                              className="p-0 text-decoration-none"
                              onClick={handleForgotPassword}
                              disabled={isLocked}
                            >
                              Forgot Password?
                            </Button>
                          </div>

                          <div className="d-grid mb-3">
                            <Button
                              variant="primary"
                              size="lg"
                              type="submit"
                              disabled={loading || isLocked}
                              className="fw-bold"
                            >
                              {loading ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Signing In...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-sign-in-alt me-2"></i>
                                  Sign In
                                </>
                              )}
                            </Button>
                          </div>

                          {biometricSupported && (
                            <div className="d-grid mb-3">
                              <Button
                                variant="outline-success"
                                onClick={handleBiometricLogin}
                                disabled={isLocked}
                              >
                                <i className="fas fa-fingerprint me-2"></i>
                                Biometric Login
                              </Button>
                            </div>
                          )}

                          {/* Social Login Options */}
                          <div className="text-center mb-3">
                            <small className="text-muted">Or continue with</small>
                          </div>
                          <div className="d-flex gap-2 mb-3">
                            <Button
                              variant="outline-danger"
                              className="flex-grow-1"
                              onClick={() => handleSocialLogin('Google')}
                              disabled={isLocked}
                            >
                              <i className="fab fa-google me-1"></i>
                              Google
                            </Button>
                            <Button
                              variant="outline-primary"
                              className="flex-grow-1"
                              onClick={() => handleSocialLogin('Microsoft')}
                              disabled={isLocked}
                            >
                              <i className="fab fa-microsoft me-1"></i>
                              Microsoft
                            </Button>
                          </div>

                          {loginAttempts > 0 && !isLocked && (
                            <Alert variant="warning" className="mt-3 small">
                              <i className="fas fa-exclamation-triangle me-2"></i>
                              {loginAttempts} failed attempt(s). {5 - loginAttempts} remaining before lockout.
                            </Alert>
                          )}
                        </Form>
                      </Tab>

                      <Tab eventKey="register" title={<><i className="fas fa-user-plus me-2"></i>Register</>}>
                        <Form onSubmit={handleRegister}>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>First Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="First name"
                                  value={registerForm.firstName}
                                  onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                                  isInvalid={!!errors.firstName}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.firstName}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Last Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Last name"
                                  value={registerForm.lastName}
                                  onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                                  isInvalid={!!errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.lastName}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label>Username *</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Choose a username (min 3 characters)"
                              value={registerForm.username}
                              onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                              isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.username}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="your.email@bits-pilani.ac.in"
                              value={registerForm.email}
                              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                              isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                              value={registerForm.role}
                              onChange={(e) => setRegisterForm({...registerForm, role: e.target.value})}
                            >
                              <option value="student">Student</option>
                              <option value="faculty">Faculty</option>
                            </Form.Select>
                          </Form.Group>

                          {registerForm.role === 'student' && (
                            <>
                              <Form.Group className="mb-3">
                                <Form.Label>Student ID *</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="e.g., 2021A7PS001P"
                                  value={registerForm.studentId}
                                  onChange={(e) => setRegisterForm({...registerForm, studentId: e.target.value})}
                                  isInvalid={!!errors.studentId}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.studentId}
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Batch Year</Form.Label>
                                    <Form.Select
                                      value={registerForm.batchYear}
                                      onChange={(e) => setRegisterForm({...registerForm, batchYear: parseInt(e.target.value)})}
                                    >
                                      {[2025, 2024, 2023, 2022, 2021].map(year => (
                                        <option key={year} value={year}>{year}</option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Campus *</Form.Label>
                                    <Form.Select
                                      value={registerForm.campus}
                                      onChange={(e) => setRegisterForm({...registerForm, campus: e.target.value})}
                                      isInvalid={!!errors.campus}
                                    >
                                      <option value="">Select Campus</option>
                                      {campusOptions.map(campus => (
                                        <option key={campus} value={campus}>{campus}</option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {errors.campus}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Form.Group className="mb-3">
                                <Form.Label>Branch *</Form.Label>
                                <Form.Select
                                  value={registerForm.branch}
                                  onChange={(e) => setRegisterForm({...registerForm, branch: e.target.value})}
                                  isInvalid={!!errors.branch}
                                >
                                  <option value="">Select Branch</option>
                                  {branchOptions.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {errors.branch}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </>
                          )}

                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number *</Form.Label>
                            <Form.Control
                              type="tel"
                              placeholder="+919876543210"
                              value={registerForm.phoneNumber}
                              onChange={(e) => setRegisterForm({...registerForm, phoneNumber: e.target.value})}
                              isInvalid={!!errors.phoneNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.phoneNumber}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Password *</Form.Label>
                            <InputGroup>
                              <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="At least 8 characters"
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                                isInvalid={!!errors.password}
                              />
                              <Button
                                variant="outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </Button>
                              <Form.Control.Feedback type="invalid">
                                {errors.password}
                              </Form.Control.Feedback>
                            </InputGroup>
                            
                            {registerForm.password && (
                              <div className="mt-2">
                                <div className="d-flex justify-content-between small">
                                  <span>Password Strength:</span>
                                  <span className={`text-${getPasswordStrengthColor(passwordStrength)}`}>
                                    {getPasswordStrengthText(passwordStrength)}
                                  </span>
                                </div>
                                <ProgressBar
                                  now={passwordStrength}
                                  variant={getPasswordStrengthColor(passwordStrength)}
                                  size="sm"
                                />
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Confirm Password *</Form.Label>
                            <InputGroup>
                              <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={registerForm.confirmPassword}
                                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                                isInvalid={!!errors.confirmPassword}
                              />
                              <Button
                                variant="outline-secondary"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </Button>
                              <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>

                          <Form.Group className="mb-4">
                            <Form.Check
                              type="checkbox"
                              label={
                                <span>
                                  I agree to the{' '}
                                  <Button variant="link" className="p-0 text-decoration-none">
                                    Terms and Conditions
                                  </Button>
                                  {' '}and{' '}
                                  <Button variant="link" className="p-0 text-decoration-none">
                                    Privacy Policy
                                  </Button>
                                </span>
                              }
                              checked={registerForm.agreeToTerms}
                              onChange={(e) => setRegisterForm({...registerForm, agreeToTerms: e.target.checked})}
                              isInvalid={!!errors.agreeToTerms}
                            />
                            {errors.agreeToTerms && (
                              <div className="text-danger small mt-1">{errors.agreeToTerms}</div>
                            )}
                          </Form.Group>

                          <div className="d-grid">
                            <Button
                              variant="success"
                              size="lg"
                              type="submit"
                              disabled={loading}
                              className="fw-bold"
                            >
                              {loading ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Creating Account...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-user-plus me-2"></i>
                                  Create Account
                                </>
                              )}
                            </Button>
                          </div>
                        </Form>
                      </Tab>
                    </Tabs>

                    <div className="text-center mt-4">
                      <small className="text-muted">
                        <i className="fas fa-shield-alt me-1"></i>
                        Your data is protected with industry-standard encryption
                      </small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Demo Credentials */}
            <Card className={`mt-4 border-0 ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
              <Card.Body>
                <h6 className="text-center mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Demo Credentials for Testing
                </h6>
                <Row className="text-center">
                  <Col md={4}>
                    <div className="mb-2">
                      <Badge bg="primary" className="mb-1">Student</Badge>
                      <div><small><strong>Username:</strong> john_doe</small></div>
                      <div><small><strong>Password:</strong> password</small></div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <Badge bg="success" className="mb-1">Faculty</Badge>
                      <div><small><strong>Username:</strong> faculty_user</small></div>
                      <div><small><strong>Password:</strong> password</small></div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <Badge bg="danger" className="mb-1">Admin</Badge>
                      <div><small><strong>Username:</strong> admin</small></div>
                      <div><small><strong>Password:</strong> password</small></div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AuthPage;
