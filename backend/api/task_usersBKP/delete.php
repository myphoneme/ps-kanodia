<?php
require '../conn.php';
require '../middleware.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
header("Content-Type: application/json");

$data = requireAuth();
requireAdmin();

$id = $_GET['id'];

$stmt = $con->prepare("DELETE FROM task_users WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["message" => "User deleted"]);
