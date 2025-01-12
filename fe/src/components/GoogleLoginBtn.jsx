import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

import { UserContext } from '../api/UserContext'
import axiosInstance from '../api/axiosInstance'

function GoogleLoginBtn() {
    const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const { loadUserInfo } = useContext(UserContext)
    const navigate = useNavigate()

    const onSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential
        const decoded = jwtDecode(token)

        console.log('Decoded Token:', decoded)

        const loginDataForm = new URLSearchParams()
        loginDataForm.append('username', decoded.email.split('@')[0])
        loginDataForm.append('password', '123456')

        try {
            const response = await axiosInstance.post('login', loginDataForm)
            localStorage.setItem('accessToken', response.data.access_token)
            await loadUserInfo()
            navigate('/')

            return
        } catch (err) {
            console.error(err)
        }

        const signUpData = {
            username: decoded.email.split('@')[0],
            email: decoded.email,
            password: '123456',
            name: decoded.name,
            avt: decoded.picture,
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/signup`,
                signUpData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            if (response.status == 201) {
                localStorage.setItem('accessToken', response.data.access_token)
                await loadUserInfo()
                setTimeout(() => navigate('/'), 4000)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const onFailure = (res) => {
        console.log(res)
    }

    return (
        <GoogleOAuthProvider clientId={clientID}>
            <GoogleLogin text="Sign in with Google" onSuccess={onSuccess} onError={onFailure} />
        </GoogleOAuthProvider>
    )
}

export default GoogleLoginBtn
