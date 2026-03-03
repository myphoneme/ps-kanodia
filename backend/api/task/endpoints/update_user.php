<?php
require_once "../db.php";
require_once "../helper.php";
//$admin = authenticate(true);
$input = getJsonInput();
$id = $input['id'] ?? null;

if (!$id) jsonResponse(['success'=>false,'message'=>'id required'],400);

$fields = [];
$params = [];

if (!empty($input['username'])) { $fields[] = "username=?"; $params[] = $input['username']; }
if (!empty($input['role']))     { $fields[] = "role=?";     $params[] = $input['role']; }
if (!empty($input['name']))     { $fields[] = "name=?";     $params[] = $input['name']; }
if (!empty($input['password'])) {
    $fields[] = "password=?";
    $params[] = password_hash($input['password'], PASSWORD_DEFAULT);
}

$params[] = $id;

$sql = "UPDATE users SET ".implode(",", $fields)." WHERE id=?";
$pdo = getPDO();
$pdo->prepare($sql)->execute($params);

jsonResponse(['success'=>true,'message'=>'User updated']);
