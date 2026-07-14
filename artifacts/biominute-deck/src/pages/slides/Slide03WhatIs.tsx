export default function Slide03WhatIs() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FAFBFC', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr auto auto', gap: '2.5vh', color: '#1E3A5F' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>The Product</div>
          <div>2026</div>
        </div>
      </div>

      {/* Section heading */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1vh' }}>What BioMinute Is</div>
        <h2 style={{ fontSize: '3.5vw', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          One insight. Sixty seconds. Every time.
        </h2>
      </div>

      {/* 3-column feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2vw' }}>
        <div style={{ background: '#FFFFFF', padding: '3vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1.5vh', boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
          <div style={{ width: '3.5vw', height: '3.5vw', backgroundColor: 'rgba(13,148,136,0.1)', borderRadius: '0.6vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.8vw', fontWeight: 900, color: '#0D9488', lineHeight: 1 }}>3s</div>
          </div>
          <div style={{ fontSize: '1.3vw', fontWeight: 700, color: '#1E3A5F' }}>Hook in 3 seconds</div>
          <div style={{ fontSize: '1.05vw', color: '#64748B', lineHeight: 1.5, textWrap: 'pretty' }}>
            Every episode opens with a counter-intuitive health claim that stops the scroll instantly.
          </div>
        </div>

        <div style={{ background: '#1E3A5F', padding: '3vh 2vw', borderRadius: '0.8vw', display: 'flex', flexDirection: 'column', gap: '1.5vh', boxShadow: '0 4px 16px rgba(30,58,95,0.15)' }}>
          <div style={{ width: '3.5vw', height: '3.5vw', backgroundColor: 'rgba(13,148,136,0.25)', borderRadius: '0.6vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.5vw', fontWeight: 900, color: '#0D9488', lineHeight: 1 }}>30s</div>
          </div>
          <div style={{ fontSize: '1.3vw', fontWeight: 700, color: '#FFFFFF' }}>Fact in 30 seconds</div>
          <div style={{ fontSize: '1.05vw', color: '#94A3B8', lineHeight: 1.5, textWrap: 'pretty' }}>
            Scripted VO narrates one peer-reviewed finding. Visual direction + thumbnail planned per episode.
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '3vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1.5vh', boxShadow: '0 4px 16px rgba(30,58,95,0.06)' }}>
          <div style={{ width: '3.5vw', height: '3.5vw', backgroundColor: 'rgba(13,148,136,0.1)', borderRadius: '0.6vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.5vw', fontWeight: 900, color: '#0D9488', lineHeight: 1 }}>10s</div>
          </div>
          <div style={{ fontSize: '1.3vw', fontWeight: 700, color: '#1E3A5F' }}>CTA in 10 seconds</div>
          <div style={{ fontSize: '1.05vw', color: '#64748B', lineHeight: 1.5, textWrap: 'pretty' }}>
            Citation CTA drives audience to primary source studies, building credibility and trust.
          </div>
        </div>
      </div>

      {/* Spec strip */}
      <div style={{ display: 'flex', gap: '1.5vw', justifyContent: 'center' }}>
        <div style={{ padding: '1.2vh 2vw', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '2vw', fontSize: '1vw', fontWeight: 600, color: '#1E3A5F', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          9:16 Vertical
        </div>
        <div style={{ padding: '1.2vh 2vw', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '2vw', fontSize: '1vw', fontWeight: 600, color: '#1E3A5F', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          1080 x 1920
        </div>
        <div style={{ padding: '1.2vh 2vw', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '2vw', fontSize: '1vw', fontWeight: 600, color: '#1E3A5F', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          30fps
        </div>
        <div style={{ padding: '1.2vh 2vw', backgroundColor: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: '2vw', fontSize: '1vw', fontWeight: 600, color: '#0D9488' }}>
          Citation CTA
        </div>
        <div style={{ padding: '1.2vh 2vw', backgroundColor: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: '2vw', fontSize: '1vw', fontWeight: 600, color: '#0D9488' }}>
          Pre-planned Hashtags
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '0.85vw', color: '#94A3B8', fontWeight: 500 }}>
        <div>BioMinute Shorts Studio</div>
        <div style={{ display: 'flex', gap: '1vw' }}>
          <span>Confidential</span>
          <span>•</span>
          <span>Slide 3</span>
        </div>
      </div>
    </div>
  );
}
