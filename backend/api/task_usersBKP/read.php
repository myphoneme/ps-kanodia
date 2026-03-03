<?php
require '../conn.php';
require '../middleware.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
header("Content-Type: application/json");

$data = requireAuth();
 

$q = $con->query("SELECT id, name, email, role, designation, status, created_at FROM task_users ORDER BY id DESC");

$users = [];
while ($row = $q->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);
