import { useState, useEffect } from 'react'

import axiosInstance from '../api/axiosInstance'

import Loading from './Loading'
import AdminViewBook from './AdminViewBook'

const PendingBook = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(-1)

    const fetchBooks = async () => {
        window.scrollTo(0, 0)

        try {
            const response = await axiosInstance.get(
                `${import.meta.env.VITE_API_URL}/pending_books`
            )
            console.log(response.data)
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

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleReject = async () => {
        setLoading(true)

        const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/reject-book`, {
            book_id: books[open]._id,
        })

        alert(response.data.message)
        setIsModalOpen(false)
        setOpen(-1)
        await fetchBooks()
    }

    const handleAccept = async () => {
        setLoading(true)
        const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/active-book`, {
            book_id: books[open]._id,
        })

        alert(response.data.message)
        setOpen(-1)
        await fetchBooks()
    }

    if (!loading && books.length === 0) {
        return (
            <div className="min-h-screen text-center">
                <p>No request.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen container mx-auto p-4">
            {open == -1 ? (
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b text-left">No.</th>
                            <th className="px-4 py-2 border-b text-left">User</th>
                            <th className="px-4 py-2 border-b text-left">Book Name</th>
                            <th className="px-4 py-2 border-b text-left">Date</th>
                            <th className="px-4 py-2 border-b text-left">Action</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <Loading />
                    ) : (
                        <tbody>
                            {books.map((item, index) => (
                                <tr key={item._id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border-b">{index + 1}</td>
                                    <td className="px-4 py-2 border-b">{item.author}</td>
                                    <td className="px-4 py-2 border-b">{item.title}</td>
                                    <td className="px-4 py-2 border-b">{item.created_at}</td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            onClick={() => setOpen(index)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            ) : (
                <>
                    <div onClick={() => setOpen(-1)} className="cursor-pointer hover:text-slate">
                        &larr; Back
                    </div>
                    <div className="container mx-auto p-4">
                        <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
                            <AdminViewBook book={books[open]} />

                            <div className="flex justify-around space-x-4 mt-4">
                                {/* Reject Button */}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
                                >
                                    Reject Book
                                </button>

                                {/* Accept Button */}
                                <button
                                    onClick={handleAccept}
                                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
                                >
                                    Accept Book
                                </button>
                            </div>
                        </div>

                        {/* Modal */}
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 shadow-lg">
                                    <h2 className="text-lg font-bold mb-4">Confirm Rejection</h2>
                                    <p className="mb-6 text-gray-600">
                                        Are you sure you want to reject this book?
                                    </p>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default PendingBook
