<?php
require_once __DIR__ . '/db.php';

function requireAuth() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        jsonResponse(['success'=>false,'message'=>'No token provided'],401);
    }

    $token = trim(str_replace("Bearer ","",$headers['Authorization']));
    $pdo = getPDO();

    $stmt = $pdo->prepare("SELECT user_id FROM tokens WHERE token = ?");
    $stmt->execute([$token]);
    $row = $stmt->fetch();

    if (!$row) {
        jsonResponse(['success'=>false,'message'=>'Invalid token'],401);
    }

    return $row['user_id']; // return logged in user id
}
