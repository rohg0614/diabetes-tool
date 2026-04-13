import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReport } from '../lib/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Reports() {
  const navigate = useNavigate()
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login') }
  }, [])

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await getReport(days)
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `glucopulse_report_${days}days.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      setSuccess(true)
    } catch {
      setError('Failed to generate report. Make sure your patient profile is set up.')
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = {
    backgroundColor: '#1c1b1b', borderRadius: '1rem', padding: '1.5rem',
    border: '1px solid rgba(62,73,74,0.2)'
  }

  const periodOptions = [
    { value: 7, label: 'Last 7 Days' },
    { value: 14, label: 'Last 14 Days' },
    { value: 30, label: 'Last 30 Days' },
    { value: 60, label: 'Last 60 Days' },
    { value: 90, label: 'Last 90 Days' },
  ]

  return (
    <main style={{ backgroundColor: '#131313', color: '#e5e2e1', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '8rem 2rem 4rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginBottom: '0.5rem' }}>
          Clinical Reports
        </h1>
        <p style={{ color: '#bdc9ca', marginBottom: '2rem', lineHeight: 1.6 }}>
          Generate a doctor-facing PDF report of your diabetes management data. Includes glucose summary, episode history, estimated HbA1c, and medication adherence.
        </p>

        {/* Report Generator */}
        <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1.5rem', color: '#55d8e1' }}>
            Generate Report
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#bdc9ca', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>
              Report Period
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {periodOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDays(opt.value)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
                    cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                    backgroundColor: days === opt.value ? '#55d8e1' : '#2a2a2a',
                    color: days === opt.value ? '#003739' : '#bdc9ca',
                    transition: 'all 0.15s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: 'rgba(147,0,10,0.2)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#ffb4ab' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ backgroundColor: 'rgba(46,125,50,0.2)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#81c784' }}>
              Report downloaded successfully.
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%', padding: '1rem',
              background: 'linear-gradient(135deg, #55d8e1, #007b81)',
              color: '#003739', fontWeight: 700, fontSize: '1rem',
              fontFamily: 'Manrope, sans-serif', border: 'none',
              borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Generating Report...' : `Generate ${days}-Day Report`}
          </button>
        </div>

        {/* What's Included */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1rem', color: '#55d8e1' }}>
            What's Included
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { title: 'Patient Information', desc: 'Name, diabetes type, BMI, target glucose range, attending physician' },
              { title: 'Glucose Summary', desc: 'Average, highest, lowest, time in range, estimated HbA1c*' },
              { title: 'Recent Readings', desc: 'Last 20 glucose readings with context and timestamps' },
              { title: 'Episode History', desc: 'Hypo and hyperglycemic episodes with severity classification' },
              { title: 'Medications & Adherence', desc: 'Active medications with dosage and adherence rates' },
              { title: 'Clinical Disclaimer', desc: 'Research tool notice and HbA1c estimation caveat' },
            ].map(item => (
              <div key={item.title} style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                padding: '0.75rem', backgroundColor: '#2a2a2a', borderRadius: '0.5rem'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#55d8e1', marginTop: '0.4rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.125rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#bdc9ca' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(189,201,202,0.6)', fontStyle: 'italic', marginTop: '1rem', lineHeight: 1.6 }}>
            * Estimated HbA1c is a mathematical approximation based on average glucose. It is not a substitute for a laboratory HbA1c test.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
