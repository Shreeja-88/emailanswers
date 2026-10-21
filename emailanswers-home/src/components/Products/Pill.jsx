const CLS = { send: "pr-chip pr-chip-ok", dont: "pr-chip pr-chip-bad", wait: "pr-chip pr-chip-ca", idle: "pr-chip pr-chip-idle", ans: "pr-chip pr-chip-ans" };
const LABEL = { send: "✓ Send", dont: "✕ Don't send", wait: "Checking…", idle: "Queued", ans: "✓ Deliverable" };

export default function Pill({ kind = "idle", children }) {
  return (
    <span key={kind} className={`${CLS[kind]} ${kind === "send" || kind === "dont" || kind === "ans" ? "pr-pop" : ""}`}>
      {kind === "wait" && <i className="pr-dot" />}
      {children || LABEL[kind]}
    </span>
  );
}