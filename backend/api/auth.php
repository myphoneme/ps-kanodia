<?php
function createToken($user_id, $role) {
    $secret = "MY_SECRET_KEY_123";  

    $payload = base64_encode(json_encode([
        "user_id" => $user_id,
        "role" => $role,
        "time" => time()
    ]));

    $signature = hash_hmac("sha256", $payload, $secret);

    return $payload . "." . $signature;
}

function verifyToken($token) {
    $secret = "MY_SECRET_KEY_123";

    if (!$token || !strpos($token, ".")) return false;

    list($payload, $signature) = explode(".", $token);

    $expected = hash_hmac("sha256", $payload, $secret);

    if ($expected !== $signature) return false;

    return json_decode(base64_decode($payload), true);
}
?>
