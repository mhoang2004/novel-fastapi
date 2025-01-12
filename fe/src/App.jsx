import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { UserProvider } from './api/UserContext'

import Footer from './components/Footer'
import Header from './components/Header'

import SearchPage from './pages/SearchPage'
import BookDetails from './pages/BookDetails'
import ChapterForm from './pages/ChapterForm'
import ReadBook from './pages/ReadBook'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import About from './pages/About'
import Home from './pages/Home'

function App() {
    return (
        <UserProvider>
            <Router>
                <Header />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/books" element={<Navigate to="/" />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/profile/:bookId" element={<ChapterForm />} />
                    <Route path="/books/:bookId" element={<BookDetails />} />
                    <Route path="/books/:bookId/:chapterNum" element={<ReadBook />} />
                </Routes>

                <Footer />
            </Router>
        </UserProvider>
    )
}

export default App
