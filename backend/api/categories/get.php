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
require_once __DIR__ . "/../middleware.php";

$query = "SELECT * FROM categories ORDER BY category_name ASC";
$result = mysqli_query($con, $query);
$categories = [];

while ($row = mysqli_fetch_assoc($result)) {
    $categories[] = [
        "id" => intval($row['id']),
        "category_name" => $row['category_name']
    ];
}

echo json_encode($categories);
?>
