<?php 
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit;
}

include 'db_connect.php';

if(!isset($_SESSION['USER'])){
    http_response_code(401);
    echo json_encode(["error" => "User is not logged in"]);
    exit;
}

if($_SESSION['USER']['role'] !== 'admin'){
    http_response_code(401);
    echo json_encode(['error'=> 'Unathorized!!']);
    exit;
}

$role = $_SESSION['USER']['role'];

try{
    //get all user wallet
    $userwallet = $pdo->query('SELECT * FROM wallet')->fetchAll(PDO::FETCH_ASSOC);

    //get all transaction within 24hrs
    $transactionHistory = $pdo->query('SELECT * FROM `transactions` WHERE `created_at` >= NOW() - INTERVAL 1 DAY ORDER BY `created_at` DESC')->fetchAll(PDO::FETCH_ASSOC);


    //get all users
    $users = $pdo->query('SELECT role, status, full_name, username, email, phone, location, created_at, last_seen FROM users')->fetchAll(PDO::FETCH_ASSOC);

    //get all chat
    $chats = $pdo->query('SELECT * FROM `chat` WHERE `status` = "active" ')->fetchAll(PDO::FETCH_ASSOC);

    //get all messages
    $messages = $pdo->query("SELECT * FROM `contact_us`")->fetchAll(PDO::FETCH_ASSOC);

    //get all errands
    $all_errands = $pdo->query('SELECT * FROM errands')->fetchAll(PDO::FETCH_ASSOC);
    //get all errands thats pending
    $pending_errands = $pdo->query('SELECT * FROM errands WHERE status = "pending" ORDER BY date DESC, time DESC')->fetchAll(PDO::FETCH_ASSOC);

    //get all errands that in progress
    $ongoing_errands = $pdo->query("SELECT * FROM `errands` WHERE `status` = 'progress' ORDER BY `date` DESC, `time` DESC")->fetchAll(PDO::FETCH_ASSOC);

    //get completed errands for that user
    $completed_errands = $pdo->query("SELECT * FROM `errands` WHERE status = 'completed' ORDER BY `date` DESC, `time` DESC")->fetchAll(PDO::FETCH_ASSOC);

    //get awaiting confirmation errand and fetch awaiting confirmation 
    $awaiting_confirmations = $pdo->query("SELECT * FROM `errands` WHERE `status` = 'awaiting_confirmation' ORDER BY `date` DESC, `time` DESC")->fetchAll(PDO::FETCH_ASSOC);

    //get all errand that is canceled
    $canceled_errands = $pdo->query("SELECT * FROM `errands` WHERE `status` = 'canceled' ORDER BY `date` DESC, `time` DESC")->fetchAll(PDO::FETCH_ASSOC);

    //get all errand with rejected status
    $rejected_by_poster = $pdo->query("SELECT * FROM `errands` WHERE `status` = 'rejected_by_poster' ORDER BY `date` DESC, `time` DESC")->fetchAll(PDO::FETCH_ASSOC);
    
    //get admin seetings
    $Settings = $pdo->query("SELECT * FROM `admin_settings` WHERE `id` = 1")->fetch(PDO::FETCH_ASSOC);


    //send all data as JSON
    echo json_encode([
        'success' => true,
        'loggedIn' => true,
        'role' => 'admin',
        'wallet' => $userwallet,
        'AllUsers' => $users,
        'transaction_history' => $transactionHistory,
        "AllMessages" => $messages,
        'AllErrands' => $all_errands,
        'pendingErrands' => $pending_errands,
        'ongoingErrands' => $ongoing_errands,
        'completedErrands' => $completed_errands,
        'awaitingConfirmations' => $awaiting_confirmations,
        'canceledErrands' => $canceled_errands,
        'rejectedByPoster' => $rejected_by_poster,
        'AllChat' => $chats ,
        'Settings' => $Settings
    ]);


} catch (PDOException $e) {
    echo json_encode([
        'sucsess' => false,
        'message' => 'Error fecthing dashboard data',
        'error' => $e->getMessage()
    ]);
}
