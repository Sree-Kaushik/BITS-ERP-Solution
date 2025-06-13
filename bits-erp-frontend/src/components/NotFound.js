import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="mb-4">
                <i className="fas fa-search" style={{ fontSize: '5rem', color: '#6c757d' }}></i>
              </div>
              
              <h1 className="display-1 fw-bold text-primary">404</h1>
              <h3 className="mb-3">Page Not Found</h3>
              <p className="text-muted mb-4">
                Sorry, the page you are looking for doesn't exist or has been moved.
              </p>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Button variant="primary" onClick={handleGoBack} className="me-md-2">
                  <i className="fas fa-arrow-left me-2"></i>
                  Go Back
                </Button>
                <Button variant="outline-primary" as={Link} to="/dashboard">
                  <i className="fas fa-home me-2"></i>
                  Go to Dashboard
                </Button>
              </div>
              
              <hr className="my-4" />
              
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <Link to="/profile" className="text-decoration-none">
                    <i className="fas fa-user fa-2x text-primary mb-2 d-block"></i>
                    <small>Profile</small>
                  </Link>
                </div>
                <div className="col-md-4 mb-3">
                  <Link to="/grades" className="text-decoration-none">
                    <i className="fas fa-chart-line fa-2x text-success mb-2 d-block"></i>
                    <small>Grades</small>
                  </Link>
                </div>
                <div className="col-md-4 mb-3">
                  <Link to="/timetable" className="text-decoration-none">
                    <i className="fas fa-calendar-alt fa-2x text-info mb-2 d-block"></i>
                    <small>Timetable</small>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
