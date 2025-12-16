<?php
//les headers pour l'API
//c'est comme une etiquette d'un colis
//on autorise l'acces a notre API depuis n'importe quelle origine
header("Access-Control-Allow-Origin: *");
//on previens le navigateur que l'on envoie du json
header("Content-Type: application/json; charset=UTF-8");

include_once 'db.php';
try{
    //on ecrit la requete sql, on la prepare et on l'execute
    $sql = "SELECT * FROM medicament";
    $commande = $pdo->prepare($sql);
    $commande->execute();

    //on recupere les resultats et on les stocke dans un tableau associatif
    $resultat = $commande->fetchAll(PDO::FETCH_ASSOC);
    //on encode en json et on envoie
    echo json_encode($resultat);

} catch(PDOException $e) {
    echo json_encode(["message" => "Erreur : " . $e->getMessage()]);
}
?>