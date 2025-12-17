import { useState, useEffect } from 'react'

function AdminUsers() {
    const [users, setUsers] = useState([])

    // Charger la liste
    function chargerUsers() {
        fetch('http://localhost/GSB_Quality/api/getAllUsers.php')
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) setUsers(data)
        })
    }

    useEffect(() => {
        chargerUsers()
    }, [])

    // Fonction pour changer le rôle
    function changerRole(idUser, nouveauRole) {
        if(!window.confirm("Êtes-vous sûr de vouloir changer ce rôle ?")) return;

        fetch('http://localhost/GSB_Quality/api/updateUserRole.php', {
            method: 'POST',
            body: JSON.stringify({ id: idUser, role: nouveauRole })
        })
        .then(res => res.json())
        .then(() => {
            alert("Rôle modifié avec succès !");
            chargerUsers(); // On recharge la liste pour être sûr
        })
    }

    return (
        <div className="card large">
            <h2 style={{ color: '#8e44ad' }}> Gestion de l'équipe</h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#f4ecf7', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Nom</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Rôle Actuel</th>
                        <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>
                                {u.nom.toUpperCase()} {u.prenom}
                            </td>
                            <td style={{ padding: '10px', color: '#555' }}>{u.email}</td>
                            <td style={{ padding: '10px' }}>
                                {/* Badge de couleur selon le rôle */}
                                <span style={{ 
                                    background: u.role === 'admin' ? '#e74c3c' : '#3498db',
                                    color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem'
                                }}>
                                    {u.role.toUpperCase()}
                                </span>
                            </td>
                            <td style={{ padding: '10px' }}>
                                {/* Menu déroulant pour changer */}
                                <select 
                                    value={u.role} 
                                    onChange={(e) => changerRole(u.id, e.target.value)}
                                    style={{ padding: '5px' }}
                                >
                                    <option value="visiteur">Visiteur</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminUsers