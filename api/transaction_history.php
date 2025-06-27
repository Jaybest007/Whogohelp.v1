<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (empty($_SESSION['USER']['username'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Login required']);
    exit;
}

include 'db_connect.php';


$raw      = file_get_contents('php://input');
$bodyJson = json_decode($raw, true) ?: [];
$action   = $bodyJson['action']
         ?? $_GET['action']
         ?? '';



/**
 * Log a transaction for a user.
 *
 * @param PDO $pdo
 * @param string $transaction_id
 * @param string $username
 * @param string $errand_Id
 * @param float $amount
 * @param string $type
 * @param string $description
 * @return bool
 */
function logTransaction($pdo, $transaction_id, $username, $errand_Id, $amount, $type, $description) {
    try {
        $sql = "INSERT INTO `transactions`(`transaction_id`, `username`, `errand_Id`, `amount`, `type`, `description`) 
                VALUES (:transaction_id, :username, :errand_Id, :amount, :type, :description)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'transaction_id' => $transaction_id,
            'username' => $username,
            'errand_Id' => $errand_Id,
            'amount' => $amount,
            'type' => $type,
            'description' => $description
        ]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        error_log("Transaction log error: " . $e->getMessage());
        return false;
    }
}




switch ($action) {
    case 'fetchAllTransactions':
        fetchTransactions($pdo);                // all
        break;
    case 'fetchCredit':
        fetchTransactions($pdo, 'credit');
        break;
    case 'fetchDebit':
        fetchTransactions($pdo, 'debit');
        break;
    case 'fetchReversal':
        fetchTransactions($pdo, 'reversal');
        break;
    case 'topup':
        topUpWallet($pdo);
        break;
    case 'withdraw':
        withdraw($pdo);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}

/* ----------  Data helper  ---------- */
function fetchTransactions(PDO $pdo, string $type = null): void
{
    try {
        $username = $_SESSION['USER']['username'];

        $sql    = 'SELECT * FROM `transactions` WHERE `username` = :username ORDER BY `created_at` DESC';
        $params = ['username' => $username];

        if ($type !== null) {
            $sql          .= ' AND type = :type';
            $params['type'] = $type;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'hasHistory'   => !empty($rows),
            'transactions' => $rows,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
}

function generateTransactionId($errand_Id){
    $random = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'),0,5);
    return "{$errand_Id}-{$random}";
}

require 'send_mail.php';

/**
 * Send a notification to a user.
 *
 * @param PDO $pdo
 * @param string $username
 * @param string $type
 * @param string $message
 * @param string $is_read (default: "false")
 * @return bool
 */
function sendNotification($pdo, $username, $type, $message, $is_read = "false") {
    try {
        $sql = "INSERT INTO `notifications`(`username`, `type`, `message`, `is_read`) 
                VALUES (:username, :type, :message, :is_read)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'username' => $username,
            'type' => $type,
            'message' => $message,
            'is_read' => $is_read
        ]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        // Optionally log error: error_log($e->getMessage());
        return false;
    }
}



// -------Function to topup wallet-----
function topUpWallet($pdo){
    $username = $_SESSION['USER']['username'];
    $email = $_SESSION['USER']['email'];
    $rawBody = file_get_contents('php://input');
    $bodyJson = json_decode($rawBody, true) ?: [];
    
    $amount = $bodyJson['amount'] ?? null;
    $method = $bodyJson['method'] ?? null;

    $errand_Id = "TOPUP" .date('Y-m-d H:i:s') . $amount;
    $trx_id = generateTransactionId($errand_Id);
    $descr = "Top up of " . $amount . " to balance";
    $type = " Credit by " . $method;

    try{
        $stmt = $pdo->prepare("SELECT * FROM `wallet` WHERE `username`= :username");
        $stmt->execute(["username"=> $username]);
        $foundWallet = $stmt->fetch(PDO::FETCH_ASSOC);

        if($foundWallet){
            $stmt = $pdo->prepare("UPDATE `wallet` SET `balance` = `balance` + :amount, `updated_at` = :updated_at WHERE `username` = :username");
            $stmt->execute([
                "amount" => $amount,
                'updated_at' => date('c'),
                "username"=> $username,
            ]);
            $walletToppedUp = $stmt->rowCount() > 0;
            if($walletToppedUp){
                // Use the reusable transaction logger
                $TransactionLogged = logTransaction($pdo, $trx_id, $username, $errand_Id, $amount, "credit", $descr);
                if($TransactionLogged){
                    sendNotification($pdo, $username, $type, $descr, 'false');
                    http_response_code(200);
                    echo json_encode([
                        'success' => true,
                        'message' => 'Top up Successful',
                    ]);
                    exit;
                }
            }else{
                http_response_code(200);
                echo json_encode([
                'success' => false,
                'message' => 'Unable to add money to wallet balance',
            ]);
            exit;
            }
        }else{
            http_response_code(200);
            echo json_encode([
                'success' => false,
                'message' => 'Wallet not found',
            ]);
            exit;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
}

function withdraw($pdo){
    $username = $_SESSION['USER']['username'];
    $rawBody = file_get_contents('php://input');
    $bodyJson = json_decode($rawBody, true) ?: [];
    
    $amount = $bodyJson['withdrawalAmount'] ?? null;
    $bank = $bodyJson['bank'] ?? null;
    $accountNumber = $bodyJson['accountNumber'] ?? null;
    $accountName = $bodyJson['accountName'] ?? null;

    if (!is_numeric($amount) || $amount <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid withdrawal amount']);
        exit;
    }

    if(strlen($accountNumber) < 10 ){
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid account number']);
        exit;
    }

    $errand_Id = "WITHD" . date('Y-m-d H:i:s')." - " . $accountNumber;
    $trx_id = generateTransactionId($errand_Id);
    $descr = "Withdrawal of " . $amount . " from wallet to ". $bank ;
    $type = " Debit to " . $bank;

    try{
        $stmt = $pdo->prepare("SELECT * FROM `wallet` WHERE `username`= :username");
        $stmt->execute(["username"=> $username]);
        $foundWallet = $stmt->fetch(PDO::FETCH_ASSOC);

        if($foundWallet){
            if(floatval($foundWallet["balance"]) < floatval($amount)){
                http_response_code(200);
                echo json_encode([
                'success' => false,
                'message' => 'Insufficient balance',
                ]);
                exit;
            }else{
                $stmt = $pdo->prepare("UPDATE `wallet` SET `balance` = `balance` - :amount, `updated_at` = :updated_at WHERE `username` = :username");
                $stmt->execute([
                    "amount" => $amount,
                    'updated_at' => date('c'),
                    "username"=> $username,
                ]);
                $walletWithdrawn = $stmt->rowCount() > 0;

                if($walletWithdrawn){
                    // Use the reusable transaction logger
                    $TransactionLogged = logTransaction($pdo, $trx_id, $username, $errand_Id, $amount, "debit", $descr);
                    if($TransactionLogged){
                        sendNotification($pdo, $username, $type, $descr, 'false');
                        http_response_code(200);
                        echo json_encode([
                            'success' => true,
                            'message' => 'Withdrawal is Successful',
                        ]);
                        exit;
                    }
                }else{
                    http_response_code(200);
                    echo json_encode([
                    'success' => false,
                    'message' => 'Unable to add money to wallet balance',
                ]);
                exit;
                }
            }
        }else{
            http_response_code(200);
            echo json_encode([
                'success' => false,
                'message' => 'Wallet not found',
            ]);
            exit;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
}