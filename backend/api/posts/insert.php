<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
require_once __DIR__ . "/../conn.php";
require_once __DIR__ . "/../middleware.php";

$user_data = requireAuth();
$created_user_id = $user_data['user_id'];

// Handle both JSON and Multipart (FormData)
$title = $_POST['title'] ?? '';
$post_content = $_POST['post'] ?? '';
$category_id = intval($_POST['category_id'] ?? 0);
$image_path = '';

// If JSON was sent instead of FormData
if (empty($title)) {
    $json_data = json_decode(file_get_contents("php://input"), true);
    if ($json_data) {
        $title = $json_data['title'] ?? '';
        $post_content = $json_data['post'] ?? '';
        $category_id = intval($json_data['category_id'] ?? 0);
        $image_path = $json_data['image'] ?? '';
    }
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

if (empty($title) || empty($post_content)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Title and content are required"]);
    exit;
}

$title = mysqli_real_escape_string($con, $title);
$post_content = mysqli_real_escape_string($con, $post_content);
$image_path = mysqli_real_escape_string($con, $image_path);

$query = "INSERT INTO posts (title, post, image, category_id, created_user_id, created_at, updated_at) 
          VALUES ('$title', '$post_content', '$image_path', $category_id, $created_user_id, NOW(), NOW())";

if (mysqli_query($con, $query)) {
    $new_id = mysqli_insert_id($con);
    echo json_encode([
        "status" => "success", 
        "message" => "Post created",
        "id" => $new_id,
        "image" => $image_path
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => mysqli_error($con)]);
}
?>
