<?php
session_start();

// Database configuration for Windows MySQL
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Change this if you set a password during MySQL installation
define('DB_NAME', 'complaint_system');
define('DB_PORT', 3306);

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            // Connect to MySQL
            $this->connection = new mysqli(DB_HOST, DB_USER, DB_PASS, '', DB_PORT);
            
            if ($this->connection->connect_error) {
                throw new Exception("Connection failed: " . $this->connection->connect_error);
            }
            
            // Create database if not exists
            $this->connection->query("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
            $this->connection->select_db(DB_NAME);
            
            // Create tables
            $this->createTables();
            
            $this->connection->set_charset("utf8mb4");
        } catch (Exception $e) {
            die("Database error: " . $e->getMessage() . 
                "<br><br>Make sure MySQL is running!");
        }
    }
    
    private function createTables() {
        // Users table
        $this->connection->query("CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            role ENUM('user', 'admin', 'support') DEFAULT 'user',
            is_active BOOLEAN DEFAULT TRUE,
            last_login DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");
        
        // Departments table
        $this->connection->query("CREATE TABLE IF NOT EXISTS departments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
        
        // Complaints table
        $this->connection->query("CREATE TABLE IF NOT EXISTS complaints (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            department_id INT NOT NULL,
            complaint_number VARCHAR(20) UNIQUE NOT NULL,
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
            status ENUM('pending', 'in-progress', 'resolved', 'closed') DEFAULT 'pending',
            admin_response TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (department_id) REFERENCES departments(id)
        )");
        
        // Complaint updates table
        $this->connection->query("CREATE TABLE IF NOT EXISTS complaint_updates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            complaint_id INT NOT NULL,
            user_id INT NOT NULL,
            message TEXT NOT NULL,
            is_admin_reply BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )");
        
        // Notifications table
        $this->connection->query("CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            complaint_id INT,
            title VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )");
        
        // Insert default data if tables are empty
        $this->insertDefaultData();
    }
    
    private function insertDefaultData() {
        // Check if users exist
        $result = $this->connection->query("SELECT COUNT(*) as count FROM users");
        $count = $result->fetch_assoc()['count'];
        
        if ($count == 0) {
            $password = password_hash('password123', PASSWORD_DEFAULT);
            $this->connection->query("INSERT INTO users (name, email, password, role) VALUES 
                ('John Doe', 'john@example.com', '$password', 'user'),
                ('Jane Smith', 'jane@example.com', '$password', 'user')");
        }
        
        // Check if departments exist
        $result = $this->connection->query("SELECT COUNT(*) as count FROM departments");
        $count = $result->fetch_assoc()['count'];
        
        if ($count == 0) {
            $this->connection->query("INSERT INTO departments (name, description) VALUES 
                ('Technical Support', 'Software, hardware, and network issues'),
                ('Billing Department', 'Payment, invoice, and subscription issues'),
                ('Customer Service', 'General inquiries and feedback'),
                ('HR Department', 'Employee relations and policies')");
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function prepare($sql) {
        return $this->connection->prepare($sql);
    }
    
    public function lastInsertId() {
        return $this->connection->insert_id;
    }
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function requireAdmin() {
    requireLogin();
    if ($_SESSION['user_role'] !== 'admin') {
        header('Location: dashboard.php');
        exit;
    }
}

function generateComplaintNumber() {
    return 'CMP-' . date('Y') . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
}
?>