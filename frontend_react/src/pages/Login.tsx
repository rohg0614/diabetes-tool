import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, getMe } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('token', res.data.access_token)
      const me = await getMe()
      localStorage.setItem('user', JSON.stringify(me.data))
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      backgroundColor: '#131313', minHeight: '100vh', color: '#e5e2e1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', fontFamily: 'Inter, sans-serif', position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%',
        width: '500px', height: '500px',
        backgroundColor: 'rgba(85,216,225,0.05)', borderRadius: '9999px',
        filter: 'blur(120px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-10%',
        width: '500px', height: '500px',
        backgroundColor: 'rgba(0,123,129,0.05)', borderRadius: '9999px',
        filter: 'blur(120px)', pointerEvents: 'none'
      }} />

      <div style={{width: '100%', maxWidth: '28rem', position: 'relative', zIndex: 10}}>
        {/* Brand */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem'}}>
          <Link to="/" style={{textDecoration: 'none'}}>
            <h1 style={{
              fontSize: '1.875rem', fontWeight: 800, color: '#55d8e1',
              fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.05em', marginBottom: '0.25rem'
            }}>GlucoPulse</h1>
          </Link>
          <p style={{fontSize: '0.75rem', color: '#bdc9ca', textTransform: 'uppercase', letterSpacing: '0.15em'}}>
            Precision Analytics
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#1c1b1b', borderRadius: '0.75rem',
          padding: '2rem', position: 'relative', overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          {/* Top accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(to right, #55d8e1, #007b81)'
          }} />

          <h2 style={{fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '0.25rem'}}>
            Welcome Back
          </h2>
          <p style={{fontSize: '0.875rem', color: '#bdc9ca', marginBottom: '2rem'}}>
            Access your clinical insights
          </p>

          {error && (
            <div style={{
              backgroundColor: 'rgba(147,0,10,0.2)', border: '1px solid rgba(255,180,171,0.2)',
              borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1.5rem',
              fontSize: '0.875rem', color: '#ffb4ab'
            }}>
              {error}
            </div>
          )}

          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            <div>
              <label style={{fontSize: '0.75rem', fontWeight: 600, color: '#bdc9ca', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem'}}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%', backgroundColor: '#353534', border: 'none',
                  borderRadius: '0.5rem', padding: '0.75rem 1rem',
                  color: '#e5e2e1', fontSize: '0.875rem', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                <label style={{fontSize: '0.75rem', fontWeight: 600, color: '#bdc9ca', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                  Password
                </label>
                <a href="#" style={{fontSize: '0.75rem', color: '#55d8e1', textDecoration: 'none'}}>
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%', backgroundColor: '#353534', border: 'none',
                  borderRadius: '0.5rem', padding: '0.75rem 1rem',
                  color: '#e5e2e1', fontSize: '0.875rem', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: '100%', padding: '0.875rem',
                background: 'linear-gradient(135deg, #55d8e1, #007b81)',
                color: '#003739', fontWeight: 700, fontSize: '1rem',
                fontFamily: 'Manrope, sans-serif', border: 'none',
                borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            margin: '1.5rem 0'
          }}>
            <div style={{flex: 1, height: '1px', backgroundColor: 'rgba(62,73,74,0.3)'}} />
            <span style={{fontSize: '0.75rem', color: 'rgba(189,201,202,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
              or
            </span>
            <div style={{flex: 1, height: '1px', backgroundColor: 'rgba(62,73,74,0.3)'}} />
          </div>

          <p style={{textAlign: 'center', fontSize: '0.875rem', color: '#bdc9ca'}}>
            New to GlucoPulse?{' '}
            <Link to="/register" style={{color: '#55d8e1', fontWeight: 700, textDecoration: 'none'}}>
              Create Account
            </Link>
          </p>
        </div>

        <p style={{
          marginTop: '1.5rem', fontSize: '0.6875rem', color: 'rgba(189,201,202,0.6)',
          fontStyle: 'italic', textAlign: 'center', lineHeight: 1.6
        }}>
          Research Tool: Consult your healthcare provider for medical advice.
        </p>
      </div>
    </main>
  )
}
