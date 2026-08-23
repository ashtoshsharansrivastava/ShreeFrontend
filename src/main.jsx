import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

// Ensure /api is included at the end
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
