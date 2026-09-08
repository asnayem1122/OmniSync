import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';

const HOURS = [
  { hour: 8, label: '08:00 AM' },
  { hour: 9, label: '09:00 AM' },
  { hour: 10, label: '10:00 AM' },
  { hour: 11, label: '11:00 AM' },
  { hour: 12, label: '12:00 PM' },
  { hour: 13, label: '01:00 PM' },
  { hour: 14, label: '02:00 PM' },
  { hour: 15, label: '03:00 PM' },
  { hour: 16, label: '04:00 PM' },
  { hour: 17, label: '05:00 PM' },
  { hour: 18, label: '06:00 PM' },
  { hour: 19, label: '07:00 PM' },
];

export default function ProviderScheduleView({
  provider,
  onAddManualSlot,
  isAddingSlot,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [slotTitle, setSlotTitle] = useState('Scheduled Maintenance');
  const [clientName, setClientName] = useState('Private Client');
  const [startHour, setStartHour] = useState('11');
  const [endHour, setEndHour] = useState('13');

  const slots = provider?.bookedSlots || [];

  // Helper to determine if an hour falls within any booked slot
  const getSlotForHour = (hourNumber) => {
    return slots.find((slot) => {
      const s = new Date(slot.start).getHours();
      const e = new Date(slot.end).getHours();
      return hourNumber >= s && hourNumber < e;
    });
  };

  const handleCreateSlot = (e) => {
    e.preventDefault();
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(startHour), 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(endHour), 0);

    onAddManualSlot({
      start: start.toISOString(),
      end: end.toISOString(),
      title: slotTitle,
      customerName: clientName,
    });

    setShowAddModal(false);
  };

  const busySlotsCount = slots.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-5 border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">Technician Schedule & Dispatch Timeline</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              Today's Agenda
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual breakdown of active jobs and blocked slots used by the matching engine to prevent collisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            Block Manual Time
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-slate-900/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Appointments</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{busySlotsCount}</span>
          <span className="text-[11px] text-teal-400 mt-0.5 block">Synced with Matching Engine</span>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-slate-900/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Working Window</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">08:00 - 20:00</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">12 Hours Operational Span</span>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-slate-900/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Collision Status</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">Protected</span>
          <span className="text-[11px] text-emerald-300 mt-0.5 block">Zero Double-Booking Guarantee</span>
        </div>
      </div>

      {/* Visual Timeline View */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/60">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span>Timeline Visualization</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/60" />
              <span className="text-slate-300">Booked / Busy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
              <span className="text-slate-300">Open Dispatch Window</span>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="space-y-2.5">
          {HOURS.map((time) => {
            const slot = getSlotForHour(time.hour);
            const isBusy = !!slot;

            return (
              <div
                key={time.hour}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isBusy
                    ? 'bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/5 border-amber-500/40 shadow-inner'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                {/* Time Label */}
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <Clock className={`w-4 h-4 ${isBusy ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className={`text-xs font-bold ${isBusy ? 'text-white' : 'text-slate-400'}`}>
                    {time.label}
                  </span>
                </div>

                {/* Status Content */}
                <div className="flex-1">
                  {isBusy ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                        BUSY • {slot.title}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">
                        Client: {slot.customerName || 'Customer'}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-auto">
                        {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-400/80">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Available for incoming service dispatch</span>
                    </div>
                  )}
                </div>

                {/* Right Indicator */}
                <div className="shrink-0 text-right">
                  {isBusy ? (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      Blocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Free
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 bg-slate-900 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Block Out Time Slot</h3>
            <p className="text-xs text-slate-400 mb-6">
              Manually block a window so the matching algorithm will never assign overlapping calls.
            </p>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title / Reason</label>
                <input
                  type="text"
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  required
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Client / Purpose</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Hour</label>
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
                  >
                    {HOURS.map((h) => (
                      <option key={h.hour} value={h.hour} className="bg-slate-900 text-white">
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Hour</label>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
                  >
                    {HOURS.map((h) => (
                      <option key={h.hour} value={h.hour} className="bg-slate-900 text-white">
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingSlot}
                  className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25"
                >
                  {isAddingSlot ? 'Saving...' : 'Confirm Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
