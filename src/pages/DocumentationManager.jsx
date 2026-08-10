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

const INITIAL_FOLDERS = [
  '1. Arsitektur System & Core',
  '2. Panduan Operasional (SOP)',
  '3. QA & Quality Assurance'
];

const INITIAL_SUBFOLDERS = {
  '1. Arsitektur System & Core': ['Backend & Database', 'Frontend & Platform'],
  '2. Panduan Operasional (SOP)': ['Maintenance & Security', 'Content Management'],
  '3. QA & Quality Assurance': ['Testing & Bug Management', 'Checklist & Task Board']
};

export default function DocumentationManager() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Folder & Subfolder Structural State
  const [folderList, setFolderList] = useState(() => {
    const local = localStorage.getItem('desktopalie_doc_folders');
    return local ? JSON.parse(local) : INITIAL_FOLDERS;
  });

  const [subfolderMap, setSubfolderMap] = useState(() => {
    const local = localStorage.getItem('desktopalie_doc_subfolders');
    return local ? JSON.parse(local) : INITIAL_SUBFOLDERS;
  });

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

  // Modal State for Document
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

  useEffect(() => {
    localStorage.setItem('desktopalie_doc_folders', JSON.stringify(folderList));
  }, [folderList]);

  useEffect(() => {
    localStorage.setItem('desktopalie_doc_subfolders', JSON.stringify(subfolderMap));
  }, [subfolderMap]);

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

  // STEP 1: CREATE MAIN FOLDER (LEVEL 1)
  const handleCreateFolder = () => {
    const input = window.prompt('Masukkan Nama Folder Utama (Level 1) baru:');
    if (!input || !input.trim()) return;

    const folderName = input.trim();
    if (folderList.includes(folderName)) {
      toast.error('Folder dengan nama tersebut sudah ada!');
      return;
    }

    setFolderList(prev => [...prev, folderName]);
    setSubfolderMap(prev => ({ ...prev, [folderName]: [] }));
    setExpandedFolders(prev => ({ ...prev, [folderName]: true }));
    toast.success(`Folder Utama "${folderName}" berhasil dibuat!`);
  };

  // STEP 2: CREATE SUBFOLDER (LEVEL 2) INSIDE A MAIN FOLDER
  const handleCreateSubfolder = (parentFolder) => {
    const input = window.prompt(`Masukkan Nama Subfolder (Level 2) baru di dalam "${parentFolder}":`);
    if (!input || !input.trim()) return;

    const subfolderName = input.trim();
    const currentSubs = subfolderMap[parentFolder] || [];

    if (currentSubs.includes(subfolderName)) {
      toast.error('Subfolder tersebut sudah ada di dalam folder ini!');
      return;
    }

    setSubfolderMap(prev => ({
      ...prev,
      [parentFolder]: [...currentSubs, subfolderName]
    }));
    setExpandedFolders(prev => ({ ...prev, [parentFolder]: true }));
    setExpandedSubfolders(prev => ({ ...prev, [subfolderName]: true }));
    toast.success(`Subfolder "${subfolderName}" dibuat di dalam "${parentFolder}"!`);
  };

  // STEP 3: CREATE DOCUMENT INSIDE A SUBFOLDER
  const handleOpenDocModal = (doc = null, defaultFolder = '', defaultSubfolder = '') => {
    const folderToUse = defaultFolder || folderList[0] || '1. Arsitektur System & Core';
    const subfolderToUse = defaultSubfolder || (subfolderMap[folderToUse]?.[0]) || 'General';

    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title || '',
        folder: doc.folder || folderToUse,
        subfolder: doc.subfolder || subfolderToUse,
        category: doc.category || 'Guides',
        author: doc.author || 'Admin',
        content: doc.content || ''
      });
    } else {
      setEditingDoc(null);
      setFormData({
        title: '',
        folder: folderToUse,
        subfolder: subfolderToUse,
        category: 'Guides',
        author: 'Admin',
        content: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmitDoc = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Judul dokumentasi wajib diisi');
      return;
    }

    try {
      if (editingDoc) {
        await backofficeService.updateDoc(editingDoc.id, formData);
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

  const handleDeleteDoc = async (id, title) => {
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

  // Build Tree Structure combining folderList, subfolderMap, and docs
  const treeStructure = useMemo(() => {
    const allFolders = Array.from(new Set([...folderList, ...docs.map(d => d.folder || 'Uncategorized')]));
    const result = [];

    allFolders.forEach(folderName => {
      const definedSubs = subfolderMap[folderName] || [];
      const docsInFolder = docs.filter(d => (d.folder || 'Uncategorized') === folderName);
      const docSubs = docsInFolder.map(d => d.subfolder || 'General');

      const allSubfolderNames = Array.from(new Set([...definedSubs, ...docSubs]));
      const subfolders = [];

      allSubfolderNames.forEach(subName => {
        const matchingDocs = docsInFolder.filter(d => (d.subfolder || 'General') === subName);

        const matchesSearch = !search || 
          folderName.toLowerCase().includes(search.toLowerCase()) ||
          subName.toLowerCase().includes(search.toLowerCase()) ||
          matchingDocs.some(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.content.toLowerCase().includes(search.toLowerCase()));

        if (matchesSearch) {
          subfolders.push({
            name: subName,
            docs: matchingDocs
          });
        }
      });

      if (!search || subfolders.length > 0 || folderName.toLowerCase().includes(search.toLowerCase())) {
        result.push({
          name: folderName,
          subfolders
        });
      }
    });

    return result;
  }, [folderList, subfolderMap, docs, search]);

  return (
    <>
      <Header title="Dokumentasi Sistem" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>System Documentation & Knowledge Base</h1>
            <p className="page-subtitle">1. Buat Folder Utama ➔ 2. Buat Subfolder di dalamnya ➔ 3. Tambah Dokumen.</p>
          </div>

          {/* Action Bar: Create Folder Button */}
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <button className="btn btn-secondary" onClick={handleCreateFolder}>
              <FiFolderPlus style={{ color: 'var(--primary)' }} />
              <span>+ Buat Folder Utama</span>
            </button>

            <button className="btn btn-primary" onClick={() => handleOpenDocModal()}>
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
          {/* LEFT SIDEBAR: INTERACTIVE FOLDER TREE EXPLORER */}
          <div className="table-container" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FiFolder style={{ color: 'var(--primary)' }} />
                <span>Folder Explorer</span>
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
                placeholder="Cari folder / dokumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Folder & Subfolder Tree */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              maxHeight: '620px',
              overflowY: 'auto',
              paddingRight: '0.2rem'
            }}>
              {loading ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Memuat struktur folder...
                </div>
              ) : treeStructure.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  Belum ada folder. Klik "+ Buat Folder Utama" di atas!
                </div>
              ) : (
                treeStructure.map(folder => {
                  const isFolderExpanded = search ? true : !!expandedFolders[folder.name];
                  const totalFolderDocs = folder.subfolders.reduce((acc, sf) => acc + sf.docs.length, 0);

                  return (
                    <div key={folder.name} style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* LEVEL 1: MAIN FOLDER ROW */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.45rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#F1F5F9',
                        fontWeight: '700',
                        fontSize: '0.825rem',
                        color: '#0F172A',
                        transition: 'all 0.15s ease'
                      }}>
                        <div 
                          onClick={() => toggleFolder(folder.name)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', flex: 1, cursor: 'pointer' }}
                        >
                          {isFolderExpanded ? (
                            <FiChevronDown style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          ) : (
                            <FiChevronRight style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          )}
                          <FiFolder style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{folder.name}</span>
                        </div>

                        {/* STEP 2 ACTION: CREATE SUBFOLDER BUTTON */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleCreateSubfolder(folder.name)}
                            title={`+ Buat Subfolder di dalam "${folder.name}"`}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid var(--border-color)',
                              color: 'var(--primary)',
                              cursor: 'pointer',
                              padding: '0.15rem 0.4rem',
                              borderRadius: '4px',
                              fontSize: '0.725rem',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            <FiPlus />
                            <span>Subfolder</span>
                          </button>
                        </div>
                      </div>

                      {/* LEVEL 2 SUBFOLDERS & LEVEL 3 DOCS */}
                      {isFolderExpanded && (
                        <div style={{
                          paddingLeft: '0.75rem',
                          marginTop: '0.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem',
                          borderLeft: '2px dashed var(--border-color)',
                          marginLeft: '0.75rem'
                        }}>
                          {folder.subfolders.length === 0 ? (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '0.25rem 0.5rem' }}>
                              Belum ada subfolder. Klik "+ Subfolder" di samping folder!
                            </div>
                          ) : (
                            folder.subfolders.map(subfolder => {
                              const isSubExpanded = search ? true : !!expandedSubfolders[subfolder.name];

                              return (
                                <div key={subfolder.name} style={{ display: 'flex', flexDirection: 'column' }}>
                                  {/* LEVEL 2 SUBFOLDER ROW */}
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'transparent',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    color: '#334155'
                                  }}>
                                    <div 
                                      onClick={() => toggleSubfolder(subfolder.name)}
                                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, cursor: 'pointer' }}
                                    >
                                      {isSubExpanded ? (
                                        <FiChevronDown style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }} />
                                      ) : (
                                        <FiChevronRight style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }} />
                                      )}
                                      <FiFolder style={{ color: '#D97706', fontSize: '0.85rem' }} />
                                      <span>{subfolder.name}</span>
                                    </div>

                                    {/* STEP 3 ACTION: CREATE DOCUMENT BUTTON */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenDocModal(null, folder.name, subfolder.name)}
                                        title={`+ Tambah Dokumen di "${subfolder.name}"`}
                                        style={{
                                          background: 'transparent',
                                          border: '1px solid #FDE68A',
                                          backgroundColor: '#FEF3C7',
                                          color: '#B45309',
                                          cursor: 'pointer',
                                          padding: '0.1rem 0.35rem',
                                          borderRadius: '4px',
                                          fontSize: '0.7rem',
                                          fontWeight: '700',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.2rem'
                                        }}
                                      >
                                        <FiFilePlus />
                                        <span>Dokumen</span>
                                      </button>
                                      <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                                        ({subfolder.docs.length})
                                      </span>
                                    </div>
                                  </div>

                                  {/* LEVEL 3 DOCUMENTS */}
                                  {isSubExpanded && (
                                    <div style={{
                                      paddingLeft: '1.25rem',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '0.2rem',
                                      marginTop: '0.15rem'
                                    }}>
                                      {subfolder.docs.length === 0 ? (
                                        <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '0.2rem 0' }}>
                                          Kosong. Klik "+ Dokumen" untuk buat baru!
                                        </div>
                                      ) : (
                                        subfolder.docs.map(doc => {
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
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
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
                  <span>{selectedDoc.folder || 'Root'}</span>
                  <FiChevronRight style={{ fontSize: '0.7rem' }} />
                  <FiFolder style={{ color: '#D97706' }} />
                  <span>{selectedDoc.subfolder || 'General'}</span>
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
                      onClick={() => handleOpenDocModal(selectedDoc)}
                    >
                      <FiEdit />
                      <span>Edit Dokumen</span>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteDoc(selectedDoc.id, selectedDoc.title)}
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
                <p style={{ fontSize: '0.875rem' }}>Silakan pilih artikel dari indeks folder di sebelah kiri atau buat folder/dokumen baru.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENT FORM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoc ? 'Edit Dokumen Sistem' : 'Tambah Dokumen Baru'}
        maxWidth="760px"
      >
        <form onSubmit={handleSubmitDoc}>
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
              <label className="form-label">Folder Utama (Level 1)</label>
              <select
                className="form-control"
                value={formData.folder}
                onChange={(e) => setFormData(prev => ({ ...prev, folder: e.target.value }))}
              >
                {folderList.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subfolder (Level 2)</label>
              <select
                className="form-control"
                value={formData.subfolder}
                onChange={(e) => setFormData(prev => ({ ...prev, subfolder: e.target.value }))}
              >
                {(subfolderMap[formData.folder] || ['General']).map(sf => (
                  <option key={sf} value={sf}>{sf}</option>
                ))}
              </select>
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
