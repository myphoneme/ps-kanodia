<?php
ob_start(); // Start output buffering
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/conn.php";
require_once __DIR__ . "/middleware.php";

try {
    $user_data = requireAuth();

    if (!isset($_FILES['file'])) {
        throw new Exception("No file uploaded");
    }

    $file = $_FILES['file'];
    $target_dir = __DIR__ . "/../uploads/";

    if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0777, true)) {
            throw new Exception("Failed to create upload directory");
        }
    }

    $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $new_filename = uniqid() . "." . $file_extension;
    $target_file = $target_dir . $new_filename;

    // Check if image file is a actual image or fake image
    $check = @getimagesize($file["tmp_name"]);
    if($check === false) {
        throw new Exception("File is not an image");
    }

    // Allow certain file formats
    $allowed = ["jpg", "png", "jpeg", "gif"];
    if(!in_array($file_extension, $allowed)) {
        throw new Exception("Only JPG, JPEG, PNG & GIF files are allowed");
    }

    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        ob_end_clean(); // Clear any warnings that might have been buffered
        echo json_encode([
            "status" => "success", 
            "url" => "uploads/" . $new_filename
        ]);
    } else {
        throw new Exception("Failed to move uploaded file");
    }
} catch (Exception $e) {
    ob_end_clean(); // Clear any buffered output/warnings
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
