import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  GraduationCap,
  Building2,
  Download,
  ExternalLink,
  Award,
  Search,
  ArrowRight
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';

export default function PrmaVerifyOfferPage({ navigateToTab, onNavigate }) {
  const [offerIdInput, setOfferIdInput] = useState('');
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navFn = navigateToTab || onNavigate;

  // Extract offerId from URL path if present: /prma-tech/verify-offer/PRMA-INT-...
  const getOfferIdFromPath = () => {
    if (typeof window === 'undefined') return '';
    const path = window.location.pathname;
    const parts = path.split('/verify-offer/');
    if (parts[1]) {
      return decodeURIComponent(parts[1].split('/')[0].split('?')[0]);
    }
    return '';
  };

  const fetchVerification = async (idToVerify) => {
    if (!idToVerify) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/prma/verify-offer/${encodeURIComponent(idToVerify)}`);
      const data = await res.json();

      if (res.ok && data.success && data.offer) {
        setRecord(data.offer);
      } else {
        setError(data.message || 'No official offer letter found matching this Offer ID.');
        setRecord(null);
      }
    } catch (err) {
      setError('Unable to connect to the PRMA Tech credential registry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fromPath = getOfferIdFromPath();
    if (fromPath) {
      setOfferIdInput(fromPath);
      fetchVerification(fromPath);
    } else {
      setLoading(false);
    }
  }, []);

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!offerIdInput.trim()) return;
    const cleanId = offerIdInput.trim();
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(null, '', `/prma-tech/verify-offer/${encodeURIComponent(cleanId)}`);
    }
    fetchVerification(cleanId);
  };

  const handleDownloadPdf = () => {
    if (!record?.offerId) return;
    window.open(`/api/prma/admin/applications/${encodeURIComponent(record.applicationId || record.offerId)}/offer-letter`, '_blank');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <PrmaNavbar activePage="verify" navigateToTab={navFn} onNavigate={navFn} />

      <main style={{ flex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#0866F5',
              borderRadius: '9999px',
              padding: '0.4rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}
          >
            <ShieldCheck size={18} />
            <span>PRMA Tech™ Official Credential Verification System</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 900,
              color: '#0B2356',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem'
            }}
          >
            Verify Internship Offer Letter
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
            Instant digital verification for official PRMA Tech student internship offer letters, assigned cohort dates, and authorized signatory seals.
          </p>
        </div>

        {/* Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            marginBottom: '2.5rem'
          }}
        >
          <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Enter Offer ID (e.g. PRMA/INT/A1/93084)..."
                value={offerIdInput}
                onChange={(e) => setOfferIdInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.85rem 1.75rem',
                borderRadius: '12px',
                backgroundColor: '#0866F5',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(8, 102, 245, 0.3)'
              }}
            >
              <Search size={16} />
              <span>{loading ? 'Verifying...' : 'Verify Offer'}</span>
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Querying Registry...</div>
          </div>
        )}

        {/* Error / Not Found */}
        {!loading && error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FECACA',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.05)'
            }}
          >
            <XCircle size={44} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.5rem' }}>
              Verification Record Not Found
            </h3>
            <p style={{ color: '#7F1D1D', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto' }}>
              {error} Please check the Offer ID on your document or contact support@prmatech.com.
            </p>
          </div>
        )}

        {/* Verification Success Dossier */}
        {!loading && record && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '2px solid #86EFAC',
              padding: '2.5rem',
              boxShadow: '0 10px 30px rgba(22, 163, 74, 0.08)',
              position: 'relative'
            }}
          >
            {/* Top Verified Ribbon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid #E2E8F0',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#15803D'
                  }}
                >
                  <CheckCircle2 size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Authentic & Verified
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A' }}>
                    Official Internship Offer Letter
                  </div>
                </div>
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: '9999px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}
              >
                STATUS: {record.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>

            {/* Dossier Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}
              className="prma-verify-grid"
            >
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Student Full Name
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                  {record.studentName}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
                  {record.college || 'Engineering Student'}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Internship Track & Domain
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0866F5' }}>
                  {record.domainTitle}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Mode: Remote / Online (100% Free)
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Official Offer ID
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B2356', fontFamily: 'monospace' }}>
                  {record.offerId}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Issued on: {record.issueDate || '10-11-2026'}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Program Timeline
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                  Duration: Exactly 1 Month
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Commencing: <strong>{record.joiningDate}</strong> &bull; Concluding: <strong>{record.completionDate || '1 Month'}</strong>
                </div>
              </div>
            </div>

            {/* Issuing Authority & Seals Information */}
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase' }}>
                  Authorized Signatory
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0B2356' }}>
                  Rahul Verma — Co-Founder & Chief Operating Officer
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  PRMA Tech &bull; Knowledge Park, Greater Noida, UP – 201310 &bull; ISO 9001:2015 & MSME Registered
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                style={{
                  padding: '0.75rem 1.45rem',
                  borderRadius: '12px',
                  backgroundColor: '#0866F5',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(8, 102, 245, 0.25)'
                }}
              >
                <Download size={16} />
                <span>Download Offer Letter</span>
              </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748B' }}>
              Official PRMA Tech digital certification hash verified against centralized database records.
            </div>
          </div>
        )}
      </main>

      <PrmaFooter navigateToTab={navFn} onNavigate={navFn} />

      <style>{`
        @media (max-width: 640px) {
          .prma-verify-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
