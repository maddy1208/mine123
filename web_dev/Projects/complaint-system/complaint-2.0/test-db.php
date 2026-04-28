<?php
echo "<h2>Testing Database Connection</h2>";

// Test MySQL connection
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$port = 3306;

echo "<p>Attempting to connect to MySQL at $host:$port...</p>";

$conn = @new mysqli($host, $user, $pass, '', $port);

if ($conn->connect_error) {
    echo "<p style='color:red'>❌ Connection failed: " . $conn->connect_error . "</p>";
    echo "<p>Make sure XAMPP MySQL is running:</p>";
    echo "<code>sudo /opt/lampp/lampp startmysql</code>";
} else {
    echo "<p style='color:green'>✅ Successfully connected to MySQL!</p>";
    
    // Check if database exists
    $result = $conn->query("SHOW DATABASES LIKE 'complaint_system'");
    if ($result->num_rows > 0) {
        echo "<p style='color:green'>✅ Database 'complaint_system' exists</p>";
    } else {
        echo "<p style='color:orange'>⚠️ Database 'complaint_system' not found. It will be created automatically.</p>";
    }
    
    $conn->close();
}

echo "<hr>";
echo "<p><a href='login.php'>Go to Login Page</a></p>";
?>