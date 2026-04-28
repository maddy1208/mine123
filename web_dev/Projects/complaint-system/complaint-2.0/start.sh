#!/bin/bash

# Start XAMPP MySQL
echo "Starting XAMPP MySQL..."
sudo /opt/lampp/lampp startmysql

# Wait for MySQL to start
sleep 3

# Check if MySQL is running
if sudo /opt/lampp/lampp status | grep -q "mysql.*running"; then
    echo "✅ MySQL is running"
else
    echo "❌ MySQL failed to start"
    exit 1
fi

# Navigate to project
cd /home/maddy/techiee/web_dev/Projects/complaint-system/complaint-2.0

# Check if mysqli is available
if /opt/lampp/bin/php -m | grep -q "mysqli"; then
    echo "✅ MySQLi extension is available"
else
    echo "❌ MySQLi extension not found"
    exit 1
fi

# Start PHP server with XAMPP's PHP
echo "🚀 Starting server at http://localhost:8000"
echo "Press Ctrl+C to stop"

/opt/lampp/bin/php -S localhost:8000
