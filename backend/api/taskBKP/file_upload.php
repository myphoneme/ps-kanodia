<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

require_once "../conn.php";
require_once "../middleware.php";

// Authenticate user
$user = requireAuth(); // gives $user["id"], $user["role"]
$user_id = $user["id"];

// Validate input
if (!isset($_POST["task_id"])) {
    echo json_encode(["error" => "task_id is required"]);
    exit;
}

$task_id = $_POST["task_id"];

// 1 MB limit
$max_size = 1 * 1024 * 1024; // 1MB

// Validate file input
if (!isset($_FILES["file"])) {
    echo json_encode(["error" => "No file uploaded"]);
    exit;
}

$file = $_FILES["file"];

// Error check
if ($file["error"] !== UPLOAD_ERR_OK) {
    echo json_encode(["error" => "Upload error code: " . $file["error"]]);
    exit;
}

if ($file["size"] > $max_size) {
    echo json_encode(["error" => "File size limit 1MB exceeded"]);
    exit;
}

// Allowed extensions
$allowed_ext = ["png", "jpg", "jpeg", "pdf", "docx"];
$filename = $file["name"];
$temp_path = $file["tmp_name"];
$file_ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

if (!in_array($file_ext, $allowed_ext)) {
    echo json_encode(["error" => "Invalid file format"]);
    exit;
}

// -----------------------------
// Check if task exists
// -----------------------------
$stmt = $con->prepare("SELECT assigned_user_id FROM tasks WHERE id = ?");
$stmt->bind_param("s", $task_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Invalid task_id"]);
    exit;
}

$task = $result->fetch_assoc();
$assigned_user_id = $task["assigned_user_id"];

// -----------------------------
// Permission check
// Admin OR assigned user only
// -----------------------------
if ($user["role"] !== "admin" && $user_id !== $assigned_user_id) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// -----------------------------
// Prepare file storage
// -----------------------------
$upload_dir = "../../uploads/tasks/" . $task_id . "/";

if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$new_filename = uniqid("file_") . "." . $file_ext;
$destination = $upload_dir . $new_filename;

// Move file
if (!move_uploaded_file($temp_path, $destination)) {
    echo json_encode(["error" => "Failed to save file"]);
    exit;
}

// -----------------------------
// Insert into task_files table
// -----------------------------
$stmt = $con->prepare("
    INSERT INTO task_files (task_id, file_path, file_name, file_size, uploaded_by)
    VALUES (?, ?, ?, ?, ?)
");

$file_path_db = "uploads/tasks/" . $task_id . "/" . $new_filename; // Relative path for frontend
$file_size = $file["size"];

$stmt->bind_param("sssii", $task_id, $file_path_db, $filename, $file_size, $user_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "file" => [
            "file_id" => $con->insert_id,
            "task_id" => $task_id,
            "file_path" => $file_path_db,
            "file_name" => $filename,
            "file_size" => $file_size
        ]
    ]);
} else {
    echo json_encode(["error" => "DB insert failed"]);
}

?>
