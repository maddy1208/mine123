<?php
// index.php
require_once 'config/database.php';

// Check if user is logged in
if (isLoggedIn()) {
    header('Location: dashboard.php');
    exit;
}
header('Location: login.php');
?>