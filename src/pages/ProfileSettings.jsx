import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useFlavor } from '../context/FlavorContext';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { 
  FiGlobe, 
  FiMapPin, 
  FiSave, 
  FiCheckCircle, 
  FiUser, 
  FiShield, 
  FiMail, 
  FiCopy, 
  FiExternalLink, 
  FiClock, 
  FiLayers, 
  FiZap,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock
} from 'react-icons/fi';
import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';

export default function ProfileSettings() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { activeFlavor } = useFlavor();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'language', 'security'
  const [copiedId, setCopiedId] = useState(false);
  const [showFullId, setShowFullId] = useState(false);

  const maskId = (id) => {
    if (!id) return '••••••••-••••-••••-••••-••••••••••••';
    const parts = id.split('-');
    if (parts.length === 5) {
      return `${parts[0]}-••••-••••-••••-${parts[4]}`;
    }
    return id.slice(0, 8) + '••••••••••••••••' + id.slice(-4);
  };

  const defaultBio = "Deskripsi student (peserta didik atau siswa) merujuk pada individu yang aktif menuntut ilmu, belajar, atau mendaftarkan diri pada suatu lembaga pendidikan (seperti sekolah, kursus, atau universitas).Peran utama seorang student adalah menyerap pengetahuan, melatih keterampilan, dan membentuk karakter melalui proses bimbingan pengajar.";

  const getInitialProfileState = () => {
    try {
      const cached = localStorage.getItem('desktopalie_profile') || localStorage.getItem(`desktopalie_profile_${user?.id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          full_name: parsed.full_name || '',
          username: parsed.username || '',
          bio: parsed.bio || defaultBio,
          avatar_url: parsed.avatar_url || '',
          location: parsed.location || 'Indonesia',
          website: parsed.website || ''
        };
      }
    } catch (e) {}
    return {
      full_name: '',
      username: '',
      bio: defaultBio,
      avatar_url: '',
      location: 'Indonesia',
      website: ''
    };
  };

  const [profile, setProfile] = useState(getInitialProfileState);

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getProfile(user?.id);
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          bio: data.bio || defaultBio,
          avatar_url: data.avatar_url || '',
          location: data.location || 'Indonesia',
          website: data.website || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const savedData = await backofficeService.updateProfile(user?.id, profile);
      if (savedData) {
        setProfile(prev => ({
          ...prev,
          full_name: savedData.full_name || prev.full_name,
          username: savedData.username || prev.username,
          bio: savedData.bio || prev.bio,
          avatar_url: savedData.avatar_url || prev.avatar_url,
          location: savedData.location || prev.location,
          website: savedData.website || prev.website
        }));
      }
      toast.success(t('profileUpdated'));
    } catch (err) {
      console.error(err);
      toast.error(t('profileFailed'));
    } finally {
      setSaving(false);
    }
  };

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      toast.success('User ID copied to clipboard!');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#4f46e5';

  return (
    <>
      <Header title={t('profile')} />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        
        {/* HERO PROFILE COVER BANNER */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          marginBottom: '2rem',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.12)'
        }}>
          {/* Ambient Decorative Gradient & Glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}66 0%, rgba(15, 23, 42, 0) 70%)`,
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none'
          }} />

          {/* Banner Main Content */}
          <div style={{ position: 'relative', zIndex: 2, padding: '2rem 2.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              
              {/* Left Profile Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  position: 'relative',
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${primaryColor}, #8B5CF6)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '2.25rem',
                  fontWeight: '800',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    profile.full_name ? profile.full_name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'A')
                  )}
                  {/* Status Indicator Dot */}
                  <span style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    border: '2px solid #0F172A'
                  }} title="Active Online" />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                      {profile.full_name || 'Workspace Administrator'}
                    </h1>
                    {profile.username && (
                      <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: '600' }}>
                        @{profile.username}
                      </span>
                    )}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '99px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '0.725rem',
                      fontWeight: '700'
                    }}>
                      <FiShield style={{ fontSize: '0.75rem' }} />
                      <span>Verified Admin</span>
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#CBD5E1', margin: '0 0 0.75rem 0', lineHeight: '1.45' }}>
                    {profile.bio || 'Independent designer & developer managing platform workspaces.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#94A3B8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FiMail style={{ color: primaryColor }} />
                      <span>{user?.email || 'admin@desktopalie.my.id'}</span>
                    </span>
                    {profile.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FiMapPin style={{ color: '#F59E0B' }} />
                        <span>{profile.location}</span>
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FiLayers style={{ color: '#6366F1' }} />
                      <span>Workspace: {activeFlavor?.shortName || 'Main Core'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Quick Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={copyUserId}
                  className="btn btn-secondary btn-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {copiedId ? <FiCheck style={{ color: '#10B981' }} /> : <FiCopy />}
                  <span>{copiedId ? 'ID Copied!' : 'Copy User ID'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* TABBED NAVIGATION HEADER */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0 2.25rem',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            zIndex: 3
          }}>
            {[
              { id: 'personal', label: 'Personal & Profile Details', icon: FiUser },
              { id: 'language', label: 'Language & Regional', icon: FiGlobe },
              { id: 'security', label: 'Security & Metadata', icon: FiShield }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.85rem 1.25rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? `3px solid ${primaryColor}` : '3px solid transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontWeight: isActive ? '700' : '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon style={{ color: isActive ? primaryColor : '#64748B' }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '1.75rem',
          alignItems: 'start'
        }}>
          
          {/* LEFT COLUMN: ACTIVE TAB CONTENT */}
          <div>
            {/* TAB 1: PERSONAL & PROFILE DETAILS */}
            {activeTab === 'personal' && (
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                      Profile Information
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                      Update your public profile image, bio, location, and developer info.
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Auto-saved to Supabase Profile
                  </span>
                </div>

                {loading ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading profile settings...</div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Avatar Uploader Section */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <ImageUploader
                        value={profile.avatar_url}
                        onChange={(url) => setProfile(prev => ({ ...prev, avatar_url: url }))}
                        folder="avatars"
                        label="Admin Profile Avatar Image"
                      />
                    </div>

                    {/* Full Name & Username Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700' }}>{t('fullName')} *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Faiz Ali"
                          value={profile.full_name}
                          onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700' }}>{t('username')} *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. faizali"
                          value={profile.username}
                          onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    {/* Short Bio Textarea */}
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label className="form-label" style={{ fontWeight: '700', margin: 0 }}>{t('shortBio')}</label>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: (profile.bio?.length || 0) >= 350 ? '#EF4444' : 'var(--text-muted)' }}>
                          {profile.bio?.length || 0} / 350 karakter (Maks)
                        </span>
                      </div>
                      <textarea
                        className="form-control"
                        rows="4"
                        maxLength={350}
                        placeholder="Deskripsi student (peserta didik atau siswa) merujuk pada individu yang aktif menuntut ilmu, belajar, atau mendaftarkan diri pada suatu lembaga pendidikan (seperti sekolah, kursus, atau universitas).Peran utama seorang student adalah menyerap pengetahuan, melatih keterampilan, dan membentuk karakter melalui proses bimbingan pengajar."
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value.slice(0, 350) }))}
                      />
                    </div>

                    {/* Location & Portfolio Website Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700' }}>{t('location')}</label>
                        <div style={{ position: 'relative' }}>
                          <FiMapPin style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            type="text"
                            className="form-control"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="e.g. Jakarta, Indonesia"
                            value={profile.location}
                            onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '700' }}>{t('portfolioWebsite')}</label>
                        <div style={{ position: 'relative' }}>
                          <FiGlobe style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            type="url"
                            className="form-control"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="https://desktopalie.my.id"
                            value={profile.website}
                            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '0.75rem 1.75rem', fontWeight: '700' }}>
                        <FiSave />
                        <span>{saving ? t('saving') : t('saveChanges')}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: LANGUAGE & REGIONAL PREFERENCES */}
            {activeTab === 'language' && (
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <FiGlobe style={{ color: primaryColor, fontSize: '1.25rem' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {t('langPreference')}
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  {t('langSubtitle')}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                  {/* Bahasa Indonesia Card */}
                  <div
                    onClick={() => setLanguage('id')}
                    style={{
                      border: `2px solid ${language === 'id' ? primaryColor : 'var(--border-color)'}`,
                      backgroundColor: language === 'id' ? `${primaryColor}10` : 'var(--bg-card)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: language === 'id' ? `0 4px 16px ${primaryColor}20` : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '2.25rem', lineHeight: 1 }}>🇮🇩</span>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>
                          Bahasa Indonesia
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Bahasa Resmi Antarmuka Backoffice
                        </span>
                      </div>
                    </div>
                    {language === 'id' && (
                      <FiCheckCircle style={{ color: primaryColor, fontSize: '1.4rem' }} />
                    )}
                  </div>

                  {/* English Card */}
                  <div
                    onClick={() => setLanguage('en')}
                    style={{
                      border: `2px solid ${language === 'en' ? primaryColor : 'var(--border-color)'}`,
                      backgroundColor: language === 'en' ? `${primaryColor}10` : 'var(--bg-card)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: language === 'en' ? `0 4px 16px ${primaryColor}20` : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '2.25rem', lineHeight: 1 }}>🇬🇧</span>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>
                          English
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          International English Translation
                        </span>
                      </div>
                    </div>
                    {language === 'en' && (
                      <FiCheckCircle style={{ color: primaryColor, fontSize: '1.4rem' }} />
                    )}
                  </div>
                </div>

                {/* Regional Info Box */}
                <div style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FiClock style={{ color: primaryColor }} />
                    <span>Regional & Timezone Settings</span>
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>Detected Timezone:</strong>
                      <div>{Intl.DateTimeFormat().resolvedOptions().timeZone} (GMT+7)</div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>Date Formatting:</strong>
                      <div>DD/MM/YYYY ISO Standard</div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>Language Sync:</strong>
                      <div>Persisted in LocalStorage</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: SECURITY & METADATA */}
            {activeTab === 'security' && (
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <FiShield style={{ color: primaryColor, fontSize: '1.25rem' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Security & Account Credentials
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Overview of your authentication status, user identifier, and workspace privileges.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Account UUID Card */}
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <FiLock style={{ color: '#10B981' }} />
                        <span>Supabase User UUID (Encrypted / Masked)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem' }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                          {showFullId ? (user?.id || 'No active user session') : maskId(user?.id)}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowFullId(!showFullId)}
                          title={showFullId ? "Mask / Hide UUID" : "Reveal Full UUID"}
                          style={{
                            background: 'none',
                            border: `1px solid ${showFullId ? '#CBD5E1' : `${primaryColor}40`}`,
                            borderRadius: '6px',
                            padding: '0.2rem 0.5rem',
                            color: primaryColor,
                            backgroundColor: `${primaryColor}10`,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: '700'
                          }}
                        >
                          {showFullId ? <FiEyeOff /> : <FiEye />}
                          <span>{showFullId ? 'Mask' : 'Reveal'}</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={copyUserId}
                      className="btn btn-secondary btn-sm"
                    >
                      <FiCopy />
                      <span>{copiedId ? 'Copied' : 'Copy UUID'}</span>
                    </button>
                  </div>

                  {/* Role & Permissions Card */}
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.25rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>System Role</div>
                      <div style={{ fontWeight: '800', color: primaryColor, fontSize: '0.95rem', marginTop: '0.25rem' }}>
                        Administrator (Full RLS Access)
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Auth Provider</div>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Supabase Auth (JWT PKCE)
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Maintenance Bypass</div>
                      <div style={{ fontWeight: '700', color: '#10B981', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Enabled (Always Access)
                      </div>
                    </div>
                  </div>

                  {/* Sign Out Card */}
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#991B1B', fontSize: '0.95rem' }}>
                        Sign Out of Backoffice
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#B91C1C', marginTop: '0.15rem' }}>
                        End your current session on this workspace browser window.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={logout}
                      className="btn btn-secondary"
                      style={{ backgroundColor: '#FFFFFF', color: '#991B1B', borderColor: '#FCA5A5', fontWeight: '700' }}
                    >
                      Sign Out
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: LIVE PUBLIC PROFILE CARD PREVIEW */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <FiZap style={{ color: primaryColor, fontSize: '1.15rem' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Live Profile Card Preview
                </h3>
              </div>

              {/* Realistic Public Card Widget */}
              <div style={{
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '48px',
                  margin: '-1.5rem -1.5rem 1rem -1.5rem',
                  background: `linear-gradient(135deg, ${primaryColor}, #8B5CF6)`
                }} />

                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  margin: '-40px auto 0.75rem auto',
                  background: primaryColor,
                  border: '3px solid var(--bg-card)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '1.65rem',
                  fontWeight: '800',
                  overflow: 'hidden'
                }}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'A'
                  )}
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.15rem 0' }}>
                  {profile.full_name || 'Your Full Name'}
                </h4>
                
                <div style={{ fontSize: '0.78rem', color: primaryColor, fontWeight: '700', marginBottom: '0.75rem' }}>
                  @{profile.username || 'username'}
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                  {profile.bio || 'Short bio will appear here...'}
                </p>

                {profile.location && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
                    <FiMapPin style={{ color: '#F59E0B' }} />
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile.website && (
                  <div>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        color: primaryColor,
                        textDecoration: 'none'
                      }}
                    >
                      <FiGlobe />
                      <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                      <FiExternalLink style={{ fontSize: '0.7rem' }} />
                    </a>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                💡 Changes in the form update this card live.
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
