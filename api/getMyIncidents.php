<?php
// 1. AUTORISATIONS (CORS)
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

// 2. RÉCUPÉRATION DES DONNÉES ENVOYÉES PAR REACT
$json = file_get_contents("php://input");
$data = json_decode($json);

if (!empty($data->id_visiteur)) {
    try {
        // 3. LA REQUÊTE SQL (Avec la date et le nom du médicament)
        $sql = "SELECT r.id, r.num_lot, r.description, r.date_incident, r.niveau_urgence, m.nomCommercial, r.statut, r.message_resolution
                FROM rapport_incident r
                INNER JOIN medicament m ON r.id_medicament = m.id
                WHERE r.id_visiteur = :id
                ORDER BY r.date_incident DESC"; // On trie par date (le plus récent en haut)

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $data->id_visiteur]);
        
        $incidents = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 4. ON RENVOIE LE RÉSULTAT EN JSON
        echo json_encode($incidents);

    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(["message" => "Erreur SQL : " . $e->getMessage()]);
    }
} else {
    echo json_encode([]); // Si pas d'ID, liste vide
}
?>