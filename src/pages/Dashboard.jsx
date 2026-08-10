import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
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
  FiCheckCircle, 
  FiClock, 
  FiShield, 
  FiExternalLink,
  FiTrendingUp
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Dashboard() {
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
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
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
        backofficeService.getMaintenanceSettings(),
        backofficeService.getLandingPageSettings()
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

  return (
    <>
      <Header title="Dashboard Overview" />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        {/* EXECUTIVE WELCOME BANNER */}
        <div style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '2.25rem 2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Background Gradient */}
          <div style={{
            position: 'absolute',
            right: '-50px',
            top: '-50px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,70,229,0.35) 0%, rgba(15,23,42,0) 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.25)', border: '1px solid rgba(129, 140, 248, 0.3)', padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', color: '#818CF8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                <span>Ekosistem Real-Time Synced</span>
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                Selamat Datang Kembali, Administrator Workspace 👋
              </h1>

              <p style={{ color: '#94A3B8', fontSize: '0.925rem', maxWidth: '620px', lineHeight: '1.6' }}>
                Kelola seluruh portofolio publik, pembaruan konten landing page, papan tugas sprint QA, serta dokumentasi sistem dalam satu kontrol terpusat.
              </p>
            </div>

            {/* Banner Quick CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/todos" className="btn btn-primary" style={{ backgroundColor: '#4F46E5' }}>
                <FiCheckSquare />
                <span>To-Do & Board</span>
              </Link>
              <Link to="/documentation" className="btn btn-secondary" style={{ backgroundColor: '#1E293B', color: '#F8FAFC', borderColor: '#334155' }}>
                <FiBookOpen />
                <span>Dokumentasi</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 6 TOP KPI STAT CARDS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Projects Card */}
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

          {/* Experiments Card */}
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

          {/* To-Do Tasks Card */}
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

          {/* Documentation Card */}
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

          {/* Notes & Journal Card */}
          <Link to="/notes" style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%' }}>
              <div className="stat-info">
                <div className="stat-label">Catatan & Ideas</div>
                <div className="stat-value">{loading ? '...' : stats.notesCount}</div>
              </div>
              <div className="stat-icon rose">
                <FiFileText />
              </div>
            </div>
          </Link>

          {/* Bookmarks Card */}
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

        {/* SECTION 1: SPRINT PROGRESS & TASK BOARD OVERVIEW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Task Board Progress Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCheckSquare style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
                <h3 style={{ fontSize: '1.1rem' }}>Progres Sprint & Tugas QA</h3>
              </div>
              <Link to="/todos" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>Buka Board</span>
                <FiArrowRight />
              </Link>
            </div>

            {/* Progress Bar & Badges */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700' }}>
                <span>Tingkat Penyelesaian Skenario QA</span>
                <span style={{ color: 'var(--primary)' }}>{taskProgressPercent}% Completed</span>
              </div>

              <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${taskProgressPercent}%`, backgroundColor: 'var(--primary)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.875rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                <span>🔴 Not Started: {notStartedTodos}</span>
                <span>🟡 In Progress: {inProgressTodos}</span>
                <span>🟢 Done: {completedTodos}</span>
              </div>
            </div>

            {/* Task Items Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {recentTodos.length === 0 ? (
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Belum ada tugas di papan Sprint.</div>
              ) : (
                recentTodos.map(todo => (
                  <div key={todo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <FiFileText style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {todo.title}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '99px',
                      backgroundColor: todo.status === 'Done' ? '#DCFCE7' : todo.status === 'In progress' ? '#FEF3C7' : '#F1F5F9',
                      color: todo.status === 'Done' ? '#166534' : todo.status === 'In progress' ? '#92400E' : '#475569'
                    }}>
                      {todo.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Maintenance Mode & System Security Status */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiTool style={{ color: 'var(--accent-teal)', fontSize: '1.25rem' }} />
                  <h3 style={{ fontSize: '1.1rem' }}>Status Mode Maintenance</h3>
                </div>
                <span className={`badge badge-${maintenance?.is_enabled ? 'rose' : 'teal'}`}>
                  {maintenance?.is_enabled ? 'Mode Pemeliharaan Aktif' : 'Situs Utama Live'}
                </span>
              </div>

              <div style={{ backgroundColor: maintenance?.is_enabled ? '#FFF1F2' : '#F0FDFA', border: `1px solid ${maintenance?.is_enabled ? '#FECDD3' : '#CCFBF1'}`, padding: '1.15rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: maintenance?.is_enabled ? '#BE123C' : '#0F766E', marginBottom: '0.35rem' }}>
                  {maintenance?.title || 'Situs Utama Sedang Berjalan Normal'}
                </div>
                <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                  {maintenance?.message}
                </p>

                {maintenance?.is_enabled && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.78rem', fontWeight: '700', color: '#BE123C' }}>
                    <FiClock />
                    <span>Target Selesai: {new Date(maintenance.end_time).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <Link to="/maintenance" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <FiTool />
              <span>Kelola Pengaturan Pemeliharaan</span>
            </Link>
          </div>
        </div>

        {/* SECTION 2: SYSTEM DOCUMENTATION & KNOWLEDGE BASE QUICK SOPS */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiBookOpen style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Panduan & Dokumentasi Sistem Terpopuler</h3>
            </div>
            <Link to="/documentation" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>Kelola Dokumentasi</span>
              <FiArrowRight />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {recentDocs.map(doc => (
              <Link key={doc.id} to="/documentation" style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.15rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }} className="card">
                  <div>
                    <span className="badge badge-violet" style={{ fontSize: '0.68rem', marginBottom: '0.625rem', textTransform: 'uppercase' }}>
                      {doc.category || 'Guides'}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem', lineHeight: '1.3' }}>
                      {doc.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {doc.content}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                    <span>Penulis: {doc.author || 'Admin'}</span>
                    <FiArrowRight style={{ color: 'var(--primary)' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 3: RECENT PROJECTS SHOWCASE TABLE */}
        <div className="table-container" style={{ marginBottom: '2rem' }}>
          <div className="table-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiFolder style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Project Portofolio Terbaru</h3>
            </div>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              <FiPlus />
              <span>Kelola Projects</span>
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat project...</div>
          ) : recentProjects.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-subtle)' }}>Belum ada project yang ditambahkan.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul Project</th>
                  <th>Kategori / Type</th>
                  <th>Progres Pengerjaan</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{p.slug}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.type}</span>
                    </td>
                    <td style={{ width: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
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
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SECTION 4: LANDING PAGE CONTENT SYNC & QUICK ACTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Landing Page Sync Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiLayout style={{ color: 'var(--accent-teal)', fontSize: '1.25rem' }} />
                <h3 style={{ fontSize: '1.1rem' }}>Konten Landing Page</h3>
              </div>
              <Link to="/landing-manager" className="btn btn-secondary btn-sm">
                Edit Content
              </Link>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.25rem' }}>
                {landing?.hero_badge || 'Independent Designer & Developer'}
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                "{landing?.hero_title || 'Ideas, crafted into digital experiences.'}"
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {landing?.hero_description}
              </p>
            </div>

            <a href="https://desktopalie.my.id" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <span>Buka Website Utama (desktopalie.my.id)</span>
              <FiExternalLink />
            </a>
          </div>

          {/* System Activity Timeline Log */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FiActivity style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Aktivitas Backoffice Terakhir</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F172A' }}>Tugas QA Board Dikonfigurasi</div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Papan Jira/Notion Kanban aktif dengan Grab & Drop.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F46E5', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F172A' }}>Dokumentasi Sistem Diperbarui</div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>GitBook/Obsidian Explorer dengan mode Editor & Live Preview.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0D9488', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F172A' }}>Mode Maintenance Guard Aktif</div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Countdown otomatis & bypass Admin cookie disinkronkan.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
