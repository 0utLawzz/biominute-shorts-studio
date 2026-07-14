export default function Slide02Opportunity() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FAFBFC', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto 1fr auto', gap: '3vh 4vw', color: '#1E3A5F' }}>

      {/* Header */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Market Opportunity</div>
          <div>2026</div>
        </div>
      </div>

      {/* Left — text */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          The Opportunity
        </div>
        <h2 style={{ fontSize: '3.8vw', fontWeight: 800, margin: '0 0 2.5vh 0', lineHeight: 1.1, letterSpacing: '-0.02em', textWrap: 'balance' }}>
          Short-form health content is surging.
        </h2>
        <p style={{ fontSize: '1.3vw', color: '#475569', margin: '0 0 3vh 0', lineHeight: 1.6, textWrap: 'pretty' }}>
          Audiences want credentialed, bite-sized science — and most channels aren't delivering it at scale.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', background: '#FFFFFF', padding: '1.8vh 1.5vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
            <div style={{ fontSize: '1.5vw', fontWeight: 800, color: '#0D9488', minWidth: '4vw' }}>70B+</div>
            <div style={{ fontSize: '1.1vw', color: '#475569', lineHeight: 1.4 }}>YouTube Shorts daily views globally</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', background: '#FFFFFF', padding: '1.8vh 1.5vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
            <div style={{ fontSize: '1.5vw', fontWeight: 800, color: '#0D9488', minWidth: '4vw' }}>Top 3</div>
            <div style={{ fontSize: '1.1vw', color: '#475569', lineHeight: 1.4 }}>Health &amp; wellness is among the most-searched topic categories on YouTube</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', background: '#FFFFFF', padding: '1.8vh 1.5vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
            <div style={{ fontSize: '1.5vw', fontWeight: 800, color: '#0D9488', minWidth: '4vw' }}>Gap</div>
            <div style={{ fontSize: '1.1vw', color: '#475569', lineHeight: 1.4 }}>Most health channels are low-production or unscripted — no citation, no polish</div>
          </div>
        </div>
      </div>

      {/* Right — bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ background: '#FFFFFF', padding: '3vh 2.5vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '1vh' }}>YouTube Shorts Daily Views</div>
          <div style={{ fontSize: '0.9vw', color: '#64748B', marginBottom: '3vh' }}>Billions — 2022 to 2026</div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2vw', flex: 1, borderBottom: '2px solid #E2E8F0', paddingBottom: '1vh' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#1E3A5F' }}>15B</div>
              <div style={{ width: '100%', height: '22%', backgroundColor: 'rgba(13,148,136,0.2)', borderRadius: '0.3vw 0.3vw 0 0' }} />
              <div style={{ fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>2022</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#1E3A5F' }}>30B</div>
              <div style={{ width: '100%', height: '42%', backgroundColor: 'rgba(13,148,136,0.35)', borderRadius: '0.3vw 0.3vw 0 0' }} />
              <div style={{ fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>2023</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#1E3A5F' }}>50B</div>
              <div style={{ width: '100%', height: '62%', backgroundColor: 'rgba(13,148,136,0.55)', borderRadius: '0.3vw 0.3vw 0 0' }} />
              <div style={{ fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>2024</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#1E3A5F' }}>60B</div>
              <div style={{ width: '100%', height: '80%', backgroundColor: 'rgba(13,148,136,0.75)', borderRadius: '0.3vw 0.3vw 0 0' }} />
              <div style={{ fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>2025</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#0D9488' }}>70B+</div>
              <div style={{ width: '100%', height: '100%', backgroundColor: '#0D9488', borderRadius: '0.3vw 0.3vw 0 0' }} />
              <div style={{ fontSize: '0.85vw', color: '#0D9488', fontWeight: 700 }}>2026</div>
            </div>
          </div>

          <div style={{ marginTop: '2.5vh', padding: '1.5vh 1.5vw', backgroundColor: 'rgba(13,148,136,0.08)', borderRadius: '0.5vw', border: '1px solid rgba(13,148,136,0.2)' }}>
            <div style={{ fontSize: '1vw', fontWeight: 600, color: '#0D9488' }}>BioMinute enters at peak growth momentum</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '0.85vw', color: '#94A3B8', fontWeight: 500 }}>
        <div>BioMinute Shorts Studio</div>
        <div style={{ display: 'flex', gap: '1vw' }}>
          <span>Confidential</span>
          <span>•</span>
          <span>Slide 2</span>
        </div>
      </div>
    </div>
  );
}
