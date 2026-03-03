<?php
require_once "../db.php";
require_once "../helper.php";
$admin = authenticate();
$pdo = getPDO();
$stmt = $pdo->query("SELECT id, username, role, name, created_at FROM users ORDER BY id DESC");
jsonResponse(['success'=>true, 'data'=>$stmt->fetchAll()]);
