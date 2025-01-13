import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import Loading from './Loading'

const ManageUsers = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(0)

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

    const handleReject = async (index) => {
        await axiosInstance.delete(`${import.meta.env.VITE_API_URL}/novel/${books[index]._id}`)

        setIsModalOpen(0)
        fetchBooks()
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
                                        onClick={() => setIsModalOpen(index)}
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

            {/* Modal */}
            {isModalOpen !== 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to delete this book?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(0)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(isModalOpen)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageUsers
