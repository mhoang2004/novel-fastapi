import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import axios from 'axios'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

// Register Chart.js elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const NovelStats = () => {
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/novel-stats`)
                setStats(response.data)
            } catch (err) {
                console.log(err)
                setError('Failed to fetch novel statistics')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    const labels = stats.map((item) => item.date) // Assuming 'date' field in the stats
    const data = stats.map((item) => item.count) // Assuming 'count' field in the stats

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Novels per Day',
                data,
                backgroundColor: 'rgba(209, 30, 42, 0.2)', // Line color fill
                borderColor: 'rgb(221, 41, 62)', // Line color
                borderWidth: 2,
                fill: true, // Fill the area under the line
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
        <div className="mt-4">
            <h2 className="font-bold my-4">Novel Statistics</h2>
            <Line data={chartData} options={options} />
        </div>
    )
}

export default NovelStats
