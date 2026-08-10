import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import Header from '../components/Header';
import Modal from '../components/Modal';

export default function ExperimentsManager() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    type: 'Motion',
    description: '',
    status: 'Draft',
    tone: 'teal'
  });

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getExperiments();
      setExperiments(data);
    } catch (err) {
      toast.error('Gagal memuat eksperimen');
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
        type: item.type || 'Motion',
        description: item.description || '',
        status: item.status || 'Draft',
        tone: item.tone || 'teal'
      });
    } else {
      setEditingItem(null);
      setFormData({
        slug: '',
        title: '',
        type: 'Motion',
        description: '',
        status: 'Draft',
        tone: 'teal'
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
        await backofficeService.updateExperiment(editingItem.id, formData);
        toast.success('Eksperimen berhasil diperbarui!');
      } else {
        await backofficeService.createExperiment(formData);
        toast.success('Eksperimen baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      loadExperiments();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Gagal menyimpan data eksperimen');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus eksperimen "${title}"?`)) return;
    try {
      await backofficeService.deleteExperiment(id);
      toast.success('Eksperimen berhasil dihapus');
      loadExperiments();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus eksperimen');
    }
  };

  const filteredExperiments = experiments.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.slug.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header title="Experiments Lab Manager" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Manajemen Experiments Lab</h1>
            <p className="page-subtitle">Kelola prototipe UI/UX, animasi interaktif, dan studi teknologi.</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus />
            <span>Tambah Eksperimen Baru</span>
          </button>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <div className="search-input-wrapper">
              <FiSearch />
              <input
                type="text"
                className="search-input"
                placeholder="Cari eksperimen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: <strong>{filteredExperiments.length}</strong> eksperimen
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Memuat data eksperimen...
            </div>
          ) : filteredExperiments.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Belum ada eksperimen yang ditemukan.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul & Slug</th>
                  <th>Tipe</th>
                  <th>Status & Tone</th>
                  <th>Deskripsi</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredExperiments.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>
                        {item.slug}
                      </div>
                    </td>
                    <td>{item.type}</td>
                    <td>
                      <span className={`badge badge-${item.tone || 'teal'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.825rem', maxWidth: '300px' }}>
                      {item.description || '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-secondary btn-icon btn-sm"
                          onClick={() => handleOpenModal(item)}
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          className="btn btn-danger btn-icon btn-sm"
                          onClick={() => handleDelete(item.id, item.title)}
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
        title={editingItem ? 'Edit Eksperimen' : 'Tambah Eksperimen Baru'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Judul Eksperimen *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Kinetic type studies"
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
              placeholder="kinetic-type"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tipe Eksperimen</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="Motion">Motion</option>
                <option value="UI">UI</option>
                <option value="3D Graphic">3D Graphic</option>
                <option value="Shader">Shader</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Warna Tone</label>
              <select
                className="form-control"
                value={formData.tone}
                onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
              >
                <option value="teal">Teal</option>
                <option value="violet">Violet</option>
                <option value="amber">Amber</option>
                <option value="rose">Rose</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea
              className="form-control"
              placeholder="Jelaskan tujuan eksperimen atau studi animasi ini..."
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
