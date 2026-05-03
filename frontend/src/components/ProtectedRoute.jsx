import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{
      background: '#000', height: '100vh',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#cc3333',
      fontSize: '13px', letterSpacing: '0.2em'
    }}>
      VERIFYING ACCESS...
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute
