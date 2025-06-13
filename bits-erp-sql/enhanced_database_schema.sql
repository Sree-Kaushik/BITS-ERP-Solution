-- Additional tables for advanced features

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

-- Course recommendations and AI data
CREATE TABLE student_interests (
    interest_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id),
    interest_category VARCHAR(100) NOT NULL,
    interest_level INTEGER CHECK (interest_level BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) REFERENCES students(student_id),
    course_id VARCHAR(20) REFERENCES courses(course_id),
    match_score INTEGER CHECK (match_score BETWEEN 0 AND 100),
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Document management
CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    document_name VARCHAR(200) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'transcript', 'certificate', 'id_proof', 'photo'
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(user_id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback and grievance system
CREATE TABLE feedback (
    feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    category VARCHAR(100) NOT NULL, -- 'academic', 'hostel', 'library', 'general'
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    assigned_to UUID REFERENCES users(user_id),
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Two-factor authentication
CREATE TABLE user_2fa (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    secret_key VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    backup_codes TEXT[], -- Array of backup codes
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API tokens for third-party integrations
CREATE TABLE api_tokens (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    token_name VARCHAR(100) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    permissions TEXT[], -- Array of permissions
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Event management
CREATE TABLE events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(200) NOT NULL,
    event_description TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'academic', 'cultural', 'sports', 'workshop'
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    venue VARCHAR(200),
    max_participants INTEGER,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline TIMESTAMP,
    organizer_id UUID REFERENCES users(user_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_registrations (
    registration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(event_id),
    user_id UUID REFERENCES users(user_id),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(20) DEFAULT 'registered', -- 'registered', 'attended', 'absent'
    UNIQUE(event_id, user_id)
);

-- Insert sample notifications
INSERT INTO notifications (title, message, type, priority, is_global) VALUES
('System Maintenance', 'The ERP system will be under maintenance on Sunday 2:00 AM - 4:00 AM', 'general', 'medium', true),
('New Feature Available', 'AI-based course recommendations are now available in your dashboard', 'general', 'low', true);

-- Insert sample events
INSERT INTO events (event_name, event_description, event_type, start_datetime, end_datetime, venue, max_participants, registration_required) VALUES
('Tech Fest 2025', 'Annual technical festival with competitions and workshops', 'cultural', '2025-07-15 09:00:00', '2025-07-17 18:00:00', 'Main Auditorium', 500, true),
('Career Guidance Workshop', 'Workshop on career opportunities in technology', 'workshop', '2025-06-20 14:00:00', '2025-06-20 17:00:00', 'Conference Hall', 100, true);
