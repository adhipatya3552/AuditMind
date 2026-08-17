// Shared types for AuditMind analysis results.

export type Severity = "HIGH" | "MEDIUM" | "LOW";

export interface RiskFinding {
  /** Short label, e.g. "Auto-renewal clause" */
  title: string;
  severity: Severity;
  /** The clause or contract language this finding refers to (quoted). */
  clauseText: string;
  /** What the clause actually does in plain English. */
  plainEnglish: string;
  /** Financial / operational impact on the business. */
  businessImpact: string;
  /** Concrete recommended action for the business owner. */
  recommendedAction: string;
  /** Proposed replacement language for negotiation (optional). */
  counterClause?: string;
}

export interface AuditResult {
  contractSummary: string;
  overallRiskScore: number; // 0-100
  overallRiskLabel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  parties: string[];
  keyRisks: RiskFinding[];
  negotiationEmail: string;
  disclaimer: string;
}

/** Shape enforced on Gemini via responseSchema. */
export const auditResponseSchema = {
  type: "object",
  properties: {
    contractSummary: {
      type: "string",
      description:
        "One-paragraph plain summary of the contract: parties, duration, value, subject matter.",
    },
    overallRiskScore: {
      type: "integer",
      description: "Overall risk score for the business, 0 to 100. Higher is riskier.",
      minimum: 0,
      maximum: 100,
    },
    overallRiskLabel: {
      type: "string",
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      description:
        "Label derived from the overall risk score: 0-24 LOW, 25-49 MEDIUM, 50-74 HIGH, 75-100 CRITICAL.",
    },
    parties: {
      type: "array",
      items: { type: "string" },
      description: "Named parties to the contract.",
    },
    keyRisks: {
      type: "array",
      description:
        "The most important risk findings, ordered most severe first. Return no more than 8 findings — only genuine, material risks.",
      maxItems: 8,
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short finding label." },
          severity: {
            type: "string",
            enum: ["HIGH", "MEDIUM", "LOW"],
            description:
              "Severity of the risk to the business owner. HIGH risks are deal-threatening.",
          },
          clauseText: {
            type: "string",
            description:
              "Short direct quote of the relevant contract clause or language.",
          },
          plainEnglish: {
            type: "string",
            description:
              "What this clause actually means, in plain non-legal language.",
          },
          businessImpact: {
            type: "string",
            description:
              "Financial or operational impact on the business if this clause is enforced.",
          },
          recommendedAction: {
            type: "string",
            description:
              "A concrete, actionable recommendation for the business owner before signing.",
          },
          counterClause: {
            type: "string",
            description:
              "Optional proposed replacement contract language to request during negotiation.",
          },
        },
        required: [
          "title",
          "severity",
          "clauseText",
          "plainEnglish",
          "businessImpact",
          "recommendedAction",
        ],
      },
    },
    negotiationEmail: {
      type: "string",
      description:
        "A complete, ready-to-send professional negotiation email a business owner can send to the other party, referencing the specific clauses to change.",
    },
    disclaimer: {
      type: "string",
      description:
        "Short informational note that this is not legal advice. Keep it concise.",
    },
  },
  required: [
    "contractSummary",
    "overallRiskScore",
    "overallRiskLabel",
    "parties",
    "keyRisks",
    "negotiationEmail",
    "disclaimer",
  ],
};
