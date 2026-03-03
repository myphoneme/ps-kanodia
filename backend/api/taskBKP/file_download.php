<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../conn.php";
include "../middleware.php";  // → requireAuth()

$user = requireAuth();  // Logged-in user (decoded JWT)

// Validate input
if (!isset($_GET['file_id'])) {
    echo json_encode(["status" => false, "message" => "file_id is required"]);
    exit();
}

$file_id = $_GET['file_id'];

// ------------------------------
// 1) Fetch file details
// ------------------------------
$sql = "
    SELECT tf.id, tf.file_path, tf.file_name, t.assigned_user_id
    FROM task_files tf
    JOIN tasks t ON t.id = tf.task_id
    WHERE tf.id = ?
";

$stmt = $con->prepare($sql);
$stmt->bind_param("s", $file_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => false, "message" => "File not found"]);
    exit();
}

$file = $result->fetch_assoc();

// ------------------------------
// 2) Authorization Check
// ------------------------------

// Admin access OK
if ($user['role'] !== "admin") {

    // Employee → must be assigned to the task
    if ($file['assigned_user_id'] !== $user['id']) {
        echo json_encode(["status" => false, "message" => "Access denied"]);
        exit();
    }
}

// ------------------------------
// 3) File Download
// ------------------------------
$full_path = "../../task_files/" . $file['file_path'];

if (!file_exists($full_path)) {
    echo json_encode(["status" => false, "message" => "File missing on server"]);
    exit();
}

// Force Download Headers
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=\"" . basename($file['file_name']) . "\"");
header("Content-Length: " . filesize($full_path));

readfile($full_path);
exit();
?>
