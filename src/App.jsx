import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { FlavorProvider, useFlavor } from './context/FlavorContext';
import { backofficeService } from './services/backofficeService';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import DesktopOnlyGuard from './components/DesktopOnlyGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectsManager from './pages/ProjectsManager';
import ExperimentsManager from './pages/ExperimentsManager';
import NotesManager from './pages/NotesManager';
import BookmarksManager from './pages/BookmarksManager';
import ProfileSettings from './pages/ProfileSettings';
import MaintenanceManager from './pages/MaintenanceManager';
import LandingPageManager from './pages/LandingPageManager';
import TodoListManager from './pages/TodoListManager';
import DocumentationManager from './pages/DocumentationManager';

import PublicPlatformLanding from './pages/PublicPlatformLanding';
import PlatformWorkspacesManager from './pages/PlatformWorkspacesManager';
import SubPlatformLogin from './pages/SubPlatformLogin';
import PlatformBetaPortal from './pages/PlatformBetaPortal';
import PlatformGammaPortal from './pages/PlatformGammaPortal';
import PlatformDeltaPortal from './pages/PlatformDeltaPortal';
import MembershipManager from './pages/MembershipManager';
import NotificationsManager from './pages/NotificationsManager';
import TransactionsManager from './pages/TransactionsManager';

import AgenticAiDrawer from './components/AgenticAiDrawer';

// HOOK TO CHECK PLATFORM MAINTENANCE STATUS
function usePlatformMaintenance(targetFlavorId) {
  const [isMaintenance, setIsMaintenance] = useState(() => {
    try {
      const cached = localStorage.getItem(`desktopalie_maintenance_settings_${targetFlavorId}`) ||
                     localStorage.getItem(`desktopalie_maint_${targetFlavorId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        return Boolean(
          parsed && (
            parsed.is_enabled === true ||
            parsed.is_enabled === 'true' ||
            parsed.is_enabled === 1 ||
            parsed.is_enabled === '1'
          )
        );
      }
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    let isMounted = true;
    async function checkMaint() {
      try {
        const maintData = await backofficeService.getMaintenanceSettings(targetFlavorId);
        if (isMounted) {
          const isEnabled = Boolean(
            maintData && (
              maintData.is_enabled === true ||
              maintData.is_enabled === 'true' ||
              maintData.is_enabled === 1 ||
              maintData.is_enabled === '1'
            )
          );
          setIsMaintenance(isEnabled);
          if (isEnabled) {
            localStorage.setItem(`desktopalie_maintenance_settings_${targetFlavorId}`, JSON.stringify(maintData));
            localStorage.setItem(`desktopalie_maint_${targetFlavorId}`, JSON.stringify(maintData));
          } else {
            localStorage.removeItem(`desktopalie_maintenance_settings_${targetFlavorId}`);
            localStorage.removeItem(`desktopalie_maint_${targetFlavorId}`);
          }
        }
      } catch (e) {}
    }

    checkMaint();

    const handleStorage = (e) => {
      if (!e || !e.key || e.key.includes('maintenance') || e.key.includes('maint')) {
        checkMaint();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, [targetFlavorId]);

  return isMaintenance;
}

// MAIN BACKOFFICE PROTECTED LAYOUT (WITH SIDEBAR)
function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  
  // Track AI sidebar collapsed state for responsive reflow (default: true / closed by default)
  const [isAiCollapsed, setIsAiCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('desktopalie_ai_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const handleSidebarChange = (e) => {
      if (e && e.detail && typeof e.detail.isCollapsed === 'boolean') {
        setIsAiCollapsed(e.detail.isCollapsed);
      } else {
        const saved = sessionStorage.getItem('desktopalie_ai_sidebar_collapsed');
        setIsAiCollapsed(saved !== null ? JSON.parse(saved) : true);
      }
    };

    window.addEventListener('ai-sidebar-change', handleSidebarChange);
    return () => window.removeEventListener('ai-sidebar-change', handleSidebarChange);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-muted)'
      }}>
        Memuat Backoffice Workspace...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div 
      className="app-container"
      style={{
        '--ai-sidebar-width': isAiCollapsed ? '0px' : '400px'
      }}
    >
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
      <AgenticAiDrawer />
    </div>
  );
}

// SUB-PLATFORM STANDALONE PORTAL LAYOUT (WITHOUT BACKOFFICE SIDEBAR)
function SubPlatformProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const { flavorId } = useFlavor();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-muted)'
      }}>
        Memuat Portal Platform...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="subplatform-portal-wrapper" style={{ minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)' }}>
      {children}
    </div>
  );
}

function DashboardRoute() {
  const { hasSelectedFlavor } = useFlavor();
  if (!hasSelectedFlavor) {
    return <Navigate to="/workspaces" replace />;
  }
  return <Dashboard />;
}

// SMART LOGIN ROUTE FOR SUBDOMAINS AND BACKOFFICE (WITH STRICT MAINTENANCE GUARD)
function LoginRoute({ targetFlavor = null }) {
  const { flavorId } = useFlavor();
  const currentFlavor = targetFlavor || flavorId;
  const isMaintenance = usePlatformMaintenance(currentFlavor);
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isBackofficeDomain = hostname.startsWith('back.') || hostname.startsWith('backoffice.') || hostname === 'back.desktopalie.my.id';

  // STRICT MAINTENANCE LOCK: Block login on public platforms when maintenance is enabled
  if (!isBackofficeDomain && isMaintenance) {
    return <PublicPlatformLanding />;
  }

  const isSubplatformSubdomain = hostname.startsWith('beta.') || hostname.startsWith('gamma.') || hostname.startsWith('delta.');

  if (isSubplatformSubdomain || targetFlavor) {
    return <SubPlatformLogin />;
  }

  return <Login />;
}

// SMART PORTAL ROUTE FOR SUBDOMAINS (WITH STRICT MAINTENANCE GUARD)
function PortalRoute() {
  const { flavorId } = useFlavor();
  const isMaintenance = usePlatformMaintenance(flavorId);
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isBackofficeDomain = hostname.startsWith('back.') || hostname.startsWith('backoffice.') || hostname === 'back.desktopalie.my.id';

  // STRICT MAINTENANCE LOCK: Block portal on public platforms when maintenance is enabled
  if (!isBackofficeDomain && isMaintenance) {
    return <PublicPlatformLanding />;
  }

  if (flavorId === 'platform2') return <SubPlatformProtectedLayout><PlatformBetaPortal /></SubPlatformProtectedLayout>;
  if (flavorId === 'platform3') return <SubPlatformProtectedLayout><PlatformGammaPortal /></SubPlatformProtectedLayout>;
  if (flavorId === 'platform4') return <SubPlatformProtectedLayout><PlatformDeltaPortal /></SubPlatformProtectedLayout>;
  return <Navigate to="/dashboard" replace />;
}

function RootRoute() {
  const { user, loading } = useAuth();
  const { flavorId } = useFlavor();
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';

  const isBackofficeDomain = hostname.startsWith('back.') || hostname.startsWith('backoffice.') || hostname === 'back.desktopalie.my.id';

  if (isBackofficeDomain) {
    if (loading) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)',
          color: 'var(--text-muted)'
        }}>
          Memuat Backoffice Workspace...
        </div>
      );
    }
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <ProtectedLayout><DashboardRoute /></ProtectedLayout>;
  }

  return <PublicPlatformLanding />;
}

export default function App() {
  return (
    <FlavorProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <DesktopOnlyGuard>
              <Router>
                <Toaster 
                  position="top-right" 
                  toastOptions={{
                    style: {
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)'
                    }
                  }} 
                />
                <Routes>
                  {/* ROOT ROUTE */}
                  <Route path="/" element={<RootRoute />} />

                  {/* SMART CLEAN ROUTES FOR ALL PLATFORMS */}
                  <Route path="/login" element={<LoginRoute />} />
                  <Route path="/portal" element={<PortalRoute />} />

                  {/* SUB-PATH ALIAS ROUTES FOR COMPATIBILITY (WITH STRICT MAINTENANCE GUARD) */}
                  <Route path="/beta/login" element={<LoginRoute targetFlavor="platform2" />} />
                  <Route path="/gamma/login" element={<LoginRoute targetFlavor="platform3" />} />
                  <Route path="/delta/login" element={<LoginRoute targetFlavor="platform4" />} />
                  <Route path="/platform/:platformName/login" element={<LoginRoute />} />

                  <Route path="/beta/portal" element={<PortalRoute />} />
                  <Route path="/gamma/portal" element={<PortalRoute />} />
                  <Route path="/delta/portal" element={<PortalRoute />} />

                  {/* AUTH & MAIN BACKOFFICE ROUTES */}
                  <Route path="/register" element={<Register />} />

                  <Route path="/dashboard" element={<ProtectedLayout><DashboardRoute /></ProtectedLayout>} />
                  <Route path="/workspaces" element={<ProtectedLayout><PlatformWorkspacesManager /></ProtectedLayout>} />
                  <Route path="/notifications" element={<ProtectedLayout><NotificationsManager /></ProtectedLayout>} />
                  <Route path="/members" element={<ProtectedLayout><MembershipManager /></ProtectedLayout>} />
                  <Route path="/transactions" element={<ProtectedLayout><TransactionsManager /></ProtectedLayout>} />
                  <Route path="/todos" element={<ProtectedLayout><TodoListManager /></ProtectedLayout>} />
                  <Route path="/documentation" element={<ProtectedLayout><DocumentationManager /></ProtectedLayout>} />
                  <Route path="/landing-manager" element={<ProtectedLayout><LandingPageManager /></ProtectedLayout>} />
                  <Route path="/projects" element={<ProtectedLayout><ProjectsManager /></ProtectedLayout>} />
                  <Route path="/experiments" element={<ProtectedLayout><ExperimentsManager /></ProtectedLayout>} />
                  <Route path="/notes" element={<ProtectedLayout><NotesManager /></ProtectedLayout>} />
                  <Route path="/bookmarks" element={<ProtectedLayout><BookmarksManager /></ProtectedLayout>} />
                  <Route path="/maintenance" element={<ProtectedLayout><MaintenanceManager /></ProtectedLayout>} />
                  <Route path="/profile" element={<ProtectedLayout><ProfileSettings /></ProtectedLayout>} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </DesktopOnlyGuard>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </FlavorProvider>
  );
}
