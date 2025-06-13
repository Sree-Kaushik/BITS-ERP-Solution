-- Additional tables based on BITS ERP features

-- Academic Calendar
CREATE TABLE academic_calendar (
    calendar_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'exam', 'registration', 'holiday', 'semester_start', 'semester_end'
    start_date DATE NOT NULL,
    end_date DATE,
    academic_year INTEGER NOT NULL,
    semester_type semester_type NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time Table
CREATE TABLE time_table (
    timetable_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id VARCHAR(20) REFERENCES courses(course_id),
    faculty_id VARCHAR(20) REFERENCES faculty(faculty_id),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(20),
    class_type VARCHAR(20) DEFAULT 'lecture', -- 'lecture', 'lab', 'tutorial'
    semester_year INTEGER NOT NULL,
    semester_type semester_type NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Library Management
CREATE TABLE library_books (
    book_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(300) NOT NULL,
    author VARCHAR(200) NOT NULL,
    publisher VARCHAR(200),
    publication_year INTEGER,
    category VARCHAR(100),
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    location VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE library_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id),
    book_id UUID REFERENCES library_books(book_id),
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount DECIMAL(8,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'issued', -- 'issued', 'returned', 'overdue'
    renewed_count INTEGER DEFAULT 0
);

-- Hostel Management
CREATE TABLE hostels (
    hostel_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_name VARCHAR(100) NOT NULL,
    hostel_type VARCHAR(20) NOT NULL, -- 'boys', 'girls'
    total_rooms INTEGER NOT NULL,
    warden_name VARCHAR(100),
    contact_number VARCHAR(15),
    address TEXT
);

CREATE TABLE hostel_rooms (
    room_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID REFERENCES hostels(hostel_id),
    room_number VARCHAR(10) NOT NULL,
    room_type VARCHAR(20) DEFAULT 'shared', -- 'single', 'shared'
    capacity INTEGER DEFAULT 2,
    current_occupancy INTEGER DEFAULT 0,
    monthly_fee DECIMAL(8,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE hostel_allocations (
    allocation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id),
    room_id UUID REFERENCES hostel_rooms(room_id),
    allocation_date DATE DEFAULT CURRENT_DATE,
    checkout_date DATE,
    academic_year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'checkout', 'transferred'
    UNIQUE(student_id, academic_year)
);

-- Parent/Guardian Information
CREATE TABLE parents (
    parent_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id),
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    father_occupation VARCHAR(100),
    mother_occupation VARCHAR(100),
    father_phone VARCHAR(15),
    mother_phone VARCHAR(15),
    father_email VARCHAR(100),
    mother_email VARCHAR(100),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(15),
    guardian_email VARCHAR(100),
    address TEXT,
    emergency_contact VARCHAR(15)
);

-- Disciplinary Records
CREATE TABLE disciplinary_records (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id),
    incident_date DATE NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    action_taken TEXT,
    reported_by UUID REFERENCES users(user_id),
    severity VARCHAR(20) DEFAULT 'minor', -- 'minor', 'major', 'severe'
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'resolved', 'appealed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Records
CREATE TABLE medical_records (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id),
    visit_date DATE DEFAULT CURRENT_DATE,
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    prescribed_medicines TEXT,
    doctor_name VARCHAR(100),
    follow_up_date DATE,
    medical_certificate_issued BOOLEAN DEFAULT FALSE
);

-- Placement Records
CREATE TABLE companies (
    company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(200) NOT NULL,
    company_type VARCHAR(50), -- 'core', 'software', 'consulting', 'finance'
    website VARCHAR(200),
    hr_contact VARCHAR(100),
    hr_email VARCHAR(100),
    hr_phone VARCHAR(15),
    address TEXT
);

CREATE TABLE placement_drives (
    drive_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(company_id),
    job_title VARCHAR(200) NOT NULL,
    job_description TEXT,
    eligibility_criteria TEXT,
    ctc_offered DECIMAL(10,2),
    application_deadline DATE,
    interview_date DATE,
    drive_status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE placement_applications (
    application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id),
    drive_id UUID REFERENCES placement_drives(drive_id),
    application_date DATE DEFAULT CURRENT_DATE,
    resume_path VARCHAR(500),
    cover_letter TEXT,
    status VARCHAR(20) DEFAULT 'applied', -- 'applied', 'shortlisted', 'selected', 'rejected'
    interview_feedback TEXT,
    offer_letter_path VARCHAR(500)
);

-- Notifications system
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'grade', 'exam', 'library', 'hostel', 'fee', 'general'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    target_user_id UUID REFERENCES users(user_id),
    target_role user_role,
    is_global BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE notification_reads (
    notification_id UUID REFERENCES notifications(notification_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (notification_id, user_id)
);

-- Insert sample data for enhanced features
INSERT INTO academic_calendar (event_name, event_type, start_date, end_date, academic_year, semester_type, description) VALUES
('Monsoon Semester Registration', 'registration', '2024-07-15', '2024-07-25', 2024, 'monsoon', 'Course registration for Monsoon 2024'),
('Monsoon Semester Classes Begin', 'semester_start', '2024-08-01', '2024-08-01', 2024, 'monsoon', 'First day of classes'),
('Mid Semester Exams', 'exam', '2024-09-20', '2024-09-30', 2024, 'monsoon', 'Mid semester examinations'),
('Diwali Break', 'holiday', '2024-11-01', '2024-11-05', 2024, 'monsoon', 'Diwali festival break'),
('Final Exams', 'exam', '2024-12-01', '2024-12-15', 2024, 'monsoon', 'Final semester examinations');

INSERT INTO hostels (hostel_name, hostel_type, total_rooms, warden_name, contact_number) VALUES
('Vyas Bhawan', 'boys', 200, 'Dr. Rajesh Kumar', '+91-1596-242001'),
('Shankar Bhawan', 'boys', 180, 'Prof. Amit Sharma', '+91-1596-242002'),
('Saraswati Bhawan', 'girls', 150, 'Dr. Priya Singh', '+91-1596-242003'),
('Meera Bhawan', 'girls', 120, 'Prof. Sunita Gupta', '+91-1596-242004');

INSERT INTO library_books (isbn, title, author, publisher, publication_year, category, total_copies, available_copies) VALUES
('978-0-13-110362-7', 'Database System Concepts', 'Abraham Silberschatz', 'McGraw-Hill', 2019, 'Computer Science', 5, 3),
('978-0-262-03384-8', 'Introduction to Algorithms', 'Thomas H. Cormen', 'MIT Press', 2009, 'Computer Science', 8, 5),
('978-0-07-352269-9', 'Operating System Concepts', 'Abraham Silberschatz', 'Wiley', 2018, 'Computer Science', 6, 4);

-- Insert sample notifications
INSERT INTO notifications (title, message, type, priority, is_global) VALUES
('System Maintenance', 'The ERP system will be under maintenance on Sunday 2:00 AM - 4:00 AM', 'general', 'medium', true),
('New Feature Available', 'AI-based course recommendations are now available in your dashboard', 'general', 'low', true);
