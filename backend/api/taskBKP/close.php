<?php
require "../../conn.php";
require "../../middleware.php";

$data = requireAuth();
requireAdmin($data);

$input = json_decode(file_get_contents("php://input"), true);

$task_id = $input['task_id'];

$stmt = $con->prepare("UPDATE tasks SET status = 'closed' WHERE id = ?");
$stmt->bind_param("i", $task_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}
