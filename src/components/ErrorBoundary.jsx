import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDev = Boolean(import.meta.env?.DEV);
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{
            maxWidth: '550px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #fecaca',
            padding: '2.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              {this.props.title || "Page failed to load"}
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              An unexpected error occurred while rendering this page. Our application caught the crash to prevent a blank screen.
            </p>

            {isDev && this.state.error && (
              <div style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'left',
                fontSize: '0.8rem',
                color: '#dc2626',
                fontFamily: 'monospace',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                maxHeight: '180px'
              }}>
                <strong>Error details:</strong>
                <div>{this.state.error.toString()}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#1F2421',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <RefreshCw size={16} /> Reload Page
              </button>

              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Home size={16} /> Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
