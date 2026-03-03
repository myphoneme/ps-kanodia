<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helper.php';

$pdo = getPDO();

//authenticate();
$emp_id = $_GET['emp_id'];
$sql = " SELECT 
    t.*, 
    c.name AS clientName,
    u.name AS employeeName
FROM tasks t
LEFT JOIN clients c ON t.client_id = c.id
LEFT JOIN users u ON t.assigned_to = u.id
WHERE assigned_to = :emp_id
ORDER BY t.updated_at DESC";

$stmt = $pdo->prepare($sql);

$stmt->execute([':emp_id' => $emp_id]);

$tasks = $stmt->fetchAll();

jsonResponse([
    'success' => true,
    'data' => $tasks
]);
