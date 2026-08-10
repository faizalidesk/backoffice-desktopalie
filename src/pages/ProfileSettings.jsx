import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiUser, FiGlobe, FiMapPin, FiSave } from 'react-icons/fi';
import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';

export default function ProfileSettings() {
  const { user } = useAuth();
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
      toast.success('Profil berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title="Profile & Settings" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Pengaturan Akun & Profil</h1>
            <p className="page-subtitle">Kelola profil publik dan informasi pengembang Anda.</p>
          </div>
        </div>

        <div style={{ maxWidth: '750px' }}>
          <div className="card">
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Memuat profil...</p>
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
                      {profile.full_name || user?.email || 'Admin Workspace'}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</span>
                  </div>
                </div>

                <ImageUploader
                  value={profile.avatar_url}
                  onChange={(url) => setProfile(prev => ({ ...prev, avatar_url: url }))}
                  folder="avatars"
                  label="Foto Avatar Profil Admin"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Faiz Ali"
                      value={profile.full_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username</label>
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
                  <label className="form-label">Bio singkat</label>
                  <textarea
                    className="form-control"
                    placeholder="Independent designer & developer"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Lokasi</label>
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
                    <label className="form-label">Website Portfolio</label>
                    <div style={{ position: 'relative' }}>
                      <FiGlobe style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="url"
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="https://desktopalie.com"
                        value={profile.website}
                        onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    <FiSave />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
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
