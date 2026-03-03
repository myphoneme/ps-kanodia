<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helper.php';

$input = getJsonInput();

// id required
if (empty($input['id'])) {
    jsonResponse(['success' => false, 'message' => 'Task ID required'], 400);
}

$taskId = $input['id'];

$pdo = getPDO();

// Allowed fields to update
$allowedFields = [
    'client_id',
    'task_category',
    'task_name',
    'assigned_to',
    'deadline',
    'employee_task_comment',
    'priority',
    'status'
];

// Build dynamic SQL SET part
$setParts = [];
$params = [];

foreach ($allowedFields as $field) {
    if (isset($input[$field])) {  
        $setParts[] = "$field = :$field";
        $params[":$field"] = ($input[$field] === "" ? null : $input[$field]);
    }
}

// If no fields to update
if (empty($setParts)) {
    jsonResponse(['success' => false, 'message' => 'No fields to update'], 400);
}

$setSQL = implode(", ", $setParts);

// Add timestamp update
$setSQL .= ", updated_at = :updated_at";
$params[':updated_at'] = date('Y-m-d');

// Add WHERE condition
$sql = "UPDATE tasks SET $setSQL WHERE id = :id";
$params[':id'] = $taskId;

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

// Fetch updated task with joins
$stmt = $pdo->prepare("
SELECT t.*, c.name AS clientName, u.name AS employeeName
FROM tasks t
LEFT JOIN clients c ON t.client_id = c.id
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.id = :id
");

$stmt->execute([':id' => $taskId]);
$updatedTask = $stmt->fetch();

jsonResponse(['success' => true, 'data' => $updatedTask], 200);
