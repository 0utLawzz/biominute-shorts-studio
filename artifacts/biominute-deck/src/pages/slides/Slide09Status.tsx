export default function Slide09Status() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FAFBFC', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '3fr 2fr', gridTemplateRows: 'auto 1fr auto', gap: '3vh 4vw', color: '#1E3A5F' }}>

      {/* Header */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Current Status</div>
          <div>Jul 2026</div>
        </div>
      </div>

      {/* Left — status checklist + progress */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1vh' }}>Where We Stand</div>
        <h2 style={{ fontSize: '3vw', fontWeight: 800, margin: '0 0 3vh 0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Pipeline is live. Publishing next.</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#FFFFFF', borderRadius: '0.6vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '1.6vw', height: '1.6vw', backgroundColor: 'rgba(13,148,136,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '0.7vw', height: '0.4vw', borderLeft: '2px solid #0D9488', borderBottom: '2px solid #0D9488', transform: 'rotate(-45deg)', marginTop: '-0.2vw' }} />
            </div>
            <div style={{ fontSize: '1.05vw', fontWeight: 600, color: '#1E3A5F' }}>Episodes 1–30 exported and production-logged</div>
            <div style={{ marginLeft: 'auto', fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', backgroundColor: 'rgba(13,148,136,0.1)', padding: '0.3vh 0.7vw', borderRadius: '1vw', whiteSpace: 'nowrap' }}>Done</div>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#FFFFFF', borderRadius: '0.6vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '1.6vw', height: '1.6vw', backgroundColor: 'rgba(13,148,136,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '0.7vw', height: '0.4vw', borderLeft: '2px solid #0D9488', borderBottom: '2px solid #0D9488', transform: 'rotate(-45deg)', marginTop: '-0.2vw' }} />
            </div>
            <div style={{ fontSize: '1.05vw', fontWeight: 600, color: '#1E3A5F' }}>36/36 episodes seeded in database with full metadata</div>
            <div style={{ marginLeft: 'auto', fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', backgroundColor: 'rgba(13,148,136,0.1)', padding: '0.3vh 0.7vw', borderRadius: '1vw', whiteSpace: 'nowrap' }}>Done</div>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#FFFFFF', borderRadius: '0.6vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '1.6vw', height: '1.6vw', backgroundColor: 'rgba(13,148,136,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '0.7vw', height: '0.4vw', borderLeft: '2px solid #0D9488', borderBottom: '2px solid #0D9488', transform: 'rotate(-45deg)', marginTop: '-0.2vw' }} />
            </div>
            <div style={{ fontSize: '1.05vw', fontWeight: 600, color: '#1E3A5F' }}>Publishing dashboard live — Neo-Brutalism UI</div>
            <div style={{ marginLeft: 'auto', fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', backgroundColor: 'rgba(13,148,136,0.1)', padding: '0.3vh 0.7vw', borderRadius: '1vw', whiteSpace: 'nowrap' }}>Done</div>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#FFFFFF', borderRadius: '0.6vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '1.6vw', height: '1.6vw', backgroundColor: 'rgba(13,148,136,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '0.7vw', height: '0.4vw', borderLeft: '2px solid #0D9488', borderBottom: '2px solid #0D9488', transform: 'rotate(-45deg)', marginTop: '-0.2vw' }} />
            </div>
            <div style={{ fontSize: '1.05vw', fontWeight: 600, color: '#1E3A5F' }}>YouTube API wired — credentials active</div>
            <div style={{ marginLeft: 'auto', fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', backgroundColor: 'rgba(13,148,136,0.1)', padding: '0.3vh 0.7vw', borderRadius: '1vw', whiteSpace: 'nowrap' }}>Done</div>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#F8FAFC', borderRadius: '0.6vw', border: '1px dashed #CBD5E1', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '1.6vw', height: '1.6vw', backgroundColor: 'rgba(201,74,0,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '0.5vw', height: '0.5vw', border: '2px solid #C94A00', borderRadius: '50%' }} />
            </div>
            <div style={{ fontSize: '1.05vw', fontWeight: 600, color: '#64748B' }}>Episodes 31–36 — next build queue</div>
            <div style={{ marginLeft: 'auto', fontSize: '0.8vw', fontWeight: 700, color: '#C94A00', backgroundColor: 'rgba(201,74,0,0.1)', padding: '0.3vh 0.7vw', borderRadius: '1vw', whiteSpace: 'nowrap' }}>In Progress</div>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#F8FAFC', borderRadius: '0.6vw', border: '1px dashed #CBD5E1', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '1.6vw', height: '1.6vw', backgroundColor: 'rgba(201,74,0,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '0.5vw', height: '0.5vw', border: '2px solid #C94A00', borderRadius: '50%' }} />
            </div>
            <div style={{ fontSize: '1.05vw', fontWeight: 600, color: '#64748B' }}>First YouTube publish run — within 48 hours</div>
            <div style={{ marginLeft: 'auto', fontSize: '0.8vw', fontWeight: 700, color: '#C94A00', backgroundColor: 'rgba(201,74,0,0.1)', padding: '0.3vh 0.7vw', borderRadius: '1vw', whiteSpace: 'nowrap' }}>In Progress</div>
          </div>
        </div>
      </div>

      {/* Right — progress visualization */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2vh' }}>
        <div style={{ background: '#FFFFFF', padding: '3vh 2.5vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5vh' }}>Episodes Complete</div>
          <div style={{ fontSize: '6vw', fontWeight: 900, color: '#1E3A5F', lineHeight: 1 }}>83<span style={{ fontSize: '3vw', color: '#0D9488' }}>%</span></div>
          <div style={{ fontSize: '1.1vw', color: '#64748B', marginTop: '0.5vh' }}>30 of 36 exported</div>
          <div style={{ marginTop: '2vh', height: '1.2vh', backgroundColor: '#E2E8F0', borderRadius: '1vw', overflow: 'hidden' }}>
            <div style={{ width: '83%', height: '100%', backgroundColor: '#0D9488', borderRadius: '1vw' }} />
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '2.5vh 2.5vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2vh' }}>System Status</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2vh' }}>
            <span style={{ fontSize: '1vw', fontWeight: 600, color: '#1E3A5F' }}>API Server</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#0D9488', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.85vw', fontWeight: 600, color: '#0D9488' }}>Running</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2vh' }}>
            <span style={{ fontSize: '1vw', fontWeight: 600, color: '#1E3A5F' }}>Dashboard</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#0D9488', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.85vw', fontWeight: 600, color: '#0D9488' }}>Running</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2vh' }}>
            <span style={{ fontSize: '1vw', fontWeight: 600, color: '#1E3A5F' }}>YouTube API</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#0D9488', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.85vw', fontWeight: 600, color: '#0D9488' }}>Connected</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1vw', fontWeight: 600, color: '#1E3A5F' }}>GitHub</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#0D9488', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.85vw', fontWeight: 600, color: '#0D9488' }}>Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '0.85vw', color: '#94A3B8', fontWeight: 500 }}>
        <div>BioMinute Shorts Studio</div>
        <div style={{ display: 'flex', gap: '1vw' }}>
          <span>Confidential</span>
          <span>•</span>
          <span>Slide 9</span>
        </div>
      </div>
    </div>
  );
}
