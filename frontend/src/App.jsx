import { useState } from 'react'
import RegisterForm from './components/RegisterForm'
import IncidentForm from './components/IncidentForm'
import LoginForm from './components/LoginForm'
import NavBar from './components/NavBar'
import IncidentList from './components/IncidentList'
import AdminDashboard from './components/AdminDashboard'
import AdminUsers from './components/AdminUsers'
import './App.css'

function App() {
  // 1. L'ÉTAT DE CONNEXION
  const [user, setUser] = useState(() => {
    // On regarde si on a une sauvegarde 'gsb_user' dans le navigateur
    const savedUser = localStorage.getItem('gsb_user')
    // Si oui, on transforme le texte en objet (JSON.parse)
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [showLogin, setShowLogin] = useState(true)

  // Pour gérer la navigation ('form' ou 'list') ---
  const [currentPage, setCurrentPage] = useState('form')
  
  // Fonction pour se connecter et sauvegarder
  const gererConnexion = (infosUser) => {
    setUser(infosUser) // Mise à jour de React
    localStorage.setItem('gsb_user', JSON.stringify(infosUser)) // Mise à jour du navigateur
  }

  // Fonction pour se déconnecter et nettoyer
  const gererDeconnexion = () => {
    setUser(null)
    localStorage.removeItem('gsb_user') // On vide la mémoire
    setCurrentPage('form') // On remet la page par défaut
  }

  // 2. LE VIDEUR (Rendu Conditionnel)
  // Si on n'a pas d'utilisateur, on affiche UNIQUEMENT l'inscription
  if (user === null) {
    return (
      <div className="app-container">
        
        <h1 style={{ marginBottom: '20px' }}>GSB Quality</h1>
        
        {showLogin ? (
            // OUI -> Affiche LoginForm
            // MODIF : On utilise gererConnexion au lieu de setUser direct
            <LoginForm onConnexionReussie={gererConnexion} />
        ) : (
            // NON -> Affiche RegisterForm
            // MODIF : On utilise gererConnexion au lieu de setUser direct
            <RegisterForm onConnexionReussie={gererConnexion} />
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
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <NavBar 
        user={user} 
        onLogout={gererDeconnexion} // MODIF : La fonction qui nettoie tout
        onChangePage={(page) => setCurrentPage(page)} // La fonction pour changer de page
        activePage={currentPage} // Pour savoir quel bouton allumer
      />

      <div className="app-container">
        {currentPage === 'form' && (
            <IncidentForm 
                connectedUser={user} 
                onIncidentAdded={() => setCurrentPage('list')} 
            />
        )}
        
        {currentPage === 'list' && (
            <IncidentList connectedUser={user} />
        )}
        {currentPage === 'admin_incidents' && user.role === 'admin' && (
            <AdminDashboard />
        )}
        {currentPage === 'admin_users' && user.role === 'admin' && (
            <AdminUsers />
        )}
      </div>
    </div>
  )
}

export default App