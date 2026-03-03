<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helper.php';

//$admin = authenticate();
$pdo = getPDO();
$stmt = $pdo->prepare("SELECT id, username, role, name FROM users WHERE role = 'employee' ORDER BY name");
$stmt->execute();
$employees = $stmt->fetchAll();
jsonResponse(['success'=>true,'data'=>$employees]);
