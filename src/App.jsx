import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { FlavorProvider, useFlavor } from './context/FlavorContext';
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

// MAIN BACKOFFICE PROTECTED LAYOUT (WITH SIDEBAR)
function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

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
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
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
    if (flavorId === 'platform2') return <Navigate to="/beta/login" replace />;
    if (flavorId === 'platform3') return <Navigate to="/gamma/login" replace />;
    if (flavorId === 'platform4') return <Navigate to="/delta/login" replace />;
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="subplatform-portal-wrapper" style={{ minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)' }}>
      {children}
    </div>
  );
}

function DashboardRoute() {
  const { hasSelectedFlavor, flavorId } = useFlavor();
  if (!hasSelectedFlavor) {
    return <Navigate to="/workspaces" replace />;
  }
  
  if (flavorId === 'platform2') return <PlatformBetaPortal />;
  if (flavorId === 'platform3') return <PlatformGammaPortal />;
  if (flavorId === 'platform4') return <PlatformDeltaPortal />;
  
  return <Dashboard />;
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

                  {/* SUB-PLATFORM DEDICATED LOGIN ROUTES */}
                  <Route path="/beta/login" element={<SubPlatformLogin />} />
                  <Route path="/gamma/login" element={<SubPlatformLogin />} />
                  <Route path="/delta/login" element={<SubPlatformLogin />} />
                  <Route path="/platform/:platformName/login" element={<SubPlatformLogin />} />

                  {/* SUB-PLATFORM STANDALONE PORTALS (WITHOUT BACKOFFICE SIDEBAR) */}
                  <Route path="/beta/portal" element={<SubPlatformProtectedLayout><PlatformBetaPortal /></SubPlatformProtectedLayout>} />
                  <Route path="/gamma/portal" element={<SubPlatformProtectedLayout><PlatformGammaPortal /></SubPlatformProtectedLayout>} />
                  <Route path="/delta/portal" element={<SubPlatformProtectedLayout><PlatformDeltaPortal /></SubPlatformProtectedLayout>} />

                  {/* AUTH & MAIN BACKOFFICE ROUTES */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route path="/dashboard" element={<ProtectedLayout><DashboardRoute /></ProtectedLayout>} />
                  <Route path="/workspaces" element={<ProtectedLayout><PlatformWorkspacesManager /></ProtectedLayout>} />
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
