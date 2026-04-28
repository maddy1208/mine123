<?php
// config.php - Configuration and helper functions
session_start();

define('USERS_FILE', 'data/users.json');
define('COMPLAINTS_FILE', 'data/complaints.json');
define('DEPARTMENTS_FILE', 'data/departments.json');

// Create data directory if not exists
if (!file_exists('data')) {
    mkdir('data', 0777, true);
}

// Initialize default data files
function initDataFiles() {
    if (!file_exists(USERS_FILE)) {
        $defaultUsers = [
            ['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'user', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 2, 'name' => 'Sarah Admin', 'email' => 'admin@example.com', 'password' => password_hash('admin123', PASSWORD_DEFAULT), 'role' => 'admin', 'created_at' => date('Y-m-d H:i:s')],
            ['id' => 3, 'name' => 'Mike Support', 'email' => 'support@example.com', 'password' => password_hash('support123', PASSWORD_DEFAULT), 'role' => 'support', 'created_at' => date('Y-m-d H:i:s')]
        ];
        file_put_contents(USERS_FILE, json_encode($defaultUsers, JSON_PRETTY_PRINT));
    }
    
    if (!file_exists(DEPARTMENTS_FILE)) {
        $defaultDepts = [
            ['id' => 1, 'name' => 'Technical Support', 'description' => 'Software, hardware, and network issues'],
            ['id' => 2, 'name' => 'Billing', 'description' => 'Payment, invoice, and subscription concerns'],
            ['id' => 3, 'name' => 'Customer Service', 'description' => 'General inquiries and feedback'],
            ['id' => 4, 'name' => 'HR Department', 'description' => 'Employee relations and policies']
        ];
        file_put_contents(DEPARTMENTS_FILE, json_encode($defaultDepts, JSON_PRETTY_PRINT));
    }
    
    if (!file_exists(COMPLAINTS_FILE)) {
        $defaultComplaints = [
            ['id' => 1, 'user_id' => 1, 'title' => 'Cannot login to dashboard', 'description' => 'I keep getting error 504 when trying to access dashboard', 'department' => 'Technical Support', 'priority' => 'high', 'status' => 'in-progress', 'created_at' => date('Y-m-d H:i:s', strtotime('-2 days')), 'updated_at' => date('Y-m-d H:i:s', strtotime('-1 day'))],
            ['id' => 2, 'user_id' => 1, 'title' => 'Wrong amount charged', 'description' => 'My invoice shows $99 but should be $49', 'department' => 'Billing', 'priority' => 'medium', 'status' => 'pending', 'created_at' => date('Y-m-d H:i:s', strtotime('-1 day')), 'updated_at' => date('Y-m-d H:i:s', strtotime('-1 day'))]
        ];
        file_put_contents(COMPLAINTS_FILE, json_encode($defaultComplaints, JSON_PRETTY_PRINT));
    }
}

function getUsers() {
    return json_decode(file_get_contents(USERS_FILE), true);
}

function getUserById($id) {
    $users = getUsers();
    foreach ($users as $user) {
        if ($user['id'] == $id) return $user;
    }
    return null;
}

function getUserByEmail($email) {
    $users = getUsers();
    foreach ($users as $user) {
        if ($user['email'] === $email) return $user;
    }
    return null;
}

function getComplaints($userId = null, $status = null) {
    if (!file_exists(COMPLAINTS_FILE)) return [];
    $complaints = json_decode(file_get_contents(COMPLAINTS_FILE), true);
    if ($userId) {
        $complaints = array_filter($complaints, fn($c) => $c['user_id'] == $userId);
    }
    if ($status) {
        $complaints = array_filter($complaints, fn($c) => $c['status'] === $status);
    }
    usort($complaints, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));
    return array_values($complaints);
}

function getComplaintById($id) {
    $complaints = getComplaints();
    foreach ($complaints as $complaint) {
        if ($complaint['id'] == $id) return $complaint;
    }
    return null;
}

function saveComplaint($complaint) {
    $complaints = getComplaints();
    $complaint['id'] = count($complaints) + 1;
    $complaint['created_at'] = date('Y-m-d H:i:s');
    $complaint['updated_at'] = date('Y-m-d H:i:s');
    $complaints[] = $complaint;
    file_put_contents(COMPLAINTS_FILE, json_encode($complaints, JSON_PRETTY_PRINT));
    return $complaint['id'];
}

function updateComplaintStatus($id, $status, $adminResponse = null) {
    $complaints = getComplaints();
    foreach ($complaints as &$complaint) {
        if ($complaint['id'] == $id) {
            $complaint['status'] = $status;
            $complaint['updated_at'] = date('Y-m-d H:i:s');
            if ($adminResponse) {
                $complaint['admin_response'] = $adminResponse;
            }
            file_put_contents(COMPLAINTS_FILE, json_encode($complaints, JSON_PRETTY_PRINT));
            return true;
        }
    }
    return false;
}

function getDepartments() {
    return json_decode(file_get_contents(DEPARTMENTS_FILE), true);
}

function isLoggedIn() {
    return isset($_SESSION['user']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function requireAdmin() {
    requireLogin();
    if ($_SESSION['user']['role'] !== 'admin') {
        header('Location: dashboard.php');
        exit;
    }
}

initDataFiles();
?>