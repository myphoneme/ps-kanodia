<?php
include "../conn.php";
include "../middleware.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

$data = requireAuth();
requireAdmin($data);

$body = json_decode(file_get_contents("php://input"), true);

$id          = $body['id'];
$name        = $body['name'];
$email       = $body['email'];
$password    = $body['password'];
$designation = $body['designation'];
$role        = $body['role'];

if (
    empty($id) || empty($name) || empty($email) || 
    empty($password) || empty($designation) || empty($role)
) {
    echo json_encode(["message" => "Field is missing"]);
    exit;
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $con->prepare("
    UPDATE task_users
    SET name = ?, email = ?, role = ?, password = ?, designation = ?
    WHERE id = ?
");

if (!$stmt) {
    echo json_encode(["error" => $con->error]);
    exit;
}

$stmt->bind_param(
    "sssssi", 
    $name,
    $email,
    $role,
    $hashedPassword,
    $designation,
    $id
);

if (!$stmt->execute()) {
    echo json_encode(["error" => $stmt->error]);
    exit;
}

echo json_encode(["status" => "success", "message" => "User updated"]);
?>
