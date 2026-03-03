<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
header("Content-Type: application/json");

require "../../conn.php";
require "../../middleware.php";

$data = requireAuth();
requireAdmin($data);

$input = json_decode(file_get_contents("php://input"), true);

$title = $input['title'];
$description = $input['description'];
$assigned_user_id = $input['assigned_user_id'];
$priority = $input['priority'];
$due_date = $input['due_date'];

$stmt = $con->prepare("
    INSERT INTO tasks (title, description, assigned_user_id, priority, due_date, status, created_by)
    VALUES (?, ?, ?, ?, ?, 'pending', ?)
");
$stmt->bind_param("ssisss", $title, $description, $assigned_user_id, $priority, $due_date, $data['id']);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Task created"]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}
