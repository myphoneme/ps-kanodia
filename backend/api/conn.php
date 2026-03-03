<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "mydb";

$con = mysqli_connect($host, $user, $pass, $db);

if (!$con) {
    die("DB Connection failed: " . mysqli_connect_error());
}
?>
