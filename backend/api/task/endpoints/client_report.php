<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helper.php';
$admin = authenticate(true);
$clientId = $_GET['clientId'] ?? null;
if (!$clientId) jsonResponse(['success'=>false,'message'=>'clientId required'],400);

$pdo = getPDO();

$stmt = $pdo->prepare("SELECT id, name, code FROM clients WHERE id = :id");
$stmt->execute([':id'=>$clientId]);
$client = $stmt->fetch();

$stmt = $pdo->prepare("SELECT t.*, u.name AS employeeName FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.client_id = :clientId ORDER BY t.task_category, t.id");
$stmt->execute([':clientId'=>$clientId]);
$rows = $stmt->fetchAll();

// group by task_category
$grouped = [];
foreach ($rows as $r) {
    $cat = $r['task_category'];
    if (!isset($grouped[$cat])) $grouped[$cat] = [];
    $grouped[$cat][] = $r;
}

jsonResponse([
    'success'=>true,
    'data'=>[
        'client'=>$client,
        'tasks'=>$grouped,
        'generatedAt'=>date('c')
    ]
]);
