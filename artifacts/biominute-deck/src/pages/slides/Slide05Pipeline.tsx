export default function Slide05Pipeline() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FAFBFC', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '3fr 2fr', gridTemplateRows: 'auto 1fr auto', gap: '3vh 4vw', color: '#1E3A5F' }}>

      {/* Header */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Production Pipeline</div>
          <div>2026</div>
        </div>
      </div>

      {/* Left — steps */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5vh' }}>
        <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5vh' }}>Fully Automated — No Manual Handoffs</div>
        <h2 style={{ fontSize: '3vw', fontWeight: 800, margin: '0 0 2vh 0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>The Production Pipeline</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '1.2vw', top: '3vh', bottom: '3vh', width: '2px', backgroundColor: '#E2E8F0', zIndex: 0 }} />

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.5vw', height: '2.5vw', backgroundColor: '#0D9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #FAFBFC' }}>
              <span style={{ fontSize: '1vw', fontWeight: 800, color: '#FFFFFF' }}>1</span>
            </div>
            <div style={{ background: '#FFFFFF', padding: '1.5vh 1.5vw', borderRadius: '0.6vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.4vh' }}>Read episode from master XLSX</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>Hook, VO script, visual direction, hashtags, YouTube title — all pre-loaded</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.5vw', height: '2.5vw', backgroundColor: '#0D9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #FAFBFC' }}>
              <span style={{ fontSize: '1vw', fontWeight: 800, color: '#FFFFFF' }}>2</span>
            </div>
            <div style={{ background: '#FFFFFF', padding: '1.5vh 1.5vw', borderRadius: '0.6vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.4vh' }}>Build animated scenes in React + Framer Motion</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>6 scenes per episode rendered at 1080x1920 — 9:16 vertical format</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.5vw', height: '2.5vw', backgroundColor: '#0D9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #FAFBFC' }}>
              <span style={{ fontSize: '1vw', fontWeight: 800, color: '#FFFFFF' }}>3</span>
            </div>
            <div style={{ background: '#FFFFFF', padding: '1.5vh 1.5vw', borderRadius: '0.6vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.4vh' }}>Export MP4 via Playwright headless recorder</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>Playwright + Xvfb captures the browser — no screen recording software needed</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.5vw', height: '2.5vw', backgroundColor: '#0D9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #FAFBFC' }}>
              <span style={{ fontSize: '1vw', fontWeight: 800, color: '#FFFFFF' }}>4</span>
            </div>
            <div style={{ background: '#FFFFFF', padding: '1.5vh 1.5vw', borderRadius: '0.6vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.4vh' }}>Review metadata in publishing dashboard</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>Edit YouTube title, hashtags, schedule date — all inline, no spreadsheet juggling</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.5vw', height: '2.5vw', backgroundColor: '#1E3A5F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #FAFBFC' }}>
              <span style={{ fontSize: '1vw', fontWeight: 800, color: '#FFFFFF' }}>5</span>
            </div>
            <div style={{ background: '#1E3A5F', padding: '1.5vh 1.5vw', borderRadius: '0.6vw', flex: 1, boxShadow: '0 4px 16px rgba(30,58,95,0.15)' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4vh' }}>Approve and publish to YouTube via Data API v3</div>
              <div style={{ fontSize: '0.9vw', color: '#94A3B8' }}>One-click publish with privacy control and scheduled release date</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — stat cards */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2vh' }}>
        <div style={{ background: '#FFFFFF', padding: '3.5vh 2.5vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5vh' }}>Build-to-Export Time</div>
          <div style={{ fontSize: '5vw', fontWeight: 900, color: '#1E3A5F', lineHeight: 1 }}>~30</div>
          <div style={{ fontSize: '1.3vw', fontWeight: 600, color: '#64748B', marginTop: '0.5vh' }}>min per episode</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '3.5vh 2.5vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5vh' }}>Human Handoffs</div>
          <div style={{ fontSize: '5vw', fontWeight: 900, color: '#0D9488', lineHeight: 1 }}>0</div>
          <div style={{ fontSize: '1.3vw', fontWeight: 600, color: '#64748B', marginTop: '0.5vh' }}>XLSX to YouTube</div>
        </div>

        <div style={{ padding: '2vh 2vw', backgroundColor: 'rgba(13,148,136,0.08)', borderRadius: '0.8vw', border: '1px solid rgba(13,148,136,0.2)' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8vh' }}>Stack</div>
          <div style={{ fontSize: '1vw', fontWeight: 600, color: '#1E3A5F', lineHeight: 1.6 }}>React + Framer Motion</div>
          <div style={{ fontSize: '1vw', fontWeight: 600, color: '#1E3A5F', lineHeight: 1.6 }}>Playwright + Xvfb</div>
          <div style={{ fontSize: '1vw', fontWeight: 600, color: '#1E3A5F', lineHeight: 1.6 }}>YouTube Data API v3</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '0.85vw', color: '#94A3B8', fontWeight: 500 }}>
        <div>BioMinute Shorts Studio</div>
        <div style={{ display: 'flex', gap: '1vw' }}>
          <span>Confidential</span>
          <span>•</span>
          <span>Slide 5</span>
        </div>
      </div>
    </div>
  );
}
