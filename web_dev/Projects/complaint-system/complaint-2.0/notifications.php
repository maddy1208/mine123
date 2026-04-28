<?php
// notifications.php
require_once 'config/database.php';
requireLogin();

$db = Database::getInstance()->getConnection();
$userId = $_SESSION['user_id'];

// Mark all as read
if (isset($_GET['mark_read'])) {
    $stmt = $db->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    header('Location: notifications.php');
    exit;
}

// Mark single as read
if (isset($_GET['read'])) {
    $stmt = $db->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $_GET['read'], $userId);
    $stmt->execute();
    header('Location: notifications.php');
    exit;
}

// Get notifications
$stmt = $db->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $userId);
$stmt->execute();
$notifications = $stmt->get_result();
$unreadCount = $db->query("SELECT COUNT(*) as count FROM notifications WHERE user_id = $userId AND is_read = 0")->fetch_assoc()['count'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifications - Complaint Management System</title>
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
        .sidebar-nav a:hover, .sidebar-nav a.active { background: rgba(79, 70, 229, 0.2); color: white; }
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
        .notifications-container {
            background: white;
            border-radius: 1rem;
            overflow: hidden;
        }
        .notification-item {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            gap: 1rem;
            align-items: start;
            transition: background 0.3s;
        }
        .notification-item.unread {
            background: #eff6ff;
        }
        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .notification-content { flex: 1; }
        .notification-title { font-weight: 600; margin-bottom: 0.25rem; }
        .notification-message { color: #6b7280; font-size: 0.9rem; }
        .notification-time { font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem; }
        .mark-read {
            color: #4f46e5;
            text-decoration: none;
            font-size: 0.8rem;
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
            <a href="notifications.php" class="active"><i class="fas fa-bell"></i> Notifications</a>
            <a href="profile.php"><i class="fas fa-user"></i> Profile</a>
            <a href="logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>
    
    <div class="main-content">
        <div class="top-bar">
            <h2><i class="fas fa-bell"></i> Notifications 
                <?php if ($unreadCount > 0): ?>
                    <span style="font-size: 0.8rem; background: #ef4444; color: white; padding: 0.2rem 0.6rem; border-radius: 1rem;"><?= $unreadCount ?> new</span>
                <?php endif; ?>
            </h2>
            <div>
                <?php if ($unreadCount > 0): ?>
                    <a href="?mark_read=1" style="color: #4f46e5;">Mark all as read</a>
                <?php endif; ?>
            </div>
        </div>
        
        <div class="notifications-container">
            <?php if ($notifications->num_rows === 0): ?>
                <div style="padding: 3rem; text-align: center; color: #6b7280;">
                    <i class="fas fa-bell-slash" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>No notifications yet</p>
                </div>
            <?php else: ?>
                <?php while ($notif = $notifications->fetch_assoc()): ?>
                <div class="notification-item <?= $notif['is_read'] ? '' : 'unread' ?>">
                    <div class="notification-icon" style="background: <?= $notif['is_read'] ? '#e5e7eb' : '#e0e7ff' ?>; color: #4f46e5;">
                        <i class="fas fa-bell"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title"><?= htmlspecialchars($notif['title']) ?></div>
                        <div class="notification-message"><?= htmlspecialchars($notif['message']) ?></div>
                        <div class="notification-time">
                            <?= date('M d, Y H:i', strtotime($notif['created_at'])) ?>
                            <?php if (!$notif['is_read']): ?>
                                - <a href="?read=<?= $notif['id'] ?>" class="mark-read">Mark as read</a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <?php endwhile; ?>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>