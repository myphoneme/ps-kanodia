<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/../conn.php";
require_once __DIR__ . "/../middleware.php";

$auth_data = requireAuth();

$result = mysqli_query($con, "SELECT * FROM `contact_us` ORDER BY id DESC");

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database query failed: " . mysqli_error($con)
    ]);
    exit;
}

$contacts = [];

while($row = mysqli_fetch_assoc($result)){
    $contacts[] = $row;
}

echo json_encode([
    "status" => "success",
    "total" => count($contacts),
    "data" => $contacts
]);
?>
