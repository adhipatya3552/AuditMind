"use client";

import { useState } from "react";
import { FileText, ShieldAlert, Sparkles, Check, ChevronRight } from "lucide-react";
import type { RiskFinding } from "@/types";
import { use3dTilt } from "@/hooks/use3dTilt";

interface Props {
  findings: RiskFinding[];
  selectedIdx: number | null;
  onSelect: (idx: number) => void;
  parties: string[];
}

export function InteractiveContract3D({
  findings,
  selectedIdx,
  onSelect,
  parties,
}: Props) {
  const { ref, style, handleMouseMove, handleMouseLeave } = use3dTilt({
    maxRotation: 6,
    scale: 1.01,
  });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: style.transform,
        transition: style.transition,
      }}
      className="transform-gpu relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-b from-[#0f172a] via-[#090e1a] to-[#060912] p-6 shadow-2xl transition-all duration-300 hover:border-indigo-500/40 sm:p-8"
    >
      {/* 3D Paper Sheet Simulation */}
      <div className="relative mx-auto max-w-2xl rounded-2xl border border-slate-700/40 bg-[#0d1322] p-6 shadow-2xl sm:p-8">
        {/* Paper top accent bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-indigo-400" />
            <span className="text-xs font-bold tracking-wide text-slate-200">
              CONTRACT DOCUMENT PREVIEW
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {parties.length > 0 ? parties.join(" vs ") : "Standard Agreement"}
          </span>
        </div>

        {/* Document Body Simulation with Highlighted Risk Hotspots */}
        <div className="mt-6 space-y-4 text-xs font-mono text-slate-400 leading-relaxed">
          <p className="border-b border-slate-800/40 pb-2">
            THIS AGREEMENT is entered into by and between the undersigned parties...
          </p>

          {/* Interactive Risk Markers embedded inside the document preview */}
          <div className="space-y-3 pt-2">
            {findings.map((finding, idx) => {
              const isSelected = selectedIdx === idx;
              const isHigh = finding.severity === "HIGH";

              return (
                <div
                  key={idx}
                  onClick={() => onSelect(idx)}
                  className={`group relative cursor-pointer rounded-xl border p-3.5 transition-all duration-300 ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/15 shadow-lg shadow-indigo-500/20 translate-x-1"
                      : isHigh
                        ? "border-red-500/30 bg-red-500/10 hover:border-red-500/60"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          isHigh
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-white">
                        {finding.title}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isHigh ? "text-red-400" : "text-amber-300"
                      }`}
                    >
                      {finding.severity}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-[11px] text-slate-300 italic font-sans">
                    {finding.clauseText}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-indigo-300 font-sans font-medium">
                    <span>Click to focus breakdown</span>
                    <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
