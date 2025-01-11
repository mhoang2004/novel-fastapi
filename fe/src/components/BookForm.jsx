import axios from 'axios'
import { useState, useEffect } from 'react'
import Loading from './Loading'
import axiosInstance from '../api/axiosInstance'

const BookForm = () => {
    const [genres, setGenres] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState('')

    const [book, setBook] = useState({
        bookName: '',
        genres: [],
        description: '',
        bookCover: '',
        numberOfChapters: 1,
        chapters: [{ chapterName: '', content: '' }],
    })

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/genres`)
                setGenres(response.data)
            } catch (error) {
                console.error('Error fetching genres:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchGenres()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setBook((prevBook) => ({
            ...prevBook,
            [name]: value,
        }))
    }

    const handleChapterChange = (index, e) => {
        const { name, value } = e.target
        const updatedChapters = [...book.chapters]
        updatedChapters[index] = {
            ...updatedChapters[index],
            [name]: value,
        }
        setBook((prevBook) => ({
            ...prevBook,
            chapters: updatedChapters,
        }))
    }

    const handleNumberOfChaptersChange = (e) => {
        const newNumberOfChapters = parseInt(e.target.value, 10)
        const updatedChapters = Array.from(
            { length: newNumberOfChapters },
            (_, i) => book.chapters[i] || { chapterName: '', content: '' }
        )

        setBook((prevBook) => ({
            ...prevBook,
            numberOfChapters: newNumberOfChapters,
            chapters: updatedChapters,
        }))
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            setBook((prevBook) => ({
                ...prevBook,
                bookCover: response.data.fileId, // Store the uploaded file's ID
            }))
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!book.bookName) {
            setLoading(false)
            setError('Book name are required.')
            return
        }

        if (!book.genres.length) {
            setLoading(false)
            setError('At least one genre are required.')
            return
        }

        if (!book.bookCover) {
            setError('Book cover are required.')
            return
        }

        if (!book.genres.length) {
            setLoading(false)
            setError('At least one genre are required.')
            return
        }

        if (!book.genres.length) {
            setLoading(false)
            setError('At least one genre are required.')
            return
        }

        const invalidChapter = book.chapters.find((chapter) => chapter.content.length < 100)
        if (invalidChapter) {
            setLoading(false)
            setError('Each chapter must have content with at least 100 characters.')
            return
        }

        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const response = await axiosInstance.post(
                `${import.meta.env.VITE_API_URL}/novels`,
                book
            )
            setSuccess(response.data.message)
            setBook({
                bookName: '',
                genres: [],
                description: '',
                bookCover: '',
                numberOfChapters: 1,
                chapters: [{ chapterName: '', content: '' }],
            })
        } catch (error) {
            console.log(error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Upload a Book</h2>
            <form onSubmit={handleSubmit}>
                {/* Book Name */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Book Name
                    </label>
                    <input
                        required
                        type="text"
                        name="bookName"
                        value={book.bookName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter book name"
                    />
                </div>

                {/* Genres */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Genres</label>
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {genres.map((genre) => (
                                <button
                                    key={genre._id}
                                    type="button"
                                    className={`px-2 py-1 rounded-md border ${
                                        book.genres.includes(genre._id)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-gray-200 text-gray-700 border-gray-300'
                                    }`}
                                    onClick={() => {
                                        const isSelected = book.genres.includes(genre._id)
                                        setBook((prevBook) => ({
                                            ...prevBook,
                                            genres: isSelected
                                                ? prevBook.genres.filter((id) => id !== genre._id)
                                                : [...prevBook.genres, genre._id],
                                        }))
                                    }}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        required
                        name="description"
                        value={book.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter book description"
                    />
                </div>

                {/* Book Cover */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Book Cover
                    </label>
                    <input
                        type="file"
                        name="bookCover"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {book.bookCover && (
                    <img
                        src={`${import.meta.env.VITE_API_URL}/image/${book.bookCover}`}
                        alt="Book Cover"
                        className="w-32 h-32 object-cover rounded-md"
                    />
                )}

                {/* Number of Chapters */}
                <div className="mb-4 mt-3">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Number of Chapters
                    </label>
                    <input
                        type="number"
                        name="numberOfChapters"
                        value={book.numberOfChapters}
                        onChange={handleNumberOfChaptersChange}
                        min="1"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Chapters */}
                {book.chapters.map((chapter, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="text-lg font-medium mb-2">Chapter {index + 1}</h3>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Chapter Name
                            </label>
                            <input
                                required
                                type="text"
                                name="chapterName"
                                value={chapter.chapterName}
                                onChange={(e) => handleChapterChange(index, e)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter chapter name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <textarea
                                required
                                name="content"
                                value={chapter.content}
                                onChange={(e) => handleChapterChange(index, e)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter chapter content"
                            />
                        </div>
                    </div>
                ))}

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
                    {loading ? 'Submiting...' : 'Submit'}
                </button>
            </form>
        </div>
    )
}

export default BookForm
