<?php
// Headers habituels
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

try {
    // On récupère tout le monde, trié par nom
    $sql = "SELECT id, nom, prenom, email, role FROM visiteur ORDER BY nom ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch(PDOException $e) {
    http_response_code(503);
    echo json_encode(["message" => "Erreur SQL : " . $e->getMessage()]);
}
?>