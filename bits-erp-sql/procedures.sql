-- Procedure to register student for exam
CREATE OR REPLACE PROCEDURE register_student_for_exam(
    p_student_id VARCHAR(20),
    p_exam_id UUID,
    p_course_id VARCHAR(20),
    p_exam_type exam_type
)
LANGUAGE plpgsql
AS $$
DECLARE
    exam_record RECORD;
    enrollment_exists BOOLEAN;
BEGIN
    -- Check if exam exists and is active
    SELECT * INTO exam_record FROM examinations WHERE exam_id = p_exam_id AND is_active = TRUE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Exam not found or not active';
    END IF;
    
    -- Check if registration is within allowed period
    IF CURRENT_DATE < exam_record.registration_start OR CURRENT_DATE > exam_record.registration_end THEN
        RAISE EXCEPTION 'Registration period has ended';
    END IF;
    
    -- Check if student is enrolled in the course
    SELECT EXISTS(
        SELECT 1 FROM enrollments 
        WHERE student_id = p_student_id AND course_id = p_course_id AND is_active = TRUE
    ) INTO enrollment_exists;
    
    IF NOT enrollment_exists THEN
        RAISE EXCEPTION 'Student not enrolled in this course';
    END IF;
    
    -- Register student for exam
    INSERT INTO exam_registrations (student_id, exam_id, course_id, exam_type)
    VALUES (p_student_id, p_exam_id, p_course_id, p_exam_type);
    
    RAISE NOTICE 'Student % successfully registered for exam', p_student_id;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;

-- Procedure to calculate semester results
CREATE OR REPLACE PROCEDURE calculate_semester_results(
    p_student_id VARCHAR(20),
    p_semester_year INTEGER,
    p_semester_type semester_type
)
LANGUAGE plpgsql
AS $$
DECLARE
    total_credits INTEGER := 0;
    earned_credits INTEGER := 0;
    total_grade_points DECIMAL(10,2) := 0;
    sgpa DECIMAL(3,2);
    course_record RECORD;
BEGIN
    -- Calculate SGPA for the semester
    FOR course_record IN
        SELECT c.credits, g.grade_points, g.is_passed
        FROM grades g
        JOIN courses c ON g.course_id = c.course_id
        JOIN exam_registrations er ON g.exam_id = er.exam_id AND g.course_id = er.course_id
        JOIN examinations e ON er.exam_id = e.exam_id
        WHERE g.student_id = p_student_id 
        AND e.academic_year = p_semester_year
        AND e.semester_type = p_semester_type
    LOOP
        total_credits := total_credits + course_record.credits;
        IF course_record.is_passed THEN
            earned_credits := earned_credits + course_record.credits;
            total_grade_points := total_grade_points + (course_record.credits * course_record.grade_points);
        END IF;
    END LOOP;
    
    -- Calculate SGPA
    IF total_credits > 0 THEN
        sgpa := total_grade_points / total_credits;
    ELSE
        sgpa := 0.00;
    END IF;
    
    RAISE NOTICE 'Semester Results - Total Credits: %, Earned Credits: %, SGPA: %', 
                 total_credits, earned_credits, sgpa;
    
    COMMIT;
END;
$$;

-- Procedure to generate transcript
CREATE OR REPLACE PROCEDURE generate_transcript(
    p_student_id VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
DECLARE
    student_record RECORD;
    course_record RECORD;
    total_credits INTEGER := 0;
    earned_credits INTEGER := 0;
BEGIN
    -- Get student information
    SELECT s.*, u.email FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.student_id = p_student_id
    INTO student_record;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Student not found';
    END IF;
    
    RAISE NOTICE 'TRANSCRIPT FOR: % % (ID: %)', 
                 student_record.first_name, student_record.last_name, p_student_id;
    RAISE NOTICE 'Campus: %, Branch: %, Batch: %', 
                 student_record.campus, student_record.branch, student_record.batch_year;
    RAISE NOTICE 'Current CGPA: %', student_record.cgpa;
    RAISE NOTICE '----------------------------------------';
    
    -- Get all completed courses
    FOR course_record IN
        SELECT c.course_code, c.course_name, c.credits, g.grade, g.grade_points, g.is_passed
        FROM grades g
        JOIN courses c ON g.course_id = c.course_id
        WHERE g.student_id = p_student_id
        ORDER BY c.semester, c.course_code
    LOOP
        RAISE NOTICE '% | % | Credits: % | Grade: % | Points: %',
                     course_record.course_code,
                     course_record.course_name,
                     course_record.credits,
                     course_record.grade,
                     course_record.grade_points;
        
        total_credits := total_credits + course_record.credits;
        IF course_record.is_passed THEN
            earned_credits := earned_credits + course_record.credits;
        END IF;
    END LOOP;
    
    RAISE NOTICE '----------------------------------------';
    RAISE NOTICE 'Total Credits Attempted: %', total_credits;
    RAISE NOTICE 'Total Credits Earned: %', earned_credits;
    RAISE NOTICE 'Final CGPA: %', student_record.cgpa;
END;
$$;
