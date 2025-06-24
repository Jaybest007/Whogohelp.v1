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

$action = $_GET['action'] ?? null;
$errand_Id = $_GET['errand_Id'] ?? null;

switch($action){
    case 'global_pending':
        getErrandGlobalPending($pdo);
        break;
    case 'pending':
        getErrandPending($pdo);
        break;
    
    case 'myErrands':
        fetchMyOwnErrand($pdo);
        break;

    case 'byUsersLocation':
        fetchByUsersLocation($pdo);
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
    case 'status_completed_by_helper':
        changeStatus_completed_by_helper($pdo);
        break;
    case "status_reject_by_poster":
        changeStatus_rejected_by_poster($pdo);
        break;
    case 'status_confirmed_completion':
        changeStatus_completed($pdo);
    case 'status_cancel':
        changeStatus_Cancel($pdo);
        break;
    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid action"]); 
        exit;
}


function getErrandGlobalPending($pdo){
    $status = "pending";
    try {
        $sql = "SELECT * FROM `errands` WHERE `status` = :status";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['status' => $status]);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($errands ?: []);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}

function getErrandPending($pdo){
    $postedBy = $_SESSION['USER']['username'];
    $status = "pending";
    try {
        $sql = "SELECT * FROM `errands` WHERE `posted_by` = :posted_by AND `status` = :status";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['posted_by' => $postedBy, 'status' => $status]);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($errands ?: []);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}

//====FETCH ERRAND BY LOCATION=====
function fetchByUsersLocation($pdo){
    $status = 'pending';
    $location = strtolower(trim($_SESSION['USER']['location'] ?? ""));

    // Splitting location into words (e.g., "Ikeja city mall" → ["ikeja", "city", "mall"])
    $locationParts = preg_split('/[\s,]+/', $location);

    if (empty($locationParts)) {
        http_response_code(400);
        echo json_encode(['error'=> 'Invalid user location']);
        exit;
    }

    // Build dynamic WHERE clause using LIKE for each location part
    $conditions = [];
    $params = [':status' => $status];

    foreach ($locationParts as $index => $part) {
        $paramName = ":loc$index";
        $conditions[] = "LOWER(pick_up_location) LIKE $paramName";
        $params[$paramName] = '%' . $part . '%';
    }

    $whereClause = implode(' OR ', $conditions); // 
    $sql = "SELECT * FROM errands WHERE status = :status AND ($whereClause)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(["errands" => $errands ?: []]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
    }

    exit;
}
// this fetch the errands of the logged in user that is pending not everyons errands
function fetchMyOwnErrand($pdo){
    $postedBy = $_SESSION['USER']['username'];
    try {
        $sql = "SELECT * FROM `errands` WHERE `posted_by` = :posted_by AND `status` = 'pending' ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['posted_by' => $postedBy]);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($errands ?: []);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}


function getErrandInProgress($pdo){
    $user = $_SESSION['USER']['username'];
    $status = "progress";
    try {
        $sql = "SELECT * FROM `errands` WHERE (`posted_by` = :user OR `accepted_by` = :user) AND `status` = :status";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['user' => $user, 'status' => $status]);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($errands ?: []);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}

function getErrandCompleted($pdo){
    $user = $_SESSION['USER']['username'];
    $status = "completed";
    try {
        $sql = "SELECT * FROM `errands` WHERE (`posted_by` = :user OR `accepted_by` = :user) AND `status` = :status ORDER BY `date` ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['user' => $user, 'status' => $status]);
        $errands = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($errands ?: []);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}

function changeStatus_progress($pdo){
    $errand_Id = $_GET['errand_Id'];
    $accepted_by = $_SESSION['USER']['username'];
    $status = "progress";

    try {
        $sqlCheck = "SELECT status, posted_by FROM errands WHERE errand_Id = :errand_Id";
        $stmtCheck = $pdo->prepare($sqlCheck);
        $stmtCheck->execute(['errand_Id' => $errand_Id]);
        $current = $stmtCheck->fetch(PDO::FETCH_ASSOC);

        if (!$current) {
            http_response_code(404);
            echo json_encode(["error" => "Errand not found"]);
            exit;
        }

        if (in_array($current['status'], ['completed', 'canceled'])) {
            http_response_code(400);
            echo json_encode(["error" => "Cannot update a completed or canceled errand."]);
            exit;
        }

        //  Prevent posted_by from accepting their own errand
        if ($current['posted_by'] === $accepted_by) {
            http_response_code(403);
            echo json_encode(["error" => "You cannot accept your own errand."]);
            exit;
        }

        $sql = "UPDATE `errands` SET `status` = :status, `accepted_by` = :accepted_by WHERE `errand_Id` = :errand_Id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['errand_Id' => $errand_Id, 'accepted_by' => $accepted_by, 'status' => $status]);

        http_response_code(200);
        echo json_encode([
            "success" => $stmt->rowCount() > 0,
            "message" => $stmt->rowCount() > 0 ? "Errand accepted" : "Errand wasn't accepted"
        ]);

        $receiver = $current['posted_by'];
        $message = $accepted_by . " accepted your errand";

        $sqlNotification = "INSERT INTO `notifications`(`username`, `type`, `message`, `is_read`) VALUES (:username,:type,:message,:is_read)";
        $stmtNotification = $pdo->prepare($sqlNotification);   
        $stmtNotification->execute([
            'username' => $receiver,
            'type' => "errand accepted",
            'message' => $message,
            'is_read' => "false"
        ]);

        // ==let create chat ==
        // check if chat not exit already
        $check_for_chat = $pdo->prepare("SELECT * FROM chat WHERE errand_id = :errand_id AND poster_username = :poster AND helper_username = :helper");
        $check_for_chat->execute([
                            "errand_id" => $_GET['errand_Id'],
                            "poster" => $current['posted_by'],
                            "helper" => $accepted_by 
                        ]);
        if ($check_for_chat->rowCount() > 0) {
            http_response_code(404);
            echo json_encode(["error" => "Chat already exist"]);
            exit;
        }

        // chat id
        $hash = substr(md5($current['posted_by'] . $accepted_by . $_GET['errand_Id']), 0, 8);
        $chat_id = "cht_" . $hash;
         
        // let create new chat 
        $create_chat = $pdo->prepare("INSERT INTO `chat`(`chat_id`, `errand_id`, `poster_username`, `helper_username`, `created_at`, `status`) 
                                    VALUES (:chat_id, :errand_id, :poster_username, :helper_username, :created_at, :status)");
        $create_chat->execute([
                "chat_id"=> $chat_id,
                'errand_id' => $_GET['errand_Id'],
                'poster_username' => $current['posted_by'],
                'helper_username' => $accepted_by,
                'created_at' => date('c'),
                'status' => 'active',

        ]);
        if ($create_chat->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["success" => true,  "message" => "Chat room has been created "]);
            exit;
        }
        

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}



function generateTransactionId($errand_Id){
    $date = date('c');
    $random = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'),0,5);
    return "TX-{$date}-{$errand_Id}-{$random}";
}

function changeStatus_completed_by_helper($pdo){
    $status = "awaiting_confirmation";
    $errand_Id = $_GET['errand_Id'];
    $startTime = date('Y-m-d H:i:s');

    try {
        $sql = "UPDATE `errands` SET `status` = :status, `awaiting_confirmation_start_time` = :startTime WHERE `errand_Id` = :errand_Id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['errand_Id' => $errand_Id, 'status' => $status, 'startTime' => $startTime]);

        if($stmt->rowCount() > 0) {

            $sqlErrand = "SELECT * FROM `errands` WHERE `errand_Id` =:errand_Id";
            $stmtErrand =  $pdo->prepare($sqlErrand);
            $stmtErrand->execute(["errand_Id"=> $errand_Id ]);
            $errand = $stmtErrand->fetch(PDO::FETCH_ASSOC);

            if($errand) {
                $receiver = $errand['posted_by'];
                $message = $errand['accepted_by'] . " Completed your errand and waiting for your approval";
                $sqlNotification = "INSERT INTO `notifications`(`username`, `type`, `message`, `is_read`) 
                VALUES (:username,:type,:message,:is_read)";
                $stmtNotification = $pdo->prepare($sqlNotification);   
                $stmtNotification->execute([
                    'username' => $receiver,
                    'type' => "errand completed",
                    'message' => $message,
                    'is_read' => "false"
                ]);
                http_response_code(200);
                echo json_encode(["success" => true,  "message" => "Welldone!!...Waiting for the poster for confirmation"]);
                exit;
            }
        } else{
            http_response_code(400);
            echo json_encode(["error" => "Errand can't be completed"]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}

function changeStatus_rejected_by_poster($pdo){
    $status = "rejected_by_poster";
    $errand_Id = $_GET['errand_Id'];
    $reason = htmlspecialchars(trim($_GET['reason']));

    try {
        $sql = "UPDATE `errands` SET `status` = :status, `rejection_reason` =:reason WHERE `errand_Id` = :errand_Id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['errand_Id' => $errand_Id, 'status' => $status, 'reason'=> $reason]);

        if($stmt->rowCount() > 0) {

            $sqlErrand = "SELECT * FROM `errands` WHERE `errand_Id` =:errand_Id";
            $stmtErrand =  $pdo->prepare($sqlErrand);
            $stmtErrand->execute(["errand_Id"=> $errand_Id ]);
            $errand = $stmtErrand->fetch(PDO::FETCH_ASSOC);

            if($errand) {
                $receiver = $errand['accepted_by'];
                $message = $errand['posted_by'] . " Rejected the confirmation because : " . $reason ;
                $sqlNotification = "INSERT INTO `notifications`(`username`, `type`, `message`, `is_read`) 
                VALUES (:username,:type,:message,:is_read)";
                $stmtNotification = $pdo->prepare($sqlNotification);   
                $stmtNotification->execute([
                    'username' => $receiver,
                    'type' => "confirmation rejected",
                    'message' => $message,
                    'is_read' => "false"
                ]);
                http_response_code(200);
                echo json_encode(["success" => true, "message" => "Errand confirmation is successfuly rejected "]);
                exit;
            }
        } else{
            http_response_code(400);
            echo json_encode(["error" => "Errand can't be completed"]);
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

    try {
        $sql = "UPDATE `errands` SET `status` = :status WHERE `errand_Id` = :errand_Id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['errand_Id' => $errand_Id, 'status' => $status]);

        if($stmt->rowCount() > 0) {

            $sqlErrand = "SELECT * FROM `errands` WHERE `errand_Id` =:errand_Id";
            $stmtErrand =  $pdo->prepare($sqlErrand);
            $stmtErrand->execute(["errand_Id"=> $errand_Id ]);
            $errand = $stmtErrand->fetch(PDO::FETCH_ASSOC);

            if($errand) {
                $reward = $errand['reward'];
                $accepted_by = $errand['accepted_by'];
                $transaction_id = generateTransactionId($errand_Id);
                $dsc = "Credit for the completion of ". $errand_Id;

                $sqlTransaction = "INSERT INTO `transactions`(`transaction_id`,`username`, `errand_Id`, `amount`, `type`, `description`) 
                    VALUES (:transaction_id,:username, :errand_Id, :amount, :type, :description)";
                $stmtTransaction = $pdo->prepare($sqlTransaction);
                $stmtTransaction->execute([
                    'transaction_id' => $transaction_id,
                    'username' => $accepted_by, 
                    'errand_Id' => $errand_Id,
                    'amount' => $reward,
                    'type' => "credit",
                    'description' => $dsc
                ]);

                if($stmtTransaction->rowCount() > 0) {
                    $sqlAddReward = "UPDATE `wallet` SET `balance`= `balance` + :reward WHERE `username` = :username" ;
                    $stmtAddReward = $pdo->prepare($sqlAddReward);
                    $stmtAddReward->execute(['reward' => $reward, 'username' => $accepted_by]);

                    if($stmtAddReward->rowCount() > 0) {
                        http_response_code(200);
                        echo json_encode(["success" => true,  "message" => "Errand Successfully completed"]);

                        
                        $receiver = $errand['accepted_by'];
                        $message = $accepted_by . " confirmed you completed his/her your errand";
                        $sqlNotification = "INSERT INTO `notifications`(`username`, `type`, `message`, `is_read`) 
                            VALUES (:username,:type,:message,:is_read)";
                        $stmtNotification = $pdo->prepare($sqlNotification);   
                        $stmtNotification->execute([
                            'username' => $receiver,
                            'type' => "errand completed",
                            'message' => $message,
                            'is_read' => "false"
                        ]);
                        if($stmtNotification->rowCount() > 0) {
                            $stmt = $pdo->prepare("UPDATE `chat` SET `status`= 'closed' WHERE `errand_id` = :errand_id");
                            $stmt->execute(['errand_id' => $errand_Id]);

                        }
                        exit;

                    } else{
                        http_response_code(400);
                        echo json_encode(["error" => "Reward was not successfully added to the helper balance"]);
                    }
                }else{
                    http_response_code(400);
                    echo json_encode(["error" => "Transaction wasn't successfully added"]);
                }
            }else{
                http_response_code(400);
                echo json_encode(["error" => "Errand can't be found"]);
            }
        } else{
            http_response_code(400);
            echo json_encode(["error" => "Errand can't be completed"]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}









function changeStatus_Cancel($pdo){
    $errand_Id = $_GET['errand_Id'];
    $posted_by = $_SESSION['USER']['username'];
    $status = 'canceled';

    try {
        $sql = "SELECT * FROM `errands` WHERE `errand_Id` = :errand_Id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(["errand_Id" => $errand_Id]);
        $errand = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$errand) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Errand not found"]);
            exit;
        }

        if ($errand['posted_by'] !== $posted_by) {
            http_response_code(200);
            echo json_encode(["success" => false, "message" => "You are not authorized to cancel this errand"]);
            exit;
        }

        if($errand['status'] === 'canceled' ){
            http_response_code(200);
            echo json_encode(['success'=> false,'message'=> 'Errand already canceled']);
            exit;
        }
        $sqlWallet = "SELECT * FROM `wallet` WHERE `username` = :username";
        $stmtWallet = $pdo->prepare($sqlWallet);
        $stmtWallet->execute(["username" => $posted_by]);
        $wallet = $stmtWallet->fetch(PDO::FETCH_ASSOC);

        if (!$wallet) {
            http_response_code(200);
            echo json_encode(["success" => false, "message" => "User wallet can't be found for reward reversal"]);
            exit;
        }

        $sqlCancel = "UPDATE `errands` SET `status` = :status WHERE `errand_Id` = :errand_Id";
        $stmtCancel = $pdo->prepare($sqlCancel);
        $stmtCancel->execute(['status' => $status, 'errand_Id' => $errand_Id]);

        $newBalance = $wallet["balance"] + $errand['reward'];
        $sqlUpdateBalance = "UPDATE `wallet` SET `balance` = :balance WHERE `username` = :username";
        $stmtUpdateBalance = $pdo->prepare($sqlUpdateBalance);
        $stmtUpdateBalance->execute(['balance' => $newBalance, 'username' => $posted_by]);

        $transactionDescription = "Credit for the reversal of errand " . $errand_Id;
        $transaction_id = generateTransactionId($errand_Id);
        $sqlTransaction = "INSERT INTO `transactions`(`transaction_id`,`username`, `errand_Id`, `amount`, `type`, `description`) 
            VALUES (:transaction_id,:username, :errand_Id, :amount, :type, :description)";
        $stmtTransaction = $pdo->prepare($sqlTransaction);
        $stmtTransaction->execute([
            'transaction_id' => $transaction_id,
            "username" => $posted_by,
            'errand_Id' => $errand_Id,
            'amount' => $errand['reward'],
            'type' => 'reversal',
            'description' => $transactionDescription 
        ]);

        if ($stmtTransaction->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Errand canceled & reward reversed successfully"]);

            $receiver = $errand['posted_by'];
            $message = "Your errand has been canceled and your fund has been reversed";
            $sqlNotification = "INSERT INTO `notifications`(`username`, `type`, `message`, `is_read`) 
                VALUES (:username,:type,:message,:is_read)";
            $stmtNotification = $pdo->prepare($sqlNotification);   
            $stmtNotification->execute([
                'username' => $receiver,
                'type' => "errand canceled",
                'message' => $message,
                'is_read' => "false"
            ]);
            if($stmtNotification->rowCount() > 0) {
                $stmt = $pdo->prepare("UPDATE `chat` SET `status`= 'closed' WHERE `errand_id` = :errand_id");
                $stmt->execute(['errand_id' => $errand_Id]);
                }
            exit;
        } else {
            http_response_code(200);
            echo json_encode(["success" => false, "message" => "Balance can't be reversed"]);
            exit;
        }
        

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed", "details" => $e->getMessage()]);
        exit;
    }
}
