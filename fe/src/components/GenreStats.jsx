import { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const GenreStats = () => {
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/genre-stats`)
                setStats(response.data)
            } catch (err) {
                console.log(err)
                setError('Failed to fetch genre statistics')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    const labels = stats.map((item) => item.genre.name)
    const data = stats.map((item) => item.count)

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Books per Genre',
                data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    }

    return (
        <div>
            <h2 className="font-bold my-4">Genre Statistics</h2>
            <Bar data={chartData} options={options} />
        </div>
    )
}

export default GenreStats
