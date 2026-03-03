<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helper.php';

$input = getJsonInput();

$name = $input['name'] ?? null;
$code = $input['code'] ?? null;

if (!$name) {
    jsonResponse(['success' => false, 'message' => 'Client name is required'], 400);
}

$pdo = getPDO();

// Insert client
$stmt = $pdo->prepare("INSERT INTO clients (name, code) VALUES (:name, :code)");
$stmt->execute([
    ':name' => $name,
    ':code' => $code
]);

$id = $pdo->lastInsertId();

// Fetch the inserted row
$stmt = $pdo->prepare("SELECT * FROM clients WHERE id = :id");
$stmt->execute([':id' => $id]);
$client = $stmt->fetch();

jsonResponse(['success' => true, 'data' => $client], 201);
