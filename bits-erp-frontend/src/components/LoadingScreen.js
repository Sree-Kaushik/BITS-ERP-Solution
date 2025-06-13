import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

function LoadingScreen() {
  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Container className="text-center">
        <div className="mb-4">
          <div 
            className="rounded-circle bg-white d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: '100px', height: '100px', fontSize: '2.5rem', fontWeight: 'bold', color: '#0066cc' }}
          >
            BITS
          </div>
        </div>
        
        <h3 className="text-white mb-3">BITS Campus ERP</h3>
        <p className="text-white-50 mb-4">Loading your personalized experience...</p>
        
        <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        
        <div className="mt-4">
          <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: '100%', backgroundColor: '#ffffff' }}
            ></div>
          </div>
        </div>
        
        <p className="text-white-50 mt-3 small">
          Initializing secure connection and loading your data...
        </p>
      </Container>
    </div>
  );
}

export default LoadingScreen;
