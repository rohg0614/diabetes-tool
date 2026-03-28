import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 50,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 2rem', height: '80px',
      backgroundColor: 'rgba(19,19,19,0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(62,73,74,0.2)'
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '3rem'}}>
        <Link to="/" style={{textDecoration: 'none'}}>
          <span style={{
            fontSize: '1.5rem', fontWeight: 800,
            letterSpacing: '-0.05em', color: '#55d8e1',
            fontFamily: 'Manrope, sans-serif', cursor: 'pointer'
          }}>GlucoPulse</span>
        </Link>
        <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
          <Link to="/" style={{textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(229,226,225,0.7)'}}>Home</Link>
          <Link to="/risk" style={{textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(229,226,225,0.7)'}}>Risk Analysis</Link>
          {isLoggedIn && (
            <Link to="/dashboard" style={{textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(229,226,225,0.7)'}}>Dashboard</Link>
          )}
          <a href="https://github.com/rohg0614/diabetes-tool" target="_blank" rel="noopener noreferrer"
            style={{textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(229,226,225,0.7)'}}>
            GitHub
          </a>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
        {isLoggedIn ? (
          <button onClick={handleLogout} style={{
            padding: '0.5rem 1.25rem', fontSize: '0.875rem', fontWeight: 500,
            color: '#55d8e1', background: 'transparent', border: 'none',
            borderRadius: '0.375rem', cursor: 'pointer'
          }}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{textDecoration: 'none'}}>
              <button style={{
                padding: '0.5rem 1.25rem', fontSize: '0.875rem', fontWeight: 500,
                color: '#55d8e1', background: 'transparent', border: 'none',
                borderRadius: '0.375rem', cursor: 'pointer'
              }}>Login</button>
            </Link>
            <Link to="/register" style={{textDecoration: 'none'}}>
              <button style={{
                padding: '0.5rem 1.5rem', fontSize: '0.875rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #55d8e1, #007b81)',
                color: '#003739', border: 'none', borderRadius: '0.375rem', cursor: 'pointer'
              }}>Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
