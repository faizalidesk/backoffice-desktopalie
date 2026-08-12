import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlavor } from '../context/FlavorContext';
import { availableFlavors } from '../config';
import Header from '../components/Header';
import { 
  FiGrid, 
  FiCheckCircle, 
  FiArrowRight, 
  FiBox, 
  FiActivity, 
  FiServer,
  FiLayers
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PlatformWorkspacesManager() {
  const { flavorId, switchFlavor } = useFlavor();
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
      default: return FiLayers;
    }
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <Header title="Management Platform Workspaces" />

      <main style={{ padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Banner Title */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2.25rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
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
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            marginBottom: '0.35rem',
            lineHeight: '1.2'
          }}>
            Platform Workspace Backoffice
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            maxWidth: '800px',
            lineHeight: '1.5',
            margin: 0
          }}>
            Pilih salah satu platform workspace di bawah ini untuk mengelola konten, fitur, dan mode maintenance khusus platform tersebut.
          </p>
        </div>

        {/* 4 UNIFORM PLATFORM CARDS GRID */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
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
              <FiLayers style={{ color: 'var(--primary)', fontSize: '1rem' }} />
              <span>DAFTAR PLATFORM WORKSPACE</span>
            </div>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', fontWeight: '600' }}>
              4 Workspace Platform Terisolasi
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
                    padding: '1.75rem 1.5rem 1.5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
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
                      fontSize: '0.675rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                      padding: '0.22rem 0.65rem',
                      borderRadius: '99px',
                      border: `1px solid ${accentColor}40`
                    }}>
                      <FiCheckCircle style={{ fontSize: '0.8rem' }} />
                      Workspace Aktif
                    </div>
                  )}

                  <div>
                    {/* Platform Icon & Title */}
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      marginBottom: '1.25rem'
                    }}>
                      <IconComponent />
                    </div>

                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: '800',
                      color: 'var(--text-main)',
                      marginBottom: '0.35rem',
                      lineHeight: '1.3'
                    }}>
                      {p.name}
                    </h3>

                    <p style={{
                      fontSize: '0.825rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1.25rem',
                      lineHeight: '1.45',
                      minHeight: '2.8em'
                    }}>
                      {p.description}
                    </p>

                    {/* Feature Badges */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--text-subtle)',
                        marginBottom: '0.45rem'
                      }}>
                        MODUL TERSEDIA:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {p.features?.enableProjects && (
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                            Projects
                          </span>
                        )}
                        {p.features?.enableExperiments && (
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                            Experiments
                          </span>
                        )}
                        {p.features?.enableNotes && (
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                            Notes
                          </span>
                        )}
                        {p.features?.enableBookmarks && (
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                            Bookmarks
                          </span>
                        )}
                        {p.features?.enableTodos && (
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                            To-Do
                          </span>
                        )}
                        {p.features?.enableDocumentation && (
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                            Docs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Select Action Button */}
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? `${accentColor}18` : accentColor,
                      color: isSelected ? accentColor : '#ffffff',
                      border: isSelected ? `1.5px solid ${accentColor}` : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? 'none' : `0 4px 12px ${accentColor}35`
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

