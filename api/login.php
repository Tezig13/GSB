<?php
// 1. HEADERS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}
header("Content-Type: application/json; charset=UTF-8");

include_once 'db.php';

$json = file_get_contents("php://input");
$data = json_decode($json);

if (!empty($data->email) && !empty($data->password)) {
    
    // On cherche l'utilisateur par son EMAIL
    $sql = "SELECT * FROM visiteur WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':email' => $data->email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // VÉRIFICATION DU MOT DE PASSE CRYPTÉ
        if (password_verify($data->password, $user['mdp'])) {
            
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Connexion réussie",
                "user" => [
                    "id" => $user['id'],
                    "nom" => $user['nom'],
                    "prenom" => $user['prenom'],
                    "email" => $user['email']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Mot de passe incorrect"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Email inconnu"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes"]);
}
?>