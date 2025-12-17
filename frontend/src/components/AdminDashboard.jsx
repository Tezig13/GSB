import { useState, useEffect } from 'react'
import StatChart from './StatChart'

function AdminDashboard() {
    const [incidents, setIncidents] = useState([])
    const [incidentToTreat, setIncidentToTreat] = useState(null)
    const [statut, setStatut] = useState("")
    const [resolutionMsg, setResolutionMsg] = useState("")

    function chargerTout() {
        fetch('http://localhost/GSB_Quality/api/getAllIncidents.php')
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) setIncidents(data)
        })
    }

    useEffect(() => { chargerTout() }, [])

    function ouvrirTraitement(incident) {
        setIncidentToTreat(incident)
        setStatut(incident.statut || "En attente")
        setResolutionMsg(incident.message_resolution || "")
    }

    function sauvegarderTraitement() {
        fetch('http://localhost/GSB_Quality/api/resolveIncident.php', {
            method: 'POST',
            body: JSON.stringify({
                id: incidentToTreat.id,
                statut: statut,
                message_resolution: resolutionMsg
            })
        })
        .then(res => res.json())
        .then(() => {
            alert("Traitement enregistré !")
            setIncidentToTreat(null)
            chargerTout()
        })
    }

    function formaterDate(dateSQL) { 
        if (!dateSQL) return "-";
        return new Date(dateSQL).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    
    function getCouleurUrgence(niveau) {
        switch(niveau) {
            case 'Critique': return { bg: '#c0392b', txt: 'white' };
            case 'Haute':    return { bg: '#e74c3c', txt: 'white' };
            case 'Moyenne':  return { bg: '#f39c12', txt: 'white' };
            default:         return { bg: '#27ae60', txt: 'white' };
        }
    }

    function getCouleurStatut(statut) {
        switch(statut) {
            case 'Résolu': return { color: '#27ae60', border: '#27ae60', bg: '#eafaf1' };
            case 'En cours': return { color: '#d35400', border: '#d35400', bg: '#fdf2e9' };
            default: return { color: '#7f8c8d', border: '#bdc3c7', bg: '#f4f6f7' }; // En attente
        }
    }

    // --- MODE TRAITEMENT ---
    if (incidentToTreat) {
        return (
            <div className="card large" style={{ padding: '30px' }}>
                <button onClick={() => setIncidentToTreat(null)} style={{ marginBottom: '20px', background: 'transparent', color: '#7f8c8d', border: '1px solid #bdc3c7', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Retour
                </button>
                
                <h2 style={{ color: '#2980b9', marginTop: 0 }}>Traitement de l'incident #{incidentToTreat.id}</h2>
                
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '4px', marginBottom: '25px', borderLeft: '5px solid #3498db' }}>
                    <p style={{ margin: '5px 0' }}><strong>Médicament :</strong> {incidentToTreat.nomCommercial}</p>
                    <p style={{ margin: '5px 0' }}><strong>Problème :</strong> {incidentToTreat.description}</p>
                    <p style={{ margin: '5px 0' }}><strong>Déclaré par :</strong> {incidentToTreat.nom} {incidentToTreat.prenom}</p>
                </div>

                <div className="form-group">
                    <label>Changer le statut :</label>
                    <select value={statut} onChange={(e) => setStatut(e.target.value)} style={{ padding: '12px', width: '100%', borderRadius: '4px', border: '1px solid #dfe6e9', fontSize: '1rem' }}>
                        <option value="En attente">En attente</option>
                        <option value="En cours">En cours d'analyse</option>
                        <option value="Résolu">Résolu / Clôturé</option>
                    </select>
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>Note de résolution :</label>
                    <textarea 
                        value={resolutionMsg} 
                        onChange={(e) => setResolutionMsg(e.target.value)}
                        rows="5"
                        placeholder="Ex: Le lot a été vérifié, rappel effectué..."
                        style={{ width: '100%', padding: '15px', borderRadius: '4px', border: '1px solid #dfe6e9', fontSize: '1rem', fontFamily: 'sans-serif' }}
                    ></textarea>
                </div>

                <button onClick={sauvegarderTraitement} className="btn-primary" style={{ marginTop: '20px', padding: '12px 25px', fontSize: '1rem' }}>
                    Sauvegarder
                </button>
            </div>
        )
    }

    // --- MODE TABLEAU DE BORD ---
    return (
        <div>
            <div className="card large" style={{ marginBottom: '30px', padding: '20px' }}>
                <StatChart />
            </div>

            <div className="card large" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#c0392b', margin: 0 }}>Administration - Incidents à traiter</h2>
                    <button onClick={chargerTout} className="btn-primary" style={{ width: 'auto', background: '#e74c3c', padding: '10px 20px', borderRadius: '30px' }}>
                        Rafraîchir
                    </button>
                </div>

                {/* Tableau aéré avec espacement */}
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                    <thead>
                        <tr style={{ color: '#95a5a6', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>État</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Urgence</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Médicament</th>
                            <th style={{ padding: '10px', textAlign: 'left', width: '30%' }}>Problème</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map(inc => {
                            const styleUrg = getCouleurUrgence(inc.niveau_urgence);
                            const styleStatut = getCouleurStatut(inc.statut);
                            
                            return (
                                <tr key={inc.id} style={{ backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                                    
                                    {/* STATUT */}
                                    <td style={{ padding: '20px 10px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                        <span style={{ 
                                            color: styleStatut.color, 
                                            backgroundColor: styleStatut.bg,
                                            border: `1px solid ${styleStatut.border}`, 
                                            padding: '5px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' 
                                        }}>
                                            {inc.statut}
                                        </span>
                                    </td>

                                    {/* URGENCE */}
                                    <td style={{ padding: '20px 10px' }}>
                                        <span style={{ 
                                            backgroundColor: styleUrg.bg, 
                                            color: styleUrg.txt, 
                                            padding: '5px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' 
                                        }}>
                                            {inc.niveau_urgence || 'Moyenne'}
                                        </span>
                                    </td>

                                    {/* MEDICAMENT */}
                                    <td style={{ padding: '20px 10px', fontWeight: '700', color: '#2c3e50', fontSize: '1.05rem' }}>
                                        {inc.nomCommercial}
                                    </td>

                                    {/* DESCRIPTION */}
                                    <td style={{ padding: '20px 10px', color: '#7f8c8d', lineHeight: '1.5' }}>
                                        {inc.description.length > 60 ? inc.description.substring(0, 60) + "..." : inc.description}
                                    </td>
                                    
                                    {/* BOUTON ACTION */}
                                    <td style={{ padding: '20px 10px', textAlign: 'right', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                                        <button 
                                            onClick={() => ouvrirTraitement(inc)}
                                            style={{ 
                                                background: '#3498db', color: 'white', border: 'none', 
                                                padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600',
                                                boxShadow: '0 2px 5px rgba(52, 152, 219, 0.3)', transition: '0.2s'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = '#2980b9'}
                                            onMouseOut={(e) => e.target.style.background = '#3498db'}
                                        >
                                            Traiter
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminDashboard