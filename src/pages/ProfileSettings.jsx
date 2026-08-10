import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiGlobe, FiMapPin, FiSave, FiCheckCircle } from 'react-icons/fi';
import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';

export default function ProfileSettings() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    bio: 'Independent designer & developer',
    avatar_url: '',
    location: 'Indonesia',
    website: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getProfile(user.id);
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          bio: data.bio || 'Independent designer & developer',
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
    if (!user?.id) return;

    setSaving(true);
    try {
      await backofficeService.updateProfile(user.id, profile);
      toast.success(t('profileUpdated'));
    } catch (err) {
      console.error(err);
      toast.error(t('profileFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title={t('profile')} />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>{t('accountSettings')}</h1>
            <p className="page-subtitle">{t('subtitleSettings')}</p>
          </div>
        </div>

        <div style={{ maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* LANGUAGE SELECTION CARD */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <FiGlobe style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
                {t('langPreference')}
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {t('langSubtitle')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Bahasa Indonesia Option */}
              <div
                onClick={() => setLanguage('id')}
                style={{
                  border: `2px solid ${language === 'id' ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: language === 'id' ? 'var(--primary-light)' : 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease shadow'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🇮🇩</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      Bahasa Indonesia
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Bahasa Resmi Indonesia
                    </span>
                  </div>
                </div>
                {language === 'id' && (
                  <FiCheckCircle style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
                )}
              </div>

              {/* English Option */}
              <div
                onClick={() => setLanguage('en')}
                style={{
                  border: `2px solid ${language === 'en' ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: language === 'en' ? 'var(--primary-light)' : 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🇬🇧</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      English
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      English International
                    </span>
                  </div>
                </div>
                {language === 'en' && (
                  <FiCheckCircle style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
                )}
              </div>
            </div>
          </div>

          {/* PROFILE DETAILS CARD */}
          <div className="card">
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading profile...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '1.85rem',
                    fontWeight: '700',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '2px solid #FFFFFF',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      profile.full_name ? profile.full_name.charAt(0) : (user?.email?.charAt(0).toUpperCase() || 'A')
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>
                      {profile.full_name || user?.email || 'Workspace Admin'}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</span>
                  </div>
                </div>

                <ImageUploader
                  value={profile.avatar_url}
                  onChange={(url) => setProfile(prev => ({ ...prev, avatar_url: url }))}
                  folder="avatars"
                  label="Admin Profile Avatar Image"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('fullName')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Faiz Ali"
                      value={profile.full_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('username')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="faizali"
                      value={profile.username}
                      onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('shortBio')}</label>
                  <textarea
                    className="form-control"
                    placeholder="Independent designer & developer"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('location')}</label>
                    <div style={{ position: 'relative' }}>
                      <FiMapPin style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Indonesia"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('portfolioWebsite')}</label>
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

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    <FiSave />
                    <span>{saving ? t('saving') : t('saveChanges')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
