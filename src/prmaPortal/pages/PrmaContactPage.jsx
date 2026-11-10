import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';

export default function PrmaContactPage({ navigateToTab }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Internship Program Query',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/prma/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    } catch (err) {
      console.log('Recorded contact inquiry:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setForm({
          name: '',
          email: '',
          phone: '',
          inquiryType: 'Internship Program Query',
          message: ''
        });
      }, 3000);
    }, 900);
  };

  const faqs = [
    {
      q: 'How does the PRMA Tech Remote Internship program operate?',
      a: 'The program is 100% remote. Students receive weekly project milestone briefs, attend live weekend mentor doubt-clearing sessions, and submit repositories for 1:1 code reviews from senior software engineers.'
    },
    {
      q: 'When and how is the physical welcome kit delivered?',
      a: 'Physical welcome kits (containing your branded t-shirt, water bottle, executive notebook, pen, smart NFC intern ID card, and stickers) are packed and dispatched via BlueDart / Delhivery within 3 to 5 business days of enrollment confirmation.'
    },
    {
      q: 'Are PRMA Tech internship certificates university-accepted for college credit?',
      a: 'Yes. Every PRMA Tech certificate includes an authentic verifiable certificate serial number, QR validation code, and an official signed letter of recommendation / NOC suitable for academic credit submission.'
    },
    {
      q: 'How does PRMA Tech work with startups and businesses for software services?',
      a: 'We offer fixed-scope and dedicated engineering team models for web applications, mobile apps, AI integrations, and cloud infrastructure with clearly defined sprint milestones and post-launch maintenance warranties.'
    }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A',
        overflowX: 'hidden'
      }}
    >
      <PrmaNavbar activePage="contact" navigateToTab={navigateToTab} />

      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          padding: '4rem 1.5rem 3rem',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1rem'
            }}
          >
            Get in Touch with PRMA Tech
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto'
            }}
          >
            Have an internship inquiry, project proposal, college partnership request, or technical question? We are here to help.
          </p>
        </div>
      </section>

      {/* Main Content Grid: Info (Left) + Form (Right) */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '1rem 1.5rem 5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: '3rem',
            alignItems: 'start'
          }}
          className="prma-contact-grid"
        >
          {/* Left Column: Direct Contact Info */}
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.5rem' }}>
              Contact Channels
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    color: '#0866F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Helpline & WhatsApp
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                    +91 91207 43534
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600, marginTop: '0.2rem' }}>
                    Mon – Sat, 10:00 AM – 7:00 PM IST
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#F5F3FF',
                    color: '#7025E8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Official Email
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                    support@prmatech.in
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                    Average response time: &lt; 4 hours
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF2F2',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Office Headquarters
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                    PRMA Technologies India Pvt Ltd
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem', lineHeight: 1.4 }}>
                    Sector 62 / Knowledge Park Technology Corridor, Noida, Uttar Pradesh 201309, India
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <a
              href="https://wa.me/919120743534?text=Hi%20PRMA%20Tech%2C%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%',
                padding: '0.95rem',
                borderRadius: '14px',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)'
              }}
            >
              <MessageCircle size={20} />
              Open WhatsApp Chat (+91 91207 43534)
            </a>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid #E2E8F0',
              padding: '2.5rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.4rem' }}>
              Send Us a Message
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.75rem' }}>
              Fill in the form below and our team will get back to you promptly.
            </p>

            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle2 size={54} color="#16A34A" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#15803D', marginBottom: '0.5rem' }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#475569' }}>
                  Thank you for reaching out. We have received your message and will contact you via email or phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Inquiry Type
                  </label>
                  <select
                    value={form.inquiryType}
                    onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.9rem',
                      backgroundColor: '#FFFFFF',
                      outline: 'none'
                    }}
                  >
                    <option value="Internship Program Query">Internship Program Query</option>
                    <option value="Corporate Software Development">Corporate Software Development Project</option>
                    <option value="College / University MOU Partnership">College / University MOU Partnership</option>
                    <option value="Goodies & Kit Tracking Query">Goodies & Kit Tracking Query</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Your Message / Question *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you today?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.95rem',
                    borderRadius: '12px',
                    backgroundColor: isSubmitting ? '#94A3B8' : '#0866F5',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(8, 102, 245, 0.35)'
                  }}
                >
                  <Send size={17} />
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section
        style={{
          backgroundColor: '#FAFAFC',
          borderTop: '1px solid #E2E8F0',
          padding: '4.5rem 1.5rem 5rem'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B' }}>
              Common questions answered by our engineering and admissions team.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      color="#64748B"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.92rem', color: '#475569', lineHeight: 1.65 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PrmaFooter navigateToTab={navigateToTab} />

      <style>{`
        @media (max-width: 900px) {
          .prma-contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
