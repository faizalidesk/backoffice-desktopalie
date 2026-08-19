import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { SiObsidian } from 'react-icons/si';
import Header from '../components/Header';
import Modal from '../components/Modal';
import ObsidianSyncModal from '../components/ObsidianSyncModal';

export default function NotesManager() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isObsidianModalOpen, setIsObsidianModalOpen] = useState(false);
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
      toast.error('Failed to load notes');
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
      toast.error('Title and Slug are required');
      return;
    }

    try {
      if (editingItem) {
        await backofficeService.updateNote(editingItem.id, formData);
        toast.success('Note updated successfully!');
      } else {
        await backofficeService.createNote(formData);
        toast.success('New note added successfully!');
      }
      setIsModalOpen(false);
      loadNotes();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save note');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete note "${title}"?`)) return;
    try {
      await backofficeService.deleteNote(id);
      toast.success('Note deleted successfully');
      loadNotes();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete note');
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
            <h1>Notes & Journal Manager</h1>
            <p className="page-subtitle">Manage learning journals, design principles, and creative thoughts.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="btn btn-secondary" 
              style={{ background: '#7c3aed', color: '#ffffff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
              onClick={() => setIsObsidianModalOpen(true)}
            >
              <SiObsidian size={16} />
              <span>Obsidian Vault</span>
            </button>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <FiPlus />
              <span>Add New Note</span>
            </button>
          </div>
        </div>

        <ObsidianSyncModal
          isOpen={isObsidianModalOpen}
          onClose={() => setIsObsidianModalOpen(false)}
          onSyncComplete={() => loadNotes()}
        />

        <div className="table-container">
          <div className="table-toolbar">
            <div className="search-input-wrapper">
              <FiSearch />
              <input
                type="text"
                className="search-input"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: <strong>{filteredNotes.length}</strong> notes
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading notes data...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No notes found.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title & Slug</th>
                  <th>Category / Type</th>
                  <th>Status & Tone</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.title}</div>
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
                          title="Delete"
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
        title={editingItem ? 'Edit Note' : 'Add New Note'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Note Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Designing with constraints"
              value={formData.title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug *</label>
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
              <label className="form-label">Note Type</label>
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
              <label className="form-label">Tone Color</label>
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
            <label className="form-label">Status / Date Tag</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Draft, Published, or May 20"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Note Content / Summary</label>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', padding: '0.2rem 0.6rem', height: 'auto', background: '#F1F5F9', color: '#475569', fontWeight: 600, border: '1px solid #CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                onClick={() => setFormData(prev => ({
                  ...prev,
                  description: prev.description 
                    ? `${prev.description}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
                    : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
                }))}
              >
                <span>✦ Generate Lorem Template</span>
              </button>
            </div>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Write summary or main content of the note here..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Note
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
