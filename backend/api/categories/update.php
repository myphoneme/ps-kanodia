<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include "../conn.php";
include "../middleware.php";

$user_data = requireAuth();

$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$data = json_decode(file_get_contents("php://input"), true);

if (!$id && isset($data['id'])) {
    $id = intval($data['id']);
}

if (!$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Category ID is required"]);
    exit;
}

$category_name = mysqli_real_escape_string($con, $data['category_name'] ?? '');

if (empty($category_name)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Category name is required"]);
    exit;
}

$query = "UPDATE categories SET category_name = '$category_name' WHERE id = $id";

if (mysqli_query($con, $query)) {
    echo json_encode(["status" => "success", "message" => "Category updated"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => mysqli_error($con)]);
}
?>
