import React from 'react';
import {
  Package,
  Sparkles,
  Check,
  Plus,
  Minus,
  CheckCircle2,
  Trash2,
  Truck,
  ShieldCheck,
  Gift
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaStepProgress from '../components/PrmaStepProgress';
import PrmaKitSummary from '../components/PrmaKitSummary';
import { PRMA_GOODIES } from '../data/prmaGoodies';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaGoodiesPage({ navigateToTab }) {
  const {
    selectedDomain,
    selectedDuration,
    selectedBatch,
    selectedGoodies,
    toggleGoodie,
    updateGoodieQuantity,
    updateGoodieSize
  } = usePrmaApplication();

  const handleProceed = () => {
    if (navigateToTab) {
      navigateToTab('prma-internships-review');
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
      <PrmaStepProgress currentStep={3} onNavigate={navigateToTab} />

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '2rem 1.5rem 5rem'
        }}
      >
        {/* Selected Program Mini Header */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0866F5', textTransform: 'uppercase' }}>
              Selected Program Track
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
              {selectedDomain.title} • {selectedDuration.name} ({selectedBatch.date})
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Base Program Fee</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0866F5' }}>
                ₹{selectedDuration.price}
              </div>
            </div>
            <button
              onClick={() => navigateToTab && navigateToTab('prma-internships-apply')}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0866F5',
                backgroundColor: '#FFFFFF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer'
              }}
            >
              Change Track
            </button>
          </div>
        </div>

        {/* Content Layout: Goodies Grid (Left) + Kit Summary (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '2.5rem',
            alignItems: 'start'
          }}
          className="prma-goodies-layout"
        >
          {/* Left Column: Goodies */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#EA4335',
                  backgroundColor: '#FEF2F2',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '999px',
                  marginBottom: '0.5rem'
                }}
              >
                <Gift size={15} /> Physical Goodies & Welcome Kit (Optional)
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                Customize Your PRMA Tech Welcome Swag
              </h1>
              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
                Add official PRMA Tech developer merch to celebrate your internship. Items are shipped directly to your residential address with live express tracking.
              </p>
            </div>

            {/* Free Shipping Alert */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '0.85rem 1.25rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: '#15803D',
                fontWeight: 600
              }}
            >
              <Truck size={20} color="#16A34A" />
              <span>
                <strong>All-India Free Express Shipping</strong> on all PRMA Tech official goodies. Tracking ID delivered via SMS & WhatsApp.
              </span>
            </div>

            {/* Products Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {PRMA_GOODIES.map((goodie) => {
                const isSelected = !!selectedGoodies[goodie.id]?.selected;
                const config = selectedGoodies[goodie.id] || { quantity: 1, size: 'L' };

                return (
                  <div
                    key={goodie.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '18px',
                      border: isSelected ? '2px solid #0866F5' : '1.5px solid #E2E8F0',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: isSelected
                        ? '0 6px 20px rgba(8, 102, 245, 0.12)'
                        : '0 2px 10px rgba(0, 0, 0, 0.03)',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Badge */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#0866F5',
                          color: '#FFFFFF',
                          borderRadius: '999px',
                          padding: '0.2rem 0.6rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Check size={12} /> ADDED
                      </div>
                    )}

                    {/* Product Image */}
                    <div>
                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '14px',
                          padding: '1rem',
                          height: '180px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1rem',
                          border: '1px solid #F1F5F9'
                        }}
                      >
                        <img
                          src={goodie.image}
                          alt={goodie.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      </div>

                      {/* Title & Subtitle */}
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          marginBottom: '0.2rem'
                        }}
                      >
                        {goodie.name}
                      </h3>

                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748B',
                          fontWeight: 600,
                          marginBottom: '0.5rem'
                        }}
                      >
                        {goodie.subtitle}
                      </div>

                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: '#475569',
                          lineHeight: 1.5,
                          marginBottom: '1rem'
                        }}
                      >
                        {goodie.description}
                      </p>

                      {/* Size selector if T-shirt */}
                      {goodie.hasSize && isSelected && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                            Select T-Shirt Size:
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {goodie.sizes.map((sz) => {
                              const isSizeActive = config.size === sz;
                              return (
                                <button
                                  key={sz}
                                  onClick={() => updateGoodieSize(goodie.id, sz)}
                                  style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    border: isSizeActive ? '2px solid #0866F5' : '1px solid #CBD5E1',
                                    backgroundColor: isSizeActive ? '#EFF6FF' : '#FFFFFF',
                                    color: isSizeActive ? '#0866F5' : '#475569'
                                  }}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Action Button */}
                    <div
                      style={{
                        paddingTop: '0.85rem',
                        borderTop: '1px solid #F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                          ₹{goodie.price}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                          ₹{goodie.originalPrice}
                        </div>
                      </div>

                      {isSelected ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {/* Quantity control */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor: '#F1F5F9',
                              borderRadius: '8px',
                              padding: '0.2rem'
                            }}
                          >
                            <button
                              onClick={() => updateGoodieQuantity(goodie.id, -1)}
                              style={{
                                width: '26px',
                                height: '26px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#334155'
                              }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0 0.5rem' }}>
                              {config.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateGoodieQuantity(goodie.id, 1)}
                              style={{
                                width: '26px',
                                height: '26px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#334155'
                              }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => toggleGoodie(goodie.id)}
                            title="Remove goodie"
                            style={{
                              padding: '0.45rem',
                              borderRadius: '8px',
                              border: '1px solid #FEE2E2',
                              backgroundColor: '#FEF2F2',
                              color: '#EF4444',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleGoodie(goodie.id)}
                          style={{
                            padding: '0.55rem 1.15rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: '1.5px solid #0866F5',
                            backgroundColor: '#FFFFFF',
                            color: '#0866F5',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Plus size={15} /> Add to Kit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Kit Summary */}
          <div>
            <PrmaKitSummary
              actionButtonText="Proceed to Review & Apply (Step 4)"
              onAction={handleProceed}
            />
          </div>
        </div>
      </div>

      <PrmaFooter navigateToTab={navigateToTab} />
    </div>
  );
}
