import React from 'react';
import { AlertTriangle, RefreshCw, Home, RotateCcw } from 'lucide-react';

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
    console.error('[ProfessorVirus ErrorBoundary] Caught render exception:', error, errorInfo);

    // Auto-recover from stale chunk references when a new deployment is published
    const msg = error?.message || String(error || '');
    const isChunkLoadError = 
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Loading chunk') ||
      msg.includes('ChunkLoadError') ||
      msg.includes('Importing a module script failed');

    if (isChunkLoadError && typeof window !== 'undefined') {
      const reloadKey = 'pv_eb_chunk_reload_' + window.location.pathname;
      const last = window.sessionStorage.getItem(reloadKey);
      const now = Date.now();
      if (!last || now - parseInt(last, 10) > 12000) {
        window.sessionStorage.setItem(reloadKey, String(now));
        console.warn('[ErrorBoundary] Auto-reloading page to fetch latest deployment bundle...');
        window.location.reload();
      }
    }
  }

  componentDidUpdate(prevProps) {
    // Automatically reset error boundary state when route / resetKey changes
    if (this.state.hasError) {
      if (
        (this.props.resetKey !== undefined && prevProps.resetKey !== this.props.resetKey) ||
        (this.props.title !== undefined && prevProps.title !== this.props.title)
      ) {
        this.setState({ hasError: false, error: null, errorInfo: null });
      }
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof this.props.onRetry === 'function') {
      try {
        this.props.onRetry();
      } catch (e) {
        console.warn('Retry callback error:', e);
      }
    }
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof this.props.onNavigate === 'function') {
      this.props.onNavigate('home');
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      const isDev = Boolean(typeof import.meta !== 'undefined' && import.meta.env?.DEV);

      const themeStyles = isDark ? {
        bgColor: '#050505',
        cardBg: '#0D0D0D',
        borderColor: '#27272a',
        titleColor: '#FFFFFF',
        textColor: '#A1A1AA',
        iconBg: '#1f1315',
        iconColor: '#f87171',
        detailsBg: '#111111',
        detailsBorder: '#27272a',
        primaryBtnBg: '#FFB800',
        primaryBtnColor: '#050505',
        secBtnBg: '#18181b',
        secBtnColor: '#E4E4E7',
        secBtnBorder: '#27272a'
      } : {
        bgColor: '#FAF7F2',
        cardBg: '#FFFFFF',
        borderColor: '#FEE2E2',
        titleColor: '#1F2421',
        textColor: '#64748B',
        iconBg: '#FEF2F2',
        iconColor: '#DC2626',
        detailsBg: '#F8FAFC',
        detailsBorder: '#E2E8F0',
        primaryBtnBg: '#1F2421',
        primaryBtnColor: '#FFFFFF',
        secBtnBg: '#FFFFFF',
        secBtnColor: '#334155',
        secBtnBorder: '#CBD5E1'
      };

      return (
        <div style={{
          minHeight: '70vh',
          backgroundColor: themeStyles.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: themeStyles.cardBg,
            borderRadius: '24px',
            border: `1.5px solid ${themeStyles.borderColor}`,
            padding: '2.5rem 2rem',
            boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' : '0 20px 40px rgba(0,0,0,0.06)',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            {/* Warning Icon Badge */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              backgroundColor: themeStyles.iconBg,
              color: themeStyles.iconColor,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
            }}>
              <AlertTriangle size={32} strokeWidth={2.2} />
            </div>

            <h2 style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: themeStyles.titleColor,
              margin: '0 0 0.5rem 0',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.01em'
            }}>
              {this.props.title || 'Page failed to load'}
            </h2>

            <p style={{
              fontSize: '0.92rem',
              color: themeStyles.textColor,
              lineHeight: 1.55,
              margin: '0 0 1.5rem 0'
            }}>
              An unexpected error occurred while rendering this view. Our application caught the issue to keep the rest of your session active.
            </p>

            {this.state.error && (
              <details style={{
                backgroundColor: themeStyles.detailsBg,
                border: `1px solid ${themeStyles.detailsBorder}`,
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.78rem',
                color: isDark ? '#f87171' : '#b91c1c',
                fontFamily: 'monospace',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                maxHeight: '180px'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700, outline: 'none' }}>
                  Technical diagnostics (Click to expand)
                </summary>
                <div style={{ marginTop: '0.5rem', wordBreak: 'break-all' }}>
                  {this.state.error.toString()}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <pre style={{
                    fontSize: '0.7rem',
                    whiteSpace: 'pre-wrap',
                    marginTop: '0.5rem',
                    color: isDark ? '#71717a' : '#64748b',
                    margin: '0.5rem 0 0 0'
                  }}>
                    {this.state.errorInfo.componentStack.slice(0, 500)}
                  </pre>
                )}
              </details>
            )}

            {/* Action Buttons: Retry, Home, Reload */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleRetry}
                style={{
                  padding: '0.7rem 1.35rem',
                  borderRadius: '12px',
                  backgroundColor: themeStyles.primaryBtnBg,
                  color: themeStyles.primaryBtnColor,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.15s ease'
                }}
              >
                <RotateCcw size={16} /> Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '0.7rem 1.35rem',
                  borderRadius: '12px',
                  backgroundColor: themeStyles.secBtnBg,
                  color: themeStyles.secBtnColor,
                  border: `1px solid ${themeStyles.secBtnBorder}`,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Home size={16} /> Go to Homepage
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  padding: '0.7rem 1.1rem',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  color: themeStyles.textColor,
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textDecoration: 'underline'
                }}
              >
                <RefreshCw size={14} /> Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
