<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include "../conn.php";
include "../middleware.php";

$data = requireAuth();
requireAdmin($data);

$body = json_decode(file_get_contents("php://input"), true);

$name = $body['name'];
$email = $body['email'];
$pass = password_hash($body['password'], PASSWORD_DEFAULT);
$role = $body['role'];

$query = "INSERT INTO users (name, email, password, role)
          VALUES ('$name', '$email', '$pass', '$role')";

if (mysqli_query($con, $query)) {
    response(["status" => "success", "message" => "User created"]);
} else {
    response(["status" => "error", "message" => mysqli_error($con)]);
}
?>
