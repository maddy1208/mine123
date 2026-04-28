<?php
// view-complaint.php
require_once 'config/database.php';
requireLogin();

$complaintId = $_GET['id'] ?? 0;
$db = Database::getInstance()->getConnection();
$userId = $_SESSION['user_id'];
$userRole = $_SESSION['user_role'];

// Get complaint details
$stmt = $db->prepare("
    SELECT c.*, d.name as department_name, u.name as user_name, u.email as user_email
    FROM complaints c
    JOIN departments d ON c.department_id = d.id
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ? AND (c.user_id = ? OR ? = 'admin')
");
$isAdmin = ($userRole === 'admin') ? 1 : 0;
$stmt->bind_param("iii", $complaintId, $userId, $isAdmin);
$stmt->execute();
$complaint = $stmt->get_result()->fetch_assoc();

if (!$complaint) {
    header('Location: dashboard.php');
    exit;
}

// Get updates/replies
$updatesStmt = $db->prepare("
    SELECT cu.*, u.name as user_name, u.role as user_role
    FROM complaint_updates cu
    JOIN users u ON cu.user_id = u.id
    WHERE cu.complaint_id = ?
    ORDER BY cu.created_at ASC
");
$updatesStmt->bind_param("i", $complaintId);
$updatesStmt->execute();
$updates = $updatesStmt->get_result();

// Handle reply submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['reply'])) {
    $message = trim($_POST['message']);
    $isAdminReply = ($userRole === 'admin') ? 1 : 0;
    
    $replyStmt = $db->prepare("INSERT INTO complaint_updates (complaint_id, user_id, message, is_admin_reply) VALUES (?, ?, ?, ?)");
    $replyStmt->bind_param("iisi", $complaintId, $userId, $message, $isAdminReply);
    $replyStmt->execute();
    
    // Create notification for other party
    $notifyUserId = ($userRole === 'admin') ? $complaint['user_id'] : 1; // Notify admin
    $notifyStmt = $db->prepare("INSERT INTO notifications (user_id, complaint_id, title, message, type) VALUES (?, ?, ?, ?, 'reply')");
    $title = "New reply on complaint #" . $complaint['complaint_number'];
    $notifyStmt->bind_param("iiss", $notifyUserId, $complaintId, $title, $message);
    $notifyStmt->execute();
    
    header("Location: view-complaint.php?id=$complaintId");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Complaint - Complaint Management System</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f3f4f6; }
        
        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 280px;
            height: 100%;
            background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
            color: white;
        }
        .sidebar-header { padding: 2rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .sidebar-header h2 { font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .sidebar-nav { padding: 2rem 1rem; }
        .sidebar-nav a {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.8rem 1rem;
            color: #d1d5db;
            text-decoration: none;
            border-radius: 0.75rem;
            margin-bottom: 0.5rem;
        }
        .sidebar-nav a:hover { background: rgba(79, 70, 229, 0.2); color: white; }
        .main-content { margin-left: 280px; padding: 2rem; }
        
        .top-bar {
            background: white;
            border-radius: 1rem;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .user-menu { display: flex; align-items: center; gap: 1.5rem; }
        .user-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .complaint-detail {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
        }
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-in-progress { background: #dbeafe; color: #2563eb; }
        .status-resolved { background: #d1fae5; color: #059669; }
        
        .conversation {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
        }
        .message {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-radius: 1rem;
        }
        .user-message { background: #f3f4f6; }
        .admin-message { background: #e0e7ff; margin-left: 2rem; }
        .message-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
            color: #6b7280;
        }
        
        .reply-form {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
        }
        .reply-form textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            font-family: inherit;
            resize: vertical;
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 0.7rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            margin-top: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .sidebar { left: -280px; }
            .main-content { margin-left: 0; }
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h2><i class="fas fa-ticket-alt"></i> ComplaintHub</h2>
        </div>
        <div class="sidebar-nav">
            <a href="dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            <a href="my-complaints.php"><i class="fas fa-list"></i> My Complaints</a>
            <a href="notifications.php"><i class="fas fa-bell"></i> Notifications</a>
            <a href="profile.php"><i class="fas fa-user"></i> Profile</a>
            <a href="logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>
    
    <div class="main-content">
        <div class="top-bar">
            <h2><i class="fas fa-ticket-alt"></i> Complaint Details</h2>
            <div class="user-menu">
                <div class="user-avatar"><?= strtoupper(substr($_SESSION['user_name'], 0, 1)) ?></div>
                <span><?= htmlspecialchars($_SESSION['user_name']) ?></span>
            </div>
        </div>
        
        <div class="complaint-detail">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h2><?= htmlspecialchars($complaint['title']) ?></h2>
                    <p style="color: #6b7280; margin-top: 0.3rem;">#<?= $complaint['complaint_number'] ?></p>
                </div>
                <span class="status-badge status-<?= str_replace('-', '', $complaint['status']) ?>">
                    <?= ucfirst(str_replace('-', ' ', $complaint['status'])) ?>
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: #f3f4f6; border-radius: 0.5rem;">
                <div><i class="fas fa-building"></i> <?= htmlspecialchars($complaint['department_name']) ?></div>
                <div><i class="fas fa-flag"></i> Priority: <?= ucfirst($complaint['priority']) ?></div>
                <div><i class="fas fa-calendar"></i> <?= date('M d, Y H:i', strtotime($complaint['created_at'])) ?></div>
                <div><i class="fas fa-user"></i> By: <?= htmlspecialchars($complaint['user_name']) ?></div>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Description:</strong>
                <p style="margin-top: 0.5rem; line-height: 1.6;"><?= nl2br(htmlspecialchars($complaint['description'])) ?></p>
            </div>
            
            <?php if ($complaint['admin_response']): ?>
            <div style="padding: 1rem; background: #e0e7ff; border-radius: 0.5rem;">
                <strong><i class="fas fa-reply"></i> Admin Response:</strong>
                <p style="margin-top: 0.5rem;"><?= nl2br(htmlspecialchars($complaint['admin_response'])) ?></p>
            </div>
            <?php endif; ?>
        </div>
        
        <div class="conversation">
            <h3><i class="fas fa-comments"></i> Conversation</h3>
            
            <?php while ($update = $updates->fetch_assoc()): ?>
            <div class="message <?= $update['is_admin_reply'] ? 'admin-message' : 'user-message' ?>">
                <div class="message-header">
                    <span><strong><?= htmlspecialchars($update['user_name']) ?></strong> (<?= $update['is_admin_reply'] ? 'Admin' : 'User' ?>)</span>
                    <span><?= date('M d, Y H:i', strtotime($update['created_at'])) ?></span>
                </div>
                <p><?= nl2br(htmlspecialchars($update['message'])) ?></p>
            </div>
            <?php endwhile; ?>
            
            <div class="reply-form">
                <form method="POST">
                    <textarea name="message" rows="4" placeholder="Write your reply here..." required></textarea>
                    <button type="submit" name="reply" class="btn-primary">
                        <i class="fas fa-paper-plane"></i> Send Reply
                    </button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>