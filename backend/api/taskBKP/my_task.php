<?php
require "../../conn.php";
require "../../middleware.php";

$data = requireAuth();

$stmt = $con->prepare("
    SELECT t.*, u.name AS assigned_user
    FROM tasks t
    LEFT JOIN task_users u ON u.id = t.assigned_user_id
    WHERE t.assigned_user_id = ?
    ORDER BY t.due_date ASC
");
$stmt->bind_param("i", $data['id']);
$stmt->execute();

$result = $stmt->get_result();
$tasks = [];

while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode(["success" => true, "data" => $tasks]);
