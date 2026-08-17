"use client";

import { use3dTilt } from "@/hooks/use3dTilt";

interface Props {
  score: number;
  label: string;
}

function riskDetails(score: number) {
  if (score >= 75)
    return {
      label: "CRITICAL",
      color: "#ef4444",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      shadow: "shadow-red-500/20",
    };
  if (score >= 50)
    return {
      label: "HIGH",
      color: "#f59e0b",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      shadow: "shadow-amber-500/20",
    };
  if (score >= 25)
    return {
      label: "MEDIUM",
      color: "#facc15",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      text: "text-yellow-300",
      shadow: "shadow-yellow-500/20",
    };
  return {
    label: "LOW",
    color: "#10b981",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    shadow: "shadow-emerald-500/20",
  };
}

export function ScoreGauge3D({ score }: Props) {
  const { ref, style, handleMouseMove, handleMouseLeave } = use3dTilt({
    maxRotation: 12,
    scale: 1.03,
  });

  const d = riskDetails(score);

  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: style.transform,
        transition: style.transition,
      }}
      className="transform-gpu relative cursor-pointer select-none rounded-3xl border border-slate-700/60 bg-gradient-to-br from-[#12192e] via-[#0b1020] to-[#070a14] p-6 shadow-2xl transition-all duration-300 hover:border-slate-500"
    >
      {/* Dynamic Glare Effect */}
      {style.isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-20 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${style.glareX}% ${style.glareY}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
          }}
        />
      )}

      <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:gap-6">
        {/* 3D Gauge Circle */}
        <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full opacity-30 blur-xl animate-pulse-glow"
            style={{ background: d.color }}
          />

          <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90 transform-gpu">
            {/* Track */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
            />
            {/* Progress */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Inner Score Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black text-white drop-shadow-md">
              {score}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Score / 100
            </span>
          </div>
        </div>

        {/* Risk Status Label */}
        <div className="mt-4 text-center sm:mt-0 sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold tracking-wider ${d.bg} ${d.border} ${d.text} ${d.shadow}`}
            >
              {d.label} RISK LEVEL
            </span>
          </div>
          <h4 className="mt-2 text-base font-bold text-white">
            Overall Contract Risk
          </h4>
          <p className="mt-1 max-w-xs text-xs text-slate-400 leading-relaxed">
            Evaluated by AuditMind multi-agent engine based on strict liability, penalty terms, and termination clauses.
          </p>
        </div>
      </div>
    </div>
  );
}
