<?php 
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

include 'db_connect.php';

if($_SERVER["REQUEST_METHOD"] === "OPTIONS"){
    http_response_code(200);
    exit;
}

if(!isset($_SESSION['USER'])){
    http_response_code(401);
    echo json_encode(['error' => 'Login required']);
    exit;
};

$username =  $_SESSION['USER']['username'];

$sql = "SELECT `balance` FROM `wallet` WHERE `username` = :username";
$stmt  = $pdo->prepare($sql);
$stmt->execute(['username' => $username]);
$wallet = $stmt->fetch(PDO::FETCH_ASSOC);
if($wallet){
    http_response_code(200);
    echo json_encode(['walletBalance' => $wallet]);
    exit;
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Wallet not found']);
    exit;
}

