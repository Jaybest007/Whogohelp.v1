<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");


include 'db_connect.php';


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if (!isset($_SESSION['USER'])) {
    http_response_code(401);
    echo json_encode([
        "error" => ["server" => "Login is required!!..Kindly login to post"]
    ]);
    exit;
}


$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? null;

switch ($action) {
    case 'fetch_notifications':
        fetchNotification($pdo);
        break;
    
    case 'markasread':
        markasread($pdo);
        break;

    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid action"]); 
        exit;
}


function fetchNotification($pdo){
    try {
    // Get notifications from the database
    $stmt = $pdo->prepare('SELECT * FROM `notifications` WHERE `username` = :username');
    $stmt->execute(['username' => $_SESSION['USER']['username']]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'notifications' => $notifications
    ]);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database query failed",
        "details" => $e->getMessage()
    ]);
    exit;
}
}

function markasread($pdo){
    // mark the unread as read
    try{
        $stmt = $pdo->prepare("UPDATE `notifications` SET `is_read`= 'true' WHERE `username` = :username");
        $stmt->execute(['username' => $_SESSION['USER']['username']]);
        
        if($stmt->rowCount() > 0){
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "All unread notifications are now read"
            ]);
        }
    } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database query failed",
        "details" => $e->getMessage()
    ]);
    exit;
}
}
