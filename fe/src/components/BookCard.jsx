import { Link } from 'react-router-dom'

/* eslint-disable react/prop-types */
const BookCard = ({ book }) => {
    return (
        <Link to={`/books/${book._id}`}>
            <div className="max-w-xs overflow-hidden shadow-lg cursor-pointer relative">
                <img
                    src={`${import.meta.env.VITE_API_URL}/image/${book.cover}`}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                />
                <div
                    title={book.title}
                    className="p-4 drop-shadow-sm text-center py-2 w-full bg-[rgba(0,0,0,0.6)] absolute bottom-0"
                >
                    <h3 className="text-lg font-semibold text-white truncate">{book.title}</h3>
                </div>
            </div>
        </Link>
    )
}

export default BookCard
