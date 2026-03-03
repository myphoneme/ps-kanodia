<?php
require_once "../db.php";
require_once "../helper.php";

$admin = authenticate(true);

$input = getJsonInput();

if (empty($input['username']) || empty($input['password']) || empty($input['role']) || empty($input['name'])) {
    jsonResponse(['success'=>false,'message'=>'all fields required'],400);
}

$pdo = getPDO();

$hash = password_hash($input['password'], PASSWORD_DEFAULT);

$stmt = $pdo->prepare(
    "INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)"
);
$stmt->execute([
    $input['username'],
    $hash,
    $input['role'],
    $input['name']
]);

jsonResponse(['success'=>true, 'message'=>'User created']);
