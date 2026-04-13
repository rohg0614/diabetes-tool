import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMedications, addMedication, logAdherence, getAdherenceSummary } from '../lib/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Medications() {
  const navigate = useNavigate()
  const [medications, setMedications] = useState<any[]>([])
  const [adherence, setAdherence] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [markingTaken, setMarkingTaken] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'current' | 'add' | 'adherence'>('current')

  const [form, setForm] = useState({
    name: '', dosage: '', frequency: 'once daily',
    scheduled_time: '', prescribed_by: ''
  })
  const [addSuccess, setAddSuccess] = useState(false)
  const [addError, setAddError] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [medsRes, adherenceRes] = await Promise.all([
        getMedications(),
        getAdherenceSummary()
      ])
      setMedications(medsRes.data)
      setAdherence(adherenceRes.data)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const handleMarkTaken = async (medId: number) => {
    setMarkingTaken(medId)
    try {
      const now = new Date().toISOString()
      await logAdherence({ medication_id: medId, scheduled_time: now, taken_at: now, was_taken: true })
      await fetchAll()
    } finally {
      setMarkingTaken(null)
    }
  }

  const handleAdd = async () => {
    setAddError('')
    try {
      await addMedication(form)
      setAddSuccess(true)
      setForm({ name: '', dosage: '', frequency: 'once daily', scheduled_time: '', prescribed_by: '' })
      await fetchAll()
      setTimeout(() => setAddSuccess(false), 3000)
    } catch {
      setAddError('Failed to add medication. Please try again.')
    }
  }

  const cardStyle = {
    backgroundColor: '#1c1b1b', borderRadius: '1rem', padding: '1.5rem',
    border: '1px solid rgba(62,73,74,0.2)'
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

  const tabs = ['current', 'add', 'adherence'] as const
  const tabLabels = { current: 'Current Medications', add: 'Add Medication', adherence: 'Adherence' }

  return (
    <main style={{ backgroundColor: '#131313', color: '#e5e2e1', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '8rem 2rem 4rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginBottom: '2rem' }}>
          Medications
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none',
              cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
              backgroundColor: activeTab === tab ? '#55d8e1' : '#2a2a2a',
              color: activeTab === tab ? '#003739' : '#bdc9ca',
              transition: 'all 0.15s'
            }}>
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#bdc9ca', padding: '4rem' }}>Loading...</div>
        ) : (
          <>
            {/* Current Medications */}
            {activeTab === 'current' && (
              <div style={cardStyle}>
                {medications.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {medications.map((med: any) => (
                      <div key={med.id} style={{
                        backgroundColor: '#2a2a2a', borderRadius: '0.75rem', padding: '1rem',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: '1rem'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                            {med.name} <span style={{ color: '#55d8e1' }}>{med.dosage}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#bdc9ca' }}>
                            {med.frequency} | Scheduled: {med.scheduled_time || 'Not set'} | Prescribed by: {med.prescribed_by || 'N/A'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <button
                            onClick={() => handleMarkTaken(med.id)}
                            disabled={markingTaken === med.id}
                            style={{
                              padding: '0.5rem 1.25rem', fontSize: '0.875rem', fontWeight: 700,
                              background: 'linear-gradient(135deg, #55d8e1, #007b81)',
                              color: '#003739', border: 'none', borderRadius: '0.375rem',
                              cursor: 'pointer'
                            }}
                          >
                            {markingTaken === med.id ? '...' : 'Mark Taken'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#bdc9ca', padding: '3rem' }}>
                    No medications added yet. Use the Add Medication tab to get started.
                  </div>
                )}
              </div>
            )}

            {/* Add Medication */}
            {activeTab === 'add' && (
              <div style={cardStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>Medication Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Metformin" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Dosage</label>
                    <input value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })}
                      placeholder="500mg" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Frequency</label>
                    <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} style={inputStyle}>
                      <option>once daily</option>
                      <option>twice daily</option>
                      <option>three times daily</option>
                      <option>as needed</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Scheduled Times (e.g. 08:00,20:00)</label>
                    <input value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time: e.target.value })}
                      placeholder="08:00,20:00" style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Prescribed By</label>
                    <input value={form.prescribed_by} onChange={e => setForm({ ...form, prescribed_by: e.target.value })}
                      placeholder="Dr. Sharma" style={inputStyle} />
                  </div>
                </div>

                {addError && (
                  <div style={{ backgroundColor: 'rgba(147,0,10,0.2)', borderRadius: '0.5rem', padding: '0.75rem', marginTop: '1rem', fontSize: '0.875rem', color: '#ffb4ab' }}>
                    {addError}
                  </div>
                )}
                {addSuccess && (
                  <div style={{ backgroundColor: 'rgba(46,125,50,0.2)', borderRadius: '0.5rem', padding: '0.75rem', marginTop: '1rem', fontSize: '0.875rem', color: '#81c784' }}>
                    Medication added successfully.
                  </div>
                )}

                <button onClick={handleAdd} style={{
                  marginTop: '1.5rem', width: '100%', padding: '1rem',
                  background: 'linear-gradient(135deg, #55d8e1, #007b81)',
                  color: '#003739', fontWeight: 700, fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif', border: 'none',
                  borderRadius: '0.5rem', cursor: 'pointer'
                }}>
                  Add Medication
                </button>
              </div>
            )}

            {/* Adherence */}
            {activeTab === 'adherence' && (
              <div style={cardStyle}>
                {Object.keys(adherence).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(adherence).map(([medName, data]: [string, any]) => (
                      <div key={medName} style={{ backgroundColor: '#2a2a2a', borderRadius: '0.75rem', padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontWeight: 700 }}>{medName}</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', color: data.adherence_rate >= 80 ? '#2e7d32' : data.adherence_rate >= 50 ? '#f57c00' : '#d32f2f' }}>
                            {data.adherence_rate}%
                          </span>
                        </div>
                        <div style={{ backgroundColor: '#353534', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: '9999px', transition: 'width 0.3s',
                            width: `${data.adherence_rate}%`,
                            backgroundColor: data.adherence_rate >= 80 ? '#2e7d32' : data.adherence_rate >= 50 ? '#f57c00' : '#d32f2f'
                          }} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#bdc9ca', marginTop: '0.5rem' }}>
                          {data.taken} of {data.total_scheduled} doses taken
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#bdc9ca', padding: '3rem' }}>
                    No adherence data yet. Mark medications as taken to track adherence.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
