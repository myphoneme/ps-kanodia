<?php
require_once __DIR__ . "/auth.php";

function requireAuth() {
    $headers = getallheaders();
    $authHeader = null;

    if (isset($headers["Authorization"])) {
        $authHeader = $headers["Authorization"];
    } elseif (isset($headers["authorization"])) {
        $authHeader = $headers["authorization"];
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $apacheHeaders = apache_request_headers();
        if (isset($apacheHeaders['Authorization'])) {
            $authHeader = $apacheHeaders['Authorization'];
        }
    }
    
    if (!$authHeader) {
        response(["status" => "error", "message" => "No token provided"]);
        exit;
    }

    $token = str_replace("Bearer ", "", $authHeader);
    $data = verifyToken($token);

    if (!$data) {
        response(["status" => "error", "message" => "Invalid token"]);
        exit;
    }

    return $data; // user_id + role
}

function requireAdmin($data) {
    if ($data['role'] !== 'admin') {
        response(["status" => "error", "message" => "Admin only"]);
        exit;
    }
}

function response($arr) {
    header("Content-Type: application/json");
    echo json_encode($arr);
}
?>
