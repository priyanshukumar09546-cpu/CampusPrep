import React from 'react';

export default function PrmaDomainIcon({ iconType, className = 'w-12 h-12', color }) {
  switch (iconType) {
    case 'ai-ml':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2.5" />
          {/* Neural Synapses & Nodes */}
          <path d="M22 24L32 16L42 24L42 40L32 48L22 40Z" stroke="#2563EB" strokeWidth="2.5" strokeLinejoin="round" fill="#DBEAFE" />
          <circle cx="32" cy="16" r="4" fill="#1D4ED8" />
          <circle cx="42" cy="24" r="4" fill="#3B82F6" />
          <circle cx="42" cy="40" r="4" fill="#3B82F6" />
          <circle cx="32" cy="48" r="4" fill="#1D4ED8" />
          <circle cx="22" cy="40" r="4" fill="#3B82F6" />
          <circle cx="22" cy="24" r="4" fill="#3B82F6" />
          <circle cx="32" cy="32" r="5" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" />
          <path d="M22 24L32 32M42 24L32 32M42 40L32 32M22 40L32 32M32 16L32 32M32 48L32 32" stroke="#60A5FA" strokeWidth="1.5" />
        </svg>
      );

    case 'data-science':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#ECFEFF" stroke="#06B6D4" strokeWidth="2.5" />
          {/* Bar Chart with Trend Curve */}
          <rect x="16" y="34" width="6" height="14" rx="2" fill="#0891B2" />
          <rect x="26" y="26" width="6" height="22" rx="2" fill="#06B6D4" />
          <rect x="36" y="18" width="6" height="30" rx="2" fill="#22D3EE" />
          <rect x="46" y="28" width="6" height="20" rx="2" fill="#0891B2" />
          {/* Trend Line */}
          <path d="M16 32L28 22L38 14L48 24" stroke="#0E7490" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="32" r="2.5" fill="#0E7490" />
          <circle cx="28" cy="22" r="2.5" fill="#0E7490" />
          <circle cx="38" cy="14" r="2.5" fill="#0E7490" />
          <circle cx="48" cy="24" r="2.5" fill="#0E7490" />
        </svg>
      );

    case 'python':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FEFCE8" stroke="#EAB308" strokeWidth="2.5" />
          {/* Python Emblem */}
          <path d="M31.5 15C22.5 15 23 19 23 19L23 23L32 23L32 24.5L18.5 24.5C18.5 24.5 15 24 15 33C15 42 19 41.5 19 41.5L21.5 41.5L21.5 37.5C21.5 37.5 21 32.5 26 32.5L35 32.5C35 32.5 39.5 32.5 39.5 28L39.5 19C39.5 19 40 15 31.5 15Z" fill="#3B82F6" />
          <circle cx="27" cy="19" r="1.5" fill="#FFFFFF" />
          <path d="M32.5 49C41.5 49 41 45 41 45L41 41L32 41L32 39.5L45.5 39.5C45.5 39.5 49 40 49 31C49 22 45 22.5 45 22.5L42.5 22.5L42.5 26.5C42.5 26.5 43 31.5 38 31.5L29 31.5C29 31.5 24.5 31.5 24.5 36L24.5 45C24.5 45 24 49 32.5 49Z" fill="#EAB308" />
          <circle cx="37" cy="45" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 'fullstack':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="2.5" />
          {/* Layered Stack with Code & Database */}
          <rect x="16" y="16" width="32" height="10" rx="3" fill="#8B5CF6" />
          <path d="M22 21L25 21M28 21L36 21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <rect x="16" y="28" width="32" height="10" rx="3" fill="#A78BFA" />
          <path d="M22 33L25 33M28 33L38 33" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <rect x="16" y="40" width="32" height="10" rx="3" fill="#C4B5FD" />
          <path d="M22 45L25 45M28 45L34 45" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'frontend':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FDF2F8" stroke="#EC4899" strokeWidth="2.5" />
          {/* Browser Window & React Element */}
          <rect x="14" y="16" width="36" height="32" rx="4" fill="#FFFFFF" stroke="#DB2777" strokeWidth="2.5" />
          <path d="M14 24H50" stroke="#DB2777" strokeWidth="2" />
          <circle cx="19" cy="20" r="1.5" fill="#EF4444" />
          <circle cx="24" cy="20" r="1.5" fill="#F59E0B" />
          <circle cx="29" cy="20" r="1.5" fill="#10B981" />
          {/* Code Brackets */}
          <path d="M26 31L21 36L26 41M38 31L43 36L38 41M34 29L30 43" stroke="#EC4899" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'backend':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" />
          {/* Server Rack with Active Nodes */}
          <rect x="16" y="16" width="32" height="13" rx="3" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
          <circle cx="22" cy="22.5" r="2" fill="#10B981" />
          <circle cx="28" cy="22.5" r="2" fill="#10B981" />
          <path d="M36 22.5H42" stroke="#059669" strokeWidth="2" strokeLinecap="round" />

          <rect x="16" y="33" width="32" height="13" rx="3" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
          <circle cx="22" cy="39.5" r="2" fill="#10B981" />
          <circle cx="28" cy="39.5" r="2" fill="#10B981" />
          <path d="M36 39.5H42" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'java':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2.5" />
          {/* Steaming Coffee Cup */}
          <path d="M20 28H40V39C40 43.4 36.4 47 32 47H28C23.6 47 20 43.4 20 39V28Z" fill="#EA580C" />
          <path d="M40 31H44C46.2 31 48 32.8 48 35C48 37.2 46.2 39 44 39H40" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
          {/* Steam curves */}
          <path d="M26 23C25 20 27 18 26 15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 23C31 19 33 17 32 14" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          <path d="M38 23C37 20 39 18 38 15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 49H44" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'cpp':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
          {/* C++ Hex Shield */}
          <path d="M32 14L46 22V38L32 46L18 38V22L32 14Z" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2.5" />
          <path d="M28 26C24 26 23 28 23 32C23 36 24 38 28 38C30.5 38 32 37 32 37" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" />
          {/* Plus Plus */}
          <path d="M36 30V34M34 32H38" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 30V34M40 32H44" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'cloud':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2.5" />
          {/* Cloud & Pipelines */}
          <path d="M22 40H43C46.3 40 49 37.3 49 34C49 30.9 46.7 28.4 43.6 28.1C43.1 23 38.6 19 33.2 19C28.7 19 24.8 21.8 23.4 25.8C20.3 26.3 18 29 18 32.2C18 35.7 20.8 40 22 40Z" fill="#BAE6FD" stroke="#0369A1" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M27 46H37M32 40V48" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'cybersecurity':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2.5" />
          {/* Cyber Shield with Keyhole */}
          <path d="M32 15L45 20V32C45 40 39.5 46.5 32 49C24.5 46.5 19 40 19 32V20L32 15Z" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="32" cy="30" r="3" fill="#DC2626" />
          <path d="M32 33V39" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'android':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#F0FDF4" stroke="#22C55E" strokeWidth="2.5" />
          {/* Android Robot Head */}
          <path d="M22 34C22 25.5 26.5 21 32 21C37.5 21 42 25.5 42 34H22Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="2.5" />
          <line x1="26" y1="18" x2="23" y2="14" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="18" x2="41" y2="14" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="27" cy="27" r="1.8" fill="#14532D" />
          <circle cx="37" cy="27" r="1.8" fill="#14532D" />
          <rect x="22" y="37" width="20" height="9" rx="2" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
        </svg>
      );

    case 'flutter':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2.5" />
          {/* Flutter Wing Emblem */}
          <path d="M38 15L22 31L27 36L48 15H38Z" fill="#38BDF8" />
          <path d="M38 31L28 41L33 46L48 31H38Z" fill="#0284C7" />
          <path d="M32 45L37 50H47L37 40L32 45Z" fill="#0369A1" />
        </svg>
      );

    case 'ui-ux':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FAF5FF" stroke="#A855F7" strokeWidth="2.5" />
          {/* Figma Vector Pen & Color Palette */}
          <path d="M22 42L25 31L35 21C36.5 19.5 39 19.5 40.5 21C42 22.5 42 25 40.5 26.5L30.5 36.5L22 42Z" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="35" cy="27" r="2" fill="#7E22CE" />
          <circle cx="44" cy="42" r="3" fill="#EC4899" />
          <circle cx="36" cy="47" r="3" fill="#3B82F6" />
          <circle cx="28" cy="48" r="3" fill="#EAB308" />
        </svg>
      );

    case 'web-design':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="2.5" />
          {/* Layout Grid Canvas */}
          <rect x="15" y="16" width="34" height="32" rx="4" fill="#FFFFFF" stroke="#BE123C" strokeWidth="2.5" />
          <rect x="19" y="20" width="26" height="8" rx="2" fill="#FECDD3" />
          <rect x="19" y="31" width="11" height="13" rx="2" fill="#FFE4E6" stroke="#FB7185" strokeWidth="1.5" />
          <rect x="33" y="31" width="12" height="6" rx="1.5" fill="#FDA4AF" />
          <rect x="33" y="39" width="12" height="5" rx="1.5" fill="#FECDD3" />
        </svg>
      );

    case 'business-analytics':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#F0FDFA" stroke="#14B8A6" strokeWidth="2.5" />
          {/* Performance Speedometer / KPI Executive Meter */}
          <path d="M18 42C18 31 24.3 22 32 22C39.7 22 46 31 46 42" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="42" x2="40" y2="28" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="42" r="4" fill="#0D9488" />
          <path d="M22 26L26 22M42 26L38 22" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'sql-analysis':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2.5" />
          {/* Relational Database Cylinders */}
          <ellipse cx="32" cy="20" rx="14" ry="5" fill="#C7D2FE" stroke="#4338CA" strokeWidth="2.2" />
          <path d="M18 20V29C18 31.8 24.3 34 32 34C39.7 34 46 31.8 46 29V20" stroke="#4338CA" strokeWidth="2.2" fill="#E0E7FF" />
          <path d="M18 29V38C18 40.8 24.3 43 32 43C39.7 43 46 40.8 46 38V29" stroke="#4338CA" strokeWidth="2.2" fill="#E0E7FF" />
          <path d="M18 38V47C18 49.8 24.3 52 32 52C39.7 52 46 49.8 46 47V38" stroke="#4338CA" strokeWidth="2.2" fill="#E0E7FF" />
        </svg>
      );

    default:
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="10" fill="#3B82F6" />
        </svg>
      );
  }
}
