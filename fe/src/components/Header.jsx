import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '../api/UserContext'

const Header = () => {
    const { user, setUser } = useContext(UserContext)
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        setUser(null)
    }

    return (
        <header className="flex items-center justify-between p-4 px-5 bg-white text-dark">
            {/* Logo */}
            <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-10" />
                <span className="font-semibold">Your Novel</span>
            </Link>

            {/* Search Bar Container */}
            <div className="flex-grow mx-4 flex justify-center">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full max-w-md p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* User Links */}
            <div className="flex items-center space-x-4">
                {user ? (
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <div className="flex items-center">
                                <img src={`${user.avt}`} alt="" width={35} />
                                {user.username}
                                <svg
                                    className={`ml-2 h-5 w-5 transform ${
                                        isOpen ? 'rotate-180' : 'rotate-0'
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                    stroke="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </button>

                        {isOpen && (
                            <div className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50"
                                    >
                                        Profile
                                    </Link>
                                    <hr />
                                    <Link
                                        to="/"
                                        onClick={handleLogout}
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50"
                                    >
                                        Log out
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="px-2 py-1 rounded hover:bg-slate-100">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </Link>
                )}
            </div>
        </header>
    )
}

export default Header
