import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught Error in ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('desktopalie_ai_sidebar_collapsed');
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          width: '100vw',
          backgroundColor: '#FAF9FC',
          color: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              margin: '0 auto 1.25rem auto'
            }}>
              ⚠️
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: '#0F172A' }}>
              Terjadi Kendala Memuat Backoffice
            </h2>

            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
              Sistem mendeteksi kendala saat merender komponen. Anda dapat memuat ulang halaman secara aman.
            </p>

            {this.state.error?.message && (
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '0.75rem',
                fontSize: '0.75rem',
                color: '#EF4444',
                fontFamily: 'monospace',
                marginBottom: '1.5rem',
                textAlign: 'left',
                overflowX: 'auto'
              }}>
                {this.state.error.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Muat Ulang Halaman
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#F1F5F9',
                  color: '#0F172A',
                  border: '1px solid #CBD5E1',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Reset & Ke Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
