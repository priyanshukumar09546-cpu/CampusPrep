import React, { useEffect } from 'react';

export default function Splash({ onFinish }) {
  useEffect(() => {
    if (onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white px-6 py-12 select-none">
      <div className="w-full flex justify-end"></div>
      
      {/* Centered logo with glow effect */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative group">
          <div className="absolute -inset-6 bg-gradient-to-r from-[#7A2327]/70 via-[#992E33]/50 to-[#7A2327]/70 rounded-full blur-3xl opacity-80 animate-pulse pointer-events-none"></div>
          <img 
            src="/assets/logo-full.png" 
            alt="ProfessorVirus" 
            className="relative w-72 max-w-[85vw] object-contain drop-shadow-[0_15px_30px_rgba(122,35,39,0.6)] transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/assets/logo.png';
            }}
          />
        </div>
      </div>

      {/* Bottom pill: maroon #7A2327 */}
      <div className="w-full flex justify-center pb-6">
        <div className="px-6 py-2.5 rounded-full bg-[#7A2327] text-white/95 font-medium text-xs md:text-sm tracking-wide shadow-lg shadow-[#7A2327]/40 border border-white/10">
          Study Smart | Prepare Better.
        </div>
      </div>
    </div>
  );
}
