import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

import Loading from './Loading'

const History = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axiosInstance.get('history')
                setBooks(response.data)
            } catch (error) {
                console.error('Error fetching books:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [])

    if (!loading && books.length === 0) {
        return (
            <div className="min-h-screen text-center ">
                <p className="mt-5">You did not upload any book!</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-center text-2xl font-bold mb-5 p-2">HISTORY</h1>

                {loading ? (
                    <Loading />
                ) : (
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b text-left">No.</th>
                                <th className="px-4 py-2 border-b text-left">Book Name</th>
                                <th className="px-4 py-2 border-b text-left">Date</th>
                                <th className="px-4 py-2 border-b text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((item, index) => (
                                <tr key={item._id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border-b">{index + 1}</td>
                                    <td className="px-4 py-2 border-b">{item.title}</td>
                                    <td className="px-4 py-2 border-b">{item.updated_at}</td>
                                    <td className="px-4 py-2 border-b">
                                        {!item.is_approved ? (
                                            <span className="text-yellow-500">Pending...</span>
                                        ) : item.is_valid ? (
                                            <span className="text-green-500">Accepted</span>
                                        ) : (
                                            <span className="text-red-500">Rejected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default History
