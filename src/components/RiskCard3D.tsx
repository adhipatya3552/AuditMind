"use client";

import { useState } from "react";
import {
  FileText,
  Scale,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import type { RiskFinding, Severity } from "@/types";
import { use3dTilt } from "@/hooks/use3dTilt";

interface Props {
  finding: RiskFinding;
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

function severityBadge(severity: Severity) {
  switch (severity) {
    case "HIGH":
      return {
        cls: "bg-red-500/15 text-red-400 border-red-500/30 shadow-red-500/10",
        dot: "bg-red-400",
      };
    case "MEDIUM":
      return {
        cls: "bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-amber-500/10",
        dot: "bg-amber-400",
      };
    case "LOW":
      return {
        cls: "bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-sky-500/10",
        dot: "bg-sky-400",
      };
  }
}

export function RiskCard3D({ finding, index, isSelected, onSelect }: Props) {
  const [activeTab, setActiveTab] = useState<"clause" | "impact" | "counter">(
    "impact"
  );

  const { ref, style, handleMouseMove, handleMouseLeave } = use3dTilt({
    maxRotation: 6,
    scale: 1.01,
  });

  const b = severityBadge(finding.severity);
  const isOpen = isSelected;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: style.transform,
        transition: style.transition,
      }}
      className={`transform-gpu overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSelected
          ? "border-indigo-500 bg-[#0f172a] shadow-xl shadow-indigo-500/20"
          : "border-slate-800 bg-[#0d1222] hover:border-slate-700"
      }`}
    >
      <button
        onClick={onSelect}
        className="flex w-full items-start gap-4 p-5 text-left focus:outline-none"
      >
        <div
          className={`mt-0.5 flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 ${b.cls}`}
        >
          <span className={`h-2 w-2 rounded-full ${b.dot}`} />
          <span className="text-[11px] font-extrabold tracking-wider">
            {finding.severity}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
            <h3 className="font-bold text-white text-base leading-snug">
              {finding.title}
            </h3>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-slate-300">
            {finding.plainEnglish}
          </p>
        </div>

        <ChevronDown
          className={`mt-1 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-indigo-400" : ""
          }`}
          size={18}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-800 bg-[#080d1a] p-5 space-y-4">
          {/* Interactive Mode Toggle */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-1">
            <button
              onClick={() => setActiveTab("impact")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                activeTab === "impact"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Business Impact
            </button>
            <button
              onClick={() => setActiveTab("clause")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                activeTab === "clause"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Original Clause
            </button>
            {finding.counterClause && (
              <button
                onClick={() => setActiveTab("counter")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "counter"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Counter-Clause
              </button>
            )}
          </div>

          {/* Active Tab Content */}
          {activeTab === "impact" && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                    <Scale size={13} className="text-amber-400" /> Financial & Operational Impact
                  </p>
                  <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                    {finding.businessImpact}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                    <ShieldCheck size={13} /> Recommended Action
                  </p>
                  <p className="mt-2 text-sm text-emerald-200 leading-relaxed font-medium">
                    {finding.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clause" && (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                <FileText size={13} className="text-indigo-400" /> Direct Clause Quote
              </p>
              <p className="mt-2 rounded-xl border-l-4 border-indigo-500 bg-slate-900/80 p-4 font-mono text-xs text-slate-200 leading-relaxed">
                {finding.clauseText}
              </p>
            </div>
          )}

          {activeTab === "counter" && finding.counterClause && (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                <ArrowRight size={13} /> Proposed Counter-Clause for Redline
              </p>
              <p className="mt-2 rounded-xl border-l-4 border-emerald-500 bg-slate-900/80 p-4 text-xs text-emerald-100 leading-relaxed font-sans">
                {finding.counterClause}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
