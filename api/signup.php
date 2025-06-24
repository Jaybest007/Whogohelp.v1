<?php 
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if($_SERVER["REQUEST_METHOD"] === "OPTIONS"){
    http_response_code(200);
    exit;
}
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
    !isset($data['phone']) ||
    !isset($data['location']) ||
    !isset($data['password']) ||
    !isset($data['confirmPassword'])
) {
    http_response_code(400);
    echo json_encode(["errors" => ["server" => "All input is required"]]);
    exit;
}

$name = strtolower(htmlspecialchars(trim($data['name'])));
$username = strtolower(htmlspecialchars(trim($data['username'])));
$email = strtolower(htmlspecialchars(trim($data['email'])));
$phone = htmlspecialchars(trim($data['phone']));
$location = htmlspecialchars(trim($data['location']));
$password = htmlspecialchars(trim($data['password']));
$confirmpassword = trim($data['confirmPassword']);
$created_at = date("c" ); // Use current date and time for created_at

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
    if (strtolower($existingUser['username']) === $username) {
        $errors["username"] = "Username already exists";  // Direct string assignment
    }
    if (strtolower($existingUser['email']) === $email) {
        $errors["email"] = "Email already exists";  //  Correct key for email
    }
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(["errors" => $errors]);  //  Now JSON structure is correct
        exit;
    }
}



// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into database & also create wallet
$sql = "INSERT INTO users (full_name, username, email, phone, location, password, created_at) VALUES (:name, :username, :email, :phone, :location, :password, :created_at)";
$sql2 = "INSERT INTO `wallet`(`username`, `balance`) VALUES (:username,:balance)";
$stmt = $pdo->prepare($sql);
$stmt2 = $pdo->prepare($sql2);

try {
    $stmt->execute([
        'name' => $name,
        'username' => $username,
        'email' => $email,
        'phone' => $phone,
        'location' => $location,
        'password' => $hashedPassword,
        'created_at' => $created_at
    ]);
    $stmt2->execute([
        'username' => $username,
        'balance' => "0",
    ]);

     $_SESSION['USER'] = [
            'name' => $name,
            'username' => $username,
            'email' => $email,
            'location' => $location,
            'role' => 'user',
        ];
    http_response_code(200);
    echo json_encode(['success' => true, "message" => "Signup successful"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["errors" => ["server" => "Database error: " . $e->getMessage()]]);
}