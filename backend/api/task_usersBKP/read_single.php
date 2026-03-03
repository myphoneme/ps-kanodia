<?php
require '../conn.php';
require '../middleware.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
header("Content-Type: application/json");

$data = requireAuth();
 

$id = $_GET['id'] ?? null;

$q = $con->prepare("SELECT id, name, email, role, designation, status FROM task_users WHERE id=?");
$q->bind_param("i", $id);
$q->execute();
$res = $q->get_result();

echo json_encode($res->fetch_assoc());
