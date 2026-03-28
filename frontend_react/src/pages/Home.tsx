import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const stats = [
  { label: 'Training Samples', value: '254,968' },
  { label: 'Model ROC-AUC', value: '0.7978' },
  { label: 'Datasets Harmonized', value: '4' },
  { label: 'CV Fold Stability', value: '±0.002' },
]

const datasets = [
  { name: 'PIMA Indians', url: 'https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database' },
  { name: 'CDC BRFSS', url: 'https://www.kaggle.com/datasets/alexteboul/diabetes-health-indicators-dataset' },
  { name: 'Sylhet Dataset', url: 'https://www.kaggle.com/datasets/ishandutta/early-stage-diabetes-risk-prediction-dataset' },
  { name: '130-US Hospitals', url: 'https://www.kaggle.com/datasets/brandao/diabetes' },
]

export default function Home() {
  return (
    <main style={{backgroundColor: '#131313', color: '#e5e2e1', minHeight: '100vh'}}>
      <Navbar />

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '0 6rem', paddingTop: '80px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '60%', height: '100%',
          background: 'linear-gradient(to left, rgba(0,123,129,0.15), transparent)',
          pointerEvents: 'none'
        }} />
        <div style={{position: 'relative', zIndex: 10, maxWidth: '56rem'}}>
          <div style={{
            marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center',
            gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '9999px',
            backgroundColor: '#2a2a2a', border: '1px solid rgba(62,73,74,0.15)'
          }}>
            <span style={{fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, color: '#bdc9ca'}}>
              Research Grade Platform
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 800,
            fontFamily: 'Manrope, sans-serif', lineHeight: 1.05,
            letterSpacing: '-0.05em', marginBottom: '2rem'
          }}>
            The Pulse of <br />
            <span style={{
              background: 'linear-gradient(to right, #55d8e1, #007b81)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Diabetes Insight.
            </span>
          </h1>
          <p style={{
            fontSize: '1.25rem', color: '#bdc9ca', fontWeight: 300,
            maxWidth: '36rem', marginBottom: '3rem', lineHeight: 1.7
          }}>
            A research-grade diabetes risk assessment and patient management platform.
            Trained on 254,968 harmonized clinical records across three demographically distinct populations.
          </p>
          <div style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>
            <Link to="/risk" style={{textDecoration: 'none'}}>
              <button style={{
                padding: '1.25rem 2.5rem', fontWeight: 700, fontSize: '1.125rem',
                borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #55d8e1, #007b81)', color: '#003739',
                boxShadow: '0 25px 50px rgba(85,216,225,0.2)',
                transition: 'transform 0.15s'
              }}>
                Diabetes Risk Assessment
              </button>
            </Link>
            <Link to="/dashboard" style={{textDecoration: 'none'}}>
              <button style={{
                padding: '1.25rem 2.5rem', fontWeight: 600, fontSize: '1.125rem',
                borderRadius: '0.75rem', cursor: 'pointer',
                backgroundColor: '#2a2a2a', border: '1px solid rgba(62,73,74,0.2)',
                color: '#e5e2e1', transition: 'background-color 0.15s'
              }}>
                Patient Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section style={{backgroundColor: '#2a2a2a', padding: '3rem 2rem'}}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'center', gap: '3rem'
        }}>
          {stats.map(stat => (
            <div key={stat.label} style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
              <span style={{fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: '#55d8e1'}}>
                {stat.label}
              </span>
              <span style={{fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif'}}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid */}
      <section style={{padding: '8rem 2rem', maxWidth: '1280px', margin: '0 auto'}}>
        <div style={{marginBottom: '5rem'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginBottom: '1rem'}}>
            Ecosystem of Precision
          </h2>
          <div style={{height: '4px', width: '6rem', backgroundColor: '#55d8e1', borderRadius: '9999px'}} />
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem'}}>
          {/* Precise Analytics */}
          <div style={{
            gridColumn: 'span 8', backgroundColor: '#1c1b1b', borderRadius: '1.5rem',
            padding: '2.5rem', minHeight: '280px', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', position: 'relative', overflow: 'hidden'
          }}>
            <div>
              <h3 style={{fontSize: '2rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1rem'}}>
                Precise Analytics
              </h3>
              <p style={{color: '#bdc9ca', lineHeight: 1.7, maxWidth: '28rem'}}>
                XGBoost model trained on 254,968 harmonized records with SHAP explainability.
                Every risk score comes with a per-feature contribution breakdown — no black boxes.
              </p>
            </div>
            <Link to="/risk" style={{textDecoration: 'none'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', color: '#55d8e1', fontWeight: 700, marginTop: '2rem', cursor: 'pointer'}}>
                <span>Try Risk Assessment</span>
                <span>→</span>
              </div>
            </Link>
            <div style={{
              position: 'absolute', right: '-5rem', bottom: '-5rem',
              width: '20rem', height: '20rem',
              backgroundColor: 'rgba(85,216,225,0.03)', borderRadius: '9999px',
              filter: 'blur(40px)'
            }} />
          </div>

          {/* Patient Tracking */}
          <div style={{
            gridColumn: 'span 4', backgroundColor: '#2a2a2a', borderRadius: '1.5rem',
            padding: '2.5rem', minHeight: '280px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center'
          }}>
            <h3 style={{fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1rem'}}>
              Patient Tracking
            </h3>
            <p style={{fontSize: '0.875rem', color: '#bdc9ca', lineHeight: 1.7}}>
              Log glucose readings with context, track medications, and get automatic
              hypo/hyperglycemic episode detection with severity classification.
            </p>
          </div>

          {/* Clinical Reports */}
          <div style={{
            gridColumn: 'span 4', backgroundColor: '#201f1f', borderRadius: '1.5rem',
            padding: '2.5rem', minHeight: '280px', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', border: '1px solid rgba(62,73,74,0.1)'
          }}>
            <h3 style={{fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Manrope, sans-serif', marginBottom: '1rem'}}>
              Clinical Reports
            </h3>
            <p style={{fontSize: '0.875rem', color: '#bdc9ca', lineHeight: 1.7}}>
              Generate doctor-facing PDF reports with time-in-range percentages,
              estimated HbA1c, episode history, and medication adherence rates.
            </p>
          </div>

          {/* Data Foundation */}
          <div style={{
            gridColumn: 'span 8', backgroundColor: '#353534', borderRadius: '1.5rem',
            minHeight: '280px', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(85,216,225,0.1), rgba(0,123,129,0.05))'
            }} />
            <div style={{padding: '2.5rem', position: 'relative', zIndex: 10}}>
              <span style={{
                fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                fontWeight: 700, color: '#55d8e1', display: 'block', marginBottom: '0.5rem'
              }}>
                Data Foundation
              </span>
              <h3 style={{
                fontSize: '1.5rem', fontWeight: 700,
                fontFamily: 'Manrope, sans-serif', marginBottom: '1.5rem'
              }}>
                Multi-Source Harmonization
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                {datasets.map(ds => (
                  <a key={ds.name} href={ds.url} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                    <div
                      style={{
                        backgroundColor: 'rgba(32,31,31,0.8)', borderRadius: '0.75rem',
                        padding: '1rem', textAlign: 'center',
                        border: '1px solid rgba(62,73,74,0.1)',
                        cursor: 'pointer', transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(85,216,225,0.4)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(62,73,74,0.1)')}
                    >
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.05em', color: '#55d8e1'
                      }}>
                        {ds.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding: '8rem 2rem'}}>
        <div style={{
          maxWidth: '64rem', margin: '0 auto', borderRadius: '3rem',
          background: 'linear-gradient(135deg, #007b81, #0e0e0e)',
          padding: '6rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{position: 'relative', zIndex: 10}}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
              fontFamily: 'Manrope, sans-serif', marginBottom: '2rem', letterSpacing: '-0.03em'
            }}>
              Ready to assess <br />your risk?
            </h2>
            <p style={{fontSize: '1.25rem', color: 'rgba(204,252,255,0.8)', marginBottom: '3rem', maxWidth: '36rem', margin: '0 auto 3rem', fontWeight: 300}}>
              Built for academic research with a HIPAA-aligned architecture.
              Designed to scale from research prototype to clinical deployment.
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link to="/risk" style={{textDecoration: 'none'}}>
                <button style={{
                  padding: '1.25rem 3rem', fontWeight: 800, borderRadius: '9999px',
                  border: 'none', cursor: 'pointer', backgroundColor: '#ccfcff', color: '#007b81'
                }}>
                  Get Started Now
                </button>
              </Link>
              <Link to="/register" style={{textDecoration: 'none'}}>
                <button style={{
                  padding: '1.25rem 3rem', fontWeight: 700, borderRadius: '9999px',
                  cursor: 'pointer', backgroundColor: 'transparent',
                  border: '1px solid rgba(204,252,255,0.3)', color: '#ccfcff'
                }}>
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
