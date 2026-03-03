<?php
require "../../conn.php";
require "../../middleware.php";

$data = requireAuth();

$input = json_decode(file_get_contents("php://input"), true);

$task_id = $input['task_id'];
$status = $input['status'];

$stmt = $con->prepare("UPDATE tasks SET status = ? WHERE id = ? AND assigned_user_id = ?");
$stmt->bind_param("sii", $status, $task_id, $data['id']);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}
