import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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

export default function App() {
  return (
    <ThemeProvider>
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
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
    </ThemeProvider>
  );
}
