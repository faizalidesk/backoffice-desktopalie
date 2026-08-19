import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiGrid, 
  FiList, 
  FiCheckCircle, 
  FiClock, 
  FiFileText, 
  FiFilter, 
  FiChevronRight, 
  FiChevronLeft,
  FiCheckSquare,
  FiX,
  FiTag,
  FiAlertCircle,
  FiLayers,
  FiCalendar
} from 'react-icons/fi';
import Header from '../components/Header';
import Modal from '../components/Modal';

const STATUSES = [
  { key: 'Not started', label: 'Not started', color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' },
  { key: 'In progress', label: 'In progress', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { key: 'Done', label: 'Done', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' }
];

const PRIORITIES = [
  { key: 'Low', label: 'Low', color: '#64748B' },
  { key: 'Medium', label: 'Medium', color: '#D97706' },
  { key: 'High', label: 'High', color: '#DC2626' },
  { key: 'Urgent', label: 'Urgent', color: '#9333EA' }
];

const CATEGORIES = ['Research', 'Development', 'Testing', 'Documentation', 'Design', 'General'];

export default function TodoListManager() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'table'

  // Drag and Drop States
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleOpenDeleteModal = (id, title) => {
    setTaskToDelete({ id, title });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await backofficeService.deleteTodo(taskToDelete.id);
      toast.success(`Tugas "${taskToDelete.title}" berhasil dihapus`);
      setIsDeleteModalOpen(false);
      if (isModalOpen) setIsModalOpen(false);
      setTaskToDelete(null);
      loadTodos();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus tugas');
    }
  };

  // Active Detail Form State (includes subtasks)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Not started',
    priority: 'Medium',
    category: 'Research',
    subtasks: []
  });

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getTodos();
      setTodos(data);
    } catch (err) {
      toast.error('Gagal memuat To-Do list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, id) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colKey) {
      setDragOverColumn(colKey);
    }
  };

  const handleDragLeave = (e, colKey) => {
    if (dragOverColumn === colKey) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = draggedTaskId || e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const task = todos.find(t => t.id === taskId);
    if (task && task.status !== targetStatus) {
      setTodos(prev => prev.map(t => t.id === taskId ? { ...t, status: targetStatus } : t));
      try {
        await backofficeService.updateTodo(taskId, { status: targetStatus });
        toast.success(`Tugas dipindahkan ke "${targetStatus}"`);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memindahkan tugas');
        loadTodos();
      }
    }
    setDraggedTaskId(null);
  };

  const handleOpenModal = (item = null, defaultStatus = 'Not started') => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        status: item.status || 'Not started',
        priority: item.priority || 'Medium',
        category: item.category || 'Research',
        subtasks: Array.isArray(item.subtasks) ? item.subtasks : []
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'Medium',
        category: 'Research',
        subtasks: []
      });
    }
    setNewSubtaskTitle('');
    setIsModalOpen(true);
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub = {
      id: `sub-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newSubtaskTitle.trim(),
      is_completed: false
    };

    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSub]
    }));
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(sub => 
        sub.id === subId ? { ...sub, is_completed: !sub.is_completed } : sub
      )
    }));
  };

  const handleDeleteSubtask = (subId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(sub => sub.id !== subId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Judul tugas wajib diisi');
      return;
    }

    try {
      if (editingItem) {
        await backofficeService.updateTodo(editingItem.id, formData);
        toast.success('Tugas berhasil diperbarui!');
      } else {
        const created = await backofficeService.createTodo(formData);
        toast.success('Tugas baru berhasil ditambahkan!');
        if (created) {
          setTodos(prev => [created, ...prev.filter(t => t.id !== created.id)]);
        }
      }
      setIsModalOpen(false);
      await loadTodos();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan tugas');
    }
  };

  const handleMoveStatus = async (id, currentStatus, direction) => {
    const statusKeys = STATUSES.map(s => s.key);
    const currentIndex = statusKeys.indexOf(currentStatus);
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= statusKeys.length) nextIndex = statusKeys.length - 1;

    const newStatus = statusKeys[nextIndex];
    if (newStatus === currentStatus) return;

    try {
      await backofficeService.updateTodo(id, { status: newStatus });
      toast.success(`Status diubah ke "${newStatus}"`);
      loadTodos();
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengubah status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus tugas "${title}"?`)) return;
    try {
      await backofficeService.deleteTodo(id);
      toast.success('Tugas berhasil dihapus');
      if (isModalOpen) setIsModalOpen(false);
      loadTodos();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus tugas');
    }
  };

  // Filter Logic
  const filteredTodos = todos.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const totalSubtasks = formData.subtasks.length;
  const completedSubtasks = formData.subtasks.filter(s => s.is_completed).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <>
      <Header title="To-Do List & Board" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>To-Do List & Sprint Board</h1>
            <p className="page-subtitle">Click any card to open the 2-section detail modal, edit info, and check off completed subtasks!</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* View Mode Switcher */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#E2E8F0',
              padding: '3px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'table' ? 'var(--text-main)' : 'var(--text-muted)',
                  boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <FiList />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('board')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: viewMode === 'board' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'board' ? 'var(--text-main)' : 'var(--text-muted)',
                  boxShadow: viewMode === 'board' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <FiGrid />
                <span>Board</span>
              </button>
            </div>

            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <FiPlus />
              <span>Add New Task</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="table-container" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
              <div className="search-input-wrapper" style={{ flex: 1 }}>
                <FiSearch />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search tasks or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Priority Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Priority:</span>
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="ALL">All Priorities</option>
                  {PRIORITIES.map(p => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Category:</span>
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
                Total: <strong>{filteredTodos.length}</strong> tugas
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Memuat To-Do board...
          </div>
        ) : viewMode === 'board' ? (
          /* NOTION / JIRA KANBAN BOARD VIEW WITH NATIVE DRAG & DROP */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '1.25rem',
            alignItems: 'start',
            width: '100%'
          }}>
            {STATUSES.map(col => {
              const columnTodos = filteredTodos.filter(t => t.status === col.key);
              const isOver = dragOverColumn === col.key;
              return (
                <div
                  key={col.key}
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={(e) => handleDragLeave(e, col.key)}
                  onDrop={(e) => handleDrop(e, col.key)}
                  style={{
                    backgroundColor: isOver ? col.bg : '#F8FAFC',
                    border: isOver ? `2px dashed ${col.color}` : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    minHeight: '480px',
                    minWidth: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Column Header Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '999px',
                        backgroundColor: col.bg,
                        border: `1px solid ${col.border}`,
                        color: col.color,
                        fontSize: '0.78rem',
                        fontWeight: '700'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: col.color }} />
                        {col.label}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                        {columnTodos.length}
                      </span>
                    </div>
                  </div>

                  {/* Task Cards Column Body */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1, minWidth: 0 }}>
                    {columnTodos.length === 0 ? (
                      <div style={{
                        padding: '1.5rem 1rem',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--text-subtle)',
                        border: '1px dashed var(--border-color)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        Tarik & lepas tugas ke sini
                      </div>
                    ) : (
                      columnTodos.map(task => {
                        const prioObj = PRIORITIES.find(p => p.key === task.priority) || PRIORITIES[0];
                        const isBeingDragged = draggedTaskId === task.id;
                        const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
                        const completedSubCount = subtasks.filter(s => s.is_completed).length;

                        return (
                          <div
                            key={task.id}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onClick={() => handleOpenModal(task)}
                            style={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.875rem 1rem',
                              boxShadow: isBeingDragged ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              cursor: 'pointer',
                              opacity: isBeingDragged ? 0.4 : 1,
                              minWidth: 0,
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', minWidth: 0 }}>
                              <FiFileText style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '3px', flexShrink: 0 }} />
                              <div style={{
                                flex: 1,
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                lineHeight: '1.35',
                                minWidth: 0,
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere'
                              }}>
                                {task.title}
                              </div>
                            </div>

                            {task.description && (
                              <p style={{
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                margin: 0,
                                paddingLeft: '1.45rem',
                                lineHeight: '1.45',
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {task.description}
                              </p>
                            )}

                            {/* Subtask Progress Indicator */}
                            {subtasks.length > 0 && (
                              <div style={{
                                paddingLeft: '1.45rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontSize: '0.725rem',
                                fontWeight: '600',
                                color: completedSubCount === subtasks.length ? '#16A34A' : 'var(--text-muted)'
                              }}>
                                <FiCheckSquare style={{ fontSize: '0.8rem' }} />
                                <span>{completedSubCount}/{subtasks.length} subtask selesai</span>
                              </div>
                            )}

                            {/* Tags & Action Row */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: '0.35rem',
                              paddingTop: '0.5rem',
                              borderTop: '1px solid #F1F5F9'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: '700',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '4px',
                                  backgroundColor: '#F1F5F9',
                                  color: prioObj.color
                                }}>
                                  {task.priority}
                                </span>
                                {task.category && (
                                  <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: '600',
                                    padding: '0.15rem 0.45rem',
                                    borderRadius: '4px',
                                    backgroundColor: '#E2E8F0',
                                    color: 'var(--text-muted)'
                                  }}>
                                    {task.category}
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-icon btn-sm"
                                  style={{ padding: '0.2rem 0.4rem', height: 'auto' }}
                                  onClick={() => handleMoveStatus(task.id, task.status, -1)}
                                  disabled={col.key === 'Not started'}
                                  title="Pindah Kiri"
                                >
                                  <FiChevronLeft style={{ fontSize: '0.85rem' }} />
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-secondary btn-icon btn-sm"
                                  style={{ padding: '0.2rem 0.4rem', height: 'auto' }}
                                  onClick={() => handleOpenModal(task)}
                                  title="Detail / Edit"
                                >
                                  <FiEdit style={{ fontSize: '0.85rem' }} />
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-danger btn-icon btn-sm"
                                  style={{ padding: '0.2rem 0.4rem', height: 'auto' }}
                                  onClick={() => handleOpenDeleteModal(task.id, task.title)}
                                  title="Hapus"
                                >
                                  <FiTrash2 style={{ fontSize: '0.85rem' }} />
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-secondary btn-icon btn-sm"
                                  style={{ padding: '0.2rem 0.4rem', height: 'auto' }}
                                  onClick={() => handleMoveStatus(task.id, task.status, 1)}
                                  disabled={col.key === 'Done'}
                                  title="Pindah Kanan"
                                >
                                  <FiChevronRight style={{ fontSize: '0.85rem' }} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Notion-style "+ New page" Button at bottom */}
                  <button
                    type="button"
                    onClick={() => handleOpenModal(null, col.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--text-muted)',
                      fontSize: '0.825rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FiPlus style={{ fontSize: '0.9rem' }} />
                    <span>New page</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul Tugas</th>
                  <th>Kategori</th>
                  <th>Prioritas</th>
                  <th>Subtask Check</th>
                  <th>Status Progres</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTodos.map(task => {
                  const statusObj = STATUSES.find(s => s.key === task.status) || STATUSES[0];
                  const prioObj = PRIORITIES.find(p => p.key === task.priority) || PRIORITIES[0];
                  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
                  const completedSubCount = subtasks.filter(s => s.is_completed).length;

                  return (
                    <tr key={task.id} style={{ cursor: 'pointer' }} onClick={() => handleOpenModal(task)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <FiFileText style={{ color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{task.title}</div>
                            {task.description && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{task.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                          {task.category || 'General'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: prioObj.color }}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                          {subtasks.length > 0 ? `${completedSubCount}/${subtasks.length} Selesai` : '-'}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '999px',
                          backgroundColor: statusObj.bg,
                          border: `1px solid ${statusObj.border}`,
                          color: statusObj.color,
                          fontSize: '0.78rem',
                          fontWeight: '700'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusObj.color }} />
                          {task.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            className="btn btn-secondary btn-icon btn-sm"
                            onClick={() => handleOpenModal(task)}
                            title="Detail / Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="btn btn-danger btn-icon btn-sm"
                            onClick={() => handleOpenDeleteModal(task.id, task.title)}
                            title="Hapus"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* WIDE 2-COLUMN TASK DETAIL MODAL (SECTION KIRI & SECTION KANAN) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Detail & Properti Tugas' : 'Tambah Tugas Baru'}
        maxWidth="880px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr',
            gap: '1.75rem',
            alignItems: 'start'
          }}>
            {/* SECTION KIRI: KONTEN UTAMA & CHECKLIST */}
            <div>
              {/* Judul Tugas */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Judul Utama Tugas *
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '1.1rem', fontWeight: '700', padding: '0.75rem 0.875rem' }}
                  placeholder="Judul tugas..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              {/* Deskripsi */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: 0 }}>
                    Catatan & Deskripsi Detail
                  </label>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.725rem', padding: '0.2rem 0.6rem', height: 'auto', background: '#F1F5F9', color: '#475569', fontWeight: 600, border: '1px solid #CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      description: prev.description 
                        ? `${prev.description}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
                        : `### 📌 Ringkasan Deskripsi\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n### 🎯 Kriteria Penerimaan & QA\n- [ ] Pengujian integrasi modul dan alur data Supabase realtime.\n- [ ] Validasi penanganan error dan respon UI pada layar desktop & mobile.\n- [ ] Uji coba pelepasan rilis dan verifikasi Jejak Audit.`
                    }))}
                  >
                    <span>✦ Generate Lorem Template</span>
                  </button>
                </div>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Tambahkan kriteria penerimaan, catatan QA, atau rincian pengujian..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* QA CHECKLIST SECTION (CORET GARIS STRIKETHROUGH) */}
              <div style={{
                marginTop: '1.25rem',
                padding: '1.15rem',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem'
                }}>
                  <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}>
                    <FiCheckSquare style={{ color: 'var(--primary)' }} />
                    <span>Checklist & Subtask QA ({completedSubtasks}/{totalSubtasks})</span>
                  </label>

                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: progressPercent === 100 ? '#16A34A' : 'var(--text-muted)' }}>
                    {progressPercent}% Selesai
                  </span>
                </div>

                {/* Progress bar */}
                {totalSubtasks > 0 && (
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      backgroundColor: progressPercent === 100 ? '#16A34A' : 'var(--primary)',
                      borderRadius: '999px',
                      transition: 'width 0.3s ease, background-color 0.3s ease'
                    }} />
                  </div>
                )}

                {/* Checklist Items */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  marginBottom: '0.875rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  paddingRight: '0.35rem'
                }}>
                  {formData.subtasks.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '0.25rem 0' }}>
                      No checklist items yet. Add a new subtask below!
                    </div>
                  ) : (
                    formData.subtasks.map(sub => (
                      <div key={sub.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.45rem 0.75rem',
                        gap: '0.5rem',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          cursor: 'pointer',
                          flex: 1,
                          userSelect: 'none'
                        }}>
                          <input
                            type="checkbox"
                            checked={sub.is_completed}
                            onChange={() => handleToggleSubtask(sub.id)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                          />
                          <span style={{
                            fontSize: '0.85rem',
                            fontWeight: sub.is_completed ? '400' : '600',
                            color: sub.is_completed ? '#94A3B8' : '#0F172A',
                            textDecoration: sub.is_completed ? 'line-through' : 'none',
                            transition: 'all 0.15s ease'
                          }}>
                            {sub.title}
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDeleteSubtask(sub.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: '0.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.85rem'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = '#E11D48'}
                          onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
                          title="Delete Subtask"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Input Add Subtask */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: '0.825rem', padding: '0.45rem 0.75rem' }}
                    placeholder="+ Add checklist / testing item..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddSubtask}
                    style={{ flexShrink: 0 }}
                  >
                    <FiPlus />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION: PROPERTY & ACTIONS PANEL */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <h4 style={{
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                margin: 0,
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                Properties & Status
              </h4>

              {/* Status Progress Selector */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                  <FiLayers style={{ color: 'var(--primary)' }} />
                  <span>Progress Status</span>
                </label>
                <select
                  className="form-control"
                  style={{ fontWeight: '600' }}
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  {STATUSES.map(s => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority Selector */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                  <FiAlertCircle style={{ color: '#D97706' }} />
                  <span>Priority Level</span>
                </label>
                <select
                  className="form-control"
                  style={{ fontWeight: '600' }}
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                >
                  {PRIORITIES.map(p => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Selector */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                  <FiTag style={{ color: '#0D9488' }} />
                  <span>Task Category</span>
                </label>
                <select
                  className="form-control"
                  style={{ fontWeight: '600' }}
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Status Metadata Summary */}
              <div style={{
                padding: '0.875rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FiCalendar />
                  <span>Created: {editingItem?.created_at ? new Date(editingItem.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'New'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FiCheckCircle />
                  <span>QA Subtasks: {completedSubtasks} of {totalSubtasks} Completed</span>
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <FiCheckCircle />
                  <span>Save Changes</span>
                </button>

                {editingItem && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleOpenDeleteModal(editingItem.id, editingItem.title)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <FiTrash2 />
                    <span>Delete This Task</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* CUSTOM REACT DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
            <FiTrash2 size={20} />
            <span>Hapus Tugas</span>
          </div>
        }
        maxWidth="460px"
      >
        <div style={{ padding: '8px 0' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
            Apakah Anda yakin ingin menghapus tugas <strong style={{ color: '#0f172a' }}>"{taskToDelete?.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: '#ffffff' }}
              onClick={handleConfirmDelete}
            >
              Hapus Tugas
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
