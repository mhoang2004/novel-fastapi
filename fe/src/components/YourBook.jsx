import { useContext, useEffect } from 'react'
// import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { UserContext } from '../api/UserContext'

import BookForm from '../components/BookForm'

const YourBook = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    return (
        <div className="p-4">
            {user.is_author ? (
                <div>
                    <p>Your are author {user.is_author}</p>
                </div>
            ) : (
                <div>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold inline-block bg-yellow-500">
                            You are not author yet! Upload a book to become an author
                        </h2>
                    </div>
                    <BookForm />
                </div>
            )}
        </div>
    )
}

export default YourBook
