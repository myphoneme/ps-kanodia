<?php
require "../../conn.php";
require "../../middleware.php";

$data = requireAuth();
requireAdmin($data);

$sql = "
    SELECT t.*, u.name AS assigned_user
    FROM tasks t
    LEFT JOIN task_users u ON u.id = t.assigned_user_id
    ORDER BY t.created_at DESC
";

$result = $con->query($sql);
$tasks = [];

while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode(["success" => true, "data" => $tasks]);
