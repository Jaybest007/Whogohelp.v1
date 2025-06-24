<?php 
session_start();
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

//connect my database
include 'db_connect.php';

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit;
}

//check if user session is set
if(!isset($_SESSION['USER'])){
    http_response_code(401);
    echo json_encode(["error" => "User is not logged in"]);
    exit;
};

$action = $_GET['action'] ?? null;
$errand_Id = $_GET['errand_Id'] ?? null;

switch($action){
    case 'global_pending':
        getErrandGlobalPending($pdo);
        break;

    case 'pending':
        getErrandPending($pdo);
        break;
    
    case 'progress':
        getErrandInProgress($pdo);
        break;
    
    case 'completed':
        getErrandCompleted($pdo);
        break;
    
    case 'status_progress':
        changeStatus_progress($pdo);
        break;

    case 'status_completed':
        changeStatus_completed($pdo);
        break;

    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid action"]); 
}


function getErrandGlobalPending($pdo){
    $postedBy = $_SESSION['USER']['username'];
    $status = "pending" ;

    try {
        $sql = "SELECT * FROM `errands` WHERE `status` = :status";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['status' => $status]);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($errands && count($errands) > 0) {
            http_response_code(200);
            echo json_encode($errands);
            exit;
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}

function getErrandPending($pdo){

    $postedBy = $_SESSION['USER']['username'];
    $status = "pending" ;

    try {
        $sql = "SELECT * FROM `errands` WHERE `posted_by` = :posted_by AND `status` = :status";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['posted_by' => $postedBy, 'status' => $status]);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($errands && count($errands) > 0) {
            http_response_code(200);
            echo json_encode($errands);
            exit;
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }

}

function getErrandInProgress($pdo){
    $postedBy = $_SESSION['USER']['username'];
    $accepted_by = $_SESSION['USER']['username'];
    $status = "progress" ;

    try {
        $sql = "SELECT * FROM `errands` WHERE (`posted_by` = :posted_by OR `accepted_by` = :accepted_by) AND `status` = :status";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['posted_by' => $postedBy, 'accepted_by' => $accepted_by, 'status' => $status]);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($errands && count($errands) > 0) {
            http_response_code(200);
            echo json_encode($errands);
            exit;
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}

function getErrandCompleted($pdo){
    $postedBy = $_SESSION['USER']['username'];
    $accepted_by = $_SESSION['USER']['username'];
    $status = "completed" ;
    

    try {
        $sql = "SELECT * FROM `errands` WHERE (`posted_by` = :posted_by OR `accepted_by` = :accepted_by) AND `status` = :status";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['posted_by' => $postedBy, 'accepted_by' => $accepted_by, 'status' => $status]);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($errands && count($errands) > 0) {
            http_response_code(200);
            echo json_encode($errands);
            exit;
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}

function changeStatus_progress($pdo){
    $status = "progress";
    $errand_Id = $_GET['errand_Id'];
    $accepted_by = $_SESSION['USER']['username'];

    try {
        $sql = "UPDATE `errands` SET `status` = :status, `accepted_by` = :accepted_by WHERE `errand_Id` = :errand_Id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['errand_Id' => $errand_Id, 'accepted_by' => $accepted_by, 'status' => $status]);
       
        if ($stmt ->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Errand accepted"]);
            
        } else {
            http_response_code(200);
            echo json_encode(["success" => false, "message" => "Errand was'nt accepted"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}

function changeStatus_completed($pdo){
    $status = "completed";
    $errand_Id = $_GET['errand_Id'];
    $accepted_by = $_SESSION['USER']['username'];

    try {
        $sql = "UPDATE `errands` SET `status` = :status, `accepted_by` = :accepted_by WHERE `errand_Id` = :errand_Id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['errand_Id' => $errand_Id, 'accepted_by' => $accepted_by, 'status' => $status]);
       
        if ($stmt ->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Errand completed"]);
            
        } else {
            http_response_code(200);
            echo json_encode(["success" => false, "message" => "Errand was'nt completed"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}




