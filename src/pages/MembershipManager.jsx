import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiUserCheck, 
  FiShield, 
  FiMail, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiTrash2, 
  FiEye, 
  FiRefreshCw, 
  FiLayers,
  FiX
} from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';

export default function MembershipManager() {
  const { isDarkMode } = useTheme();
  const { user: currentUser } = useAuth();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  // Initial Demo Data Fallback
  const initialDemoMembers = [
    {
      id: 'usr-google-881920',
      full_name: 'Faiz Ali (Administrator)',
      email: 'faizali.desk@gmail.com',
      avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocI...',
      provider: 'Google OAuth 2.0',
      platform: 'platform1',
      platformName: 'Desktopalie Main',
      role: 'Super Admin',
      status: 'Active',
      created_at: '2026-08-10T14:32:00Z',
      last_login: 'Baru Saja'
    },
    {
      id: 'usr-beta-771201',
      full_name: 'Budi Logistics Coordinator',
      email: 'budi.logistics@cargo-beta.com',
      avatar_url: 'https://ui-avatars.com/api/?name=Budi+Logistics&background=10B981&color=fff',
      provider: 'Google OAuth 2.0',
      platform: 'platform2',
      platformName: 'Desktopalie Beta',
      role: 'Logistics Manager',
      status: 'Active',
      created_at: '2026-08-11T09:15:00Z',
      last_login: '2 Jam Lalu'
    },
    {
      id: 'usr-gamma-551040',
      full_name: 'Rian Transcoder Engineer',
      email: 'rian.transcode@gamma-stream.io',
      avatar_url: 'https://ui-avatars.com/api/?name=Rian+Engine&background=8B5CF6&color=fff',
      provider: 'Email & Password',
      platform: 'platform3',
      platformName: 'Desktopalie Gamma',
      role: 'Media Engineer',
      status: 'Active',
      created_at: '2026-08-12T11:20:00Z',
      last_login: '5 Jam Lalu'
    },
    {
      id: 'usr-delta-331092',
      full_name: 'Dedi Enterprise Cloud Admin',
      email: 'dedi.cloud@delta-erp.net',
      avatar_url: 'https://ui-avatars.com/api/?name=Dedi+Cloud&background=F59E0B&color=fff',
      provider: 'Google OAuth 2.0',
      platform: 'platform4',
      platformName: 'Desktopalie Delta',
      role: 'Cloud Architect',
      status: 'Active',
      created_at: '2026-08-12T16:45:00Z',
      last_login: '1 Hari Lalu'
    }
  ];

  const fetchMembers = async () => {
    setLoading(true);
    try {
      let map = new Map();

      // 1. Prepopulate demo data
      initialDemoMembers.forEach(m => map.set(m.email, m));

      // 2. Read from localStorage registry
      const localRegistryStr = localStorage.getItem('desktopalie_members_registry');
      if (localRegistryStr) {
        try {
          const localMembers = JSON.parse(localRegistryStr);
          localMembers.forEach(m => {
            if (m.email) map.set(m.email, { ...map.get(m.email), ...m });
          });
        } catch (e) {
          console.warn('Local registry parse error:', e);
        }
      }

      // 3. Read from Supabase site_settings (keys starting with member_)
      try {
        const settings = await backofficeService.getSiteSettings();
        if (settings) {
          Object.keys(settings).forEach(key => {
            if (key.startsWith('member_') || key.startsWith('profile_')) {
              const val = settings[key];
              if (val && val.email) {
                map.set(val.email, {
                  id: val.id || key,
                  full_name: val.full_name || val.email.split('@')[0],
                  email: val.email,
                  avatar_url: val.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(val.email)}`,
                  provider: val.provider || 'Google OAuth 2.0',
                  platform: val.platform || 'platform1',
                  platformName: val.platformName || (val.platform === 'platform2' ? 'Desktopalie Beta' : (val.platform === 'platform3' ? 'Desktopalie Gamma' : (val.platform === 'platform4' ? 'Desktopalie Delta' : 'Desktopalie Main'))),
                  role: val.role || 'Member',
                  status: val.status || 'Active',
                  created_at: val.created_at || new Date().toISOString(),
                  last_login: val.last_login || 'Baru Saja'
                });
              }
            }
          });
        }
      } catch (err) {
        console.warn('Settings member fetch warning:', err);
      }

      // 4. Read from Supabase profiles table
      try {
        const { data: profiles, error } = await supabase.from('profiles').select('*');
        if (!error && profiles && profiles.length > 0) {
          profiles.forEach(p => {
            if (p.email) {
              const existing = map.get(p.email) || {};
              map.set(p.email, {
                id: p.id,
                full_name: p.full_name || existing.full_name || p.email.split('@')[0],
                email: p.email,
                avatar_url: p.avatar_url || existing.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.email)}`,
                provider: p.provider || existing.provider || 'Google OAuth 2.0',
                platform: p.platform || existing.platform || 'platform1',
                platformName: p.platformName || existing.platformName || 'Desktopalie Main',
                role: p.role || existing.role || 'Member',
                status: 'Active',
                created_at: p.created_at || existing.created_at || new Date().toISOString(),
                last_login: 'Aktif'
              });
            }
          });
        }
      } catch (err) {
        console.warn('Profiles fetch warning:', err);
      }

      // 5. Add current logged in user if missing
      if (currentUser && currentUser.email) {
        const existing = map.get(currentUser.email) || {};
        map.set(currentUser.email, {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || existing.full_name || currentUser.email.split('@')[0],
          email: currentUser.email,
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || existing.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.email)}`,
          provider: currentUser.app_metadata?.provider === 'google' ? 'Google OAuth 2.0' : 'Email & Password',
          platform: existing.platform || 'platform1',
          platformName: existing.platformName || 'Desktopalie Main',
          role: existing.role || 'Super Admin',
          status: 'Active',
          created_at: currentUser.created_at || existing.created_at || new Date().toISOString(),
          last_login: 'Baru Saja'
        });
      }

      setMembers(Array.from(map.values()));
    } catch (err) {
      console.error('Error fetching members:', err);
      toast.error('Gagal memuat data anggota platform.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();

    const handleStorageChange = () => {
      fetchMembers();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  const filteredMembers = members.filter(m => {
    const matchesFilter = activeFilter === 'all' || m.platform === activeFilter;
    const matchesSearch = 
      m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDeleteMember = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun anggota ini?')) {
      setMembers(members.filter(m => m.id !== id));
      toast.success('Anggota berhasil dihapus.');
      setSelectedMember(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Full Name,Email,Provider,Platform,Role,Status,Created At'];
    const rows = filteredMembers.map(m => 
      `"${m.id}","${m.full_name}","${m.email}","${m.provider}","${m.platformName}","${m.role}","${m.status}","${m.created_at}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `desktopalie_membership_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data membership berhasil diekspor ke CSV!');
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPlatform, setAddPlatform] = useState('platform1');
  const [addProvider, setAddProvider] = useState('Google OAuth 2.0');

  const handleAddManualMember = async (e) => {
    e.preventDefault();
    if (!addEmail) {
      toast.error('Masukkan alamat email');
      return;
    }

    const platformNameMap = {
      platform1: 'Desktopalie Main',
      platform2: 'Desktopalie Beta',
      platform3: 'Desktopalie Gamma',
      platform4: 'Desktopalie Delta'
    };

    const newMemberPayload = {
      id: `usr-manual-${Date.now()}`,
      email: addEmail,
      full_name: addName || addEmail.split('@')[0],
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(addName || addEmail)}`,
      provider: addProvider,
      platform: addPlatform,
      platformName: platformNameMap[addPlatform] || 'Desktopalie Main',
      role: 'Member',
      status: 'Active',
      created_at: new Date().toISOString(),
      last_login: 'Baru Saja'
    };

    // 1. Save to localStorage registry
    const registryStr = localStorage.getItem('desktopalie_members_registry');
    let registry = registryStr ? JSON.parse(registryStr) : [];
    registry.unshift(newMemberPayload);
    localStorage.setItem('desktopalie_members_registry', JSON.stringify(registry));
    window.dispatchEvent(new Event('storage'));

    // 2. Save to Supabase site_settings table
    try {
      await backofficeService.saveSiteSetting(`member_${newMemberPayload.id}`, newMemberPayload);
      await supabase.from('profiles').upsert([{
        id: newMemberPayload.id,
        full_name: newMemberPayload.full_name,
        avatar_url: newMemberPayload.avatar_url,
        role: 'Member',
        updated_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.warn('Manual member add warning:', err);
    }

    toast.success(`Berhasil mendaftarkan akun ${newMemberPayload.email}!`);
    setShowAddModal(false);
    setAddName('');
    setAddEmail('');
    fetchMembers();
  };

  return (
    <>
      <Header title="Platform Membership & Account Hub" />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        
        {/* HERO BANNER MEMBERSHIP */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '2.25rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(15, 23, 42, 0) 70%)',
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
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.75rem',
                color: '#60A5FA',
                fontWeight: '700',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}>
                <FiUsers /> Unified Multi-Tenant User Registry
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: '#FFFFFF' }}>
                Pusat Keanggotaan & Akun Pengguna Platform
              </h1>

              <p style={{ color: '#94A3B8', fontSize: '0.925rem', margin: 0, maxWidth: '720px', lineHeight: '1.55' }}>
                Direktori terpadu seluruh akun pengguna dan administrator yang terdaftar atau login menggunakan Google OAuth di setiap platform (Main, Beta, Gamma, dan Delta).
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                <FiUserCheck />
                <span>+ Sync / Tambah Akun</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
                }}
              >
                <FiDownload />
                <span>Ekspor CSV</span>
              </button>

              <button
                type="button"
                onClick={fetchMembers}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
                title="Refresh Data Membership"
              >
                <FiRefreshCw />
              </button>
            </div>
          </div>
        </div>

        {/* MEMBERSHIP KPI STATS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Registered Members', value: members.length, color: '#3B82F6', icon: <FiUsers /> },
            { label: 'Google OAuth Accounts', value: members.filter(m => m.provider.includes('Google')).length, color: '#EA4335', icon: <FaGoogle /> },
            { label: 'Sub-Platform Accounts', value: members.filter(m => m.platform !== 'platform1').length, color: '#10B981', icon: <FiLayers /> },
            { label: 'Active Sessions', value: members.length, color: '#F59E0B', icon: <FiCheckCircle /> }
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
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* CONTROLS BAR: SEARCH & PLATFORM FILTER TABS */}
        <div style={{
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '18px',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama, email, atau metode login..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                  color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Platform Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Semua Platform' },
                { id: 'platform1', label: 'Main Website' },
                { id: 'platform2', label: 'Beta (Logistics)' },
                { id: 'platform3', label: 'Gamma (Transcoder)' },
                { id: 'platform4', label: 'Delta (Cloud ERP)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: activeFilter === tab.id ? '#3B82F6' : (isDarkMode ? '#0F172A' : '#F1F5F9'),
                    color: activeFilter === tab.id ? '#FFFFFF' : (isDarkMode ? '#94A3B8' : '#64748B'),
                    border: `1px solid ${activeFilter === tab.id ? '#3B82F6' : (isDarkMode ? '#334155' : '#E2E8F0')}`,
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MEMBERS TABLE CARD */}
        <div style={{
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '18px',
          padding: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
              📋 Daftar Anggota & Akun Pengguna ({filteredMembers.length})
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`, textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>PENGGUNA</th>
                  <th style={{ padding: '0.85rem 1rem' }}>EMAIL</th>
                  <th style={{ padding: '0.85rem 1rem' }}>METODE AUTH</th>
                  <th style={{ padding: '0.85rem 1rem' }}>ORIGIN PLATFORM</th>
                  <th style={{ padding: '0.85rem 1rem' }}>ROLE</th>
                  <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
                  <th style={{ padding: '0.85rem 1rem' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Tidak ada pengguna yang cocok dengan pencarian / filter platform ini.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((row) => (
                    <tr key={row.id} style={{ borderBottom: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}` }}>
                      {/* User Info */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={row.avatar_url}
                            alt="Avatar"
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #3B82F6' }}
                          />
                          <div>
                            <div style={{ fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{row.full_name}</div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>ID: {row.id.slice(0, 12)}...</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '600' }}>{row.email}</td>

                      {/* Auth Provider */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '99px',
                          backgroundColor: row.provider.includes('Google') ? 'rgba(234, 67, 53, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                          color: row.provider.includes('Google') ? '#EA4335' : '#3B82F6',
                          fontWeight: '700',
                          fontSize: '0.75rem'
                        }}>
                          {row.provider.includes('Google') ? <FaGoogle /> : <FiMail />}
                          <span>{row.provider}</span>
                        </span>
                      </td>

                      {/* Platform Origin Badge */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '99px',
                          backgroundColor: row.platform === 'platform2' ? 'rgba(16, 185, 129, 0.15)' : (row.platform === 'platform3' ? 'rgba(139, 92, 246, 0.15)' : (row.platform === 'platform4' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)')),
                          color: row.platform === 'platform2' ? '#10B981' : (row.platform === 'platform3' ? '#8B5CF6' : (row.platform === 'platform4' ? '#F59E0B' : '#3B82F6')),
                          fontWeight: '800',
                          fontSize: '0.75rem'
                        }}>
                          {row.platformName}
                        </span>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '700' }}>{row.role}</td>

                      {/* Status */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '99px',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#10B981',
                          fontWeight: '700',
                          fontSize: '0.725rem'
                        }}>
                          ● {row.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedMember(row)}
                            style={{
                              padding: '0.45rem 0.65rem',
                              borderRadius: '8px',
                              backgroundColor: isDarkMode ? '#0F172A' : '#F1F5F9',
                              border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                              color: isDarkMode ? '#F8FAFC' : '#0F172A',
                              cursor: 'pointer'
                            }}
                            title="Detail Profil Pengguna"
                          >
                            <FiEye />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteMember(row.id)}
                            style={{
                              padding: '0.45rem 0.65rem',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(239, 68, 68, 0.12)',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer'
                            }}
                            title="Hapus Pengguna"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PROFILE DETAIL MODAL */}
        {selectedMember && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            padding: '1rem'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              position: 'relative'
            }}>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.25rem',
                  cursor: 'pointer'
                }}
              >
                <FiX />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <img
                  src={selectedMember.avatar_url}
                  alt="Avatar"
                  style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #3B82F6', margin: '0 auto 0.75rem auto' }}
                />
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  {selectedMember.full_name}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{selectedMember.email}</p>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '1.25rem',
                borderRadius: '16px',
                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Platform Terdaftar:</span>
                  <strong style={{ color: '#3B82F6' }}>{selectedMember.platformName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Metode Autentikasi:</span>
                  <strong>{selectedMember.provider}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Role Pengguna:</span>
                  <strong>{selectedMember.role}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Waktu Registrasi:</span>
                  <strong>{new Date(selectedMember.created_at).toLocaleDateString('id-ID')}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Tutup Profil
              </button>
            </div>
          </div>
        )}

        {/* MANUAL ADD MEMBER MODAL */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            padding: '1rem'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              position: 'relative'
            }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.25rem',
                  cursor: 'pointer'
                }}
              >
                <FiX />
              </button>

              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                ➕ Tambah / Sync Akun Pengguna Manual
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Masukkan data pengguna untuk didaftarkan langsung ke dalam direktori keanggotaan Supabase.
              </p>

              <form onSubmit={handleAddManualMember}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Email Pengguna
                  </label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                      border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                      border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Asal Platform Target
                  </label>
                  <select
                    value={addPlatform}
                    onChange={(e) => setAddPlatform(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                      border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    <option value="platform1">Desktopalie Main (Website Utama)</option>
                    <option value="platform2">Desktopalie Beta (Smart Logistics)</option>
                    <option value="platform3">Desktopalie Gamma (AI Video Transcoder)</option>
                    <option value="platform4">Desktopalie Delta (Enterprise Cloud ERP)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  Simpan Akun Anggota
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
