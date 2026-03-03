<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
require_once __DIR__ . "/../conn.php";

if (!$con) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection lost"]);
    exit;
}

$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($id) {
    $query = "SELECT p.*, c.category_name, u.name as user_name 
              FROM posts p 
              LEFT JOIN categories c ON p.category_id = c.id 
              LEFT JOIN users u ON p.created_user_id = u.id 
              WHERE p.id = $id";
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);

    if ($row) {
        $post = [
            "id" => intval($row['id']),
            "title" => $row['title'],
            "post" => $row['post'],
            "image" => $row['image'],
            "category" => [
                "id" => intval($row['category_id']),
                "category_name" => $row['category_name']
            ],
            "created_user" => [
                "id" => intval($row['created_user_id']),
                "name" => $row['user_name']
            ],
            "created_at" => $row['created_at'],
            "updated_at" => $row['updated_at']
        ];
        echo json_encode($post);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Post not found"]);
    }
} else {
    $query = "SELECT p.*, c.category_name, u.name as user_name 
              FROM posts p 
              LEFT JOIN categories c ON p.category_id = c.id 
              LEFT JOIN users u ON p.created_user_id = u.id 
              ORDER BY p.created_at DESC";
    $result = mysqli_query($con, $query);
    $posts = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $posts[] = [
            "id" => intval($row['id']),
            "title" => $row['title'],
            "post" => $row['post'],
            "image" => $row['image'],
            "category" => [
                "id" => intval($row['category_id']),
                "category_name" => $row['category_name']
            ],
            "created_user" => [
                "id" => intval($row['created_user_id']),
                "name" => $row['user_name']
            ],
            "created_at" => $row['created_at'],
            "updated_at" => $row['updated_at']
        ];
    }
    echo json_encode($posts);
}
?>
