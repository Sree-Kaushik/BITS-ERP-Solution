-- Create database for BITS Campus ERP
CREATE DATABASE bits_campus_erp;

-- Connect to the database
\c bits_campus_erp;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin', 'staff');
CREATE TYPE exam_type AS ENUM ('regular', 'backlog', 'summer', 'nc');
CREATE TYPE grade_type AS ENUM ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'I', 'W');
CREATE TYPE semester_type AS ENUM ('monsoon', 'spring', 'summer');
