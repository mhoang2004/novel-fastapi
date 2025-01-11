import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import { Link } from 'react-router-dom'

import BookCard from './BookCard'
import Loading from './Loading'

const AuthorBooks = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axiosInstance.get('author-books')
                setBooks(response.data)
            } catch (error) {
                console.error('Error fetching books:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen">
                <Loading />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Your Books</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-4 gap-3">
                    {books.map((book) => (
                        <div
                            className="bg-white rounded-lg shadow-md p-2 flex flex-col items-center"
                            key={book._id}
                        >
                            {/* Render the Book Card */}
                            <BookCard book={book} />

                            {/* Add Chapter Button */}
                            <Link
                                to={`/profile/${book._id}`}
                                className="px-4 py-1 mt-4 font-semibold border border-black rounded-lg shadow-md cursor-pointer outline-orange-500"
                            >
                                <i className="fa-solid fa-plus p-1"></i>
                                Add Chapter
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AuthorBooks
