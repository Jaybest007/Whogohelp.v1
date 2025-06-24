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

$username = $_SESSION['USER']['username'];

try{
    //get wallet balance
    $stmt = $pdo->prepare('SELECT `balance` FROM `wallet` WHERE `username` = :username');
    $stmt->execute(['username' => $username]);
    $walletBalance = $stmt->fetch(PDO::FETCH_ASSOC);

    //get all errands thats pending
    $stmt = $pdo->prepare('SELECT * FROM `errands` WHERE `status` = :status ORDER BY `date` DESC, `time` DESC');
    $stmt->execute(['status' => "pending"]);
    $available_errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //get errands that in progress for that user
    $stmt = $pdo->prepare("SELECT * FROM `errands` WHERE (`posted_by` = :user OR `accepted_by` = :user) AND (`status` = 'progress' OR `status` = 'rejected_by_poster' ) ORDER BY `date` DESC, `time` DESC");
    $stmt->execute(['user'=> $username]); 
    $ongoing_errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //get completed errands for that user
    $stmt = $pdo->prepare("SELECT * FROM `errands` WHERE status = 'completed' AND (posted_by = :user OR accepted_by = :user) ORDER BY `date` DESC, `time` DESC"); 
    $stmt->execute(['user'=> $username]);
    $completed_errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //get compeleted_by_helper errand and fetch awaiting confirmation 
    $stmt = $pdo->prepare("SELECT * FROM `errands` WHERE (`posted_by` = :user OR `accepted_by` = :user) AND `status` = 'awaiting_confirmation' ORDER BY `date` DESC, `time` DESC");
    $stmt->execute(["user"=> $username]);
    $awaiting_confirmations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    


    //send all data as JSON
    echo json_encode([
        'success' => true,
        'loggedIn' => true,
        'username' => $username,
        'walletBalance' => $walletBalance,
        'ongoingErrands' => $ongoing_errands,
        'completedErrands' => $completed_errands,
        'availableErrands' => $available_errands,
        'awaiting_confirmations' => $awaiting_confirmations
    ]);


} catch (PDOException $e) {
    echo json_encode([
        'sucsess' => false,
        'message' => 'Error fecthing dashboard data',
        'error' => $e->getMessage()
    ]);
}