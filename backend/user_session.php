<?php
session_start();
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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

