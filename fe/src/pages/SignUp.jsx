import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

import { UserContext } from '../api/UserContext'

import GoogleLoginBtn from '../components/GoogleLoginBtn'

const SignUp = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    const { loadUserInfo } = useContext(UserContext)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match.")
            setLoading(false)
            return
        }

        // Email regex validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        if (!emailPattern.test(formData.email)) {
            setError('Invalid email address.')
            setLoading(false)
            return
        }

        // Password validation (minimum length 6)
        if (formData.password.length < 6) {
            setError('Password should be at least 6 characters long.')
            setLoading(false)
            return
        }

        const signUpData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/signup`,
                signUpData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            if (response.status == 201) {
                setSuccess('Account created successfully. Redirecting to home...')
                localStorage.setItem('accessToken', response.data.access_token)
                await loadUserInfo()

                setTimeout(() => navigate('/'), 4000)
            } else {
                setError(response.data.detail)
            }
        } catch (err) {
            console.error(err)
            setError('Failed to create account. Please try again.')
        }

        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 disabled:opacity-50"
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="my-4 text-center text-gray-500">Or Sign Up Using</div>
                <GoogleLoginBtn />
                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
