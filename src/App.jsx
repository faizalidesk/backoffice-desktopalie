import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsManager from './pages/ProjectsManager';
import ExperimentsManager from './pages/ExperimentsManager';
import NotesManager from './pages/NotesManager';
import BookmarksManager from './pages/BookmarksManager';
import ProfileSettings from './pages/ProfileSettings';

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
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: '#FFFFFF',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-sm)'
            }
          }} 
        />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/projects" element={<ProtectedLayout><ProjectsManager /></ProtectedLayout>} />
          <Route path="/experiments" element={<ProtectedLayout><ExperimentsManager /></ProtectedLayout>} />
          <Route path="/notes" element={<ProtectedLayout><NotesManager /></ProtectedLayout>} />
          <Route path="/bookmarks" element={<ProtectedLayout><BookmarksManager /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><ProfileSettings /></ProtectedLayout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
