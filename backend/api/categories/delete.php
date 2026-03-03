<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: DELETE, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include "../conn.php";
include "../middleware.php";

$user_data = requireAuth();

$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$id) {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id'])) {
        $id = intval($data['id']);
    }
}

if (!$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Category ID is required"]);
    exit;
}

$query = "DELETE FROM categories WHERE id = $id";

if (mysqli_query($con, $query)) {
    echo json_encode(["status" => "success", "message" => "Category deleted"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => mysqli_error($con)]);
}
?>
