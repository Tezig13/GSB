import { useState } from 'react'
import RegisterForm from './components/RegisterForm'
import IncidentForm from './components/IncidentForm'
import LoginForm from './components/LoginForm'
import './App.css'

function App() {
  // 1. L'ÉTAT DE CONNEXION
  // Au début, user est null (personne n'est connecté)
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(true)

  // 2. LE VIDEUR (Rendu Conditionnel)
  // Si on n'a pas d'utilisateur, on affiche UNIQUEMENT l'inscription
  if (user === null) {
    return (
      <div className="app-container">
        
        <h1 style={{ marginBottom: '20px' }}>GSB Quality</h1>
        
        {showLogin ? (
            // OUI -> Affiche LoginForm
            <LoginForm onConnexionReussie={(infosUser) => setUser(infosUser)} />
        ) : (
            // NON -> Affiche RegisterForm
            <RegisterForm onConnexionReussie={(infosUser) => setUser(infosUser)} />
        )}
        <div className="switch-link">
          {showLogin ? "Pas encore de compte ? " : "Déjà inscrit ? "}
          
          <button 
            onClick={() => setShowLogin(!showLogin)} 
          >
            {showLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </div>

      </div>
    )
  }

  // 3. L'ACCÈS AUTORISÉ
  // Si on arrive ici c'est que user n'est pas null. On affiche l'appli.
  return (
    
    <div className="app-container">
      <div className="header-bar">
        <h2 style={{ marginBottom: 0 }}>Bonjour, {user.prenom} !</h2>
        <button 
          onClick={() => setUser(null)} // Bouton Déconnexion
          className="btn-danger" 
        >
          Se déconnecter
        </button>
      </div>

      <IncidentForm connectedUser={user} />

    </div>
  )
}

export default App