import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { assessRisk, assessRiskPublic } from '../lib/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface RiskResult {
  risk_score: number
  risk_label: string
  risk_percentage: number
  feature_contributions: Record<string, number>
  interpretation: string
  disclaimer: string
}

export default function Risk() {
  const isLoggedIn = !!localStorage.getItem('token')

  const [form, setForm] = useState({
    age: 40, gender: 1.0, bmi: 25.0,
    high_bp: 0.0, high_cholesterol: 0.0,
    smoker: 0.0, physically_active: 1.0,
    polyuria: 0.0, polydipsia: 0.0, sudden_weight_loss: 0.0
  })

  const [result, setResult] = useState<RiskResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAssess = async () => {
    setLoading(true)
    setError('')
    try {
      const res = isLoggedIn
        ? await assessRisk(form)
        : await assessRiskPublic(form)
      setResult(res.data)
    } catch {
      setError('Failed to assess risk. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const riskColors: Record<string, string> = {
    low: '#2e7d32',
    moderate: '#f57c00',
    high: '#d32f2f'
  }

  const shapData = result
    ? Object.entries(result.feature_contributions)
        .map(([key, value]) => ({
          feature: key.replace(/_/g, ' '),
          value: parseFloat(value.toFixed(4)),
          abs: Math.abs(value)
        }))
        .sort((a, b) => b.abs - a.abs)
    : []

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

  return (
    <main style={{backgroundColor: '#131313', color: '#e5e2e1', minHeight: '100vh', fontFamily: 'Inter, sans-serif'}}>
      <Navbar />

      <div style={{maxWidth: '64rem', margin: '0 auto', padding: '8rem 2rem 4rem'}}>
        <div style={{marginBottom: '2.5rem'}}>
          <h1 style={{fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginBottom: '0.75rem'}}>
            Diabetes Risk Assessment
          </h1>
          <p style={{color: '#bdc9ca', fontSize: '1.125rem', lineHeight: 1.6}}>
            Enter your health metrics below to receive an ML-generated risk score with explainable AI.
            {!isLoggedIn && (
              <span> <Link to="/register" style={{color: '#55d8e1', textDecoration: 'none', fontWeight: 600}}>Create an account</Link> to save your results and access the full management platform.</span>
            )}
          </p>
        </div>

        {/* Form */}
        <div style={{
          backgroundColor: '#1c1b1b', borderRadius: '1rem',
          padding: '2rem', marginBottom: '2rem',
          border: '1px solid rgba(62,73,74,0.2)'
        }}>
          <h2 style={{fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1.5rem', color: '#55d8e1'}}>
            Health Information
          </h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem'}}>
            <div>
              <label style={labelStyle}>Age</label>
              <input type="number" value={form.age} onChange={e => setForm({...form, age: +e.target.value})} style={inputStyle} min={1} max={120} />
            </div>

            <div>
              <label style={labelStyle}>Gender</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: +e.target.value})} style={inputStyle}>
                <option value={1.0}>Male</option>
                <option value={0.0}>Female</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>BMI</label>
              <input type="number" value={form.bmi} onChange={e => setForm({...form, bmi: +e.target.value})} style={inputStyle} min={10} max={80} step={0.1} />
            </div>

            <div>
              <label style={labelStyle}>High Blood Pressure</label>
              <select value={form.high_bp} onChange={e => setForm({...form, high_bp: +e.target.value})} style={inputStyle}>
                <option value={0.0}>No</option>
                <option value={1.0}>Yes</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>High Cholesterol</label>
              <select value={form.high_cholesterol} onChange={e => setForm({...form, high_cholesterol: +e.target.value})} style={inputStyle}>
                <option value={0.0}>No</option>
                <option value={1.0}>Yes</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Smoker</label>
              <select value={form.smoker} onChange={e => setForm({...form, smoker: +e.target.value})} style={inputStyle}>
                <option value={0.0}>No</option>
                <option value={1.0}>Yes</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Physically Active</label>
              <select value={form.physically_active} onChange={e => setForm({...form, physically_active: +e.target.value})} style={inputStyle}>
                <option value={1.0}>Yes</option>
                <option value={0.0}>No</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Excessive Urination (Polyuria)</label>
              <select value={form.polyuria} onChange={e => setForm({...form, polyuria: +e.target.value})} style={inputStyle}>
                <option value={0.0}>No</option>
                <option value={1.0}>Yes</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Excessive Thirst (Polydipsia)</label>
              <select value={form.polydipsia} onChange={e => setForm({...form, polydipsia: +e.target.value})} style={inputStyle}>
                <option value={0.0}>No</option>
                <option value={1.0}>Yes</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Sudden Weight Loss</label>
              <select value={form.sudden_weight_loss} onChange={e => setForm({...form, sudden_weight_loss: +e.target.value})} style={inputStyle}>
                <option value={0.0}>No</option>
                <option value={1.0}>Yes</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(147,0,10,0.2)', border: '1px solid rgba(255,180,171,0.2)',
              borderRadius: '0.5rem', padding: '0.75rem', marginTop: '1.5rem',
              fontSize: '0.875rem', color: '#ffb4ab'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleAssess}
            disabled={loading}
            style={{
              marginTop: '1.5rem', width: '100%', padding: '1rem',
              background: 'linear-gradient(135deg, #55d8e1, #007b81)',
              color: '#003739', fontWeight: 700, fontSize: '1rem',
              fontFamily: 'Manrope, sans-serif', border: 'none',
              borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Assessing Risk...' : 'Assess My Risk'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {/* Score Card */}
            <div style={{
              backgroundColor: '#1c1b1b', borderRadius: '1rem', padding: '2rem',
              border: `1px solid ${riskColors[result.risk_label]}40`
            }}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1.5rem', color: '#55d8e1'}}>
                Your Risk Assessment Results
              </h2>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '3rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', color: riskColors[result.risk_label]}}>
                    {result.risk_percentage}%
                  </div>
                  <div style={{fontSize: '0.75rem', color: '#bdc9ca', textTransform: 'uppercase', letterSpacing: '0.1em'}}>Risk Score</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{
                    fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif',
                    color: riskColors[result.risk_label], textTransform: 'uppercase'
                  }}>
                    {result.risk_label}
                  </div>
                  <div style={{fontSize: '0.75rem', color: '#bdc9ca', textTransform: 'uppercase', letterSpacing: '0.1em'}}>Risk Level</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif'}}>
                    {result.risk_score.toFixed(3)}
                  </div>
                  <div style={{fontSize: '0.75rem', color: '#bdc9ca', textTransform: 'uppercase', letterSpacing: '0.1em'}}>Raw Score</div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#2a2a2a', borderRadius: '0.5rem', padding: '1rem',
                fontSize: '0.875rem', color: '#bdc9ca', lineHeight: 1.6, marginBottom: '0.75rem'
              }}>
                {result.interpretation}
              </div>

              <div style={{
                backgroundColor: 'rgba(147,0,10,0.1)', border: '1px solid rgba(255,180,171,0.15)',
                borderRadius: '0.5rem', padding: '0.75rem',
                fontSize: '0.8rem', color: '#ffb4ab', lineHeight: 1.6, fontWeight: 600
              }}>
                ⚠ {result.disclaimer}
              </div>
            </div>

            {/* SHAP Chart */}
            <div style={{
              backgroundColor: '#1c1b1b', borderRadius: '1rem', padding: '2rem',
              border: '1px solid rgba(62,73,74,0.2)'
            }}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '0.5rem'}}>
                What's Contributing to Your Score
              </h2>
              <p style={{fontSize: '0.875rem', color: '#bdc9ca', marginBottom: '1.5rem'}}>
                SHAP values show the impact of each feature on your risk prediction. Positive values increase risk, negative values decrease it.
              </p>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={shapData} layout="vertical" margin={{left: 40, right: 20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(62,73,74,0.3)" />
                  <XAxis type="number" tick={{fill: '#bdc9ca', fontSize: 12}} />
                  <YAxis type="category" dataKey="feature" tick={{fill: '#bdc9ca', fontSize: 12}} width={140} />
                  <Tooltip
                    contentStyle={{backgroundColor: '#2a2a2a', border: '1px solid #3e494a', borderRadius: '0.5rem'}}
                    labelStyle={{color: '#e5e2e1'}}
                    itemStyle={{color: '#55d8e1'}}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {shapData.map((entry, index) => (
                      <Cell key={index} fill={entry.value >= 0 ? '#d32f2f' : '#2e7d32'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {!isLoggedIn && (
              <div style={{
                backgroundColor: '#1c1b1b', borderRadius: '1rem', padding: '2rem',
                border: '1px solid rgba(85,216,225,0.2)', textAlign: 'center'
              }}>
                <h3 style={{fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1rem'}}>
                  Want to track and manage your health?
                </h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                  {[
                    {title: 'Track Glucose', desc: 'Log daily readings and detect dangerous episodes automatically.'},
                    {title: 'Manage Medications', desc: 'Set schedules, track adherence, never miss a dose.'},
                    {title: 'Export Reports', desc: 'Generate clinical PDF reports to share with your doctor.'},
                  ].map(item => (
                    <div key={item.title} style={{backgroundColor: '#2a2a2a', borderRadius: '0.75rem', padding: '1rem'}}>
                      <div style={{fontWeight: 700, color: '#55d8e1', marginBottom: '0.5rem'}}>{item.title}</div>
                      <div style={{fontSize: '0.875rem', color: '#bdc9ca'}}>{item.desc}</div>
                    </div>
                  ))}
                </div>
                <Link to="/register" style={{textDecoration: 'none'}}>
                  <button style={{
                    padding: '0.875rem 2.5rem',
                    background: 'linear-gradient(135deg, #55d8e1, #007b81)',
                    color: '#003739', fontWeight: 700, border: 'none',
                    borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem'
                  }}>
                    Create Free Account
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
