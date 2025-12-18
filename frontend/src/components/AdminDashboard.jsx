import { useState, useEffect } from 'react'
import StatChart from './StatChart'

function AdminDashboard() {
    // DONNÉES
    const [incidents, setIncidents] = useState([])
    
    // FILTRES ET RECHERCHE
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatut, setFilterStatut] = useState("Tous")
    const [filterUrgence, setFilterUrgence] = useState("Toutes")

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5 // Nombre de lignes par page

    // TRAITEMENT
    const [incidentToTreat, setIncidentToTreat] = useState(null)
    const [statut, setStatut] = useState("")
    const [resolutionMsg, setResolutionMsg] = useState("")

    // 1. CHARGEMENT
    function chargerTout() {
        fetch('http://localhost/GSB_Quality/api/getAllIncidents.php')
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) setIncidents(data)
        })
    }

    useEffect(() => { chargerTout() }, [])

    // RESET PAGE QUAND ON FILTRE (Pour éviter d'être sur la page 5 d'une recherche vide)
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filterStatut, filterUrgence])

    // 2. LOGIQUE DE FILTRAGE
    const filteredIncidents = incidents.filter(inc => {
        // Recherche Texte (Nom du déclarant OU Médicament)
        const matchSearch = 
            inc.nomCommercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inc.prenom.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtre Statut
        const matchStatut = filterStatut === "Tous" || (inc.statut || "En attente") === filterStatut;

        // Filtre Urgence
        const matchUrgence = filterUrgence === "Toutes" || (inc.niveau_urgence || "Moyenne") === filterUrgence;

        return matchSearch && matchStatut && matchUrgence;
    })

    // 3. LOGIQUE DE PAGINATION
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentIncidents = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

    // --- FONCTIONS UTILITAIRES (Dates, Couleurs...) ---
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
            default: return { color: '#7f8c8d', border: '#bdc3c7', bg: '#f4f6f7' };
        }
    }

    // --- FONCTIONS TRAITEMENT ---
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

    // --- MODE TRAITEMENT (Reste identique) ---
    if (incidentToTreat) {
        return (
            <div className="card large" style={{ padding: '30px' }}>
                <button onClick={() => setIncidentToTreat(null)} style={{ marginBottom: '20px', background: 'transparent', color: '#7f8c8d', border: '1px solid #bdc3c7', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                     Retour
                </button>
                <h2 style={{ color: '#2980b9', marginTop: 0 }}>Traitement de l'incident #{incidentToTreat.id}</h2>
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '4px', marginBottom: '25px', borderLeft: '5px solid #3498db' }}>
                    <p><strong>Médicament :</strong> {incidentToTreat.nomCommercial}</p>
                    <p><strong>Description :</strong> {incidentToTreat.description}</p>
                </div>
                <div className="form-group">
                    <label>Statut :</label>
                    <select value={statut} onChange={(e) => setStatut(e.target.value)} style={{ padding: '12px', width: '100%', borderRadius: '4px', border: '1px solid #dfe6e9' }}>
                        <option value="En attente">En attente</option>
                        <option value="En cours">En cours d'analyse</option>
                        <option value="Résolu">Résolu / Clôturé</option>
                    </select>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>Note de résolution :</label>
                    <textarea value={resolutionMsg} onChange={(e) => setResolutionMsg(e.target.value)} rows="5" style={{ width: '100%', padding: '15px', borderRadius: '4px', border: '1px solid #dfe6e9' }}></textarea>
                </div>
                <button onClick={sauvegarderTraitement} className="btn-primary" style={{ marginTop: '20px' }}>Sauvegarder</button>
            </div>
        )
    }

    // --- MODE DASHBOARD (AVEC FILTRES ET PAGINATION) ---
    return (
        <div>
            <div className="card large" style={{ marginBottom: '30px', padding: '20px' }}>
                <StatChart />
            </div>

            <div className="card large" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#c0392b', margin: 0 }}>Administration - Incidents</h2>
                    <button onClick={chargerTout} className="btn-primary" style={{ width: 'auto', background: '#e74c3c', padding: '8px 20px', borderRadius: '30px' }}>
                        Actualiser
                    </button>
                </div>

                {/* --- BARRE D'OUTILS DE FILTRAGE --- */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder=" Rechercher (Médicament, Nom...)" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', flex: 1, minWidth: '200px' }}
                    />
                    
                    <select 
                        value={filterStatut} 
                        onChange={(e) => setFilterStatut(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                    >
                        <option value="Tous">Tout les statuts</option>
                        <option value="En attente"> En attente</option>
                        <option value="En cours"> En cours</option>
                        <option value="Résolu"> Résolu</option>
                    </select>

                    <select 
                        value={filterUrgence} 
                        onChange={(e) => setFilterUrgence(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                    >
                        <option value="Toutes">Toutes les urgences</option>
                        <option value="Critique"> Critique</option>
                        <option value="Haute"> Haute</option>
                        <option value="Moyenne"> Moyenne</option>
                        <option value="Faible"> Faible</option>
                    </select>
                </div>

                {/* --- TABLEAU --- */}
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                    <thead>
                        <tr style={{ color: '#95a5a6', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>État</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Urgence</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Médicament</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Déclarant</th>
                            <th style={{ padding: '10px', textAlign: 'left', width: '25%' }}>Problème</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentIncidents.length > 0 ? (
                            currentIncidents.map(inc => {
                                const styleUrg = getCouleurUrgence(inc.niveau_urgence);
                                const styleStatut = getCouleurStatut(inc.statut);
                                return (
                                    <tr key={inc.id} style={{ backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                                        <td style={{ padding: '20px 10px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                            <span style={{ color: styleStatut.color, backgroundColor: styleStatut.bg, border: `1px solid ${styleStatut.border}`, padding: '5px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                {inc.statut || "En attente"}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 10px' }}>
                                            <span style={{ backgroundColor: styleUrg.bg, color: styleUrg.txt, padding: '5px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                {inc.niveau_urgence || 'Moyenne'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 10px', fontWeight: '700', color: '#2c3e50' }}>{inc.nomCommercial}</td>
                                        <td style={{ padding: '20px 10px', color: '#555' }}>{inc.nom.toUpperCase()} {inc.prenom}</td>
                                        <td style={{ padding: '20px 10px', color: '#7f8c8d' }}>{inc.description.length > 40 ? inc.description.substring(0, 40) + "..." : inc.description}</td>
                                        <td style={{ padding: '20px 10px', textAlign: 'right', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                                            <button onClick={() => ouvrirTraitement(inc)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Traiter</button>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#bdc3c7' }}>Aucun résultat trouvé pour votre recherche.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* --- PAGINATION --- */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            style={{ padding: '8px 15px', background: currentPage === 1 ? '#eee' : 'white', border: '1px solid #ddd', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', borderRadius: '4px' }}
                        >
                             Précédent
                        </button>
                        
                        <span style={{ padding: '8px 15px', background: '#3498db', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                            Page {currentPage} / {totalPages}
                        </span>

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            style={{ padding: '8px 15px', background: currentPage === totalPages ? '#eee' : 'white', border: '1px solid #ddd', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', borderRadius: '4px' }}
                        >
                            Suivant 
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard