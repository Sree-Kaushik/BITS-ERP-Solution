-- Insert sample users
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@bits.edu.in', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVLvxgfUu', 'admin'),
('john_doe', 'john.doe@bits.edu.in', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVLvxgfUu', 'student'),
('jane_smith', 'jane.smith@bits.edu.in', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVLvxgfUu', 'student'),
('prof_kumar', 'prof.kumar@bits.edu.in', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVLvxgfUu', 'faculty'),
('dr_sharma', 'dr.sharma@bits.edu.in', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVLvxgfUu', 'faculty');

-- Insert sample students
INSERT INTO students (student_id, user_id, first_name, last_name, campus, branch, batch_year, current_semester) VALUES
('2021A7PS001P', (SELECT user_id FROM users WHERE username = 'john_doe'), 'John', 'Doe', 'Pilani', 'Computer Science', 2021, 6),
('2021A7PS002P', (SELECT user_id FROM users WHERE username = 'jane_smith'), 'Jane', 'Smith', 'Pilani', 'Electronics', 2021, 6);

-- Insert sample faculty
INSERT INTO faculty (faculty_id, user_id, first_name, last_name, department, designation) VALUES
('FAC001', (SELECT user_id FROM users WHERE username = 'prof_kumar'), 'Rajesh', 'Kumar', 'Computer Science', 'Professor'),
('FAC002', (SELECT user_id FROM users WHERE username = 'dr_sharma'), 'Priya', 'Sharma', 'Electronics', 'Associate Professor');

-- Insert sample courses
INSERT INTO courses (course_id, course_name, course_code, credits, department, semester) VALUES
('CS101', 'Programming Fundamentals', 'CS F111', 4, 'Computer Science', 1),
('CS201', 'Data Structures', 'CS F211', 4, 'Computer Science', 3),
('CS301', 'Database Systems', 'CS F212', 3, 'Computer Science', 5),
('EC101', 'Circuit Analysis', 'EE F111', 4, 'Electronics', 1),
('EC201', 'Digital Electronics', 'EE F211', 3, 'Electronics', 3);

-- Insert sample enrollments
INSERT INTO enrollments (student_id, course_id, semester_year, semester_type) VALUES
('2021A7PS001P', 'CS301', 2024, 'monsoon'),
('2021A7PS002P', 'EC201', 2024, 'monsoon');

-- Insert sample examinations
INSERT INTO examinations (exam_name, exam_type, semester_type, academic_year, start_date, end_date, registration_start, registration_end, exam_fee) VALUES
('Monsoon 2024 Regular Exam', 'regular', 'monsoon', 2024, '2024-12-01', '2024-12-15', '2024-11-01', '2024-11-20', 500.00),
('Spring 2025 Regular Exam', 'regular', 'spring', 2025, '2025-05-01', '2025-05-15', '2025-04-01', '2025-04-20', 500.00);

-- Insert sample fee structure
INSERT INTO fee_structure (campus, branch, semester, academic_year, tuition_fee, exam_fee, library_fee, lab_fee, total_fee, due_date) VALUES
('Pilani', 'Computer Science', 6, 2024, 75000.00, 500.00, 1000.00, 2000.00, 78500.00, '2024-12-31'),
('Pilani', 'Electronics', 6, 2024, 75000.00, 500.00, 1000.00, 2000.00, 78500.00, '2024-12-31');
