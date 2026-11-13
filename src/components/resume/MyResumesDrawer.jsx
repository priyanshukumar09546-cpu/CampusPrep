// src/components/resume/MyResumesDrawer.jsx
import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Copy,
  Trash2,
  Edit2,
  ExternalLink,
  Plus,
  Search,
  Calendar,
  Award,
  Layers,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import API_URL from '../../config/api';

export default function MyResumesDrawer({
  isOpen,
  onClose,
  resumes = [],
  activeResumeId,
  onSelectResume,
  onStartNewResume,
  onOpenVersions,
  onRefreshList
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  if (!isOpen) return null;

  const filteredResumes = resumes.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (r.title || '').toLowerCase().includes(q) ||
      (r.targetRole || '').toLowerCase().includes(q) ||
      (r.template || '').toLowerCase().includes(q)
    );
  });

  const handleDuplicate = async (e, id) => {
    e.stopPropagation();
    try {
      setActionLoadingId(id);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API_URL}/api/resumes/${id}/duplicate`, {
        method: 'POST',
        headers
      });
      const data = await res.json();
      if (data.success && onRefreshList) {
        await onRefreshList();
      }
    } catch (err) {
      alert('Error duplicating resume.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume permanently from your account?')) return;
    try {
      setActionLoadingId(id);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API_URL}/api/resumes/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (data.success && onRefreshList) {
        await onRefreshList();
      }
    } catch (err) {
      alert('Error deleting resume.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStartRename = (e, r) => {
    e.stopPropagation();
    setRenamingId(r.id || r._id);
    setNewTitle(r.title || 'My Resume');
  };

  const handleSaveRename = async (e, id) => {
    e.stopPropagation();
    if (!newTitle.trim()) return;
    try {
      setActionLoadingId(id);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      await fetch(`${API_URL}/api/resumes/${id}/rename`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: newTitle.trim() })
      });
      setRenamingId(null);
      if (onRefreshList) await onRefreshList();
    } catch (err) {
      alert('Error updating title.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDownloadDocx = (e, id, title) => {
    e.stopPropagation();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    window.open(`${API_URL}/api/resumes/${id}/download-docx${token ? `?token=${token}` : ''}`, '_blank');
  };

  const handleDownloadPdf = (e, id, title) => {
    e.stopPropagation();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    window.open(`${API_URL}/api/resumes/${id}/download-pdf${token ? `?token=${token}` : ''}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(12, 10, 11, 0.75)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      zIndex: 10000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '560px',
        height: '100vh',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.25s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1.5px solid #EDE5D6',
          backgroundColor: '#FAF7F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#C88D2D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Cloud Resume Manager
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1F2421', margin: '0.15rem 0 0 0' }}>
              My Saved Resumes ({resumes.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8DFCF',
              borderRadius: '10px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#57534E',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #F0E8DC',
          display: 'flex',
          gap: '0.75rem',
          flexShrink: 0
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
            <input
              type="text"
              placeholder="Search resumes by title or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.25rem',
                borderRadius: '10px',
                border: '1.5px solid #E8E2D5',
                fontSize: '0.84rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onStartNewResume) onStartNewResume();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#781416',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '0.55rem 0.95rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus size={15} />
            <span>New Resume</span>
          </button>
        </div>

        {/* Resume Cards List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredResumes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              color: '#78716C'
            }}>
              <FileText size={42} style={{ color: '#D6CBB8', margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.4rem 0' }}>
                {searchQuery ? 'No matching resumes found' : 'No resumes created yet'}
              </h3>
              <p style={{ fontSize: '0.84rem', maxWidth: '340px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
                {searchQuery ? 'Try clearing your search query.' : 'Build your first ATS-compatible resume and save it permanently to your account.'}
              </p>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onStartNewResume) onStartNewResume();
                  }}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Start Building Your First Resume
                </button>
              )}
            </div>
          ) : (
            filteredResumes.map(r => {
              const rId = r.id || r._id;
              const isActive = activeResumeId === rId;
              const atsScore = r.atsScore || (r.atsAnalysis ? r.atsAnalysis.overallScore : null);
              const scoreColor = atsScore >= 80 ? '#059669' : atsScore >= 60 ? '#C88D2D' : '#DC2626';
              const scoreBg = atsScore >= 80 ? '#ECFDF5' : atsScore >= 60 ? '#FEF9EE' : '#FEF2F2';

              const updatedDate = r.updatedAt ? new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

              return (
                <div
                  key={rId}
                  onClick={() => {
                    onSelectResume(r);
                    onClose();
                  }}
                  style={{
                    backgroundColor: isActive ? '#FAF5ED' : '#FFFFFF',
                    border: isActive ? '2px solid #781416' : '1.5px solid #E8E2D5',
                    borderRadius: '16px',
                    padding: '1.1rem 1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(120,20,22,0.08)' : '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.borderColor = '#C88D2D';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.borderColor = '#E8E2D5';
                  }}
                >
                  {/* Top Row: Title & Active Badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {renamingId === rId ? (
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            style={{
                              padding: '0.3rem 0.5rem',
                              fontSize: '0.88rem',
                              fontWeight: 800,
                              border: '1.5px solid #781416',
                              borderRadius: '6px',
                              outline: 'none',
                              flex: 1
                            }}
                          />
                          <button
                            type="button"
                            onClick={e => handleSaveRename(e, rId)}
                            style={{
                              backgroundColor: '#781416',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.3rem 0.65rem',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <h4 style={{
                            fontSize: '1rem',
                            fontWeight: 800,
                            color: '#1F2421',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {r.title || 'My Resume'}
                          </h4>
                          <button
                            type="button"
                            onClick={e => handleStartRename(e, r)}
                            title="Rename"
                            style={{ background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer', padding: 0 }}
                          >
                            <Edit2 size={13} />
                          </button>
                        </div>
                      )}

                      <div style={{ fontSize: '0.76rem', color: '#78716C', marginTop: '0.2rem' }}>
                        {r.targetRole || (r.personalDetails?.targetRole) || (r.resumeData?.personal?.targetRole) || 'General Tech Profile'}
                      </div>
                    </div>

                    {/* Right Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                      {atsScore !== null && atsScore !== undefined && (
                        <span style={{
                          backgroundColor: scoreBg,
                          color: scoreColor,
                          border: `1px solid ${scoreColor}`,
                          borderRadius: '9999px',
                          padding: '0.15rem 0.55rem',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          ATS {atsScore}/100
                        </span>
                      )}

                      {isActive && (
                        <span style={{
                          backgroundColor: '#781416',
                          color: '#FFFFFF',
                          borderRadius: '9999px',
                          padding: '0.15rem 0.55rem',
                          fontSize: '0.70rem',
                          fontWeight: 800
                        }}>
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.72rem',
                    color: '#78716C',
                    marginTop: '0.4rem',
                    paddingTop: '0.4rem',
                    borderTop: '1px solid #F5F0E8',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> Last modified: {updatedDate}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Layers size={12} /> Template: {r.template || 'Classic Tech'}
                    </span>
                    {r.versions && r.versions.length > 0 && (
                      <>
                        <span>•</span>
                        <span style={{ color: '#8A5D00', fontWeight: 700 }}>
                          v{r.versions.length}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.75rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid #F5F0E8'
                  }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={e => handleDownloadPdf(e, rId, r.title)}
                        title="Download PDF"
                        style={{
                          backgroundColor: '#FAF5ED',
                          border: '1px solid #E8DFCF',
                          borderRadius: '8px',
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#781416',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={12} /> PDF
                      </button>

                      <button
                        type="button"
                        onClick={e => handleDownloadDocx(e, rId, r.title)}
                        title="Download Word (.docx)"
                        style={{
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #DBEAFE',
                          borderRadius: '8px',
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#2563EB',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={12} /> Word
                      </button>

                      {onOpenVersions && (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onOpenVersions(r);
                          }}
                          title="View Version History"
                          style={{
                            backgroundColor: '#F5F5F4',
                            border: '1px solid #E7E5E4',
                            borderRadius: '8px',
                            padding: '0.3rem 0.55rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#57534E',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          <History size={12} /> History
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={e => handleDuplicate(e, rId)}
                        title="Duplicate Resume"
                        disabled={actionLoadingId === rId}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E7E5E4',
                          borderRadius: '8px',
                          padding: '0.3rem 0.5rem',
                          color: '#78716C',
                          cursor: 'pointer'
                        }}
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={e => handleDelete(e, rId)}
                        title="Delete Resume"
                        disabled={actionLoadingId === rId}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #FEE2E2',
                          borderRadius: '8px',
                          padding: '0.3rem 0.5rem',
                          color: '#DC2626',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
