
<?php
// config.php - central place for headers
ini_set('display_errors', 0); // set 1 on dev server only
error_reporting(E_ALL);

// CORS - allow dev origin and production origin
// For dev allow localhost:5173, for prod use your domain — better to set dynamically:
$allowed = [
    'http://localhost:5173',
    'https://capsk.co.in'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback - only use '*' if you accept cross origin from everywhere
    header("Access-Control-Allow-Origin: *");
}

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // preflight request
    exit(0);
}

define('DB_HOST','localhost');
define('DB_NAME','task_management');
define('DB_USER','dbuser');
define('DB_PASS','Remote@dbuser');
