import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import Loading from './Loading'

const ManageUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fechUsers = async () => {
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

    const handleDeactiveUser = async (userId) => {
        window.scrollTo(0, 0)

        try {
            await axiosInstance.post(`${import.meta.env.VITE_API_URL}/toggle-user-active`, {
                user_id: userId,
            })
            fechUsers()
        } catch (error) {
            console.error('Error fetching books:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fechUsers()
    }, [])

    return (
        <div className="min-h-screen container mx-auto p-4">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left">No.</th>
                        <th className="px-4 py-2 border-b text-left">User ID</th>
                        <th className="px-4 py-2 border-b text-left">User</th>
                        <th className="px-4 py-2 border-b text-left">Role</th>
                        <th className="px-4 py-2 border-b text-left">Active</th>
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
                                <td className="px-4 py-2 border-b">
                                    {user.is_active ? (
                                        <span className="text-green-500">Active</span>
                                    ) : (
                                        <span className="text-red-500">Inactive</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {user.is_active ? (
                                        <button
                                            onClick={() => handleDeactiveUser(user._id)}
                                            className="w-28 bg-red-500 text-white font-medium  px-4 rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                                        >
                                            Deactive
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDeactiveUser(user._id)}
                                            className="w-28 bg-green-500 text-white font-medium  px-4 rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                                        >
                                            Active
                                        </button>
                                    )}
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
