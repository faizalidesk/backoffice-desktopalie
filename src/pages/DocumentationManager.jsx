import { useEffect, useState, useMemo } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { 
  FiFolder, 
  FiFolderPlus, 
  FiFileText, 
  FiChevronRight, 
  FiChevronDown, 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiUser, 
  FiBookOpen,
  FiFilePlus
} from 'react-icons/fi';
import Header from '../components/Header';
import Modal from '../components/Modal';

const DEFAULT_FOLDERS = [
  '1. Arsitektur System & Core',
  '2. Panduan Operasional (SOP)',
  '3. QA & Quality Assurance',
  '4. API & Integration Guides'
];

const DEFAULT_SUBFOLDERS = {
  '1. Arsitektur System & Core': ['Backend & Database', 'Frontend & Platform'],
  '2. Panduan Operasional (SOP)': ['Maintenance & Security', 'Content Management'],
  '3. QA & Quality Assurance': ['Testing & Bug Management', 'Checklist & Task Board'],
  '4. API & Integration Guides': ['Supabase Webhooks', 'External APIs']
};

export default function DocumentationManager() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Search & Expansion States
  const [search, setSearch] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({
    '1. Arsitektur System & Core': true,
    '2. Panduan Operasional (SOP)': true,
    '3. QA & Quality Assurance': true
  });
  const [expandedSubfolders, setExpandedSubfolders] = useState({
    'Backend & Database': true,
    'Maintenance & Security': true,
    'Testing & Bug Management': true
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    folder: '1. Arsitektur System & Core',
    subfolder: 'Backend & Database',
    category: 'Architecture',
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

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const toggleSubfolder = (subfolderName) => {
    setExpandedSubfolders(prev => ({
      ...prev,
      [subfolderName]: !prev[subfolderName]
    }));
  };

  const handleOpenModal = (doc = null, defaultFolder = '1. Arsitektur System & Core', defaultSubfolder = 'Backend & Database') => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title || '',
        folder: doc.folder || '1. Arsitektur System & Core',
        subfolder: doc.subfolder || 'Backend & Database',
        category: doc.category || 'Guides',
        author: doc.author || 'Admin',
        content: doc.content || ''
      });
    } else {
      setEditingDoc(null);
      setFormData({
        title: '',
        folder: defaultFolder,
        subfolder: defaultSubfolder,
        category: 'Guides',
        author: 'Admin',
        content: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCreateLevel1Folder = () => {
    const folderName = window.prompt('Masukkan Nama Level 1: Folder Utama baru:');
    if (!folderName || !folderName.trim()) return;

    const subfolderName = window.prompt(`Masukkan Nama Level 2: Subfolder awal untuk "${folderName.trim()}":`, 'General');
    if (!subfolderName || !subfolderName.trim()) return;

    handleOpenModal(null, folderName.trim(), subfolderName.trim());
  };

  const handleCreateLevel2Subfolder = (parentFolder) => {
    const subfolderName = window.prompt(`Masukkan Nama Level 2: Subfolder baru di bawah "${parentFolder}":`);
    if (!subfolderName || !subfolderName.trim()) return;

    handleOpenModal(null, parentFolder, subfolderName.trim());
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

  // Grouping Docs into Folder -> Subfolder Tree
  const folderTree = useMemo(() => {
    const tree = {};

    docs.forEach(doc => {
      const folderName = doc.folder || 'Uncategorized Folder';
      const subfolderName = doc.subfolder || 'General Subfolder';

      const matchesSearch = !search || 
        doc.title.toLowerCase().includes(search.toLowerCase()) || 
        doc.content.toLowerCase().includes(search.toLowerCase()) ||
        folderName.toLowerCase().includes(search.toLowerCase()) ||
        subfolderName.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return;

      if (!tree[folderName]) tree[folderName] = {};
      if (!tree[folderName][subfolderName]) tree[folderName][subfolderName] = [];

      tree[folderName][subfolderName].push(doc);
    });

    return tree;
  }, [docs, search]);

  return (
    <>
      <Header title="Dokumentasi Sistem" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>System Documentation & Knowledge Base</h1>
            <p className="page-subtitle">Buat hirarki mulai dari Level 1 (Folder Utama) ➔ Level 2 (Subfolder) ➔ Artikel Dokumen.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={handleCreateLevel1Folder}>
              <FiFolderPlus style={{ color: 'var(--primary)' }} />
              <span>+ Level 1 Folder</span>
            </button>

            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <FiPlus />
              <span>+ Tambah Dokumen</span>
            </button>
          </div>
        </div>

        {/* 2-Column Knowledge Base Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* LEFT SIDEBAR: FOLDER & SUBFOLDER TREE SYSTEM */}
          <div className="table-container" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FiFolder style={{ color: 'var(--primary)' }} />
                <span>Tree Explorer</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {docs.length} Artikel
              </span>
            </div>

            <div className="search-input-wrapper" style={{ marginBottom: '1rem', width: '100%', minWidth: 'auto' }}>
              <FiSearch />
              <input
                type="text"
                className="search-input"
                placeholder="Cari di folder / dokumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Folder & Subfolder Tree Container */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              maxHeight: '620px',
              overflowY: 'auto',
              paddingRight: '0.2rem'
            }}>
              {loading ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Memuat struktur folder...
                </div>
              ) : Object.keys(folderTree).length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  Tidak ada dokumen atau folder ditemukan.
                </div>
              ) : (
                Object.keys(folderTree).map(folderName => {
                  const isFolderExpanded = search ? true : !!expandedFolders[folderName];
                  const subfoldersObj = folderTree[folderName];
                  const totalDocsInFolder = Object.values(subfoldersObj).reduce((acc, arr) => acc + arr.length, 0);

                  return (
                    <div key={folderName} style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* LEVEL 1: MAIN FOLDER ROW */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.45rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#F1F5F9',
                          cursor: 'pointer',
                          userSelect: 'none',
                          fontWeight: '700',
                          fontSize: '0.825rem',
                          color: '#0F172A',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div 
                          onClick={() => toggleFolder(folderName)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', flex: 1 }}
                        >
                          {isFolderExpanded ? (
                            <FiChevronDown style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          ) : (
                            <FiChevronRight style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          )}
                          <FiFolder style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{folderName}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateLevel2Subfolder(folderName);
                            }}
                            title={`+ Tambah Level 2 Subfolder di bawah "${folderName}"`}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--primary)',
                              cursor: 'pointer',
                              padding: '0.15rem 0.35rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <FiPlus />
                            <span>Subfolder</span>
                          </button>

                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', backgroundColor: '#FFFFFF', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            {totalDocsInFolder}
                          </span>
                        </div>
                      </div>

                      {/* SUBFOLDERS & DOCUMENTS UNDER THIS FOLDER */}
                      {isFolderExpanded && (
                        <div style={{
                          paddingLeft: '0.75rem',
                          marginTop: '0.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                          borderLeft: '2px dashed var(--border-color)',
                          marginLeft: '0.75rem'
                        }}>
                          {Object.keys(subfoldersObj).map(subfolderName => {
                            const isSubExpanded = search ? true : !!expandedSubfolders[subfolderName];
                            const docList = subfoldersObj[subfolderName];

                            return (
                              <div key={subfolderName} style={{ display: 'flex', flexDirection: 'column' }}>
                                {/* LEVEL 2: SUBFOLDER ROW */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    color: '#334155'
                                  }}
                                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <div 
                                    onClick={() => toggleSubfolder(subfolderName)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1 }}
                                  >
                                    {isSubExpanded ? (
                                      <FiChevronDown style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }} />
                                    ) : (
                                      <FiChevronRight style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }} />
                                    )}
                                    <FiFolder style={{ color: '#D97706', fontSize: '0.85rem' }} />
                                    <span>{subfolderName}</span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenModal(null, folderName, subfolderName);
                                      }}
                                      title={`+ Tambah Dokumen Baru di "${subfolderName}"`}
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#D97706',
                                        cursor: 'pointer',
                                        padding: '0.1rem 0.3rem',
                                        borderRadius: '4px',
                                        fontSize: '0.725rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem'
                                      }}
                                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEF3C7'}
                                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      <FiFilePlus />
                                      <span>Doc</span>
                                    </button>
                                    <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                                      ({docList.length})
                                    </span>
                                  </div>
                                </div>

                                {/* LEVEL 3: DOCUMENT ITEMS UNDER SUBFOLDER */}
                                {isSubExpanded && (
                                  <div style={{
                                    paddingLeft: '1.25rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.2rem',
                                    marginTop: '0.15rem'
                                  }}>
                                    {docList.map(doc => {
                                      const isSelected = selectedDoc?.id === doc.id;
                                      return (
                                        <div
                                          key={doc.id}
                                          onClick={() => setSelectedDoc(doc)}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            padding: '0.35rem 0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                                            color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                            fontWeight: isSelected ? '700' : '500',
                                            fontSize: '0.78rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                          }}
                                          onMouseOver={(e) => {
                                            if (!isSelected) e.currentTarget.style.backgroundColor = '#F1F5F9';
                                          }}
                                          onMouseOut={(e) => {
                                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                          }}
                                        >
                                          <FiFileText style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }} />
                                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {doc.title}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT SIDE: DOCUMENT READER & VIEWER */}
          <div className="card" style={{ minHeight: '640px', padding: '2rem' }}>
            {selectedDoc ? (
              <div>
                {/* Path Breadcrumb Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  backgroundColor: '#F8FAFC',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  width: 'fit-content'
                }}>
                  <FiFolder style={{ color: 'var(--primary)' }} />
                  <span>Level 1: {selectedDoc.folder || 'Root'}</span>
                  <FiChevronRight style={{ fontSize: '0.7rem' }} />
                  <FiFolder style={{ color: '#D97706' }} />
                  <span>Level 2: {selectedDoc.subfolder || 'General'}</span>
                  <FiChevronRight style={{ fontSize: '0.7rem' }} />
                  <FiFileText style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{selectedDoc.title}</span>
                </div>

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
                <h3>Pilih Dokumen dari Penjelajah Folder</h3>
                <p style={{ fontSize: '0.875rem' }}>Silakan pilih artikel dari indeks folder di sebelah kiri atau buat dokumen baru.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT DOCUMENTATION MODAL WITH FOLDER & SUBFOLDER SELECTORS */}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Level 1: Folder Utama *</label>
              <input
                type="text"
                className="form-control"
                list="folder-options"
                placeholder="Misal: 1. Arsitektur System & Core"
                value={formData.folder}
                onChange={(e) => setFormData(prev => ({ ...prev, folder: e.target.value }))}
                required
              />
              <datalist id="folder-options">
                {DEFAULT_FOLDERS.map(f => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label className="form-label">Level 2: Subfolder *</label>
              <input
                type="text"
                className="form-control"
                list="subfolder-options"
                placeholder="Misal: Backend & Database"
                value={formData.subfolder}
                onChange={(e) => setFormData(prev => ({ ...prev, subfolder: e.target.value }))}
                required
              />
              <datalist id="subfolder-options">
                {(DEFAULT_SUBFOLDERS[formData.folder] || ['General']).map(sf => (
                  <option key={sf} value={sf} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label className="form-label">Penulis (Author)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Admin / Dev"
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
