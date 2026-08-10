import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { FiFolder, FiCpu, FiFileText, FiBookmark, FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projectsCount: 0,
    experimentsCount: 0,
    notesCount: 0,
    bookmarksCount: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [projects, experiments, notes, bookmarks] = await Promise.all([
        backofficeService.getProjects(),
        backofficeService.getExperiments(),
        backofficeService.getNotes(),
        backofficeService.getBookmarks()
      ]);

      setStats({
        projectsCount: projects.length,
        experimentsCount: experiments.length,
        notesCount: notes.length,
        bookmarksCount: bookmarks.length
      });

      setRecentProjects(projects.slice(0, 4));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Dashboard Overview" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Ringkasan Backoffice</h1>
            <p className="page-subtitle">Kelola seluruh karya, eksperimen, dan catatan dalam satu tempat.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Projects</div>
              <div className="stat-value">{loading ? '...' : stats.projectsCount}</div>
            </div>
            <div className="stat-icon violet">
              <FiFolder />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Experiments</div>
              <div className="stat-value">{loading ? '...' : stats.experimentsCount}</div>
            </div>
            <div className="stat-icon teal">
              <FiCpu />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Notes & Ideas</div>
              <div className="stat-value">{loading ? '...' : stats.notesCount}</div>
            </div>
            <div className="stat-icon amber">
              <FiFileText />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Bookmarks</div>
              <div className="stat-value">{loading ? '...' : stats.bookmarksCount}</div>
            </div>
            <div className="stat-icon rose">
              <FiBookmark />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Pintasan Aksi Cepat</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/projects" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPlus style={{ color: 'var(--primary)' }} />
                  <span>Tambah Project Portofolio Baru</span>
                </div>
                <FiArrowRight />
              </Link>
              <Link to="/experiments" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPlus style={{ color: 'var(--accent-teal)' }} />
                  <span>Tambah Eksperimen UI/Motion</span>
                </div>
                <FiArrowRight />
              </Link>
              <Link to="/notes" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPlus style={{ color: 'var(--accent-amber)' }} />
                  <span>Buat Catatan Desain Baru</span>
                </div>
                <FiArrowRight />
              </Link>
              <Link to="/bookmarks" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPlus style={{ color: 'var(--accent-rose)' }} />
                  <span>Simpan Link Bookmark</span>
                </div>
                <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Projects Terbaru</h3>
              <Link to="/projects" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '600' }}>
                Lihat Semua
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Memuat data...</p>
            ) : recentProjects.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Belum ada project yang ditambahkan.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentProjects.map((p) => (
                  <div 
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.15rem' }}>{p.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.type}</span>
                    </div>
                    <span className={`badge badge-${p.tone || 'violet'}`}>
                      {p.status} ({p.progress}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
