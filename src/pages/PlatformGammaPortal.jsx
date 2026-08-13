import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFlavor } from '../context/FlavorContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  FiZap, 
  FiPlay, 
  FiPause, 
  FiCpu, 
  FiActivity, 
  FiFilm, 
  FiSliders, 
  FiLogOut,
  FiCheckCircle,
  FiLayers
} from 'react-icons/fi';

export default function PlatformGammaPortal() {
  const { user, logout } = useAuth();
  const { activeFlavor } = useFlavor();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [isTranscoding, setIsTranscoding] = useState(true);

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#8B5CF6';

  const handleSignOut = async () => {
    await logout();
    navigate('/gamma/login');
  };

  return (
    <>
      <Header title="Platform Gamma Workspace (AI Video Transcoder)" />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        
        {/* HERO BANNER GAMMA MEDIA HUB */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '2.25rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}50 0%, rgba(15, 23, 42, 0) 70%)`,
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, flex: 1, minWidth: '300px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              padding: '0.25rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.75rem',
              color: '#A78BFA',
              fontWeight: '700',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              <FiZap /> Dedicated Platform Gamma Portal
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              AI Video Transcoder & Streaming Hub
            </h1>

            <p style={{ color: '#94A3B8', fontSize: '0.925rem', margin: 0, maxWidth: '750px', lineHeight: '1.55' }}>
              Ruang kerja khusus untuk pengolahan kompresi video berbasis kecerdasan buatan, enkoding multi-bitrate H.265/AV1, dan monitoring bitrate streaming real-time.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleSignOut}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <FiLogOut />
              <span>Keluar Account</span>
            </button>
          </div>
        </div>

        {/* GAMMA METRICS KPI */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Active GPU Utilization', value: '68% Load', color: primaryColor, icon: <FiCpu /> },
            { label: 'Bitrate Encoding Stream', value: '14.8 Mbps', color: '#10B981', icon: <FiActivity /> },
            { label: 'Transcode Render Speed', value: '4.2x (250 FPS)', color: '#F59E0B', icon: <FiFilm /> },
            { label: 'Active Live Stream Viewers', value: '1,420 Streams', color: '#3B82F6', icon: <FiCheckCircle /> }
          ].map((kpi, idx) => (
            <div key={idx} style={{
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{kpi.label}</span>
                <span style={{ fontSize: '1.1rem', color: kpi.color }}>{kpi.icon}</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* LIVE TRANSCODE ENGINE DASHBOARD */}
        <div style={{
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '18px',
          padding: '1.75rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
              🎬 Active Media Transcode Jobs Queue
            </h3>

            <button
              type="button"
              onClick={() => setIsTranscoding(!isTranscoding)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                backgroundColor: isTranscoding ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: isTranscoding ? '#EF4444' : '#10B981',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {isTranscoding ? <FiPause /> : <FiPlay />}
              <span>{isTranscoding ? 'Pause Engine' : 'Resume Transcoder'}</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`, textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>VIDEO FILE TITLE</th>
                  <th style={{ padding: '0.75rem 1rem' }}>INPUT RESOLUTION</th>
                  <th style={{ padding: '0.75rem 1rem' }}>TARGET PRESET</th>
                  <th style={{ padding: '0.75rem 1rem' }}>PROGRESS</th>
                  <th style={{ padding: '0.75rem 1rem' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { title: 'Project_Demo_Presentation_4K.mp4', input: '3840x2160 (RAW)', preset: 'AV1 / H.265 Adaptive', progress: 84, status: 'Transcoding' },
                  { title: 'Corporate_Event_Highlight_1080p.mov', input: '1920x1080 (ProRes)', preset: 'H.264 WebM 60fps', progress: 100, status: 'Completed' },
                  { title: 'AI_Generated_Video_Asset_082.mkv', input: '4096x2160 (HEVC)', preset: '4K Ultra HD Stream', progress: 32, status: 'Queued' }
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}` }}>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '800', color: primaryColor }}>{row.title}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>{row.input}</td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '600' }}>{row.preset}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: `${primaryColor}20`, borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${row.progress}%`, height: '100%', backgroundColor: primaryColor }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>{row.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '99px',
                        backgroundColor: row.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : (row.status === 'Transcoding' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                        color: row.status === 'Completed' ? '#10B981' : (row.status === 'Transcoding' ? '#8B5CF6' : '#F59E0B'),
                        fontWeight: '700',
                        fontSize: '0.75rem'
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
