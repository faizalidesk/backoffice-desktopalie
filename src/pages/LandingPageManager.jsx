import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { useFlavor } from '../context/FlavorContext';
import { availableFlavors } from '../config';
import { toast } from 'react-hot-toast';
import { 
  FiLayout, 
  FiSave, 
  FiInfo, 
  FiMail, 
  FiGithub, 
  FiLinkedin, 
  FiInstagram,
  FiEye,
  FiEdit3,
  FiGlobe,
  FiExternalLink,
  FiSmartphone,
  FiMonitor,
  FiCheckCircle,
  FiRefreshCw
} from 'react-icons/fi';
import Header from '../components/Header';

export default function LandingPageManager() {
  const { flavor: currentContextFlavor } = useFlavor();
  const [selectedFlavorId, setSelectedFlavorId] = useState(currentContextFlavor?.id || 'platform1');
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'preview'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const selectedFlavorConfig = availableFlavors.find(f => f.id === selectedFlavorId) || availableFlavors[0];

  const [settings, setSettings] = useState({
    domain_url: '',
    hero_badge: '',
    hero_title: '',
    hero_description: '',
    hero_cta_text: '',
    hero_secondary_cta_text: '',
    hero_note: '',
    about_title: '',
    about_large_copy: '',
    about_description: '',
    about_location: '',
    stat_1_value: '',
    stat_1_label: '',
    stat_2_value: '',
    stat_2_label: '',
    stat_3_value: '',
    stat_3_label: '',
    contact_title: '',
    contact_email: '',
    github_url: '',
    linkedin_url: '',
    instagram_url: ''
  });

  useEffect(() => {
    loadSettingsForPlatform(selectedFlavorId);
  }, [selectedFlavorId]);

  const loadSettingsForPlatform = async (flavorId) => {
    setLoading(true);
    try {
      const data = await backofficeService.getLandingPageSettings(flavorId);
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load landing settings for', flavorId, err);
      toast.error('Failed to load landing page settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await backofficeService.updateLandingPageSettings(settings, selectedFlavorId);
      toast.success(`Landing Page content for ${selectedFlavorConfig.name} saved!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save Landing Page content');
    } finally {
      setSaving(false);
    }
  };

  const primaryColor = selectedFlavorConfig?.theme?.colorPrimary || 'var(--primary)';

  return (
    <>
      <Header title="Multi-Platform Landing Page Manager" />
      <div className="page-body">
        
        {/* TOP PLATFORM SELECTOR BAR */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: primaryColor,
                display: 'inline-block'
              }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                {selectedFlavorConfig.name}
              </h2>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', margin: 0 }}>
              Domain Landing Page Publik: <strong style={{ color: 'var(--primary)' }}>{settings.domain_url || `https://${selectedFlavorId}.desktopalie.my.id`}</strong>
            </p>
          </div>

          {/* Platform Switcher Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            {availableFlavors.map(fl => {
              const isSelected = fl.id === selectedFlavorId;
              const themeColor = fl.theme?.colorPrimary || '#4f46e5';
              return (
                <button
                  key={fl.id}
                  type="button"
                  onClick={() => setSelectedFlavorId(fl.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? themeColor : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? `${themeColor}15` : 'var(--bg-card)',
                    color: isSelected ? themeColor : 'var(--text-muted)',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: themeColor
                  }} />
                  <span>{fl.shortName || fl.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MODE SWITCHER: EDITOR FORM vs LIVE PREVIEW */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-card-hover)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'editor' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'editor' ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'editor' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <FiEdit3 />
              <span>Editor Form</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'preview' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'preview' ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'preview' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <FiEye />
              <span>Live Real-Time Preview</span>
            </button>
          </div>

          {viewMode === 'preview' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-card-hover)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  title="Desktop Screen View"
                  style={{
                    padding: '0.35rem 0.65rem',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: previewDevice === 'desktop' ? 'var(--bg-card)' : 'transparent',
                    color: previewDevice === 'desktop' ? 'var(--text-main)' : 'var(--text-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FiMonitor />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  title="Mobile Screen View"
                  style={{
                    padding: '0.35rem 0.65rem',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: previewDevice === 'mobile' ? 'var(--bg-card)' : 'transparent',
                    color: previewDevice === 'mobile' ? 'var(--text-main)' : 'var(--text-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FiSmartphone />
                </button>
              </div>

              <a
                href={settings.domain_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                <FiGlobe />
                <span>Buka URL Domain</span>
                <FiExternalLink />
              </a>
            </div>
          )}
        </div>

        {/* VIEW MODE 1: EDITOR FORM */}
        {viewMode === 'editor' && (
          <div style={{ maxWidth: '850px' }}>
            {/* Tabs for Hero / About / Contact */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.5rem'
            }}>
              {[
                { id: 'hero', label: '1. Hero Section', icon: FiLayout },
                { id: 'about', label: '2. About & Stats', icon: FiInfo },
                { id: 'contact', label: '3. Contact & Socials', icon: FiMail },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.15rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="card">
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <FiRefreshCw className="spin-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
                  <p>Memuat konfigurasi landing page {selectedFlavorConfig.name}...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* TAB 1: HERO SECTION */}
                  {activeTab === 'hero' && (
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiLayout style={{ color: primaryColor }} /> Hero Section ({selectedFlavorConfig.name})
                      </h3>

                      <div className="form-group">
                        <label className="form-label">Domain Website Publik Target</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://beta.desktopalie.my.id"
                          value={settings.domain_url}
                          onChange={(e) => setSettings(prev => ({ ...prev, domain_url: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Status Badge Label</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Smart Logistics & Fleet Telemetry System"
                          value={settings.hero_badge}
                          onChange={(e) => setSettings(prev => ({ ...prev, hero_badge: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Main Title (Hero Headline)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Real-time Fleet Intelligence & Telemetry System"
                          value={settings.hero_title}
                          onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Main Description (Hero Subtitle)</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Solusi manajemen armada..."
                          value={settings.hero_description}
                          onChange={(e) => setSettings(prev => ({ ...prev, hero_description: e.target.value }))}
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Primary Button Text (Main CTA)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Explore my work"
                            value={settings.hero_cta_text}
                            onChange={(e) => setSettings(prev => ({ ...prev, hero_cta_text: e.target.value }))}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Secondary Button Text</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="More about me"
                            value={settings.hero_secondary_cta_text}
                            onChange={(e) => setSettings(prev => ({ ...prev, hero_secondary_cta_text: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Hero Footnote Note</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Currently exploring creative interfaces..."
                          value={settings.hero_note}
                          onChange={(e) => setSettings(prev => ({ ...prev, hero_note: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ABOUT & STATS */}
                  {activeTab === 'about' && (
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiInfo style={{ color: primaryColor }} /> About Section & Stats ({selectedFlavorConfig.name})
                      </h3>

                      <div className="form-group">
                        <label className="form-label">About Section Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings.about_title}
                          onChange={(e) => setSettings(prev => ({ ...prev, about_title: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">About Highlighted Statement</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={settings.about_large_copy}
                          onChange={(e) => setSettings(prev => ({ ...prev, about_large_copy: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">About Detailed Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={settings.about_description}
                          onChange={(e) => setSettings(prev => ({ ...prev, about_description: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Location Tag</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings.about_location}
                          onChange={(e) => setSettings(prev => ({ ...prev, about_location: e.target.value }))}
                        />
                      </div>

                      <h4 style={{ fontSize: '0.95rem', marginTop: '1.75rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                        Key Performance Metrics (Stats)
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Stat 1 Value</label>
                          <input
                            type="text"
                            className="form-control"
                            style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}
                            value={settings.stat_1_value}
                            onChange={(e) => setSettings(prev => ({ ...prev, stat_1_value: e.target.value }))}
                          />
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Stat 1 Label</label>
                          <input
                            type="text"
                            className="form-control"
                            value={settings.stat_1_label}
                            onChange={(e) => setSettings(prev => ({ ...prev, stat_1_label: e.target.value }))}
                          />
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Stat 2 Value</label>
                          <input
                            type="text"
                            className="form-control"
                            style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}
                            value={settings.stat_2_value}
                            onChange={(e) => setSettings(prev => ({ ...prev, stat_2_value: e.target.value }))}
                          />
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Stat 2 Label</label>
                          <input
                            type="text"
                            className="form-control"
                            value={settings.stat_2_label}
                            onChange={(e) => setSettings(prev => ({ ...prev, stat_2_label: e.target.value }))}
                          />
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Stat 3 Value</label>
                          <input
                            type="text"
                            className="form-control"
                            style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}
                            value={settings.stat_3_value}
                            onChange={(e) => setSettings(prev => ({ ...prev, stat_3_value: e.target.value }))}
                          />
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Stat 3 Label</label>
                          <input
                            type="text"
                            className="form-control"
                            value={settings.stat_3_label}
                            onChange={(e) => setSettings(prev => ({ ...prev, stat_3_label: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CONTACT & SOCIALS */}
                  {activeTab === 'contact' && (
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiMail style={{ color: primaryColor }} /> Contact Section & Social Links ({selectedFlavorConfig.name})
                      </h3>

                      <div className="form-group">
                        <label className="form-label">Contact Section Headline</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings.contact_title}
                          onChange={(e) => setSettings(prev => ({ ...prev, contact_title: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Primary Public Contact Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={settings.contact_email}
                          onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                          required
                        />
                      </div>

                      <h4 style={{ fontSize: '0.95rem', marginTop: '1.75rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                        Social Media & Repository Links
                      </h4>

                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FiGithub /> GitHub URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          value={settings.github_url}
                          onChange={(e) => setSettings(prev => ({ ...prev, github_url: e.target.value }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FiLinkedin /> LinkedIn URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          value={settings.linkedin_url}
                          onChange={(e) => setSettings(prev => ({ ...prev, linkedin_url: e.target.value }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FiInstagram /> Instagram URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          value={settings.instagram_url}
                          onChange={(e) => setSettings(prev => ({ ...prev, instagram_url: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Save Button */}
                  <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn btn-primary"
                      style={{
                        backgroundColor: primaryColor,
                        borderColor: primaryColor
                      }}
                    >
                      <FiSave />
                      <span>{saving ? 'Saving Changes...' : `Save Landing Page for ${selectedFlavorConfig.shortName}`}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* VIEW MODE 2: LIVE REAL-TIME PREVIEW */}
        {viewMode === 'preview' && (
          <div style={{
            margin: '0 auto',
            width: '100%',
            maxWidth: previewDevice === 'mobile' ? '395px' : '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {/* Device Mockup Wrapper */}
            <div style={{
              borderRadius: previewDevice === 'mobile' ? '36px' : 'var(--radius-lg)',
              border: previewDevice === 'mobile' ? '12px solid #1e293b' : '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: '#0F172A',
              color: '#F8FAFC',
              overflow: 'hidden',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              {/* Fake Browser Top Address Bar */}
              <div style={{
                backgroundColor: '#1E293B',
                padding: '0.6rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #334155',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                </div>
                <div style={{
                  backgroundColor: '#0F172A',
                  padding: '0.25rem 1rem',
                  borderRadius: '99px',
                  color: '#94A3B8',
                  fontSize: '0.725rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  width: previewDevice === 'mobile' ? '180px' : '320px',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ color: '#10b981' }}>🔒</span>
                  <span>{settings.domain_url || `https://${selectedFlavorId}.desktopalie.my.id`}</span>
                </div>
                <span style={{ color: primaryColor, fontWeight: '700', fontSize: '0.7rem' }}>
                  LIVE PREVIEW
                </span>
              </div>

              {/* MOCK LANDING PAGE HERO CONTENT */}
              <div style={{ padding: previewDevice === 'mobile' ? '2.5rem 1.5rem' : '4.5rem 3rem', textAlign: 'center', position: 'relative' }}>
                
                {/* Glow Background Effect */}
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '350px',
                  height: '350px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${primaryColor}35 0%, rgba(15, 23, 42, 0) 70%)`,
                  pointerEvents: 'none'
                }} />

                {/* Badge Label */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '99px',
                  backgroundColor: `${primaryColor}20`,
                  border: `1px solid ${primaryColor}50`,
                  color: primaryColor,
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: primaryColor }} />
                  <span>{settings.hero_badge || selectedFlavorConfig.name}</span>
                </div>

                {/* Main Hero Headline */}
                <h1 style={{
                  fontSize: previewDevice === 'mobile' ? '1.85rem' : '3rem',
                  fontWeight: '800',
                  lineHeight: '1.15',
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                  color: '#FFFFFF'
                }}>
                  {settings.hero_title || selectedFlavorConfig.name}
                </h1>

                {/* Main Hero Subtitle */}
                <p style={{
                  fontSize: previewDevice === 'mobile' ? '0.9rem' : '1.05rem',
                  lineHeight: '1.6',
                  color: '#94A3B8',
                  maxWidth: '650px',
                  margin: '0 auto 2rem auto'
                }}>
                  {settings.hero_description || selectedFlavorConfig.description}
                </p>

                {/* CTA Buttons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.85rem',
                  flexWrap: 'wrap',
                  marginBottom: '2.5rem'
                }}>
                  <button
                    type="button"
                    style={{
                      backgroundColor: primaryColor,
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '99px',
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    {settings.hero_cta_text || 'Explore Platform'}
                  </button>

                  <button
                    type="button"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      color: '#F8FAFC',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '99px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    {settings.hero_secondary_cta_text || 'Documentation'}
                  </button>
                </div>

                {/* Note Footnote */}
                {settings.hero_note && (
                  <p style={{ fontSize: '0.775rem', color: '#64748B', fontStyle: 'italic', margin: 0 }}>
                    💡 {settings.hero_note}
                  </p>
                )}

                {/* STATS SECTION MOCKUP */}
                <div style={{
                  marginTop: '3.5rem',
                  paddingTop: '2.5rem',
                  borderTop: '1px solid #1E293B',
                  display: 'grid',
                  gridTemplateColumns: previewDevice === 'mobile' ? '1fr' : 'repeat(3, 1fr)',
                  gap: '1.5rem'
                }}>
                  <div style={{ backgroundColor: '#1E293B', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: primaryColor }}>{settings.stat_1_value || '100+'}</div>
                    <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '0.25rem' }}>{settings.stat_1_label || 'Active Components'}</div>
                  </div>

                  <div style={{ backgroundColor: '#1E293B', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: primaryColor }}>{settings.stat_2_value || '99.9%'}</div>
                    <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '0.25rem' }}>{settings.stat_2_label || 'Reliability Score'}</div>
                  </div>

                  <div style={{ backgroundColor: '#1E293B', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: primaryColor }}>{settings.stat_3_value || '24/7'}</div>
                    <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '0.25rem' }}>{settings.stat_3_label || 'Platform Monitoring'}</div>
                  </div>
                </div>

                {/* ABOUT SECTION MOCKUP */}
                <div style={{ marginTop: '3rem', textAlign: 'left', backgroundColor: '#1E293B', padding: '2rem', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                    {settings.about_title || 'About Platform'}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {settings.about_large_copy}
                  </p>
                  <p style={{ fontSize: '0.825rem', color: '#94A3B8', lineHeight: '1.6' }}>
                    {settings.about_description}
                  </p>
                  <div style={{ marginTop: '1rem', fontSize: '0.775rem', color: primaryColor, fontWeight: '600' }}>
                    📍 {settings.about_location || 'Operating Globally'}
                  </div>
                </div>

                {/* FOOTER CONTACT MOCKUP */}
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#FFFFFF', margin: 0 }}>{settings.contact_title}</h4>
                  <div style={{ fontSize: '0.85rem', color: primaryColor, fontWeight: '600' }}>✉️ {settings.contact_email}</div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: '#94A3B8', fontSize: '1.1rem' }}>
                    {settings.github_url && <FiGithub title="GitHub" />}
                    {settings.linkedin_url && <FiLinkedin title="LinkedIn" />}
                    {settings.instagram_url && <FiInstagram title="Instagram" />}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
