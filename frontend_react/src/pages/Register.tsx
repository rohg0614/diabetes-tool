import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../lib/api'

export default function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPatient, setIsPatient] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setError('')
    setLoading(true)
    try {
      await register({ email, full_name: fullName, password, is_patient: isPatient })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
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

        <div style={{
          backgroundColor: '#1c1b1b', borderRadius: '0.75rem',
          padding: '2rem', position: 'relative', overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(to right, #55d8e1, #007b81)'
          }} />

          <h2 style={{fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '0.25rem'}}>
            Create Account
          </h2>
          <p style={{fontSize: '0.875rem', color: '#bdc9ca', marginBottom: '2rem'}}>
            Join the GlucoPulse research platform
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
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="John Smith"
                style={{
                  width: '100%', backgroundColor: '#353534', border: 'none',
                  borderRadius: '0.5rem', padding: '0.75rem 1rem',
                  color: '#e5e2e1', fontSize: '0.875rem', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

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
              <label style={{fontSize: '0.75rem', fontWeight: 600, color: '#bdc9ca', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem'}}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', backgroundColor: '#353534', border: 'none',
                  borderRadius: '0.5rem', padding: '0.75rem 1rem',
                  color: '#e5e2e1', fontSize: '0.875rem', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <input
                type="checkbox"
                id="isPatient"
                checked={isPatient}
                onChange={e => setIsPatient(e.target.checked)}
                style={{width: '1rem', height: '1rem', accentColor: '#55d8e1', cursor: 'pointer'}}
              />
              <label htmlFor="isPatient" style={{fontSize: '0.875rem', color: '#bdc9ca', cursor: 'pointer', userSelect: 'none'}}>
                I am a diabetes patient
              </label>
            </div>

            <button
              onClick={handleRegister}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <p style={{textAlign: 'center', fontSize: '0.875rem', color: '#bdc9ca', marginTop: '1.5rem'}}>
            Already have an account?{' '}
            <Link to="/login" style={{color: '#55d8e1', fontWeight: 700, textDecoration: 'none'}}>
              Sign In
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
