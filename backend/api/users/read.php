<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

require_once __DIR__ . "/../conn.php";
require_once __DIR__ . "/../middleware.php";

$data = requireAuth();
requireAdmin($data);

$q = mysqli_query($con, "SELECT id, name, email, role, created_at FROM users");

$users = [];
while ($row = mysqli_fetch_assoc($q)) {
    $users[] = $row;
}

response(["status" => "success", "users" => $users]);
?>
