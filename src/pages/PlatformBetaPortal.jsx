import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFlavor } from '../context/FlavorContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
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
  FiLogOut
} from 'react-icons/fi';

export default function PlatformBetaPortal() {
  const { user, logout } = useAuth();
  const { activeFlavor } = useFlavor();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('fleet');
  const [searchQuery, setSearchQuery] = useState('LOG-884920-JKT');

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#10B981';

  const handleSignOut = async () => {
    await logout();
    navigate('/beta/login');
  };

  return (
    <>
      <Header title="Platform Beta Workspace (Smart Logistics)" />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        
        {/* HERO BANNER LOGISTICS */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '2.25rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}50 0%, rgba(15, 23, 42, 0) 70%)`,
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, flex: 1, minWidth: '300px' }}>
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
              <FiTruck /> Dedicated Platform Beta Portal
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Smart Logistics & Freight Workspace
            </h1>

            <p style={{ color: '#94A3B8', fontSize: '0.925rem', margin: 0, maxWidth: '750px', lineHeight: '1.55' }}>
              Ruang kerja khusus pengelolaan armada kargo, monitoring kontainer cold-chain real-time, manifest pabean, dan dispatching logistik terpadu.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleSignOut}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <FiLogOut />
              <span>Keluar Account</span>
            </button>
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
            { label: 'In-Transit Shipments', value: '1,280 Tons', color: '#3B82F6', icon: <FiPackage /> },
            { label: 'Customs Clearance SLA', value: '99.4% On-Time', color: '#8B5CF6', icon: <FiCheckCircle /> },
            { label: 'GPS Satellite Connection', value: 'Online (24 Nodes)', color: '#F59E0B', icon: <FiCompass /> }
          ].map((kpi, idx) => (
            <div key={idx} style={{
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{kpi.label}</span>
                <span style={{ fontSize: '1.1rem', color: kpi.color }}>{kpi.icon}</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* LOGISTICS LIVE TRACKING SEARCH BOARD */}
        <div style={{
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '18px',
          padding: '1.75rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
            🔍 Cargo Dispatch & Telemetry Live Search
          </h3>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', maxWidth: '650px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Masukkan Waybill / Container ID..."
              style={{
                flex: 1,
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                color: isDarkMode ? '#F8FAFC' : '#0F172A',
                fontWeight: '600'
              }}
            />
            <button
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: primaryColor,
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Dispatch Info
            </button>
          </div>

          {/* Timeline Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`, textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>CONTAINER ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>CARGO TYPE</th>
                  <th style={{ padding: '0.75rem 1rem' }}>ROUTE ORIGIN ➔ DESTINATION</th>
                  <th style={{ padding: '0.75rem 1rem' }}>TEMPERATURE</th>
                  <th style={{ padding: '0.75rem 1rem' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'LOG-884920-JKT', type: 'Pharma Cold-Chain', route: 'Tanjung Priok ➔ Bandung Hub', temp: '4.2 °C', status: 'In-Transit' },
                  { id: 'LOG-772910-SUB', type: 'Perishable Food', route: 'Surabaya Port ➔ Malang Hub', temp: '-18.0 °C', status: 'Delivered' },
                  { id: 'LOG-552140-DPS', type: 'Electronics Gear', route: 'Jakarta ➔ Denpasar Cargo Hub', temp: '24.0 °C', status: 'Customs Clear' }
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}` }}>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '800', color: primaryColor }}>{row.id}</td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '600' }}>{row.type}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>{row.route}</td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '700' }}>{row.temp}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '99px',
                        backgroundColor: row.status === 'In-Transit' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: row.status === 'In-Transit' ? '#10B981' : '#3B82F6',
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

      </div>
    </>
  );
}
