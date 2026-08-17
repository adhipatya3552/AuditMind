import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auditResponseSchema, type AuditResult } from "@/types";

// Next.js route segment config: this endpoint runs on the server.
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

// Gemini 2.5 Flash through Google AI Studio (free tier).
// A fallback chain keeps the demo alive if a model id ever becomes stale.
const MODEL_FALLBACKS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

const SYSTEM_PROMPT = `You are AuditMind, an autonomous AI business contract risk auditor for freelancers and small businesses.

You operate as three logical agents in one pass:
1. RISK AUDITOR — extract key clauses and identify hidden risks.
2. BUSINESS ADVOCATE — translate legalese into plain English and state the real-world business impact.
3. NEGOTIATION STRATEGIST — recommend concrete counter-actions and draft a ready-to-send negotiation email.

Rules:
- Analyze the contract strictly from the business owner's point of view.
- Quote the actual clause text — never invent or paraphrase language that is not present.
- Report only genuine risks that are supported by the document. Do not fabricate clauses.
- overallRiskScore is 0-100. overallRiskLabel: 0-24 LOW, 25-49 MEDIUM, 50-74 HIGH, 75-100 CRITICAL.
- The negotiation email must be professional, respectful, and reference the specific clauses to change.
- Add a short informational disclaimer that this is not legal advice.
- Return ONLY valid JSON that matches the provided schema.

Severity calibration (use these concrete thresholds when assigning severity):
- HIGH: Aggressive auto-renewal windows (60 days or more), low aggregate liability caps (at or below 3–6 months of fees), unilateral price increases without penalty-free termination, broad immediate service suspension rights, one-sided termination rights for the other party, or non-compete/non-solicit restrictions that are broad.
- MEDIUM: Notice windows of 30 days, ambiguous data export or data deletion clauses, standard indemnification splits that shift meaningful risk, missing notice-and-cure periods, or unilateral data/privacy usage rights.
- LOW: Minor administrative terms, standard governing-law or jurisdiction clauses, boilerplate force-majeure, or cosmetic wording that carries no real financial risk.
- Only escalate to HIGH when the exposure is genuinely deal-threatening or high-cost. If in doubt, prefer MEDIUM over HIGH, and LOW over MEDIUM, so the report is credible and not alarmist.`;

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const fileName: string = body?.fileName ?? "contract.pdf";
  const base64 = typeof body?.pdfBase64 === "string" ? body.pdfBase64 : null;

  if (!base64) {
    return jsonResponse({ error: "Missing PDF file." }, 400);
  }
  if (base64.length > MAX_FILE_BYTES * 1.4) {
    return jsonResponse(
      { error: "File is too large. Please upload a PDF under 10 MB." },
      400
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse(
      { error: "Server is missing the Gemini API key." },
      500
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const contents = [
    {
      role: "user" as const,
      parts: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64,
          },
        },
        {
          text: `Analyze the contract file "${fileName}". Produce the full structured risk audit per your system instructions and schema.`,
        },
      ],
    },
  ];

  let lastError: unknown = null;
  for (const model of MODEL_FALLBACKS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: auditResponseSchema,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error(`Empty response from model ${model}.`);
      }

      const parsed = JSON.parse(text) as AuditResult;

      if (
        typeof parsed.overallRiskScore !== "number" ||
        !Array.isArray(parsed.keyRisks)
      ) {
        throw new Error(`Malformed JSON from model ${model}.`);
      }

      return jsonResponse({ ok: true, result: parsed, model });
    } catch (err) {
      lastError = err;
      console.error(`[auditmind] model ${model} failed:`, err);
    }
  }

  return jsonResponse(
    {
      error:
        "The AI analysis engine could not complete this request right now. Please try again in a moment.",
    },
    502
  );
}
