<?php
header("Content-Type: application/json");

include "../conn.php";
include "../auth.php";
header("Access-Control-Allow-Origin: *");
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$pass  = $data['password'] ?? '';

$q = mysqli_query($con, "SELECT * FROM task_users WHERE email='$email'");
$user = mysqli_fetch_assoc($q);

if (!$user || !password_verify($pass, $user['password'])) {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    exit;
}

$token = createToken($user['id'], $user['role']);

echo json_encode([
    "status" => "success",
    "token" => $token,
    "user" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "role" => $user['role']
    ]
]);
?>
