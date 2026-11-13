import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  badge,
  onClick,
  accent = 'burgundy'
}) {
  const getAccentStyles = () => {
    switch (accent) {
      case 'gold':
        return {
          iconBg: 'bg-[#D4A63F]/15 text-[#854D0E] border-[#D4A63F]/30',
          borderHover: 'hover:border-[#D4A63F]'
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          borderHover: 'hover:border-emerald-400'
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
          borderHover: 'hover:border-blue-400'
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
          borderHover: 'hover:border-amber-400'
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
          borderHover: 'hover:border-purple-400'
        };
      default: // burgundy
        return {
          iconBg: 'bg-[#780D29]/10 text-[#780D29] border-[#780D29]/20',
          borderHover: 'hover:border-[#780D29]'
        };
    }
  };

  const styles = getAccentStyles();

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm prma-card-hover relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${styles.borderHover}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${styles.iconBg}`}>
          <Icon className="w-5 h-5" strokeWidth={2.2} />
        </div>
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : (value || '0')}
        </span>
        {badge && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        )}
      </div>

      {/* Bottom Subtitle / Trend */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>{subtitle || 'Database verified'}</span>
        {trend && (
          <span className={`inline-flex items-center gap-1 font-bold ${trend.positive ? 'text-emerald-600' : 'text-slate-500'}`}>
            {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.text}
          </span>
        )}
      </div>
    </div>
  );
}
