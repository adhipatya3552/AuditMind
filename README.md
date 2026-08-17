# AuditMind — AI Business Contract Risk Auditor

> Turn complicated contracts into clear business decisions.

AuditMind is a **newly built** (hackathon-window) AI product that reads a business contract (PDF), surfaces hidden risks, explains them in plain English with real business impact, and drafts negotiation-ready counter-proposals — all in seconds. Built for freelancers and small businesses that can't afford a legal team.

Built as part of the **Build with Gemini XPRIZE** hackathon. Runs on **Gemini 2.5 Flash** via **Google AI Studio API**.

## Product workflow

Upload a contract PDF → AI analysis → overall risk score → risk categories → clause-level findings → plain-English explanation → business impact → recommended action → suggested counter-clause → negotiation email.

## Architecture

One primary Gemini API call with **structured JSON output** (`responseSchema`) models three logical agents:

| Agent | Role |
| --- | --- |
| **Risk Auditor** | Extracts key clauses, identifies hidden risks, severity-scopes each finding |
| **Business Advocate** | Translates legalese into plain English and states real business impact |
| **Negotiation Strategist** | Proposes counter-clauses and drafts a ready-to-send negotiation email |

A `Try a sample contract` mode uses a pre-generated JSON analysis so the product demos cleanly even if the Gemini API, network, or rate limit fails.

## Stack (all free)

- **Frontend / API**: Next.js (App Router) on Vercel Free
- **AI**: Gemini 2.5 Flash via `@google/genai` (Google AI Studio API key)
- **Styling**: Tailwind CSS v4
- **PDF**: Native Gemini multimodal PDF input (no OCR library)
- **Persistence**: none (stateless, serverless)

## Getting started

```bash
# 1. Install
npm install

# 2. Create a free API key at https://aistudio.google.com/app/apikey
cp .env.example .env.local
#     → paste your key into GEMINI_API_KEY=

# 3. Run locally
npm run dev
#    → http://localhost:3000
```

Set the same `GEMINI_API_KEY` as an environment variable in Vercel and deploy — no billing account, no credit card.

## Demo & shell

- Live demo (if deployed): `Vercel_URL`
- Demo mode: Home page → **Try a sample contract** (offline-safe)
- Application-gateway smoke test: `curl -X POST https://<app>/api/analyze -H "Content-Type: application/json" -d '{"pdfBase64":"<base64>"}'`

## Notes & compliance

- Uses the **Gemini API through Google AI Studio**, which satisfies the XPRIZE "use at least one Google Cloud product" requirement (per the official XPRIZE FAQ).
- Please add a free **GEMINI_API_KEY** in Vercel project settings (Environment Variables) before deploying — the `/api/analyze` endpoint reads `process.env.GEMINI_API_KEY`.
- AuditMind provides **informational contract risk analysis, not legal advice**. It does not create an attorney-client relationship. A disclaimer is shown in-app.
- No fabricated users, testimonials, revenue, or metrics. All analysis is generated live from the uploaded document.

## License

Private repository — available to XPRIZE reviewers (`testing@devpost.com`, `judging@hacker.fund`).