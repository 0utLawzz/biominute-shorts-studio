export default function Slide06Dashboard() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FAFBFC', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gridTemplateRows: 'auto 1fr auto', gap: '3vh 4vw', color: '#1E3A5F' }}>

      {/* Header */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Publishing Dashboard</div>
          <div>2026</div>
        </div>
      </div>

      {/* Left — features */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1vh' }}>Control Center</div>
        <h2 style={{ fontSize: '3vw', fontWeight: 800, margin: '0 0 2.5vh 0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Real-time publishing dashboard for all 36 episodes.</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#FFFFFF', borderRadius: '0.6vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '0.4vw', height: '3.5vh', backgroundColor: '#0D9488', borderRadius: '1vw', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '1.05vw', fontWeight: 700, color: '#1E3A5F' }}>Stats overview</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>Total, published, approved, drafts — live from DB</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#FFFFFF', borderRadius: '0.6vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '0.4vw', height: '3.5vh', backgroundColor: '#0D9488', borderRadius: '1vw', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '1.05vw', fontWeight: 700, color: '#1E3A5F' }}>Season tabs + status filters</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>Draft → review → approved → published workflow</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#FFFFFF', borderRadius: '0.6vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '0.4vw', height: '3.5vh', backgroundColor: '#0D9488', borderRadius: '1vw', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '1.05vw', fontWeight: 700, color: '#1E3A5F' }}>Inline metadata editor</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>Title, hashtags, schedule date — edit in place</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#FFFFFF', borderRadius: '0.6vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '0.4vw', height: '3.5vh', backgroundColor: '#0D9488', borderRadius: '1vw', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '1.05vw', fontWeight: 700, color: '#1E3A5F' }}>One-click YouTube publish</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>Privacy control + scheduled release via Data API v3</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'center', padding: '1.5vh 1.5vw', background: '#FFFFFF', borderRadius: '0.6vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.04)' }}>
            <div style={{ width: '0.4vw', height: '3.5vh', backgroundColor: '#0D9488', borderRadius: '1vw', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '1.05vw', fontWeight: 700, color: '#1E3A5F' }}>Next Up strip</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>3 upcoming episodes with PAST DUE / TODAY / IN N DAYS badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — dashboard mockup */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(30,58,95,0.10)' }}>
          {/* Mock navbar */}
          <div style={{ backgroundColor: '#0C0C0C', padding: '1.5vh 1.8vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.9vw', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.05em' }}>BIOMINUTE . <span style={{ color: '#0D9488' }}>SHORTS</span></div>
            <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Dashboard</div>
          </div>

          {/* Mock stats bar */}
          <div style={{ padding: '1.5vh 1.8vw', borderBottom: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1vw' }}>
            <div style={{ border: '2px solid #0C0C0C', padding: '1vh 0.8vw' }}>
              <div style={{ fontSize: '0.6vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.3vh' }}>Total</div>
              <div style={{ fontSize: '1.5vw', fontWeight: 800, color: '#1E3A5F' }}>36</div>
            </div>
            <div style={{ border: '2px solid #0C0C0C', padding: '1vh 0.8vw' }}>
              <div style={{ fontSize: '0.6vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.3vh' }}>Published</div>
              <div style={{ fontSize: '1.5vw', fontWeight: 800, color: '#8B2FC9' }}>0</div>
            </div>
            <div style={{ border: '2px solid #0C0C0C', padding: '1vh 0.8vw' }}>
              <div style={{ fontSize: '0.6vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.3vh' }}>Approved</div>
              <div style={{ fontSize: '1.5vw', fontWeight: 800, color: '#0A6B52' }}>0</div>
            </div>
            <div style={{ border: '2px solid #0C0C0C', padding: '1vh 0.8vw' }}>
              <div style={{ fontSize: '0.6vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.3vh' }}>Drafts</div>
              <div style={{ fontSize: '1.5vw', fontWeight: 800, color: '#1E3A5F' }}>35</div>
            </div>
          </div>

          {/* Mock episode cards */}
          <div style={{ padding: '1.5vh 1.8vw', flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8vw', alignContent: 'start' }}>
            <div style={{ border: '2px solid #0C0C0C', padding: '1.2vh 1vw', boxShadow: '2px 2px 0 #0C0C0C' }}>
              <div style={{ fontSize: '0.7vw', fontWeight: 800, color: '#C94A00', marginBottom: '0.5vh' }}>EP 1</div>
              <div style={{ fontSize: '0.65vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.3vh', lineHeight: 1.3 }}>Walk After Meals</div>
              <div style={{ fontSize: '0.6vw', fontWeight: 600, color: '#64748B', backgroundColor: '#E2DDD0', display: 'inline-block', padding: '0.2vh 0.4vw' }}>DRAFT</div>
            </div>
            <div style={{ border: '2px solid #0C0C0C', padding: '1.2vh 1vw', boxShadow: '2px 2px 0 #0C0C0C' }}>
              <div style={{ fontSize: '0.7vw', fontWeight: 800, color: '#C94A00', marginBottom: '0.5vh' }}>EP 2</div>
              <div style={{ fontSize: '0.65vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.3vh', lineHeight: 1.3 }}>Drink Water Before Coffee</div>
              <div style={{ fontSize: '0.6vw', fontWeight: 600, color: '#64748B', backgroundColor: '#E2DDD0', display: 'inline-block', padding: '0.2vh 0.4vw' }}>DRAFT</div>
            </div>
            <div style={{ border: '2px solid #0D9488', padding: '1.2vh 1vw', boxShadow: '2px 2px 0 #0D9488', backgroundColor: 'rgba(13,148,136,0.05)' }}>
              <div style={{ fontSize: '0.7vw', fontWeight: 800, color: '#C94A00', marginBottom: '0.5vh' }}>EP 3</div>
              <div style={{ fontSize: '0.65vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.3vh', lineHeight: 1.3 }}>Protein Timing Myths</div>
              <div style={{ fontSize: '0.6vw', fontWeight: 600, color: '#FFFFFF', backgroundColor: '#0D9488', display: 'inline-block', padding: '0.2vh 0.4vw' }}>REVIEW</div>
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
          <span>Slide 6</span>
        </div>
      </div>
    </div>
  );
}
