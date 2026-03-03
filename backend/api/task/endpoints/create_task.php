<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helper.php';

$input = getJsonInput();
$required = ['client_id','task_category','task_name','created_by','assigned_to'];

foreach($required as $r) {
    if (empty($input[$r])) jsonResponse(['success'=>false,'message'=> "$r required"], 400);
}

$pdo = getPDO();

$sql = "INSERT INTO tasks 
(client_id, task_category, task_name, assigned_to, deadline, employee_task_comment, priority, status, updated_till, created_by, created_at, updated_at, approval_status)
VALUES 
(:client_id, :task_category, :task_name, :assigned_to, :deadline, :employee_task_comment, :priority, 'pending', NULL, :created_by, :created_at, :updated_at, 'pending')";

$stmt = $pdo->prepare($sql);

$today = date('Y-m-d');

$stmt->execute([
    ':client_id' => $input['client_id'],
    ':task_category' => $input['task_category'],
    ':task_name' => $input['task_name'],
    ':assigned_to' => !empty($input['assigned_to']) ? $input['assigned_to'] : null,
    ':deadline' => !empty($input['deadline']) ? $input['deadline'] : null,
    ':employee_task_comment' => !empty($input['employee_task_comment']) ? $input['employee_task_comment'] : null,
    ':priority' => !empty($input['priority']) ? $input['priority'] : 'medium',
    ':created_by' => $input['created_by'],
    ':created_at' => $today,
    ':updated_at' => $today
]);

$taskId = $pdo->lastInsertId();

$stmt = $pdo->prepare("
SELECT t.*, c.name AS clientName, u.name AS employeeName 
FROM tasks t 
LEFT JOIN clients c ON t.client_id = c.id 
LEFT JOIN users u ON t.assigned_to = u.id 
WHERE t.id = :id
");

$stmt->execute([':id' => $taskId]);
$task = $stmt->fetch();

jsonResponse(['success'=>true, 'data'=>$task], 201);
