<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
require_once __DIR__ . "/../conn.php";
require_once __DIR__ . "/../middleware.php";

$user_data = requireAuth();

// Handle both JSON and Multipart (FormData)
$id = intval($_POST['id'] ?? $_GET['id'] ?? 0);
$title = $_POST['title'] ?? '';
$post_content = $_POST['post'] ?? '';
$category_id = intval($_POST['category_id'] ?? 0);
$image_path = '';

if ($id === 0) {
    $json_data = json_decode(file_get_contents("php://input"), true);
    if ($json_data) {
        $id = intval($json_data['id'] ?? 0);
        $title = $json_data['title'] ?? '';
        $post_content = $json_data['post'] ?? '';
        $category_id = intval($json_data['category_id'] ?? 0);
        $image_path = $json_data['image'] ?? '';
    }
}

if (!$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Post ID is required"]);
    exit;
}

// Handle File Upload if present
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = __DIR__ . "/../../uploads/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $file_name = time() . "_" . basename($_FILES["image"]["name"]);
    $target_file = $upload_dir . $file_name;
    
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        $image_path = "uploads/" . $file_name;
    }
}

$update_fields = [];
if (!empty($title)) {
    $title = mysqli_real_escape_string($con, $title);
    $update_fields[] = "title = '$title'";
}
if (!empty($post_content)) {
    $post_content = mysqli_real_escape_string($con, $post_content);
    $update_fields[] = "post = '$post_content'";
}
if (!empty($image_path)) {
    $image_path = mysqli_real_escape_string($con, $image_path);
    $update_fields[] = "image = '$image_path'";
}
if ($category_id > 0) {
    $update_fields[] = "category_id = $category_id";
}
$update_fields[] = "updated_at = NOW()";

if (count($update_fields) <= 1) { // Only updated_at
    echo json_encode(["status" => "success", "message" => "Nothing to update"]);
    exit;
}

$query = "UPDATE posts SET " . implode(", ", $update_fields) . " WHERE id = $id";

if (mysqli_query($con, $query)) {
    echo json_encode([
        "status" => "success", 
        "message" => "Post updated",
        "image" => $image_path
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => mysqli_error($con)]);
}
?>
