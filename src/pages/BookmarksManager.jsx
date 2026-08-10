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
      toast.error('Failed to load bookmarks');
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
      toast.error('Title and URL are required');
      return;
    }

    try {
      await backofficeService.createBookmark(formData);
      toast.success('New bookmark saved successfully!');
      setIsModalOpen(false);
      loadBookmarks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save bookmark');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete bookmark "${title}"?`)) return;
    try {
      await backofficeService.deleteBookmark(id);
      toast.success('Bookmark deleted successfully');
      loadBookmarks();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete bookmark');
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
            <h1>Bookmarks & References Manager</h1>
            <p className="page-subtitle">Collection of web references, design inspiration, and key documentation.</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <FiPlus />
            <span>Add New Bookmark</span>
          </button>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <div className="search-input-wrapper">
              <FiSearch />
              <input
                type="text"
                className="search-input"
                placeholder="Search bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: <strong>{filteredBookmarks.length}</strong> links
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading bookmarks data...
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No bookmarks saved yet.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bookmark Title</th>
                  <th>Source / Domain</th>
                  <th>Target Link</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookmarks.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.title}</div>
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
                        title="Delete"
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
        title="Add New Bookmark"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Bookmark Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. React Documentation"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Web URL Link *</label>
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
            <label className="form-label">Source / Category (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Design Better, W3C, Official Docs"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Bookmark
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
