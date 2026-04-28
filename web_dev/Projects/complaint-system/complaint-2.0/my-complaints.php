<?php
// my-complaints.php
require_once 'config/database.php';
requireLogin();

$db = Database::getInstance()->getConnection();
$userId = $_SESSION['user_id'];

// Pagination
$page = $_GET['page'] ?? 1;
$limit = 10;
$offset = ($page - 1) * $limit;

// Get total count
$countStmt = $db->prepare("SELECT COUNT(*) as total FROM complaints WHERE user_id = ?");
$countStmt->bind_param("i", $userId);
$countStmt->execute();
$total = $countStmt->get_result()->fetch_assoc()['total'];
$totalPages = ceil($total / $limit);

// Get complaints
$stmt = $db->prepare("
    SELECT c.*, d.name as department_name 
    FROM complaints c 
    JOIN departments d ON c.department_id = d.id 
    WHERE c.user_id = ? 
    ORDER BY c.created_at DESC 
    LIMIT ? OFFSET ?
");
$stmt->bind_param("iii", $userId, $limit, $offset);
$stmt->execute();
$complaints = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Complaints - Complaint Management System</title>
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
        
        .complaints-container {
            background: white;
            border-radius: 1rem;
            overflow: hidden;
        }
        .complaint-item {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            transition: background 0.3s;
        }
        .complaint-item:hover { background: #f9fafb; }
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-in-progress { background: #dbeafe; color: #2563eb; }
        .status-resolved { background: #d1fae5; color: #059669; }
        
        .pagination {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            padding: 1.5rem;
        }
        .pagination a, .pagination span {
            padding: 0.5rem 1rem;
            background: #f3f4f6;
            text-decoration: none;
            color: #374151;
            border-radius: 0.5rem;
        }
        .pagination .active {
            background: #4f46e5;
            color: white;
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
            <a href="my-complaints.php" class="active"><i class="fas fa-list"></i> My Complaints</a>
            <a href="notifications.php"><i class="fas fa-bell"></i> Notifications</a>
            <a href="profile.php"><i class="fas fa-user"></i> Profile</a>
            <a href="logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>
    
    <div class="main-content">
        <div class="top-bar">
            <h2><i class="fas fa-list"></i> My Complaints</h2>
            <div class="user-menu">
                <div class="user-avatar"><?= strtoupper(substr($_SESSION['user_name'], 0, 1)) ?></div>
                <span><?= htmlspecialchars($_SESSION['user_name']) ?></span>
            </div>
        </div>
        
        <div class="complaints-container">
            <?php if ($complaints->num_rows === 0): ?>
            <div style="padding: 3rem; text-align: center; color: #6b7280;">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No complaints found.</p>
            </div>
            <?php else: ?>
                <?php while ($complaint = $complaints->fetch_assoc()): ?>
                <div class="complaint-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <div>
                            <strong><?= htmlspecialchars($complaint['title']) ?></strong>
                            <span style="font-size: 0.8rem; color: #6b7280; margin-left: 0.5rem;">#<?= $complaint['complaint_number'] ?></span>
                        </div>
                        <span class="status-badge status-<?= str_replace('-', '', $complaint['status']) ?>">
                            <?= ucfirst(str_replace('-', ' ', $complaint['status'])) ?>
                        </span>
                    </div>
                    <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.5rem;">
                        <i class="fas fa-building"></i> <?= htmlspecialchars($complaint['department_name']) ?> |
                        <i class="fas fa-calendar"></i> <?= date('M d, Y', strtotime($complaint['created_at'])) ?> |
                        <i class="fas fa-flag"></i> <?= ucfirst($complaint['priority']) ?>
                    </div>
                    <div><?= htmlspecialchars(substr($complaint['description'], 0, 100)) ?>...</div>
                    <a href="view-complaint.php?id=<?= $complaint['id'] ?>" style="color: #4f46e5; text-decoration: none; font-size: 0.85rem; margin-top: 0.5rem; display: inline-block;">
                        View Details <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
                <?php endwhile; ?>
                
                <?php if ($totalPages > 1): ?>
                <div class="pagination">
                    <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                        <a href="?page=<?= $i ?>" class="<?= $i == $page ? 'active' : '' ?>"><?= $i ?></a>
                    <?php endfor; ?>
                </div>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>