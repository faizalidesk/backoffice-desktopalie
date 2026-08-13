import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { useFlavor } from '../context/FlavorContext';
import { useAuth } from '../context/AuthContext';
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
  FiLayers
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Dashboard() {
  const { activeFlavor, flavorId } = useFlavor();
  const { user } = useAuth();
  const [copiedId, setCopiedId] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('personal');

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
      <Header title="Dashboard Overview" />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        
        {/* SLEEK AMBIENT WELCOME BANNER FOR DASHBOARD OVERVIEW */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '2rem 2.25rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          {/* Ambient Decorative Gradient & Glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}66 0%, rgba(15, 23, 42, 0) 70%)`,
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none'
          }} />

          {/* Left Text Content */}
          <div style={{ position: 'relative', zIndex: 2, flex: 1, minWidth: '280px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.25rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.725rem',
              color: '#34D399',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>{activeFlavor?.shortName ? `Platform ${activeFlavor.shortName} Active` : 'Synced Workspace'}</span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              {activeFlavor?.name ? `Welcome to ${activeFlavor.name}` : 'Welcome Back, Workspace Administrator'}
            </h1>

            <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '700px', margin: 0, lineHeight: '1.55' }}>
              {activeFlavor?.description || 'Manage your public portfolio, landing page updates, QA sprint tasks, and system documentation in one centralized workspace.'}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link 
              to="/todos" 
              className="btn btn-primary"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, #8B5CF6)`,
                border: 'none',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                fontWeight: '700'
              }}
            >
              <FiCheckSquare />
              <span>To-Do Board</span>
            </Link>

            <Link 
              to="/documentation" 
              className="btn btn-secondary"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                backdropFilter: 'blur(8px)',
                fontWeight: '700'
              }}
            >
              <FiBookOpen />
              <span>Docs</span>
            </Link>
          </div>
        </div>

        {/* 6 KPI STAT CARDS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <Link to="/projects" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%' }}>
              <div className="stat-info">
                <div className="stat-label">Total Projects</div>
                <div className="stat-value">{loading ? '...' : stats.projectsCount}</div>
              </div>
              <div className="stat-icon violet">
                <FiFolder />
              </div>
            </div>
          </Link>

          <Link to="/experiments" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%' }}>
              <div className="stat-info">
                <div className="stat-label">Experiments</div>
                <div className="stat-value">{loading ? '...' : stats.experimentsCount}</div>
              </div>
              <div className="stat-icon teal">
                <FiCpu />
              </div>
            </div>
          </Link>

          <Link to="/todos" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%' }}>
              <div className="stat-info">
                <div className="stat-label">Tasks & QA</div>
                <div className="stat-value">{loading ? '...' : stats.todosCount}</div>
              </div>
              <div className="stat-icon amber">
                <FiCheckSquare />
              </div>
            </div>
          </Link>

          <Link to="/documentation" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%' }}>
              <div className="stat-info">
                <div className="stat-label">Documentation</div>
                <div className="stat-value">{loading ? '...' : stats.docsCount}</div>
              </div>
              <div className="stat-icon violet">
                <FiBookOpen />
              </div>
            </div>
          </Link>

          <Link to="/notes" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%' }}>
              <div className="stat-info">
                <div className="stat-label">Notes & Ideas</div>
                <div className="stat-value">{loading ? '...' : stats.notesCount}</div>
              </div>
              <div className="stat-icon rose">
                <FiFileText />
              </div>
            </div>
          </Link>

          <Link to="/bookmarks" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%' }}>
              <div className="stat-info">
                <div className="stat-label">Bookmarks</div>
                <div className="stat-value">{loading ? '...' : stats.bookmarksCount}</div>
              </div>
              <div className="stat-icon teal">
                <FiBookmark />
              </div>
            </div>
          </Link>
        </div>

        {/* SECTION 1: SPRINT PROGRESS & MAINTENANCE MODE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}>
          {/* Task Board Progress Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCheckSquare style={{ color: 'var(--primary)', fontSize: '1.15rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Sprint Progress & QA Tasks</h3>
              </div>
              <Link to="/todos" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>Task Board</span>
                <FiArrowRight />
              </Link>
            </div>

            {/* Progress Bar & Badges */}
            <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.825rem', fontWeight: '700' }}>
                <span>Completion Rate</span>
                <span style={{ color: 'var(--primary)' }}>{taskProgressPercent}%</span>
              </div>

              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${taskProgressPercent}%`, backgroundColor: 'var(--primary)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                <span>🔴 Not Started: {notStartedTodos}</span>
                <span>🟡 In Progress: {inProgressTodos}</span>
                <span>🟢 Done: {completedTodos}</span>
              </div>
            </div>

            {/* Task Items Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentTodos.length === 0 ? (
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.825rem' }}>No tasks on the Sprint board yet.</div>
              ) : (
                recentTodos.map(todo => (
                  <div key={todo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <FiFileText style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {todo.title}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '0.12rem 0.45rem',
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
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiTool style={{ color: 'var(--accent-teal)', fontSize: '1.15rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Maintenance Mode</h3>
                </div>
                <span className={`badge badge-${maintenance?.is_enabled ? 'rose' : 'teal'}`}>
                  {maintenance?.is_enabled ? 'Maintenance Active' : 'Website Live'}
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  {maintenance?.title || 'System Running Normally'}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  {maintenance?.message}
                </p>

                {maintenance?.is_enabled && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-rose)' }}>
                    <FiClock />
                    <span>Est. Completion: {new Date(maintenance.end_time).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <Link to="/maintenance" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <FiTool />
              <span>Manage Settings</span>
            </Link>
          </div>
        </div>

        {/* SECTION 2: SYSTEM DOCUMENTATION & KNOWLEDGE BASE QUICK SOPS */}
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiBookOpen style={{ color: 'var(--primary)', fontSize: '1.15rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Popular System Guides & Documentation</h3>
            </div>
            <Link to="/documentation" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>Manage Docs</span>
              <FiArrowRight />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {recentDocs.map(doc => (
              <Link key={doc.id} to="/documentation" style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.1rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }} className="card">
                  <div>
                    <span className="badge badge-violet" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      {doc.category || 'Guides'}
                    </span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: '1.3' }}>
                      {doc.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {doc.content}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.85rem', paddingTop: '0.4rem', borderTop: '1px solid var(--border-color)', fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                    <span>Author: {doc.author || 'Admin'}</span>
                    <FiArrowRight style={{ color: 'var(--primary)' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 3: RECENT PROJECTS SHOWCASE TABLE */}
        <div className="table-container" style={{ marginBottom: '1.75rem' }}>
          <div className="table-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiFolder style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Recent Portfolio Projects</h3>
            </div>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              <FiPlus />
              <span>Projects</span>
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading projects...</div>
          ) : recentProjects.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-subtle)' }}>No projects added yet.</div>
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
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{p.slug}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.type}</span>
                    </td>
                    <td style={{ width: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p.progress}%`, backgroundColor: 'var(--primary)', borderRadius: '99px' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${p.tone || 'violet'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to="/projects" className="btn btn-secondary btn-sm">
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Landing Page Sync Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiLayout style={{ color: 'var(--accent-teal)', fontSize: '1.15rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Landing Page Content</h3>
              </div>
              <Link to="/landing-manager" className="btn btn-secondary btn-sm">
                Edit
              </Link>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: '0.95rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.675rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.2rem' }}>
                {landing?.hero_badge || 'Independent Designer & Developer'}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: '1.3' }}>
                "{landing?.hero_title || 'Ideas, crafted into digital experiences.'}"
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {landing?.hero_description}
              </p>
            </div>

            <a href="https://desktopalie.my.id" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <span>View Main Website</span>
              <FiExternalLink />
            </a>
          </div>

          {/* System Activity Timeline Log */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FiActivity style={{ color: 'var(--primary)', fontSize: '1.15rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Recent Activity</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22C55E', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-main)' }}>QA Task Board Active</div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Kanban board active with real-time status.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-main)' }}>Documentation Synced</div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>System tree & live markdown preview enabled.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--accent-teal)', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-main)' }}>Maintenance Guard Active</div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Automated countdown & Admin bypass active.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
