function NavBar({ user, onLogout, onChangePage, activePage }) {
  return (
    <nav className="navbar">
      
      <div className="nav-brand">
        GSB Quality 
      </div>

      <div className="nav-links">
        <button 
            className={activePage === 'form' ? "nav-btn active" : "nav-btn"}
            onClick={() => onChangePage('form')}
        >
            Déclarer
        </button>

        <button 
            className={activePage === 'list' ? "nav-btn active" : "nav-btn"}
            onClick={() => onChangePage('list')}
        >
            Historique
        </button>
        {user.role === 'admin' && (
            <>
                <button 
                    className={activePage === 'admin_incidents' ? "nav-btn active" : "nav-btn"}
                    onClick={() => onChangePage('admin_incidents')}
                >
                    Incidents
                </button>
                
                <button 
                    className={activePage === 'admin_users' ? "nav-btn active" : "nav-btn"}
                    onClick={() => onChangePage('admin_users')}
                >
                    Équipe
                </button>
            </>
        )}
      </div>

      <div className="nav-user">
        <span style={{ color: 'white', fontWeight: '500' }}>
            {user.prenom} {user.nom}
        </span>
        <button onClick={onLogout} className="btn-logout">
            Déconnexion
        </button>
      </div>
    </nav>
  )
}

export default NavBar