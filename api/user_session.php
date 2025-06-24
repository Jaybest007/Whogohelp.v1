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

// $action = $_GET['action'] ?? null;

// switch($action){
//     case 'checkLoggin'
//     handleCheckLogin();
//     break;
// }
if (isset($_SESSION['USER'])){
    echo json_encode([
        'loggedIn' => true,
        'userInfo' => $_SESSION['USER']
    ]);

}else{
    echo json_encode([
        'loggedIn' => false,
        'userInfo' => null
    ]);
}




