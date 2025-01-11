import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

import Loading from '../components/Loading'
import { Link } from 'react-router-dom'

const ReadBook = () => {
    const { bookId, chapterNum } = useParams()
    const [chapter, setChapter] = useState([])
    const [loading, setLoading] = useState(true)
    const [currChapter, setCurrChapter] = useState(Number(chapterNum))

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/books/${bookId}/chapters/${currChapter}`
                )
                setChapter(response.data)
            } catch (error) {
                console.error('Error fetching books:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [bookId, currChapter])

    return (
        <div className="min-h-screen">
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="text-md mt-2 mx-6">
                        <Link to="/" className="text-dark hover:text-gray-700">
                            <i className="mr-1 fa-solid fa-house" id="home-icon"></i>
                            <span className="mr-1">Home</span>
                        </Link>
                        <span>/</span>
                        <Link to={`/books/${bookId}`} className="text-dark hover:text-gray-700">
                            <span className="ml-1">{chapter.book.title} </span>
                        </Link>
                        <span>/</span>
                        <Link
                            to={`/books/${bookId}/${currChapter}`}
                            className="text-dark hover:text-gray-700"
                        >
                            <span className="ml-1">Chapter {currChapter}</span>
                        </Link>
                    </div>

                    <div className="mt-5">
                        <h1 className="text-center font-bold text-3xl">{chapter.book.title}</h1>
                        <h2 className="mt-3 text-center text-2xl text-slate-700">
                            Chapter {currChapter}: {chapter.title}
                        </h2>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setCurrChapter((prev) => prev - 1)}
                            disabled={currChapter === 1}
                            className={`px-6 py-1 font-semibold rounded-lg shadow-md ${
                                currChapter === 1
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            Prev Chapter
                        </button>
                        <button className="border-2 mx-4">
                            <i className="fa-solid py-1 fa-bars text-2xl px-4"></i>
                        </button>
                        <button
                            onClick={() => setCurrChapter((prev) => prev + 1)}
                            disabled={currChapter === chapter.book.numberChapter}
                            className={`px-6 py-1 font-semibold rounded-lg shadow-md ${
                                currChapter === chapter.book.numberChapter
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            Next Chapter
                        </button>
                    </div>
                    <p className="m-6 text-2xl">{chapter.content}</p>

                    <hr />

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setCurrChapter((prev) => prev - 1)}
                            disabled={currChapter === 1}
                            className={`px-6 py-1 font-semibold rounded-lg shadow-md ${
                                currChapter === 1
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            Prev Chapter
                        </button>
                        <button className="border-2 mx-4">
                            <i className="fa-solid py-1 fa-bars text-2xl px-4"></i>
                        </button>
                        <button
                            onClick={() => setCurrChapter((prev) => prev + 1)}
                            disabled={currChapter === chapter.book.numberChapter}
                            className={`px-6 py-1 font-semibold rounded-lg shadow-md ${
                                currChapter === chapter.book.numberChapter
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            Next Chapter
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default ReadBook
