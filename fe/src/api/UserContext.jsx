/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const loadUserInfo = async () => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            try {
                const response = await axiosInstance.get('/user-info')
                if (response.status === 401) {
                    localStorage.removeItem('accessToken')
                    return
                }
                setUser(response.data)
            } catch (err) {
                console.error('Failed to fetch user info:', err)
                setUser(null)
            }
        }
    }

    useEffect(() => {
        loadUserInfo()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, loadUserInfo }}>
            {children}
        </UserContext.Provider>
    )
}
