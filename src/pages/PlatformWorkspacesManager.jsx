import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlavor } from '../context/FlavorContext';
import Header from '../components/Header';
import { 
  FiGrid, 
  FiCheckCircle, 
  FiArrowRight, 
  FiFolder, 
  FiCpu, 
  FiFileText, 
  FiBookmark, 
  FiCheckSquare, 
  FiBookOpen, 
  FiLayout, 
  FiTool,
  FiBox,
  FiActivity,
  FiServer
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PlatformWorkspacesManager() {
  const { flavorId, availableFlavors, switchFlavor } = useFlavor();
  const navigate = useNavigate();

  const handleSelectPlatform = (platformId, platformName) => {
    switchFlavor(platformId);
    toast.success(`Berhasil masuk ke ${platformName}!`, {
      icon: '🚀',
      duration: 3000
    });
    navigate('/');
  };

  const getPlatformIcon = (id) => {
    switch (id) {
      case 'platform1': return FiGrid;
      case 'platform2': return FiBox;
      case 'platform3': return FiActivity;
      case 'platform4': return FiServer;
      default: return FiGrid;
    }
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <Header />

      <main style={{ padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Banner Hero */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              <FiGrid />
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--primary)'
            }}>
              MULTI-PLATFORM WORKSPACE SELECTOR
            </span>
          </div>

          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            marginBottom: '0.6rem',
            lineHeight: '1.2'
          }}>
            Pilih Platform Workspace Backoffice
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            maxWidth: '800px',
            lineHeight: '1.6'
          }}>
            Aplikasi Backoffice ini mengelola 4 platform yang terisolasi. Silakan pilih salah satu kartu platform di bawah untuk mulai mengoperasikan workspace tersebut.
          </p>
        </div>

        {/* Platform Grid (Kotak-Kotak) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.5rem'
        }}>
          {availableFlavors.map((p) => {
            const isSelected = flavorId === p.id;
            const IconComponent = getPlatformIcon(p.id);
            const accentColor = p.theme?.colorPrimary || 'var(--primary)';

            return (
              <div
                key={p.id}
                onClick={() => handleSelectPlatform(p.id, p.name)}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: isSelected 
                    ? `2px solid ${accentColor}` 
                    : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected 
                    ? `0 10px 25px -5px ${accentColor}25` 
                    : 'var(--shadow-sm)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = accentColor;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
              >
                {/* Status Active Badge */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '99px',
                    border: `1px solid ${accentColor}40`
                  }}>
                    <FiCheckCircle style={{ fontSize: '0.85rem' }} />
                    Workspace Aktif
                  </div>
                )}

                <div>
                  {/* Platform Icon & Short Title */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '1.25rem'
                  }}>
                    <IconComponent />
                  </div>

                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: 'var(--text-main)',
                    marginBottom: '0.35rem'
                  }}>
                    {p.name}
                  </h3>

                  <p style={{
                    fontSize: '0.825rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.25rem',
                    lineHeight: '1.4'
                  }}>
                    {p.description}
                  </p>

                  {/* Feature Badges */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      fontSize: '0.675rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-subtle)',
                      marginBottom: '0.5rem'
                    }}>
                      MODUL TERSEDIA:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {p.features?.enableProjects && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                          Projects
                        </span>
                      )}
                      {p.features?.enableExperiments && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                          Experiments
                        </span>
                      )}
                      {p.features?.enableNotes && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                          Notes
                        </span>
                      )}
                      {p.features?.enableBookmarks && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                          Bookmarks
                        </span>
                      )}
                      {p.features?.enableTodos && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                          To-Do
                        </span>
                      )}
                      {p.features?.enableDocumentation && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                          Docs
                        </span>
                      )}
                      {p.features?.enableLandingManager && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                          Landing Page
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? `${accentColor}15` : accentColor,
                    color: isSelected ? accentColor : '#ffffff',
                    border: isSelected ? `1px solid ${accentColor}` : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{isSelected ? 'Workspace Aktif' : `Pilih Platform ${p.shortName}`}</span>
                  <FiArrowRight />
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
