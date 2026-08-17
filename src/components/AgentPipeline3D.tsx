"use client";

import { Brain, FileSearch, Scale, Landmark, Check, Loader2, Sparkles } from "lucide-react";

type Phase = "idle" | "reading" | "extracting" | "translating" | "negotiating" | "done" | "error";

interface Props {
  phase: Phase;
  findingCount: number;
  fileName: string | null;
}

const AGENT_NODES = [
  {
    id: "auditor",
    title: "Risk Auditor",
    subtitle: "Clause Extraction",
    icon: FileSearch,
    color: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/30",
    border: "border-cyan-500/50",
    glow: "#06b6d4",
    detail: "Scanning text & extracting high-risk provisions...",
  },
  {
    id: "advocate",
    title: "Business Advocate",
    subtitle: "Plain English & Impact",
    icon: Scale,
    color: "from-indigo-500 to-violet-600",
    shadow: "shadow-indigo-500/30",
    border: "border-indigo-500/50",
    glow: "#6366f1",
    detail: "Evaluating financial exposure & translating legalese...",
  },
  {
    id: "strategist",
    title: "Negotiation Strategist",
    subtitle: "Counter-Clause & Email",
    icon: Landmark,
    color: "from-purple-500 to-pink-600",
    shadow: "shadow-purple-500/30",
    border: "border-purple-500/50",
    glow: "#a855f7",
    detail: "Drafting counter-proposals & ready-to-send email...",
  },
];

function phaseIdx(p: Phase): number {
  switch (p) {
    case "idle":
    case "reading":
      return -1;
    case "extracting":
      return 0;
    case "translating":
      return 1;
    case "negotiating":
      return 2;
    case "done":
    case "error":
      return 3;
  }
}

export function AgentPipeline3D({ phase, findingCount, fileName }: Props) {
  const activeIdx = phaseIdx(phase);
  const isDone = phase === "done";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-[#0e162a] via-[#0b1021] to-[#070a16] p-6 shadow-2xl sm:p-8">
      {/* Background 3D Grid lines */}
      <div className="absolute inset-0 bg-grid-mesh opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/40">
            <Brain size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-white">
                Multi-Agent Execution Pipeline
              </h3>
              <span className="flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                <Sparkles size={11} /> Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {fileName ? `Analyzing: ${fileName}` : "3 autonomous agents working in a single pass"}
            </p>
          </div>
        </div>

        {isDone && (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-300 shadow-lg shadow-emerald-500/20">
            <Check size={14} /> Analysis complete ({findingCount} findings)
          </span>
        )}
      </div>

      {/* 3D Agent Nodes Flow */}
      <div className="relative z-10 mt-8 grid gap-6 md:grid-cols-3">
        {AGENT_NODES.map((node, i) => {
          const isActive = activeIdx === i;
          const isCompleted = activeIdx > i || isDone;

          return (
            <div
              key={node.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-500 ${
                isActive
                  ? `${node.border} bg-slate-900/90 shadow-xl ${node.shadow} translate-y-[-4px]`
                  : isCompleted
                    ? "border-emerald-500/30 bg-[#0c1322] shadow-md"
                    : "border-slate-800/80 bg-[#090d18]/60 opacity-60"
              }`}
            >
              {/* Laser Connector Line (Desktop) */}
              {i < 2 && (
                <div className="hidden md:block absolute -right-3 top-1/2 z-20 h-0.5 w-6 -translate-y-1/2 bg-slate-800">
                  {(isCompleted || isActive) && (
                    <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" />
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-transform duration-300 group-hover:scale-110 ${node.color}`}
                  >
                    <node.icon size={20} />
                  </div>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isActive
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                          : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check size={12} /> : i + 1}
                  </span>
                </div>

                <h4 className="mt-4 text-sm font-bold text-white">{node.title}</h4>
                <p className="text-[11px] font-medium text-slate-400">{node.subtitle}</p>
              </div>

              <div className="mt-4 border-t border-slate-800/60 pt-3">
                {isActive ? (
                  <p className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                    <Loader2 size={13} className="animate-spin shrink-0 text-indigo-400" />
                    <span>{node.detail}</span>
                  </p>
                ) : isCompleted ? (
                  <p className="text-xs text-emerald-400 font-medium">✓ Step verified</p>
                ) : (
                  <p className="text-xs text-slate-500">Standby</p>
                )}
              </div>

              {/* Node Glow overlay on active */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none blur-xl transition-opacity"
                  style={{ background: node.glow }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
