<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require_once __DIR__ . "/../conn.php";

$post_data = json_decode(file_get_contents("php://input"), true);

if(!$post_data){
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit;
}

$name    = $post_data['name'] ?? '';
$email   = $post_data['email'] ?? '';
$subject = $post_data['subject'] ?? '';
$message = $post_data['message'] ?? '';

if(empty($name) || empty($email)){
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Name and Email are required"]);
    exit;
}

$name    = mysqli_real_escape_string($con, $name);
$email   = mysqli_real_escape_string($con, $email);
$subject = mysqli_real_escape_string($con, $subject);
$message = mysqli_real_escape_string($con, $message);

$query = "INSERT INTO `contact_us` (name, email, subject, message)
          VALUES ('$name', '$email', '$subject', '$message')";

if(mysqli_query($con, $query)){
    echo json_encode(["status" => "success", "message" => "Data inserted"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => mysqli_error($con)]);
}
?>
