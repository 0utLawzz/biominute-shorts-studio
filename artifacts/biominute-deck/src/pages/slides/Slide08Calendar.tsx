export default function Slide08Calendar() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FAFBFC', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr auto auto', gap: '2vh', color: '#1E3A5F' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Content Calendar</div>
          <div>2026</div>
        </div>
      </div>

      {/* Headline + stat */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8vh' }}>Publishing Rhythm</div>
          <h2 style={{ fontSize: '3vw', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>Every 2 days — Jul 13 through Sep 25, 2026</h2>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '2vw' }}>
          <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3vh' }}>Target by Season 6</div>
          <div style={{ fontSize: '2.5vw', fontWeight: 900, color: '#0D9488', lineHeight: 1 }}>100K</div>
          <div style={{ fontSize: '0.95vw', fontWeight: 600, color: '#64748B' }}>subscribers</div>
        </div>
      </div>

      {/* Calendar visualization */}
      <div style={{ background: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2.5vw', display: 'flex', flexDirection: 'column', gap: '1.5vh', boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>

        {/* Month headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '10vw 1fr', gap: '1vw', alignItems: 'center' }}>
          <div />
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '0.5vw' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jul 13</div>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aug 1</div>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sep 1</div>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sep 25</div>
          </div>
        </div>

        {/* Season 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '10vw 1fr', gap: '1vw', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 700, color: '#1E3A5F' }}>S1 Morning Habits</div>
          <div style={{ height: '3.5vh', backgroundColor: '#F1F5F9', borderRadius: '0.4vw', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '0%', width: '17%', height: '100%', backgroundColor: '#0D9488', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', paddingLeft: '0.8vw' }}>
              <span style={{ fontSize: '0.7vw', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>Ep 1–6</span>
            </div>
          </div>
        </div>

        {/* Season 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '10vw 1fr', gap: '1vw', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 700, color: '#1E3A5F' }}>S2 Movement &amp; Body</div>
          <div style={{ height: '3.5vh', backgroundColor: '#F1F5F9', borderRadius: '0.4vw', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '18%', width: '17%', height: '100%', backgroundColor: '#0EA5A0', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', paddingLeft: '0.8vw' }}>
              <span style={{ fontSize: '0.7vw', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>Ep 7–12</span>
            </div>
          </div>
        </div>

        {/* Season 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '10vw 1fr', gap: '1vw', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 700, color: '#1E3A5F' }}>S3 Sleep &amp; Recovery</div>
          <div style={{ height: '3.5vh', backgroundColor: '#F1F5F9', borderRadius: '0.4vw', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '37%', width: '17%', height: '100%', backgroundColor: '#0D9488', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', paddingLeft: '0.8vw' }}>
              <span style={{ fontSize: '0.7vw', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>Ep 13–18</span>
            </div>
          </div>
        </div>

        {/* Season 4 */}
        <div style={{ display: 'grid', gridTemplateColumns: '10vw 1fr', gap: '1vw', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 700, color: '#1E3A5F' }}>S4 Stress &amp; Mind</div>
          <div style={{ height: '3.5vh', backgroundColor: '#F1F5F9', borderRadius: '0.4vw', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '55%', width: '17%', height: '100%', backgroundColor: '#0EA5A0', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', paddingLeft: '0.8vw' }}>
              <span style={{ fontSize: '0.7vw', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>Ep 19–24</span>
            </div>
          </div>
        </div>

        {/* Season 5 */}
        <div style={{ display: 'grid', gridTemplateColumns: '10vw 1fr', gap: '1vw', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 700, color: '#1E3A5F' }}>S5 Nutrition &amp; Myths</div>
          <div style={{ height: '3.5vh', backgroundColor: '#F1F5F9', borderRadius: '0.4vw', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '66%', width: '17%', height: '100%', backgroundColor: '#0D9488', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', paddingLeft: '0.8vw' }}>
              <span style={{ fontSize: '0.7vw', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>Ep 25–30</span>
            </div>
          </div>
        </div>

        {/* Season 6 */}
        <div style={{ display: 'grid', gridTemplateColumns: '10vw 1fr', gap: '1vw', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', fontWeight: 700, color: '#1E3A5F' }}>S6 Longevity</div>
          <div style={{ height: '3.5vh', backgroundColor: '#F1F5F9', borderRadius: '0.4vw', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '83%', width: '17%', height: '100%', backgroundColor: '#1E3A5F', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', paddingLeft: '0.8vw' }}>
              <span style={{ fontSize: '0.7vw', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>Ep 31–36</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stat strip */}
      <div style={{ display: 'flex', gap: '1.5vw' }}>
        <div style={{ flex: 1, padding: '1.5vh 2vw', background: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1.5vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ fontSize: '1.8vw', fontWeight: 900, color: '#0D9488' }}>36</div>
          <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#64748B' }}>episodes over 10 weeks</div>
        </div>
        <div style={{ flex: 1, padding: '1.5vh 2vw', background: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1.5vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ fontSize: '1.8vw', fontWeight: 900, color: '#0D9488' }}>6</div>
          <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#64748B' }}>episodes per season</div>
        </div>
        <div style={{ flex: 1, padding: '1.5vh 2vw', background: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1.5vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ fontSize: '1.8vw', fontWeight: 900, color: '#0D9488' }}>2</div>
          <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#64748B' }}>day cadence — algorithmic momentum</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '0.85vw', color: '#94A3B8', fontWeight: 500 }}>
        <div>BioMinute Shorts Studio</div>
        <div style={{ display: 'flex', gap: '1vw' }}>
          <span>Confidential</span>
          <span>•</span>
          <span>Slide 8</span>
        </div>
      </div>
    </div>
  );
}
