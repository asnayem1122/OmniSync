import React from 'react';

export default function MeshBackground({ theme = 'light' }) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#070C18]' : 'bg-[#F4F7FC]'
      }`}
    >
      {/* Primary Emerald / Mint Gradient Orb */}
      <div
        className={`absolute -top-[15%] left-[8%] w-[620px] h-[620px] rounded-full blur-[140px] animate-pulse-slow transition-all duration-700 ${
          isDark
            ? 'bg-gradient-to-br from-emerald-600/25 to-teal-500/10'
            : 'bg-gradient-to-br from-emerald-300/40 via-teal-200/30 to-emerald-100/10'
        }`}
      />

      {/* Luminous Sky / Cyan Spatial Orb */}
      <div
        className={`absolute top-[30%] -right-[10%] w-[680px] h-[680px] rounded-full blur-[150px] transition-all duration-700 ${
          isDark
            ? 'bg-gradient-to-bl from-teal-500/20 via-cyan-600/15 to-emerald-700/10'
            : 'bg-gradient-to-bl from-sky-300/35 via-cyan-200/30 to-teal-100/20'
        }`}
      />

      {/* Soft Indigo / Pearlescent Lavender Base Orb */}
      <div
        className={`absolute -bottom-[20%] left-[20%] w-[750px] h-[750px] rounded-full blur-[160px] transition-all duration-700 ${
          isDark
            ? 'bg-gradient-to-tr from-slate-900 via-emerald-950/20 to-teal-900/15'
            : 'bg-gradient-to-tr from-indigo-200/30 via-slate-200/25 to-emerald-100/20'
        }`}
      />

      {/* Spatial Depth Coordinate Dot Grid */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark
            ? 'opacity-[0.04] bg-[radial-gradient(#10B981_1px,transparent_1px)]'
            : 'opacity-[0.07] bg-[radial-gradient(#0F172A_1.2px,transparent_1.2px)]'
        } [background-size:28px_28px]`}
      />
    </div>
  );
}

