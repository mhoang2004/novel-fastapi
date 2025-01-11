import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Importing the CSS file

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
)