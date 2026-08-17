// AuditMind — single polished 3D interactive dashboard, client component.
"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertTriangle,
  Brain,
  Check,
  Copy,
  FileText,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import type { AuditResult } from "@/types";
import { SAMPLE_AUDIT } from "@/lib/sampleAudit";
import { AgentPipeline3D } from "@/components/AgentPipeline3D";
import { ScoreGauge3D } from "@/components/ScoreGauge3D";
import { InteractiveContract3D } from "@/components/InteractiveContract3D";
import { RiskCard3D } from "@/components/RiskCard3D";

type Phase = "idle" | "reading" | "extracting" | "translating" | "negotiating" | "done" | "error";

/**
 * Convert a Uint8Array to a base64 string in chunks.
 *
 * Calling `btoa(String.fromCharCode(...buf))` on a multi-MB buffer spreads every
 * byte as an individual argument to fromCharCode and can throw
 * "Maximum call stack size exceeded". Chunking avoids that entirely.
 */
function fileToBase64(bytes: Uint8Array): string {
  let binary = "";
  const CHUNK = 0x8000; // 32 KB per pass — safe on every engine
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

/** Strip markdown emphasis/heading artifacts so email text copies clean. */
function cleanEmailText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function Home() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedRiskIdx, setSelectedRiskIdx] = useState<number | null>(0);
  const [severityFilter, setSeverityFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  const runAgentPhases = useCallback((name: string) => {
    setError(null);
    setResult(null);
    setFileName(name);
    setPhase("reading");
    setTimeout(() => setPhase("extracting"), 600);
    setTimeout(() => setPhase("translating"), 1600);
    setTimeout(() => setPhase("negotiating"), 2600);
  }, []);

  const finishWith = useCallback((audit: AuditResult, name: string) => {
    setPhase("done");
    setResult(audit);
    setFileName(name);
    setCopied(false);
    setSelectedRiskIdx(0);
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
    setResult(null);
    setError(null);
    setFileName(null);
    setCopied(false);
    setSelectedRiskIdx(null);
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file || file.size > 10 * 1024 * 1024) {
        setError("Please choose a PDF under 10 MB.");
        setPhase("idle");
        return;
      }
      const buf = await file.arrayBuffer();
      const b64 = fileToBase64(new Uint8Array(buf));
      runAgentPhases(file.name);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: file.name, pdfBase64: b64 }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Analysis failed.");
        }
        finishWith(json.result as AuditResult, file.name);
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error
            ? e.message
            : "The AI engine could not analyze this contract. Please try again."
        );
        setPhase("error");
      }
    },
    [finishWith, runAgentPhases]
  );

  const loadSample = useCallback(() => {
    runAgentPhases("sample-vendor-agreement.pdf");
    setTimeout(() => finishWith(SAMPLE_AUDIT, "sample-vendor-agreement.pdf"), 3600);
  }, [finishWith, runAgentPhases]);

  const counts = result
    ? {
        High: result.keyRisks.filter((r) => r.severity === "HIGH").length,
        Medium: result.keyRisks.filter((r) => r.severity === "MEDIUM").length,
        Low: result.keyRisks.filter((r) => r.severity === "LOW").length,
      }
    : null;

  const filteredRisks = result
    ? result.keyRisks.filter((r) =>
        severityFilter === "ALL" ? true : r.severity === severityFilter
      )
    : [];

  const copyEmail = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(cleanEmailText(result.negotiationEmail));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#03050d] via-[#060a17] to-[#0a0e1c] text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#040712]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-white">AuditMind</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                AI Contract Risk Auditor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {result && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-700 hover:text-white"
              >
                <X size={14} /> New Contract
              </button>
            )}
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 sm:flex">
              <Sparkles size={13} /> Gemini 2.5 Flash
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6">
        {/* Hero */}
        <section className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300 shadow-lg shadow-indigo-500/10">
            <Brain size={14} /> 3-Agent Autonomous Risk Auditor
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Turn complicated contracts into{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              clear business decisions
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            AuditMind scans complex contracts, identifies high-risk exposure, translates legalese into
            plain English, and drafts ready-to-send negotiation emails — in seconds. Built for freelancers and SMBs.
          </p>
        </section>

        {/* Upload / Idle State */}
        {phase === "idle" && (
          <section className="mx-auto mt-12 max-w-3xl">
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              className={`transform-gpu group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                dragOver
                  ? "border-indigo-400 bg-indigo-500/15 shadow-2xl shadow-indigo-500/20"
                  : "border-slate-700/80 bg-gradient-to-b from-[#0b1022] to-[#070b16] hover:border-indigo-500/60 hover:bg-[#0e152e]"
              }`}
            >
              {/* Scanline effect on drop zone */}
              <div className="scan-line opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-xl shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
                <Upload size={28} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">Upload your business contract</h3>
              <p className="mt-1 text-sm text-slate-400">
                Drop any contract PDF here or click to browse — up to 10 MB
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 btn-3d">
                <FileText size={16} /> Choose PDF File
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.currentTarget.value = "";
              }}
            />

            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-px flex-1 max-w-24 bg-slate-800" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">OR</span>
              <div className="h-px flex-1 max-w-24 bg-slate-800" />
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={loadSample}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white"
              >
                <Sparkles size={16} className="text-indigo-400" /> Try a Sample Vendor Agreement (Instant)
              </button>
            </div>

            {error && (
              <p className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertTriangle size={16} /> {error}
              </p>
            )}
          </section>
        )}

        {/* Processing State: 3D Agent Pipeline */}
        {(phase === "reading" || phase === "extracting" || phase === "translating" || phase === "negotiating") && (
          <section className="mx-auto mt-10 max-w-4xl">
            <AgentPipeline3D phase={phase} findingCount={0} fileName={fileName} />
          </section>
        )}

        {/* Error Fallback */}
        {phase === "error" && (
          <section className="mx-auto mt-10 max-w-2xl text-center">
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
              <AlertTriangle size={32} className="mx-auto text-red-400" />
              <h3 className="mt-3 text-lg font-bold text-white">Analysis Failed</h3>
              <p className="mt-1 text-sm text-slate-300">{error}</p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={loadSample}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500"
                >
                  Load Sample Analysis
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white"
                >
                  Try Again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Results Dashboard */}
        {phase === "done" && result && (
          <div className="mt-10 space-y-10">
            {/* 3D Agent Pipeline Banner (Completed Status) */}
            <AgentPipeline3D
              phase="done"
              findingCount={result.keyRisks.length}
              fileName={fileName}
            />

            {/* Summary Grid with Score Gauge */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <ScoreGauge3D score={result.overallRiskScore} label={result.overallRiskLabel} />
              </div>

              <div className="flex flex-col justify-between rounded-3xl border border-slate-700/60 bg-gradient-to-br from-[#0f172a] via-[#0a0f1d] to-[#060912] p-6 shadow-2xl lg:col-span-7 sm:p-8">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                    Executive Summary
                  </p>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    {result.contractSummary}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
                  <span className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                    {counts!.High} HIGH RISKS
                  </span>
                  <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                    {counts!.Medium} MEDIUM
                  </span>
                  <span className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300">
                    {counts!.Low} LOW
                  </span>
                  <span className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-300">
                    {result.keyRisks.length} Findings Total
                  </span>
                </div>
              </div>
            </section>

            {/* Interactive Document Preview & Clause-Level Findings Pair */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert size={20} className="text-indigo-400" />
                  <h2 className="text-xl font-black text-white">
                    Clause-Level Risk Breakdown
                  </h2>
                </div>

                {/* Severity Filter Tabs */}
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1">
                  {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSeverityFilter(filter)}
                      className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                        severityFilter === filter
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-12">
                {/* Left: 3D Contract Document Previewer */}
                <div className="lg:col-span-5">
                  <InteractiveContract3D
                    findings={result.keyRisks}
                    selectedIdx={selectedRiskIdx}
                    onSelect={(idx) => setSelectedRiskIdx(idx)}
                    parties={result.parties}
                  />
                </div>

                {/* Right: Detailed Risk Finding Cards */}
                <div className="space-y-4 lg:col-span-7">
                  {filteredRisks.length > 0 ? (
                    filteredRisks.map((finding, idx) => (
                      <RiskCard3D
                        key={idx}
                        finding={finding}
                        index={idx}
                        isSelected={selectedRiskIdx === idx}
                        onSelect={() => setSelectedRiskIdx(idx)}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#0d1222] p-8 text-center">
                      <ShieldCheck size={28} className="text-slate-600" />
                      <p className="mt-3 text-sm font-semibold text-slate-300">
                        No {severityFilter} risks in this contract
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try a different severity filter to see more findings.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Negotiation Email Section */}
            <section className="rounded-3xl border border-slate-700/60 bg-gradient-to-br from-[#0e1529] via-[#0a0f1d] to-[#060912] p-6 shadow-2xl sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <Mail size={20} className="text-violet-400" />
                  <h2 className="text-xl font-black text-white">
                    Negotiation Email Draft
                  </h2>
                </div>

                <button
                  onClick={copyEmail}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 btn-3d"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied to Clipboard!" : "Copy Negotiation Email"}
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                A ready-to-send draft addressing each flagged clause with suggested amendments. Customize the names before sending.
              </p>

              <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-slate-800 bg-[#080c18] p-6 font-sans text-sm leading-relaxed text-slate-200">
                {cleanEmailText(result.negotiationEmail)}
              </div>
            </section>

            {/* Legal Disclaimer */}
            <section className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-xs leading-relaxed text-slate-400">
                {result.disclaimer}
              </p>
            </section>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-800/80 pt-8 text-center text-xs text-slate-500">
          <p>AuditMind provides informational contract risk analysis, not legal advice.</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Powered by Gemini 2.5 Flash · Google AI Studio · Next.js · Vercel
          </p>
        </footer>
      </div>
    </main>
  );
}
