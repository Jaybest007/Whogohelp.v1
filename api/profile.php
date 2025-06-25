<?php 
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

include "db_connect.php";

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit;
}

if(!isset($_SESSION['USER'])){
    http_response_code(401);
    echo json_encode(['error'=> 'Login required']);
    exit;
}

if (empty($_POST)) {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data && isset($data['action'])) {
        $_POST['action'] = $data['action'];
        if (isset($data['about'])) $_POST['about'] = $data['about'];
        if (isset($data['phone'])) $_POST['phone'] = $data['phone'];
        if (isset($data['location'])) $_POST['location'] = $data['location'];
        if (isset($data['username'])) $_POST['username'] = $data['username'];
    }
}


$action = $_POST['action'] ?? '';


switch($action){
    case 'edit_profile':
        updateProfile($pdo);
        break;

    case 'fetchUserData':
        fetchUserData($pdo);
        break;
    
    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid action"]); 
}

function fetchUserData($pdo){
    $username = $_POST['username'] ?? "";
    try{
        $sql = "SELECT `full_name`, `username`, `email`, `phone`, `location`, `about` FROM `users` WHERE `username` = :username ";
        $sql2 = "SELECT * FROM `errands` WHERE (posted_by = :posted_by OR accepted_by = :accepted_by) ORDER BY `date` DESC, `time` DESC";
        $stmt = $pdo->prepare($sql);
        $stmt2 = $pdo->prepare($sql2);
        $stmt->execute(['username' => $username]);
        $stmt2->execute(['posted_by' => $username , 'accepted_by' => $username]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $userErrand = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        if ($user ){
            http_response_code(200);
            echo json_encode([
                'user' => $user,
                'errands' => $userErrand
            ]);
            exit;
        } else{
            http_response_code(200);
            echo json_encode([
                'user' => null,
                'errands' => []
            ]);
            exit;
        }
    } catch (PDOException $e) {
        error_log("Fetch user data error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => ["server" => "Database error occurred."]]);
    }
}

//update user about
function updateProfile($pdo){
    $about = htmlspecialchars(trim($_POST['about'] ?? ''));
    $email = $_SESSION['USER']['email'];
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ""));
    $location = htmlspecialchars(trim($_POST["location"] ??""));
    
    try{
        $sql = "UPDATE `users` SET `phone`=:phone, `location`=:location, `about`=:about WHERE `email` = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'phone' => $phone,
            'location' => $location,
            'about' => $about, 
            'email' => $email,
        ]);

        if($stmt->rowCount() > 0){
            http_response_code(200);
            echo json_encode(['message'=> 'Edit successfully']);
            $_SESSION['USER']['location'] = $location;
            $_SESSION['USER']['email'] = $email;
        } else {
            http_response_code(200);
            echo json_encode(['message'=> 'No changes made']);
        }
    }catch (PDOException $e) {
        error_log("Update profile error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => ["server" => "Database error occurred."]]);
    }
}
