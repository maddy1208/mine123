<?php
// submit-complaint.php
require_once 'config/database.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_SESSION['user_id'];
    $departmentId = $_POST['department_id'];
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $priority = $_POST['priority'];
    $complaintNumber = generateComplaintNumber();
    
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("INSERT INTO complaints (user_id, department_id, complaint_number, title, description, priority, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')");
    $stmt->bind_param("iissss", $userId, $departmentId, $complaintNumber, $title, $description, $priority);
    
    if ($stmt->execute()) {
        $complaintId = $db->insert_id;
        
        // Create notification for admin
        $notifyStmt = $db->prepare("INSERT INTO notifications (user_id, complaint_id, title, message, type) VALUES (?, ?, ?, ?, 'new_complaint')");
        $adminTitle = "New Complaint #$complaintNumber";
        $adminMsg = "New complaint submitted by " . $_SESSION['user_name'];
        $notifyStmt->bind_param("iiss", $userId, $complaintId, $adminTitle, $adminMsg);
        $notifyStmt->execute();
        
        header('Location: dashboard.php?success=complaint_submitted');
        exit;
    } else {
        header('Location: dashboard.php?error=submission_failed');
        exit;
    }
}

header('Location: dashboard.php');
exit;
?>