import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { getGlucoseLogs, getEpisodes, getMedications, logAdherence } from '../lib/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Dashboard() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState<any[]>([])
  const [episodes, setEpisodes] = useState<any[]>([])
  const [medications, setMedications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [markingTaken, setMarkingTaken] = useState<number | null>(null)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [logsRes, episodesRes, medsRes] = await Promise.all([
        getGlucoseLogs(30),
        getEpisodes(5),
        getMedications()
      ])
      setLogs(logsRes.data.reverse())
      setEpisodes(episodesRes.data)
      setMedications(medsRes.data)
    } catch {
      // patient profile may not exist yet
    } finally {
      setLoading(false)
    }
  }

  const handleMarkTaken = async (medId: number) => {
    setMarkingTaken(medId)
    try {
      const now = new Date().toISOString()
      await logAdherence({
        medication_id: medId,
        scheduled_time: now,
        taken_at: now,
        was_taken: true
      })
    } finally {
      setMarkingTaken(null)
    }
  }

  const avg = logs.length ? (logs.reduce((s, l) => s + l.glucose_value, 0) / logs.length).toFixed(1) : '--'
  const latest = logs.length ? logs[logs.length - 1]?.glucose_value : '--'
  const high = logs.length ? Math.max(...logs.map(l => l.glucose_value)) : '--'
  const low = logs.length ? Math.min(...logs.map(l => l.glucose_value)) : '--'

  const chartData = logs.map(l => ({
    time: new Date(l.logged_at).toLocaleDateString(),
    glucose: l.glucose_value
  }))

  const episodeColors: Record<string, string> = {
    hypoglycemia: '#f57c00',
    hyperglycemia: '#d32f2f'
  }

  const cardStyle = {
    backgroundColor: '#1c1b1b', borderRadius: '1rem', padding: '1.5rem',
    border: '1px solid rgba(62,73,74,0.2)'
  }

  return (
    <main style={{backgroundColor: '#131313', color: '#e5e2e1', minHeight: '100vh', fontFamily: 'Inter, sans-serif'}}>
      <Navbar />

      <div style={{maxWidth: '80rem', margin: '0 auto', padding: '8rem 2rem 4rem'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginBottom: '2rem'}}>
          Patient Dashboard
        </h1>

        {loading ? (
          <div style={{textAlign: 'center', color: '#bdc9ca', padding: '4rem'}}>Loading your data...</div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>

            {/* Metrics Row */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
              {[
                {label: 'Latest Reading', value: `${latest} mg/dL`},
                {label: 'Average (30 days)', value: `${avg} mg/dL`},
                {label: 'Highest', value: `${high} mg/dL`},
                {label: 'Lowest', value: `${low} mg/dL`},
              ].map(metric => (
                <div key={metric.label} style={{...cardStyle, textAlign: 'center'}}>
                  <div style={{fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', color: '#55d8e1', marginBottom: '0.25rem'}}>
                    {metric.value}
                  </div>
                  <div style={{fontSize: '0.75rem', color: '#bdc9ca', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Glucose Chart */}
            <div style={cardStyle}>
              <h2 style={{fontSize: '1.125rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1rem', color: '#55d8e1'}}>
                Glucose Trend — Last 30 Readings
              </h2>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(62,73,74,0.3)" />
                    <XAxis dataKey="time" tick={{fill: '#bdc9ca', fontSize: 11}} />
                    <YAxis tick={{fill: '#bdc9ca', fontSize: 11}} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{backgroundColor: '#2a2a2a', border: '1px solid #3e494a', borderRadius: '0.5rem'}}
                      labelStyle={{color: '#e5e2e1'}}
                      itemStyle={{color: '#55d8e1'}}
                    />
                    <ReferenceLine y={180} stroke="#d32f2f" strokeDasharray="4 4" label={{value: 'High', fill: '#d32f2f', fontSize: 11}} />
                    <ReferenceLine y={70} stroke="#f57c00" strokeDasharray="4 4" label={{value: 'Low', fill: '#f57c00', fontSize: 11}} />
                    <Line type="monotone" dataKey="glucose" stroke="#55d8e1" strokeWidth={2} dot={{fill: '#55d8e1', r: 3}} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{textAlign: 'center', color: '#bdc9ca', padding: '3rem'}}>
                  No glucose readings yet. Start logging from the Log Reading page.
                </div>
              )}
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
              {/* Recent Episodes */}
              <div style={cardStyle}>
                <h2 style={{fontSize: '1.125rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1rem', color: '#55d8e1'}}>
                  Recent Episodes
                </h2>
                {episodes.length > 0 ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                    {episodes.map((ep: any) => (
                      <div key={ep.id} style={{
                        backgroundColor: '#2a2a2a', borderRadius: '0.5rem', padding: '0.75rem',
                        borderLeft: `3px solid ${episodeColors[ep.episode_type] || '#55d8e1'}`
                      }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <span style={{fontWeight: 700, color: episodeColors[ep.episode_type], textTransform: 'uppercase', fontSize: '0.75rem'}}>
                            {ep.episode_type}
                          </span>
                          <span style={{fontSize: '0.75rem', color: '#bdc9ca'}}>
                            {new Date(ep.occurred_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{fontSize: '0.875rem', color: '#e5e2e1', marginTop: '0.25rem'}}>
                          {ep.glucose_value} mg/dL — <span style={{color: '#bdc9ca'}}>{ep.severity} severity</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{color: '#bdc9ca', fontSize: '0.875rem', textAlign: 'center', padding: '2rem'}}>
                    No episodes detected. Glucose levels within range.
                  </div>
                )}
              </div>

              {/* Medications */}
              <div style={cardStyle}>
                <h2 style={{fontSize: '1.125rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1rem', color: '#55d8e1'}}>
                  Today's Medications
                </h2>
                {medications.length > 0 ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                    {medications.map((med: any) => (
                      <div key={med.id} style={{
                        backgroundColor: '#2a2a2a', borderRadius: '0.5rem', padding: '0.75rem',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <div>
                          <div style={{fontWeight: 600, fontSize: '0.875rem'}}>{med.name} — {med.dosage}</div>
                          <div style={{fontSize: '0.75rem', color: '#bdc9ca'}}>{med.frequency} | {med.scheduled_time}</div>
                        </div>
                        <button
                          onClick={() => handleMarkTaken(med.id)}
                          disabled={markingTaken === med.id}
                          style={{
                            padding: '0.4rem 0.875rem', fontSize: '0.75rem', fontWeight: 700,
                            background: 'linear-gradient(135deg, #55d8e1, #007b81)',
                            color: '#003739', border: 'none', borderRadius: '0.375rem',
                            cursor: 'pointer', whiteSpace: 'nowrap'
                          }}
                        >
                          {markingTaken === med.id ? '...' : 'Mark Taken'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{color: '#bdc9ca', fontSize: '0.875rem', textAlign: 'center', padding: '2rem'}}>
                    No medications added yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
