/* eslint-disable react/prop-types */
const AdminViewBook = ({ book }) => {
    return (
        <>
            {/* Novel Details */}
            <div className="mb-4">
                <h1 className="mb-4 text-2xl font-semibold">{book.title}</h1>
                <p className="text-gray-700">{book.description}</p>
                <div className="my-4">
                    <img
                        src={`${import.meta.env.VITE_API_URL}/image/${book.cover}`}
                        alt="Book Cover"
                        className="w-64 h-72 object-cover rounded-md"
                    />
                </div>
                <p className="text-lg text-gray-500">Author: {book.author}</p>
                <p className="text-lg text-gray-500">
                    Genres:{' '}
                    {book.genres && book.genres.length > 0 ? (
                        book.genres.map((genre, index) => (
                            <span key={index}>
                                {genre.name}
                                {index !== book.genres.length - 1 && ', '}
                            </span>
                        ))
                    ) : (
                        <span>Others</span>
                    )}
                </p>

                <p className="text-lg text-gray-500">
                    Created on: {new Date(book.created_at).toLocaleString()}
                </p>
            </div>

            {/* Chapters */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Chapters</h2>
                <ul className="space-y-4">
                    {book.chapters.map((chapter) => (
                        <li key={chapter.chapter_number} className="pb-4">
                            <h3 className="text-lg font-medium">
                                Chapter {chapter.chapter_number}: {chapter.title}
                            </h3>
                            <p className="mt-3 text-lg text-gray-600">{chapter.content}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default AdminViewBook
