<?php
require_once "../db.php";
require_once "../helper.php";

$admin = authenticate(true);

$id = $_GET['id'] ?? null;
if (!$id) jsonResponse(['success'=>false,'message'=>'id required'],400);

$pdo = getPDO();
$stmt = $pdo->prepare("DELETE FROM users WHERE id=?");
$stmt->execute([$id]);

jsonResponse(['success'=>true,'message'=>'User deleted']);
