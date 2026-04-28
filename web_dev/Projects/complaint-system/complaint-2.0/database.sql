-- database.sql
-- Create database and tables for Complaint Management System

CREATE DATABASE IF NOT EXISTS complaint_system;
USE complaint_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin', 'support') DEFAULT 'user',
    profile_pic VARCHAR(255) DEFAULT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_name VARCHAR(100),
    head_email VARCHAR(100),
    response_time_hours INT DEFAULT 24,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    department_id INT NOT NULL,
    complaint_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in-progress', 'review', 'resolved', 'closed', 'rejected') DEFAULT 'pending',
    attachment VARCHAR(255) DEFAULT NULL,
    admin_response TEXT,
    resolved_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_complaint_number (complaint_number)
);

-- Complaint replies/updates table
CREATE TABLE IF NOT EXISTS complaint_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    attachment VARCHAR(255),
    is_admin_reply BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_complaint (complaint_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    complaint_id INT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('status_change', 'reply', 'assignment', 'reminder') DEFAULT 'status_change',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read)
);

-- Feedback/Ratings table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    resolution_satisfied BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_complaint_feedback (complaint_id)
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_by INT NOT NULL,
    valid_from DATE,
    valid_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_active (is_active)
);

-- Insert sample data
INSERT INTO departments (name, description, head_name, head_email, response_time_hours) VALUES
('Technical Support', 'Software, hardware, and network related issues', 'John Smith', 'tech@complaintsystem.com', 12),
('Billing & Payments', 'Payment processing, invoices, and subscription issues', 'Sarah Johnson', 'billing@complaintsystem.com', 24),
('Customer Service', 'General inquiries and customer feedback', 'Mike Brown', 'support@complaintsystem.com', 8),
('HR Department', 'Employee relations, policies, and workplace issues', 'Lisa Wilson', 'hr@complaintsystem.com', 48),
('Product Feedback', 'Feature requests and product improvement suggestions', 'David Lee', 'product@complaintsystem.com', 72),
('Security & Privacy', 'Security concerns, data privacy, and breach reports', 'Emma Davis', 'security@complaintsystem.com', 4);

-- Insert admin user (password: Admin@123)
INSERT INTO users (name, email, password, role, phone, email_verified) VALUES
('Admin User', 'admin@complaintsystem.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '+1234567890', TRUE),
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+1234567891', TRUE);

-- Insert sample complaints
INSERT INTO complaints (user_id, department_id, complaint_number, title, description, priority, status) VALUES
(2, 1, 'CMP-20240001', 'Cannot access dashboard after update', 'After the latest system update, I keep getting a 504 error when trying to access my dashboard. This has been happening for 2 days.', 'high', 'in-progress'),
(2, 2, 'CMP-20240002', 'Double charged for subscription', 'My account was charged twice this month for the premium subscription. Please investigate and refund.', 'urgent', 'pending');

-- Insert sample announcements
INSERT INTO announcements (title, content, priority, created_by, valid_from, valid_to) VALUES
('System Maintenance', 'The system will be down for maintenance on Sunday, March 25th from 2 AM to 4 AM EST.', 'high', 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY));