import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
        <GoogleOAuthProvider clientId='925682492325-kqgprm0nem7kgo03vrhke8gk70m50de7.apps.googleusercontent.com'>
            <App/>
        </GoogleOAuthProvider>
)
