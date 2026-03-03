<?php
require "../../conn.php";
require "../../middleware.php";

$data = requireAuth();

$id = $_GET['id'];

$stmt = $con->prepare("
    SELECT t.*, u.name AS assigned_user
    FROM tasks t
    LEFT JOIN task_users u ON u.id = t.assigned_user_id
    WHERE t.id = ?
");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$task = $result->fetch_assoc();

echo json_encode(["success" => true, "data" => $task]);
