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
            password: password
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
                    
                    // On construit l'objet utilisateur
                    const userData = { nom: nom, prenom: prenom, email: email }
                    
                    // ON OUVRE LA PORTE (Appelle la fonction du parent)
                    onConnexionReussie(userData) 
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