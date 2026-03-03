<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include "../conn.php";
include "../middleware.php";

$user_data = requireAuth();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit;
}

$category_name = mysqli_real_escape_string($con, $data['category_name'] ?? '');

if (empty($category_name)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Category name is required"]);
    exit;
}

$query = "INSERT INTO categories (category_name) VALUES ('$category_name')";

if (mysqli_query($con, $query)) {
    $new_id = mysqli_insert_id($con);
    echo json_encode([
        "status" => "success", 
        "message" => "Category created",
        "id" => $new_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => mysqli_error($con)]);
}
?>
