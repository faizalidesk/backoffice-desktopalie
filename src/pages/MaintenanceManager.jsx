import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiTool, FiClock, FiAlertTriangle, FiCheckCircle, FiSave, FiRefreshCw, FiZap } from 'react-icons/fi';
import Header from '../components/Header';

export default function MaintenanceManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    is_enabled: false,
    title: 'Situs Sedang Dalam Pemeliharaan',
    message: 'Kami sedang melakukan pembaruan sistem dan peningkatan performa. Kembali lagi dalam beberapa saat.',
    end_time: new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 16),
    allow_admin_bypass: true
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.end_time]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getMaintenanceSettings();
      if (data) {
        setSettings({
          is_enabled: !!data.is_enabled,
          title: data.title || 'Situs Sedang Dalam Pemeliharaan',
          message: data.message || 'Kami sedang melakukan pembaruan sistem. Kembali lagi nanti.',
          end_time: data.end_time ? new Date(data.end_time).toISOString().slice(0, 16) : new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 16),
          allow_admin_bypass: data.allow_admin_bypass !== false
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    if (!settings.end_time) return;
    const target = new Date(settings.end_time).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  const handlePreset = (hoursToAdd) => {
    const newTarget = new Date(Date.now() + hoursToAdd * 3600 * 1000);
    const tzOffset = newTarget.getTimezoneOffset() * 60000;
    const localISOTime = new Date(newTarget.getTime() - tzOffset).toISOString().slice(0, 16);
    setSettings(prev => ({ ...prev, end_time: localISOTime }));
    toast.success(`Countdown diatur +${hoursToAdd} jam dari sekarang`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await backofficeService.updateMaintenanceSettings(settings);
      toast.success('Pengaturan Maintenance Mode berhasil disimpan!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan pengaturan maintenance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title="Maintenance & Countdown Manager" />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        {/* CENTERED CONTAINER */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Centered Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '99px',
              backgroundColor: '#EEF2FF',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.75rem'
            }}>
              <FiTool />
              <span>SYSTEM MAINTENANCE CONTROL</span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Maintenance & Countdown Manager
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '560px', margin: '0 auto', lineHeight: '1.6' }}>
              Atur status pemeliharaan situs web utama dan hitung mundur (*countdown*) secara real-time.
            </p>
          </div>

          {/* Centered Status Indicator Banner */}
          <div className="card" style={{
            backgroundColor: settings.is_enabled ? '#FFFBEB' : '#F0FDF4',
            borderColor: settings.is_enabled ? '#FDE68A' : '#BBF7D0',
            marginBottom: '1.75rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: settings.is_enabled ? '#FEF3C7' : '#DCFCE7',
                color: settings.is_enabled ? '#D97706' : '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.65rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                {settings.is_enabled ? <FiAlertTriangle /> : <FiCheckCircle />}
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: settings.is_enabled ? '#92400E' : '#166534', marginBottom: '0.25rem' }}>
                  Status: {settings.is_enabled ? 'AKTIF (Situs Dikunci)' : 'NONAKTIF (Situs Online)'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: settings.is_enabled ? '#B45309' : '#15803D', margin: 0, maxWidth: '540px' }}>
                  {settings.is_enabled 
                    ? 'Pengunjung biasa akan melihat layar Maintenance & Hitung Mundur.' 
                    : 'Situs web utama dapat diakses publik secara normal tanpa hambatan.'}
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const newStatus = !settings.is_enabled;
                  const updated = { ...settings, is_enabled: newStatus };
                  setSettings(updated);
                  try {
                    await backofficeService.updateMaintenanceSettings(updated);
                    toast.success(newStatus ? 'Mode Maintenance DIAKTIFKAN!' : 'Mode Maintenance DIMATIKAN!');
                  } catch (err) {
                    toast.error('Gagal memperbarui status maintenance');
                  }
                }}
                className={`btn ${settings.is_enabled ? 'btn-secondary' : 'btn-primary'}`}
                style={{
                  marginTop: '0.25rem',
                  padding: '0.6rem 1.5rem',
                  fontWeight: '700',
                  borderRadius: '99px',
                  backgroundColor: settings.is_enabled ? '#FFFFFF' : '#4F46E5',
                  color: settings.is_enabled ? '#92400E' : '#FFFFFF',
                  borderColor: settings.is_enabled ? '#FDE68A' : 'transparent',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                {settings.is_enabled ? 'Matikan Maintenance (Kembali Online)' : 'Aktifkan Maintenance Mode'}
              </button>
            </div>
          </div>

          {/* Centered Live Countdown Preview Box */}
          <div className="card" style={{
            marginBottom: '1.75rem',
            textAlign: 'center',
            backgroundColor: '#F5F3FF',
            borderColor: '#DDD6FE',
            padding: '2rem 1.5rem',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <FiClock style={{ color: '#7C3AED', fontSize: '1.35rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#4C1D95', margin: 0 }}>
                Live Countdown Preview (Hitung Mundur)
              </h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'HARI', value: timeLeft.days },
                { label: 'JAM', value: timeLeft.hours },
                { label: 'MENIT', value: timeLeft.minutes },
                { label: 'DETIK', value: timeLeft.seconds }
              ].map((item, i) => (
                <div key={i} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DDD6FE',
                  borderRadius: '16px',
                  padding: '1.15rem 1.5rem',
                  minWidth: '105px',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)'
                }}>
                  <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#6D28D9', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.1' }}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.725rem', fontWeight: '800', color: '#7C3AED', letterSpacing: '0.08em', marginTop: '0.4rem', textTransform: 'uppercase' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Centered Form Settings */}
          <div className="card" style={{ padding: '2rem' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat pengaturan...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Judul Tampilan Maintenance *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Situs Sedang Dalam Pemeliharaan"
                    value={settings.title}
                    onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Pesan Deskripsi Pengumuman *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Tuliskan pesan penjelasan untuk pengunjung..."
                    value={settings.message}
                    onChange={(e) => setSettings(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Waktu Target Selesai (Countdown End Time) *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={settings.end_time}
                    onChange={(e) => setSettings(prev => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>

                {/* Preset Fast Duration Selection Buttons */}
                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiZap style={{ color: 'var(--accent-amber)' }} />
                    <span>Pintasan Durasi Cepat:</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(1)}>+1 Jam</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(3)}>+3 Jam</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(12)}>+12 Jam</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(24)}>+24 Jam (1 Hari)</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(72)}>+3 Hari</button>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginBottom: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.allow_admin_bypass}
                      onChange={(e) => setSettings(prev => ({ ...prev, allow_admin_bypass: e.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0F172A' }}>
                      Izinkan Administrator Login/Bypass tampilan maintenance (Admin tetap dapat mengakses situs)
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    style={{ padding: '0.75rem 2.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    <FiSave />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan Maintenance'}</span>
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
