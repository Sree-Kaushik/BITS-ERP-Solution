-- Trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp trigger to users table
CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Trigger function for calculating total marks and grade
CREATE OR REPLACE FUNCTION calculate_grade()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate total marks
    NEW.total_marks = COALESCE(NEW.internal_marks, 0) + COALESCE(NEW.external_marks, 0);
    
    -- Calculate grade and grade points based on total marks
    IF NEW.total_marks >= 90 THEN
        NEW.grade = 'A+';
        NEW.grade_points = 10.00;
    ELSIF NEW.total_marks >= 80 THEN
        NEW.grade = 'A';
        NEW.grade_points = 9.00;
    ELSIF NEW.total_marks >= 70 THEN
        NEW.grade = 'B+';
        NEW.grade_points = 8.00;
    ELSIF NEW.total_marks >= 60 THEN
        NEW.grade = 'B';
        NEW.grade_points = 7.00;
    ELSIF NEW.total_marks >= 50 THEN
        NEW.grade = 'C+';
        NEW.grade_points = 6.00;
    ELSIF NEW.total_marks >= 40 THEN
        NEW.grade = 'C';
        NEW.grade_points = 5.00;
    ELSIF NEW.total_marks >= 35 THEN
        NEW.grade = 'D';
        NEW.grade_points = 4.00;
    ELSE
        NEW.grade = 'F';
        NEW.grade_points = 0.00;
    END IF;
    
    -- Determine if passed
    NEW.is_passed = (NEW.total_marks >= 35);
    
    -- Set grading timestamp
    NEW.graded_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply grade calculation trigger
CREATE TRIGGER calculate_grade_trigger
    BEFORE INSERT OR UPDATE ON grades
    FOR EACH ROW
    EXECUTE FUNCTION calculate_grade();

-- Trigger function for CGPA calculation
CREATE OR REPLACE FUNCTION update_student_cgpa()
RETURNS TRIGGER AS $$
DECLARE
    total_credits INTEGER := 0;
    total_grade_points DECIMAL(10,2) := 0;
    calculated_cgpa DECIMAL(3,2);
BEGIN
    -- Calculate CGPA for the student
    SELECT 
        COALESCE(SUM(c.credits), 0),
        COALESCE(SUM(c.credits * g.grade_points), 0)
    INTO total_credits, total_grade_points
    FROM grades g
    JOIN courses c ON g.course_id = c.course_id
    WHERE g.student_id = NEW.student_id 
    AND g.is_passed = TRUE;
    
    -- Calculate CGPA
    IF total_credits > 0 THEN
        calculated_cgpa = total_grade_points / total_credits;
    ELSE
        calculated_cgpa = 0.00;
    END IF;
    
    -- Update student's CGPA
    UPDATE students 
    SET cgpa = calculated_cgpa 
    WHERE student_id = NEW.student_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply CGPA update trigger
CREATE TRIGGER update_cgpa_trigger
    AFTER INSERT OR UPDATE ON grades
    FOR EACH ROW
    EXECUTE FUNCTION update_student_cgpa();

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, old_values)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, old_values, new_values)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, new_values)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_students_trigger
    AFTER INSERT OR UPDATE OR DELETE ON students
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_grades_trigger
    AFTER INSERT OR UPDATE OR DELETE ON grades
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Hall ticket generation trigger
CREATE OR REPLACE FUNCTION generate_hall_ticket()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.hall_ticket_number IS NULL THEN
        NEW.hall_ticket_number = 'HT' || TO_CHAR(CURRENT_DATE, 'YYYY') || 
                                 LPAD(EXTRACT(DOY FROM CURRENT_DATE)::TEXT, 3, '0') || 
                                 LPAD(NEXTVAL('hall_ticket_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for hall ticket
CREATE SEQUENCE hall_ticket_seq START 1;

-- Apply hall ticket trigger
CREATE TRIGGER generate_hall_ticket_trigger
    BEFORE INSERT ON exam_registrations
    FOR EACH ROW
    EXECUTE FUNCTION generate_hall_ticket();
