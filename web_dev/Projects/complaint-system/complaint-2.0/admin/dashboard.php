<?php
// admin/dashboard.php - Admin Panel
require_once '../config/database.php';
requireAdmin();

$db = Database::getInstance()->getConnection();

// Get statistics
$stats = [];
$stats['total'] = $db->query("SELECT COUNT(*) as count FROM complaints")->fetch_assoc()['count'];
$stats['pending'] = $db->query("SELECT COUNT(*) as count FROM complaints WHERE status = 'pending'")->fetch_assoc()['count'];
$stats['in_progress'] = $db->query("SELECT COUNT(*) as count FROM complaints WHERE status = 'in-progress'")->fetch_assoc()['count'];
$stats['resolved'] = $db->query("SELECT COUNT(*) as count FROM complaints WHERE status = 'resolved'")->fetch_assoc()['count'];
$stats['users'] = $db->query("SELECT COUNT(*) as count FROM users WHERE role = 'user'")->fetch_assoc()['count'];

// Get recent complaints
$complaints = $db->query("
    SELECT c.*, d.name as department_name, u.name as user_name
    FROM complaints c
    JOIN departments d ON c.department_id = d.id
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC LIMIT 20
");

// Handle status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    $complaintId = $_POST['complaint_id'];
    $status = $_POST['status'];
    $response = $_POST['admin_response'] ?? null;
    
    $stmt = $db->prepare("UPDATE complaints SET status = ?, admin_response = ?, updated_at = NOW() WHERE id = ?");
    $stmt->bind_param("ssi", $status, $response, $complaintId);
    $stmt->execute();
    
    // Get user_id for notification
    $userStmt = $db->prepare("SELECT user_id FROM complaints WHERE id = ?");
    $userStmt->bind_param("i", $complaintId);
    $userStmt->execute();
    $userId = $userStmt->get_result()->fetch_assoc()['user_id'];
    
    // Create notification
    $notifyStmt = $db->prepare("INSERT INTO notifications (user_id, complaint_id, title, message, type) VALUES (?, ?, ?, ?, 'status_change')");
    $title = "Complaint Status Updated";
    $message = "Your complaint #$complaintId status changed to " . ucfirst(str_replace('-', ' ', $status));
    $notifyStmt->bind_param("iiss", $userId, $complaintId, $title, $message);
    $notifyStmt->execute();
    
    header('Location: dashboard.php?success=updated');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Complaint Management System</title>
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
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: white;
            border-radius: 1rem;
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .stat-number { font-size: 2rem; font-weight: 700; }
        
        .complaints-table {
            background: white;
            border-radius: 1rem;
            overflow-x: auto;
        }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
        
        .status-select {
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            border: 1px solid #e5e7eb;
        }
        .btn-update {
            padding: 0.25rem 0.75rem;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
        }
        .status-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-in-progress { background: #dbeafe; color: #2563eb; }
        .status-resolved { background: #d1fae5; color: #059669; }
        
        @media (max-width: 768px) {
            .sidebar { left: -280px; }
            .main-content { margin-left: 0; }
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h2><i class="fas fa-ticket-alt"></i> Admin Panel</h2>
        </div>
        <div class="sidebar-nav">
            <a href="dashboard.php" class="active"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            <a href="../dashboard.php"><i class="fas fa-arrow-left"></i> Back to User Panel</a>
            <a href="../logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>
    
    <div class="main-content">
        <div class="top-bar">
            <h2><i class="fas fa-user-shield"></i> Admin Dashboard</h2>
            <div>Welcome, <?= htmlspecialchars($_SESSION['user_name']) ?></div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div><h3>Total Complaints</h3><div class="stat-number"><?= $stats['total'] ?></div></div>
                <i class="fas fa-ticket-alt fa-2x" style="color: #4f46e5;"></i>
            </div>
            <div class="stat-card">
                <div><h3>Pending</h3><div class="stat-number"><?= $stats['pending'] ?></div></div>
                <i class="fas fa-clock fa-2x" style="color: #f59e0b;"></i>
            </div>
            <div class="stat-card">
                <div><h3>In Progress</h3><div class="stat-number"><?= $stats['in_progress'] ?></div></div>
                <i class="fas fa-spinner fa-2x" style="color: #3b82f6;"></i>
            </div>
            <div class="stat-card">
                <div><h3>Resolved</h3><div class="stat-number"><?= $stats['resolved'] ?></div></div>
                <i class="fas fa-check-circle fa-2x" style="color: #10b981;"></i>
            </div>
            <div class="stat-card">
                <div><h3>Total Users</h3><div class="stat-number"><?= $stats['users'] ?></div></div>
                <i class="fas fa-users fa-2x" style="color: #8b5cf6;"></i>
            </div>
        </div>
        
        <div class="complaints-table">
            <table>
                <thead>
                    <tr><th>ID</th><th>Complaint #</th><th>User</th><th>Title</th><th>Department</th><th>Priority</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                    <?php while ($complaint = $complaints->fetch_assoc()): ?>
                    <tr>
                        <td><?= $complaint['id'] ?></td>
                        <td><?= $complaint['complaint_number'] ?></td>
                        <td><?= htmlspecialchars($complaint['user_name']) ?></td>
                        <td><?= htmlspecialchars(substr($complaint['title'], 0, 30)) ?>...</td>
                        <td><?= htmlspecialchars($complaint['department_name']) ?></td>
                        <td><span class="status-badge status-<?= $complaint['priority'] ?>"><?= ucfirst($complaint['priority']) ?></span></td>
                        <td>
                            <form method="POST" style="display: flex; gap: 0.5rem; align-items: center;">
                                <input type="hidden" name="complaint_id" value="<?= $complaint['id'] ?>">
                                <select name="status" class="status-select">
                                    <option value="pending" <?= $complaint['status'] === 'pending' ? 'selected' : '' ?>>Pending</option>
                                    <option value="in-progress" <?= $complaint['status'] === 'in-progress' ? 'selected' : '' ?>>In Progress</option>
                                    <option value="resolved" <?= $complaint['status'] === 'resolved' ? 'selected' : '' ?>>Resolved</option>
                                    <option value="closed" <?= $complaint['status'] === 'closed' ? 'selected' : '' ?>>Closed</option>
                                </select>
                                <button type="submit" name="update_status" class="btn-update">Update</button>
                            </form>
                        </td>
                        <td><a href="../view-complaint.php?id=<?= $complaint['id'] ?>" style="color: #4f46e5;">View</a></td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>