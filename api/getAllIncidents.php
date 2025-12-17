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
    // On récupère tout, + le nom du médicament + le nom du visiteur
    $sql = "SELECT r.id, r.num_lot, r.description, r.date_incident, r.niveau_urgence, 
                   r.statut, r.message_resolution,
                   m.nomCommercial, 
                   v.nom, v.prenom
            FROM rapport_incident r
            INNER JOIN medicament m ON r.id_medicament = m.id
            INNER JOIN visiteur v ON r.id_visiteur = v.id
            ORDER BY FIELD(r.statut, 'En attente', 'En cours', 'Résolu'), r.date_incident DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $incidents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($incidents);

} catch(PDOException $e) {
    http_response_code(503);
    echo json_encode(["message" => "Erreur SQL : " . $e->getMessage()]);
}
?>