<?php
// helpers.php

function jsonResponse($data, $status = 200){
    http_response_code($status);

    if (isset($data['data'])) {
        if (is_array($data['data'])) {
            $data['data'] = convertKeysToCamelCase($data['data']);
        }
    }



    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function getJsonInput(){
    $raw = file_get_contents('php://input');
    return $raw ? json_decode($raw, true) : [];
}

function authenticate($requireAdmin = false) {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        jsonResponse(['success' => false, 'message' => 'Missing Authorization header'], 401);
    }

    if (!preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        jsonResponse(['success' => false, 'message' => 'Invalid Authorization header'], 401);
    }

    $token = $matches[1];
    $pdo = getPDO();

    $stmt = $pdo->prepare("
        SELECT t.*, u.id AS user_id, u.role, u.name 
        FROM tokens t 
        JOIN users u ON t.user_id = u.id
        WHERE t.token = :token 
        AND t.expires_at > NOW()
        LIMIT 1
    ");
    $stmt->execute([':token' => $token]);
    $row = $stmt->fetch();

    if (!$row) {
        jsonResponse(['success' => false, 'message' => 'Invalid or expired token'], 401);
    }

    if ($requireAdmin && $row['role'] !== 'admin') {
        jsonResponse(['success' => false, 'message' => 'Admin privilege required'], 403);
    }

    return $row; // returns authenticated user details
}

function test($n) {
	return $n*3;
}

function snakeToCamel($string) {
    return lcfirst(str_replace('_', '', ucwords($string, '_')));
}

function convertKeysToCamelCase($array) {
    $newArray = [];

    foreach ($array as $key => $value) {
        $newKey = snakeToCamel($key);

        if (is_array($value)) {
            $value = convertKeysToCamelCase($value);
        }

        $newArray[$newKey] = $value;
    }

    return $newArray;
}
