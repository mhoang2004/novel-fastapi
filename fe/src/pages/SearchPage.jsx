import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

import Loading from '../components/Loading'
import BookCard from '../components/BookCard'

const SearchPage = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)

    const title = queryParams.get('title') || ''
    const author = queryParams.get('author') || ''
    const genre = queryParams.get('genre') || ''

    const [loading, setLoading] = useState(true)
    const [books, setBooks] = useState([])

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/books`, {
                    params: {
                        title,
                        author,
                        genre,
                    },
                })

                setBooks(response.data)
            } catch (error) {
                console.error('Error fetching books:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [title, author, genre])

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
                <h1 className="text-3xl font-bold text-center mb-8">
                    Search {title && `Title: ${title}`} Results
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {books.length === 0 ? (
                        <p>Books not found!</p>
                    ) : (
                        books.map((book) => <BookCard book={book} key={book._id} />)
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchPage
