import axios from 'axios';

// Automatically uses VITE_API_URL in production, falls back to localhost during npm run dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;