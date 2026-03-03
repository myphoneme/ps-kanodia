<?php
include "../conn.php";
include "../middleware.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

$data = requireAuth();
requireAdmin($data);

$body = json_decode(file_get_contents("php://input"), true);

$id = mysqli_real_escape_string($con, $body['id']);
$name = mysqli_real_escape_string($con, $body['name']);
$email = mysqli_real_escape_string($con, $body['email']);
$role = mysqli_real_escape_string($con, $body['role']);

$password_update = "";
if (isset($body['password']) && !empty($body['password'])) {
    $pass = password_hash($body['password'], PASSWORD_DEFAULT);
    $password_update = ", password='$pass'";
}

$query = "UPDATE users SET name='$name', email='$email', role='$role' $password_update
          WHERE id='$id'";

$response = mysqli_query($con, $query);

if ($response) {
    response(["status" => "success", "message" => "User updated"]);
} else {
    response(["status" => "error", "message" => mysqli_error($con)]);
}
?>
