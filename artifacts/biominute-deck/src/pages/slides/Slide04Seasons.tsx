export default function Slide04Seasons() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FAFBFC', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr auto auto', gap: '2vh', color: '#1E3A5F' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Content Strategy</div>
          <div>2026</div>
        </div>
      </div>

      {/* Headline */}
      <div>
        <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8vh' }}>Episode Plan</div>
        <h2 style={{ fontSize: '3.2vw', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>36 Episodes. 6 Seasons. 10 Weeks.</h2>
      </div>

      {/* Season grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '1.5vw' }}>
        <div style={{ background: '#FFFFFF', padding: '2vh 1.8vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1vh' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Season 1</div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.3vh 0.6vw', borderRadius: '1vw' }}>Ep 1–6</div>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Morning Habits</div>
          <div style={{ fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>Jul 13 – Jul 23</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '2vh 1.8vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1vh' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Season 2</div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.3vh 0.6vw', borderRadius: '1vw' }}>Ep 7–12</div>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Movement &amp; Body</div>
          <div style={{ fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>Jul 25 – Aug 4</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '2vh 1.8vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1vh' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Season 3</div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.3vh 0.6vw', borderRadius: '1vw' }}>Ep 13–18</div>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Sleep &amp; Recovery</div>
          <div style={{ fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>Aug 6 – Aug 16</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '2vh 1.8vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1vh' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Season 4</div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.3vh 0.6vw', borderRadius: '1vw' }}>Ep 19–24</div>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Stress &amp; Mind</div>
          <div style={{ fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>Aug 18 – Aug 28</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '2vh 1.8vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1vh' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Season 5</div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.3vh 0.6vw', borderRadius: '1vw' }}>Ep 25–30</div>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Nutrition &amp; Myths</div>
          <div style={{ fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>Aug 30 – Sep 11</div>
        </div>

        <div style={{ background: '#1E3A5F', padding: '2vh 1.8vw', borderRadius: '0.8vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(30,58,95,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1vh' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Season 6</div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#94A3B8', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.3vh 0.6vw', borderRadius: '1vw' }}>Ep 31–36</div>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5vh' }}>Healthy Aging &amp; Longevity</div>
          <div style={{ fontSize: '0.85vw', color: '#94A3B8', fontWeight: 500 }}>Sep 13 – Sep 25</div>
        </div>
      </div>

      {/* Timeline strip */}
      <div style={{ background: '#FFFFFF', padding: '1.5vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
        <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>Jul 13</div>
        <div style={{ flex: 1, height: '0.6vh', backgroundColor: '#E2E8F0', borderRadius: '1vw', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '83%', height: '100%', backgroundColor: '#0D9488', borderRadius: '1vw' }} />
        </div>
        <div style={{ fontSize: '0.9vw', fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>Sep 25</div>
        <div style={{ fontSize: '0.9vw', fontWeight: 700, color: '#0D9488', paddingLeft: '1vw', borderLeft: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>Every 2 days — 36 episodes</div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '0.85vw', color: '#94A3B8', fontWeight: 500 }}>
        <div>BioMinute Shorts Studio</div>
        <div style={{ display: 'flex', gap: '1vw' }}>
          <span>Confidential</span>
          <span>•</span>
          <span>Slide 4</span>
        </div>
      </div>
    </div>
  );
}
