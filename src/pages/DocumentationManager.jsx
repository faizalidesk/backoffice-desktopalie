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
  FiEdit3, 
  FiTrash2, 
  FiUser, 
  FiBookOpen,
  FiFilePlus,
  FiSave,
  FiEye,
  FiEdit,
  FiMoreVertical
} from 'react-icons/fi';
import Header from '../components/Header';
import Modal from '../components/Modal';

const INITIAL_FOLDERS = ['Core', 'Backend', 'Frontend', 'Devops', 'QA', 'Meetings', 'Backlogs', 'Pending Synthesis'];

const DEFAULT_INITIAL_DOCS = [
  {
    id: 'doc-glossary',
    title: 'Glossary',
    folder: 'Core',
    slug: 'core-glossary',
    author: 'Tech lead + CTO',
    content: `Status: Living document, migrated from inputs/docs-v2/core/glossary.md on 2026-05-07. Owner: Tech lead + CTO. Update triggers: new term needs definition; existing term redefined; canonical naming convention updated.

Versi: 1.0 | Tanggal: 2026-04-28 | Status: Active | Scope: Istilah teknis spesifik Desktopalie Ecosystem.

### Terminology & Definitions

- **Desktopalie Platform**: Public website application for end users and visitors.
- **Backoffice Admin Workspace**: Administrative workspace panel managing settings, maintenance mode, and projects.
- **Supabase Realtime Synchronization**: PostgreSQL live broadcast mechanism used for instant multi-tab tab and cross-application updates.
- **Strikethrough QA Checklist**: Feature in task management enabling line-through text styling when subtasks pass verification.`,
    is_archived: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'doc-adr',
    title: 'ADR (Architecture Decision Record)',
    folder: 'Core',
    slug: 'core-adr',
    author: 'Lead Architect',
    content: `### ADR 001: Decision on State Sync & Storage Fallback

**Context**: Need reliable data synchronization between Backoffice and Public Platform.

**Decision**: Use Supabase Database with automatic LocalStorage fallback when offline or when credentials are missing.`,
    is_archived: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'doc-business-rules',
    title: 'Business Rules',
    folder: 'Core',
    slug: 'core-business-rules',
    author: 'Product Manager',
    content: `### Core Business Rules

1. Only authenticated administrators can access the Backoffice routes.
2. Mobile visitors (<900px screen) trying to access Backoffice will see the Desktop Only Guard.`,
    is_archived: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'doc-decision-log',
    title: 'Decision Log',
    folder: 'Core',
    slug: 'core-decision-log',
    author: 'Tech Lead',
    content: `### Key Decision Logs

- **2026-05-01**: Integrated sticky sidebar with collapsible 3-line hamburger menu toggle.
- **2026-05-05**: Added 2-column wide Task Detail Modal with subtask QA strikethrough.`,
    is_archived: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'doc-domain-boundary',
    title: 'Domain Boundary (Business)',
    folder: 'Core',
    slug: 'core-domain-boundary',
    author: 'Domain Architect',
    content: `### System Domain Boundaries

- **Core Admin Workspace**: Handles authentication, profile management, and dashboard analytics.
- **Task & QA Engine**: Manages Jira/Notion Kanban board, drag & drop status, and testing checklists.`,
    is_archived: false,
    created_at: new Date().toISOString()
  }
];

export default function DocumentationManager() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab state: 'active' | 'archived'
  const [viewTab, setViewTab] = useState('active');

  // Right Editor view mode: 'editor' | 'preview'
  const [editorMode, setEditorMode] = useState('editor');

  // Hover states to show action buttons ONLY on hover
  const [hoveredFolder, setHoveredFolder] = useState(null);
  const [hoveredDocId, setHoveredDocId] = useState(null);

  // Structural Folder State
  const [folders, setFolders] = useState(() => {
    const local = localStorage.getItem('desktopalie_v3_folders');
    return local ? JSON.parse(local) : INITIAL_FOLDERS;
  });

  const [expandedFolders, setExpandedFolders] = useState({
    'Docs v3': true,
    'Core': true,
    'Backend': true,
    'Frontend': true,
    'Devops': true,
    'QA': true
  });

  // Active Document Selection & Form States
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [docFolder, setDocFolder] = useState('Core');
  const [docContent, setDocContent] = useState('');
  const [docAuthor, setDocAuthor] = useState('Admin');
  const [isSaving, setIsSaving] = useState(false);

  // Modal State for adding new Folder or Doc
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [newDocData, setNewDocData] = useState({
    title: '',
    folder: 'Core',
    content: ''
  });

  useEffect(() => {
    loadDocs();
  }, []);

  useEffect(() => {
    localStorage.setItem('desktopalie_v3_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (selectedDoc) {
      setDocTitle(selectedDoc.title || '');
      setDocFolder(selectedDoc.folder || 'Core');
      setDocContent(selectedDoc.content || '');
      setDocAuthor(selectedDoc.author || 'Admin');
    }
  }, [selectedDoc]);

  const loadDocs = async () => {
    setLoading(true);
    try {
      let data = await backofficeService.getDocs();
      if (!data || data.length === 0) {
        data = DEFAULT_INITIAL_DOCS;
        localStorage.setItem('desktopalie_docs_fallback', JSON.stringify(data));
      }
      setDocs(data);
      if (data.length > 0 && !selectedDoc) {
        setSelectedDoc(data[0]);
      }
    } catch (err) {
      toast.error('Gagal memuat dokumentasi');
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

  // STEP 1: CREATE NEW FOLDER
  const handleCreateFolder = () => {
    const name = window.prompt('Masukkan Nama Folder Baru di bawah Docs v3:');
    if (!name || !name.trim()) return;

    const folderName = name.trim();
    if (folders.includes(folderName)) {
      toast.error('Folder dengan nama ini sudah ada!');
      return;
    }

    setFolders(prev => [...prev, folderName]);
    setExpandedFolders(prev => ({ ...prev, 'Docs v3': true, [folderName]: true }));
    toast.success(`Folder "${folderName}" berhasil dibuat di bawah Docs v3!`);
  };

  // RENAME FOLDER
  const handleRenameFolder = async (oldName) => {
    const name = window.prompt('Ubah Nama Folder:', oldName);
    if (!name || !name.trim() || name.trim() === oldName) return;

    const newName = name.trim();
    if (folders.includes(newName)) {
      toast.error('Folder dengan nama ini sudah ada!');
      return;
    }

    setFolders(prev => prev.map(f => f === oldName ? newName : f));

    setExpandedFolders(prev => {
      const next = { ...prev };
      if (next[oldName]) {
        next[newName] = true;
        delete next[oldName];
      }
      return next;
    });

    const docsToUpdate = docs.filter(d => (d.folder || 'Core') === oldName);
    for (const doc of docsToUpdate) {
      await backofficeService.updateDoc(doc.id, { folder: newName });
    }

    if (docFolder === oldName) {
      setDocFolder(newName);
    }

    toast.success(`Folder "${oldName}" berhasil diubah menjadi "${newName}"!`);
    loadDocs();
  };

  // DELETE FOLDER
  const handleDeleteFolder = async (folderName) => {
    const folderDocs = docs.filter(d => (d.folder || 'Core') === folderName);
    if (!window.confirm(`Apakah Anda yakin ingin menghapus folder "${folderName}" beserta ${folderDocs.length} dokumen di dalamnya?`)) return;

    setFolders(prev => prev.filter(f => f !== folderName));

    for (const doc of folderDocs) {
      await backofficeService.deleteDoc(doc.id);
    }

    toast.success(`Folder "${folderName}" dan isinya berhasil dihapus!`);
    loadDocs();
  };

  // STEP 2: CREATE NEW DOCUMENT IN A SPECIFIC FOLDER
  const handleOpenNewDocModal = (targetFolder = 'Core') => {
    setNewDocData({
      title: '',
      folder: targetFolder,
      content: ''
    });
    setIsNewDocModalOpen(true);
  };

  const handleCreateNewDoc = async (e) => {
    e.preventDefault();
    if (!newDocData.title.trim()) {
      toast.error('Judul dokumen wajib diisi!');
      return;
    }

    const slug = `${newDocData.folder.toLowerCase()}-${newDocData.title.toLowerCase().replace(/\s+/g, '-')}`;
    const payload = {
      title: newDocData.title,
      folder: newDocData.folder,
      slug,
      author: 'Admin',
      content: newDocData.content || `### ${newDocData.title}\n\nTulis isi dokumentasi di sini...`,
      is_archived: false
    };

    try {
      const created = await backofficeService.createDoc(payload);
      toast.success(`Dokumen "${newDocData.title}" berhasil dibuat!`);
      setIsNewDocModalOpen(false);
      await loadDocs();
      setSelectedDoc(created);
    } catch (err) {
      console.error(err);
      toast.error('Gagal membuat dokumen baru');
    }
  };

  // STEP 3: SAVE CURRENT DOCUMENT EDITS
  const handleSaveCurrentDoc = async () => {
    if (!selectedDoc) return;
    setIsSaving(true);
    try {
      const slug = `${docFolder.toLowerCase()}-${docTitle.toLowerCase().replace(/\s+/g, '-')}`;
      const updates = {
        title: docTitle,
        folder: docFolder,
        slug,
        content: docContent,
        author: docAuthor
      };

      await backofficeService.updateDoc(selectedDoc.id, updates);
      toast.success('Dokumen berhasil disimpan!');
      
      const updatedList = docs.map(d => d.id === selectedDoc.id ? { ...d, ...updates } : d);
      setDocs(updatedList);
      setSelectedDoc(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan dokumen');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchiveDoc = async (id, isArchivedNow) => {
    try {
      await backofficeService.updateDoc(id, { is_archived: !isArchivedNow });
      toast.success(isArchivedNow ? 'Dokumen dipulihkan dari arsip' : 'Dokumen diarsipkan');
      loadDocs();
    } catch (err) {
      toast.error('Gagal memperbarui status arsip');
    }
  };

  const handleDeleteDoc = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) return;
    try {
      await backofficeService.deleteDoc(id);
      toast.success('Dokumen dihapus');
      if (selectedDoc?.id === id) {
        const remaining = docs.filter(d => d.id !== id);
        setSelectedDoc(remaining.length > 0 ? remaining[0] : null);
      }
      loadDocs();
    } catch (err) {
      toast.error('Gagal menghapus dokumen');
    }
  };

  // Group Docs by Folder
  const docsByFolder = useMemo(() => {
    const map = {};
    const filteredDocs = docs.filter(d => viewTab === 'archived' ? d.is_archived : !d.is_archived);

    folders.forEach(f => {
      map[f] = filteredDocs.filter(d => (d.folder || 'Core') === f);
    });

    const remaining = filteredDocs.filter(d => !folders.includes(d.folder || 'Core'));
    if (remaining.length > 0) {
      map['Other'] = remaining;
    }

    return map;
  }, [docs, folders, viewTab]);

  return (
    <>
      <Header title="Dokumentasi" />
      <div className="page-body">
        {/* Page Subtitle & Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.25rem' }}>
            Documentation
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Folder + Doc hierarchy. Click a doc to open it. Drag to reorder.
          </p>

          {/* Filter Pills: Active / Archived & Add Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setViewTab('active')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  backgroundColor: viewTab === 'active' ? 'var(--primary-light)' : 'transparent',
                  color: viewTab === 'active' ? 'var(--primary)' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                Active
              </button>

              <button
                type="button"
                onClick={() => setViewTab('archived')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  backgroundColor: viewTab === 'archived' ? 'var(--primary-light)' : 'transparent',
                  color: viewTab === 'archived' ? 'var(--primary)' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                Archived
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleCreateFolder}>
                <FiFolderPlus style={{ color: 'var(--primary)' }} />
                <span>+ Create Folder</span>
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => handleOpenNewDocModal()}>
                <FiPlus />
                <span>+ Create Doc</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column GitBook/Obsidian Explorer Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '310px 1fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* LEFT SIDEBAR: TREE HIERARCHY EXPLORER */}
          <div className="table-container" style={{ padding: '0.875rem', backgroundColor: '#FFFFFF', minHeight: '680px' }}>
            {/* Root Folder: Docs v3 */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                onMouseEnter={() => setHoveredFolder('Docs v3')}
                onMouseLeave={() => setHoveredFolder(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0F172A',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: hoveredFolder === 'Docs v3' ? '#F8FAFC' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div 
                  onClick={() => toggleFolder('Docs v3')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1 }}
                >
                  {expandedFolders['Docs v3'] ? (
                    <FiChevronDown style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }} />
                  ) : (
                    <FiChevronRight style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }} />
                  )}
                  <FiFolder style={{ color: 'var(--primary)', fontSize: '0.95rem' }} />
                  <span>Docs v3</span>
                </div>

                {/* Direct "+ Folder" button on the Docs v3 root row */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateFolder();
                  }}
                  title="Buat Folder Baru di bawah Docs v3"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--border-color)',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <FiFolderPlus />
                  <span>+ Folder</span>
                </button>
              </div>

              {/* INNER FOLDER & DOCS TREE */}
              {expandedFolders['Docs v3'] && (
                <div style={{ paddingLeft: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                  {Object.keys(docsByFolder).map(folderName => {
                    const isFolderOpen = !!expandedFolders[folderName];
                    const folderDocs = docsByFolder[folderName] || [];
                    const isFolderHovered = hoveredFolder === folderName;

                    return (
                      <div key={folderName} style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* FOLDER ROW WITH HOVER-ONLY ACTION BUTTONS */}
                        <div
                          onMouseEnter={() => setHoveredFolder(folderName)}
                          onMouseLeave={() => setHoveredFolder(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.35rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            userSelect: 'none',
                            fontSize: '0.825rem',
                            fontWeight: '600',
                            color: '#334155',
                            backgroundColor: isFolderHovered ? '#F8FAFC' : 'transparent',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div 
                            onClick={() => toggleFolder(folderName)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, overflow: 'hidden' }}
                          >
                            {isFolderOpen ? (
                              <FiChevronDown style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} />
                            ) : (
                              <FiChevronRight style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }} />
                            )}
                            <FiFolder style={{ color: '#64748B', fontSize: '0.85rem', flexShrink: 0 }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{folderName}</span>
                          </div>

                          {/* Folder Action Buttons: Appears ONLY on Hover */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} onClick={(e) => e.stopPropagation()}>
                            {isFolderHovered && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRenameFolder(folderName)}
                                  title={`Ubah Nama Folder "${folderName}"`}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '0.1rem 0.2rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  <FiEdit3 />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteFolder(folderName)}
                                  title={`Hapus Folder "${folderName}"`}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#E11D48',
                                    cursor: 'pointer',
                                    padding: '0.1rem 0.2rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  <FiTrash2 />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenNewDocModal(folderName)}
                                  title={`+ Add Doc to "${folderName}"`}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    padding: '0.1rem 0.2rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  <FiPlus />
                                </button>
                              </>
                            )}

                            <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: '600', marginLeft: '0.15rem' }}>
                              {folderDocs.length}
                            </span>
                          </div>
                        </div>

                        {/* DOCS INSIDE THIS FOLDER */}
                        {isFolderOpen && (
                          <div style={{
                            paddingLeft: '1.15rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.15rem',
                            marginTop: '0.15rem',
                            borderLeft: '1px solid #E2E8F0',
                            marginLeft: '0.75rem'
                          }}>
                            {folderDocs.length === 0 ? (
                              <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '0.2rem 0.4rem' }}>
                                (Empty folder)
                              </div>
                            ) : (
                              folderDocs.map(doc => {
                                const isSelected = selectedDoc?.id === doc.id;
                                const isDocHovered = hoveredDocId === doc.id;

                                return (
                                  <div
                                    key={doc.id}
                                    onMouseEnter={() => setHoveredDocId(doc.id)}
                                    onMouseLeave={() => setHoveredDocId(null)}
                                    onClick={() => setSelectedDoc(doc)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '0.35rem 0.5rem',
                                      borderRadius: 'var(--radius-sm)',
                                      backgroundColor: isSelected ? '#EEF2FF' : isDocHovered ? '#F8FAFC' : 'transparent',
                                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                      fontWeight: isSelected ? '700' : '500',
                                      fontSize: '0.8rem',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                                      <span style={{ color: 'var(--text-subtle)', fontSize: '0.65rem' }}>::</span>
                                      <FiFileText style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }} />
                                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {doc.title}
                                      </span>
                                    </div>

                                    {/* Action Icons on Selected / Hover ONLY */}
                                    {(isDocHovered || isSelected) && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} onClick={(e) => e.stopPropagation()}>
                                        <button
                                          type="button"
                                          onClick={() => handleArchiveDoc(doc.id, doc.is_archived)}
                                          title={doc.is_archived ? "Restore from Archive" : "Archive"}
                                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.1rem' }}
                                        >
                                          <FiEdit3 style={{ fontSize: '0.75rem' }} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDoc(doc.id, doc.title)}
                                          title="Delete Doc"
                                          style={{ background: 'transparent', border: 'none', color: '#E11D48', cursor: 'pointer', padding: '0.1rem' }}
                                        >
                                          <FiTrash2 style={{ fontSize: '0.75rem' }} />
                                        </button>
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
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: DOCUMENT EDITOR & PREVIEW */}
          <div className="card" style={{ minHeight: '680px', padding: '1.75rem' }}>
            {selectedDoc ? (
              <div>
                {/* Editor vs Preview Tabs & Top Action Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '0.75rem',
                  marginBottom: '1.25rem'
                }}>
                  {/* Mode Tabs: Editor / Preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setEditorMode('editor')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: editorMode === 'editor' ? 'var(--primary)' : 'var(--text-muted)',
                        borderBottom: editorMode === 'editor' ? '2px solid var(--primary)' : '2px solid transparent',
                        paddingBottom: '0.4rem',
                        cursor: 'pointer'
                      }}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: editorMode === 'preview' ? 'var(--primary)' : 'var(--text-muted)',
                        borderBottom: editorMode === 'preview' ? '2px solid var(--primary)' : '2px solid transparent',
                        paddingBottom: '0.4rem',
                        cursor: 'pointer'
                      }}
                    >
                      Preview
                    </button>
                  </div>

                  {/* Save Button */}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveCurrentDoc}
                    disabled={isSaving}
                    style={{ padding: '0.4rem 1.25rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    <FiSave />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>

                {/* Path Breadcrumb */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
                  docs-v3 / {docFolder.toLowerCase()} / {selectedDoc.slug || 'doc-slug'}
                </div>

                {/* EDITOR MODE */}
                {editorMode === 'editor' ? (
                  <div>
                    {/* Document Title Input */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <input
                        type="text"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        placeholder="Document Title..."
                        style={{
                          width: '100%',
                          fontSize: '2rem',
                          fontWeight: '800',
                          border: 'none',
                          outline: 'none',
                          color: '#0F172A',
                          fontFamily: 'var(--font-sans)',
                          backgroundColor: 'transparent',
                          marginBottom: '0.5rem'
                        }}
                      />
                    </div>

                    {/* Metadata bar: Folder Selection & Author */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Folder</label>
                        <select
                          className="form-control"
                          value={docFolder}
                          onChange={(e) => setDocFolder(e.target.value)}
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.825rem', marginTop: '0.2rem' }}
                        >
                          {folders.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Owner / Author</label>
                        <input
                          type="text"
                          className="form-control"
                          value={docAuthor}
                          onChange={(e) => setDocAuthor(e.target.value)}
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.825rem', marginTop: '0.2rem' }}
                        />
                      </div>
                    </div>

                    {/* Rich Markdown Text Editor */}
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        rows="18"
                        value={docContent}
                        onChange={(e) => setDocContent(e.target.value)}
                        placeholder="Write documentation content here..."
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: '1.65',
                          fontFamily: "var(--font-sans)",
                          padding: '1.25rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          minHeight: '420px'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  /* PREVIEW MODE */
                  <div style={{ minHeight: '480px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', marginBottom: '1rem' }}>
                      {docTitle || 'Untitled Document'}
                    </h1>

                    <div style={{
                      backgroundColor: '#F8FAFC',
                      borderLeft: '4px solid var(--primary)',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: '#334155',
                      marginBottom: '1.5rem',
                      lineHeight: '1.6'
                    }}>
                      <strong>Owner / Author:</strong> {docAuthor || 'Admin'}<br />
                      <strong>Folder:</strong> {docFolder}
                    </div>

                    <div style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.75',
                      color: '#1E293B',
                      whiteSpace: 'pre-wrap',
                      fontFamily: "var(--font-sans)"
                    }}>
                      {docContent}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <FiBookOpen style={{ fontSize: '3rem', color: 'var(--text-subtle)', marginBottom: '1rem' }} />
                <h3>Select a document from the hierarchy explorer</h3>
                <p style={{ fontSize: '0.875rem' }}>Click any document in the tree to open, edit, or preview it.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE NEW DOCUMENT MODAL */}
      <Modal
        isOpen={isNewDocModalOpen}
        onClose={() => setIsNewDocModalOpen(false)}
        title="Create New Document"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateNewDoc}>
          <div className="form-group">
            <label className="form-label">Document Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Glossary, ADR, API Specification"
              value={newDocData.title}
              onChange={(e) => setNewDocData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Folder *</label>
            <select
              className="form-control"
              value={newDocData.folder}
              onChange={(e) => setNewDocData(prev => ({ ...prev, folder: e.target.value }))}
            >
              {folders.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Content</label>
            <textarea
              className="form-control"
              rows="6"
              placeholder="Write brief overview..."
              value={newDocData.content}
              onChange={(e) => setNewDocData(prev => ({ ...prev, content: e.target.value }))}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsNewDocModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Document
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
