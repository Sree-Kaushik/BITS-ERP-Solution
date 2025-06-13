import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Main Components
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import StudentProfile from './components/StudentProfile';
import UserSettings from './components/UserSettings';
import UserPreferences from './components/UserPreferences';

// Academic Components
import Examinations from './components/Examinations';
import Grades from './components/Grades';
import AcademicCalendar from './components/AcademicCalendar';
import TimeTable from './components/TimeTable';
import CourseRecommendations from './components/CourseRecommendations';

// Campus Services
import Library from './components/Library';
import HostelManagement from './components/HostelManagement';
import FeeManagement from './components/FeeManagement';

// Advanced Features
import AnalyticsDashboard from './components/AnalyticsDashboard';
import StudyPlanner from './components/StudyPlanner';
import ChatSystem from './components/ChatSystem';
import NotificationCenter from './components/NotificationCenter';
import HelpSupport from './components/HelpSupport';
import FeedbackForm from './components/FeedbackForm';

// Admin/Faculty Components
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import StudentManagement from './components/StudentManagement';
import CourseManagement from './components/CourseManagement';
import AttendanceManagement from './components/AttendanceManagement';
import GradeEntry from './components/GradeEntry';
import ReportsManagement from './components/ReportsManagement';
import SystemSettings from './components/SystemSettings';

// Error and Loading Components
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import NotFound from './components/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppContent />
            <ToastContainer 
              position="top-right" 
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastClassName="custom-toast"
              bodyClassName="custom-toast-body"
            />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {user && <Navbar />}
      <div className={user ? 'content-with-navbar' : ''}>
        <Routes>
          {/* Authentication Routes */}
          <Route 
            path="/auth" 
            element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/login" 
            element={<Navigate to="/auth" replace />} 
          />
          
          {/* Dashboard Routes - Role-based */}
          <Route 
            path="/dashboard" 
            element={
              user ? (
                user.role === 'admin' ? <AdminDashboard /> :
                user.role === 'faculty' ? <FacultyDashboard /> :
                <Dashboard />
              ) : <Navigate to="/auth" replace />
            } 
          />
          
          {/* Student Routes */}
          <Route 
            path="/profile" 
            element={user ? <StudentProfile /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/grades" 
            element={user ? <Grades /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/timetable" 
            element={user ? <TimeTable /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/recommendations" 
            element={user ? <CourseRecommendations /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/analytics" 
            element={user ? <AnalyticsDashboard /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/study-planner" 
            element={user ? <StudyPlanner /> : <Navigate to="/auth" replace />} 
          />
          
          {/* Campus Services Routes */}
          <Route 
            path="/library" 
            element={user ? <Library /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/hostel" 
            element={user ? <HostelManagement /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/fees" 
            element={user ? <FeeManagement /> : <Navigate to="/auth" replace />} 
          />
          
          {/* Academic Routes */}
          <Route 
            path="/examinations" 
            element={user ? <Examinations /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/calendar" 
            element={user ? <AcademicCalendar /> : <Navigate to="/auth" replace />} 
          />
          
          {/* Communication Routes */}
          <Route 
            path="/chat" 
            element={user ? <ChatSystem /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/notifications" 
            element={user ? <NotificationCenter /> : <Navigate to="/auth" replace />} 
          />
          
          {/* Faculty Routes */}
          <Route 
            path="/students" 
            element={
              user && (user.role === 'faculty' || user.role === 'admin') ? 
              <StudentManagement /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/courses" 
            element={
              user && (user.role === 'faculty' || user.role === 'admin') ? 
              <CourseManagement /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/attendance" 
            element={
              user && (user.role === 'faculty' || user.role === 'admin') ? 
              <AttendanceManagement /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/grade-entry" 
            element={
              user && (user.role === 'faculty' || user.role === 'admin') ? 
              <GradeEntry /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          
          {/* Admin Only Routes */}
          <Route 
            path="/manage-students" 
            element={
              user && user.role === 'admin' ? 
              <StudentManagement /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/manage-faculty" 
            element={
              user && user.role === 'admin' ? 
              <FacultyManagement /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/manage-courses" 
            element={
              user && user.role === 'admin' ? 
              <CourseManagement /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/reports" 
            element={
              user && user.role === 'admin' ? 
              <ReportsManagement /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/system-settings" 
            element={
              user && user.role === 'admin' ? 
              <SystemSettings /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/user-management" 
            element={
              user && user.role === 'admin' ? 
              <UserManagement /> : 
              <Navigate to="/dashboard" replace />
            } 
          />
          
          {/* Settings and Support Routes */}
          <Route 
            path="/settings" 
            element={user ? <UserSettings /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/preferences" 
            element={user ? <UserPreferences /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/help" 
            element={user ? <HelpSupport /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/feedback" 
            element={user ? <FeedbackForm /> : <Navigate to="/auth" replace />} 
          />
          
          {/* Default Routes */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} 
          />
          
          {/* 404 Route */}
          <Route 
            path="*" 
            element={user ? <NotFound /> : <Navigate to="/auth" replace />} 
          />
        </Routes>
      </div>
    </>
  );
}

// Additional Components for Complete Functionality

// Faculty Management Component
function FacultyManagement() {
  return (
    <div className="container mt-4">
      <h2><i className="fas fa-chalkboard-teacher me-2"></i>Faculty Management</h2>
      <p>Comprehensive faculty management system coming soon...</p>
    </div>
  );
}

// User Management Component
function UserManagement() {
  return (
    <div className="container mt-4">
      <h2><i className="fas fa-users-cog me-2"></i>User Management</h2>
      <p>User administration interface coming soon...</p>
    </div>
  );
}

export default App;
