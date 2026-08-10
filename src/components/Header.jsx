import { FiActivity, FiGlobe, FiExternalLink } from 'react-icons/fi';

export default function Header({ title = 'Dashboard Overview' }) {
  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{title}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '999px',
          backgroundColor: 'rgba(20, 184, 166, 0.1)',
          border: '1px solid rgba(20, 184, 166, 0.2)',
          fontSize: '0.78rem',
          color: '#0D9488'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#2DD4BF',
            boxShadow: '0 0 8px #2DD4BF'
          }} />
          <FiActivity style={{ fontSize: '0.85rem' }} />
          <span>Supabase Connected</span>
        </div>

        <a 
          href="http://localhost:5173" 
          target="_blank" 
          rel="noreferrer"
          className="btn btn-secondary btn-sm"
        >
          <FiGlobe />
          <span>Buka Website Utama</span>
          <FiExternalLink style={{ fontSize: '0.75rem' }} />
        </a>
      </div>
    </header>
  );
}
