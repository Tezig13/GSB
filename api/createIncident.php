<?php
//on autorise react a nous parler 
header("Access-Control-Allow-Origin: *");
//on previens le navigateur que'on envoie du json
header("Content-Type: application/json; charset=UTF-8");
// On autorise les méthodes POST (pour envoyer) et OPTIONS (pour la vérification navigateur)
header("Access-Control-Allow-Methods: POST, OPTIONS");
// On autorise les entêtes spécifiques (vital pour React)
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 2. GESTION DU "PREFLIGHT" (Le Toc-Toc du navigateur)
// Avant d'envoyer les données, le navigateur demande "Est-ce que je peux ?" via la méthode OPTIONS.
// On doit lui répondre "OUI" tout de suite et arrêter le script ici.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'db.php';

//on recupere les donnees envoyees par react
//on les lit grace a file_get_contents
$json = file_get_contents('php://input');

//la fonction json_decode permet de transformer le json en objet php
$data = json_decode($json);

//on verifie que les data ne sont pas vides
if (
    !empty($data->num_lot) && 
    !empty($data->description) && 
    !empty($data->id_medicament) && 
    !empty($data->id_visiteur) &&
    !empty($data->date_incident) &&
    !empty($data->niveau_urgence) 
){
    try{
        //requete sql pour inserer un incident en bdd
        //on utilise des marqueurs nominatifs pour eviter les injections sql
        $sql = "INSERT INTO rapport_incident (num_lot, description, id_medicament, id_visiteur, date_incident, niveau_urgence) VALUES (:lot, :desc, :med, :visi, :date, :urgence)";
        $commande = $pdo->prepare($sql);
        //on execute la requete en passant un tableau associatif avec les valeurs a inserer
        //donc PDO va prendre la valeur, la nettoyer (mettre des guillemets, echapper les caracteres speciaux, etc) et l'inserer a la place du marqueur
        $commande->execute([
            ':lot' => $data->num_lot,
            ':desc' => $data->description,
            ':med' => $data->id_medicament,
            ':visi' => $data->id_visiteur,
            ':date' => $data->date_incident,
            ':urgence' => $data->niveau_urgence
        ]);
        //on envoie un message de succes
        http_response_code(201); //201=cree avec succes
        //petit tableau php qu on transforme en json pour que react puisse le lire
        echo json_encode(["message" => "Incident enregistrer"]);
    } catch(PDOException $e) {
        //si erreur on envoie un message d'erreur
        http_response_code(503); //503=erreur serveur
        echo json_encode(["message" => "Erreur sql : " . $e->getMessage()]);
    }
} else {
    //si react envoi n importe quoi
    http_response_code(400); //400=requete incorrect
    echo json_encode(["message" => "Donnees incomplètes"]);
}
