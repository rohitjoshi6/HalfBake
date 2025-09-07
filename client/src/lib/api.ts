import axios from 'axios'
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
})

// Attach bearer token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hb_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
