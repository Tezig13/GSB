import { useState, useEffect } from 'react'

function IncidentList({ connectedUser }) {
    const [incidents, setIncidents] = useState([])

    function chargerIncidents() {
        if (!connectedUser || !connectedUser.id) return;
        const dataToSend = { id_visiteur: connectedUser.id }

        fetch('http://localhost/GSB_Quality/api/getMyIncidents.php', {
            method: 'POST',
            body: JSON.stringify(dataToSend)
        })
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) setIncidents(data)
        })
        .catch(err => console.error(err))
    }

    useEffect(() => { chargerIncidents() }, [connectedUser])

    function formaterDate(dateSQL) {
        if (!dateSQL) return "-";
        return new Date(dateSQL).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }

    function getCouleurUrgence(niveau) {
        switch(niveau) {
            case 'Critique': return { bg: '#c0392b', txt: 'white' };
            case 'Haute':    return { bg: '#e74c3c', txt: 'white' };
            case 'Moyenne':  return { bg: '#f39c12', txt: 'white' };
            default:         return { bg: '#27ae60', txt: 'white' };
        }
    }

    // NOUVEAU : Fonction pour la couleur du statut
    function getCouleurStatut(statut) {
        // Si le statut est vide ou null, on met "En attente" par défaut
        const s = statut || "En attente";
        switch(s) {
            case 'Résolu': return { color: '#27ae60', border: '#27ae60', bg: '#eafaf1' };
            case 'En cours': return { color: '#d35400', border: '#d35400', bg: '#fdf2e9' };
            default: return { color: '#7f8c8d', border: '#bdc3c7', bg: '#f4f6f7' };
        }
    }

    return (
        <div className="card large" style={{ padding: '30px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#2c3e50', margin: 0 }}>
                    Suivi de mes déclarations d'incidents
                </h2>
                <button 
                    onClick={chargerIncidents} 
                    className="btn-primary" 
                    style={{ width: 'auto', padding: '10px 20px', borderRadius: '30px' }}
                >
                    Actualiser 
                </button>
            </div>

            {incidents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#bdc3c7' }}>
                    <p style={{ fontSize: '1.2rem' }}>Aucun incident déclaré pour le moment.</p>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                    <thead>
                        <tr style={{ color: '#95a5a6', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>État</th> {/* NOUVEAU */}
                            <th style={{ padding: '10px', textAlign: 'left' }}>Médicament</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Votre Description</th>
                            <th style={{ padding: '10px', textAlign: 'left', width: '30%' }}>Réponse Responsable Qualité</th> {/* NOUVEAU */}
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map(inc => {
                            const styleUrg = getCouleurUrgence(inc.niveau_urgence);
                            const styleStatut = getCouleurStatut(inc.statut);
                            
                            return (
                                <tr key={inc.id} style={{ backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                                    
                                    {/* DATE */}
                                    <td style={{ padding: '20px 10px', color: '#7f8c8d', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                        {formaterDate(inc.date_incident)}
                                    </td>
                                    
                                    {/* STATUT (Badge) */}
                                    <td style={{ padding: '20px 10px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                                            {/* Badge Statut */}
                                            <span style={{ 
                                                color: styleStatut.color, 
                                                backgroundColor: styleStatut.bg,
                                                border: `1px solid ${styleStatut.border}`, 
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' 
                                            }}>
                                                {inc.statut || "En attente"}
                                            </span>
                                            {/* Badge Urgence (plus discret) */}
                                            <span style={{ fontSize: '0.7rem', color: styleUrg.bg, fontWeight: 'bold' }}>
                                                {inc.niveau_urgence}
                                            </span>
                                        </div>
                                    </td>

                                    {/* MÉDICAMENT & LOT */}
                                    <td style={{ padding: '20px 10px' }}>
                                        <div style={{ fontWeight: '700', color: '#2c3e50', fontSize: '1rem' }}>
                                            {inc.nomCommercial}
                                        </div>
                                        <div style={{ fontFamily: 'monospace', color: '#e67e22', fontSize: '0.9rem', marginTop: '4px' }}>
                                            Lot: {inc.num_lot}
                                        </div>
                                    </td>

                                    {/* DESCRIPTION UTILISATEUR */}
                                    <td style={{ padding: '20px 10px', color: '#555', lineHeight: '1.5', fontSize: '0.95rem' }}>
                                        {inc.description}
                                    </td>

                                    {/* RÉPONSE ADMIN (Surlignée) */}
                                    <td style={{ padding: '20px 10px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                                        {inc.message_resolution ? (
                                            <div style={{ background: '#f0f8ff', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #3498db', color: '#2c3e50', fontSize: '0.9rem' }}>
                                                <strong>Responsable Qualité :</strong> {inc.message_resolution}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#bdc3c7', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                                En attente de traitement...
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default IncidentList