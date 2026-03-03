<?php

require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helper.php';
require_once __DIR__.'/../config.php';
//$admin = authenticate();
$pdo = getPDO();

$filters = [];
$where = [];
$params = [];

if (!empty($_GET['employeeId'])) {
    $where[] = "t.assigned_to = :employeeId";
    $params[':employeeId'] = (int)$_GET['employeeId'];
}
if (!empty($_GET['clientId'])) {
    $where[] = "t.client_id = :clientId";
    $params[':clientId'] = (int)$_GET['clientId'];
}
if (!empty($_GET['status'])) {
    $where[] = "t.status = :status";
    $params[':status'] = $_GET['status'];
}
if (!empty($_GET['approvalStatus'])) {
    $where[] = "t.approval_status = :approvalStatus";
    $params[':approvalStatus'] = $_GET['approvalStatus'];
}

$sql = "SELECT t.*, c.name AS clientName, u.name AS employeeName
        FROM tasks t
        LEFT JOIN clients c ON t.client_id = c.id
        LEFT JOIN users u ON t.assigned_to = u.id";

if ($where) {
    $sql .= " WHERE " . implode(" AND ", $where);
}

$sql .= " ORDER BY t.id DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$tasks = $stmt->fetchAll();

jsonResponse(['success'=>true,'data'=>$tasks]);
