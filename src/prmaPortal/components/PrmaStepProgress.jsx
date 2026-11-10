import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

export default function PrmaStepProgress({ currentStep = 1, onNavigate }) {
  const steps = [
    { num: 1, label: 'Select Domain', route: 'prma-internships-domains' },
    { num: 2, label: 'Choose Batch & Duration', route: 'prma-internships-apply' },
    { num: 3, label: 'Add Goodies (Optional)', route: 'prma-internships-goodies' },
    { num: 4, label: 'Review & Apply', route: 'prma-internships-review' }
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0.85rem 1rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem 1.25rem'
        }}
      >
        {steps.map((st, idx) => {
          const isCompleted = currentStep > st.num;
          const isCurrent = currentStep === st.num;

          return (
            <React.Fragment key={st.num}>
              <div
                onClick={() => {
                  if (onNavigate && isCompleted) {
                    onNavigate(st.route);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: isCompleted ? 'pointer' : 'default',
                  opacity: currentStep >= st.num ? 1 : 0.5
                }}
              >
                {/* Number / Check Circle */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#079B45' : (isCurrent ? '#0866F5' : '#E2E8F0'),
                    color: isCompleted || isCurrent ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : st.num}
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: isCurrent ? 800 : (isCompleted ? 700 : 500),
                    color: isCurrent ? '#0866F5' : (isCompleted ? '#1E293B' : '#64748B')
                  }}
                >
                  {st.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <ChevronRight size={14} color="#CBD5E1" style={{ display: 'inline-block' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}