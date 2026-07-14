export default function Slide07TechStack() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FAFBFC', fontFamily: "'Inter', sans-serif", padding: '3vh 4vw', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr auto', gap: '2.5vh', color: '#1E3A5F' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <div style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '0.02em' }}>biominute.co</div>
        </div>
        <div style={{ display: 'flex', gap: '2vw', fontSize: '0.9vw', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div>Tech Stack</div>
          <div>2026</div>
        </div>
      </div>

      {/* Headline */}
      <div>
        <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8vh' }}>Architecture</div>
        <h2 style={{ fontSize: '3.2vw', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>Production-grade pnpm monorepo.</h2>
      </div>

      {/* Tech grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '1.5vw' }}>
        <div style={{ background: '#FFFFFF', padding: '2.5vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1vh', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Video Renderer</div>
          <div style={{ fontSize: '1.3vw', fontWeight: 800, color: '#1E3A5F' }}>React 19</div>
          <div style={{ fontSize: '0.95vw', color: '#64748B', lineHeight: 1.4 }}>+ Framer Motion + Vite</div>
          <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#94A3B8', marginTop: 'auto' }}>1080x1920 — 9:16 vertical</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '2.5vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1vh', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>API Layer</div>
          <div style={{ fontSize: '1.3vw', fontWeight: 800, color: '#1E3A5F' }}>Express 5</div>
          <div style={{ fontSize: '0.95vw', color: '#64748B', lineHeight: 1.4 }}>+ Drizzle ORM + Zod</div>
          <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#94A3B8', marginTop: 'auto' }}>OpenAPI spec — auto-generated hooks</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '2.5vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1vh', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Database</div>
          <div style={{ fontSize: '1.3vw', fontWeight: 800, color: '#1E3A5F' }}>PostgreSQL</div>
          <div style={{ fontSize: '0.95vw', color: '#64748B', lineHeight: 1.4 }}>36 episodes fully seeded</div>
          <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#94A3B8', marginTop: 'auto' }}>Drizzle migrations — type-safe ORM</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '2.5vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1vh', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dashboard</div>
          <div style={{ fontSize: '1.3vw', fontWeight: 800, color: '#1E3A5F' }}>TanStack Query</div>
          <div style={{ fontSize: '0.95vw', color: '#64748B', lineHeight: 1.4 }}>+ Tailwind CSS v4</div>
          <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#94A3B8', marginTop: 'auto' }}>Neo-Brutalism design system</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '2.5vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1vh', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Export Engine</div>
          <div style={{ fontSize: '1.3vw', fontWeight: 800, color: '#1E3A5F' }}>Playwright</div>
          <div style={{ fontSize: '0.95vw', color: '#64748B', lineHeight: 1.4 }}>+ Xvfb headless recorder</div>
          <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#94A3B8', marginTop: 'auto' }}>Browser-native MP4 capture</div>
        </div>

        <div style={{ background: '#1E3A5F', padding: '2.5vh 2vw', borderRadius: '0.8vw', display: 'flex', flexDirection: 'column', gap: '1vh', boxShadow: '0 4px 16px rgba(30,58,95,0.15)' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Publishing</div>
          <div style={{ fontSize: '1.3vw', fontWeight: 800, color: '#FFFFFF' }}>YouTube Data API v3</div>
          <div style={{ fontSize: '0.95vw', color: '#94A3B8', lineHeight: 1.4 }}>OAuth2 refresh token flow</div>
          <div style={{ fontSize: '0.85vw', fontWeight: 600, color: '#0D9488', marginTop: 'auto' }}>Publish — schedule — privacy control</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '0.85vw', color: '#94A3B8', fontWeight: 500 }}>
        <div>BioMinute Shorts Studio</div>
        <div style={{ display: 'flex', gap: '1vw' }}>
          <span>Confidential</span>
          <span>•</span>
          <span>Slide 7</span>
        </div>
      </div>
    </div>
  );
}
