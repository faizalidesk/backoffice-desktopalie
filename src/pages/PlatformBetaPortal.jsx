import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFlavor } from '../context/FlavorContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DesktopalieMark from '../components/DesktopalieMark';
import NotificationBell from '../components/NotificationBell';
import { 
  FiTruck, 
  FiPackage, 
  FiMapPin, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiSearch, 
  FiCompass, 
  FiSliders, 
  FiArrowRight, 
  FiRefreshCw, 
  FiDatabase,
  FiLogOut,
  FiFileText,
  FiUserCheck,
  FiPlus,
  FiShield,
  FiActivity,
  FiSun,
  FiMoon,
  FiGlobe
} from 'react-icons/fi';

export default function PlatformBetaPortal() {
  const { user, logout } = useAuth();
  const { activeFlavor } = useFlavor();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dispatch');
  const [searchQuery, setSearchQuery] = useState('LOG-884920-JKT');
  const [newContainerId, setNewContainerId] = useState('');
  const [newCargoType, setNewCargoType] = useState('Pharma Cold-Chain');
  const [newRoute, setNewRoute] = useState('Tanjung Priok ➔ Bandung Hub');

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#10B981';

  const [shipments, setShipments] = useState([
    { id: 'LOG-884920-JKT', type: 'Pharma Cold-Chain Vaccines', route: 'Tanjung Priok ➔ Bandung Hub', temp: '4.2 °C', status: 'In-Transit', driver: 'Budi Santoso', eta: '2 Jam 15 Menit' },
    { id: 'LOG-772910-SUB', type: 'Frozen Seafood Export', route: 'Surabaya Port ➔ Malang Cargo', temp: '-18.5 °C', status: 'Delivered', driver: 'Agus Wijaya', eta: 'Tiba di Tujuan' },
    { id: 'LOG-552140-DPS', type: 'High-Tech Electronics', route: 'Jakarta ➔ Denpasar Cargo Hub', temp: '24.0 °C', status: 'Customs Clear', driver: 'Rian Pratama', eta: '4 Jam 30 Menit' },
    { id: 'LOG-334910-BKN', type: 'Fresh Organic Produce', route: 'Medan Belawan ➔ Pekanbaru', temp: '8.0 °C', status: 'In-Transit', driver: 'Dedi Kurniawan', eta: '1 Jam 45 Menit' }
  ]);

  const handleCreateShipment = (e) => {
    e.preventDefault();
    if (!newContainerId) {
      toast.error('Masukkan Container Waybill ID');
      return;
    }
    const newEntry = {
      id: newContainerId.toUpperCase(),
      type: newCargoType,
      route: newRoute,
      temp: '5.0 °C',
      status: 'In-Transit',
      driver: 'Pengemudi Baru',
      eta: 'Dalam Perjalanan'
    };
    setShipments([newEntry, ...shipments]);
    setNewContainerId('');
    toast.success(`Berhasil menambahkan Waybill ${newEntry.id}!`);
  };

  const handleSignOut = async () => {
    await logout();
    toast.success('Keluar dari Platform Beta Workspace');
    navigate('/beta/login');
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
              DESKTOPALIE BETA PORTAL
            </span>
          </Link>
          <span style={{ padding: '0.2rem 0.65rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.725rem', fontWeight: '700' }}>
            ● Logistics Workspace
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
        
        {/* HERO BANNER LOGISTICS */}
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
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.75rem',
                color: '#34D399',
                fontWeight: '700',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}>
                <FiTruck /> Standalone Platform Beta Portal
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Smart Logistics & Freight Forwarding Portal
              </h1>

              <p style={{ color: '#94A3B8', fontSize: '0.925rem', margin: 0, maxWidth: '750px', lineHeight: '1.55' }}>
                Selamat datang di portal utama Platform Beta. Ruang kerja mandiri untuk pengoperasian armada kargo, monitoring sensor suhu reefer cold-chain, pabean, dan dispatching.
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
              { id: 'dispatch', label: 'Fleet & Dispatch Board', icon: <FiTruck /> },
              { id: 'telemetry', label: 'Cold-Chain Telemetry', icon: <FiActivity /> },
              { id: 'manifest', label: 'Customs & Waybill Manifest', icon: <FiFileText /> },
              { id: 'drivers', label: 'Drivers & Fleet Status', icon: <FiUserCheck /> }
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

        {/* LOGISTICS KPI STATS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Active Fleet Operations', value: '42 Cargo Vans', color: primaryColor, icon: <FiTruck /> },
            { label: 'In-Transit Cargo Volume', value: '1,280 Tons', color: '#3B82F6', icon: <FiPackage /> },
            { label: 'Customs Clearance SLA', value: '99.4% On-Time', color: '#8B5CF6', icon: <FiCheckCircle /> },
            { label: 'GPS Satellite Telemetry', value: 'Online (24 Nodes)', color: '#F59E0B', icon: <FiCompass /> }
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

        {/* TAB CONTENT: DISPATCH BOARD */}
        {activeTab === 'dispatch' && (
          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '18px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                🚛 Fleet Cargo Dispatching & Real-time Waybills
              </h3>
            </div>

            {/* Quick Add Shipment Form */}
            <form onSubmit={handleCreateShipment} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={newContainerId}
                onChange={(e) => setNewContainerId(e.target.value)}
                placeholder="Container Waybill ID (cth: LOG-9988-JKT)..."
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '0.75rem 12px',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
                  color: isDarkMode ? '#ECFDF5' : '#0F172A',
                  fontWeight: '600'
                }}
              />
              <select
                value={newCargoType}
                onChange={(e) => setNewCargoType(e.target.value)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
                  color: isDarkMode ? '#ECFDF5' : '#0F172A',
                  fontWeight: '600'
                }}
              >
                <option value="Pharma Cold-Chain Vaccines">Pharma Cold-Chain</option>
                <option value="Frozen Seafood Export">Frozen Seafood</option>
                <option value="High-Tech Electronics">High-Tech Electronics</option>
                <option value="Fresh Organic Produce">Fresh Produce</option>
              </select>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: primaryColor,
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FiPlus />
                <span>Terbitkan Dispatch</span>
              </button>
            </form>

            {/* Shipments Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`, textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>WAYBILL ID</th>
                    <th style={{ padding: '0.85rem 1rem' }}>JENIS KARGO</th>
                    <th style={{ padding: '0.85rem 1rem' }}>RUTE PERJALANAN</th>
                    <th style={{ padding: '0.85rem 1rem' }}>DRIVER</th>
                    <th style={{ padding: '0.85rem 1rem' }}>SUHU REFRIGERATOR</th>
                    <th style={{ padding: '0.85rem 1rem' }}>ESTIMASI ETA</th>
                    <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${isDarkMode ? '#133829' : '#F1F5F9'}` }}>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '800', color: primaryColor }}>{row.id}</td>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '600' }}>{row.type}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>{row.route}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>👨‍✈️ {row.driver}</td>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '700' }}>🌡️ {row.temp}</td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)' }}>⏱️ {row.eta}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '99px',
                          backgroundColor: row.status === 'In-Transit' ? 'rgba(16, 185, 129, 0.15)' : (row.status === 'Delivered' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                          color: row.status === 'In-Transit' ? '#10B981' : (row.status === 'Delivered' ? '#3B82F6' : '#F59E0B'),
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

        {/* TAB CONTENT: COLD CHAIN TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '18px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
              🌡️ Real-Time Cold-Chain Sensor Telemetry
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {[
                { container: 'Reefer Unit A-01', temp: '4.2 °C', humidity: '85%', pressure: '1,013 hPa', status: 'Optimal' },
                { container: 'Reefer Unit B-04', temp: '-18.5 °C', humidity: '92%', pressure: '1,008 hPa', status: 'Optimal' },
                { container: 'Reefer Unit C-09', temp: '2.8 °C', humidity: '80%', pressure: '1,015 hPa', status: 'Optimal' }
              ].map((sensor, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: '800', fontSize: '1rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>{sensor.container}</span>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.75rem', fontWeight: '700' }}>
                      ● {sensor.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '800', color: primaryColor, marginBottom: '0.5rem' }}>{sensor.temp}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Humidity: <strong>{sensor.humidity}</strong> | Pressure: <strong>{sensor.pressure}</strong></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: MANIFEST */}
        {activeTab === 'manifest' && (
          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '18px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
              📄 Customs Clearance & Bill of Lading Manifest
            </h3>
            <div style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px', border: `2px dashed ${isDarkMode ? '#133829' : '#E2E8F0'}`, color: 'var(--text-muted)' }}>
              📋 <strong>Manifest Pabean Digital Terverifikasi</strong> (Semua dokumen disinkronkan ke pelabuhan tujuan).
            </div>
          </div>
        )}

        {/* TAB CONTENT: DRIVERS */}
        {activeTab === 'drivers' && (
          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '18px',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
              👨‍✈️ Driver Status & Fleet Duty Roster
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {['Budi Santoso', 'Agus Wijaya', 'Rian Pratama', 'Dedi Kurniawan'].map((name, idx) => (
                <div key={idx} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>👨‍✈️ {name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '700', marginTop: '0.25rem' }}>🟢 Active Duty (SIM B2 Umum Verified)</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
