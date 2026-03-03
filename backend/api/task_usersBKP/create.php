<?php
require '../conn.php';
require '../middleware.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
header("Content-Type: application/json");

$data = requireAuth();
requireAdmin($data); 

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['name'], $input['email'], $input['password'], $input['designation'], $input['role'])) {
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$name = $input['name'];
$email = $input['email'];
$password = password_hash($input['password'], PASSWORD_DEFAULT);
$designation = $input['designation'];
$role = $input['role'];

$stmt = $con->prepare("INSERT INTO task_users (name, email, password, role, designation) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $email, $password, $role, $designation);

if ($stmt->execute()) {
    echo json_encode(["message" => "User created successfully"]);
} else {
    echo json_encode(["error" => $stmt->error]);
}
