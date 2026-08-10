import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiTool, FiClock, FiAlertTriangle, FiCheckCircle, FiSave, FiRefreshCw } from 'react-icons/fi';
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
    // Format to ISO string sliced for datetime-local input YYYY-MM-THH:mm
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
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Kontrol Maintenance & Countdown</h1>
            <p className="page-subtitle">Atur status pemeliharaan situs web utama dan hitung mundur secara real-time.</p>
          </div>
        </div>

        <div style={{ maxWidth: '850px' }}>
          {/* Status Indicator Card */}
          <div className="card" style={{
            backgroundColor: settings.is_enabled ? '#FFFBEB' : '#F0FDF4',
            borderColor: settings.is_enabled ? '#FDE68A' : '#BBF7D0',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: settings.is_enabled ? '#FEF3C7' : '#DCFCE7',
                  color: settings.is_enabled ? '#D97706' : '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {settings.is_enabled ? <FiAlertTriangle /> : <FiCheckCircle />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: settings.is_enabled ? '#92400E' : '#166534' }}>
                    Status Pemeliharaan: {settings.is_enabled ? 'AKTIF (Situs Dikunci)' : 'NONAKTIF (Situs Online)'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: settings.is_enabled ? '#B45309' : '#15803D' }}>
                    {settings.is_enabled 
                      ? 'Pengunjung biasa akan melihat halaman Maintenance & Hitung Mundur.' 
                      : 'Situs web utama dapat diakses publik secara normal.'}
                  </p>
                </div>
              </div>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: settings.is_enabled ? '#92400E' : '#166534' }}>
                  {settings.is_enabled ? 'Matikan Maintenance' : 'Aktifkan Maintenance'}
                </span>
                <input
                  type="checkbox"
                  checked={settings.is_enabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, is_enabled: e.target.checked }))}
                  style={{ width: '22px', height: '22px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          {/* Countdown Preview Box */}
          <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FiClock style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Preview Hitung Mundur Live (Countdown)</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'HARI', value: timeLeft.days },
                { label: 'JAM', value: timeLeft.hours },
                { label: 'MENIT', value: timeLeft.minutes },
                { label: 'DETIK', value: timeLeft.seconds }
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.5rem',
                  minWidth: '90px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Settings */}
          <div className="card">
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Memuat pengaturan...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Judul Tampilan Maintenance</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Situs Sedang Dalam Pemeliharaan"
                    value={settings.title}
                    onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pesan Deskripsi Pengumuman</label>
                  <textarea
                    className="form-control"
                    placeholder="Tuliskan pesan penjelasan untuk pengunjung..."
                    value={settings.message}
                    onChange={(e) => setSettings(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Waktu Target Selesai (Countdown End Time)</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={settings.end_time}
                    onChange={(e) => setSettings(prev => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>

                {/* Preset Fast Selection */}
                <div className="form-group">
                  <label className="form-label">Pintasan Durasi Cepat:</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(1)}>+1 Jam</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(3)}>+3 Jam</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(12)}>+12 Jam</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(24)}>+24 Jam (1 Hari)</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(72)}>+3 Hari</button>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.allow_admin_bypass}
                      onChange={(e) => setSettings(prev => ({ ...prev, allow_admin_bypass: e.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>
                      Izinkan Administrator Login/Bypass tampilan maintenance (Admin tetap bisa mengakses situs)
                    </span>
                  </label>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
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
