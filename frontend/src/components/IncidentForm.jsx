import { useState, useEffect } from 'react'

function IncidentForm({ connectedUser, onIncidentAdded}) {
  //on cree une variaable et on peut la modifier avec setMedicaments
  //useState permet de creer des etats dans les composants
  const [medicaments, setMedicaments] = useState([])

  //useEffect permet d'executer du code une seul fois au chargement du composant pour eviter les boucles infinie
  //ici on va faire une requete vers l'api pour recuperer les medicaments
  useEffect(() => {
    //on utilise fetch pour faire une requete vers l'api
    fetch('http://localhost/GSB_Quality/api/getMedicaments.php')
    //le code contine il n attend pas donc on lui donne des consignes pour plus tard avec then
    //on transforme la reponse en json
      .then(response => response.json())
      //on recupere les donnees et on les stocke dans la variable medicaments grace a setMedicaments qui met a jour l etat
      .then(data => {
        setMedicaments(data)
      })
      .catch(error => console.error(error))
  }, [])

  //useState renvoie un tableau de 2 cases : [ValeurActuelle, FonctionPourChanger]. On dit : "Mets la case 0 dans lot et la case 1 dans setLot" pareil pour les 2 autres ligne.
  const [lot, setLot] = useState("")
  const [desc, setDesc] = useState("")
  const [selectedMed, setSelectedMed] = useState("")
  const [date, setDate] = useState("")
  const [urgence, setUrgence] = useState("Moyenne")

  //fonction qui gere l envoi du formulaire
  //e est un objet qui contient les informations sur l evenement
  function envoyerFormulaire(e){
    e.preventDefault() //empeche le rechargement de la page

    //on cree un objet js 
    const monColis = {
      num_lot: lot,
      description: desc,
      id_medicament: selectedMed,
      id_visiteur: connectedUser.id,
      date_incident: date,
      niveau_urgence: urgence
    }
    //on envoie le colis a l api
    fetch('http://localhost/GSB_Quality/api/createIncident.php', {
      method: 'POST',
      //stringify transforme un objet js en chaine de caractere pour que l api puisse le lire en json
      body: JSON.stringify(monColis)
    })
    .then(response => response.json())
    .then(retour => {
      alert(retour.message)
      setLot("")
      setDesc("")
      setSelectedMed("")
      setDate("")
      setUrgence("Moyenne")
      if (onIncidentAdded) {
          onIncidentAdded()
      }
    })
  }

  return (
    <div className="card large">
      <h2>GSB - Déclarer un incident</h2>

      <form onSubmit={envoyerFormulaire}>
        <div className="form-group">
            <label>Médicament :</label>
            <select 
                value={selectedMed} // On lie la valeur pour pouvoir la remettre à zéro après envoi
                onChange={(e) => setSelectedMed(e.target.value)} 
                required
            >
            {/*e est l evenement, e.target est la cible qui a declenche l evenement donc le menu deroulant, e.target.value est la valeur de cet element */}
            <option value="">-- Choisir --</option>
            {/* .map pour parcourir le tableau medicaments et afficher chaque medicament dans une option*/}
            {medicaments.map(med => (
                <option key={med.id} value={med.id}>{med.nomCommercial}</option>
            ))}
            </select>
        </div>
        <div className="form-group">
            <label>Gravité de l'incident :</label>
            <select 
                value={urgence} 
                onChange={(e) => setUrgence(e.target.value)}
                style={{ fontWeight: 'bold' }} // Petit style en plus
            >
                <option value="Faible"> Faible (Information)</option>
                <option value="Moyenne"> Moyenne (À surveiller)</option>
                <option value="Haute"> Haute (Urgent)</option>
                <option value="Critique"> Critique (Danger immédiat)</option>
            </select>
        </div>
        <div className="form-group">
            <label>Date de l'incident:</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
        </div>

        {/* Champ Lot */}
        <div className="form-group">
            <label>Lot :</label>
            <input 
                type="text" 
                value={lot} 
                onChange={(e) => setLot(e.target.value)} 
                required
                placeholder="Ex : AB-12345"
            />
        </div>

        {/* Champ Description */}
        <div className="form-group">
            <label>Description :</label>
            <textarea 
                value={desc} 
                onChange={(e) => setDesc(e.target.value)}
                required
                placeholder="Décrivez le problème..."
            ></textarea>
        </div>
        <button type="submit" className="btn-primary">Envoyer</button>
      </form>
    </div>
  )
} 

export default IncidentForm