import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import Loading from './Loading'

const ManageUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBooks = async () => {
        window.scrollTo(0, 0)

        try {
            const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/get-users`)
            setUsers(response.data)
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
            {' '}
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left">No.</th>
                        <th className="px-4 py-2 border-b text-left">User ID</th>
                        <th className="px-4 py-2 border-b text-left">User</th>
                        <th className="px-4 py-2 border-b text-left">Role</th>
                        <th className="px-4 py-2 border-b text-left">Date</th>
                        <th className="px-4 py-2 border-b text-left">Action</th>
                    </tr>
                </thead>
                {loading ? (
                    <Loading />
                ) : (
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">{user._id}</td>
                                <td className="px-4 py-2 border-b">
                                    {user.name ? user.name : user.username}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {user.is_author ? 'Author' : 'User'}
                                </td>
                                <td className="px-4 py-2 border-b">{user.create_at}</td>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        onClick={() => alert('Deactive user')}
                                        className="bg-red-500 text-white font-medium  px-4 rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                                    >
                                        Deactive
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
