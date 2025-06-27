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

if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
    $_POST = json_decode(file_get_contents('php://input'), true);
}

include 'db_connect.php';

if(!isset($_SESSION['USER'])){
    http_response_code(401);
    echo json_encode(["message" => "User is not logged in"]);
    exit;
}

if ($_SESSION['USER']['role'] !== 'admin') {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized!!']);
    exit;
}

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

function generateTransactionId($errand_Id) {
    $date = date('c');
    $random = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'), 0, 5);
    return "TX-{$date}-{$errand_Id}-{$random}";
}

$action = $_POST["action"] ?? null;
switch($action) {
    case "take_action":
        take_action($pdo);
        break;
    
    case "errand_action":
        errand_actions($pdo);
        break;

    case "mark_message_as_read":
        mark_as_read($pdo);
        break;

    case "settings";
    setSettings($pdo);
    break;


    default:
        http_response_code(400);
        echo json_encode(["message" => "Invalid action"]); 
        exit;
}

function take_action($pdo) {
    $username = htmlspecialchars(trim($_POST['username'] ?? null));
    $type = $_POST['type'];
    $ban = "Your account has been restricted, Contact customer support";
    $unban = "Your account limitation has been lifted, enjoy!!";
    
    try {
        $SqlcheckUser = $pdo->prepare('SELECT * FROM `users` WHERE `username` = :username');
        $SqlcheckUser->execute(['username' => $username]);
        $checkedUser = $SqlcheckUser->fetch(PDO::FETCH_ASSOC);

        if ($checkedUser) {
            $sqlAction = $pdo->prepare('UPDATE `users` SET `status` = :type WHERE `username` =:username');
            $sqlAction->execute(["type" => $type, 'username'=> $checkedUser['username']]);
            
            if ($sqlAction->rowCount() > 0 && $type === "banned") {
                http_response_code(200);
                echo json_encode(["success" => true, "message" => "User banned successfully"]);

                // Send notification
                sendNotification($pdo, $username, $type, $ban, $is_read = "false");
                exit;
            } 
            if ($sqlAction->rowCount() > 0 && $type === "active") {
                http_response_code(200);
                sendNotification($pdo, $username, $type, $unban, $is_read = "false");
                echo json_encode(["success" => true, "message" => "User unbanned successfully"]);
                exit;
            } else {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Unable to ban user"]);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Can't find user"]);
            exit;
        }
    } catch (PDOException $e) {
        error_log("Admin ban user error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Database query failed"]);
        exit;
    }
}


//======THIS ACTION IS TO CANCEL AND COMPLETE USER ERRAND BY THE ADMIN==========
function errand_actions($pdo) {
    $errand_id = $_POST['errand_id'];
    $action_type = $_POST['action_type'];

    try{
        // Fetch the errand
    $errand_stmt = $pdo->prepare('SELECT * FROM errands WHERE `errand_Id` = :errand_id');
    $errand_stmt->execute(['errand_id' => $errand_id]);
    $errand = $errand_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$errand) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Errand not found']);
        exit;
    }

    // Cancel the errand
    if ($action_type === 'cancel') {
        $cancel_message = "Your errand has been canceled by the admin and your fund is refunded";
        $dsc = "Credit for the reversal of errand " . $errand_id;
        $type = "reversal";
        $transaction_id = generateTransactionId($errand_id);

        if ($errand['status'] === 'canceled') {
            http_response_code(200);
            echo json_encode(['success' => false, 'message' => 'Errand already canceled']);
            exit;
        } else {
            $cancel_errand = $pdo->prepare('UPDATE `errands` SET `status` = :status WHERE `errand_Id` = :errand_Id');
            $cancel_errand->execute(['status' => $action_type, 'errand_Id' => $errand_id]);

            if ($cancel_errand->rowCount() === 1) {
                sendNotification($pdo, $errand['posted_by'], $action_type, $cancel_message, "false");
                $refund_stmt = $pdo->prepare("UPDATE `wallet` SET `balance` = balance + :reward WHERE `username` = :username");
                $refund_stmt->execute([
                    ':reward' => $errand['reward'],
                    ':username' => $errand['posted_by']
                ]);
                if ($refund_stmt->rowCount() === 1) {
                    logTransaction($pdo, $transaction_id, $errand['posted_by'], $errand_id, $errand['reward'], $type, $dsc);
                    http_response_code(200);
                    echo json_encode(['success' => true, 'message' => 'Errand canceled and fund refunded']);
                    exit;
                } else {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Refund failed']);
                    exit;
                }
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to cancel errand']);
                exit;
            }
        }
    } else{

        if ($action_type === 'completed') {
            $message = "Your errand has been completed by the admin";
            $dsc = "Credit for the completion of errand " . $errand_id;
            $type = "Credit";
            $transaction_id = generateTransactionId($errand_id);   
            
        if ($errand['status'] === 'completed') {
            http_response_code(200);
            echo json_encode(['success' => false, 'message' => 'Errand already completed']);
            exit;
        } else {

            $complete_errand = $pdo->prepare('UPDATE `errands` SET `status` = :status WHERE `errand_Id` = :errand_Id');
            $complete_errand->execute(['status' => $action_type, 'errand_Id' => $errand_id]);

            if ($complete_errand->rowCount() === 1) {
                sendNotification($pdo, $errand['posted_by'], $action_type, $message, "false");
                $credit_stmt = $pdo->prepare("UPDATE `wallet` SET `balance` = balance + :reward WHERE `username` = :username");
                $credit_stmt->execute([
                    ':reward' => $errand['reward'],
                    ':username' => $errand['accepted_by']
                ]);
                if ($credit_stmt->rowCount() === 1) {
                    logTransaction($pdo, $transaction_id, $errand['accepted_by'], $errand_id, $errand['reward'], $type, $dsc);
                    http_response_code(200);
                    echo json_encode(['success' => true, 'message' => 'Errand has been successfully completed']);
                    exit;
                } else {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'completion failed']);
                    exit;
                }
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to complete errand']);
                exit;
            }
        }
    } 
    if($action_type !== 'cancel' && $action_type !== 'completed') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action type']);
        exit;
    }
    }
    }catch (PDOException $e) {
        error_log("Admin ban user error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Database query failed"]);
        exit;
    }
}

// ======THis is to mark messages sent to the website as read =====
function mark_as_read($pdo){
    $id = $_POST['id'];

    try{

        $MarkAsRead = $pdo->prepare('UPDATE `contact_us` SET `marked_as_read`= :read WHERE `id`= :id ');
        $MarkAsRead->execute(['read' => true, 'id'=> $id]);
        if( $MarkAsRead->rowCount() > 0){
             http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Message read']);
            exit;
        }
        
    }catch (PDOException $e) {
        error_log("Admin ban user error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Database query failed"]);
        exit;
    }
}


function setSettings($pdo){
    $maintenance_mode = $_POST['maintenance_mode'] ?? null;
    $withdrawal_limit = $_POST['withdrawal_limit'] ?? null;
    $announcement = $_POST['announcement'] ?? null;
    try{
        $fields = [];
        $params = ["updated_at" => date("Y-m-d H:i:s")];

        if ($maintenance_mode !== null && $maintenance_mode !== "") {
            $fields[] = "`maintenance_mode` = :maintenance";
            $params["maintenance"] = $maintenance_mode;
        }
        if ($withdrawal_limit !== null && $withdrawal_limit !== "") {
            $fields[] = "`withdrawal_limit` = :limit";
            $params["limit"] = $withdrawal_limit;
        }
        if ($announcement !== null && $announcement !== "") {
            $fields[] = "`announcement` = :announcement";
            $params["announcement"] = $announcement;
        }

        if (empty($fields)) {
            echo json_encode(["success" => false, "message" => "No settings to update"]);
            exit;
        }

        $UpdateSettingsSql = 'UPDATE `admin_settings` SET `updated_at` = :updated_at, ' . implode(', ', $fields) . ' WHERE id = 1';
        $stmt = $pdo->prepare($UpdateSettingsSql);
        $stmt->execute($params);
        echo json_encode(["success"=> true,"message"=> "Setting Updated successfully"]);
        exit;


    } catch (PDOException $e) {
        error_log("Admin ban user error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Database query failed"]);
        exit;
    }
}