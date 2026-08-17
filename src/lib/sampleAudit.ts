import type { AuditResult } from "@/types";

/**
 * Pre-generated sample analysis used by "Try a sample contract" so the
 * dashboard still demos cleanly if the Gemini API / network / quota fails.
 * This mirrors exactly the shape Gemini returns.
 */
export const SAMPLE_AUDIT: AuditResult = {
  contractSummary:
    "This is a 24-month SaaS subscription agreement between BrightSoft Ltd (vendor) and the business (customer), covering project-management software for up to 15 seats at approximately $89 per seat per month (~$32,000 over the term). The agreement auto-renews annually, limits liability to three months of fees, and grants the vendor broad rights to change pricing and suspend access.",
  overallRiskScore: 71,
  overallRiskLabel: "HIGH",
  parties: ["BrightSoft Ltd", "The Business (Customer)"],
  keyRisks: [
    {
      title: "Auto-renewal with short notice window",
      severity: "HIGH",
      clauseText:
        "“This Agreement shall automatically renew for successive twelve-month periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.”",
      plainEnglish:
        "The contract renews itself for another full year unless you give 60 days' written notice before it ends. Miss the window and you're locked in for another 12 months.",
      businessImpact:
        "If you stop needing the software, you will still owe a full year of fees (~$16,000) because a late notice is no notice at all.",
      recommendedAction:
        "Add a calendar reminder 90 days before renewal and request a 30-day notice window in negotiation.",
      counterClause:
        "This Agreement shall renew month-to-month after the initial term, and either party may terminate with 30 days' written notice.",
    },
    {
      title: "One-sided liability cap",
      severity: "HIGH",
      clauseText:
        "“In no event shall either party's aggregate liability exceed the total fees paid by Customer in the three (3) months preceding the claim.”",
      plainEnglish:
        "If the software loses your data or causes a loss, the vendor's maximum responsibility is capped at just three months of what you paid.",
      businessImpact:
        "Your financial exposure is effectively uncapped while the vendor's is capped at a few thousand dollars — a very uneven split of risk.",
      recommendedAction:
        "Ask to raise the cap to at least 12 months of fees and carve out exclusions for data loss, confidentiality, and gross negligence.",
      counterClause:
        "Vendor's aggregate liability shall not be less than the fees paid in the twelve (12) months preceding the claim, and shall not be capped for data loss, breach of confidentiality, or gross negligence.",
    },
    {
      title: "Vendor can change pricing on short notice",
      severity: "MEDIUM",
      clauseText:
        "“Vendor may adjust pricing upon thirty (30) days' written notice, and continued use after such notice constitutes acceptance of the new pricing.”",
      plainEnglish:
        "Your price can go up with just 30 days' notice, and if you keep using the service, you've silently agreed to the increase.",
      businessImpact:
        "Budgeting is unpredictable; an aggressive increase could make the service unaffordable with little time to switch.",
      recommendedAction:
        "Lock pricing for the initial term and require 90 days' notice for any increase, with the option to exit without penalty.",
      counterClause:
        "Pricing is fixed for the initial term. Any price increase requires ninety (90) days' written notice and Customer may terminate without penalty before the increase takes effect.",
    },
    {
      title: "Suspension of service without clear cure period",
      severity: "MEDIUM",
      clauseText:
        "“Vendor may suspend access to the Service if Customer breaches this Agreement or if Vendor determines, in its sole discretion, that Customer's use poses a risk.”",
      plainEnglish:
        "The vendor can cut off your access based on its own judgment of risk — not only for a definite breach.",
      businessImpact:
        "An unexpected suspension could halt your operations and, depending on your business, your ability to bill clients.",
      recommendedAction:
        "Require a defined breach notice, a 10-day cure period, and suspension only for serious or repeated breaches.",
      counterClause:
        "Vendor may suspend access only for a material breach that remains uncured for ten (10) business days after written notice, and shall provide access to Customer Data during any suspension.",
    },
    {
      title: "Missing data portability commitment",
      severity: "LOW",
      clauseText:
        "“Upon termination, Vendor shall return or delete Customer Data within a reasonable period.”",
      plainEnglish:
        "The contract promises your data will come back or be deleted, but doesn't say how fast or in what format.",
      businessImpact:
        "At exit time, you may wait weeks for a data export, blocking a smooth migration to another tool.",
      recommendedAction:
        "Specify an export deadline (e.g., 30 days) and a common format (CSV/JSON) before you sign.",
      counterClause:
        "Within thirty (30) days of termination, Vendor shall provide Customer Data in a commonly used, machine-readable format at no charge.",
    },
  ],
  negotiationEmail:
    "Subject: Feedback on the BrightSoft subscription agreement\n\nDear BrightSoft team,\n\nThank you for sending over the subscription agreement. We're excited to move forward with your software.\n\nBefore signing, we'd like to address a few clauses that expose us to more risk than we can comfortably accept for a tool this size:\n\n1. Auto-renewal (Clause 8.2) — a 60-day notice window is easy to miss. We'd prefer a 30-day window and a month-to-month option after the initial term.\n\n2. Liability cap — capping your liability at three months of fees leaves us exposed. We'd like the cap raised to twelve months, with data loss and confidentiality carved out.\n\n3. Pricing changes — we'd like pricing locked for the initial term, with at least 90 days' notice for any increase.\n\nIf these adjustments work for you, we can sign right away. Happy to set up a quick call to discuss.\n\nBest regards,\n[Your name]\n[Your company]",
  disclaimer:
    "This analysis is for informational and risk-triage purposes only and is not legal advice. Please consult a qualified professional before acting on any contract.",
};
