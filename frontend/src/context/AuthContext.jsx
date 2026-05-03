import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('alta_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  // Verify token on app load
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('alta_token')
      if (!token) { setLoading(false); return }
      try {
        const res = await api.get('/auth/me')
        setUser(res.data.data)
        localStorage.setItem('alta_user', JSON.stringify(res.data.data))
      } catch {
        localStorage.removeItem('alta_token')
        localStorage.removeItem('alta_user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, data } = res.data
    localStorage.setItem('alta_token', token)
    localStorage.setItem('alta_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { token, data } = res.data
    localStorage.setItem('alta_token', token)
    localStorage.setItem('alta_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = async () => {
    await api.get('/auth/logout')
    localStorage.removeItem('alta_token')
    localStorage.removeItem('alta_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
