import React, { useState } from 'react';
import {
  Trophy,
  UserPlus,
  MessageSquare,
  Plus,
  Calendar,
  Users,
  Award,
  ExternalLink,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function EventsSection({
  subTab = 'hackathons',
  events = [],
  registrations = [],
  loading = false,
  onRefresh,
  onAddEventModal,
  onDeleteEvent
}) {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D4A63F]" />
            {subTab === 'hackathons' && 'Hackathons, Coding Challenges & Technical Events'}
            {subTab === 'participants' && 'Participant Registrations'}
            {subTab === 'community' && 'PRMA Tech Developer & Student Community'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {events.length} Corporate Technical Challenges Configured
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'hackathons' && (
            <button
              type="button"
              onClick={onAddEventModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Plus className="w-4 h-4 text-[#D4A63F]" />
              <span>Create Event</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh Events"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: HACKATHONS */}
      {subTab === 'hackathons' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((evt, idx) => (
              <div
                key={evt.eventId || idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#D4A63F]/15 text-[#854D0E] flex items-center justify-center font-bold">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className={`prma-badge ${evt.status === 'Completed' ? 'prma-badge-approved' : 'prma-badge-gold'}`}>
                    {evt.status || 'Upcoming'}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{evt.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{evt.description}</p>
                </div>

                <div className="space-y-1 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span>Event Date:</span>
                    <span className="font-bold text-slate-800">{evt.eventDate}</span>
                  </div>
                  {evt.prizePool && (
                    <div className="flex items-center justify-between">
                      <span>Prize Pool:</span>
                      <span className="font-bold text-emerald-700 font-mono">{evt.prizePool}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Mode:</span>
                    <span className="font-bold text-slate-800">{evt.mode || 'Virtual'}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">{evt.eventId}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteEvent(evt.eventId || evt._id)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <EmptyState
              icon={Trophy}
              title="No events or hackathons scheduled"
              description="Create corporate coding competitions and technical hackathons with registration deadlines, prize pools, and live judging."
              actionText="Create Event"
              onAction={onAddEventModal}
            />
          )}
        </div>
      )}

      {/* SUB-TAB 2: PARTICIPANTS */}
      {subTab === 'participants' && (
        <EmptyState
          icon={UserPlus}
          title="No event registrations recorded"
          description="When students register for active PRMA Tech hackathons and workshops, participant records will populate here."
        />
      )}

      {/* SUB-TAB 3: COMMUNITY */}
      {subTab === 'community' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 max-w-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Official WhatsApp Community</h3>
              <p className="text-xs text-slate-500">Official student and intern broadcast channel.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 break-all">
            https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G
          </div>

          <a
            href="https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <span>Open WhatsApp Community</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
