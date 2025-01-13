import { UserContext } from '../api/UserContext'
import { useContext, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import AuthorBooks from './AuthorBooks'
import axiosInstance from '../api/axiosInstance'

import GenreStats from './GenreStats'
import NovelStats from './NovelStats'

const Account = () => {
    const { user, loadUserInfo } = useContext(UserContext)
    const navigate = useNavigate()

    const [name, setName] = useState('')

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name.trim()) {
            alert('Please enter a pen name!')
            return
        }

        try {
            await axiosInstance.post(`${import.meta.env.VITE_API_URL}/update-pen-name`, { name })
            loadUserInfo()
            alert('Pen name updated successfully!')
        } catch (error) {
            console.error('Error:', error)
            alert('An error occurred while updating your pen name.')
        }
    }

    return (
        <div className="p-4">
            {/* Check if the user is logged in */}
            {user ? (
                <div>
                    <h1 className="text-2xl font-semibold text-center">Account</h1>
                    <div className="flex flex-col items-center justify-center">
                        <img src={`${user.avt}`} alt="" width={200} className="rounded-full" />
                        <p className="mt-2">
                            <span className="font-bold">
                                {user.is_admin && (
                                    <p className="inline-block bg-blue-400 rounded p-1">Admin</p>
                                )}
                                {user.is_author && (
                                    <p className="inline-block bg-green-400 rounded p-1">Author</p>
                                )}{' '}
                                {user.name ? user.name : user.username}
                            </span>
                        </p>
                    </div>

                    {user.is_author && !user.name && (
                        <form onSubmit={handleSubmit}>
                            <div className="mt-5">
                                <b>Name:</b>{' '}
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    placeholder="your pen-name"
                                    className="py-1 px-4 ml-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="bg-blue-500 text-white font-medium ml-1 py-1 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                                    OK
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="mt-5">
                        <b>User ID:</b> {user._id}
                    </p>
                    <p className="mt-4">
                        <b>Email:</b> {user.email}
                    </p>
                    <p className="my-4">
                        <b>Account created at:</b> {user.create_at}
                    </p>

                    <hr />

                    {user.is_admin && (
                        <div className="min-h-screen">
                            <GenreStats />
                            <NovelStats />
                        </div>
                    )}

                    {user.is_author && <AuthorBooks />}

                    {/* User */}
                    {!user.is_author && !user.is_admin && (
                        <>
                            <div className="mt-4">
                                <h4 className="font-bold text-2xl mb-2 bg-yellow-500 inline-block">
                                    How to become a writer?
                                </h4>
                                <p className="font-georgia">
                                    You wanna share your story with people, to let them see the
                                    world through your eyes and experience the emotions, lessons,
                                    and adventures you&apos;ve lived. Becoming a writer gives you
                                    the power to connect with others, to inspire and move them with
                                    your words. It&apos;s a way to immortalize your thoughts, to
                                    make your voice heard, and to leave a mark on the world. Writing
                                    lets you explore your creativity, express your deepest feelings,
                                    and turn your imagination into something tangible. It&apos;s not
                                    just about storytelling; it&apos;s about sharing a piece of
                                    yourself with others and touching lives in ways you never
                                    thought possible.
                                </p>

                                <h5 className="font-bold text-xl mb-2 bg-red mt-4">Step 1:</h5>
                                <div>Go to Tab &apos;Your Books&apos;</div>

                                <h5 className="font-bold text-xl mb-2 bg-red mt-4">Step 2:</h5>
                                <div>
                                    <p>
                                        Upload your book then wait for the admin to accept you, keep
                                        checking your email.
                                    </p>
                                </div>

                                <h5 className="font-bold text-xl mb-2 bg-red mt-4">Step 3:</h5>

                                <div>
                                    <p>And, if the admin accept you....</p>
                                    <p>TADAA, you have become a genuine writer, welcome!</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div>
                    <h1 className="text-2xl font-semibold">Account</h1>
                    <p className="mt-4">
                        You are not logged in. Please log in to view your account details.
                    </p>
                </div>
            )}
        </div>
    )
}

export default Account
