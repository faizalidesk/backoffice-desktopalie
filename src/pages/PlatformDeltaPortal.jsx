import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFlavor } from '../context/FlavorContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  FiShield, 
  FiServer, 
  FiDatabase, 
  FiActivity, 
  FiCheckCircle, 
  FiHardDrive, 
  FiCpu, 
  FiLogOut,
  FiTerminal
} from 'react-icons/fi';

export default function PlatformDeltaPortal() {
  const { user, logout } = useAuth();
  const { activeFlavor } = useFlavor();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#F59E0B';

  const handleSignOut = async () => {
    await logout();
    navigate('/delta/login');
  };

  return (
    <>
      <Header title="Platform Delta Workspace (Enterprise ERP Cloud)" />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        
        {/* HERO BANNER DELTA ERP & CLOUD */}
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
              <FiShield /> Dedicated Platform Delta Portal
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Enterprise ERP & Cloud Infrastructure Portal
            </h1>

            <p style={{ color: '#94A3B8', fontSize: '0.925rem', margin: 0, maxWidth: '750px', lineHeight: '1.55' }}>
              Ruang kerja khusus ekosistem ERP enterprise, manajemen cluster server multi-node, pemantauan latensi API, dan integritas database PostgreSQL enterprise.
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

        {/* DELTA ERP METRICS KPI */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Cluster SLA Uptime', value: '99.99% SLA', color: '#10B981', icon: <FiCheckCircle /> },
            { label: 'Active Cluster Nodes', value: '3 Active Nodes', color: primaryColor, icon: <FiServer /> },
            { label: 'DB Connection Pool', value: '38 / 100 Active', color: '#3B82F6', icon: <FiDatabase /> },
            { label: 'Average Edge Latency', value: '8 ms', color: '#8B5CF6', icon: <FiActivity /> }
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

        {/* CLOUD CLUSTER NODE HEALTH MONITOR */}
        <div style={{
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '18px',
          padding: '1.75rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.25rem', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
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
                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{node.name}</div>
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

      </div>
    </>
  );
}
