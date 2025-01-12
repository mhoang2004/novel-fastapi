import { Link } from 'react-router-dom'
/* eslint-disable react/prop-types */
const ChapterList = ({ bookId, bookName, chapters }) => {
    const splitIndex = Math.ceil(chapters.length / 2)
    const [firstColumn, secondColumn] = [chapters.slice(0, splitIndex), chapters.slice(splitIndex)]

    const handleReadingBook = (bookName, bookId, chapterNumber) => {
        const booksData = sessionStorage.getItem('booksData')
        const storedBooksData = booksData ? JSON.parse(booksData) : []

        const bookIndex = storedBooksData.findIndex((book) => book.book_id === bookId)

        if (bookIndex !== -1) {
            storedBooksData[bookIndex].chapter_number = chapterNumber
        } else {
            storedBooksData.push({
                book_id: bookId,
                book_name: bookName,
                chapter_number: chapterNumber,
            })
        }

        sessionStorage.setItem('booksData', JSON.stringify(storedBooksData))
    }

    return (
        <div className="flex flex-wrap mx-3 mt-5 justify-between text-lg">
            {/* First column */}
            <ul className="space-y-2 lg:w-[48%]">
                {firstColumn.map((chapter) => (
                    <li
                        onClick={() => handleReadingBook(bookName, bookId, chapter.chapter_number)}
                        className="my-3 cursor-pointer"
                        key={chapter.chapter_number}
                    >
                        <span className="text-green-500">
                            <i className="mr-2">⚫</i>
                        </span>
                        <Link
                            to={`/books/${bookId}/${chapter.chapter_number}`}
                            className="text-dark-500 hover:underline"
                        >
                            <span className="chapter-text">
                                <b>Chapter {chapter.chapter_number}: </b>
                                {chapter.title}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Second column */}
            <ul className="space-y-2 w-1/2 lg:w-[48%]">
                {secondColumn.map((chapter) => (
                    <li
                        onClick={() => handleReadingBook(bookName, bookId, chapter.chapter_number)}
                        className="my-3 flex"
                        key={chapter.chapter_number}
                    >
                        <span className="text-green-500">
                            <i className="mr-2">⚫</i>
                        </span>
                        <Link
                            className="text-dark-500 cursor-pointer hover:underline"
                            to={`/books/${bookId}/${chapter.chapter_number}`}
                        >
                            <span>
                                <b>Chapter {chapter.chapter_number}: </b>
                            </span>
                            <span className="chapter-text">{chapter.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ChapterList
