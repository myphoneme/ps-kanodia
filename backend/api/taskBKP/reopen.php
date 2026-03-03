<?php
require "../../conn.php";
require "../../middleware.php";

$data = requireAuth();
requireAdmin($data);

$input = json_decode(file_get_contents("php://input"), true);

$task_id = $input['task_id'];
$comment = $input['comment'];

$stmt = $con->prepare("UPDATE tasks SET status = 'in_progress' WHERE id = ?");
$stmt->bind_param("i", $task_id);
$stmt->execute();

$log = $con->prepare("INSERT INTO task_updates (task_id, user_id, old_status, new_status, comment)
                      VALUES (?, ?, 'completed', 'in_progress', ?)");
$log->bind_param("iis", $task_id, $data['id'], $comment);
$log->execute();

echo json_encode(["success" => true]);
