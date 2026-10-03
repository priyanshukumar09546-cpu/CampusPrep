import React from 'react';
import { ArrowLeft, Bell, HelpCircle } from 'lucide-react';

export default function Header({ 
  onNavigate, 
  showBack = false, 
  showBell = true, 
  showHelp = false,
  onBack,
  onOpenNotifications,
  onOpenHelp
}) {
  return (
    <header className="w-full bg-[#FFF7ED] px-5 pt-3 pb-2 flex items-center justify-between z-20 border-b border-orange-100/40 select-none">
      {/* Left Action */}
      <div className="w-8 flex items-center justify-start">
        {showBack && (
          <button 
            type="button"
            onClick={onBack || (() => onNavigate && onNavigate('home'))}
            className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
      </div>

      {/* Center Logo + Subtitle */}
      <div 
        onClick={() => onNavigate && onNavigate('home')}
        className="flex flex-col items-center justify-center cursor-pointer group text-center"
      >
        <img 
          src="/assets/logo-header.png" 
          alt="ProfessorVirus" 
          className="h-8 md:h-10 object-contain drop-shadow-2xs group-hover:opacity-95 transition-opacity" 
          onError={(e) => {
            e.currentTarget.src = '/assets/logo.png';
          }}
        />
        <span className="text-[10px] md:text-xs font-semibold text-stone-500 tracking-wider mt-0.5">
          BTech • BCA • MTech • MCA • MBA • BPharm
        </span>
      </div>

      {/* Right Action */}
      <div className="w-8 flex items-center justify-end">
        {showBell && (
          <button 
            type="button"
            onClick={onOpenNotifications || (() => alert('No new notifications'))}
            className="relative p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#7A2327]"></span>
          </button>
        )}
        {showHelp && !showBell && (
          <button 
            type="button"
            onClick={onOpenHelp || (() => alert('Need help? Contact support@campusprep.edu'))}
            className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Help"
          >
            <HelpCircle size={20} />
          </button>
        )}
      </div>
    </header>
  );
}
