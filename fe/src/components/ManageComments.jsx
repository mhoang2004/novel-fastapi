import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import Loading from './Loading'

const ManageComments = () => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    const fechcomments = async () => {
        window.scrollTo(0, 0)

        try {
            const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/comments`)
            setComments(response.data)
        } catch (error) {
            console.error('Error fetching books:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        window.scrollTo(0, 0)

        try {
            await axiosInstance.post(`${import.meta.env.VITE_API_URL}/delete-comment`, {
                comment_id: commentId,
            })
            fechcomments()
        } catch (error) {
            console.error('Error fetching books:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fechcomments()
    }, [])

    return (
        <div className="min-h-screen container mx-auto p-4">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left">No.</th>
                        <th className="px-4 py-2 border-b text-left">User</th>
                        <th className="px-4 py-2 border-b text-left">Content</th>
                        <th className="px-4 py-2 border-b text-left">Timestamp</th>
                        <th className="px-4 py-2 border-b text-left">Action</th>
                    </tr>
                </thead>
                {loading ? (
                    <Loading />
                ) : (
                    <tbody>
                        {comments.map((comment, index) => (
                            <tr key={comment._id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">{comment.user}</td>
                                <td className="px-4 py-2 border-b">{comment.content}</td>
                                <td className="px-4 py-2 border-b">{comment.timestamp}</td>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
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

export default ManageComments
