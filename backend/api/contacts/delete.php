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

$auth_user = requireAuth();
requireAdmin($auth_user);

$post_data = json_decode(file_get_contents("php://input"), true);

$id = $post_data['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID is required"]);
    exit;
}

$id = mysqli_real_escape_string($con, $id);
$query = "DELETE FROM contact_us WHERE id = '$id'";

if (mysqli_query($con, $query)) {
    echo json_encode([
        "status" => "success",
        "message" => "Record deleted successfully",
        "deleted_id" => $id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error($con)
    ]);
}
?>
