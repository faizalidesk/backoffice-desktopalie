import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { 
  FiBookOpen, 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiTag, 
  FiUser, 
  FiCalendar, 
  FiFileText, 
  FiCheckCircle, 
  FiCode, 
  FiInfo,
  FiChevronRight
} from 'react-icons/fi';
import Header from '../components/Header';
import Modal from '../components/Modal';

const CATEGORIES = ['All', 'Architecture', 'Guides', 'QA & Testing', 'APIs & Services', 'Deployment'];

export default function DocumentationManager() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Guides',
    author: 'Admin',
    content: ''
  });

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getDocs();
      setDocs(data);
      if (data.length > 0 && !selectedDoc) {
        setSelectedDoc(data[0]);
      }
    } catch (err) {
      toast.error('Gagal memuat dokumentasi sistem');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doc = null) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title || '',
        category: doc.category || 'Guides',
        author: doc.author || 'Admin',
        content: doc.content || ''
      });
    } else {
      setEditingDoc(null);
      setFormData({
        title: '',
        category: 'Guides',
        author: 'Admin',
        content: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Judul dokumentasi wajib diisi');
      return;
    }

    try {
      if (editingDoc) {
        const updated = await backofficeService.updateDoc(editingDoc.id, formData);
        toast.success('Dokumentasi berhasil diperbarui!');
        setSelectedDoc({ ...editingDoc, ...formData });
      } else {
        const created = await backofficeService.createDoc(formData);
        toast.success('Dokumentasi baru berhasil ditambahkan!');
        setSelectedDoc(created);
      }
      setIsModalOpen(false);
      loadDocs();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan dokumentasi');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus dokumentasi "${title}"?`)) return;
    try {
      await backofficeService.deleteDoc(id);
      toast.success('Dokumentasi berhasil dihapus');
      if (selectedDoc?.id === id) {
        const remaining = docs.filter(d => d.id !== id);
        setSelectedDoc(remaining.length > 0 ? remaining[0] : null);
      }
      loadDocs();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus dokumentasi');
    }
  };

  // Filter Logic
  const filteredDocs = docs.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
                          d.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <>
      <Header title="Dokumentasi Sistem" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>System Documentation & Knowledge Base</h1>
            <p className="page-subtitle">Pusat dokumentasi arsitektur, panduan operasional, dan modul sistem ekosistem Desktopalie.</p>
          </div>

          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus />
            <span>Tambah Dokumen Baru</span>
          </button>
        </div>

        {/* 2-Column Knowledge Base Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* LEFT SIDEBAR: INDEX & FILTERS */}
          <div className="table-container" style={{ padding: '1rem' }}>
            <div className="search-input-wrapper" style={{ marginBottom: '1rem', width: '100%', minWidth: 'auto' }}>
              <FiSearch />
              <input
                type="text"
                className="search-input"
                placeholder="Cari dokumentasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Pills Filter */}
            <div style={{
              display: 'flex',
              gap: '0.35rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.725rem',
                    fontWeight: '600',
                    border: '1px solid',
                    cursor: 'pointer',
                    backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-main)',
                    color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-muted)',
                    borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-color)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Article Index List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Memuat indeks dokumen...
                </div>
              ) : filteredDocs.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  Tidak ada dokumentasi ditemukan.
                </div>
              ) : (
                filteredDocs.map(doc => {
                  const isSelected = selectedDoc?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      style={{
                        padding: '0.75rem 0.875rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                        lineHeight: '1.3'
                      }}>
                        {doc.title}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: isSelected ? '#FFFFFF' : '#F1F5F9',
                          color: isSelected ? 'var(--primary)' : 'var(--text-muted)'
                        }}>
                          {doc.category || 'Guides'}
                        </span>
                        <FiChevronRight style={{ color: isSelected ? 'var(--primary)' : 'var(--text-subtle)', fontSize: '0.85rem' }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT SIDE: DOCUMENT READER & VIEWER */}
          <div className="card" style={{ minHeight: '620px', padding: '2rem' }}>
            {selectedDoc ? (
              <div>
                {/* Article Header & Action Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.5rem',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-violet" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {selectedDoc.category || 'Guides'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FiUser />
                        <span>{selectedDoc.author || 'Admin'}</span>
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', lineHeight: '1.3' }}>
                      {selectedDoc.title}
                    </h2>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenModal(selectedDoc)}
                    >
                      <FiEdit />
                      <span>Edit Dokumen</span>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(selectedDoc.id, selectedDoc.title)}
                    >
                      <FiTrash2 />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                {/* Article Content Viewer */}
                <div style={{
                  fontSize: '0.925rem',
                  lineHeight: '1.7',
                  color: '#334155',
                  whiteSpace: 'pre-wrap',
                  fontFamily: "var(--font-sans)"
                }}>
                  {selectedDoc.content}
                </div>
              </div>
            ) : (
              <div style={{ padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <FiBookOpen style={{ fontSize: '3rem', color: 'var(--text-subtle)', marginBottom: '1rem' }} />
                <h3>Pilih Dokumen dari Indeks</h3>
                <p style={{ fontSize: '0.875rem' }}>Silakan pilih artikel dokumentasi dari daftar di sebelah kiri atau buat dokumen baru.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT DOCUMENTATION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoc ? 'Edit Dokumen Sistem' : 'Tambah Dokumen Baru'}
        maxWidth="760px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Judul Dokumen *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Arsitektur Sistem & Integrasi Supabase"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Kategori Dokumentasi</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Penulis / Author</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: System Admin / Tech Lead"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Isi Konten Dokumen (Mendukung Markdown)</label>
            <textarea
              className="form-control"
              rows="12"
              placeholder="Tuliskan dokumentasi sistem, panduan operasional, atau instruksi teknis di sini..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Dokumen
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
