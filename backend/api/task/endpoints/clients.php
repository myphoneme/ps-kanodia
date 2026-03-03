<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helper.php';

$pdo = getPDO();
$stmt = $pdo->query("SELECT id, name, code FROM clients ORDER BY name");
$clients = $stmt->fetchAll();

jsonResponse(['success'=>true, 'data'=>$clients]);
