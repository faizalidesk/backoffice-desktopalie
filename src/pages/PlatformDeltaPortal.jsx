import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFlavor } from '../context/FlavorContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DesktopalieMark from '../components/DesktopalieMark';
import NotificationBell from '../components/NotificationBell';
import { 
  FiShield, 
  FiServer, 
  FiDatabase, 
  FiActivity, 
  FiCheckCircle, 
  FiHardDrive, 
  FiCpu, 
  FiLogOut,
  FiTerminal,
  FiPlus,
  FiDollarSign,
  FiBriefcase,
  FiSun,
  FiMoon,
  FiFileText,
  FiUploadCloud,
  FiDownload
} from 'react-icons/fi';

export default function PlatformDeltaPortal() {
  const { user, logout } = useAuth();
  const { activeFlavor } = useFlavor();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('clusters');

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#F59E0B';

  const [ledger, setLedger] = useState([
    { id: 'ERP-INV-88192', vendor: 'Global Cloud Edge Infrastructure', amount: 'Rp 48.500.000', status: 'Approved', dept: 'Cloud Infra' },
    { id: 'ERP-INV-77120', vendor: 'PostgreSQL Enterprise SLA Support', amount: 'Rp 22.000.000', status: 'Approved', dept: 'Database Ops' },
    { id: 'ERP-INV-55104', vendor: 'High-Speed Fiber Transit Provider', amount: 'Rp 14.200.000', status: 'Pending Review', dept: 'Network Edge' }
  ]);

  // Google Cloud Vision OCR States
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState({
    invoiceNumber: 'ERP-INV-99014',
    vendor: 'Google Cloud Platform (BigQuery & Vertex AI SLA)',
    amount: 'Rp 36.400.000',
    dept: 'AI & Cloud Infra',
    confidence: '99.4% (Google Vision OCR API)'
  });

  const handleScanInvoice = () => {
    setIsScanningOCR(true);
    setTimeout(() => {
      setIsScanningOCR(false);
      toast.success('Google Cloud Vision OCR berhasil mengekstrak dokumen invoice!');
    }, 1000);
  };

  const handleAddToLedger = () => {
    const newEntry = {
      id: ocrResult.invoiceNumber,
      vendor: ocrResult.vendor,
      amount: ocrResult.amount,
      status: 'Approved',
      dept: ocrResult.dept
    };
    setLedger([newEntry, ...ledger]);
    toast.success(`Invoice ${newEntry.id} berhasil ditambahkan ke Ledger ERP!`);
  };

  const handleExportGoogleSheets = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Invoice ID,Vendor,Amount,Status,Department", ...ledger.map(e => `"${e.id}","${e.vendor}","${e.amount}","${e.status}","${e.dept}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Google_Sheets_ERP_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Laporan Ledger berhasil diekspor berformat Google Sheets!');
  };

  const handleSignOut = async () => {
    await logout();
    toast.success('Keluar dari Platform Delta Workspace');
    navigate('/delta/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: isDarkMode ? '#05130E' : '#FAF9FC',
      color: isDarkMode ? '#ECFDF5' : '#0F172A',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      {/* STANDALONE PORTAL TOP HEADER */}
      <header style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        borderBottom: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <DesktopalieMark size={26} style={{ color: primaryColor }} />
            <span style={{ fontSize: '1rem', fontWeight: '800', color: isDarkMode ? '#ECFDF5' : '#0F172A', letterSpacing: '0.04em' }}>
              DESKTOPALIE DELTA PORTAL
            </span>
          </Link>
          <span style={{ padding: '0.2rem 0.65rem', borderRadius: '99px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.725rem', fontWeight: '700' }}>
            ● Enterprise ERP Cloud
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
              color: isDarkMode ? '#FBBF24' : '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <NotificationBell primaryColor={primaryColor} />
              <img
                src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`}
                alt="Avatar"
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${primaryColor}`, objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
            </div>
          )}

          <button
            onClick={handleSignOut}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              backgroundColor: isDarkMode ? '#091E16' : '#F1F5F9',
              border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
              color: isDarkMode ? '#ECFDF5' : '#0F172A',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <FiLogOut />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* PORTAL MAIN CONTENT AREA */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
        
        {/* HERO BANNER DELTA ERP & CLOUD */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#05130E',
          color: '#FFFFFF',
          padding: '2.25rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(5, 19, 14, 0.25)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}50 0%, rgba(5, 19, 14, 0) 70%)`,
            pointerEvents: 'none'
          }} />

          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.75rem',
                color: '#FBBF24',
                fontWeight: '700',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}>
                <FiShield /> Standalone Platform Delta Portal
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Enterprise ERP & Cloud Infrastructure Portal
              </h1>

              <p style={{ color: '#94A3B8', fontSize: '0.925rem', margin: 0, maxWidth: '750px', lineHeight: '1.55' }}>
                Selamat datang di portal utama Platform Delta. Ruang kerja mandiri ekosistem ERP enterprise, manajemen cluster server multi-node, dan monitoring SLA 99.99%.
              </p>
            </div>
          </div>

          {/* TABBED PORTAL NAVIGATION */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            overflowX: 'auto'
          }}>
            {[
              { id: 'clusters', label: 'Multi-Node Clusters', icon: <FiServer /> },
              { id: 'google_vision', label: 'Google Vision OCR & Sheets', icon: <FiFileText /> },
              { id: 'finance', label: 'Enterprise ERP Finance', icon: <FiDollarSign /> },
              { id: 'database', label: 'PostgreSQL DB Pool & Cache', icon: <FiDatabase /> },
              { id: 'microservices', label: 'Microservices Latency', icon: <FiActivity /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: activeTab === tab.id ? primaryColor : 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DELTA ERP METRICS KPI */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Cluster SLA Uptime Guarantee', value: '99.99% SLA', color: '#10B981', icon: <FiCheckCircle /> },
            { label: 'Active Cluster Nodes', value: '3 Active Nodes', color: primaryColor, icon: <FiServer /> },
            { label: 'DB Connection Pool', value: '38 / 100 Active', color: '#3B82F6', icon: <FiDatabase /> },
            { label: 'Average Edge Latency', value: '8 ms', color: '#8B5CF6', icon: <FiActivity /> }
          ].map((kpi, idx) => (
            <div key={idx} style={{
              backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{kpi.label}</span>
                <span style={{ fontSize: '1.1rem', color: kpi.color }}>{kpi.icon}</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* TAB CONTENT: CLUSTERS */}
        {activeTab === 'clusters' && (
          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '18px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
              🖥️ Multi-Node Cluster Telemetry & Microservices
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {[
                { name: 'Node-01 (Jakarta Data Center)', status: 'Healthy', load: '32%', memory: '4.8 GB / 16 GB', latency: '8 ms' },
                { name: 'Node-02 (Singapore Cloud Region)', status: 'Healthy', load: '45%', memory: '7.2 GB / 16 GB', latency: '14 ms' },
                { name: 'Node-03 (Tokyo Failover Region)', status: 'Healthy', load: '28%', memory: '3.6 GB / 16 GB', latency: '35 ms' }
              ].map((node, i) => (
                <div key={i} style={{
                  padding: '1.25rem',
                  borderRadius: '14px',
                  backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>{node.name}</div>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.725rem', fontWeight: '700' }}>
                      ● {node.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    CPU Load: <strong>{node.load}</strong> | RAM: <strong>{node.memory}</strong>
                  </div>
                  <div style={{ height: '6px', width: '100%', backgroundColor: `${primaryColor}20`, borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: node.load, height: '100%', backgroundColor: primaryColor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: GOOGLE VISION OCR & SHEETS EXPORT */}
        {activeTab === 'google_vision' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
              backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
              borderRadius: '18px',
              padding: '1.75rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#FBBF24', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <FiUploadCloud /> GOOGLE CLOUD VISION API • OCR INVOICE SCANNER
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: isDarkMode ? '#ECFDF5' : '#0F172A', margin: '0 0 0.5rem 0' }}>
                  Google Document AI & Optical Character Recognition
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Pindai otomatis dokumen tagihan vendor, invoice PDF, kuitansi fisik, dan struk belanja secara cerdas menggunakan Google Cloud Vision OCR tanpa perlu input manual.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{
                    border: `2px dashed ${isDarkMode ? '#133829' : '#CBD5E1'}`,
                    borderRadius: '14px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC'
                  }}>
                    <FiUploadCloud style={{ fontSize: '2rem', color: primaryColor, marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: '700', fontSize: '0.875rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                      Unggah File Invoice (PDF, PNG, JPG)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      File Sampel: <code>GCP_Billing_Invoice_Aug2026.pdf</code>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleScanInvoice}
                    disabled={isScanningOCR}
                    className="btn btn-primary"
                    style={{ borderRadius: '12px', padding: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: primaryColor }}
                  >
                    <FiFileText /> {isScanningOCR ? 'Memindai dengan Google Vision OCR...' : 'Scan Invoice via Google Vision OCR'}
                  </button>
                </div>
              </div>

              {/* OCR Extraction Result Card */}
              <div style={{
                backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hasil Ekstraksi OCR Cerdas</span>
                    <span style={{ fontSize: '0.725rem', fontWeight: '700', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '99px' }}>
                      ● {ocrResult.confidence}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nomor Invoice</span>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: primaryColor }}>{ocrResult.invoiceNumber}</div>
                    </div>

                    <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nama Vendor</span>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>{ocrResult.vendor}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Biaya</span>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10B981' }}>{ocrResult.amount}</div>
                      </div>

                      <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Departemen</span>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>{ocrResult.dept}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={handleAddToLedger}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontWeight: '700', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    >
                      <FiPlus /> Simpan ke Ledger
                    </button>

                    <button
                      type="button"
                      onClick={handleExportGoogleSheets}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontWeight: '700', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    >
                      <FiDownload /> Export Sheets
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`, fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                  Integrasi Google Cloud Vision API TEXT_DETECTION & Google Sheets Exporter
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: FINANCE */}
        {activeTab === 'finance' && (
          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '18px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
              💼 Enterprise ERP Purchase Orders & Ledger
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`, textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>INVOICE ID</th>
                    <th style={{ padding: '0.85rem 1rem' }}>VENDOR / PROVIDER</th>
                    <th style={{ padding: '0.85rem 1rem' }}>NOMINAL INVOICE</th>
                    <th style={{ padding: '0.85rem 1rem' }}>DEPARTEMEN</th>
                    <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${isDarkMode ? '#133829' : '#F1F5F9'}` }}>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '800', color: primaryColor }}>{row.id}</td>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '600' }}>{row.vendor}</td>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '800' }}>{row.amount}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>{row.dept}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '99px',
                          backgroundColor: row.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: row.status === 'Approved' ? '#10B981' : '#F59E0B',
                          fontWeight: '700',
                          fontSize: '0.75rem'
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
