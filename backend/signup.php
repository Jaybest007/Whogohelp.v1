<?php 
// Only handle preflight manually if needed
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
header("Content-Type: application/json");

include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    http_response_code(400);
    echo json_encode(["errors" => ["server" => "All input is required"]]);
    exit;
}

if (
    !isset($data['name']) || 
    !isset($data['username']) || 
    !isset($data['email']) ||
    !isset($data['password']) ||
    !isset($data['confirmPassword'])
) {
    http_response_code(400);
    echo json_encode(["errors" => ["server" => "All input is required"]]);
    exit;
}

$name = htmlspecialchars(trim($data['name']));
$username = htmlspecialchars(trim($data['username']));
$email = htmlspecialchars(trim($data['email']));
$password = htmlspecialchars(trim($data['password']));
$confirmpassword = trim($data['confirmPassword']);
$created_at = date("d-m-y H:i:s" ); // Use current date and time for created_at

$errors = [];

if ($password !== $confirmpassword) {
    http_response_code(400);
    echo json_encode(["errors" => ["confirmPassword" => "Password doesn't match"]]);
    exit;
}

// Check if username or email already exists
$sql = "SELECT * FROM users WHERE username = :username OR email = :email";
$stmt = $pdo->prepare($sql);
$stmt->execute(['username' => $username, 'email' => $email]);  //  Fix typo: 'emal' -> 'email'
$existingUser = $stmt->fetch();

if ($existingUser) {
    if ($existingUser['username'] === $username) {
        echo json_encode(["errors" => ["username" => "Username already exists"]]);
        exit;
    }
    if ($existingUser['email'] === $email) {
        echo json_encode(["errors" => ["email" => "Email already exists"]]);
        exit;
    }
}


// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into database
$sql = "INSERT INTO users (full_name, username, email, password, created_at) VALUES (:name, :username, :email, :password, created_at)";
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([
        'name' => $name,
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword,
        'created_at' => $created_at
    ]);
    http_response_code(201);
    echo json_encode(['success' => "Signup successful"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["errors" => ["server" => "Database error: " . $e->getMessage()]]);
}