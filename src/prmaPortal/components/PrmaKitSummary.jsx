import React from 'react';
import {
  Package,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaKitSummary({
  actionButtonText = 'Continue to Review & Apply',
  onAction,
  allowEditing = true,
  isLoading = false
}) {
  const {
    selectedDomain,
    selectedDuration,
    calculateTotals,
    toggleGoodie,
    updateGoodieQuantity
  } = usePrmaApplication();

  const { packageFee, goodiesSubtotal, totalPayable, goodiesList, goodiesCount } = calculateTotals();

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1.5px solid #E2E8F0',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(16, 28, 80, 0.05)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        position: 'sticky',
        top: '90px'
      }}
    >
      {/* Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid #F1F5F9'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={18} color="#7025E8" />
          <h3
            style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#101C50',
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            Your Kit Summary
          </h3>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            backgroundColor: '#F3E8FF',
            color: '#7025E8'
          }}
        >
          {goodiesCount} {goodiesCount === 1 ? 'Item' : 'Items'} Selected
        </span>
      </div>

      {/* Selected Goodies List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxHeight: '260px',
          overflowY: 'auto',
          paddingRight: '0.25rem',
          marginBottom: '1.25rem'
        }}
      >
        {goodiesList.length === 0 ? (
          <div
            style={{
              padding: '1.25rem',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px dashed #CBD5E1',
              color: '#64748B',
              fontSize: '0.82rem'
            }}
          >
            No optional goodies added yet. You can pick any merchandise above!
          </div>
        ) : (
          goodiesList.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.65rem',
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #F1F5F9',
                gap: '0.5rem'
              }}
            >
              {/* Product Thumbnail & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    flexShrink: 0
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#1E293B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    ₹{item.price} {item.size ? `• Size: ${item.size}` : ''}
                  </div>
                </div>
              </div>

              {/* Quantity Controls / Remove */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                {allowEditing && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => updateGoodieQuantity(item.id, -1)}
                      style={{
                        padding: '2px 5px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748B'
                      }}
                      title="Decrease"
                    >
                      <Minus size={11} />
                    </button>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0 4px', color: '#1E293B' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateGoodieQuantity(item.id, 1)}
                      style={{
                        padding: '2px 5px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748B'
                      }}
                      title="Increase"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                )}

                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#101C50', minWidth: '45px', textAlign: 'right' }}>
                  ₹{item.totalPrice}
                </span>

                {allowEditing && (
                  <button
                    type="button"
                    onClick={() => toggleGoodie(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      padding: '3px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pricing Calculation Rows */}
      <div
        style={{
          borderTop: '1px solid #E2E8F0',
          paddingTop: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
          fontSize: '0.86rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
          <span>Internship Package ({selectedDomain.shortTitle || selectedDomain.title})</span>
          <span style={{ fontWeight: 700, color: '#1E293B' }}>₹{packageFee}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
          <span>Selected Goodies ({goodiesCount} items)</span>
          <span style={{ fontWeight: 700, color: '#1E293B' }}>₹{goodiesSubtotal}</span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.65rem',
            borderTop: '1.5px dashed #CBD5E1',
            marginTop: '0.35rem'
          }}
        >
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#101C50', fontFamily: "'Outfit', sans-serif" }}>
              Total Payable
            </div>
            <div style={{ fontSize: '0.7rem', color: '#079B45', fontWeight: 600 }}>
              Inclusive of GST & Certificate
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0866F5', fontFamily: "'Outfit', sans-serif" }}>
            ₹{totalPayable}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          disabled={isLoading}
          style={{
            width: '100%',
            marginTop: '1.25rem',
            padding: '0.85rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.55rem',
            boxShadow: '0 6px 20px rgba(8, 102, 245, 0.35)',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(8, 102, 245, 0.45)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(8, 102, 245, 0.35)';
            }
          }}
        >
          <span>{isLoading ? 'Processing...' : actionButtonText}</span>
          <ArrowRight size={16} />
        </button>
      )}

      {/* Safety Guarantee */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          color: '#079B45',
          fontSize: '0.74rem',
          fontWeight: 700
        }}
      >
        <ShieldCheck size={14} />
        <span>100% Verified Program • Instant Seat Confirmation</span>
      </div>
    </div>
  );
}