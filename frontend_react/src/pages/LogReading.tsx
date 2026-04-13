import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logGlucose } from '../lib/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LogReading() {
  const navigate = useNavigate()
  const [glucoseValue, setGlucoseValue] = useState(100)
  const [context, setContext] = useState('fasting')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleLog = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const loggedAt = new Date(`${date}T${time}`).toISOString()
      const res = await logGlucose({
        glucose_value: glucoseValue,
        context,
        notes,
        logged_at: loggedAt
      })
      setResult(res.data)
    } catch {
      setError('Failed to log reading. Make sure your patient profile is set up.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    backgroundColor: '#353534', border: 'none', borderRadius: '0.5rem',
    padding: '0.75rem 1rem', color: '#e5e2e1', fontSize: '0.875rem',
    outline: 'none', width: '100%', boxSizing: 'border-box' as const
  }

  const labelStyle = {
    fontSize: '0.75rem', fontWeight: 600 as const, color: '#bdc9ca',
    textTransform: 'uppercase' as const, letterSpacing: '0.1em',
    display: 'block', marginBottom: '0.5rem'
  }

  const getGlucoseColor = (value: number) => {
    if (value < 70) return '#f57c00'
    if (value > 180) return '#d32f2f'
    return '#2e7d32'
  }

  return (
    <main style={{backgroundColor: '#131313', color: '#e5e2e1', minHeight: '100vh', fontFamily: 'Inter, sans-serif'}}>
      <Navbar />
      <div style={{maxWidth: '40rem', margin: '0 auto', padding: '8rem 2rem 4rem'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginBottom: '0.5rem'}}>
          Log Glucose Reading
        </h1>
        <p style={{color: '#bdc9ca', marginBottom: '2rem', lineHeight: 1.6}}>
          Record your blood glucose level. Episodes are detected automatically.
        </p>

        {/* Glucose Value — large input */}
        <div style={{
          backgroundColor: '#1c1b1b', borderRadius: '1rem', padding: '2rem',
          border: '1px solid rgba(62,73,74,0.2)', marginBottom: '1rem', textAlign: 'center'
        }}>
          <label style={{...labelStyle, textAlign: 'center', display: 'block', marginBottom: '1rem'}}>
            Glucose Value (mg/dL)
          </label>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
            <button onClick={() => setGlucoseValue(v => Math.max(20, v - 1))} style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: 'none',
              backgroundColor: '#2a2a2a', color: '#e5e2e1', fontSize: '1.25rem',
              cursor: 'pointer', fontWeight: 700
            }}>−</button>
            <input
              type="number"
              value={glucoseValue}
              onChange={e => setGlucoseValue(+e.target.value)}
              min={20} max={600}
              style={{
                ...inputStyle, width: '8rem', textAlign: 'center',
                fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif',
                color: getGlucoseColor(glucoseValue), padding: '0.5rem'
              }}
            />
            <button onClick={() => setGlucoseValue(v => Math.min(600, v + 1))} style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: 'none',
              backgroundColor: '#2a2a2a', color: '#e5e2e1', fontSize: '1.25rem',
              cursor: 'pointer', fontWeight: 700
            }}>+</button>
          </div>
          <div style={{marginTop: '0.75rem', fontSize: '0.75rem', color: getGlucoseColor(glucoseValue), fontWeight: 600}}>
            {glucoseValue < 70 ? '⚠ Below target range' : glucoseValue > 180 ? '⚠ Above target range' : '✓ Within target range'}
          </div>
        </div>

        {/* Rest of form */}
        <div style={{
          backgroundColor: '#1c1b1b', borderRadius: '1rem', padding: '2rem',
          border: '1px solid rgba(62,73,74,0.2)', marginBottom: '1rem'
        }}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem'}}>
            <div>
              <label style={labelStyle}>Reading Context</label>
              <select value={context} onChange={e => setContext(e.target.value)} style={inputStyle}>
                <option value="fasting">Fasting</option>
                <option value="pre_meal">Pre-Meal</option>
                <option value="post_meal">Post-Meal</option>
                <option value="random">Random</option>
                <option value="bedtime">Bedtime</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Notes (optional)</label>
              <input
                type="text" value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="After exercise, felt dizzy..."
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(147,0,10,0.2)', border: '1px solid rgba(255,180,171,0.2)',
            borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem',
            fontSize: '0.875rem', color: '#ffb4ab'
          }}>
            {error}
          </div>
        )}

        {/* Episode Alert */}
        {result?.episode && (
          <div style={{
            backgroundColor: 'rgba(147,0,10,0.2)', border: '1px solid rgba(255,180,171,0.3)',
            borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem'
          }}>
            <div style={{fontWeight: 700, color: '#ffb4ab', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.875rem'}}>
              ⚠ Episode Detected
            </div>
            <div style={{fontSize: '0.875rem', color: '#e5e2e1'}}>
              {result.episode.episode_type} — {result.episode.severity} severity ({result.episode.glucose_value} mg/dL)
            </div>
          </div>
        )}

        {result && !result.episode && (
          <div style={{
            backgroundColor: 'rgba(46,125,50,0.2)', border: '1px solid rgba(129,199,132,0.3)',
            borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem'
          }}>
            <div style={{fontWeight: 700, color: '#81c784', fontSize: '0.875rem'}}>
              ✓ Reading logged successfully — {result.glucose_value} mg/dL
            </div>
          </div>
        )}

        <button
          onClick={handleLog}
          disabled={loading}
          style={{
            width: '100%', padding: '1rem',
            background: 'linear-gradient(135deg, #55d8e1, #007b81)',
            color: '#003739', fontWeight: 700, fontSize: '1rem',
            fontFamily: 'Manrope, sans-serif', border: 'none',
            borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginBottom: '1rem'
          }}
        >
          {loading ? 'Logging...' : 'Log Reading'}
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', padding: '0.875rem',
            backgroundColor: '#2a2a2a', color: '#bdc9ca',
            fontWeight: 600, fontSize: '0.875rem', border: 'none',
            borderRadius: '0.5rem', cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
      <Footer />
    </main>
  )
}
