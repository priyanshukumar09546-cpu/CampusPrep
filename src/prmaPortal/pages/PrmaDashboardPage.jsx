import React, { useState } from 'react';
import {
  User,
  Package,
  Award,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  ExternalLink,
  Download,
  MessageCircle,
  FileText,
  Video,
  Github,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaDashboardPage({ navigateToTab }) {
  const {
    currentUser,
    selectedDomain,
    selectedDuration,
    selectedBatch,
    studentDetails,
    applicationId,
    calculateTotals
  } = usePrmaApplication();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'delivery' | 'projects' | 'certificate' | 'support'

  const actualAppId = applicationId || 'PRMA20269412';
  const candidateName = currentUser?.name || studentDetails.fullName || 'Priyanshu Kumar';
  const candidateEmail = currentUser?.email || studentDetails.email || 'priyanshu@gmail.com';
  const { goodiesList } = calculateTotals();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A'
      }}
    >
      <PrmaNavbar navigateToTab={navigateToTab} />

      {/* Hero Welcome Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '2.5rem 1.5rem',
          borderBottom: '1px solid #334155'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#0866F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(8, 102, 245, 0.4)'
              }}
            >
              {candidateName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px'
                  }}
                >
                  ACTIVE INTERN
                </span>
                <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600 }}>
                  ID: {actualAppId}
                </span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, marginBottom: '0.2rem' }}>
                Welcome back, {candidateName}!
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>
                {selectedDomain.title} • {selectedDuration.name} (Batch: {selectedBatch.date})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('certificate')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: '#0866F5',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Award size={16} /> Verified Certificate
            </button>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: '#334155',
                color: '#FFFFFF',
                border: 'none',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <MessageCircle size={16} /> Discord Community
            </a>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 1.5rem',
          position: 'sticky',
          top: '68px',
          zIndex: 10
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            gap: '1.5rem',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          {[
            { id: 'overview', label: 'Overview & Schedule', icon: Calendar },
            { id: 'delivery', label: 'Goodies Tracking', icon: Truck },
            { id: 'projects', label: 'Projects & Submission', icon: BookOpen },
            { id: 'certificate', label: 'Official Certificate', icon: Award },
            { id: 'support', label: 'Help & Documents', icon: FileText }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '1rem 0.25rem',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0866F5' : '#64748B',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #0866F5' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Tab Contents */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            {/* Quick Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}
            >
              {[
                { title: 'Program Track', val: selectedDomain.shortTitle || selectedDomain.title, sub: selectedDomain.code, color: '#0866F5' },
                { title: 'Program Duration', val: selectedDuration.name, sub: `Started ${selectedBatch.date}`, color: '#16A34A' },
                { title: 'Milestone Progress', val: 'Week 2 / 6 (35%)', sub: 'On track for distinction', color: '#EA4335' },
                { title: 'Mentor Evaluation', val: '4.9 / 5.0 Rating', sub: 'Excellent project structure', color: '#FAB005' }
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    padding: '1.25rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>{stat.title}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
                    {stat.val}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: stat.color, fontWeight: 700 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Upcoming Session & Mentor Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '1.75rem',
                marginBottom: '2rem'
              }}
            >
              {/* Upcoming Session */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Video size={18} color="#0866F5" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    Next Live Mentor Session
                  </h2>
                </div>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    border: '1px solid #E2E8F0',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0866F5', textTransform: 'uppercase' }}>
                    WEEK 2 CODE REVIEW & ARCHITECTURE CLINIC
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
                    Building Scalable APIs & ML Inference Pipelines
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <span><Calendar size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> This Saturday, 5:00 PM IST</span>
                    <span><Clock size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> 60 Minutes</span>
                  </div>
                </div>

                <a
                  href="https://meet.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: '#0866F5',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  Join Google Meet Call
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Assigned Mentor */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                  Your Assigned Lead Mentor
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0866F5',
                      fontWeight: 800,
                      fontSize: '1.1rem'
                    }}
                  >
                    RK
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                      Rohit Kumar
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      Lead Systems Engineer @ PRMA Tech (Ex-TCS R&D)
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Specializes in Cloud Microservices, Machine Learning Systems, and Clean Architecture. Connect for weekly 1:1 syncs.
                </p>

                <a
                  href="https://wa.me/919120743534"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#16A34A',
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={15} /> Message Mentor on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Goodies Delivery Tracking */}
        {activeTab === 'delivery' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '2rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                  Official Welcome Kit Dispatch & Tracking
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                  Courier: <strong>BlueDart Air Express</strong> • AWB Number: <strong>BD-PRMA-8924102</strong>
                </p>
              </div>

              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px'
                }}
              >
                IN TRANSIT (ON TIME)
              </span>
            </div>

            {/* Stepper Progress */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                position: 'relative',
                marginBottom: '2.5rem'
              }}
            >
              {[
                { stage: 'Order Placed', date: 'Confirmed', done: true },
                { stage: 'Kit Assembled', date: 'Custom Laser Etched', done: true },
                { stage: 'In Transit', date: 'Dispatched via BlueDart', done: true },
                { stage: 'Out for Delivery', date: 'Estimated 2-3 Days', done: false }
              ].map((step, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      margin: '0 auto 0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: step.done ? '#16A34A' : '#F1F5F9',
                      color: step.done ? '#FFFFFF' : '#94A3B8',
                      fontWeight: 800,
                      boxShadow: step.done ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none'
                    }}
                  >
                    {step.done ? <CheckCircle2 size={20} /> : idx + 1}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: step.done ? '#0F172A' : '#94A3B8' }}>
                    {step.stage}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                    {step.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Package Contents */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Items in this Consignment:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {[
                  'PRMA Tech Developer T-Shirt (Size L)',
                  'Insulated Matte Black Water Bottle',
                  'Hardbound Executive Journal',
                  'Verified Smart Intern ID Card + Lanyard',
                  'Tech Vinyl Stickers Pack'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#475569' }}>
                    <CheckCircle2 size={15} color="#16A34A" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Project 1 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid #E2E8F0',
                padding: '1.75rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0866F5', backgroundColor: '#EFF6FF', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  PROJECT 1 — COMPLETED
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16A34A' }}>
                  Grade: A+ (100 / 100)
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                Dataset Extraction & Automated Model Architecture
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                Build automated extraction scripts with data cleansing, feature scaling, and initial baseline model training.
              </p>
              <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Github size={15} /> Submitted Repo: <code>github.com/{candidateEmail.split('@')[0]}/prma-project-1</code>
              </div>
            </div>

            {/* Project 2 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid #E2E8F0',
                padding: '1.75rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B45309', backgroundColor: '#FEF3C7', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  PROJECT 2 — CAPSTONE (DUE IN 10 DAYS)
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>
                  Weightage: 60% of Final Certificate
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                Production Deployment & Real-Time REST API Integration
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                Deploy microservices on AWS/Docker container, write unit test suites, and configure zero-downtime CI/CD workflows.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px' }}>
                <input
                  type="text"
                  placeholder="Paste GitHub Repository URL..."
                  style={{
                    flex: 1,
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="button"
                  style={{
                    padding: '0.65rem 1.15rem',
                    borderRadius: '8px',
                    backgroundColor: '#0866F5',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Verified Certificate */}
        {activeTab === 'certificate' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '2.5rem',
              boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
              textAlign: 'center'
            }}
          >
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#B45309'
                }}
              >
                <Award size={32} />
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                Official PRMA Tech Internship Certificate
              </h2>

              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Issued to <strong>{candidateName}</strong> for successfully demonstrating industry-grade competence in <strong>{selectedDomain.title}</strong> under the mentorship of PRMA Tech Engineering Division.
              </p>

              {/* Certificate Mock Box */}
              <div
                style={{
                  border: '8px double #CBD5E1',
                  borderRadius: '16px',
                  padding: '2rem',
                  backgroundColor: '#FFFEFA',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Certificate of Internship Excellence
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: '0.75rem 0' }}>
                  {candidateName}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '500px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
                  has completed the rigorous <strong>{selectedDuration.name}</strong> internship program in <strong>{selectedDomain.title}</strong> with distinction.
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#64748B' }}>
                  <div>VERIFIED ID: <strong>{actualAppId}</strong></div>
                  <div>SECURITY HASH: <strong>SHA256-PRMA-94B2</strong></div>
                  <div>DIRECTOR, PRMA TECH</div>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                style={{
                  padding: '0.85rem 1.75rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  backgroundColor: '#0866F5',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(8, 102, 245, 0.35)'
                }}
              >
                <Download size={18} />
                Download High-Resolution Certificate PDF
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Support & Documents */}
        {activeTab === 'support' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid #E2E8F0',
                padding: '1.75rem'
              }}
            >
              <FileText size={28} color="#0866F5" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                Offer Letter & College NOC
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Official signed letter of recommendation / internship confirmation letter for college credit submission.
              </p>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '10px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Download size={15} /> Download Signed Letter
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid #E2E8F0',
                padding: '1.75rem'
              }}
            >
              <MessageCircle size={28} color="#16A34A" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                Direct WhatsApp Helpline
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Have questions about your project brief, mentor session, or goodies shipment? Talk directly to our team.
              </p>
              <a
                href="https://wa.me/919120743534?text=Hi%20PRMA%20Tech%2C%20I%20am%20an%20active%20intern%20requesting%20assistance"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.15rem',
                  borderRadius: '10px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                Chat on WhatsApp (+91 91207 43534)
              </a>
            </div>
          </div>
        )}
      </main>

      <PrmaFooter navigateToTab={navigateToTab} />
    </div>
  );
}
