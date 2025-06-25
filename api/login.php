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

include 'db_connect.php';
$data = json_decode(file_get_contents("php://input"), true);

if($data === null){
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON data"]);
    exit;
}

if(!isset($data['email']) || !isset($data['password'])){
    http_response_code(400);
    echo json_encode(["error" => "All input is required"]);
    exit;
}

$email = htmlspecialchars(strtolower(trim($data['email'])));
$password = trim($data['password']);


// Check if user exists by email only
$sql = "SELECT * FROM users WHERE email = :email";
$stmt = $pdo->prepare($sql);
$stmt->execute(['email' => $email]);
$existingUser = $stmt->fetch();

if($existingUser){
    if(password_verify($password, $existingUser['password'])){
        $_SESSION['USER'] = [
            'name' => $existingUser['full_name'],
            'username' => $existingUser['username'],
            'email' => $existingUser['email'],
            'location' => $existingUser['location'],
            'role' => $existingUser['role'],
        ];
        http_response_code(200);
        echo json_encode(["success" => "Login successful", 'role' => $existingUser['role']]);
        exit;
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Incorrect password"]);
        exit;
    }
}
http_response_code(400);
echo json_encode(["error" => "Incorrect username or password"]);
exit;

