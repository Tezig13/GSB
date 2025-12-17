import { useState } from 'react'

function LoginForm({ onConnexionReussie }) {
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleLogin(e) {
        e.preventDefault()

        const identifiants = {
            email: email,
            password: password
        }

        fetch('http://localhost/GSB_Quality/api/login.php', {
            method: 'POST',
            body: JSON.stringify(identifiants)
        })
        .then(response => {
            if (response.ok) {
                return response.json().then(data => {
                    // C'est ici qu'on récupère les infos de l'utilisateur connecté
                    onConnexionReussie(data.user) 
                })
            } else {
                return response.json().then(data => {
                    alert("Erreur : " + data.message)
                })
            }
        })
        .catch(error => console.error("Erreur réseau", error))
    }

    return (
        <div className="card">
            <h2>Connexion GSB</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email professionnel</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="exemple@gsb.fr"
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn-primary">SE CONNECTER</button>
            </form>
        </div>
    )
}
export default LoginForm