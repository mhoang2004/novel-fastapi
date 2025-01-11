import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loading from '../components/Loading'
import ChapterList from '../components/ChapterList'

const BookDetails = () => {
    const { bookId } = useParams()

    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [comment, setComment] = useState('')
    const [isCommentDisabled, setIsCommentDisabled] = useState(true)

    const handleCommentChange = (e) => {
        const value = e.target.value
        setComment(value)
        setIsCommentDisabled(value.trim() === '')
    }

    const handleCommentSubmit = () => {
        console.log('Comment submitted: ', comment)
        setComment('')
    }

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/books/${bookId}`)
                setBook(response.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [bookId])

    if (loading)
        return (
            <div className="min-h-screen text-center">
                <Loading />
            </div>
        )
    if (error)
        return (
            <div className="min-h-screen">
                <p>Error: {error}</p>
            </div>
        )

    return (
        <div className="container mx-auto">
            <h3 className="text-2xl font-bold dark:text-white">NOVEL INFORMATION</h3>

            <div className="text-md mt-2">
                <Link to="/" className="text-dark hover:text-gray-700">
                    <i className="mr-1 fa-solid fa-house" id="home-icon"></i>
                    <span className="mr-1">Home</span>
                </Link>
                <span>/</span>
                <Link to={`/books/${book._id}`} className="text-dark hover:text-gray-700">
                    <span className="ml-1">{book.title}</span>
                </Link>
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Book Cover and Info */}
                <div className="col-span-1 lg:col-span-1">
                    <img
                        src={`${import.meta.env.VITE_API_URL}/image/${book.cover}`}
                        alt="book-cover"
                        className="w-full rounded-lg shadow-md"
                    />

                    <div className="mt-3">
                        <p>
                            <b>Author: </b>
                            <a
                                href={book.url_author}
                                className="text-dark hover:text-gray-700 cursor-pointer"
                            >
                                {book.author}
                            </a>
                        </p>
                        <p className="mt-2">
                            <b>Genres: </b>
                            {book.genres && book.genres.length > 0 ? (
                                book.genres.map((genre, index) => (
                                    <span key={index}>
                                        <a
                                            href={book.url_genre}
                                            className="text-dark hover:text-gray-700 cursor-pointer"
                                        >
                                            {genre}
                                        </a>
                                        {index < book.genres.length - 1 && ', '}{' '}
                                    </span>
                                ))
                            ) : (
                                <span>Others</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Book Title, Rating, Description, and Buttons */}
                <div className="col-span-1 lg:col-span-3">
                    <h2 className="text-center text-2xl font-semibold">{book.title}</h2>

                    {/* Rating Section */}
                    <div className="text-center mt-4">
                        <hr className="my-4" />
                        <div className="flex justify-center">
                            <a className="flex space-x-1">
                                <i className="text-yellow-400 fa-solid fa-star"></i>
                                <i className="text-yellow-400 fa-solid fa-star"></i>
                                <i className="text-yellow-400 fa-solid fa-star"></i>
                                <i className="text-yellow-400 fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                            </a>
                        </div>
                        <p className="mt-2">
                            Rating: <b>{book.rating ? book.rating : '0.0'}</b>/5.0 from{' '}
                            <b>{book.votes ? book.rating : 0}</b> people
                        </p>
                    </div>

                    <div className="mt-4 text-gray-700 cutoff-text">{book.description}</div>

                    <div className="text-center mt-5 space-x-4">
                        <Link
                            to="/continue_reading/"
                            type="button"
                            className="bg-rose-600 text-white py-2 px-6 rounded-full hover:bg-violet-600"
                        >
                            Start Reading
                        </Link>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold dark:text-white mt-4">
                CHAPTERS <hr />
            </h3>

            <ChapterList bookId={book._id} chapters={book.chapters} />

            <h3 className="text-2xl font-bold dark:text-white mt-5">COMMENTS</h3>
            <div className="mt-5 mb-5">
                <div className="mt-4 mb-5 flex items-start space-x-4">
                    <div>
                        <img className="w-11 h-11 rounded-full" src="/default-avt.jpg" alt="avt" />
                    </div>

                    <div className="flex-1">
                        <textarea
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Add a comment..."
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="mt-3 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                                id="comment-cancel-btn"
                                onClick={() => setComment('')} // Clear comment input
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 "
                                id="comment-submit-btn"
                                disabled={isCommentDisabled}
                                onClick={handleCommentSubmit}
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                </div>

                {book.comments ? (
                    <div className="comment-items mt-4">
                        {book.comments.map((comment, index) => (
                            <div key={index} className="flex items-start mt-4 space-x-4">
                                <div>
                                    <img
                                        src="../static/img/default-avt.jpg"
                                        className="w-11 h-11 rounded-full"
                                        alt="avt"
                                    />
                                </div>

                                <div className="flex-1">
                                    <span className="font-bold">MyBooks User</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        {comment.time_ago}
                                    </span>
                                    <p className="mt-2 text-gray-800">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center mb-5">No comment yet!</p>
                )}
            </div>
        </div>
    )
}

export default BookDetails