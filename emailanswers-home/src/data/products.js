export const VERIFY = [
  { id: "single", icon: "at", title: "Single email checker", short: "Single check", tag: "Free",
    blurb: "Paste an address, get a verdict",
    lead: "Paste an address and get a verdict in about a second. No signup." },
  { id: "bulk", icon: "table", title: "Bulk list cleaning", short: "Bulk lists",
    blurb: "CSV in, a verdict on every row",
    lead: "Drop a CSV of 500 or 500,000 rows. Every row comes back with a verdict, a score and a reason." },
  { id: "crm", icon: "sync", title: "CRM sync", short: "CRM sync",
    blurb: "Keep HubSpot clean on autopilot",
    lead: "New and changed contacts are re-verified automatically, so your CRM stays clean without exports." },
  { id: "api", icon: "code", title: "Real-time API", short: "Real-time API",
    blurb: "Verify at the point of capture",
    lead: "Verify at signup forms, in enrichment steps, and before a contact enters a sequence." },
];

export const PROTECT = [
  { id: "catchall", icon: "target", title: "Catch-all verdicts", blurb: "Answers where others say unknown",
    detail: "Accept-all domains normally come back as \"unknown\". We probe further and resolve each address into deliverable or not, so you stop guessing.",
    points: ["Probe beyond the mail server", "One clear verdict per address", "Reason attached to every result"] },
  { id: "score", icon: "gauge", title: "AI email score", blurb: "Know who to email first",
    detail: "Every contact is ranked from 0 to 100, so you can send to the safest addresses first and review the risky ones.",
    points: ["0–100 score per contact", "Sort and filter by score", "Export only what clears your bar"] },
  { id: "dmarc", icon: "shield", title: "DMARC monitoring", blurb: "Watch your sending domains",
    detail: "See who is sending as your domain and whether SPF, DKIM and DMARC pass, so authentication problems surface early.",
    points: ["Sources sending as your domain", "SPF, DKIM and DMARC status", "Spot spoofing early"] },
  { id: "tests", icon: "inbox", title: "Deliverability tests", blurb: "Check a campaign before it ships",
    detail: "Run authentication, content and spam-score checks on a campaign before you press send, not after it bounces.",
    points: ["Authentication check", "Content and spam score", "Fix issues before sending"] },
];

export const VERIFY_IDS = VERIFY.map((p) => p.id);
export const PROTECT_IDS = PROTECT.map((p) => p.id);

// ---- Demo logic: a small deterministic *simulation*, not a real verifier ----
const TYPOS = { "gmial.com": "gmail.com", "gamil.com": "gmail.com", "hotmial.com": "hotmail.com", "yahooo.com": "yahoo.com" };
const ROLES = /^(info|sales|admin|support|contact|hello|team|office)$/;

export function verifyEmail(raw) {
  const email = String(raw).trim().toLowerCase();
  const steps = (ok, notes) => ["Syntax", "Domain & mail server", "Mailbox handshake", "Catch-all probe", "Resolution"]
    .map((label, i) => ({ label, state: i < ok ? "pass" : i === ok ? "fail" : "skip", note: notes[i] || "" }));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return { email, verdict: "dont", score: 3, reason: "Not a valid address format", steps: steps(0, ["Missing @ or domain"]) };

  const [local, domain] = email.split("@");
  if (TYPOS[domain])
    return { email, verdict: "dont", score: 9, reason: `Likely typo — did you mean ${TYPOS[domain]}?`, steps: steps(1, ["Looks fine", `Domain looks mistyped`]) };

  const h = [...domain].reduce((a, c) => a + c.charCodeAt(0), 0);
  const catchAll = h % 3 === 0;
  const role = ROLES.test(local);
  const base = ["Format OK", "MX records found", "Server accepted", catchAll ? "Accepts everything" : "Not a catch-all", ""];

  if (catchAll && role)
    return { email, verdict: "dont", score: 31, catchAll, reason: "Catch-all domain; role address unlikely to be read", steps: steps(5, [...base.slice(0, 4), "Resolved: risky"]) };
  if (catchAll)
    return { email, verdict: "send", score: 68 + (h % 25), catchAll, reason: "Catch-all domain resolved as deliverable", steps: steps(5, [...base.slice(0, 4), "Resolved: deliverable"]) };
  return { email, verdict: "send", score: 82 + (h % 17), catchAll, reason: role ? "Valid mailbox (role address)" : "Valid, deliverable mailbox", steps: steps(5, [...base.slice(0, 4), "Not needed"]) };
}

export const STEP_LABELS = ["Syntax", "Domain & mail server", "Mailbox handshake", "Catch-all probe", "Resolution"];
