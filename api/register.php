<?php
// 1. HEADERS (Toujours pareil)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
//on demande au navigateur si il peut envoyer des requetes en envoyant une requete vide (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}
header("Content-Type: application/json; charset=UTF-8");

include_once 'db.php';

// 2. RÉCUPÉRATION
// On récupère les données envoyées par React qui sont des objet javascript brut 
$json = file_get_contents("php://input");
// On décode le JSON pour en faire un objet PHP
$data = json_decode($json);

// 3. verification 
if (
    !empty($data->nom) && 
    !empty($data->prenom) && 
    !empty($data->email) && 
    !empty($data->password)
) {
    // PASSWORD_DEFAULT utilise l'algo (Bcrypt)
    $password_hash = password_hash($data->password, PASSWORD_DEFAULT);

    // 4. INSERTION en bdd
    // Pour l'ID, on génère un ID aléatoire court unique
    $newId = uniqid('v'); 
    
    try {
        $sql = "INSERT INTO visiteur (id, nom, prenom, email, mdp) 
                VALUES (:id, :nom, :prenom, :email, :mdp)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $newId,
            ':nom' => $data->nom,
            ':prenom' => $data->prenom,
            ':email' => $data->email,
            ':mdp' => $password_hash // On envoie le crypté, jamais le clair 
        ]);

        http_response_code(201);
        echo json_encode(["message" => "Utilisateur créé avec succès !"]);

    } catch(PDOException $e) {
        // Erreur souvent si l email existe déjà
        http_response_code(503);
        echo json_encode(["message" => "Erreur : " . $e->getMessage()]);
    }

} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes (Nom, Prénom, Login ou MDP manquant)"]);
}
?>