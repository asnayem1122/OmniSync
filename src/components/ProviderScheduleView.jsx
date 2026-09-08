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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 spatial-panel rounded-2xl p-5 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 shadow-spatial-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Specialist Schedule & Dispatch Timeline</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-800 dark:text-teal-300 font-extrabold border border-teal-500/30 shadow-xs">
              Today's Agenda
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Visual breakdown of active appointments and blocked windows used by the matching engine to guarantee zero collision.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs px-4 py-2.5 rounded-xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Block Out Time Slot
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="spatial-card rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 shadow-spatial-sm">
          <span className="text-[10px] uppercase font-extrabold text-slate-500 dark:text-slate-400 block">Total Appointments</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{busySlotsCount}</span>
          <span className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 block font-semibold">Synced with Matching Engine</span>
        </div>
        <div className="spatial-card rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 shadow-spatial-sm">
          <span className="text-[10px] uppercase font-extrabold text-slate-500 dark:text-slate-400 block">Working Window</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">08:00 - 20:00</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block font-medium">12 Hours Operational Span</span>
        </div>
        <div className="spatial-card rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 shadow-spatial-sm">
          <span className="text-[10px] uppercase font-extrabold text-slate-500 dark:text-slate-400 block">Collision Shield</span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">Protected</span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5 block font-semibold">Zero Double-Booking Guarantee</span>
        </div>
      </div>

      {/* Visual Timeline View */}
      <div className="spatial-panel rounded-3xl p-6 sm:p-8 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 shadow-spatial-md">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
            <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Timeline Visualization</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/60" />
              <span className="text-slate-700 dark:text-slate-300">Booked / Busy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
              <span className="text-slate-700 dark:text-slate-300">Open Dispatch Window</span>
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
                    ? 'bg-amber-500/10 dark:bg-gradient-to-r dark:from-amber-500/15 dark:via-rose-500/10 dark:to-amber-500/5 border-amber-500/40 shadow-xs'
                    : 'bg-white/60 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/5 hover:bg-white dark:hover:border-white/15'
                }`}
              >
                {/* Time Label */}
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <Clock className={`w-4 h-4 ${isBusy ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className={`text-xs font-bold ${isBusy ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {time.label}
                  </span>
                </div>

                {/* Status Content */}
                <div className="flex-1">
                  {isBusy ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                        BUSY • {slot.title}
                      </span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                        Client: {slot.customerName || 'Customer'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-auto font-medium">
                        {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                      <span>Available for incoming service dispatch</span>
                    </div>
                  )}
                </div>

                {/* Right Indicator */}
                <div className="shrink-0 text-right">
                  {isBusy ? (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-400 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/25">
                      Blocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="spatial-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/90 dark:border-white/20 bg-white dark:bg-slate-900 shadow-spatial-lg relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">Block Out Time Slot</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Manually block a window so the matching algorithm will never assign overlapping calls.
            </p>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title / Reason</label>
                <input
                  type="text"
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  required
                  className="w-full spatial-input rounded-xl px-3.5 py-2.5 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Client / Purpose</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full spatial-input rounded-xl px-3.5 py-2.5 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Start Hour</label>
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-full spatial-input rounded-xl px-3.5 py-2.5 text-sm font-semibold"
                  >
                    {HOURS.map((h) => (
                      <option key={h.hour} value={h.hour} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">End Hour</label>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-full spatial-input rounded-xl px-3.5 py-2.5 text-sm font-semibold"
                  >
                    {HOURS.map((h) => (
                      <option key={h.hour} value={h.hour} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
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
                  className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingSlot}
                  className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 cursor-pointer"
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

