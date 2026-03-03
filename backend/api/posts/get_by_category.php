<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include "../conn.php";

$categoryId = isset($_GET['id']) ? intval($_GET['id']) : (isset($argv[1]) ? intval($argv[1]) : null);

// Handle URL pattern like get_posts_by_category_id/1
$request_uri = $_SERVER['REQUEST_URI'];
if (preg_match('/get_by_category\.php\/(\d+)/', $request_uri, $matches)) {
    $categoryId = intval($matches[1]);
}

if (!$categoryId) {
    echo json_encode([]);
    exit;
}

$query = "SELECT p.*, c.category_name, u.name as user_name 
          FROM posts p 
          LEFT JOIN categories c ON p.category_id = c.id 
          LEFT JOIN users u ON p.created_user_id = u.id 
          WHERE p.category_id = $categoryId
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
?>
