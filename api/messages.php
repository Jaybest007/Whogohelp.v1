<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

include 'db_connect.php';

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit;
}

if(!isset($_SESSION['USER'])){
    http_response_code(401);
    echo json_encode(["error" => "User is not logged in"]);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
$action = $data['action'] ?? '';

switch($action){
    case 'send_message':
        sendMessage($pdo, $data);
        break;
    
    case 'fetch_conversation':
        fetchConversation($pdo, $data);
        break;

    case 'mark_as_read':
        markasread($pdo, $data);
        break;

    case 'fetchChat':
        fetchChat($pdo, $data);
        break;
    case 'fetch_by_chat_id':
        fetchChatbyId($pdo, $data );
        break;
    case 'update_status':
        updateUserStatus($pdo, $data);
        break;
    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid action"]); 
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
        error_log("Notification error: " . $e->getMessage());
        return false;
    }
}

function sendMessage($pdo, $data){
    $chat_id = htmlspecialchars($data['chat_id'] ?? '');
    $user_status = htmlspecialchars($data['user_status'] ?? '');
    $sender = htmlspecialchars($data['sender'] ?? '');
    $receiver = htmlspecialchars($data['receiver']);
    $message = trim($data['message'] ?? '');
    $message_text = htmlspecialchars(strip_tags(trim($message)), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $is_read = 0;

    try{
        $stmt = $pdo->prepare('INSERT INTO `messages` 
            (`chat_id`, `sender_username`, `message_text`, `is_read`) 
            VALUES (:chat_id, :sender_username, :message_text, :is_read)');

        $stmt->execute([
                'chat_id' => $chat_id,
                'sender_username' => $sender,
                'message_text' => $message_text,
                'is_read' => $is_read,
        ]);
        if($stmt->rowCount() > 0){
            http_response_code(200);
            echo json_encode(["success" => true]);

            if($user_status === "offline"){
                sendNotification($pdo, $receiver, 'chat', $message_text, "false");
                http_response_code(200);
                exit;
            }
           
        } else{
            http_response_code(200);
            echo json_encode(["success" => false, "message" => "Message isnt sent"]);
            exit;
        }
    } catch (PDOException $e) {
        error_log("Send message error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Database query failed"]);
        exit;
    }
}

function fetchConversation($pdo, $data){
    $chat_id = htmlspecialchars($data['chat_id'] ?? '');
    
    try{
        $stmt = $pdo->prepare('SELECT * FROM `messages` WHERE `chat_id` = :chat_id ORDER BY `sent_at` ASC');
        $stmt->execute(['chat_id' => $chat_id]);
        $conversation = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if($conversation){
            http_response_code(200);
            echo json_encode($conversation);
        }  else {
            http_response_code(200);
            echo json_encode([]); 
        }

    } catch (PDOException $e) {
        error_log("Fetch conversation error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Database query failed"]);
        exit;
    }
}

function  markasread($pdo, $data) {
    $chat_id = htmlspecialchars($data['chat_id'] ?? '');
    $currentUser = $_SESSION['USER']['username'];

    try{
        $stmt = $pdo->prepare('UPDATE `messages` SET `is_read`= 1 WHERE `chat_id` = :chat_id AND `sender_username` != :current_user AND is_read = 0');
        $stmt->execute(['chat_id'=> $chat_id, 'current_user'=> $currentUser]);
        
        if($stmt->rowCount() > 0){
            http_response_code(200);
            echo json_encode(['success'=> true]);
        };

    } catch (PDOException $e) {
        error_log("Mark as read error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Database query failed"]);
        exit;
    }
}

function fetchChat($pdo, $data){
    $errand_id = htmlspecialchars($data['errand_id'] ?? '');
    try{
        $stmt = $pdo->prepare("SELECT * FROM `chat` WHERE `errand_id` = :errand_id AND (`poster_username` = :user OR `helper_username` = :user)");
        $stmt->execute([
        'errand_id' => $errand_id, 
        'user' => $_SESSION['USER']['username']
        ]);
       
        $chat = $stmt->fetch(PDO::FETCH_ASSOC);
        

        if ($chat) {
        http_response_code(200);
        echo json_encode( $chat);
        } else {
        http_response_code(200);
        echo json_encode(null); // or []
        }
        
    }  catch (PDOException $e) {
        error_log("Fetch chat error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Database query failed"]);
        exit;
    }
}

function fetchChatbyId($pdo, $data){
    $chat_id = htmlspecialchars($data['chat_id'] ?? '');
     try{
        $stmt = $pdo->prepare("SELECT * FROM `chat` WHERE `chat_id` = :chat_id");
        $stmt->execute(['chat_id' => $chat_id ]);
        $chat = $stmt->fetch(PDO::FETCH_ASSOC);

        if($chat){
            http_response_code(200);
            echo json_encode( $chat);
        }
        
    }  catch (PDOException $e) {
        error_log("Fetch chat by id error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Database query failed"]);
        exit;
    }
}

function updateUserStatus($pdo, $data){
    if (!isset($data['username'], $data['receiver'])) {
        echo json_encode(["status" => null, "last_seen" => null]);
        error_log("Incoming status update payload: " . json_encode($data));
        return;
    } 
    $username = htmlspecialchars($data['username']);
    $receiver = htmlspecialchars($data['receiver']);

    try{
        // update last seen to now
        $stmt = $pdo->prepare("UPDATE `users` SET `last_seen` = NOW() WHERE `username` = :username");
        $stmt->execute(["username"=> $username ]);
        
        // fetch last seen
        $stmt = $pdo->prepare("SELECT `last_seen` FROM `users` WHERE `username` =:username");
        $stmt->execute(['username' => $receiver]);
        $lastseen = $stmt->fetchColumn();

        //compare with last seen
        $lastSeenTime = strtotime($lastseen);
        $now = time();
        $diffInseconds = $now - $lastSeenTime;

        if ($diffInseconds < 30) {
            error_log("User [$receiver] is online. Last seen: $lastseen");
            echo json_encode(["status" => "online", "last_seen" => $lastseen]);
        } else {
            error_log("User [$receiver] is offline. Last seen: $lastseen");
            echo json_encode(["status" => "offline", "last_seen" => $lastseen]);
        }

    }catch (PDOException $e) {
        error_log("Update user status error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Database query failed"]);
        exit;
    }
}