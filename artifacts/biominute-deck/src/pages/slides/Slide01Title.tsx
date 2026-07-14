export default function Slide01Title() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FAFBFC', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '3fr 2fr', gridTemplateRows: 'auto 1fr auto', gap: '3vh 4vw', color: '#1E3A5F' }}>

      {/* Header */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Investor Brief</div>
          <div>2026</div>
        </div>
      </div>

      {/* Left — hero text + KPIs */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Health-Science Shorts Channel
        </div>
        <h1 style={{ fontSize: '5.5vw', fontWeight: 900, margin: '0 0 2vh 0', lineHeight: 1.05, letterSpacing: '-0.03em', textWrap: 'balance' }}>
          BioMinute<br />Shorts Studio
        </h1>
        <p style={{ fontSize: '1.5vw', fontWeight: 400, color: '#475569', margin: '0 0 4vh 0', lineHeight: 1.5, maxWidth: '38vw', textWrap: 'pretty' }}>
          AI-powered YouTube Shorts pipeline — from master plan spreadsheet to published video, fully automated.
        </p>

        {/* KPI cards */}
        <div style={{ display: 'flex', gap: '1.5vw' }}>
          <div style={{ background: '#FFFFFF', padding: '2.5vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#64748B', marginBottom: '1vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Episodes</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8vw' }}>
              <div style={{ fontSize: '3.2vw', fontWeight: 800, color: '#1E3A5F', lineHeight: 1 }}>36</div>
              <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#0D9488', backgroundColor: 'rgba(13,148,136,0.1)', padding: '0.3vh 0.6vw', borderRadius: '2vw' }}>Scripted</div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', padding: '2.5vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#64748B', marginBottom: '1vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seasons</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8vw' }}>
              <div style={{ fontSize: '3.2vw', fontWeight: 800, color: '#1E3A5F', lineHeight: 1 }}>6</div>
              <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#0D9488', backgroundColor: 'rgba(13,148,136,0.1)', padding: '0.3vh 0.6vw', borderRadius: '2vw' }}>Themes</div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', padding: '2.5vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#64748B', marginBottom: '1vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Launch Window</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8vw' }}>
              <div style={{ fontSize: '3.2vw', fontWeight: 800, color: '#1E3A5F', lineHeight: 1 }}>10</div>
              <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#0D9488', backgroundColor: 'rgba(13,148,136,0.1)', padding: '0.3vh 0.6vw', borderRadius: '2vw' }}>Weeks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — pipeline chart */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ background: '#FFFFFF', padding: '3vh 2.5vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '3vh' }}>Episode Pipeline Status</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh', flex: 1, justifyContent: 'center' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8vh' }}>
                <span style={{ fontSize: '0.95vw', fontWeight: 600, color: '#64748B' }}>Exported</span>
                <span style={{ fontSize: '0.95vw', fontWeight: 700, color: '#1E3A5F' }}>30 / 36</span>
              </div>
              <div style={{ height: '1.2vh', backgroundColor: '#E2E8F0', borderRadius: '1vw', overflow: 'hidden' }}>
                <div style={{ width: '83%', height: '100%', backgroundColor: '#0D9488', borderRadius: '1vw' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8vh' }}>
                <span style={{ fontSize: '0.95vw', fontWeight: 600, color: '#64748B' }}>Seeded in DB</span>
                <span style={{ fontSize: '0.95vw', fontWeight: 700, color: '#1E3A5F' }}>36 / 36</span>
              </div>
              <div style={{ height: '1.2vh', backgroundColor: '#E2E8F0', borderRadius: '1vw', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#0D9488', borderRadius: '1vw' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8vh' }}>
                <span style={{ fontSize: '0.95vw', fontWeight: 600, color: '#64748B' }}>Published</span>
                <span style={{ fontSize: '0.95vw', fontWeight: 700, color: '#1E3A5F' }}>0 / 36</span>
              </div>
              <div style={{ height: '1.2vh', backgroundColor: '#E2E8F0', borderRadius: '1vw', overflow: 'hidden' }}>
                <div style={{ width: '2%', height: '100%', backgroundColor: '#94A3B8', borderRadius: '1vw' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '3vh', padding: '2vh 1.5vw', backgroundColor: 'rgba(13,148,136,0.08)', borderRadius: '0.6vw', border: '1px solid rgba(13,148,136,0.2)' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5vh' }}>Launch Date</div>
            <div style={{ fontSize: '1.3vw', fontWeight: 700, color: '#1E3A5F' }}>July 13 – Sep 25, 2026</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '0.85vw', color: '#94A3B8', fontWeight: 500 }}>
        <div>BioMinute Shorts Studio</div>
        <div style={{ display: 'flex', gap: '1vw' }}>
          <span>Confidential</span>
          <span>•</span>
          <span>Slide 1</span>
        </div>
      </div>
    </div>
  );
}
