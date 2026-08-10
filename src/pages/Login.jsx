import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiCommand, FiLock, FiMail, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      toast.error('Silakan isi email dan kata sandi');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Berhasil masuk ke Backoffice!');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.message || err.error_description || 'Gagal login. Periksa kembali email & kata sandi Anda.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
        top: '20%',
        left: '30%',
        pointerEvents: 'none'
      }} />

      <div className="card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
          }}>
            <FiCommand />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Backoffice Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Masuk ke panel admin Desktopalie Workspace
          </p>
        </div>

        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#FB7185',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.625rem'
          }}>
            <FiAlertCircle style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Gagal Login:</strong>
              <div style={{ marginTop: '0.15rem' }}>{errorMessage}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Admin</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{
              width: '100%',
              justify: 'center',
              padding: '0.75rem',
              fontSize: '0.95rem'
            }}
          >
            {submitting ? 'Memproses...' : (
              <>
                <span>Masuk ke Backoffice</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Belum punya akun?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
