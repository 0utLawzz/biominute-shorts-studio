export default function Slide10NextSteps() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#1E3A5F', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto 1fr auto', gap: '3vh 5vw', color: '#FFFFFF' }}>

      {/* Header */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em', color: '#FFFFFF' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Next Steps</div>
          <div>2026</div>
        </div>
      </div>

      {/* Left — headline + roadmap */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5vh' }}>Roadmap</div>
        <h2 style={{ fontSize: '3.5vw', fontWeight: 900, margin: '0 0 3vh 0', lineHeight: 1.05, letterSpacing: '-0.03em', textWrap: 'balance' }}>
          Five steps to the go-to health channel on short-form video.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '1.1vw', top: '2.5vh', bottom: '2.5vh', width: '2px', backgroundColor: 'rgba(255,255,255,0.1)', zIndex: 0 }} />

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.3vw', height: '2.3vw', backgroundColor: '#0D9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #1E3A5F' }}>
              <span style={{ fontSize: '0.9vw', fontWeight: 800, color: '#FFFFFF' }}>1</span>
            </div>
            <div style={{ paddingTop: '0.4vh' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.3vh' }}>Complete export of Episodes 31–36</div>
              <div style={{ fontSize: '0.9vw', color: '#94A3B8' }}>Finish the full 36-episode catalog in the pipeline</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.3vw', height: '2.3vw', backgroundColor: '#0D9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #1E3A5F' }}>
              <span style={{ fontSize: '0.9vw', fontWeight: 800, color: '#FFFFFF' }}>2</span>
            </div>
            <div style={{ paddingTop: '0.4vh' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.3vh' }}>Activate YouTube scheduled publishing for all 36 episodes</div>
              <div style={{ fontSize: '0.9vw', color: '#94A3B8' }}>Approve and schedule via dashboard — consistent 2-day cadence</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.3vw', height: '2.3vw', backgroundColor: '#0D9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #1E3A5F' }}>
              <span style={{ fontSize: '0.9vw', fontWeight: 800, color: '#FFFFFF' }}>3</span>
            </div>
            <div style={{ paddingTop: '0.4vh' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.3vh' }}>Monitor analytics — watch time, CTR, subscriber growth</div>
              <div style={{ fontSize: '0.9vw', color: '#94A3B8' }}>Feed data back into next-season topic selection</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.3vw', height: '2.3vw', backgroundColor: '#0D9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #1E3A5F' }}>
              <span style={{ fontSize: '0.9vw', fontWeight: 800, color: '#FFFFFF' }}>4</span>
            </div>
            <div style={{ paddingTop: '0.4vh' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.3vh' }}>Iterate Season 2 based on top-performing topics</div>
              <div style={{ fontSize: '0.9vw', color: '#94A3B8' }}>Data-driven topic selection for the next 36-episode block</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '2.3vw', height: '2.3vw', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid rgba(255,255,255,0.2)' }}>
              <span style={{ fontSize: '0.9vw', fontWeight: 800, color: '#FFFFFF' }}>5</span>
            </div>
            <div style={{ paddingTop: '0.4vh' }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#94A3B8', marginBottom: '0.3vh' }}>Expand to Instagram Reels + TikTok</div>
              <div style={{ fontSize: '0.9vw', color: '#64748B' }}>Same pipeline, additional distribution channels — same pipeline, no extra production cost</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — closing statement */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2.5vh' }}>
        <div style={{ background: 'rgba(13,148,136,0.12)', borderRadius: '0.8vw', border: '1px solid rgba(13,148,136,0.3)', padding: '4vh 3vw', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>The Vision</div>
          <div style={{ fontSize: '2vw', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, textWrap: 'balance' }}>
            The most credible science-health channel on short-form video — built with a fully automated studio.
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', gap: '2vw' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '2.5vw', fontWeight: 900, color: '#0D9488', lineHeight: 1 }}>100K</div>
              <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#94A3B8', marginTop: '0.5vh' }}>subscriber target</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '2.5vw', fontWeight: 900, color: '#0D9488', lineHeight: 1 }}>36</div>
              <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#94A3B8', marginTop: '0.5vh' }}>episodes ready</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '2.5vw', fontWeight: 900, color: '#0D9488', lineHeight: 1 }}>0</div>
              <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#94A3B8', marginTop: '0.5vh' }}>manual handoffs</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.8vw', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5vh 2.5vw' }}>
          <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1vh' }}>Repository</div>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FFFFFF' }}>github.com/0utLawzz/biominute-shorts-studio</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5vh', fontSize: '0.85vw', color: '#64748B', fontWeight: 500 }}>
        <div>BioMinute Shorts Studio</div>
        <div style={{ display: 'flex', gap: '1vw' }}>
          <span>Confidential</span>
          <span>•</span>
          <span>Slide 10</span>
        </div>
      </div>
    </div>
  );
}
