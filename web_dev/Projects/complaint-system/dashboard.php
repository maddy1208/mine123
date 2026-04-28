<?php
// dashboard.php - Main dashboard for users
require_once 'config.php';
requireLogin();

$user = $_SESSION['user'];
$complaints = getComplaints($user['id']);
$stats = [
    'total' => count($complaints),
    'pending' => count(array_filter($complaints, fn($c) => $c['status'] === 'pending')),
    'in-progress' => count(array_filter($complaints, fn($c) => $c['status'] === 'in-progress')),
    'resolved' => count(array_filter($complaints, fn($c) => $c['status'] === 'resolved'))
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Complaint Management</title>
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
            position: sticky;
            top: 0;
            z-index: 100;
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
            font-size: 1.5rem;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #6b7280;
            font-weight: 500;
            transition: color 0.2s;
        }
        
        .nav-links a:hover, .nav-links a.active {
            color: #667eea;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .user-info span {
            font-weight: 500;
            color: #374151;
        }
        
        .logout-btn {
            padding: 0.5rem 1rem;
            background: #fee2e2;
            color: #dc2626;
            border-radius: 0.5rem;
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .stat-card h3 {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
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
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .complaint-item {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .complaint-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .status {
            padding: 0.25rem 0.75rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .status-pending {
            background: #fef3c7;
            color: #d97706;
        }
        
        .status-in-progress {
            background: #dbeafe;
            color: #2563eb;
        }
        
        .status-resolved {
            background: #d1fae5;
            color: #059669;
        }
        
        .complaint-meta {
            display: flex;
            gap: 1rem;
            margin-top: 0.5rem;
            font-size: 0.85rem;
            color: #6b7280;
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            max-width: 500px;
            width: 90%;
        }
        
        .modal-content h2 {
            margin-bottom: 1rem;
        }
        
        .modal-content input, .modal-content select, .modal-content textarea {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            font-family: inherit;
        }
        
        .modal-content textarea {
            resize: vertical;
            min-height: 100px;
        }
        
        .modal-buttons {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .btn-secondary {
            padding: 0.75rem 1.5rem;
            background: #e5e7eb;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">
            <i class="fas fa-ticket-alt"></i>
            <span>Complaint Portal</span>
        </div>
        <div class="nav-links">
            <a href="dashboard.php" class="active">Dashboard</a>
            <?php if ($user['role'] === 'admin'): ?>
            <a href="admin.php">Admin Panel</a>
            <?php endif; ?>
        </div>
        <div class="user-info">
            <span><i class="fas fa-user"></i> <?= htmlspecialchars($user['name']) ?></span>
            <a href="logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </nav>
    
    <div class="container">
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Complaints</h3>
                <div class="stat-number"><?= $stats['total'] ?></div>
            </div>
            <div class="stat-card">
                <h3>Pending</h3>
                <div class="stat-number"><?= $stats['pending'] ?></div>
            </div>
            <div class="stat-card">
                <h3>In Progress</h3>
                <div class="stat-number"><?= $stats['in-progress'] ?></div>
            </div>
            <div class="stat-card">
                <h3>Resolved</h3>
                <div class="stat-number"><?= $stats['resolved'] ?></div>
            </div>
        </div>
        
        <div class="complaint-list">
            <div class="complaint-header">
                <h2><i class="fas fa-list"></i> Your Complaints</h2>
                <button class="btn-primary" onclick="openModal()">
                    <i class="fas fa-plus"></i> New Complaint
                </button>
            </div>
            
            <?php if (empty($complaints)): ?>
                <div style="padding: 3rem; text-align: center; color: #6b7280;">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>No complaints yet. Submit your first complaint!</p>
                </div>
            <?php else: ?>
                <?php foreach ($complaints as $complaint): ?>
                <div class="complaint-item">
                    <div class="complaint-title">
                        <?= htmlspecialchars($complaint['title']) ?>
                        <span class="status status-<?= str_replace('-', '', $complaint['status']) ?>">
                            <?= ucfirst($complaint['status']) ?>
                        </span>
                    </div>
                    <div class="complaint-meta">
                        <span><i class="fas fa-calendar"></i> <?= date('M d, Y', strtotime($complaint['created_at'])) ?></span>
                        <span><i class="fas fa-building"></i> <?= htmlspecialchars($complaint['department']) ?></span>
                        <span><i class="fas fa-flag"></i> Priority: <?= ucfirst($complaint['priority']) ?></span>
                    </div>
                    <div style="margin-top: 0.5rem; color: #4b5563;">
                        <?= htmlspecialchars(substr($complaint['description'], 0, 150)) ?>...
                    </div>
                    <?php if (!empty($complaint['admin_response'])): ?>
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #f3f4f6; border-radius: 0.5rem;">
                        <strong><i class="fas fa-reply"></i> Admin Response:</strong>
                        <p style="margin-top: 0.3rem;"><?= htmlspecialchars($complaint['admin_response']) ?></p>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
    
    <!-- Modal for new complaint -->
    <div id="complaintModal" class="modal">
        <div class="modal-content">
            <h2>Submit New Complaint</h2>
            <form method="POST" action="submit_complaint.php">
                <input type="text" name="title" placeholder="Complaint Title" required>
                <select name="department" required>
                    <option value="">Select Department</option>
                    <?php foreach (getDepartments() as $dept): ?>
                    <option value="<?= htmlspecialchars($dept['name']) ?>"><?= htmlspecialchars($dept['name']) ?></option>
                    <?php endforeach; ?>
                </select>
                <select name="priority" required>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
                <textarea name="description" placeholder="Describe your complaint in detail..." required></textarea>
                <div class="modal-buttons">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Submit Complaint</button>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        function openModal() {
            document.getElementById('complaintModal').style.display = 'flex';
        }
        
        function closeModal() {
            document.getElementById('complaintModal').style.display = 'none';
        }
    </script>
</body>
</html>