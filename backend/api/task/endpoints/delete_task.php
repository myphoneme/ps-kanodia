<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helper.php';
$admin = authenticate(true);
$input = getJsonInput();
$id = $input['id'] ?? $_GET['id'] ?? null;
if (!$id) jsonResponse(['success'=>false,'message'=>'id required'],400);

$pdo = getPDO();
$stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
$stmt->execute([':id'=>$id]);

jsonResponse(['success'=>true]);
