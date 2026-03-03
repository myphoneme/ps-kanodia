<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helper.php';
$admin = authenticate();
$input = getJsonInput();
$id = $input['id'] ?? null;
$status = $input['status'] ?? null;
$updatedTill = $input['updated_till'] ?? null;
$comments = $input['employee_task_comment'] ?? null;

if (!$id || !$status) jsonResponse(['success'=>false,'message'=>'id and status required'],400);

$pdo = getPDO();
$sql = "UPDATE tasks SET status = :status, updated_till = :updated_till, employee_task_comment = :employee_task_comment, updated_at = :updated_at WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':status'=>$status,
    ':updated_till'=>$updatedTill ? $updatedTill : null,
	':employee_task_comment'=>$comments ? $comments : null,
    ':updated_at'=>date('Y-m-d'),
    ':id'=>$id
]);

$stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = :id");
$stmt->execute([':id'=>$id]);
$task = $stmt->fetch();
jsonResponse(['success'=>true,'data'=>$task]);
