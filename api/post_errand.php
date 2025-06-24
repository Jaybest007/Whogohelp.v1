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
if(!isset($_SESSION['USER'])){
    http_response_code(401);
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

function generateTransactionId($errand_Id){
    $date = date('c');
    $random = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'),0,5);
    return "TX-{$date}-{$errand_Id}-{$random}";
};

//===PICK UP CODE GENERATION====
$pickupCode = str_pad(rand(0, 9999), 4,'0',STR_PAD_LEFT);


$date = date("d-m-y");
$time = date("h:i A"); // Fixed double semicolon
$errand_Id = generateOrderId();
$title = htmlspecialchars(trim($data['title']));
$description = htmlspecialchars(trim($data['description']));
$pick_up_location = htmlspecialchars(trim($data['pickUpLocation']));
$drop_off_location = htmlspecialchars(trim($data['dropOffLocation']));
$reward = htmlspecialchars(trim($data['reward']));
$notes = htmlspecialchars(trim($data['notes']?? ''));
$posted_by = $_SESSION['USER']['username'];
$status = "pending";


//let check if the user have enough balance for the errand they want to post
$sqlCheck = "SELECT * FROM wallet WHERE `username` = :username";
$stmt2 = $pdo->prepare($sqlCheck);
$stmt2->execute(['username' => $posted_by]);

if($stmt2->rowCount() > 0){
    $walletBalance = $stmt2->fetch(PDO::FETCH_ASSOC);
    if (floatval($walletBalance['balance']) < floatval($reward)) {
        http_response_code(400);
        echo json_encode(["error" => ["server" => "Insufficient wallet balance to post this errand!!"]]);
        exit;
    }
    $newBalance = $walletBalance["balance"] - $reward;

    // Update new balance
    $sqlUpdateBalance = "UPDATE `wallet` SET `balance`=:balance WHERE `username` = :username";
    $stmtUpdateBalance = $pdo->prepare($sqlUpdateBalance);
    $stmtUpdateBalance->execute(['username' => $posted_by, 'balance' => $newBalance]);
    if($stmtUpdateBalance->rowCount() > 0){

        // Insert the transaction in transaction table
        $transactionDescription = "Debit for the errand " . $errand_Id;
        $transaction_id = generateTransactionId($errand_Id);
        $sqlInsertTransaction = "INSERT INTO `transactions` (`transaction_id`,`username`, `errand_Id`, `amount`, `type`, `description`) 
                                VALUES (:transaction_id,:username, :errand_Id, :amount, :type, :description)";
        $stmtInsertTransaction = $pdo->prepare($sqlInsertTransaction);
        $stmtInsertTransaction->execute([
            'transaction_id' => $transaction_id,
            "username"=> $posted_by,
            "errand_Id" => $errand_Id,
            "amount" => $reward,
            "type" => "debit",
            "description" => $transactionDescription
        ]);

        if($stmtInsertTransaction->rowCount() > 0){
            // Insert errand
            $sqlPost = "INSERT INTO errands (errand_Id, date, time, title, description, pick_up_location, drop_off_location, reward, notes, posted_by, status, pickup_code) 
                        VALUES (:errand_Id, :date, :time, :title, :description, :pick_up_location, :drop_off_location, :reward, :notes, :posted_by, :status, :pickup_code)";
            $stmt = $pdo->prepare($sqlPost);

            try{
                $stmt->execute([
                    'errand_Id' => $errand_Id,
                    'date' => $date,
                    'time' => $time,
                    'title' => $title,
                    'description' => $description,
                    'pick_up_location' => $pick_up_location,
                    'drop_off_location' => $drop_off_location,
                    'reward' => $reward,
                    'notes' => $notes,
                    'posted_by' => $posted_by,
                    'status' => $status,
                    'pickup_code' => $pickupCode
                ]);

                http_response_code(201);
                echo json_encode(["success" => true]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["error" => ["server" => "Database error: " . $e->getMessage()]]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["error" => ["server" => "Failed to insert transaction."]]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["error" => ["server" => "Failed to update wallet balance."]]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => ["server" => "Wallet not found for user."]]);
    exit;
}


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);







