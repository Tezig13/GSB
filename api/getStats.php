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
    // REQUÊTE INTELLIGENTE :
    // On compte le nombre d'incidents (COUNT) pour chaque médicament
    // et on groupe les résultats par le nom du médicament.
    $sql = "SELECT m.nomCommercial, COUNT(r.id) as total 
            FROM rapport_incident r
            INNER JOIN medicament m ON r.id_medicament = m.id
            GROUP BY m.nomCommercial
            ORDER BY total DESC"; // Les plus problématiques en premier

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch(PDOException $e) {
    http_response_code(503);
    echo json_encode(["message" => "Erreur SQL : " . $e->getMessage()]);
}
?>