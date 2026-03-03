<?php
header("Content-Type: application/json");
include "conn.php";

$report = [];

$tables = ['users', 'posts', 'categories', 'contact_us'];

foreach ($tables as $table) {
    $result = mysqli_query($con, "SELECT COUNT(*) as count FROM `$table` shadow_table");
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        $report[$table] = [
            "status" => "exists",
            "count" => intval($row['count'])
        ];
    } else {
        $report[$table] = [
            "status" => "error",
            "message" => mysqli_error($con)
        ];
    }
}

// Check recent blogs
$blogs_result = mysqli_query($con, "SELECT id, title FROM posts LIMIT 5");
$blogs = [];
if ($blogs_result) {
    while($row = mysqli_fetch_assoc($blogs_result)) {
        $blogs[] = $row;
    }
}

echo json_encode([
    "database_connection" => "OK",
    "table_counts" => $report,
    "recent_blogs" => $blogs,
    "php_version" => PHP_VERSION,
    "server_software" => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
]);
?>
