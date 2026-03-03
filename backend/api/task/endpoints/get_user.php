<?php
require_once "../db.php";
require_once "../helper.php";
$admin = authenticate();
$id = $_GET['id'] ?? null;
if (!$id) jsonResponse(['success'=>false,'message'=>'id required'],400);

$pdo = getPDO();
$stmt = $pdo->prepare("SELECT id, username, role, name, created_at FROM users WHERE id=?");
$stmt->execute([$id]);

jsonResponse(['success'=>true, 'data'=>$stmt->fetch()]);
