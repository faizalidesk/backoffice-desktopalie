import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlavor } from '../context/FlavorContext';
import Header from '../components/Header';
import { 
  FiGrid, 
  FiCheckCircle, 
  FiArrowRight, 
  FiBox, 
  FiActivity, 
  FiServer, 
  FiHome
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PlatformWorkspacesManager() {
  const { flavorId, mainFlavor, subPlatformFlavors, switchFlavor, isMainDesktopalie } = useFlavor();
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
      <Header title="Management Platform Workspaces" />

      <main style={{ padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Banner Hero */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.25rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem'
            }}>
              <FiGrid />
            </div>
            <span style={{
              fontSize: '0.725rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--primary)'
            }}>
              DESKTOPALIE BACKOFFICE & WORKSPACES
            </span>
          </div>

          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            marginBottom: '0.4rem',
            lineHeight: '1.2'
          }}>
            Platform Workspace Backoffice
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            maxWidth: '800px',
            lineHeight: '1.5',
            margin: 0
          }}>
            <strong>Desktopalie (https://desktopalie.my.id/)</strong> berdiri sendiri sebagai Backoffice Utama. Di bawah ini Anda dapat mengelola sub-platform ekosistem terisolasi (Platform Beta, Gamma, Delta).
          </p>
        </div>

        {/* SECTION 1: DESKTOPALIE MAIN CORE BACKOFFICE */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.825rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            marginBottom: '0.85rem'
          }}>
            <FiHome style={{ color: 'var(--primary)', fontSize: '1rem' }} />
            <span>BACKOFFICE UTAMA (STANDALONE)</span>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: isMainDesktopalie ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem 2rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.75rem',
            boxShadow: isMainDesktopalie ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                <span style={{
                  fontSize: '0.675rem',
                  fontWeight: '800',
                  padding: '0.18rem 0.55rem',
                  borderRadius: '99px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  letterSpacing: '0.05em'
                }}>
                  PRIMARY CORE BACKOFFICE
                </span>
                {isMainDesktopalie && (
                  <span style={{
                    fontSize: '0.675rem',
                    fontWeight: '800',
                    padding: '0.18rem 0.55rem',
                    borderRadius: '99px',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <FiCheckCircle /> Workspace Aktif
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {mainFlavor.name} (https://desktopalie.my.id/)
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: '1.5' }}>
                Backoffice utama untuk portofolio publik, manajemen landing page, catatan, tugas, dan dokumentasi sistem inti Desktopalie.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.725rem', padding: '0.18rem 0.55rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                  ✓ Projects
                </span>
                <span style={{ fontSize: '0.725rem', padding: '0.18rem 0.55rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                  ✓ Landing Manager
                </span>
                <span style={{ fontSize: '0.725rem', padding: '0.18rem 0.55rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                  ✓ Documentation
                </span>
                <span style={{ fontSize: '0.725rem', padding: '0.18rem 0.55rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                  ✓ Tasks & Notes
                </span>
              </div>
            </div>

            <div>
              <button
                onClick={() => handleSelectPlatform('platform1', 'Desktopalie Main Backoffice')}
                className="btn btn-primary"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span>{isMainDesktopalie ? 'Sudah di Main Backoffice' : 'Masuk ke Desktopalie Main'}</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: SUB-PLATFORM WORKSPACES */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.825rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)'
            }}>
              <FiBox style={{ color: 'var(--primary)', fontSize: '1rem' }} />
              <span>SUB-PLATFORM WORKSPACES</span>
            </div>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', fontWeight: '600' }}>
              Ekosistem Sub-Platform Terisolasi
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}>
            {subPlatformFlavors.map((p) => {
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
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected 
                      ? `0 8px 20px -5px ${accentColor}25` 
                      : 'var(--shadow-sm)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = accentColor;
                      e.currentTarget.style.transform = 'translateY(-3px)';
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
                      fontSize: '0.675rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '99px',
                      border: `1px solid ${accentColor}40`
                    }}>
                      <FiCheckCircle style={{ fontSize: '0.8rem' }} />
                      Workspace Aktif
                    </div>
                  )}

                  <div>
                    {/* Platform Icon & Short Title */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      marginBottom: '1rem'
                    }}>
                      <IconComponent />
                    </div>

                    <h3 style={{
                      fontSize: '1.15rem',
                      fontWeight: '800',
                      color: 'var(--text-main)',
                      marginBottom: '0.3rem'
                    }}>
                      {p.name}
                    </h3>

                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1rem',
                      lineHeight: '1.4'
                    }}>
                      {p.description}
                    </p>

                    {/* Feature Badges */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--text-subtle)',
                        marginBottom: '0.4rem'
                      }}>
                        MODUL TERSEDIA:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {p.features?.enableProjects && (
                          <span style={{ fontSize: '0.68rem', padding: '0.12rem 0.4rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                            Projects
                          </span>
                        )}
                        {p.features?.enableExperiments && (
                          <span style={{ fontSize: '0.68rem', padding: '0.12rem 0.4rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                            Experiments
                          </span>
                        )}
                        {p.features?.enableNotes && (
                          <span style={{ fontSize: '0.68rem', padding: '0.12rem 0.4rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                            Notes
                          </span>
                        )}
                        {p.features?.enableBookmarks && (
                          <span style={{ fontSize: '0.68rem', padding: '0.12rem 0.4rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                            Bookmarks
                          </span>
                        )}
                        {p.features?.enableTodos && (
                          <span style={{ fontSize: '0.68rem', padding: '0.12rem 0.4rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                            To-Do
                          </span>
                        )}
                        {p.features?.enableDocumentation && (
                          <span style={{ fontSize: '0.68rem', padding: '0.12rem 0.4rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                            Docs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.825rem',
                      fontWeight: '700',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? `${accentColor}15` : accentColor,
                      color: isSelected ? accentColor : '#ffffff',
                      border: isSelected ? `1px solid ${accentColor}` : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
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
        </div>
      </main>
    </div>
  );
}
