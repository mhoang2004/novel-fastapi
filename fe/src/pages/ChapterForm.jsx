import { useState, useEffect } from 'react'
import Loading from '../components/Loading'
import axiosInstance from '../api/axiosInstance'
import { useParams, useNavigate } from 'react-router-dom'

import Accordion from '../components/Accordion'

const ChapterForm = () => {
    const { bookId } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [book, setBook] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState('')
    const [chapter, setChapter] = useState({
        chapterName: '',
        content: '',
    })

    // Fetch the book data
    const fetchBook = async () => {
        try {
            const response = await axiosInstance.get(
                `${import.meta.env.VITE_API_URL}/books/${bookId}`
            )
            setBook(response.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchBook() // Call fetchBook when the component mounts or bookId changes
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setChapter((prevBook) => ({
            ...prevBook,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        chapter['chapterNumber'] = book.chapters.length + 1
        chapter['novelId'] = book._id

        if (chapter.chapterName.trim() === '') {
            setError('Chapter title is required.')
            return
        }
        if (chapter.content.trim() === '') {
            setError('Chapter content is required.')
            return
        }

        const invalidChapter = book.chapters.find((chapter) => chapter.content.length < 100)
        if (invalidChapter) {
            setLoading(false)
            setError('Each chapter must have content with at least 100 characters.')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await axiosInstance.post(
                `${import.meta.env.VITE_API_URL}/chapter`,
                chapter
            )
            setSuccess(response.data.message)
            setChapter({
                chapterName: '',
                content: '',
            })

            // Re-fetch the book data after chapter is added
            await fetchBook() // Re-fetch the book to load new chapter data
        } catch (error) {
            console.log(error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-5">
            <div onClick={() => navigate(-1)} className="cursor-pointer hover:text-slate mb-4">
                &larr; Back
            </div>

            <div className="max-w-2xl min-h-screen mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-4">{book.title}</h2>
                <form onSubmit={handleSubmit}>
                    <h3 className="text-lg font-medium mb-2">Chapters</h3>
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            {/* All chapters */}
                            {book.chapters.map((chapter) => (
                                <Accordion
                                    key={chapter._id}
                                    title={chapter.title}
                                    content={chapter.content}
                                />
                            ))}
                            <h2 className="text-xl font-semibold mb-4">
                                Chapter {book.chapters.length + 1}
                            </h2>
                        </>
                    )}

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Chapter Name
                        </label>
                        <input
                            required
                            type="text"
                            name="chapterName"
                            value={chapter.chapterName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter chapter name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            required
                            name="content"
                            value={chapter.content}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter chapter content"
                        />
                    </div>

                    {/* Error Alert */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Success Alert */}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChapterForm
