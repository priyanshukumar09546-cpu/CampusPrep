import React from 'react';
import { Sparkles, Plus } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Sparkles,
  title = 'No records found',
  description = 'There are no active entries in this module at the moment.',
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction
}) {
  return (
    <div className="prma-empty-state max-w-xl mx-auto my-6 p-8 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#780D29]/10 to-[#D4A63F]/20 flex items-center justify-center text-[#780D29] mb-4 shadow-inner">
        <Icon className="w-8 h-8 text-[#780D29]" strokeWidth={2} />
      </div>

      <h3 className="text-lg font-extrabold text-slate-800 tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 leading-relaxed max-w-md mb-6 font-medium">
        {description}
      </p>

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionText && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#780D29] to-[#57091E] hover:from-[#8E1032] hover:to-[#680B24] border border-[#D4A63F]/40 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 text-[#D4A63F]" strokeWidth={2.4} />
              <span>{actionText}</span>
            </button>
          )}

          {secondaryActionText && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
            >
              <span>{secondaryActionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
