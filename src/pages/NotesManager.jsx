import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import Header from '../components/Header';
import Modal from '../components/Modal';

export default function NotesManager() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    type: 'Design note',
    description: '',
    status: 'Draft',
    tone: 'amber'
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getNotes();
      setNotes(data);
    } catch (err) {
      toast.error('Gagal memuat catatan');
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
        type: item.type || 'Design note',
        description: item.description || '',
        status: item.status || 'Draft',
        tone: item.tone || 'amber'
      });
    } else {
      setEditingItem(null);
      setFormData({
        slug: '',
        title: '',
        type: 'Design note',
        description: '',
        status: 'Draft',
        tone: 'amber'
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
        await backofficeService.updateNote(editingItem.id, formData);
        toast.success('Catatan berhasil diperbarui!');
      } else {
        await backofficeService.createNote(formData);
        toast.success('Catatan baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      loadNotes();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Gagal menyimpan catatan');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus catatan "${title}"?`)) return;
    try {
      await backofficeService.deleteNote(id);
      toast.success('Catatan berhasil dihapus');
      loadNotes();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus catatan');
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.slug.toLowerCase().includes(search.toLowerCase()) ||
    n.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header title="Notes & Journal Manager" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Manajemen Catatan & Journal</h1>
            <p className="page-subtitle">Kelola jurnal pembelajaran, prinsip desain, dan ide pemikiran.</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus />
            <span>Tambah Catatan Baru</span>
          </button>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <div className="search-input-wrapper">
              <FiSearch />
              <input
                type="text"
                className="search-input"
                placeholder="Cari catatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: <strong>{filteredNotes.length}</strong> catatan
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Memuat data catatan...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Belum ada catatan yang ditemukan.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul & Slug</th>
                  <th>Kategori / Tipe</th>
                  <th>Status & Tone</th>
                  <th>Deskripsi</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>
                        {item.slug}
                      </div>
                    </td>
                    <td>{item.type}</td>
                    <td>
                      <span className={`badge badge-${item.tone || 'amber'}`}>
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
        title={editingItem ? 'Edit Catatan' : 'Tambah Catatan Baru'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Judul Catatan *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Designing with constraints"
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
              placeholder="designing-with-constraints"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tipe Catatan</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="Design note">Design note</option>
                <option value="Interaction note">Interaction note</option>
                <option value="Tech note">Tech note</option>
                <option value="Journal">Journal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Warna Tone</label>
              <select
                className="form-control"
                value={formData.tone}
                onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
              >
                <option value="amber">Amber</option>
                <option value="violet">Violet</option>
                <option value="teal">Teal</option>
                <option value="rose">Rose</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status / Tag Tanggal</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Draft, Published, atau May 20"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Isi Catatan / Ringkasan</label>
            <textarea
              className="form-control"
              placeholder="Tulis ringkasan atau isi utama catatan di sini..."
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
