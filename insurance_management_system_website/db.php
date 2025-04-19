<?php
$servername = "localhost";
$username = "root";
$password = "Nandani@2103"; // Update with your MySQL root password if any
$dbname = "insurance_management_system";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
