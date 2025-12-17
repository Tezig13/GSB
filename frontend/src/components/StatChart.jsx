import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function StatChart() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    })

    useEffect(() => {
        fetch('http://localhost/GSB_Quality/api/getStats.php')
        .then(res => res.json())
        .then(data => {
            const nomsMedicaments = data.map(item => item.nomCommercial)
            const nombresIncidents = data.map(item => item.total)

            setChartData({
                labels: nomsMedicaments,
                datasets: [
                    {
                        label: 'Incidents',
                        data: nombresIncidents,
                        backgroundColor: 'rgba(52, 152, 219, 0.2)', // Fond bleu très clair
                        borderColor: '#3498db',                      // Bordure bleu solide
                        borderWidth: 2,                              // Bordure un peu plus épaisse
                        borderRadius: 8,                             // Coins arrondis (Top)
                        borderSkipped: false,                        // Arrondir tous les coins
                        barThickness: 40,                            // Largeur fixe (plus élégant)
                        maxBarThickness: 50,                         // Maximum si écran large
                        hoverBackgroundColor: '#2980b9',             // Devient foncé au survol
                        hoverBorderColor: '#2980b9',
                    },
                ],
            })
        })
        .catch(err => console.error(err))
    }, [])

    // --- OPTIONS AVANCÉES POUR LE LOOK ---
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Permet de remplir le conteneur CSS
        plugins: {
            legend: {
                display: false, // On cache la légende "Incidents" (redondant avec le titre)
            },
            title: {
                display: true,
                text: 'Médicaments signalés',
                font: { size: 18, family: "'Segoe UI', sans-serif", weight: '600' },
                color: '#2c3e50',
                padding: { bottom: 20 }
            },
            tooltip: {
                backgroundColor: 'rgba(44, 62, 80, 0.9)', // Tooltip sombre pro
                padding: 12,
                cornerRadius: 8,
                displayColors: false, // Enlève le petit carré de couleur dans le tooltip
            }
        },
        scales: {
            x: {
                grid: {
                    display: false, // Pas de lignes verticales (plus propre)
                    drawBorder: false,
                },
                ticks: {
                    font: { size: 12 },
                    color: '#7f8c8d'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f0f0', // Lignes horizontales très légères
                    borderDash: [5, 5], // Lignes en pointillés
                },
                ticks: {
                    stepSize: 1, // Pas de virgules (on compte des incidents entiers)
                    color: '#bdc3c7'
                },
                border: {
                    display: false // Enlève la ligne de l'axe Y à gauche
                }
            },
        },
        layout: {
            padding: 10
        }
    }

    return (
        // On contrôle la hauteur ici pour que ce soit moins "écrasé"
        <div style={{ padding: '20px', height: '350px', width: '100%', position: 'relative' }}>
            {chartData.labels.length > 0 ? (
                <Bar options={options} data={chartData} />
            ) : (
                <p style={{ textAlign: 'center', color: '#bdc3c7' }}>Chargement des données...</p>
            )}
        </div>
    )
}

export default StatChart