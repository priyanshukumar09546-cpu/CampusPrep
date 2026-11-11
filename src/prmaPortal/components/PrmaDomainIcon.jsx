import React from 'react';

export default function PrmaDomainIcon({ iconType, className = 'w-10 h-10', color }) {
  switch (iconType) {
    case 'ai-ml':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="2.5" />
          <rect x="18" y="18" width="28" height="28" rx="6" fill="#7C3AED" />
          {/* AI letters */}
          <text x="32" y="36" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="system-ui">AI</text>
          {/* Chip Pins */}
          <line x1="24" y1="12" x2="24" y2="18" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="32" y1="12" x2="32" y2="18" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="12" x2="40" y2="18" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="24" y1="46" x2="24" y2="52" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="32" y1="46" x2="32" y2="52" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="46" x2="40" y2="52" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="24" x2="18" y2="24" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="32" x2="18" y2="32" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="40" x2="18" y2="40" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="24" x2="52" y2="24" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="32" x2="52" y2="32" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="40" x2="52" y2="40" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'bi-analytics':
    case 'data-science':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#FDF2F8" stroke="#DB2777" strokeWidth="2.5" />
          {/* Bar Chart Columns */}
          <rect x="16" y="34" width="6" height="14" rx="2" fill="#BE185D" />
          <rect x="25" y="26" width="6" height="22" rx="2" fill="#DB2777" />
          <rect x="34" y="18" width="6" height="30" rx="2" fill="#EC4899" />
          <rect x="43" y="24" width="6" height="24" rx="2" fill="#F472B6" />
          {/* Trend Line */}
          <path d="M16 32L25 24L34 16L44 21" stroke="#9D174D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="44" cy="21" r="2.5" fill="#9D174D" />
        </svg>
      );

    case 'cloud-devops':
    case 'cloud':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
          <path d="M22 38H43C46.3 38 49 35.3 49 32C49 28.9 46.7 26.4 43.6 26.1C43.1 21 38.6 17 33.2 17C28.7 17 24.8 19.8 23.4 23.8C20.3 24.3 18 27 18 30.2C18 33.7 20.8 38 22 38Z" fill="#BFDBFE" stroke="#1D4ED8" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M32 28V43M28 39L32 43L36 39" stroke="#1D4ED8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'python':
    case 'python-programming':
    case 'data-analysis-python':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#FEFCE8" stroke="#EAB308" strokeWidth="2.5" />
          {/* Python Double Snake */}
          <path d="M31.5 16C23 16 23.5 19.5 23.5 19.5L23.5 23.5L32 23.5L32 25L19 25C19 25 15.5 24.5 15.5 33C15.5 41.5 19 41 19 41L21.5 41L21.5 37C21.5 37 21 32 26 32L35 32C35 32 39 32 39 28L39 19.5C39 19.5 39.5 16 31.5 16Z" fill="#3B82F6" />
          <circle cx="27.5" cy="19.5" r="1.5" fill="#FFFFFF" />
          <path d="M32.5 48C41 48 40.5 44.5 40.5 44.5L40.5 40.5L32 40.5L32 39L45 39C45 39 48.5 39.5 48.5 31C48.5 22.5 45 23 45 23L42.5 23L42.5 27C42.5 27 43 32 38 32L29 32C29 32 25 32 25 36L25 44.5C25 44.5 24.5 48 32.5 48Z" fill="#EAB308" />
          <circle cx="36.5" cy="44.5" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 'sql-analysis':
    case 'data-analysis-sql':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2.5" />
          {/* Relational Database Cylinders */}
          <ellipse cx="32" cy="20" rx="14" ry="5" fill="#BAE6FD" stroke="#0369A1" strokeWidth="2.2" />
          <path d="M18 20V29C18 31.8 24.3 34 32 34C39.7 34 46 31.8 46 29V20" stroke="#0369A1" strokeWidth="2.2" fill="#E0F2FE" />
          <path d="M18 29V38C18 40.8 24.3 43 32 43C39.7 43 46 40.8 46 38V29" stroke="#0369A1" strokeWidth="2.2" fill="#E0F2FE" />
          <path d="M18 38V47C18 49.8 24.3 52 32 52C39.7 52 46 49.8 46 47V38" stroke="#0369A1" strokeWidth="2.2" fill="#E0F2FE" />
        </svg>
      );

    case 'business-analytics':
    case 'excel':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2.5" />
          {/* Excel Spreadsheet Icon */}
          <rect x="16" y="16" width="32" height="32" rx="4" fill="#15803D" />
          <rect x="22" y="21" width="20" height="22" rx="2" fill="#DCFCE7" />
          <line x1="22" y1="28" x2="42" y2="28" stroke="#16A34A" strokeWidth="1.5" />
          <line x1="22" y1="35" x2="42" y2="35" stroke="#16A34A" strokeWidth="1.5" />
          <line x1="32" y1="21" x2="32" y2="43" stroke="#16A34A" strokeWidth="1.5" />
          {/* Bold X badge */}
          <rect x="14" y="24" width="16" height="16" rx="3" fill="#166534" />
          <text x="22" y="36" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="system-ui">X</text>
        </svg>
      );

    case 'android':
    case 'android-app-dev':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#F0FDF4" stroke="#22C55E" strokeWidth="2.5" />
          {/* Android Robot Head */}
          <path d="M22 35C22 26 26.5 21 32 21C37.5 21 42 26 42 35H22Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="2.2" />
          <line x1="26" y1="18" x2="23" y2="13" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="18" x2="41" y2="13" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="27" cy="28" r="2" fill="#14532D" />
          <circle cx="37" cy="28" r="2" fill="#14532D" />
          <rect x="22" y="38" width="20" height="9" rx="2" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
        </svg>
      );

    case 'flutter':
    case 'flutter-app-dev':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M38 15L22 31L27 36L48 15H38Z" fill="#38BDF8" />
          <path d="M38 31L28 41L33 46L48 31H38Z" fill="#0284C7" />
          <path d="M32 45L37 50H47L37 40L32 45Z" fill="#0369A1" />
        </svg>
      );

    case 'ui-ux':
    case 'ui-ux-design':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#FAF5FF" stroke="#A855F7" strokeWidth="2.5" />
          {/* Pen Tool / Paintbrush */}
          <path d="M22 42L25 31L35 21C36.5 19.5 39 19.5 40.5 21C42 22.5 42 25 40.5 26.5L30.5 36.5L22 42Z" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="35" cy="27" r="2" fill="#7E22CE" />
          <circle cx="44" cy="42" r="3.5" fill="#EC4899" />
          <circle cx="36" cy="47" r="3" fill="#3B82F6" />
        </svg>
      );

    case 'web-design':
    case 'web-designing':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2.5" />
          {/* Desktop Monitor with Website Layout */}
          <rect x="15" y="16" width="34" height="24" rx="3" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
          <rect x="15" y="16" width="34" height="6" fill="#DBEAFE" />
          <circle cx="19" cy="19" r="1.2" fill="#EF4444" />
          <circle cx="23" cy="19" r="1.2" fill="#F59E0B" />
          <circle cx="27" cy="19" r="1.2" fill="#10B981" />
          <rect x="19" y="26" width="12" height="10" rx="1.5" fill="#93C5FD" />
          <line x1="34" y1="26" x2="44" y2="26" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="34" y1="30" x2="42" y2="30" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M28 40V46H36V40" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="46" x2="40" y2="46" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'fullstack':
    case 'fullstack-web-dev':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2.5" />
          {/* Code brackets </> */}
          <path d="M25 24L17 32L25 40" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M39 24L47 32L39 40" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 20L30 44" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'java':
    case 'java-fullstack':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2.5" />
          {/* Steaming Coffee Cup */}
          <path d="M20 28H40V39C40 43.4 36.4 47 32 47H28C23.6 47 20 43.4 20 39V28Z" fill="#EA580C" />
          <path d="M40 31H44C46.2 31 48 32.8 48 35C48 37.2 46.2 39 44 39H40" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M26 23C25 20 27 18 26 15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 23C31 19 33 17 32 14" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          <path d="M38 23C37 20 39 18 38 15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 49H44" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'mern':
    case 'mern-stack':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2.5" />
          {/* MERN 4 circular badges */}
          <circle cx="24" cy="24" r="8" fill="#10B981" />
          <text x="24" y="28" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui">M</text>
          <circle cx="40" cy="24" r="8" fill="#3B82F6" />
          <text x="40" y="28" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui">E</text>
          <circle cx="24" cy="40" r="8" fill="#06B6D4" />
          <text x="24" y="44" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui">R</text>
          <circle cx="40" cy="40" r="8" fill="#84CC16" />
          <text x="40" y="44" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui">N</text>
        </svg>
      );

    case 'cybersecurity':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2.5" />
          <path d="M32 15L45 20V32C45 40 39.5 46.5 32 49C24.5 46.5 19 40 19 32V20L32 15Z" fill="#DCFCE7" stroke="#15803D" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="32" cy="30" r="3" fill="#15803D" />
          <path d="M32 33V39" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'vlsi':
    case 'vlsi-design':
    case 'vlsi-internship':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#F5F3FF" stroke="#9333EA" strokeWidth="2.5" />
          {/* Microprocessor Architecture */}
          <rect x="20" y="20" width="24" height="24" rx="4" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="2" />
          <rect x="26" y="26" width="12" height="12" rx="2" fill="#7E22CE" />
          {/* Bus lines */}
          <path d="M12 26H20M12 32H20M12 38H20" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
          <path d="M44 26H52M44 32H52M44 38H52" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 12V20M32 12V20M38 12V20" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 44V52M32 44V52M38 44V52" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'ev-automobile':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2.5" />
          {/* Electric Vehicle */}
          <path d="M16 36L20 24C21 21 24 19 28 19H36C40 19 43 21 44 24L48 36V43H16V36Z" fill="#FFEDD5" stroke="#C2410C" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="23" cy="43" r="5" fill="#C2410C" />
          <circle cx="23" cy="43" r="2" fill="#FFFFFF" />
          <circle cx="41" cy="43" r="5" fill="#C2410C" />
          <circle cx="41" cy="43" r="2" fill="#FFFFFF" />
          {/* Windshield */}
          <path d="M22 25L24 33H40L42 25H22Z" fill="#FED7AA" stroke="#C2410C" strokeWidth="1.5" />
          {/* Electric Lightning Bolt */}
          <path d="M33 22L30 29H34L31 35" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'iot':
    case 'iot-embedded':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#EFF6FF" stroke="#0284C7" strokeWidth="2.5" />
          {/* IoT Device with Antenna waves */}
          <rect x="22" y="24" width="20" height="24" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
          <text x="32" y="38" fill="#0369A1" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui">IOT</text>
          {/* Wireless Waves */}
          <path d="M16 28C14 30 14 34 16 36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <path d="M48 28C50 30 50 34 48 36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 24C9 28 9 36 12 40" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M52 24C55 28 55 36 52 40" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    case 'drone':
    case 'drone-uav':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#FAF5FF" stroke="#9333EA" strokeWidth="2.5" />
          {/* Drone Quadcopter */}
          <circle cx="32" cy="32" r="6" fill="#9333EA" />
          <line x1="20" y1="20" x2="44" y2="44" stroke="#7E22CE" strokeWidth="2.5" />
          <line x1="44" y1="20" x2="20" y2="44" stroke="#7E22CE" strokeWidth="2.5" />
          {/* 4 Rotors */}
          <circle cx="18" cy="18" r="4" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="2" />
          <circle cx="46" cy="18" r="4" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="2" />
          <circle cx="18" cy="46" r="4" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="2" />
          <circle cx="46" cy="46" r="4" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="2" />
        </svg>
      );

    case 'cad-mechanical':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#FAF5FF" stroke="#7E22CE" strokeWidth="2.5" />
          {/* Gear / Mechanical CAD */}
          <circle cx="32" cy="32" r="14" fill="#E9D5FF" stroke="#6B21A8" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="5" fill="#FFFFFF" stroke="#6B21A8" strokeWidth="2" />
          <path d="M32 14V18M32 46V50M14 32H18M46 32H50" stroke="#6B21A8" strokeWidth="3" strokeLinecap="round" />
          <path d="M19 19L22 22M42 42L45 45M45 19L42 22M19 45L22 42" stroke="#6B21A8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'solidworks':
    case 'solidworks-cad':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2.5" />
          {/* SolidWorks 3D Red Cube */}
          <path d="M32 15L47 23V39L32 47L17 39V23L32 15Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          <path d="M32 15V47M17 23L32 31L47 23" stroke="#B91C1C" strokeWidth="2" />
          <text x="32" y="35" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="system-ui">SW</text>
        </svg>
      );

    case 'autocad':
    case 'autocad-mechanical':
    case 'autocad-civil':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#FEF2F2" stroke="#E11D48" strokeWidth="2.5" />
          {/* AutoCAD Red Ribbon 'A' */}
          <path d="M32 14L46 48H39L35 38H29L25 48H18L32 14Z" fill="#E11D48" />
          <path d="M32 23L30 33H34L32 23Z" fill="#FFFFFF" />
          <text x="42" y="47" fill="#9F1239" fontSize="9" fontWeight="900" fontFamily="system-ui">CAD</text>
        </svg>
      );

    case 'revit':
    case 'bim-revit':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
          {/* Autodesk Revit 'R' Structure */}
          <rect x="18" y="16" width="28" height="32" rx="5" fill="#1D4ED8" />
          <text x="32" y="38" fill="#FFFFFF" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="system-ui">R</text>
        </svg>
      );

    default:
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="52" height="52" rx="16" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="10" fill="#3B82F6" />
        </svg>
      );
  }
}
