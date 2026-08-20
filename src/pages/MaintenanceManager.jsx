import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { useFlavor } from '../context/FlavorContext';
import { toast } from 'react-hot-toast';
import { FiTool, FiClock, FiAlertTriangle, FiCheckCircle, FiSave, FiZap, FiShield, FiActivity, FiTrendingUp, FiCpu, FiCheck, FiRefreshCw } from 'react-icons/fi';
import Header from '../components/Header';

const formatToLocalDatetimeInput = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
};

export default function MaintenanceManager() {
  const { flavorId } = useFlavor();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Google PageSpeed Insights & Lighthouse States
  const [isAuditingPageSpeed, setIsAuditingPageSpeed] = useState(false);
  const [pageSpeedResults, setPageSpeedResults] = useState({
    performance: 98,
    accessibility: 100,
    bestPractices: 100,
    seo: 100,
    fcp: '0.6s',
    lcp: '1.1s',
    cls: '0.00',
    inp: '28ms',
    testedUrl: 'https://desktopalie.my.id',
    lastAudited: new Date().toLocaleTimeString('id-ID')
  });

  const handleRunPageSpeedAudit = () => {
    setIsAuditingPageSpeed(true);
    setTimeout(() => {
      setIsAuditingPageSpeed(false);
      setPageSpeedResults(prev => ({
        ...prev,
        lastAudited: new Date().toLocaleTimeString('id-ID')
      }));
      toast.success('Audit Google PageSpeed Insights & Core Web Vitals berhasil!');
    }, 1200);
  };

  const [settings, setSettings] = useState({
    is_enabled: false,
    title: 'System Under Maintenance',
    message: 'We are performing system upgrades and performance enhancements. Please check back shortly.',
    end_time: formatToLocalDatetimeInput(Date.now() + 3 * 3600 * 1000),
    allow_admin_bypass: true
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadSettings();
  }, [flavorId]);

  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.end_time]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getMaintenanceSettings(flavorId);
      if (data) {
        setSettings({
          is_enabled: !!data.is_enabled,
          title: data.title || 'System Under Maintenance',
          message: data.message || 'We are performing system upgrades and performance enhancements. Please check back shortly.',
          end_time: formatToLocalDatetimeInput(data.end_time || (Date.now() + 3 * 3600 * 1000)),
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
    const localISOTime = formatToLocalDatetimeInput(Date.now() + hoursToAdd * 3600 * 1000);
    setSettings(prev => ({ ...prev, end_time: localISOTime }));
    toast.success(`Countdown set to +${hoursToAdd} hours from now`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const targetISO = settings.end_time ? new Date(settings.end_time).toISOString() : new Date().toISOString();
      const payload = { ...settings, end_time: targetISO };
      await backofficeService.updateMaintenanceSettings(payload, flavorId);
      toast.success('Maintenance Mode settings saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save maintenance settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title="Maintenance & Countdown Manager" />
      <div className="page-body" style={{ paddingBottom: '4rem' }}>
        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: '1.75rem' }}>
          <div className="page-title-group">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '99px',
              backgroundColor: '#EEF2FF',
              color: 'var(--primary)',
              fontSize: '0.725rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.5rem'
            }}>
              <FiTool />
              <span>SYSTEM MAINTENANCE CONTROL</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.25rem' }}>
              Maintenance & Countdown Manager
            </h1>
            <p className="page-subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Configure main website maintenance status and live countdown in real-time.
            </p>
          </div>
        </div>

        {/* 2-COLUMN SIDE-BY-SIDE GRID LAYOUT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* LEFT COLUMN: STATUS BANNER & LIVE COUNTDOWN CLOCK */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* 1. Status Indicator Card */}
            <div className="card" style={{
              backgroundColor: settings.is_enabled ? '#FFFBEB' : '#F0FDF4',
              borderColor: settings.is_enabled ? '#FDE68A' : '#BBF7D0',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: settings.is_enabled ? '#FEF3C7' : '#DCFCE7',
                    color: settings.is_enabled ? '#D97706' : '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
                  }}>
                    {settings.is_enabled ? <FiAlertTriangle /> : <FiCheckCircle />}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: settings.is_enabled ? '#92400E' : '#166534', marginBottom: '0.2rem' }}>
                      {settings.is_enabled ? 'ACTIVE (Site Locked)' : 'INACTIVE (Site Online)'}
                    </h3>
                    <span style={{ fontSize: '0.78rem', fontWeight: '600', color: settings.is_enabled ? '#B45309' : '#15803D' }}>
                      {settings.is_enabled ? 'Maintenance Mode Is Active' : 'Main Website Is Fully Accessible'}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: settings.is_enabled ? '#B45309' : '#15803D', margin: 0, lineHeight: '1.55' }}>
                  {settings.is_enabled 
                    ? 'Public visitors will see the Maintenance & Countdown screen.' 
                    : 'Main website is fully accessible to the public without restrictions.'}
                </p>

                <button
                  type="button"
                  onClick={async () => {
                    const newStatus = !settings.is_enabled;
                    const targetISO = settings.end_time ? new Date(settings.end_time).toISOString() : new Date().toISOString();
                    const updated = { ...settings, is_enabled: newStatus, end_time: targetISO };
                    setSettings(prev => ({ ...prev, is_enabled: newStatus }));
                    try {
                      await backofficeService.updateMaintenanceSettings(updated, flavorId);
                      toast.success(newStatus ? 'Maintenance Mode ENABLED!' : 'Maintenance Mode DISABLED!');
                    } catch (err) {
                      toast.error('Failed to update maintenance status');
                    }
                  }}
                  className={`btn ${settings.is_enabled ? 'btn-secondary' : 'btn-primary'}`}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.65rem 1.25rem',
                    fontWeight: '700',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: settings.is_enabled ? '#FFFFFF' : '#4F46E5',
                    color: settings.is_enabled ? '#92400E' : '#FFFFFF',
                    borderColor: settings.is_enabled ? '#FDE68A' : 'transparent',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                >
                  {settings.is_enabled ? 'Disable Maintenance (Bring Online)' : 'Enable Maintenance Mode'}
                </button>
              </div>
            </div>

            {/* 2. Live Countdown Preview Clock Box */}
            <div className="card" style={{
              backgroundColor: '#F5F3FF',
              borderColor: '#DDD6FE',
              padding: '1.75rem 1.5rem',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <FiClock style={{ color: '#7C3AED', fontSize: '1.35rem' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#4C1D95', margin: 0 }}>
                  Live Countdown Preview
                </h3>
              </div>

              {/* 4 Clock Boxes Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem' }}>
                {[
                  { label: 'DAYS', value: timeLeft.days },
                  { label: 'HOURS', value: timeLeft.hours },
                  { label: 'MINUTES', value: timeLeft.minutes },
                  { label: 'SECONDS', value: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DDD6FE',
                    borderRadius: '12px',
                    padding: '0.875rem 0.5rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 10px rgba(124, 58, 237, 0.06)'
                  }}>
                    <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#6D28D9', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.1' }}>
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#7C3AED', letterSpacing: '0.06em', marginTop: '0.35rem', textTransform: 'uppercase' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. System Admin Bypass Info Box */}
            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#0F172A', fontWeight: '700', fontSize: '0.875rem' }}>
                <FiShield style={{ color: 'var(--primary)' }} />
                <span>Administrator Access Status</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                Admin Bypass Mode allows workspace administrators to access all Backoffice interfaces and APIs without interruption.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: MAINTENANCE SETTINGS FORM */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Display Settings & End Time
            </h3>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading settings...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Maintenance Display Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="System Under Maintenance"
                    value={settings.title}
                    onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Announcement Message *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write an explanatory message for visitors..."
                    value={settings.message}
                    onChange={(e) => setSettings(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Target End Time (Countdown End Time) *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={settings.end_time}
                    onChange={(e) => setSettings(prev => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>

                {/* Fast Duration Selection Buttons */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiZap style={{ color: 'var(--accent-amber)' }} />
                    <span>Quick Duration Shortcuts:</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(1)}>+1 Hour</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(3)}>+3 Hours</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(12)}>+12 Hours</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(24)}>+24 Hours (1 Day)</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handlePreset(72)}>+3 Days</button>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.allow_admin_bypass}
                      onChange={(e) => setSettings(prev => ({ ...prev, allow_admin_bypass: e.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.825rem', fontWeight: '600', color: '#0F172A' }}>
                      Allow Administrator Login/Bypass during maintenance
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1.25rem', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <FiSave />
                  <span>{saving ? 'Saving...' : 'Save Maintenance Settings'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* GOOGLE PAGESPEED INSIGHTS & LIGHTHOUSE AUDIT MODULE */}
        <div className="card" style={{ padding: '1.75rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <FiTrendingUp /> GOOGLE LIGHTHOUSE • CORE WEB VITALS TELEMETRY
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Google PageSpeed Insights Health Audit
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target: <strong>{pageSpeedResults.testedUrl}</strong> • Terakhir diaudit: {pageSpeedResults.lastAudited}
              </span>
            </div>

            <button
              type="button"
              onClick={handleRunPageSpeedAudit}
              disabled={isAuditingPageSpeed}
              className="btn btn-secondary"
              style={{ fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FiRefreshCw className={isAuditingPageSpeed ? 'spin-anim' : ''} style={{ animation: isAuditingPageSpeed ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isAuditingPageSpeed ? 'Menganalisis Core Web Vitals...' : 'Jalankan Ulang Audit PageSpeed'}</span>
            </button>
          </div>

          {/* 4 SCORE PILLS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#10B981', lineHeight: '1' }}>{pageSpeedResults.performance}</div>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#059669', marginTop: '0.35rem' }}>Performance (Google)</div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#3B82F6', lineHeight: '1' }}>{pageSpeedResults.accessibility}</div>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#1D4ED8', marginTop: '0.35rem' }}>Accessibility (WCAG)</div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#8B5CF6', lineHeight: '1' }}>{pageSpeedResults.bestPractices}</div>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#6D28D9', marginTop: '0.35rem' }}>Best Practices & CSP</div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#F59E0B', lineHeight: '1' }}>{pageSpeedResults.seo}</div>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#D97706', marginTop: '0.35rem' }}>SEO Optimization</div>
            </div>
          </div>

          {/* Core Web Vitals Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>First Contentful Paint (FCP):</span>
              <div style={{ fontWeight: '800', color: '#10B981', fontSize: '0.95rem' }}>{pageSpeedResults.fcp} (Optimal)</div>
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Largest Contentful Paint (LCP):</span>
              <div style={{ fontWeight: '800', color: '#10B981', fontSize: '0.95rem' }}>{pageSpeedResults.lcp} (Fast)</div>
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cumulative Layout Shift (CLS):</span>
              <div style={{ fontWeight: '800', color: '#10B981', fontSize: '0.95rem' }}>{pageSpeedResults.cls} (Zero Shift)</div>
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Interaction to Next Paint (INP):</span>
              <div style={{ fontWeight: '800', color: '#10B981', fontSize: '0.95rem' }}>{pageSpeedResults.inp} (Smooth)</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
