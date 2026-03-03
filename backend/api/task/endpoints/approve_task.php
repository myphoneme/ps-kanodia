<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helper.php';
$admin = authenticate(true);
$input = getJsonInput();
$id = $input['id'] ?? null;
$approvalStatus = $input['approvalStatus'] ?? null;

if (!$id || !$approvalStatus) jsonResponse(['success'=>false,'message'=>'id and approvalStatus required'],400);

$pdo = getPDO();
$stmt = $pdo->prepare("UPDATE tasks SET approval_status = :ap, updated_at = :updated WHERE id = :id");
$stmt->execute([':ap'=>$approvalStatus, ':updated'=>date('Y-m-d'), ':id'=>$id]);

$stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = :id");
$stmt->execute([':id'=>$id]);
$task = $stmt->fetch();

jsonResponse(['success'=>true,'data'=>$task]);
