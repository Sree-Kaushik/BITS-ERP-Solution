BITS Campus ERP - Complete University Management System
![BITS Logo](https://img.shields.io/badge/BITS-Pilani-blue?style=for-the-badge&logo=graduationio/badge/Node.js-18+-green?style=for.shields.io/badge/PostgreSQL-14+-blue?style=forcifically for BITS Pilani campus management. This full-stack web application streamlines university operations including student management, academic processes, campus services, and administrative functions.

🎯 Project Overview
BITS Campus ERP is a production-ready university management system that demonstrates advanced full-stack development skills, database management concepts, and enterprise software architecture. Built with modern web technologies, it provides a complete solution for educational institution management.

🏆 Key Achievements
Complete ERP Solution: 15+ integrated modules covering all university operations

Advanced DBMS Implementation: Complex database design with triggers, procedures, and transactions

Enterprise Security: JWT authentication, role-based access control, and data protection

Modern Architecture: 3-tier architecture with RESTful APIs and responsive design

AI-Powered Features: Smart course recommendations and analytics dashboard

🚀 Features
👨‍🎓 Student Management
Student Profiles: Comprehensive student information management with academic records

Academic Records: Grade tracking, CGPA calculation, and transcript generation

Attendance Monitoring: Real-time attendance tracking and reporting with analytics

Course Enrollment: Semester-wise course registration and management system

📚 Academic System
Course Management: Complete course catalog and curriculum management

Examination System: Exam scheduling, registration, and result processing

Grade Management: Automated grade calculation with CGPA updates via database triggers

Academic Calendar: Event scheduling and academic timeline management

Timetable Management: Class scheduling and room allocation system

🏢 Campus Services
Library Management: Book catalog, issuing system, fine management, and digital resources

Hostel Management: Room allocation, occupancy tracking, and maintenance requests

Fee Management: Online payment system with transaction tracking and receipt generation

Document Management: Digital document storage, verification, and access control

🤖 Advanced Features
AI Course Recommendations: Personalized course suggestions based on academic performance

Analytics Dashboard: Comprehensive performance metrics and predictive insights

Study Planner: Smart scheduling with AI-powered study recommendations

Real-time Chat System: Multi-room communication platform for students and faculty

Notification System: Real-time alerts, announcements, and academic updates

🔐 Security & Administration
Role-Based Access Control: Student, Faculty, and Admin roles with granular permissions

JWT Authentication: Secure token-based authentication with session management

Data Validation: Comprehensive input validation and sanitization at all levels

Audit Trails: Complete activity logging and security monitoring

🛠️ Technology Stack
Frontend
React.js 18.2.0: Modern component-based UI framework with hooks

Bootstrap 5.3.0: Responsive CSS framework with custom theming

React Router 6.3.0: Client-side routing with protected routes

Axios: HTTP client for API communication with interceptors

React Toastify: User notification system with custom styling

FontAwesome: Professional icon library for enhanced UI

Backend
Node.js 18+: JavaScript runtime environment with ES6+ features

Express.js 4.18.2: Web application framework with middleware support

PostgreSQL 14+: Advanced relational database with JSON support

JWT: JSON Web Token authentication with refresh tokens

Bcrypt: Password hashing and security with salt rounds

Joi: Data validation library with custom schemas

CORS: Cross-origin resource sharing configuration

Helmet: Security middleware for HTTP headers

Database
PostgreSQL: Primary database with advanced features

Complex SQL Queries: JOINs, aggregations, subqueries, and window functions

Database Triggers: Automated business logic for CGPA calculation

Stored Procedures: Complex data operations and batch processing

Transaction Management: ACID compliance with rollback support

Connection Pooling: Efficient database connection management

📁 Project Structure
text
bits-erp-system/
├── bits-erp-frontend/          # React.js Frontend Application
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # React Components
│   │   │   ├── AuthPage.js     # Login/Registration
│   │   │   ├── Navbar.js       # Navigation with role-based menus
│   │   │   ├── Dashboard.js    # Main dashboard with metrics
│   │   │   ├── StudentProfile.js # Student information display
│   │   │   ├── Grades.js       # Grade management and display
│   │   │   ├── Examinations.js # Exam registration and results
│   │   │   ├── TimeTable.js    # Class schedule management
│   │   │   ├── Library.js      # Library book search and transactions
│   │   │   ├── HostelManagement.js # Room allocation and management
│   │   │   ├── FeeManagement.js # Fee payment and tracking
│   │   │   ├── AcademicCalendar.js # Academic events calendar
│   │   │   ├── AnalyticsDashboard.js # Performance analytics
│   │   │   ├── StudyPlanner.js # AI-powered study scheduling
│   │   │   └── ChatSystem.js   # Real-time communication
│   │   ├── contexts/           # React Context Providers
│   │   │   └── AuthContext.js  # Authentication state management
│   │   ├── assets/            # Static Assets
│   │   │   └── images/        # Logo and images
│   │   ├── App.js             # Main application component
│   │   ├── index.js           # Application entry point
│   │   └── index.css          # Global styles and themes
│   └── package.json           # Frontend dependencies
├── bits-erp-backend/           # Node.js Backend Application
│   ├── config/
│   │   └── database.js        # Database connection configuration
│   ├── middleware/
│   │   └── auth.js            # Authentication and authorization
│   ├── routes/                # API Route Handlers
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── students.js        # Student management APIs
│   │   ├── examinations.js    # Examination system APIs
│   │   ├── academic.js        # Academic calendar and timetable
│   │   ├── library.js         # Library management APIs
│   │   ├── hostel.js          # Hostel management APIs
│   │   ├── notifications.js   # Notification system APIs
│   │   └── fees.js            # Fee management APIs
│   ├── server.js              # Main server application
│   ├── .env                   # Environment variables
│   └── package.json           # Backend dependencies
└── bits-erp-sql/              # Database Scripts and Schema
    ├── database_setup.sql     # Initial database and user setup
    ├── schema_design.sql      # Core table structure and relationships
    ├── enhanced_schema.sql    # Advanced features and tables
    ├── triggers.sql           # Database triggers for automation
    ├── procedures.sql         # Stored procedures for complex operations
    └── sample_data.sql        # Test data for development
🔧 Installation & Setup
Prerequisites
Node.js 18+: Download Node.js

PostgreSQL 14+: Download PostgreSQL

Git: Download Git

VS Code: Download VS Code (Recommended)

1. Clone the Repository
bash
git clone https://github.com/yourusername/bits-campus-erp.git
cd bits-campus-erp
2. Database Setup
Start PostgreSQL Service
bash
# macOS (using Homebrew)
brew services start postgresql

# Windows
net start postgresql

# Linux (Ubuntu/Debian)
sudo systemctl start postgresql
Create Database and Run Scripts
bash
# Connect to PostgreSQL
psql postgres

# In PostgreSQL prompt, run scripts in order:
\i /path/to/bits-erp-sql/database_setup.sql
\i /path/to/bits-erp-sql/schema_design.sql
\i /path/to/bits-erp-sql/enhanced_schema.sql
\i /path/to/bits-erp-sql/triggers.sql
\i /path/to/bits-erp-sql/procedures.sql
\i /path/to/bits-erp-sql/sample_data.sql

# Verify database creation
\c bits_campus_erp
\dt
\q
3. Backend Setup
bash
# Navigate to backend directory
cd bits-erp-backend

# Install dependencies
npm install

# Create environment file
touch .env

# Edit .env file with your database credentials
nano .env
Environment Variables (.env)
text
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bits_campus_erp
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_min_32_chars
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Security Configuration
BCRYPT_SALT_ROUNDS=12
API_RATE_LIMIT=100
Start Backend Server
bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
4. Frontend Setup
bash
# Navigate to frontend directory
cd bits-erp-frontend

# Install dependencies
npm install

# Install additional dependencies for enhanced features
npm install web-vitals @fortawesome/fontawesome-free

# Start development server
npm start
🚀 Running the Application
Development Mode
Terminal 1 - Backend Server:

bash
cd bits-erp-backend
npm run dev
Terminal 2 - Frontend Server:

bash
cd bits-erp-frontend
npm start
Terminal 3 - Concurrent Development (Optional):

bash
cd bits-erp-backend
npm run dev-full  # Runs both frontend and backend
Access Points
Frontend Application: http://localhost:3001

Backend API: http://localhost:3000/api

API Documentation: http://localhost:3000/api

Health Check: http://localhost:3000/api/health

Demo Credentials
text
Admin User:
Username: admin
Password: password

Student User:
Username: john_doe
Password: password

Faculty User:
Username: faculty_user
Password: password
🏗️ Database Architecture
Core Tables
users: User authentication and basic information

students: Student-specific data and academic records

faculty: Faculty information and department details

courses: Course catalog and curriculum data

enrollments: Student-course relationships with semester tracking

grades: Academic performance records with automated CGPA calculation

examinations: Exam scheduling and management system

attendance: Class attendance tracking with analytics

Advanced Tables
academic_calendar: Academic events and scheduling system

library_books: Comprehensive library catalog management

library_transactions: Book issuing, returns, and fine management

hostels: Hostel and accommodation data management

hostel_allocations: Room assignment and occupancy tracking

fee_structure: Fee categories, amounts, and payment schedules

fee_payments: Payment processing and transaction history

notifications: System-wide messaging and alert system

Database Features
Triggers: Automatic CGPA calculation, timestamp updates, audit logging

Stored Procedures: Complex business logic operations and batch processing

Views: Simplified data access for reporting and analytics

Constraints: Data integrity validation and referential integrity

Indexes: Performance optimization for frequently queried data

🔌 API Documentation
Authentication Endpoints
text
POST /api/auth/login              # User authentication
POST /api/auth/register           # New user registration
GET  /api/auth/profile            # Get current user profile
PUT  /api/auth/profile            # Update user profile
PUT  /api/auth/change-password    # Change user password
POST /api/auth/logout             # User logout
Student Management APIs
text
GET  /api/students                # List all students (admin/faculty only)
GET  /api/students/:id            # Get specific student details
GET  /api/students/:id/grades     # Get student academic grades
GET  /api/students/:id/attendance # Get student attendance records
PUT  /api/students/:id            # Update student information
Academic System APIs
text
GET  /api/academic/calendar       # Get academic calendar events
GET  /api/academic/timetable/:studentId # Get student timetable
POST /api/academic/calendar       # Add calendar event (admin only)
PUT  /api/academic/calendar/:id   # Update calendar event
DELETE /api/academic/calendar/:id # Delete calendar event
Examination System APIs
text
GET  /api/examinations            # List available examinations
POST /api/examinations/:id/register # Register for examination
GET  /api/examinations/registrations/:studentId # Get exam registrations
PUT  /api/examinations/:id/result # Update exam results (faculty only)
Campus Services APIs
text
# Library Management
GET  /api/library/books/search    # Search library books
GET  /api/library/transactions/:studentId # Library transaction history
POST /api/library/issue           # Issue book to student
PUT  /api/library/return/:id      # Return book and calculate fines

# Hostel Management
GET  /api/hostel                  # List available hostels
GET  /api/hostel/:id/rooms        # Get available rooms
POST /api/hostel/apply            # Apply for hostel accommodation
PUT  /api/hostel/allocation/:id   # Update room allocation

# Fee Management
GET  /api/fees/structure          # Get fee structure
GET  /api/fees/payments           # Get payment history
POST /api/fees/pay                # Process fee payment
GET  /api/fees/receipt/:id        # Download payment receipt
🧪 Testing
Backend Testing
bash
cd bits-erp-backend

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Test specific API endpoints
curl -X GET http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
Frontend Testing
bash
cd bits-erp-frontend

# Run React component tests
npm test

# Run tests in watch mode
npm test -- --watch

# Build for production and test
npm run build
npm run test:build
Database Testing
sql
-- Connect to test database
\c bits_campus_erp

-- Verify table structure
\dt

-- Test sample queries
SELECT * FROM users LIMIT 5;
SELECT * FROM students s JOIN users u ON s.user_id = u.user_id LIMIT 5;

-- Test triggers
INSERT INTO grades (student_id, course_id, grade_points) 
VALUES ('2021A7PS001P', 'CS101', 9.0);

-- Verify CGPA calculation
SELECT cgpa FROM students WHERE student_id = '2021A7PS001P';
🚀 Deployment
Production Build
Frontend Production Build
bash
cd bits-erp-frontend

# Create optimized production build
npm run build

# Test production build locally
npx serve -s build -l 3001

# Analyze bundle size
npm run analyze
Backend Production Setup
bash
cd bits-erp-backend

# Install production dependencies only
npm ci --only=production

# Set production environment
export NODE_ENV=production

# Start production server
npm start
Environment Configuration for Production
text
# Production Environment Variables
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=bits_campus_erp_prod
DB_USER=your_production_db_user
DB_PASSWORD=your_secure_production_password
JWT_SECRET=your_super_secure_production_jwt_secret_min_64_chars
FRONTEND_URL=https://your-domain.com
API_RATE_LIMIT=50
BCRYPT_SALT_ROUNDS=14
Recommended Deployment Platforms
Frontend: Netlify, Vercel, AWS S3 + CloudFront

Backend: Heroku, AWS EC2, DigitalOcean Droplets

Database: AWS RDS PostgreSQL, Heroku Postgres, DigitalOcean Managed Database

Docker Deployment (Optional)
text
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
🔒 Security Features
Authentication & Authorization
JWT Tokens: Secure stateless authentication with configurable expiration

Password Hashing: Bcrypt with configurable salt rounds (minimum 12)

Role-Based Access: Granular permissions for Student, Faculty, and Admin roles

Session Management: Token refresh mechanism and secure logout

Data Protection
Input Validation: Comprehensive Joi schema validation for all endpoints

SQL Injection Prevention: Parameterized queries and prepared statements

XSS Protection: Input sanitization and output encoding

CORS Configuration: Controlled cross-origin access with whitelist

Rate Limiting: API abuse prevention with configurable limits

Security Headers & Middleware
Helmet.js: Comprehensive security headers configuration

HTTPS Enforcement: Secure data transmission in production

Content Security Policy: XSS attack prevention

CSRF Protection: Cross-site request forgery prevention

📊 Performance Optimization
Database Optimization
Connection Pooling: Efficient database connection management (max 20 connections)

Query Optimization: Indexed searches, optimized JOINs, and query analysis

Caching Strategy: Frequently accessed data caching with TTL

Database Triggers: Automated calculations to reduce API processing time

Frontend Optimization
Code Splitting: Lazy loading of components and routes

Asset Optimization: Minified CSS and JavaScript with compression

Responsive Design: Mobile-first approach with optimized images

Error Boundaries: Graceful error handling and user feedback

Backend Optimization
Middleware Optimization: Efficient request processing pipeline

Error Handling: Comprehensive error management with logging

Structured Logging: Winston-based logging with log levels

Performance Monitoring: Request timing and resource usage tracking

🤝 Contributing
Development Workflow
Fork the repository and create your feature branch

Set up development environment following installation guide

Create feature branch: git checkout -b feature/AmazingFeature

Make your changes with proper testing

Commit changes: git commit -m 'Add AmazingFeature'

Push to branch: git push origin feature/AmazingFeature

Open Pull Request with detailed description

Code Standards
ESLint: JavaScript linting with Airbnb configuration

Prettier: Code formatting with consistent style

JSDoc: Function and API documentation

Git Hooks: Pre-commit validation and testing

Conventional Commits: Standardized commit message format

Testing Requirements
Unit Tests: Minimum 80% code coverage

Integration Tests: API endpoint testing

Component Tests: React component testing with Jest

Database Tests: SQL query and trigger testing

🐛 Troubleshooting
Common Issues and Solutions
Database Connection Errors
bash
# Check PostgreSQL service status
brew services list | grep postgresql

# Restart PostgreSQL service
brew services restart postgresql

# Test database connection
psql -h localhost -p 5432 -U your_username -d bits_campus_erp

# Check database logs
tail -f /usr/local/var/log/postgres.log
Frontend Build Errors
bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Clear React build cache
rm -rf build/

# Rebuild application
npm run build
Backend API Errors
bash
# Check environment variables
cat .env

# Verify all required variables are set
node -e "console.log(process.env.DB_HOST, process.env.JWT_SECRET)"

# Test database connection
npm run test-db

# Check server logs
DEBUG=* npm run dev
Authentication Issues
bash
# Verify JWT secret is set and secure
echo $JWT_SECRET

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Check token validation
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
Debug Mode
bash
# Backend debug mode with detailed logging
DEBUG=express:*,bits-erp:* npm run dev

# Frontend verbose mode
REACT_APP_DEBUG=true npm start

# Database query logging
DEBUG=knex:query npm run dev
📈 Future Enhancements
Planned Features
Mobile Application: React Native mobile app for students and faculty

Advanced Analytics: Machine learning insights for academic performance prediction

Integration APIs: Third-party service integration (Google Calendar, Microsoft Teams)

Microservices Architecture: Service-oriented architecture for better scalability

Real-time Features: WebSocket implementation for live notifications and chat

Scalability Improvements
Load Balancing: Multiple server instances with nginx load balancer

Database Sharding: Horizontal scaling for large datasets

CDN Integration: Global content delivery for static assets

Caching Layer: Redis implementation for session management and caching

Monitoring: Application performance monitoring with Prometheus and Grafana

AI/ML Enhancements
Predictive Analytics: Student performance prediction models

Recommendation Engine: Advanced course recommendation algorithms

Natural Language Processing: Chatbot with NLP capabilities

Automated Insights: AI-generated academic reports and insights

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

text
MIT License

Copyright (c) 2025 Sree Kaushik Reddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
👨‍💻 Author
Sree Kaushik Reddy

GitHub: @sreekaushikreddy

LinkedIn: Sree Kaushik Reddy

Email: sreekaushik@bits-pilani.ac.in

Portfolio: sreekaushikreddy.dev

🙏 Acknowledgments
BITS Pilani: For inspiration and educational excellence in technology education

Open Source Community: For amazing tools, libraries, and continuous innovation

React Team: For the fantastic frontend framework and ecosystem

Node.js Community: For the robust backend ecosystem and middleware

PostgreSQL Team: For the powerful and reliable database system

Bootstrap Team: For the responsive CSS framework

Contributors: All developers who contributed to this project

📞 Support & Documentation
Getting Help
GitHub Issues: Create an issue

Documentation: Project Wiki

Email Support: support@bits-erp.com

Developer Chat: Discord Server

Additional Resources
API Documentation: Postman Collection

Video Tutorials: YouTube Playlist

Development Blog: Medium Articles

🌟 Project Statistics
![GitHub stars](https://img.shields.io/github/stars/yourusorks](https://img.shields.io/github/forks/shields.io/github/issues/](https://img.shields.io/github ❤️ for BITS Pilani Community**

This project demonstrates advanced full-stack development skills, database management expertise, and enterprise software architecture. It serves as an excellent portfolio piece for campus placement interviews and showcases proficiency in modern web development technologies, making it ideal for software engineering roles.

📋 Quick Start Checklist
 Install Node.js 18+ and PostgreSQL 14+

 Clone the repository

 Set up database with provided SQL scripts

 Configure environment variables

 Install backend dependencies (npm install)

 Install frontend dependencies (npm install)

 Start backend server (npm run dev)

 Start frontend server (npm start)

 Access application at http://localhost:3001

 Login with demo credentials

 Explore all features and modules

