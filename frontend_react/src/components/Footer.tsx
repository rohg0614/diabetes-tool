export default function Footer() {
  return (
    <>
      <div style={{
        width: '100%', backgroundColor: '#1c1b1b',
        borderTop: '1px solid rgba(62,73,74,0.1)',
        borderBottom: '1px solid rgba(62,73,74,0.1)',
        padding: '1.5rem 2rem'
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          <span style={{fontSize: '0.75rem', fontWeight: 700, color: '#55d8e1', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap'}}>
            Notice
          </span>
          <p style={{fontSize: '0.875rem', color: '#bdc9ca', lineHeight: 1.6}}>
            This is a research tool intended for informational purposes only. It is not a substitute
            for professional medical advice, diagnosis, or treatment.{' '}
            <strong style={{color: '#e5e2e1'}}>
              Always consult with your healthcare provider regarding any medical decisions.
            </strong>
          </p>
        </div>
      </div>
      <footer style={{
        width: '100%', padding: '3rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#0e0e0e',
        borderTop: '1px solid rgba(53,53,52,0.2)',
        flexWrap: 'wrap', gap: '1.5rem'
      }}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <span style={{fontSize: '1.125rem', fontWeight: 700, color: '#55d8e1', fontFamily: 'Manrope, sans-serif'}}>GlucoPulse</span>
          <p style={{fontSize: '0.75rem', color: 'rgba(229,226,225,0.5)'}}>© 2026 GlucoPulse Precision Analytics. All medical data encrypted.</p>
        </div>
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
          {['Privacy Policy', 'Terms of Service', 'Contact Support', 'Clinical Documentation'].map(link => (
            <a key={link} href="#" style={{fontSize: '0.75rem', color: 'rgba(229,226,225,0.4)', textDecoration: 'none'}}>
              {link}
            </a>
          ))}
        </div>
      </footer>
    </>
  )
}
