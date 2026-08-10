import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiImage } from 'react-icons/fi';
import Header from '../components/Header';
import Modal from '../components/Modal';
import ImageUploader from '../components/ImageUploader';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    type: 'Web application',
    description: '',
    progress: 50,
    status: 'In progress',
    tone: 'violet',
    image_url: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getProjects();
      setProjects(data);
    } catch (err) {
      toast.error('Gagal memuat daftar projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        slug: item.slug || '',
        title: item.title || '',
        type: item.type || 'Web application',
        description: item.description || '',
        progress: item.progress || 0,
        status: item.status || 'In progress',
        tone: item.tone || 'violet',
        image_url: item.image_url || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        slug: '',
        title: '',
        type: 'Web application',
        description: '',
        progress: 0,
        status: 'In progress',
        tone: 'violet',
        image_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!editingItem) {
      const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, title, slug: autoSlug }));
    } else {
      setFormData(prev => ({ ...prev, title }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error('Judul dan Slug wajib diisi');
      return;
    }

    try {
      if (editingItem) {
        await backofficeService.updateProject(editingItem.id, formData);
        toast.success('Project berhasil diperbarui!');
      } else {
        await backofficeService.createProject(formData);
        toast.success('Project baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Gagal menyimpan data project');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus project "${title}"?`)) return;
    try {
      await backofficeService.deleteProject(id);
      toast.success('Project berhasil dihapus');
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus project');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header title="Projects Manager" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Manajemen Projects</h1>
            <p className="page-subtitle">Kelola karya portofolio, aplikasi web, dan case studies.</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus />
            <span>Tambah Project Baru</span>
          </button>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <div className="search-input-wrapper">
              <FiSearch />
              <input
                type="text"
                className="search-input"
                placeholder="Cari berdasarkan judul, slug, atau tipe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: <strong>{filteredProjects.length}</strong> project
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Memuat data projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Tidak ada project yang ditemukan.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cover & Judul</th>
                  <th>Tipe</th>
                  <th>Status & Tone</th>
                  <th>Progress</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#F1F5F9',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid var(--border-color)'
                        }}>
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <FiImage style={{ color: 'var(--text-subtle)', fontSize: '1.2rem' }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>
                            {p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{p.type}</td>
                    <td>
                      <span className={`badge badge-${p.tone || 'violet'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '140px' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${p.progress || 0}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '999px' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-secondary btn-icon btn-sm"
                          onClick={() => handleOpenModal(p)}
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          className="btn btn-danger btn-icon btn-sm"
                          onClick={() => handleDelete(p.id, p.title)}
                          title="Hapus"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Data Project' : 'Tambah Project Baru'}
      >
        <form onSubmit={handleSubmit}>
          <ImageUploader 
            value={formData.image_url} 
            onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))} 
            folder="projects"
            label="Gambar Cover / Thumbnail Project"
          />

          <div className="form-group">
            <label className="form-label">Judul Project *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Orbit Analytics"
              value={formData.title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug URL *</label>
            <input
              type="text"
              className="form-control"
              placeholder="orbit-analytics"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tipe Project</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="Web application">Web application</option>
                <option value="Digital experience">Digital experience</option>
                <option value="Design experiment">Design experiment</option>
                <option value="Mobile app">Mobile app</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Warna Tone (Badge)</label>
              <select
                className="form-control"
                value={formData.tone}
                onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
              >
                <option value="violet">Violet</option>
                <option value="teal">Teal</option>
                <option value="amber">Amber</option>
                <option value="rose">Rose</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="In progress">In progress</option>
                <option value="Published">Published</option>
                <option value="Exploring">Exploring</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Progress ({formData.progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                className="form-control"
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea
              className="form-control"
              placeholder="Jelaskan ringkasan karya atau aplikasi web ini..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
