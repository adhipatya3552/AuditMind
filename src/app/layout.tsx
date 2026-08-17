import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuditMind — AI Business Contract Risk Auditor",
  description:
    "AuditMind reads business contracts, surfaces hidden risks, explains their real-world business impact, and generates negotiation-ready counter-proposals in seconds. Informational risk triage — not legal advice.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}