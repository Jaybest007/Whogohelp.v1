<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data["name"]) || empty($data["email"]) || empty($data["message"])) {
    http_response_code(400);
    echo json_encode(['server' => ["server" => 'All input is required']]);
    exit;
}

// Validate Email Format **before using $data["email"]**
if (!filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['server' => ["server" => 'Invalid email format']]); 
    exit;
}

// Sanitize Inputs
$name = htmlspecialchars(trim($data["name"]));
$email = htmlspecialchars(trim($data["email"]));
$message = htmlspecialchars(trim($data["message"]));

try {
    $sql = "INSERT INTO `contact_us` (`name`, `email`, `message`) VALUES (:name, :email, :message)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['name' => $name, 'email' => $email, 'message' => $message]);

    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode(['message' => 'Message sent successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['server' => ["server" => 'Unable to send your message']]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
