import axios from 'axios'

const api = axios.create({
  baseURL: 'https://alta-88sf.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Attach JWT from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('alta_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If 401 received, clear storage and redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('alta_token')
      localStorage.removeItem('alta_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
