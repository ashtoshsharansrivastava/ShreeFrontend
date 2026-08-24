import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

// Set the global base URL for ALL axios requests.
// This points everything directly to Render, ignoring Vercel's relative paths.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://shree-attendance-backend.onrender.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)