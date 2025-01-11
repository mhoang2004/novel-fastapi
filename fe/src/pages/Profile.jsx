import { UserContext } from '../api/UserContext'
import { useContext, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import Account from '../components/Account'
import History from '../components/History'
import YourBook from '../components/YourBook'
import BookForm from '../components/BookForm'
import PendingBook from '../components/PendingBook'

const Profile = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    const [selectedTab, setSelectedTab] = useState('overview')

    const handleTabClick = (tab) => {
        setSelectedTab(tab)
    }

    if (!user) {
        return (
            <div className="min-h-sreen text-center">
                <p className="text-xl">You can not access using this way!</p>
            </div>
        )
    }

    return (
        <div className="flex">
            {/* Left Sidebar */}
            <div className="w-1/4 bg-gray-100 p-4 rounded-lg">
                <div className="text-center font-semibold mt-4 mb-6">
                    WELCOME TO <span className="font-black">YOUR NOVEL</span>
                </div>

                <ul className="space-y-4">
                    <li className="border-b-2 hover:bg-blue-300">
                        <button
                            onClick={() => handleTabClick('overview')}
                            className={`w-full text-left px-4 py-2 rounded-lg ${
                                selectedTab === 'overview'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-transparent text-gray-700'
                            }`}
                        >
                            Account
                        </button>
                    </li>
                    <li className="border-b-2 hover:bg-blue-300">
                        <button
                            onClick={() => handleTabClick('history')}
                            className={`w-full text-left px-4 py-2 rounded-lg ${
                                selectedTab === 'history'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-transparent text-gray-700'
                            }`}
                        >
                            History
                        </button>
                    </li>

                    {/* Create a book */}
                    {user.is_author && (
                        <li className='border-b-2 hover:bg-blue-300"'>
                            <button
                                onClick={() => handleTabClick('createbook')}
                                className={`w-full text-left px-4 py-2 rounded-lg ${
                                    selectedTab === 'createbook'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-transparent text-gray-700'
                                }`}
                            >
                                Create Novel
                            </button>
                        </li>
                    )}

                    {user.is_admin && (
                        <>
                            <li className="border-b-2 hover:bg-blue-300">
                                <button
                                    onClick={() => handleTabClick('pendingbook')}
                                    className={`w-full text-left px-4 py-2 rounded-lg ${
                                        selectedTab === 'pendingbook'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-transparent text-gray-700'
                                    }`}
                                >
                                    Pending Books
                                </button>
                            </li>

                            <li className="border-b-2 hover:bg-blue-300">
                                <button
                                    onClick={() => handleTabClick('manageuser')}
                                    className={`w-full text-left px-4 py-2 rounded-lg ${
                                        selectedTab === 'manageuser'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-transparent text-gray-700'
                                    }`}
                                >
                                    Manage Users
                                </button>
                            </li>
                        </>
                    )}

                    {!user.is_author && !user.is_admin && (
                        <li className="border-b-2 hover:bg-blue-300">
                            <button
                                onClick={() => handleTabClick('yourbook')}
                                className={`w-full text-left px-4 py-2 rounded-lg ${
                                    selectedTab === 'yourbook'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-transparent text-gray-700'
                                }`}
                            >
                                Your Novels
                            </button>
                        </li>
                    )}
                </ul>
            </div>

            <div className="w-3/4 p-4">
                {selectedTab === 'overview' && <Account />}
                {selectedTab === 'history' && <History />}
                {selectedTab === 'yourbook' && <YourBook />}
                {selectedTab === 'createbook' && <BookForm />}
                {selectedTab === 'pendingbook' && <PendingBook />}
                {selectedTab === 'manageuser' && (
                    <>
                        <div className="min-h-screen">Manage Users...</div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Profile
