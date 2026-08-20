import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFlavor } from '../context/FlavorContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DesktopalieMark from '../components/DesktopalieMark';
import NotificationBell from '../components/NotificationBell';
import { 
  FiZap, 
  FiPlay, 
  FiPause, 
  FiCpu, 
  FiActivity, 
  FiFilm, 
  FiCheckCircle, 
  FiPlus, 
  FiRadio, 
  FiVideo,
  FiSun,
  FiMoon,
  FiLogOut
} from 'react-icons/fi';

export default function PlatformGammaPortal() {
  const { user, logout } = useAuth();
  const { activeFlavor } = useFlavor();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('queue');
  const [isTranscoding, setIsTranscoding] = useState(true);

  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newPreset, setNewPreset] = useState('4K 2160p AV1');

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#8B5CF6';

  const [queue, setQueue] = useState([
    { title: 'Project_Demo_Presentation_4K.mp4', input: '3840x2160 (RAW)', preset: 'AV1 / H.265 Adaptive', progress: 84, status: 'Transcoding', speed: '4.2x' },
    { title: 'Corporate_Event_Highlight_1080p.mov', input: '1920x1080 (ProRes)', preset: 'H.264 WebM 60fps', progress: 100, status: 'Completed', speed: '5.0x' },
    { title: 'AI_Generated_Video_Asset_082.mkv', input: '4096x2160 (HEVC)', preset: '4K Ultra HD Stream', progress: 32, status: 'Queued', speed: 'Waiting' },
    { title: 'Live_Stream_Recording_Session.flv', input: '1920x1080 (60fps)', preset: 'HLS 1080p 60fps', progress: 12, status: 'Transcoding', speed: '3.8x' }
  ]);

  // Google Cloud Transcoder & Video Intelligence States
  const [googlePreset, setGooglePreset] = useState('HLS Adaptive (1080p, 720p, 480p, 360p)');
  const [videoCaptionLang, setVideoCaptionLang] = useState('Indonesian + English (Auto SRT/VTT)');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [videoIntelligenceResult, setVideoIntelligenceResult] = useState({
    labels: ['Keynote Speaker (98%)', 'Product Demo (96%)', 'UI Workflow (94%)', 'Speech Audio (99%)'],
    detectedScenes: 14,
    captionsGenerated: '320 Segmen Subtitle Sinkron (Bahasa Indonesia & English)',
    transcoderJobId: 'projects/gamma-transcode/locations/asia-southeast2/jobs/job-88492'
  });

  const handleRunVideoIntelligence = () => {
    setIsProcessingAI(true);
    setTimeout(() => {
      setIsProcessingAI(false);
      toast.success('Google Cloud Video Intelligence & Transcoder API selesai memproses video!');
    }, 1200);
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newVideoTitle) {
      toast.error('Masukkan judul file video');
      return;
    }
    const newEntry = {
      title: newVideoTitle,
      input: '1920x1080 (MP4)',
      preset: newPreset,
      progress: 0,
      status: 'Queued',
      speed: 'Waiting'
    };
    setQueue([newEntry, ...queue]);
    setNewVideoTitle('');
    toast.success(`Berhasil menambahkan antrean transcode ${newEntry.title}!`);
  };

  const handleSignOut = async () => {
    await logout();
    toast.success('Keluar dari Platform Gamma Workspace');
    navigate('/gamma/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: isDarkMode ? '#05130E' : '#FAF9FC',
      color: isDarkMode ? '#ECFDF5' : '#0F172A',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      {/* STANDALONE PORTAL TOP HEADER */}
      <header style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <DesktopalieMark size={26} style={{ color: primaryColor }} />
            <span style={{ fontSize: '1rem', fontWeight: '800', color: isDarkMode ? '#ECFDF5' : '#0F172A', letterSpacing: '0.04em' }}>
              DESKTOPALIE GAMMA PORTAL
            </span>
          </Link>
          <span style={{ padding: '0.2rem 0.65rem', borderRadius: '99px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', border: '1px solid rgba(139, 92, 246, 0.3)', fontSize: '0.725rem', fontWeight: '700' }}>
            ● AI Video Transcoder
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
              color: isDarkMode ? '#FBBF24' : '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <NotificationBell primaryColor={primaryColor} />
              <img
                src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`}
                alt="Avatar"
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${primaryColor}`, objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
            </div>
          )}

          <button
            onClick={handleSignOut}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              backgroundColor: isDarkMode ? '#091E16' : '#F1F5F9',
              border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
              color: isDarkMode ? '#ECFDF5' : '#0F172A',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <FiLogOut />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* PORTAL MAIN CONTENT AREA */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
        
        {/* HERO BANNER GAMMA MEDIA HUB */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#05130E',
          color: '#FFFFFF',
          padding: '2.25rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(5, 19, 14, 0.25)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}50 0%, rgba(5, 19, 14, 0) 70%)`,
            pointerEvents: 'none'
          }} />

          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
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
                <FiZap /> Standalone Platform Gamma Portal
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                AI Video Transcoder & Streaming Hub
              </h1>

              <p style={{ color: '#94A3B8', fontSize: '0.925rem', margin: 0, maxWidth: '750px', lineHeight: '1.55' }}>
                Selamat datang di portal utama Platform Gamma. Ruang kerja mandiri untuk pengolahan enkoding video multi-format H.265/AV1, bitrate streaming, dan akselerasi GPU.
              </p>
            </div>
          </div>

          {/* TABBED NAVIGATION */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            overflowX: 'auto'
          }}>
            {[
              { id: 'queue', label: 'Transcode Queue & Engine', icon: <FiVideo /> },
              { id: 'google_transcoder', label: 'Google Cloud Transcoder & Video AI', icon: <FiZap /> },
              { id: 'streams', label: 'Live Bitrate Telemetry', icon: <FiRadio /> },
              { id: 'gpus', label: 'GPU Cluster & VRAM', icon: <FiCpu /> },
              { id: 'library', label: 'Transcoded Assets Library', icon: <FiFilm /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: activeTab === tab.id ? primaryColor : 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
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
              backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{kpi.label}</span>
                <span style={{ fontSize: '1.1rem', color: kpi.color }}>{kpi.icon}</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* TAB CONTENT: TRANSCODE QUEUE */}
        {activeTab === 'queue' && (
          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '18px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                🎬 AI Transcode Job Manager & Render Queue
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

            {/* Quick Add Job Form */}
            <form onSubmit={handleAddJob} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="Judul File Video (cth: Presentation_4K_Render.mp4)..."
                style={{
                  flex: 1,
                  minWidth: '240px',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
                  color: isDarkMode ? '#ECFDF5' : '#0F172A',
                  fontWeight: '600'
                }}
              />
              <select
                value={newPreset}
                onChange={(e) => setNewPreset(e.target.value)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
                  color: isDarkMode ? '#ECFDF5' : '#0F172A',
                  fontWeight: '600'
                }}
              >
                <option value="4K 2160p AV1">4K 2160p AV1</option>
                <option value="1080p 60fps H.264">1080p 60fps H.264</option>
                <option value="720p HD WebM">720p HD WebM</option>
                <option value="HLS Multi-Bitrate Stream">HLS Stream</option>
              </select>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: primaryColor,
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FiPlus />
                <span>Tambah Antrean</span>
              </button>
            </form>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`, textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>JUDUL FILE VIDEO</th>
                    <th style={{ padding: '0.85rem 1rem' }}>FORMAT INPUT</th>
                    <th style={{ padding: '0.85rem 1rem' }}>TARGET PRESET ENKODING</th>
                    <th style={{ padding: '0.85rem 1rem' }}>PROGRESS RENDER</th>
                    <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${isDarkMode ? '#133829' : '#F1F5F9'}` }}>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '800', color: primaryColor }}>{row.title}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>{row.input}</td>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '600' }}>{row.preset}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: `${primaryColor}20`, borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ width: `${row.progress}%`, height: '100%', backgroundColor: primaryColor, borderRadius: '99px' }} />
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
        )}

        {/* TAB CONTENT: GOOGLE CLOUD TRANSCODER & VIDEO INTELLIGENCE */}
        {activeTab === 'google_transcoder' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
              backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
              borderRadius: '18px',
              padding: '1.75rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <FiZap /> GOOGLE CLOUD TRANSCODER API & VIDEO INTELLIGENCE
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: isDarkMode ? '#ECFDF5' : '#0F172A', margin: '0 0 0.5rem 0' }}>
                  Adaptive Streaming & Video Intelligence Studio
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Konfigurasi pipeline enkoding video multi-bitrate HLS/DASH (1080p, 720p, 480p) berbasis Google Cloud Transcoder dan auto-generate subtitle cerdas via Video Intelligence API.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Google Transcoder Preset Output
                    </label>
                    <select
                      className="form-control"
                      value={googlePreset}
                      onChange={(e) => setGooglePreset(e.target.value)}
                      style={{ borderRadius: '10px', fontSize: '0.875rem' }}
                    >
                      <option value="HLS Adaptive (1080p, 720p, 480p, 360p)">HLS Adaptive Multi-Bitrate (1080p, 720p, 480p, 360p) [Rekomendasi]</option>
                      <option value="DASH AV1 4K UHD 60fps Stream">DASH AV1 4K UHD 60fps (High Efficiency)</option>
                      <option value="MP4 Master ProRes 422 HQ Archive">MP4 Master ProRes 422 HQ Studio Archive</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Google Video Intelligence Auto-Subtitles
                    </label>
                    <select
                      className="form-control"
                      value={videoCaptionLang}
                      onChange={(e) => setVideoCaptionLang(e.target.value)}
                      style={{ borderRadius: '10px', fontSize: '0.875rem' }}
                    >
                      <option value="Indonesian + English (Auto SRT/VTT)">Bahasa Indonesia + English (Auto SRT / WebVTT)</option>
                      <option value="Multi-Language (ID, EN, JA, AR)">Multi-Language International (ID, EN, JA, AR)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunVideoIntelligence}
                    disabled={isProcessingAI}
                    className="btn btn-primary"
                    style={{ borderRadius: '12px', padding: '0.75rem', fontWeight: '700', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: primaryColor }}
                  >
                    <FiZap /> {isProcessingAI ? 'Memproses Google Transcoder...' : 'Jalankan Transcoding & AI Subtitle'}
                  </button>
                </div>
              </div>

              {/* AI Video Intelligence Telemetry Card */}
              <div style={{
                backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hasil Analisis Google Video AI</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '99px' }}>
                      ● Cloud Job Active
                    </span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Deteksi Label Objek & Suasana:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {videoIntelligenceResult.labels.map((lbl, idx) => (
                        <span key={idx} style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`, fontSize: '0.75rem', fontWeight: '700', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                          🏷️ {lbl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Shot / Scene Change</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: primaryColor }}>{videoIntelligenceResult.detectedScenes} Adegan</div>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Subtitle Sync</span>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#10B981', marginTop: '0.25rem' }}>WebVTT Ready</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    📝 {videoIntelligenceResult.captionsGenerated}
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`, fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                  Job URI: <code>{videoIntelligenceResult.transcoderJobId}</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: GPUS */}
        {activeTab === 'gpus' && (
          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '18px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
              🖥️ Hardware GPU Transcoder Nodes
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {[
                { name: 'NVIDIA RTX 4090 Node 01', load: '68%', vram: '4.2 / 24 GB', temp: '62 °C', status: 'NVENC Active' },
                { name: 'NVIDIA RTX 4090 Node 02', load: '82%', vram: '12.8 / 24 GB', temp: '68 °C', status: 'NVENC Active' },
                { name: 'NVIDIA A100 Tensor Core', load: '45%', vram: '18.0 / 80 GB', temp: '54 °C', status: 'AV1 Hardware' }
              ].map((gpu, idx) => (
                <div key={idx} style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: isDarkMode ? '#ECFDF5' : '#0F172A', marginBottom: '0.5rem' }}>{gpu.name}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: primaryColor, marginBottom: '0.25rem' }}>{gpu.load}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>VRAM: <strong>{gpu.vram}</strong> | Temp: <strong>{gpu.temp}</strong></div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
