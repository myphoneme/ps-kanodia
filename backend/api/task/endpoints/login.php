<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helper.php';

$input = getJsonInput();
$username = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

if ($username === '' || $password === '') {
    jsonResponse(['success' => false, 'message' => 'Username and password required'], 400);
}

$pdo = getPDO();

// Step 1: Fetch user
$stmt = $pdo->prepare("SELECT id, username, password, role, name FROM users WHERE username = :u LIMIT 1");
$stmt->execute([':u' => $username]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(['success' => false, 'message' => 'Invalid username or password'], 401);
}

// Step 2: Verify password
if (!password_verify($password, $user['password'])) {
    jsonResponse(['success' => false, 'message' => 'Invalid username or password'], 401);
}

// Step 3: Generate token
$token = bin2hex(random_bytes(32)); // 64-char secure token
$expires = date('Y-m-d H:i:s', strtotime('+7 days')); // Token valid for 7 days

// Step 4: Insert token
$stmt = $pdo->prepare("
    INSERT INTO tokens (user_id, token, expires_at) 
    VALUES (:user_id, :token, :expires)
");
$stmt->execute([
    ':user_id' => $user['id'],
    ':token'   => $token,
    ':expires' => $expires
]);

unset($user['password']); // Never return password

jsonResponse([
    'success' => true,
    'token'   => $token,
    'user'    => $user
]);
