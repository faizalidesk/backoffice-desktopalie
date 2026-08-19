import { useState, useMemo, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { 
  FiSearch, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiChevronsLeft, 
  FiChevronsRight, 
  FiFilter, 
  FiDownload, 
  FiRefreshCw, 
  FiEye, 
  FiCopy, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle, 
  FiRotateCcw, 
  FiDollarSign, 
  FiCreditCard, 
  FiUser, 
  FiCalendar, 
  FiCheck, 
  FiLayers, 
  FiPlus, 
  FiTrash2, 
  FiArrowUp, 
  FiArrowDown, 
  FiPrinter, 
  FiFileText,
  FiSliders
} from 'react-icons/fi';
import Modal from './Modal';
import { backofficeService } from '../services/backofficeService';
import { useFlavor } from '../context/FlavorContext';

// Helper: Format Rupiah Currency
export function formatIDR(amount) {
  if (typeof amount !== 'number') {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return 'Rp 0';
    amount = parsed;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Helper: Format Full Date Time
export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
  } catch {
    return dateStr;
  }
}

// Helper: Status Config & Badge Colors
export const STATUS_CONFIG = {
  Sukses: {
    label: 'Sukses',
    badgeClass: 'badge-teal',
    icon: FiCheckCircle,
    color: '#0D9488',
    bg: 'rgba(13, 148, 136, 0.12)',
    border: 'rgba(13, 148, 136, 0.25)'
  },
  Pending: {
    label: 'Menunggu',
    badgeClass: 'badge-amber',
    icon: FiClock,
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.12)',
    border: 'rgba(217, 119, 6, 0.25)'
  },
  Gagal: {
    label: 'Gagal',
    badgeClass: 'badge-rose',
    icon: FiAlertCircle,
    color: '#E11D48',
    bg: 'rgba(225, 29, 72, 0.12)',
    border: 'rgba(225, 29, 72, 0.25)'
  },
  Refund: {
    label: 'Refund',
    badgeClass: 'badge-violet',
    icon: FiRotateCcw,
    color: '#7C3AED',
    bg: 'rgba(124, 58, 237, 0.12)',
    border: 'rgba(124, 58, 237, 0.25)'
  }
};

export default function TransactionTable({
  transactions: propTransactions,
  title = 'Daftar Transaksi',
  subtitle = 'Kelola dan pantau seluruh transaksi keuangan, status pembayaran, dan riwayat pesanan.',
  itemsPerPageOptions = [5, 10, 20, 50],
  defaultItemsPerPage = 10,
  showStats = true,
  showFilters = true,
  onRefresh,
  onViewDetails,
  onStatusChange,
  allowSelection = true,
  allowNewTransaction = true
}) {
  const { flavorId, activeFlavor } = useFlavor();

  // Internal Data State (if not passed as controlled prop)
  const [internalTransactions, setInternalTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters State
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL'); // ALL | TODAY | 7DAYS | 30DAYS | THIS_MONTH

  // Sorting State
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Detail Modal State
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // New Transaction Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newFormData, setNewFormData] = useState({
    customer_name: '',
    customer_email: '',
    item_name: '',
    category: 'Cloud Infrastructure',
    platform: flavorId || 'platform1',
    amount: '',
    payment_method: 'QRIS',
    status: 'Sukses',
    notes: ''
  });

  const searchInputRef = useRef(null);

  // Fetch initial data if not provided via props
  const loadData = async () => {
    setLoading(true);
    try {
      if (propTransactions) {
        setInternalTransactions(propTransactions);
      } else {
        const data = await backofficeService.getTransactions(flavorId || null);
        setInternalTransactions(data || []);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      toast.error('Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propTransactions) {
      setInternalTransactions(propTransactions);
    } else {
      loadData();
    }
  }, [propTransactions, flavorId]);

  const activeTransactions = propTransactions || internalTransactions;

  // Search Submission Handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setAppliedSearch(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setAppliedSearch('');
    setCurrentPage(1);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchInput('');
    setAppliedSearch('');
    setStatusFilter('ALL');
    setPaymentFilter('ALL');
    setPlatformFilter('ALL');
    setDateRangeFilter('ALL');
    setCurrentPage(1);
    toast.success('Filter pencarian telah di-reset');
  };

  // Manual Refresh Handler
  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    } else {
      await loadData();
    }
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Data transaksi berhasil diperbarui');
    }, 400);
  };

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return activeTransactions.filter((item) => {
      // 1. Search Query Filter
      if (appliedSearch) {
        const query = appliedSearch.toLowerCase();
        const matchId = (item.id || '').toLowerCase().includes(query);
        const matchInvoice = (item.invoice_number || '').toLowerCase().includes(query);
        const matchCustomer = (item.customer_name || '').toLowerCase().includes(query);
        const matchEmail = (item.customer_email || '').toLowerCase().includes(query);
        const matchItem = (item.item_name || '').toLowerCase().includes(query);
        const matchPayment = (item.payment_method || '').toLowerCase().includes(query);
        const matchAmount = String(item.total_amount || item.amount || '').includes(query);
        const matchNotes = (item.notes || '').toLowerCase().includes(query);
        
        if (!matchId && !matchInvoice && !matchCustomer && !matchEmail && !matchItem && !matchPayment && !matchAmount && !matchNotes) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // 3. Payment Method Filter
      if (paymentFilter !== 'ALL' && item.payment_method !== paymentFilter) {
        return false;
      }

      // 4. Platform Filter
      if (platformFilter !== 'ALL' && item.platform !== platformFilter) {
        return false;
      }

      // 5. Date Range Filter
      if (dateRangeFilter !== 'ALL' && item.created_at) {
        const itemDate = new Date(item.created_at);
        const now = new Date();
        if (dateRangeFilter === 'TODAY') {
          const isToday = itemDate.toDateString() === now.toDateString();
          if (!isToday) return false;
        } else if (dateRangeFilter === '7DAYS') {
          const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
          if (diffDays > 7) return false;
        } else if (dateRangeFilter === '30DAYS') {
          const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
          if (diffDays > 30) return false;
        } else if (dateRangeFilter === 'THIS_MONTH') {
          const sameMonth = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
          if (!sameMonth) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'created_at') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      } else if (sortField === 'amount' || sortField === 'total_amount') {
        aVal = Number(a.total_amount || a.amount || 0);
        bVal = Number(b.total_amount || b.amount || 0);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [activeTransactions, appliedSearch, statusFilter, paymentFilter, platformFilter, dateRangeFilter, sortField, sortDirection]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const totalCount = activeTransactions.length;
    const totalRevenue = activeTransactions
      .filter(t => t.status === 'Sukses')
      .reduce((sum, t) => sum + (t.total_amount || t.amount || 0), 0);
    const successCount = activeTransactions.filter(t => t.status === 'Sukses').length;
    const pendingCount = activeTransactions.filter(t => t.status === 'Pending').length;
    const failedOrRefundCount = activeTransactions.filter(t => t.status === 'Gagal' || t.status === 'Refund').length;

    return {
      totalCount,
      totalRevenue,
      successCount,
      pendingCount,
      failedOrRefundCount
    };
  }, [activeTransactions]);

  // Status Filter Counts
  const statusCounts = useMemo(() => {
    return {
      ALL: activeTransactions.length,
      Sukses: activeTransactions.filter(t => t.status === 'Sukses').length,
      Pending: activeTransactions.filter(t => t.status === 'Pending').length,
      Gagal: activeTransactions.filter(t => t.status === 'Gagal').length,
      Refund: activeTransactions.filter(t => t.status === 'Refund').length
    };
  }, [activeTransactions]);

  // Pagination Calculations
  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentRows = filteredTransactions.slice(startIndex, endIndex);

  // Pagination Page Numbers Generator with Ellipsis
  const paginationPages = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, validCurrentPage - 1);
      let end = Math.min(totalPages - 1, validCurrentPage + 1);

      if (validCurrentPage <= 3) {
        start = 2;
        end = 4;
      } else if (validCurrentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, validCurrentPage]);

  // Sort Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Jump to Page Handler
  const handleJumpPage = (e) => {
    e.preventDefault();
    const target = parseInt(jumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      setCurrentPage(target);
      setJumpPageInput('');
    } else {
      toast.error(`Halaman tidak valid. Masukkan antara 1 dan ${totalPages}`);
    }
  };

  // Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = currentRows.map(r => r.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    } else {
      const pageIds = new Set(currentRows.map(r => r.id));
      setSelectedIds(selectedIds.filter(id => !pageIds.has(id)));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllCurrentSelected = currentRows.length > 0 && currentRows.every(r => selectedIds.includes(r.id));
  const isSomeCurrentSelected = currentRows.some(r => selectedIds.includes(r.id)) && !isAllCurrentSelected;

  // Copy to Clipboard Helper
  const handleCopy = (text, label = 'Teks') => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} berhasil disalin!`);
    }
  };

  // Open Details Modal
  const handleOpenDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
    if (onViewDetails) onViewDetails(transaction);
  };

  // Quick Status Update
  const handleUpdateStatus = async (transactionId, newStatus) => {
    try {
      if (onStatusChange) {
        await onStatusChange(transactionId, newStatus);
      } else {
        const updated = await backofficeService.updateTransactionStatus(transactionId, newStatus, flavorId);
        setInternalTransactions(updated);
      }
      toast.success(`Status transaksi #${transactionId} diubah menjadi "${newStatus}"`);
      if (selectedTransaction && selectedTransaction.id === transactionId) {
        setSelectedTransaction(prev => ({
          ...prev,
          status: newStatus,
          paid_at: newStatus === 'Sukses' ? new Date().toISOString() : prev.paid_at
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui status');
    }
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedIds.length === 0) return;
    try {
      let updatedList = [...activeTransactions];
      for (const id of selectedIds) {
        updatedList = updatedList.map(t => {
          if (t.id === id) {
            return {
              ...t,
              status: newStatus,
              paid_at: newStatus === 'Sukses' ? (t.paid_at || new Date().toISOString()) : t.paid_at
            };
          }
          return t;
        });
      }
      await backofficeService.saveTransactions(updatedList, flavorId);
      setInternalTransactions(updatedList);
      toast.success(`${selectedIds.length} transaksi berhasil ditandai sebagai "${newStatus}"`);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memproses tindakan massal');
    }
  };

  // Export to CSV
  const handleExportCSV = (targetData = null) => {
    const dataToExport = targetData || (selectedIds.length > 0 
      ? activeTransactions.filter(t => selectedIds.includes(t.id))
      : filteredTransactions);

    if (dataToExport.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const headers = ['ID Transaksi', 'No Invoice', 'Pelanggan', 'Email', 'Item/Layanan', 'Metode Pembayaran', 'Status', 'Nominal (IDR)', 'Pajak (IDR)', 'Total (IDR)', 'Tanggal Dibuat', 'Tanggal Bayar', 'Catatan'];
    const rows = dataToExport.map(t => [
      t.id,
      t.invoice_number || '',
      `"${(t.customer_name || '').replace(/"/g, '""')}"`,
      t.customer_email || '',
      `"${(t.item_name || '').replace(/"/g, '""')}"`,
      t.payment_method || '',
      t.status || '',
      t.amount || 0,
      t.tax || 0,
      t.total_amount || t.amount || 0,
      t.created_at || '',
      t.paid_at || '',
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transaksi_desktopalie_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Berhasil mengekspor ${dataToExport.length} data transaksi (CSV)`);
  };

  // Add New Transaction Handler
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    if (!newFormData.customer_name || !newFormData.item_name || !newFormData.amount) {
      toast.error('Harap lengkapi semua kolom wajib');
      return;
    }

    const amountNum = parseFloat(newFormData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Nominal transaksi harus berupa angka positif');
      return;
    }

    const taxAmount = Math.round(amountNum * 0.11);
    const feeAmount = newFormData.payment_method === 'Kartu Kredit' ? 0 : 4500;
    const totalAmount = amountNum + taxAmount + feeAmount;

    const newTx = {
      id: `TRX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
      invoice_number: `INV/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(10000 + Math.random() * 90000)}`,
      customer_name: newFormData.customer_name,
      customer_email: newFormData.customer_email || 'customer@desktopalie.my.id',
      customer_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newFormData.customer_name)}&background=4F46E5&color=fff`,
      item_name: newFormData.item_name,
      category: newFormData.category,
      platform: newFormData.platform || flavorId || 'platform1',
      platform_name: newFormData.platform === 'platform2' ? 'Desktopalie Beta' : newFormData.platform === 'platform3' ? 'Desktopalie Gamma' : newFormData.platform === 'platform4' ? 'Desktopalie Delta' : 'Desktopalie Main',
      amount: amountNum,
      tax: taxAmount,
      fee: feeAmount,
      total_amount: totalAmount,
      payment_method: newFormData.payment_method,
      payment_channel: `${newFormData.payment_method} Gateway`,
      status: newFormData.status,
      created_at: new Date().toISOString(),
      paid_at: newFormData.status === 'Sukses' ? new Date().toISOString() : null,
      notes: newFormData.notes || 'Transaksi baru dibuat manual melalui backoffice.'
    };

    try {
      const updated = [newTx, ...activeTransactions];
      await backofficeService.saveTransactions(updated, flavorId);
      setInternalTransactions(updated);
      toast.success('Transaksi baru berhasil ditambahkan!');
      setIsNewModalOpen(false);
      setNewFormData({
        customer_name: '',
        customer_email: '',
        item_name: '',
        category: 'Cloud Infrastructure',
        platform: flavorId || 'platform1',
        amount: '',
        payment_method: 'QRIS',
        status: 'Sukses',
        notes: ''
      });
    } catch (err) {
      console.error(err);
      toast.error('Gagal menambahkan transaksi');
    }
  };

  return (
    <div className="transaction-table-component" style={{ width: '100%' }}>
      {/* 1. COMPONENT HEADER */}
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              <FiDollarSign />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                {title}
              </h1>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleRefresh}
            className="btn btn-secondary"
            title="Muat ulang data transaksi"
            disabled={refreshing || loading}
          >
            <FiRefreshCw className={refreshing ? 'spin-anim' : ''} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => handleExportCSV()}
            className="btn btn-secondary"
            title="Unduh data dalam format CSV"
          >
            <FiDownload />
            <span>Ekspor CSV</span>
          </button>

          {allowNewTransaction && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="btn btn-primary"
            >
              <FiPlus />
              <span>Tambah Transaksi</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. STATS SUMMARY KPI CARDS */}
      {showStats && (
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Transaksi</div>
              <div className="stat-value">{stats.totalCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Semua platform terdaftar
              </div>
            </div>
            <div className="stat-icon violet">
              <FiLayers />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Volume Pendapatan</div>
              <div className="stat-value" style={{ color: 'var(--accent-teal)' }}>
                {formatIDR(stats.totalRevenue)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {stats.successCount} transaksi lunas
              </div>
            </div>
            <div className="stat-icon teal">
              <FiDollarSign />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Menunggu Pembayaran</div>
              <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
                {stats.pendingCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Perlu tindak lanjut verifikasi
              </div>
            </div>
            <div className="stat-icon amber">
              <FiClock />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Gagal / Refund</div>
              <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>
                {stats.failedOrRefundCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Batal atau kadaluarsa
              </div>
            </div>
            <div className="stat-icon rose">
              <FiAlertCircle />
            </div>
          </div>
        </div>
      )}

      {/* 3. TABLE CONTAINER & TOOLBAR */}
      <div className="table-container" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        
        {/* TAB FILTER BY STATUS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto',
          background: 'var(--bg-card)'
        }}>
          {[
            { key: 'ALL', label: 'Semua', count: statusCounts.ALL },
            { key: 'Sukses', label: 'Sukses', count: statusCounts.Sukses, color: 'var(--accent-teal)' },
            { key: 'Pending', label: 'Menunggu', count: statusCounts.Pending, color: 'var(--accent-amber)' },
            { key: 'Gagal', label: 'Gagal', count: statusCounts.Gagal, color: 'var(--accent-rose)' },
            { key: 'Refund', label: 'Refund', count: statusCounts.Refund, color: 'var(--accent-violet)' }
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusFilter(tab.key);
                  setCurrentPage(1);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  background: isActive ? 'var(--primary)' : 'var(--bg-card-hover)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH BAR, SEARCH BUTTON & SECONDARY FILTERS */}
        {showFilters && (
          <div className="table-toolbar" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)' }}>
            
            {/* SEARCH FORM WITH INPUT, CLEAR AND DEDICATED SEARCH BUTTON */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 340px', minWidth: '280px' }}>
              <div className="search-input-wrapper" style={{ position: 'relative', flex: 1 }}>
                <FiSearch style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.95rem' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (e.target.value === '') {
                      setAppliedSearch('');
                      setCurrentPage(1);
                    }
                  }}
                  placeholder="Cari ID transaksi, nama, invoice, metode..."
                  className="search-input"
                  style={{ width: '100%', paddingRight: searchInput ? '2.2rem' : '0.85rem' }}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    style={{
                      position: 'absolute',
                      right: '0.65rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: '0.2rem'
                    }}
                    title="Hapus pencarian"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              {/* DEDICATED SEARCH BUTTON */}
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                title="Jalankan Pencarian Transaksi"
              >
                <FiSearch />
                <span>Cari</span>
              </button>
            </form>

            {/* FILTER SELECTS & ADVANCED FILTER TOGGLE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* Payment Method Select */}
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-control"
                style={{ width: 'auto', minWidth: '150px', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
              >
                <option value="ALL">Semua Metode</option>
                <option value="QRIS">QRIS</option>
                <option value="BCA Virtual Account">BCA Virtual Account</option>
                <option value="Mandiri Virtual Account">Mandiri VA</option>
                <option value="BNI Virtual Account">BNI VA</option>
                <option value="Kartu Kredit">Kartu Kredit</option>
                <option value="GoPay">GoPay</option>
                <option value="OVO">OVO</option>
                <option value="ShopeePay">ShopeePay</option>
              </select>

              {/* Date Preset Select */}
              <select
                value={dateRangeFilter}
                onChange={(e) => {
                  setDateRangeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-control"
                style={{ width: 'auto', minWidth: '140px', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
              >
                <option value="ALL">Semua Tanggal</option>
                <option value="TODAY">Hari Ini</option>
                <option value="7DAYS">7 Hari Terakhir</option>
                <option value="30DAYS">30 Hari Terakhir</option>
                <option value="THIS_MONTH">Bulan Ini</option>
              </select>

              {/* Reset Filter Button */}
              {(appliedSearch || statusFilter !== 'ALL' || paymentFilter !== 'ALL' || dateRangeFilter !== 'ALL' || platformFilter !== 'ALL') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--accent-rose)', borderColor: 'rgba(225, 29, 72, 0.2)' }}
                  title="Reset Semua Filter"
                >
                  <FiRotateCcw />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* BULK ACTION BAR (WHEN ROWS ARE SELECTED) */}
        {allowSelection && selectedIds.length > 0 && (
          <div style={{
            padding: '0.65rem 1.25rem',
            background: 'var(--primary-light)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
              <FiCheck />
              <span>{selectedIds.length} transaksi dipilih</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => handleBulkStatusUpdate('Sukses')}
                className="btn btn-secondary btn-sm"
                style={{ background: 'var(--bg-card)' }}
              >
                <FiCheckCircle style={{ color: 'var(--accent-teal)' }} />
                <span>Tandai Sukses</span>
              </button>

              <button
                onClick={() => handleBulkStatusUpdate('Refund')}
                className="btn btn-secondary btn-sm"
                style={{ background: 'var(--bg-card)' }}
              >
                <FiRotateCcw style={{ color: 'var(--accent-violet)' }} />
                <span>Tandai Refund</span>
              </button>

              <button
                onClick={() => handleExportCSV()}
                className="btn btn-secondary btn-sm"
                style={{ background: 'var(--bg-card)' }}
              >
                <FiDownload />
                <span>Ekspor Terpilih</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="btn btn-secondary btn-sm"
                style={{ background: 'var(--bg-card)' }}
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* 4. MAIN DATA TABLE */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', minWidth: '920px' }}>
            <thead>
              <tr>
                {allowSelection && (
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isAllCurrentSelected}
                      ref={el => { if (el) el.indeterminate = isSomeCurrentSelected; }}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                )}
                
                {/* ID Transaksi */}
                <th 
                  onClick={() => handleSort('id')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>ID Transaksi</span>
                    {sortField === 'id' && (sortDirection === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
                  </div>
                </th>

                {/* Tanggal */}
                <th 
                  onClick={() => handleSort('created_at')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Tanggal & Waktu</span>
                    {sortField === 'created_at' && (sortDirection === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
                  </div>
                </th>

                {/* Pelanggan */}
                <th 
                  onClick={() => handleSort('customer_name')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Pelanggan</span>
                    {sortField === 'customer_name' && (sortDirection === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
                  </div>
                </th>

                {/* Item / Layanan */}
                <th>Item / Layanan</th>

                {/* Metode Pembayaran */}
                <th>Metode</th>

                {/* Nominal */}
                <th 
                  onClick={() => handleSort('total_amount')}
                  style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'right' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                    <span>Nominal Total</span>
                    {sortField === 'total_amount' && (sortDirection === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
                  </div>
                </th>

                {/* Status */}
                <th 
                  onClick={() => handleSort('status')}
                  style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <span>Status</span>
                    {sortField === 'status' && (sortDirection === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
                  </div>
                </th>

                {/* Aksi */}
                <th style={{ textAlign: 'center', width: '110px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={allowSelection ? 9 : 8} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                      <FiRefreshCw className="spin-anim" style={{ animation: 'spin 1s linear infinite', fontSize: '1.25rem' }} />
                      <span>Memuat data transaksi...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td colSpan={allowSelection ? 9 : 8} style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                    <div style={{ maxWidth: '380px', margin: '0 auto' }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: 'var(--bg-card-hover)',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.5rem'
                      }}>
                        <FiSearch />
                      </div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                        Tidak Ada Transaksi Ditemukan
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        {appliedSearch || statusFilter !== 'ALL' || paymentFilter !== 'ALL' || dateRangeFilter !== 'ALL'
                          ? 'Tidak ada transaksi yang cocok dengan kata kunci atau filter saat ini.'
                          : 'Belum ada riwayat transaksi yang tercatat dalam sistem.'}
                      </p>
                      {(appliedSearch || statusFilter !== 'ALL' || paymentFilter !== 'ALL' || dateRangeFilter !== 'ALL') && (
                        <button
                          onClick={handleResetFilters}
                          className="btn btn-secondary btn-sm"
                        >
                          <FiRotateCcw />
                          <span>Reset Semua Filter</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentRows.map((tx) => {
                  const isSelected = selectedIds.includes(tx.id);
                  const statusInfo = STATUS_CONFIG[tx.status] || STATUS_CONFIG.Pending;
                  const StatusIcon = statusInfo.icon;
                  const total = tx.total_amount || tx.amount || 0;

                  return (
                    <tr 
                      key={tx.id} 
                      style={{ 
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      {/* Checkbox */}
                      {allowSelection && (
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(tx.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                      )}

                      {/* ID Transaksi & Invoice */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.825rem', color: 'var(--primary)' }}>
                              {tx.id}
                            </span>
                            <button
                              onClick={() => handleCopy(tx.id, 'ID Transaksi')}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '0.15rem',
                                display: 'flex',
                                borderRadius: '4px'
                              }}
                              title="Salin ID Transaksi"
                            >
                              <FiCopy size={12} />
                            </button>
                          </div>
                          {tx.invoice_number && (
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              {tx.invoice_number}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tanggal & Waktu */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.825rem' }}>
                            {formatDateTime(tx.created_at)}
                          </span>
                          {tx.paid_at && tx.status === 'Sukses' && (
                            <span style={{ fontSize: '0.725rem', color: 'var(--accent-teal)' }}>
                              Dibayar: {formatDateTime(tx.paid_at).split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Pelanggan */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img
                            src={tx.customer_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tx.customer_name || 'User')}&background=4F46E5&color=fff`}
                            alt={tx.customer_name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                              {tx.customer_name}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {tx.customer_email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Item / Layanan */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-main)' }}>
                            {tx.item_name}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                            <span className="badge badge-gray" style={{ fontSize: '0.675rem' }}>
                              {tx.category || 'General'}
                            </span>
                            {tx.platform_name && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                • {tx.platform_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Metode Pembayaran */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            background: 'var(--bg-card-hover)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)'
                          }}>
                            <FiCreditCard />
                          </div>
                          <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>
                            {tx.payment_method}
                          </span>
                        </div>
                      </td>

                      {/* Nominal Total */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: tx.status === 'Sukses' ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {formatIDR(total)}
                          </span>
                          {tx.tax ? (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              PPN 11% ({formatIDR(tx.tax)})
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ textAlign: 'center' }}>
                        <span 
                          className={`badge ${statusInfo.badgeClass}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.65rem'
                          }}
                        >
                          <StatusIcon size={12} />
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>

                      {/* Aksi */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleOpenDetail(tx)}
                            className="btn btn-secondary btn-sm btn-icon"
                            title="Lihat Rincian Transaksi"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => handleExportCSV([tx])}
                            className="btn btn-secondary btn-sm btn-icon"
                            title="Unduh Invoice/Bukti"
                          >
                            <FiDownload />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. COMPREHENSIVE PAGINATION CONTROLS */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-card)'
        }}>
          {/* Left Info: Items per page selector & Total Items info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              <span>Tampilkan:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-control"
                style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.825rem' }}
              >
                {itemsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} per hal
                  </option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {totalItems > 0 ? (
                <>Menampilkan <strong>{startIndex + 1}</strong> - <strong>{endIndex}</strong> dari <strong>{totalItems}</strong> transaksi</>
              ) : (
                '0 transaksi'
              )}
            </div>
          </div>

          {/* Right Controls: Navigation Buttons & Jump to Page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            
            {/* Quick Page Jump Form */}
            {totalPages > 3 && (
              <form onSubmit={handleJumpPage} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginRight: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ke:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  placeholder={String(validCurrentPage)}
                  style={{
                    width: '44px',
                    padding: '0.25rem 0.35rem',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                >
                  Go
                </button>
              </form>
            )}

            {/* First Page Button */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={validCurrentPage === 1 || loading}
              className="btn btn-secondary btn-sm btn-icon"
              title="Halaman Pertama"
              style={{ opacity: validCurrentPage === 1 ? 0.4 : 1, cursor: validCurrentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <FiChevronsLeft />
            </button>

            {/* Prev Page Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={validCurrentPage === 1 || loading}
              className="btn btn-secondary btn-sm btn-icon"
              title="Halaman Sebelumnya"
              style={{ opacity: validCurrentPage === 1 ? 0.4 : 1, cursor: validCurrentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <FiChevronLeft />
            </button>

            {/* Dynamic Numbered Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {paginationPages.map((pageNum, idx) => {
                if (pageNum === '...') {
                  return (
                    <span key={`dots-${idx}`} style={{ padding: '0 0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      ...
                    </span>
                  );
                }

                const isActive = validCurrentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={isActive ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                    style={{
                      minWidth: '32px',
                      padding: '0.35rem 0.55rem',
                      fontWeight: isActive ? 700 : 500,
                      justifyContent: 'center'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={validCurrentPage === totalPages || loading}
              className="btn btn-secondary btn-sm btn-icon"
              title="Halaman Berikutnya"
              style={{ opacity: validCurrentPage === totalPages ? 0.4 : 1, cursor: validCurrentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <FiChevronRight />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={validCurrentPage === totalPages || loading}
              className="btn btn-secondary btn-sm btn-icon"
              title="Halaman Terakhir"
              style={{ opacity: validCurrentPage === totalPages ? 0.4 : 1, cursor: validCurrentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <FiChevronsRight />
            </button>
          </div>
        </div>
      </div>

      {/* 6. TRANSACTION DETAIL MODAL */}
      {selectedTransaction && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Rincian Transaksi #${selectedTransaction.id}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Header Status & Amount Banner */}
            <div style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card-hover)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Total Pembayaran
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatIDR(selectedTransaction.total_amount || selectedTransaction.amount || 0)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  No. Invoice: {selectedTransaction.invoice_number || '-'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${STATUS_CONFIG[selectedTransaction.status]?.badgeClass || 'badge-gray'}`} style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                  {selectedTransaction.status}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Metode: {selectedTransaction.payment_method}
                </div>
              </div>
            </div>

            {/* Quick Status Action Pill Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Ubah Status Transaksi:
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {['Sukses', 'Pending', 'Gagal', 'Refund'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedTransaction.id, st)}
                    className={selectedTransaction.status === st ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Two Column Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              
              {/* Customer Info Card */}
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Informasi Pelanggan
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <img
                    src={selectedTransaction.customer_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTransaction.customer_name)}&background=4F46E5&color=fff`}
                    alt={selectedTransaction.customer_name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedTransaction.customer_name}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{selectedTransaction.customer_email}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Platform: <strong>{selectedTransaction.platform_name || selectedTransaction.platform}</strong>
                </div>
              </div>

              {/* Payment Details Card */}
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Saluran Pembayaran
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {selectedTransaction.payment_channel || selectedTransaction.payment_method}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Dibuat: {formatDateTime(selectedTransaction.created_at)}
                </div>
                {selectedTransaction.paid_at && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)' }}>
                    Lunas: {formatDateTime(selectedTransaction.paid_at)}
                  </div>
                )}
              </div>
            </div>

            {/* Price Itemized Breakdown */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Rincian Tagihan & Pajak
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.45rem' }}>
                <span>{selectedTransaction.item_name}</span>
                <span style={{ fontWeight: 600 }}>{formatIDR(selectedTransaction.amount || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                <span>Biaya Layanan / Admin</span>
                <span>{formatIDR(selectedTransaction.fee || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <span>PPN 11%</span>
                <span>{formatIDR(selectedTransaction.tax || 0)}</span>
              </div>
              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800 }}>
                <span>Total Akhir</span>
                <span style={{ color: 'var(--primary)' }}>
                  {formatIDR(selectedTransaction.total_amount || selectedTransaction.amount || 0)}
                </span>
              </div>
            </div>

            {/* Notes / Catatan */}
            {selectedTransaction.notes && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--bg-card-hover)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                Catatan: {selectedTransaction.notes}
              </div>
            )}

            {/* Footer Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleExportCSV([selectedTransaction])}
                className="btn btn-secondary"
              >
                <FiDownload />
                <span>Unduh Bukti (CSV)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="btn btn-primary"
              >
                <FiPrinter />
                <span>Cetak Invoice</span>
              </button>
            </div>

          </div>
        </Modal>
      )}

      {/* 7. NEW TRANSACTION MODAL */}
      {allowNewTransaction && (
        <Modal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          title="Tambah Transaksi Baru"
          maxWidth="560px"
        >
          <form onSubmit={handleCreateTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Nama Pelanggan *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Contoh: Faiz Ali"
                value={newFormData.customer_name}
                onChange={(e) => setNewFormData({ ...newFormData, customer_name: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Pelanggan</label>
              <input
                type="email"
                className="form-control"
                placeholder="Contoh: faizali.desk@gmail.com"
                value={newFormData.customer_email}
                onChange={(e) => setNewFormData({ ...newFormData, customer_email: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Item / Layanan *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Contoh: Enterprise Subscription Tier 1"
                value={newFormData.item_name}
                onChange={(e) => setNewFormData({ ...newFormData, item_name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nominal (IDR) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  className="form-control"
                  placeholder="Contoh: 1500000"
                  value={newFormData.amount}
                  onChange={(e) => setNewFormData({ ...newFormData, amount: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Metode Pembayaran</label>
                <select
                  className="form-control"
                  value={newFormData.payment_method}
                  onChange={(e) => setNewFormData({ ...newFormData, payment_method: e.target.value })}
                >
                  <option value="QRIS">QRIS</option>
                  <option value="BCA Virtual Account">BCA Virtual Account</option>
                  <option value="Mandiri Virtual Account">Mandiri VA</option>
                  <option value="BNI Virtual Account">BNI VA</option>
                  <option value="Kartu Kredit">Kartu Kredit</option>
                  <option value="GoPay">GoPay</option>
                  <option value="OVO">OVO</option>
                  <option value="ShopeePay">ShopeePay</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Platform / Workspace</label>
                <select
                  className="form-control"
                  value={newFormData.platform}
                  onChange={(e) => setNewFormData({ ...newFormData, platform: e.target.value })}
                >
                  <option value="platform1">Desktopalie Main</option>
                  <option value="platform2">Desktopalie Beta</option>
                  <option value="platform3">Desktopalie Gamma</option>
                  <option value="platform4">Desktopalie Delta</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status Awal</label>
                <select
                  className="form-control"
                  value={newFormData.status}
                  onChange={(e) => setNewFormData({ ...newFormData, status: e.target.value })}
                >
                  <option value="Sukses">Sukses</option>
                  <option value="Pending">Pending</option>
                  <option value="Gagal">Gagal</option>
                  <option value="Refund">Refund</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Catatan</label>
              <textarea
                rows={2}
                className="form-control"
                placeholder="Catatan tambahan untuk invoice..."
                value={newFormData.notes}
                onChange={(e) => setNewFormData({ ...newFormData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="btn btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Simpan Transaksi
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
