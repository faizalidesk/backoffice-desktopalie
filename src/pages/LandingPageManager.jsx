import { useEffect, useState } from 'react';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';
import { FiLayout, FiSave, FiInfo, FiMail, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import Header from '../components/Header';

export default function LandingPageManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const [settings, setSettings] = useState({
    hero_badge: 'Independent designer & developer',
    hero_title: 'Ideas, crafted into digital experiences.',
    hero_description: 'Desktopalie is my personal space for projects, experiments, and digital creations—documenting my journey through web development, UI/UX design, and modern technology.',
    hero_cta_text: 'Explore my work',
    hero_secondary_cta_text: 'More about me',
    hero_note: 'Currently exploring creative interfaces, thoughtful motion, and useful AI.',
    about_title: 'I build to learn, and share what I discover.',
    about_large_copy: 'I am Ali, a designer and developer interested in the space between technology and human experience.',
    about_description: 'Desktopalie is where I collect the projects, lessons, and experiments that shape my creative journey. I care about simple ideas, precise details, and digital work with a clear reason to exist.',
    about_location: 'Based in Indonesia • Working worldwide',
    stat_1_value: '4+',
    stat_1_label: 'Years exploring the web',
    stat_2_value: '20+',
    stat_2_label: 'Projects & experiments',
    stat_3_value: '∞',
    stat_3_label: 'Ideas still in progress',
    contact_title: "Let's make something worth remembering.",
    contact_email: 'hello@desktopalie.my.id',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getLandingPageSettings();
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
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
      await backofficeService.updateLandingPageSettings(settings);
      toast.success('Landing Page content saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save Landing Page content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title="Landing Page Content Manager" />
      <div className="page-body">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Landing Page Content Manager</h1>
            <p className="page-subtitle">Manage text, headlines, hero copy, about section, and contact links on the main website.</p>
          </div>
        </div>

        <div style={{ maxWidth: '850px' }}>
          {/* Navigation Tabs */}
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
              <p style={{ color: 'var(--text-muted)' }}>Loading landing page content...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* TAB 1: HERO SECTION */}
                {activeTab === 'hero' && (
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiLayout style={{ color: 'var(--primary)' }} /> Hero Section Settings (Home)
                    </h3>

                    <div className="form-group">
                      <label className="form-label">Status Badge Label</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Independent designer & developer"
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
                        placeholder="Ideas, crafted into digital experiences."
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
                        placeholder="Desktopalie is my personal space for projects..."
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
                        <label className="form-label">Secondary Button Text (Secondary CTA)</label>
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
                      <label className="form-label">Short Note (Hero Status Note)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Currently exploring creative interfaces, thoughtful motion, and useful AI."
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
                      <FiInfo style={{ color: 'var(--primary)' }} /> About Section & Stats Settings
                    </h3>

                    <div className="form-group">
                      <label className="form-label">About Section Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="I build to learn, and share what I discover."
                        value={settings.about_title}
                        onChange={(e) => setSettings(prev => ({ ...prev, about_title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Opening Paragraph (Large Copy)</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="I am Ali, a designer and developer..."
                        value={settings.about_large_copy}
                        onChange={(e) => setSettings(prev => ({ ...prev, about_large_copy: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Full About Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Desktopalie is where I collect the projects..."
                        value={settings.about_description}
                        onChange={(e) => setSettings(prev => ({ ...prev, about_description: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location & Work Radius Text</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Based in Indonesia • Working worldwide"
                        value={settings.about_location}
                        onChange={(e) => setSettings(prev => ({ ...prev, about_location: e.target.value }))}
                      />
                    </div>

                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Achievement Statistics (Stats Counter)</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Stat 1 Value (e.g. 4+)"
                          value={settings.stat_1_value}
                          onChange={(e) => setSettings(prev => ({ ...prev, stat_1_value: e.target.value }))}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Stat 1 Label (e.g. Years exploring the web)"
                          value={settings.stat_1_label}
                          onChange={(e) => setSettings(prev => ({ ...prev, stat_1_label: e.target.value }))}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Stat 2 Value (e.g. 20+)"
                          value={settings.stat_2_value}
                          onChange={(e) => setSettings(prev => ({ ...prev, stat_2_value: e.target.value }))}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Stat 2 Label (e.g. Projects & experiments)"
                          value={settings.stat_2_label}
                          onChange={(e) => setSettings(prev => ({ ...prev, stat_2_label: e.target.value }))}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Stat 3 Value (e.g. ∞)"
                          value={settings.stat_3_value}
                          onChange={(e) => setSettings(prev => ({ ...prev, stat_3_value: e.target.value }))}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Stat 3 Label (e.g. Ideas still in progress)"
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
                      <FiMail style={{ color: 'var(--primary)' }} /> Contact & Social Media Links Settings
                    </h3>

                    <div className="form-group">
                      <label className="form-label">Contact Title (Contact Headline)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Let's make something worth remembering."
                        value={settings.contact_title}
                        onChange={(e) => setSettings(prev => ({ ...prev, contact_title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Public Contact Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="hello@desktopalie.my.id"
                        value={settings.contact_email}
                        onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                        required
                      />
                    </div>

                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Footer Social Media Links</h4>

                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FiGithub /> GitHub Profile URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://github.com/username"
                          value={settings.github_url}
                          onChange={(e) => setSettings(prev => ({ ...prev, github_url: e.target.value }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FiLinkedin /> LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://linkedin.com/in/username"
                          value={settings.linkedin_url}
                          onChange={(e) => setSettings(prev => ({ ...prev, linkedin_url: e.target.value }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FiInstagram /> Instagram Profile URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://instagram.com/username"
                          value={settings.instagram_url}
                          onChange={(e) => setSettings(prev => ({ ...prev, instagram_url: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    <FiSave />
                    <span>{saving ? 'Saving...' : 'Save Landing Page Content'}</span>
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
