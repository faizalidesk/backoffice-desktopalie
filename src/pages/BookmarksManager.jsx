import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSearch, FiExternalLink, FiTrash2 } from 'react-icons/fi';
import Header from '../components/Header';
import Modal from '../components/Modal';

export default function BookmarksManager() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    source: ''
  });

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getBookmarks();
      setBookmarks(data);
    } catch (err) {
      toast.error('Gagal memuat bookmarks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ title: '', url: '', source: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      toast.error('Judul dan URL wajib diisi');
      return;
    }

    try {
      await backofficeService.createBookmark(formData);
      toast.success('Bookmark baru berhasil disimpan!');
      setIsModalOpen(false);
      loadBookmarks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Gagal menyimpan bookmark');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus bookmark "${title}"?`)) return;
    try {
      await backofficeService.deleteBookmark(id);
      toast.success('Bookmark berhasil dihapus');
      loadBookmarks();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus bookmark');
    }
  };

  const filteredBookmarks = bookmarks.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.url.toLowerCase().includes(search.toLowerCase()) ||
    (b.source && b.source.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Header title="Bookmarks Manager" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Manajemen Bookmarks & Referensi</h1>
            <p className="page-subtitle">Koleksi referensi web, inspirasi desain, dan dokumentasi penting.</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <FiPlus />
            <span>Tambah Bookmark Baru</span>
          </button>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <div className="search-input-wrapper">
              <FiSearch />
              <input
                type="text"
                className="search-input"
                placeholder="Cari bookmark..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: <strong>{filteredBookmarks.length}</strong> link
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Memuat data bookmark...
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Belum ada bookmark yang disimpan.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul Bookmark</th>
                  <th>Sumber / Domain</th>
                  <th>Link Target</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookmarks.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{item.title}</div>
                    </td>
                    <td>
                      <span className="badge badge-rose">{item.source || 'Web'}</span>
                    </td>
                    <td>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
                      >
                        <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.url}</span>
                        <FiExternalLink />
                      </a>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-danger btn-icon btn-sm"
                        onClick={() => handleDelete(item.id, item.title)}
                        title="Hapus"
                      >
                        <FiTrash2 />
                      </button>
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
        title="Tambah Bookmark Baru"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Judul Bookmark *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: React Documentation"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Web Link *</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://react.dev"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sumber / Kategori (Opsional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Design Better, W3C, Official Docs"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Bookmark
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
