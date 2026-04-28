<?php
// install.php - Run this file first to setup the database
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check MySQLi extension
if (!extension_loaded('mysqli')) {
    die('<div style="color: red; padding: 20px;">
        <h2>❌ MySQLi Extension Not Found</h2>
        <p>Please enable MySQLi extension in your PHP configuration.</p>
        <h3>How to fix:</h3>
        <ul>
            <li>Ubuntu/Debian: sudo apt-get install php-mysql</li>
            <li>Then restart: sudo systemctl restart apache2</li>
        </ul>
        </div>');
}

echo "<h2>✅ MySQLi extension is enabled!</h2>";

$host = 'localhost';
$user = 'root';
$pass = '';
$database = 'complaint_system';

// Create connection without database
$conn = new mysqli($host, $user, $pass);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<p>✅ Connected to MySQL server</p>";

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS $database";
if ($conn->query($sql) === TRUE) {
    echo "<p>✅ Database '$database' created or already exists</p>";
} else {
    die("<p>❌ Error creating database: " . $conn->error . "</p>");
}

// Select database
$conn->select_db($database);

// Create tables
$tables = [
    "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('user', 'admin', 'support') DEFAULT 'user',
        profile_pic VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login DATETIME,
        is_active BOOLEAN DEFAULT TRUE
    )",
    
    "CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        head_name VARCHAR(100),
        head_email VARCHAR(100),
        response_time_hours INT DEFAULT 24,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS complaints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        department_id INT NOT NULL,
        complaint_number VARCHAR(20) UNIQUE NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        status ENUM('pending', 'in-progress', 'resolved', 'closed') DEFAULT 'pending',
        attachment VARCHAR(255) DEFAULT NULL,
        admin_response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (department_id) REFERENCES departments(id)
    )",
    
    "CREATE TABLE IF NOT EXISTS complaint_updates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        complaint_id INT NOT NULL,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        attachment VARCHAR(255),
        is_admin_reply BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )",
    
    "CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        complaint_id INT,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('status_change', 'reply', 'new_complaint') DEFAULT 'status_change',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )"
];

foreach ($tables as $table) {
    if ($conn->query($table) === TRUE) {
        echo "<p>✅ Table created successfully</p>";
    } else {
        echo "<p>❌ Error creating table: " . $conn->error . "</p>";
    }
}

// Insert sample data
$password = password_hash('password123', PASSWORD_DEFAULT);

// Check if admin exists
$check = $conn->query("SELECT id FROM users WHERE email = 'admin@complaintsystem.com'");
if ($check->num_rows == 0) {
    $conn->query("INSERT INTO users (name, email, password, role, is_active) VALUES 
        ('Admin User', 'admin@complaintsystem.com', '$password', 'admin', TRUE),
        ('John Doe', 'john@example.com', '$password', 'user', TRUE)");
    echo "<p>✅ Sample users created</p>";
}

// Insert departments
$checkDept = $conn->query("SELECT id FROM departments LIMIT 1");
if ($checkDept->num_rows == 0) {
    $conn->query("INSERT INTO departments (name, description, response_time_hours) VALUES 
        ('Technical Support', 'Software, hardware, and network issues', 12),
        ('Billing', 'Payment and subscription issues', 24),
        ('Customer Service', 'General inquiries', 8),
        ('HR Department', 'Employee relations', 48)");
    echo "<p>✅ Departments created</p>";
}

echo "<hr>";
echo "<h3>🎉 Installation Complete!</h3>";
echo "<p>You can now <a href='login.php'>Login to the system</a></p>";
echo "<p><strong>Demo Credentials:</strong></p>";
echo "<ul>";
echo "<li>User: john@example.com / password123</li>";
echo "<li>Admin: admin@complaintsystem.com / password123</li>";
echo "</ul>";

$conn->close();
?>