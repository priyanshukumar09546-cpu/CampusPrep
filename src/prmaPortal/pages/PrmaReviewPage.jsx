import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  ArrowRight,
  Package,
  Calendar,
  Clock
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaStepProgress from '../components/PrmaStepProgress';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaReviewPage({ navigateToTab }) {
  const {
    selectedDomain,
    selectedDuration,
    selectedBatch,
    studentDetails,
    updateStudentDetails,
    calculateTotals,
    generateApplicationId
  } = usePrmaApplication();

  const [form, setForm] = useState({
    fullName: studentDetails.fullName || '',
    email: studentDetails.email || '',
    mobile: studentDetails.mobile || '',
    gender: studentDetails.gender || 'Male',
    college: studentDetails.college || '',
    degree: studentDetails.degree || 'B.Tech',
    branch: studentDetails.branch || 'Computer Science & Engineering',
    gradYear: studentDetails.gradYear || '2026',
    rollNumber: studentDetails.rollNumber || '',
    address: studentDetails.address || '',
    city: studentDetails.city || '',
    state: studentDetails.state || 'Uttar Pradesh',
    pincode: studentDetails.pincode || '',
    termsAccepted: studentDetails.termsAccepted ?? true
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const { packageFee, goodiesSubtotal, totalPayable, goodiesList, goodiesCount } = calculateTotals();
  const finalTotal = Math.max(0, totalPayable - couponDiscount);

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'PRMA100') {
      setCouponDiscount(100);
      setCouponSuccess('Coupon PRMA100 applied! Flat ₹100 discount.');
      setCouponError('');
    } else if (code === 'VIRUS50') {
      setCouponDiscount(50);
      setCouponSuccess('Coupon VIRUS50 applied! Flat ₹50 discount.');
      setCouponError('');
    } else if (code === 'CAMPUS10') {
      const disc = Math.round(totalPayable * 0.1);
      setCouponDiscount(disc);
      setCouponSuccess(`Coupon CAMPUS10 applied! 10% off (₹${disc}).`);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try PRMA100 or VIRUS50.');
      setCouponSuccess('');
      setCouponDiscount(0);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!form.email.trim() || !form.email.includes('@')) errors.email = 'Please enter a valid email address';
    if (!form.mobile.trim() || form.mobile.replace(/\D/g, '').length < 10) errors.mobile = 'Please enter a valid 10-digit mobile number';
    if (!form.college.trim()) errors.college = 'Please enter your college name';
    if (!form.termsAccepted) errors.terms = 'You must accept the terms and code of conduct';

    // If goodies are selected, check shipping address
    if (goodiesCount > 0) {
      if (!form.address.trim()) errors.address = 'Shipping address required for delivery';
      if (!form.city.trim()) errors.city = 'City required';
      if (!form.pincode.trim() || form.pincode.length < 6) errors.pincode = 'Valid 6-digit PIN code required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // Save student details into Context
    updateStudentDetails(form);

    // Generate Application ID
    const appId = generateApplicationId();

    // Navigate to payment page
    if (navigateToTab) {
      navigateToTab('prma-internships-payment');
    }
  };

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
      <PrmaStepProgress currentStep={4} onNavigate={navigateToTab} />

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 5rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Final Review & Student Application
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '640px', margin: '0 auto' }}>
            Please fill in your authentic details. Your verified internship certificate and project credentials will be issued under this legal name.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '2.5rem',
              alignItems: 'start'
            }}
            className="prma-review-layout"
          >
            {/* Form Fields (Left Column) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Section 1: Personal Details */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.75rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <User size={20} color="#0866F5" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    1. Student Personal Details
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Full Name */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      Full Name (as per College ID / Marksheet) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priyanshu Kumar"
                      value={form.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: formErrors.fullName ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    {formErrors.fullName && (
                      <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        {formErrors.fullName}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. priyanshu@gmail.com"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: formErrors.email ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    {formErrors.email && (
                      <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        {formErrors.email}
                      </div>
                    )}
                  </div>

                  {/* Mobile / WhatsApp */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      value={form.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: formErrors.mobile ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    {formErrors.mobile && (
                      <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        {formErrors.mobile}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Details */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.75rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <GraduationCap size={20} color="#0866F5" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    2. Academic & College Details
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* College Name */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      College / Institute Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ajay Kumar Garg Engineering College (AKGEC)"
                      value={form.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: formErrors.college ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    {formErrors.college && (
                      <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        {formErrors.college}
                      </div>
                    )}
                  </div>

                  {/* Degree / Course */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      Degree / Program
                    </label>
                    <select
                      value={form.degree}
                      onChange={(e) => handleInputChange('degree', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.9rem',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                      <option value="BCA">BCA (Computer Applications)</option>
                      <option value="MCA">MCA (Master of Computer Applications)</option>
                      <option value="B.Sc (CS/IT)">B.Sc (Computer Science / IT)</option>
                      <option value="Diploma">Diploma (Polytechnic)</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Branch */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      Branch / Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSE / IT / ECE"
                      value={form.branch}
                      onChange={(e) => handleInputChange('branch', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  {/* Passing Year */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      Graduation Year
                    </label>
                    <select
                      value={form.gradYear}
                      onChange={(e) => handleInputChange('gradYear', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.9rem',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <option value="2025">2025 (Graduated / Final Year)</option>
                      <option value="2026">2026 (Final Year)</option>
                      <option value="2027">2027 (Pre-final Year)</option>
                      <option value="2028">2028 (Second Year)</option>
                      <option value="2029">2029 (First Year)</option>
                    </select>
                  </div>

                  {/* Roll Number (Optional) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      University / AKTU Roll No. (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2100270100xxx"
                      value={form.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Shipping Address */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.75rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={20} color="#0866F5" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    3. Kit Delivery Address
                  </h2>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.25rem' }}>
                  {goodiesCount > 0
                    ? 'Required for free door-to-door delivery of your selected physical welcome kit and goodies.'
                    : 'Address used for physical dispatch of completion certificates and letters.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      Flat / House No. / Street Address {goodiesCount > 0 ? '*' : ''}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. House #14, Sector 62, Near Metro Station"
                      value={form.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: formErrors.address ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                    {formErrors.address && (
                      <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        {formErrors.address}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      City {goodiesCount > 0 ? '*' : ''}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Noida / Ghaziabad / Lucknow"
                      value={form.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: formErrors.city ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      PIN Code {goodiesCount > 0 ? '*' : ''}
                    </label>
                    <input
                      type="text"
                      placeholder="6-digit PIN"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: formErrors.pincode ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Terms declaration */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: formErrors.terms ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '0.2rem',
                    accentColor: '#0866F5',
                    cursor: 'pointer'
                  }}
                />
                <label htmlFor="termsAccepted" style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, cursor: 'pointer' }}>
                  I confirm that all details provided are accurate. I agree to abide by PRMA Tech's code of conduct, project milestone completion criteria, and standard internship terms.
                </label>
              </div>
            </div>

            {/* Right Column: Order Summary & Review */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                  Application Summary
                </h3>

                {/* Selected Track card */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0866F5', textTransform: 'uppercase' }}>
                    Internship Program
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
                    {selectedDomain.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span><Clock size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> {selectedDuration.name}</span>
                    <span><Calendar size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> Batch: {selectedBatch.date}</span>
                  </div>
                </div>

                {/* Selected Goodies list */}
                {goodiesList.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Selected Goodies ({goodiesList.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto' }}>
                      {goodiesList.map(item => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.82rem',
                            color: '#334155'
                          }}
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.name} {item.size ? `(${item.size})` : ''} × {item.quantity}
                          </span>
                          <span style={{ fontWeight: 700, flexShrink: 0 }}>₹{item.totalPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coupon Code input */}
                <div style={{ marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Tag size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="Coupon (e.g. PRMA100)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                          fontSize: '0.82rem',
                          borderRadius: '8px',
                          border: '1.5px solid #CBD5E1',
                          outline: 'none',
                          textTransform: 'uppercase'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={applyCoupon}
                      style={{
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  {couponSuccess && (
                    <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, marginTop: '0.35rem' }}>
                      {couponSuccess}
                    </div>
                  )}
                  {couponError && (
                    <div style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 600, marginTop: '0.35rem' }}>
                      {couponError}
                    </div>
                  )}
                </div>

                {/* Financial breakdown */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                    <span>Internship Program Fee:</span>
                    <span style={{ fontWeight: 600 }}>₹{packageFee}</span>
                  </div>

                  {goodiesSubtotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                      <span>Goodies & Swag Kit:</span>
                      <span style={{ fontWeight: 600 }}>₹{goodiesSubtotal}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                    <span>Pan-India Express Shipping:</span>
                    <span style={{ fontWeight: 600, color: '#16A34A' }}>FREE</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#16A34A', fontWeight: 600 }}>
                      <span>Coupon Discount:</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      paddingTop: '0.75rem',
                      borderTop: '1.5px dashed #E2E8F0',
                      marginTop: '0.35rem'
                    }}
                  >
                    <span>Total Payable:</span>
                    <span style={{ color: '#0866F5' }}>₹{finalTotal}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    backgroundColor: '#0866F5',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 16px rgba(8, 102, 245, 0.35)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Submit & Proceed to Payment
                  <ArrowRight size={18} />
                </button>

                <div
                  style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    fontSize: '0.78rem',
                    color: '#64748B'
                  }}
                >
                  <ShieldCheck size={16} color="#16A34A" />
                  Official PRMA Tech Secure Registration
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <PrmaFooter navigateToTab={navigateToTab} />
    </div>
  );
}
