<?php
// admin.php - Admin panel for managing complaints
require_once 'config.php';
requireAdmin();

$complaints = getComplaints();
$users = getUsers();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    updateComplaintStatus($_POST['complaint_id'], $_POST['status'], $_POST['admin_response'] ?? null);
    header('Location: admin.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Complaint Management</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: #f3f4f6;
        }
        
        .navbar {
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.3rem;
            font-weight: 700;
            color: #1f2937;
        }
        
        .logo i {
            color: #667eea;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #6b7280;
            font-weight: 500;
        }
        
        .nav-links a.active {
            color: #667eea;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .logout-btn {
            padding: 0.5rem 1rem;
            background: #fee2e2;
            color: #dc2626;
            border-radius: 0.5rem;
            text-decoration: none;
        }
        
        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .complaint-list {
            background: white;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .complaint-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .complaint-item {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .complaint-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .status-select {
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            border: 1px solid #e5e7eb;
        }
        
        .btn-update {
            padding: 0.25rem 1rem;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
        }
        
        .admin-response {
            margin-top: 1rem;
            padding: 1rem;
            background: #f3f4f6;
            border-radius: 0.5rem;
        }
        
        .admin-response textarea {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            margin-top: 0.5rem;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">
            <i class="fas fa-ticket-alt"></i>
            <span>Admin Portal</span>
        </div>
        <div class="nav-links">
            <a href="dashboard.php">Dashboard</a>
            <a href="admin.php" class="active">Admin Panel</a>
        </div>
        <div class="user-info">
            <span><i class="fas fa-user-shield"></i> <?= htmlspecialchars($_SESSION['user']['name']) ?></span>
            <a href="logout.php" class="logout-btn">Logout</a>
        </div>
    </nav>
    
    <div class="container">
        <div class="complaint-list">
            <div class="complaint-header">
                <h2><i class="fas fa-clipboard-list"></i> All Complaints</h2>
            </div>
            
            <?php foreach ($complaints as $complaint): 
                $user = getUserById($complaint['user_id']);
            ?>
            <div class="complaint-item">
                <div class="complaint-title">
                    #<?= $complaint['id'] ?> - <?= htmlspecialchars($complaint['title']) ?>
                </div>
                <div style="color: #6b7280; font-size: 0.85rem; margin-bottom: 0.5rem;">
                    From: <?= htmlspecialchars($user['name']) ?> (<?= htmlspecialchars($user['email']) ?>)<br>
                    Department: <?= htmlspecialchars($complaint['department']) ?> | 
                    Priority: <?= ucfirst($complaint['priority']) ?> | 
                    Date: <?= date('M d, Y', strtotime($complaint['created_at'])) ?>
                </div>
                <div style="margin-bottom: 1rem;">
                    <?= nl2br(htmlspecialchars($complaint['description'])) ?>
                </div>
                
                <form method="POST" style="display: inline-block;">
                    <input type="hidden" name="complaint_id" value="<?= $complaint['id'] ?>">
                    <select name="status" class="status-select">
                        <option value="pending" <?= $complaint['status'] === 'pending' ? 'selected' : '' ?>>Pending</option>
                        <option value="in-progress" <?= $complaint['status'] === 'in-progress' ? 'selected' : '' ?>>In Progress</option>
                        <option value="resolved" <?= $complaint['status'] === 'resolved' ? 'selected' : '' ?>>Resolved</option>
                    </select>
                    <button type="submit" name="update_status" class="btn-update">Update Status</button>
                </form>
                
                <div class="admin-response">
                    <form method="POST">
                        <input type="hidden" name="complaint_id" value="<?= $complaint['id'] ?>">
                        <textarea name="admin_response" placeholder="Add response to user..."><?= htmlspecialchars($complaint['admin_response'] ?? '') ?></textarea>
                        <button type="submit" name="update_status" class="btn-update" style="margin-top: 0.5rem;">Send Response</button>
                    </form>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>
</html>