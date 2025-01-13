import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import Loading from './Loading'

const ManageUsers = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBooks = async () => {
        window.scrollTo(0, 0)

        try {
            const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/books`)
            setBooks(response.data)
        } catch (error) {
            console.error('Error fetching books:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBooks()
    }, [])

    return (
        <div className="min-h-screen container mx-auto p-4">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left">No.</th>
                        <th className="px-4 py-2 border-b text-left">Book ID</th>
                        <th className="px-4 py-2 border-b text-left">Title</th>
                        <th className="px-4 py-2 border-b text-left">Rating</th>
                        <th className="px-4 py-2 border-b text-left">Updated At</th>
                        <th className="px-4 py-2 border-b text-left">Action</th>
                    </tr>
                </thead>
                {loading ? (
                    <Loading />
                ) : (
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={book._id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">{book._id}</td>
                                <td className="px-4 py-2 border-b">{book.title}</td>
                                <td className="px-4 py-2 border-b">
                                    {parseFloat(book.rating.averageRating).toFixed(2)}
                                </td>
                                <td className="px-4 py-2 border-b">{book.updated_at}</td>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        onClick={() => alert('delete book')}
                                        className="bg-red-500 text-white font-medium  px-4 rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
        </div>
    )
}

export default ManageUsers
