<?php
//acces bdd
$host = 'localhost';
$db_name = 'gsb_quality';
$user = 'root';
$pass = '';
//essai de connexion
try{
    //on instencie un objet pdo
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $user, $pass);
    //gestion des erreurs
    //les :: sont utiliser pour aller chercher des fonction prefaite dans la bibliotheque PDO
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
//si erreur on affiche un message
catch(PDOException $e){
    echo "erreur";
    die();
}
