<?php
require_once 'config/database.php';
requireLogin();

$db = Database::getInstance()->getConnection();
$userId = $_SESSION['user_id'];

// Get user statistics
$statsStmt = $db->prepare("
    SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
    FROM complaints WHERE user_id = ?
");
$statsStmt->bind_param("i", $userId);
$statsStmt->execute();
$stats = $statsStmt->get_result()->fetch_assoc();

// Get recent complaints
$complaintsStmt = $db->prepare("
    SELECT c.*, d.name as department_name 
    FROM complaints c 
    JOIN departments d ON c.department_id = d.id 
    WHERE c.user_id = ? 
    ORDER BY c.created_at DESC LIMIT 10
");
$complaintsStmt->bind_param("i", $userId);
$complaintsStmt->execute();
$complaints = $complaintsStmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Complaint Management System</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f3f4f6; }
        
        .navbar {
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
        }
        
        .nav-links a {
            color: #666;
            text-decoration: none;
            margin-left: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 20px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
        }
        
        .complaints-section {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .section-header {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
        }
        
        .complaint-item {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-in-progress { background: #dbeafe; color: #2563eb; }
        .status-resolved { background: #d1fae5; color: #059669; }
        
        .logout-btn {
            color: #dc2626 !important;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">
            <i class="fas fa-ticket-alt"></i> ComplaintHub
        </div>
        <div class="nav-links">
            <a href="dashboard.php">Dashboard</a>
            <a href="my-complaints.php">My Complaints</a>
            <a href="logout.php" class="logout-btn">Logout</a>
        </div>
    </nav>
    
    <div class="container">
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Complaints</h3>
                <div class="stat-number"><?= $stats['total'] ?? 0 ?></div>
            </div>
            <div class="stat-card">
                <h3>Pending</h3>
                <div class="stat-number"><?= $stats['pending'] ?? 0 ?></div>
            </div>
            <div class="stat-card">
                <h3>In Progress</h3>
                <div class="stat-number"><?= $stats['in_progress'] ?? 0 ?></div>
            </div>
            <div class="stat-card">
                <h3>Resolved</h3>
                <div class="stat-number"><?= $stats['resolved'] ?? 0 ?></div>
            </div>
        </div>
        
        <div class="complaints-section">
            <div class="section-header">
                <h2>Recent Complaints</h2>
                <button class="btn-primary" onclick="window.location.href='new-complaint.php'">
                    <i class="fas fa-plus"></i> New Complaint
                </button>
            </div>
            
            <?php if ($complaints->num_rows === 0): ?>
                <div style="padding: 40px; text-align: center; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 10px;"></i>
                    <p>No complaints yet. Submit your first complaint!</p>
                </div>
            <?php else: ?>
                <?php while ($complaint = $complaints->fetch_assoc()): ?>
                <div class="complaint-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong><?= htmlspecialchars($complaint['title']) ?></strong>
                        <span class="status-badge status-<?= str_replace('-', '', $complaint['status']) ?>">
                            <?= ucfirst($complaint['status']) ?>
                        </span>
                    </div>
                    <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
                        <i class="fas fa-building"></i> <?= htmlspecialchars($complaint['department_name']) ?> |
                        <i class="fas fa-calendar"></i> <?= date('M d, Y', strtotime($complaint['created_at'])) ?>
                    </div>
                    <div style="color: #666;"><?= htmlspecialchars(substr($complaint['description'], 0, 100)) ?>...</div>
                </div>
                <?php endwhile; ?>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>