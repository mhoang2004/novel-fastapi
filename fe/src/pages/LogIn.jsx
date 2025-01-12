import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { gapi } from 'gapi-script'

import GoogleLoginBtn from '../components/GoogleLoginBtn'
import axiosInstance from '../api/axiosInstance'
import { UserContext } from '../api/UserContext'

const LogIn = () => {
    const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/')
            return
        }

        function start() {
            gapi.client.init({
                clientID: clientID,
                scope: '',
            })
        }
        gapi.load('client:auth2', start)
    }, [user, navigate, clientID])

    const [formData, setFormData] = useState({ username: '', password: '' })
    const { loadUserInfo } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const loginDataForm = new URLSearchParams()
        loginDataForm.append('username', formData.username)
        loginDataForm.append('password', formData.password)

        try {
            const response = await axiosInstance.post('login', loginDataForm)
            localStorage.setItem('accessToken', response.data.access_token)
            await loadUserInfo()
            navigate('/')
        } catch (err) {
            console.error(err)
            setError('Invalid username or password. Please try again.')
        }

        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div className="my-4 text-center text-gray-500">Or Sign Up Using</div>

                <GoogleLoginBtn />
                <div className="text-center mt-4 text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LogIn
