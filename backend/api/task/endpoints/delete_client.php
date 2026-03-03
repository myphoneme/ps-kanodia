<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helper.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    jsonResponse(['success' => false, 'message' => 'Client ID is required'], 400);
}

$pdo = getPDO();

$stmt = $pdo->prepare("DELETE FROM clients WHERE id = :id");
$stmt->execute([':id' => $id]);

jsonResponse(['success' => true, 'message' => 'Client deleted successfully']);
