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

$id = $body['id'];

$q = mysqli_query($con, "DELETE FROM users WHERE id='$id'");

if ($q) {
    response(["status" => "success", "message" => "User deleted"]);
} else {
    response(["status" => "error", "message" => mysqli_error($con)]);
}
?>
