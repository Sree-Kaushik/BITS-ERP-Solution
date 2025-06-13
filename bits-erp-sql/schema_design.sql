-- Users table (for authentication and basic info)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(15),
    address TEXT,
    campus VARCHAR(50) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    batch_year INTEGER NOT NULL,
    current_semester INTEGER DEFAULT 1,
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Faculty table
CREATE TABLE faculty (
    faculty_id VARCHAR(20) PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    phone VARCHAR(15),
    office_location VARCHAR(100),
    specialization TEXT,
    joining_date DATE DEFAULT CURRENT_DATE
);

-- Courses table
CREATE TABLE courses (
    course_id VARCHAR(20) PRIMARY KEY,
    course_name VARCHAR(200) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0),
    department VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    course_type VARCHAR(50) DEFAULT 'core',
    prerequisites TEXT,
    description TEXT
);

-- Course enrollment table
CREATE TABLE enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id) ON DELETE CASCADE,
    course_id VARCHAR(20) REFERENCES courses(course_id) ON DELETE CASCADE,
    semester_year INTEGER NOT NULL,
    semester_type semester_type NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(student_id, course_id, semester_year, semester_type)
);

-- Examinations table
CREATE TABLE examinations (
    exam_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name VARCHAR(200) NOT NULL,
    exam_type exam_type NOT NULL,
    semester_type semester_type NOT NULL,
    academic_year INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE NOT NULL,
    registration_end DATE NOT NULL,
    exam_fee DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE
);

-- Exam registrations table
CREATE TABLE exam_registrations (
    registration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id) ON DELETE CASCADE,
    exam_id UUID REFERENCES examinations(exam_id) ON DELETE CASCADE,
    course_id VARCHAR(20) REFERENCES courses(course_id) ON DELETE CASCADE,
    registration_date DATE DEFAULT CURRENT_DATE,
    exam_type exam_type NOT NULL,
    fees_paid BOOLEAN DEFAULT FALSE,
    hall_ticket_number VARCHAR(50),
    seat_number VARCHAR(20),
    UNIQUE(student_id, exam_id, course_id)
);

-- Grades table
CREATE TABLE grades (
    grade_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id) ON DELETE CASCADE,
    course_id VARCHAR(20) REFERENCES courses(course_id) ON DELETE CASCADE,
    exam_id UUID REFERENCES examinations(exam_id) ON DELETE CASCADE,
    internal_marks DECIMAL(5,2) DEFAULT 0.00,
    external_marks DECIMAL(5,2) DEFAULT 0.00,
    total_marks DECIMAL(5,2) DEFAULT 0.00,
    grade grade_type,
    grade_points DECIMAL(3,2) DEFAULT 0.00,
    is_passed BOOLEAN DEFAULT FALSE,
    graded_by UUID REFERENCES users(user_id),
    graded_at TIMESTAMP,
    UNIQUE(student_id, course_id, exam_id)
);

-- Attendance table
CREATE TABLE attendance (
    attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id) ON DELETE CASCADE,
    course_id VARCHAR(20) REFERENCES courses(course_id) ON DELETE CASCADE,
    faculty_id VARCHAR(20) REFERENCES faculty(faculty_id),
    attendance_date DATE NOT NULL,
    is_present BOOLEAN NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fee structure table
CREATE TABLE fee_structure (
    fee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus VARCHAR(50) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL,
    academic_year INTEGER NOT NULL,
    tuition_fee DECIMAL(10,2) NOT NULL,
    exam_fee DECIMAL(10,2) DEFAULT 0.00,
    library_fee DECIMAL(10,2) DEFAULT 0.00,
    lab_fee DECIMAL(10,2) DEFAULT 0.00,
    hostel_fee DECIMAL(10,2) DEFAULT 0.00,
    total_fee DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL
);

-- Fee payments table
CREATE TABLE fee_payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id) ON DELETE CASCADE,
    fee_id UUID REFERENCES fee_structure(fee_id),
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) DEFAULT 'online',
    transaction_id VARCHAR(100),
    receipt_number VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'completed'
);

-- Audit log table
CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(20) NOT NULL,
    user_id UUID REFERENCES users(user_id),
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
