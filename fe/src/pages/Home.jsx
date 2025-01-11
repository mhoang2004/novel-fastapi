import { useState, useEffect } from 'react'

import axios from 'axios'

import BookSlider from '../components/BookSlider'
import Banner from '../components/Banner'
import SocialBanner from '../components/SocialBanner'
import Loading from '../components/Loading'

const Home = () => {
    const [hotBooks, setHotBooks] = useState([])
    const [newbooks, setNewbooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const hotBooks = await axios.get(`${import.meta.env.VITE_API_URL}/books`)
                const newBooks = await axios.get(
                    `${import.meta.env.VITE_API_URL}/books?sort=updated_at`
                )

                setHotBooks(hotBooks.data)
                setNewbooks(newBooks.data)
            } catch (error) {
                console.error('Error fetching books:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [])

    return (
        <>
            <Banner />
            <div className="container mx-auto min-h-screen">
                <h2 className="font-bold my-6 text-xl uppercase">Hot Books 🔥</h2>
                <div className="min-h-64">
                    {loading ? <Loading /> : <BookSlider books={hotBooks} name="hot" />}
                </div>

                <h2 className="font-bold my-6 text-xl uppercase">New Books ⚡</h2>
                <div className="min-h-64">
                    {loading ? <Loading /> : <BookSlider books={newbooks} name="new" />}
                </div>

                <SocialBanner />
                <img src="/bookstore-02.jpg" alt="" />
            </div>
        </>
    )
}

export default Home
