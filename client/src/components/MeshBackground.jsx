import React from 'react';

export default function MeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#070C18]">
      {/* Primary Emerald Gradient Orb */}
      <div className="absolute -top-[15%] left-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-emerald-600/25 to-teal-500/10 blur-[130px] animate-pulse-slow" />

      {/* Deep Teal / Cyan Ambient Orb */}
      <div className="absolute top-[35%] -right-[10%] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-teal-500/20 via-cyan-600/15 to-emerald-700/10 blur-[150px]" />

      {/* Indigo / Slate Accent Base Orb */}
      <div className="absolute -bottom-[20%] left-[25%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-slate-900 via-emerald-950/20 to-teal-900/15 blur-[160px]" />

      {/* Subtle Grid Lines Overlay for Tech Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]"
      />
    </div>
  );
}
