<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helper.php';

$input = getJsonInput();

$id   = $input['id'] ?? null;
$name = $input['name'] ?? null;
$code = $input['code'] ?? null;

if (!$id) {
    jsonResponse(['success' => false, 'message' => 'Client ID is required'], 400);
}

// Update fields dynamically
$fields = [];
$params = [':id' => $id];

if ($name !== null) {
    $fields[] = "name = :name";
    $params[':name'] = $name;
}
if ($code !== null) {
    $fields[] = "code = :code";
    $params[':code'] = $code;
}

if (empty($fields)) {
    jsonResponse(['success' => false, 'message' => 'No update fields provided'], 400);
}

$sql = "UPDATE clients SET " . implode(', ', $fields) . " WHERE id = :id";

$pdo = getPDO();
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

// Fetch updated data
$stmt = $pdo->prepare("SELECT * FROM clients WHERE id = :id");
$stmt->execute([':id' => $id]);
$client = $stmt->fetch();

jsonResponse(['success' => true, 'data' => $client]);
