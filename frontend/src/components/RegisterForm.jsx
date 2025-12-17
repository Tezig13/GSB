import { useState } from 'react'

function RegisterForm({ onConnexionReussie }) {
    // 1. LES VARIABLES D'ÉTAT (Ce que l'utilisateur tape)
    const [nom, setNom] = useState("")
    const [prenom, setPrenom] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // 2. LA FONCTION D'ENVOI
    function handleInscription(e) {
        e.preventDefault()

        const nouvelUtilisateur = {
            nom: nom,
            prenom: prenom,
            email: email,
            mdp: password // <-- MODIF 1 : PHP attend "mdp", pas "password"
        }

        fetch('http://localhost/GSB_Quality/api/register.php', {
            method: 'POST',
            body: JSON.stringify(nouvelUtilisateur)
        })
        .then(response => {

            // On regarde le Status Code
            // response.ok est VRAI si le code est 200 ou 201 (Succès)
            if (response.ok) {
                return response.json().then(data => {
                    alert("Compte créé ! Bienvenue.")
                    // Au lieu de recréer l'objet à la main (qui n'a pas d'ID),
                    // on utilise celui renvoyé par le PHP (qui contient l'ID généré)
                    if (data.user) {
                        onConnexionReussie(data.user) 
                    }
                })
            } else {
                // Si le serveur répond une erreur (400, 503...)
                return response.json().then(data => {
                    alert("Erreur : " + data.message)
                })
            }
        })
        .catch(error => console.error("Erreur réseau :", error))
    }

    // 3. LE HTML DU FORMULAIRE
    return (
        <div className="card">
            <h2>Création de compte</h2>
            <form onSubmit={handleInscription}>
                <div className="form-group">
                    <label>Nom</label>
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Prénom</label>
                    <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Mot de passe</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn-success">S'INSCRIRE</button>
            </form>
        </div>
    )
}
export default RegisterForm