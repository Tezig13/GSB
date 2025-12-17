<?php
// Headers habituels...
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

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->role)) {
    try {
        // La mise à jour
        $sql = "UPDATE visiteur SET role = :role WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':role' => $data->role,
            ':id'   => $data->id
        ]);

        echo json_encode(["message" => "Rôle mis à jour !"]);

    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(["message" => "Erreur SQL : " . $e->getMessage()]);
    }
}
?>