<?php
// submit_complaint.php
require_once 'config.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $complaint = [
        'user_id' => $_SESSION['user']['id'],
        'title' => trim($_POST['title']),
        'description' => trim($_POST['description']),
        'department' => $_POST['department'],
        'priority' => $_POST['priority'],
        'status' => 'pending'
    ];
    
    saveComplaint($complaint);
    header('Location: dashboard.php?success=complaint_submitted');
    exit;
}

header('Location: dashboard.php');
exit;
?>