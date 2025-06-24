<?php
session_start();
// Handle preflight (OPTIONS) request early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Credentials: true");
    http_response_code(200);
    exit();
}

// CORS and content headers for actual requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if(!isset($_SESSION['USER'])){
    echo json_encode(["error" => ["server" => "Login is required!!..Kindly login to post"]]);
    exit;
};
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if($data === null){
    http_response_code(400);
    echo json_encode(["error" => ["server" => "All input is required"]]);
    exit;
};

if(
    !isset($data['title']) ||
    !isset($data['description']) ||
    !isset($data['pickUpLocation']) ||
    !isset($data['dropOffLocation']) ||
    !isset($data['reward']) 
){
    http_response_code(400);
    echo json_encode(["error" => ["server" => "All input is required"]]);
    exit;
}

//unique errand number generator
function generateOrderId($prefix = 'ERD'){
    $timestamp = time(); //current time
    $randomPart = strtoupper(bin2hex(random_bytes(2)));
    return $prefix .'-' . $timestamp . '-' . $randomPart; 
}

$date = date("d-m-y");
$time = date("h:i A"); // Fixed double semicolon
$errandID = generateOrderId();
$title = htmlspecialchars(trim($data['title']));
$description = htmlspecialchars(trim($data['description']));
$pick_up_location = htmlspecialchars(trim($data['pickUpLocation']));
$drop_off_location = htmlspecialchars(trim($data['dropOffLocation']));
$reward = htmlspecialchars(trim($data['reward']));
$notes = htmlspecialchars(trim($data['notes']?? ''));
$posted_by = $_SESSION['USER']['username'];
$status = "pending";


//let send data to databse
$sql = "INSERT INTO errands (errand_Id, date, time, title, description, pick_up_location, drop_off_location, reward, notes, posted_by, status) VALUES (:errandId, :date, :time, :title, :description, :pick_up_location, :drop_off_location, :reward, :notes, :posted_by, :status)";
$stmt = $pdo->prepare($sql);

try{
    $stmt->execute([
        'errandId' => $errandID,
        'date' => $date,
        'time' => $time,
        'title' => $title,
        'description' => $description,
        'pick_up_location' => $pick_up_location,
        'drop_off_location' => $drop_off_location,
        'reward' => $reward,
        'notes' => $notes,
        'posted_by' => $posted_by,
        'status' => $status
    ]);

    http_response_code(201);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["errors" => ["server" => "Database error: " . $e->getMessage()]]);
}









