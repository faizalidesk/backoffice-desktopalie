import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { useFlavor } from '../context/FlavorContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { 
  FiFolder, 
  FiCpu, 
  FiFileText, 
  FiBookmark, 
  FiPlus, 
  FiArrowRight, 
  FiCheckSquare, 
  FiBookOpen, 
  FiTool, 
  FiLayout, 
  FiActivity, 
  FiClock, 
  FiExternalLink,
  FiUser,
  FiGlobe,
  FiShield,
  FiCopy,
  FiCheck,
  FiMail,
  FiMapPin,
  FiLayers,
  FiUsers,
  FiTruck,
  FiPackage,
  FiServer,
  FiFilm,
  FiDollarSign,
  FiZap,
  FiPlay,
  FiDatabase
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Dashboard() {
  const { activeFlavor, flavorId } = useFlavor();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [copiedId, setCopiedId] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('personal');
  const [memberCount, setMemberCount] = useState(5);
  const [recentMembers, setRecentMembers] = useState([]);

  const defaultStudentBio = "I am a student with a strong interest in Information Systems, web development, UI/UX design, and digital technology. I enjoy learning new technologies, working on creative projects, and developing digital solutions that combine functionality, usability, and visual design.";

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('desktopalie_profile') || localStorage.getItem(`desktopalie_profile_${user?.id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          full_name: parsed.full_name || 'Faiz ali',
          username: parsed.username || 'faiezalie',
          bio: parsed.bio || defaultStudentBio,
          avatar_url: parsed.avatar_url || '',
          location: parsed.location || 'Indonesia',
          website: parsed.website || ''
        };
      }
    } catch (e) {}
    return {
      full_name: 'Faiz ali',
      username: 'faiezalie',
      bio: defaultStudentBio,
      avatar_url: '',
      location: 'Indonesia',
      website: ''
    };
  });

  const [stats, setStats] = useState({
    projectsCount: 0,
    experimentsCount: 0,
    notesCount: 0,
    bookmarksCount: 0,
    todosCount: 0,
    docsCount: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTodos, setRecentTodos] = useState([]);
  const [recentDocs, setRecentDocs] = useState([]);
  const [maintenance, setMaintenance] = useState(null);
  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);

  // PLATFORM-SPECIFIC DEMO DATA STATES FOR BACKOFFICE DASHBOARD
  const [betaWaybills, setBetaWaybills] = useState([
    { id: 'LOG-884920-JKT', type: 'Pharma Cold-Chain Vaccines', route: 'Tanjung Priok ➔ Bandung Hub', temp: '4.2 °C', status: 'In-Transit', driver: 'Budi Santoso' },
    { id: 'LOG-772910-SUB', type: 'Frozen Seafood Export', route: 'Surabaya Port ➔ Malang Cargo', temp: '-18.5 °C', status: 'Delivered', driver: 'Agus Wijaya' },
    { id: 'LOG-552140-DPS', type: 'High-Tech Electronics', route: 'Jakarta ➔ Denpasar Cargo Hub', temp: '24.0 °C', status: 'Customs Clear', driver: 'Rian Pratama' }
  ]);

  const [gammaRenderJobs, setGammaRenderJobs] = useState([
    { id: 'JOB-9041', name: '4K_Cyberpunk_Showreel_2026.mp4', codec: 'AV1 / 60 FPS', progress: 84, speed: '142 FPS', status: 'Encoding' },
    { id: 'JOB-9042', name: 'Logistics_Drone_4K_Telemetry.mov', codec: 'HEVC H.265', progress: 100, speed: 'Done', status: 'Completed' },
    { id: 'JOB-9043', name: 'ERP_Cloud_Cluster_Overview.mkv', codec: 'ProRes 422 HQ', progress: 32, speed: '98 FPS', status: 'Encoding' }
  ]);

  const [deltaClusterNodes, setDeltaClusterNodes] = useState([
    { id: 'NODE-ASIA-SE1', region: 'Jakarta (ap-southeast-3)', cpu: '38%', mem: '14.2 / 32 GB', status: 'Healthy', latency: '12ms' },
    { id: 'NODE-SG-MAIN2', region: 'Singapore (ap-southeast-1)', cpu: '62%', mem: '28.4 / 64 GB', status: 'Healthy', latency: '18ms' },
    { id: 'NODE-US-EAST', region: 'US East (N. Virginia)', cpu: '21%', mem: '8.1 / 16 GB', status: 'Healthy', latency: '145ms' }
  ]);

  useEffect(() => {
    async function fetchDashboardProfile() {
      try {
        const p = await backofficeService.getProfile(user?.id);
        if (p) {
          setUserProfile(prev => ({
            ...prev,
            full_name: p.full_name || prev.full_name || 'Faiz ali',
            username: p.username || prev.username || 'faiezalie',
            bio: p.bio || prev.bio || defaultStudentBio,
            avatar_url: p.avatar_url || prev.avatar_url || '',
            location: p.location || prev.location || 'Indonesia',
            website: p.website || prev.website || ''
          }));
        }
      } catch (e) {}
    }

    fetchDashboardProfile();

    const handleStorage = (e) => {
      if (!e || !e.key || e.key.includes('profile')) {
        fetchDashboardProfile();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.id]);

  useEffect(() => {
    const fetchLiveMembers = () => {
      try {
        const localStr = localStorage.getItem('desktopalie_members_registry');
        if (localStr) {
          const arr = JSON.parse(localStr);
          if (Array.isArray(arr) && arr.length > 0) {
            setMemberCount(arr.length);
            setRecentMembers(arr.slice(0, 4));
          }
        }
      } catch (e) {}
    };

    fetchLiveMembers();
    window.addEventListener('storage', fetchLiveMembers);
    return () => window.removeEventListener('storage', fetchLiveMembers);
  }, []);

  const copyUserId = () => {
    const targetId = user?.id || '008e1946-712e-45ac-bb6e-3e9a1078ae64';
    navigator.clipboard.writeText(targetId);
    setCopiedId(true);
    toast.success('User ID copied to clipboard!');
    setTimeout(() => setCopiedId(false), 2000);
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeFlavor]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (activeFlavor?.dummyData) {
        const dd = activeFlavor.dummyData;
        setStats(dd.stats || {
          projectsCount: 0,
          experimentsCount: 0,
          notesCount: 0,
          bookmarksCount: 0,
          todosCount: 0,
          docsCount: 0
        });
        setRecentProjects(dd.recentProjects || []);
        setRecentTodos(dd.recentTodos || []);
        setRecentDocs(dd.recentDocs || []);
        setMaintenance(dd.maintenance || null);
        setLanding(dd.landing || null);
      } else {
        const [
          projects, 
          experiments, 
          notes, 
          bookmarks, 
          todos, 
          docs, 
          maintSettings, 
          landSettings
        ] = await Promise.all([
          backofficeService.getProjects(),
          backofficeService.getExperiments(),
          backofficeService.getNotes(),
          backofficeService.getBookmarks(),
          backofficeService.getTodos(),
          backofficeService.getDocs(),
          backofficeService.getMaintenanceSettings(flavorId),
          backofficeService.getLandingPageSettings(flavorId)
        ]);

        setStats({
          projectsCount: projects.length,
          experimentsCount: experiments.length,
          notesCount: notes.length,
          bookmarksCount: bookmarks.length,
          todosCount: todos.length,
          docsCount: docs.length
        });

        setRecentProjects(projects.slice(0, 4));
        setRecentTodos(todos.slice(0, 5));
        setRecentDocs(docs.slice(0, 3));
        setMaintenance(maintSettings);
        setLanding(landSettings);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute Task Completion Stats
  const completedTodos = recentTodos.filter(t => t.status === 'Done').length;
  const inProgressTodos = recentTodos.filter(t => t.status === 'In progress').length;
  const notStartedTodos = recentTodos.filter(t => t.status === 'Not started').length;
  const taskProgressPercent = stats.todosCount > 0 
    ? Math.round((completedTodos / (recentTodos.length || 1)) * 100) 
    : 0;
  const primaryColor = activeFlavor?.theme?.colorPrimary || '#4f46e5';

  return (
    <>
      <Header title={`${activeFlavor?.name || 'Desktopalie'} Backoffice Dashboard`} />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        
        {/* SLEEK AMBIENT WELCOME BANNER FOR DASHBOARD OVERVIEW */}
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '2.5rem 3rem',
          marginBottom: '2.25rem',
          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.75rem'
        }}>
          {/* Ambient Decorative Gradient & Glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '700px',
            height: '500px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}66 0%, rgba(15, 23, 42, 0) 70%)`,
            pointerEvents: 'none'
          }} />

          {/* Left Text Content */}
          <div style={{ position: 'relative', zIndex: 2, flex: 1, minWidth: '320px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: `${primaryColor}22`,
              border: `1px solid ${primaryColor}44`,
              padding: '0.35rem 0.95rem',
              borderRadius: '99px',
              fontSize: '0.825rem',
              color: primaryColor,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.85rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: primaryColor }} />
              <span>{activeFlavor?.shortName ? `Platform ${activeFlavor.shortName} Workspace Active` : 'Synced Workspace'}</span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '0.65rem', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              {activeFlavor?.name ? `Welcome to ${activeFlavor.name} Backoffice` : 'Welcome Back, Workspace Administrator'}
            </h1>

            <p style={{ color: '#94A3B8', fontSize: '1.05rem', margin: 0, maxWidth: '720px', lineHeight: '1.65' }}>
              {activeFlavor?.description || 'Unified management suite for system portfolio, maintenance controls, and multi-platform telemetry.'}
            </p>
          </div>

          {/* Quick Action Button Group */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link 
              to="/members" 
              className="btn"
              style={{
                backgroundColor: primaryColor,
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '0.95rem',
                padding: '0.75rem 1.4rem',
                border: 'none',
                boxShadow: `0 4px 14px ${primaryColor}66`
              }}
            >
              <FiUsers style={{ fontSize: '1.1rem' }} />
              <span>Membership</span>
            </Link>

            <Link 
              to="/documentation" 
              className="btn btn-secondary"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '0.95rem',
                padding: '0.75rem 1.4rem'
              }}
            >
              <FiBookOpen style={{ fontSize: '1.1rem' }} />
              <span>Docs</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI STAT CARDS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <Link to="/members" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%', padding: '1.5rem' }}>
              <div className="stat-info">
                <div className="stat-label" style={{ fontSize: '0.85rem' }}>Platform Members</div>
                <div className="stat-value" style={{ fontSize: '2.25rem' }}>{memberCount}</div>
              </div>
              <div className="stat-icon teal" style={{ width: '52px', height: '52px', fontSize: '1.5rem' }}>
                <FiUsers />
              </div>
            </div>
          </Link>

          <Link to="/projects" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%', padding: '1.5rem' }}>
              <div className="stat-info">
                <div className="stat-label" style={{ fontSize: '0.85rem' }}>Total Projects</div>
                <div className="stat-value" style={{ fontSize: '2.25rem' }}>{loading ? '...' : stats.projectsCount}</div>
              </div>
              <div className="stat-icon violet" style={{ width: '52px', height: '52px', fontSize: '1.5rem' }}>
                <FiFolder />
              </div>
            </div>
          </Link>

          <Link to="/todos" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%', padding: '1.5rem' }}>
              <div className="stat-info">
                <div className="stat-label" style={{ fontSize: '0.85rem' }}>Tasks & QA</div>
                <div className="stat-value" style={{ fontSize: '2.25rem' }}>{loading ? '...' : stats.todosCount}</div>
              </div>
              <div className="stat-icon amber" style={{ width: '52px', height: '52px', fontSize: '1.5rem' }}>
                <FiCheckSquare />
              </div>
            </div>
          </Link>

          <Link to="/documentation" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%', padding: '1.5rem' }}>
              <div className="stat-info">
                <div className="stat-label" style={{ fontSize: '0.85rem' }}>Documentation</div>
                <div className="stat-value" style={{ fontSize: '2.25rem' }}>{loading ? '...' : stats.docsCount}</div>
              </div>
              <div className="stat-icon violet" style={{ width: '52px', height: '52px', fontSize: '1.5rem' }}>
                <FiBookOpen />
              </div>
            </div>
          </Link>
        </div>

        {/* PLATFORM SPECIFIC LIVE TELEMETRY WIDGET SECTION */}
        {flavorId === 'platform2' && (
          <div className="card" style={{ marginBottom: '2rem', borderLeft: `4px solid ${primaryColor}`, padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiTruck style={{ color: primaryColor, fontSize: '1.4rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  Smart Logistics Cold-Chain Fleet Telemetry
                </h3>
              </div>
              <span className="badge badge-teal" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>Live Dispatch Feed</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.925rem' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`, textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1rem' }}>WAYBILL CONTAINER</th>
                    <th style={{ padding: '0.9rem 1rem' }}>CARGO TYPE</th>
                    <th style={{ padding: '0.9rem 1rem' }}>LOGISTICS ROUTE</th>
                    <th style={{ padding: '0.9rem 1rem' }}>TEMP TELEMETRY</th>
                    <th style={{ padding: '0.9rem 1rem' }}>DRIVER</th>
                    <th style={{ padding: '0.9rem 1rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {betaWaybills.map(wb => (
                    <tr key={wb.id} style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}` }}>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '800', color: primaryColor }}>{wb.id}</td>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '600' }}>{wb.type}</td>
                      <td style={{ padding: '0.95rem 1rem' }}>{wb.route}</td>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '700', color: '#10B981' }}>{wb.temp}</td>
                      <td style={{ padding: '0.95rem 1rem' }}>{wb.driver}</td>
                      <td style={{ padding: '0.95rem 1rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: '700', fontSize: '0.8rem' }}>
                          ● {wb.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {flavorId === 'platform3' && (
          <div className="card" style={{ marginBottom: '2rem', borderLeft: `4px solid ${primaryColor}`, padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiFilm style={{ color: primaryColor, fontSize: '1.4rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  AI Video Transcoder Real-Time Render Queue
                </h3>
              </div>
              <span className="badge badge-violet" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>GPU Accelerator Active</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.925rem' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`, textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1rem' }}>JOB ID</th>
                    <th style={{ padding: '0.9rem 1rem' }}>FILE NAME</th>
                    <th style={{ padding: '0.9rem 1rem' }}>TARGET CODEC</th>
                    <th style={{ padding: '0.9rem 1rem' }}>ENCODING SPEED</th>
                    <th style={{ padding: '0.9rem 1rem' }}>PROGRESS</th>
                    <th style={{ padding: '0.9rem 1rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {gammaRenderJobs.map(job => (
                    <tr key={job.id} style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}` }}>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '800', color: primaryColor }}>{job.id}</td>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '600' }}>{job.name}</td>
                      <td style={{ padding: '0.95rem 1rem' }}>{job.codec}</td>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '700', color: '#8B5CF6' }}>{job.speed}</td>
                      <td style={{ padding: '0.95rem 1rem', width: '180px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${job.progress}%`, backgroundColor: primaryColor, borderRadius: '99px' }} />
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{job.progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.95rem 1rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', fontWeight: '700', fontSize: '0.8rem' }}>
                          ● {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {flavorId === 'platform4' && (
          <div className="card" style={{ marginBottom: '2rem', borderLeft: `4px solid ${primaryColor}`, padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiServer style={{ color: primaryColor, fontSize: '1.4rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  Enterprise Cloud ERP Multi-Node Kubernetes Clusters
                </h3>
              </div>
              <span className="badge badge-amber" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>HA Cluster Synchronized</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.925rem' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`, textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1rem' }}>NODE ID</th>
                    <th style={{ padding: '0.9rem 1rem' }}>REGION CLUSTER</th>
                    <th style={{ padding: '0.9rem 1rem' }}>CPU LOAD</th>
                    <th style={{ padding: '0.9rem 1rem' }}>RAM USAGE</th>
                    <th style={{ padding: '0.9rem 1rem' }}>LATENCY</th>
                    <th style={{ padding: '0.9rem 1rem' }}>HEALTH</th>
                  </tr>
                </thead>
                <tbody>
                  {deltaClusterNodes.map(node => (
                    <tr key={node.id} style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}` }}>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '800', color: primaryColor }}>{node.id}</td>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '600' }}>{node.region}</td>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '700', color: '#F59E0B' }}>{node.cpu}</td>
                      <td style={{ padding: '0.95rem 1rem' }}>{node.mem}</td>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: '600' }}>{node.latency}</td>
                      <td style={{ padding: '0.95rem 1rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontWeight: '700', fontSize: '0.8rem' }}>
                          ● {node.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 1: SPRINT PROGRESS & MAINTENANCE MODE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2rem'
        }}>
          {/* Task Board Progress Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FiCheckSquare style={{ color: primaryColor, fontSize: '1.3rem' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Sprint Progress & QA Tasks</h3>
              </div>
              <Link to="/todos" style={{ color: primaryColor, fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Task Board</span>
                <FiArrowRight />
              </Link>
            </div>

            {/* Progress Bar & Badges */}
            <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: '1.25rem 1.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.95rem', fontWeight: '700' }}>
                <span>Completion Rate</span>
                <span style={{ color: primaryColor, fontSize: '1.05rem' }}>{taskProgressPercent}%</span>
              </div>

              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${taskProgressPercent}%`, backgroundColor: primaryColor, borderRadius: '99px', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', gap: '1.1rem', marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                <span>🔴 Not Started: {notStartedTodos}</span>
                <span>🟡 In Progress: {inProgressTodos}</span>
                <span>🟢 Done: {completedTodos}</span>
              </div>
            </div>

            {/* Task Items Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recentTodos.length === 0 ? (
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', padding: '0.5rem 0' }}>No tasks on the Sprint board yet.</div>
              ) : (
                recentTodos.map(todo => (
                  <div key={todo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                      <FiFileText style={{ color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.925rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {todo.title}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.775rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '99px',
                      backgroundColor: todo.status === 'Done' ? 'rgba(34, 197, 94, 0.15)' : todo.status === 'In progress' ? 'rgba(234, 179, 8, 0.15)' : 'var(--bg-card)',
                      color: todo.status === 'Done' ? '#16A34A' : todo.status === 'In progress' ? '#D97706' : 'var(--text-muted)'
                    }}>
                      {todo.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Maintenance Mode Status */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <FiTool style={{ color: 'var(--accent-teal)', fontSize: '1.3rem' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Maintenance Mode</h3>
                </div>
                <span className={`badge badge-${maintenance?.is_enabled ? 'rose' : 'teal'}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                  {maintenance?.is_enabled ? 'Maintenance Active' : 'Website Live'}
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', padding: '1.35rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                  {maintenance?.title || 'System Running Normally'}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
                  {maintenance?.message}
                </p>

                {maintenance?.is_enabled && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-rose)' }}>
                    <FiClock />
                    <span>Est. Completion: {new Date(maintenance.end_time).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <Link to="/maintenance" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}>
              <FiTool style={{ fontSize: '1.05rem' }} />
              <span>Manage Settings</span>
            </Link>
          </div>
        </div>

        {/* SECTION 2: SYSTEM DOCUMENTATION & KNOWLEDGE BASE QUICK SOPS */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FiBookOpen style={{ color: primaryColor, fontSize: '1.3rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Popular System Guides & Documentation</h3>
            </div>
            <Link to="/documentation" style={{ color: primaryColor, fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Manage Docs</span>
              <FiArrowRight />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {recentDocs.map(doc => (
              <Link key={doc.id} to="/documentation" style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.35rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }} className="card">
                  <div>
                    <span className="badge badge-violet" style={{ fontSize: '0.75rem', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
                      {doc.category || 'Guides'}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.45rem', lineHeight: '1.35' }}>
                      {doc.title}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                      {doc.content}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    <span>Author: {doc.author || 'Admin'}</span>
                    <FiArrowRight style={{ color: primaryColor, fontSize: '0.95rem' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 3: RECENT PROJECTS SHOWCASE TABLE */}
        <div className="table-container" style={{ marginBottom: '2rem' }}>
          <div className="table-toolbar" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FiFolder style={{ color: primaryColor, fontSize: '1.25rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0 }}>Recent Portfolio Projects</h3>
            </div>
            <Link to="/projects" className="btn btn-secondary btn-sm" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <FiPlus />
              <span>Projects</span>
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1rem' }}>Loading projects...</div>
          ) : recentProjects.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '1rem' }}>No projects added yet.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Category / Type</th>
                  <th>Completion Progress</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1rem' }}>{p.title}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>/{p.slug}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{p.type}</span>
                    </td>
                    <td style={{ width: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ flex: 1, height: '7px', backgroundColor: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p.progress}%`, backgroundColor: primaryColor, borderRadius: '99px' }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${p.tone || 'violet'}`} style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to="/projects" className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 0.95rem', fontSize: '0.875rem' }}>
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SECTION 4: LANDING PAGE CONTENT SYNC & QUICK ACTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {/* Landing Page Sync Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FiLayout style={{ color: 'var(--accent-teal)', fontSize: '1.3rem' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Landing Page Content</h3>
              </div>
              <Link to="/landing-manager" className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 0.95rem', fontSize: '0.875rem' }}>
                Edit
              </Link>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.775rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: primaryColor, fontWeight: '700', marginBottom: '0.35rem' }}>
                {landing?.hero_badge || 'Independent Designer & Developer'}
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: '1.35' }}>
                "{landing?.hero_title || 'Ideas, crafted into digital experiences.'}"
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                {landing?.hero_description}
              </p>
            </div>

            <a href="https://desktopalie.my.id" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}>
              <span>View Main Website</span>
              <FiExternalLink style={{ fontSize: '1.05rem' }} />
            </a>
          </div>

          {/* System Activity Timeline Log */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <FiActivity style={{ color: primaryColor, fontSize: '1.3rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Recent Activity</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#22C55E', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>QA Task Board Active</div>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Kanban board active with real-time status.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: primaryColor, marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>Documentation Synced</div>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>System tree & live markdown preview enabled.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--accent-teal)', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>Maintenance Guard Active</div>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Automated countdown & Admin bypass active.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
