import { useEffect, useRef } from "react";
import "./EmailVerificationVisual.css";

const STAGES = [
  { key: "syntax", label: "Syntax" },
  { key: "domain", label: "Domain" },
  { key: "mailbox", label: "Mailbox" },
  { key: "risk", label: "Risk" },
];

const SIGNALS = [
  { label: "MX record", value: "found", tone: "valid" },
  { label: "SMTP", value: "reachable", tone: "valid" },
  { label: "Catch-all  ", value: " detected", tone: "catch" },
  { label: "Disposable", value: "no", tone: "valid" },
];

export default function EmailVerificationVisual() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      root.querySelectorAll("[data-ev-step]").forEach((el) => el.classList.add("is-active"));
      root.querySelectorAll("[data-ev-signal]").forEach((el) => el.classList.add("is-on"));
      return undefined;
    }

    const steps = Array.from(root.querySelectorAll("[data-ev-step]"));
    const signals = Array.from(root.querySelectorAll("[data-ev-signal]"));
    const timers = [];

    const run = () => {
      steps.forEach((el) => el.classList.remove("is-active"));
      signals.forEach((el) => el.classList.remove("is-on"));
      root.querySelector(".ev-scan")?.classList.remove("is-running");

      let i = 0;
      const advance = () => {
        if (i < steps.length) {
          steps[i].classList.add("is-active");
          i += 1;
          timers.push(setTimeout(advance, 520));
        } else {
          signals.forEach((el, idx) => {
            timers.push(setTimeout(() => el.classList.add("is-on"), idx * 180));
          });
          timers.push(setTimeout(() => {
            root.querySelector(".ev-scan")?.classList.add("is-running");
          }, 200));
        }
      };
      timers.push(setTimeout(advance, 300));
    };

    run();
    const loop = setInterval(run, 4600);
    timers.push(loop);

    return () => {
      timers.forEach((t) => (typeof t === "number" ? clearTimeout(t) : clearInterval(t)));
    };
  }, []);

  return (
    <div className="ev-visual" ref={rootRef} aria-label="Email verification pipeline preview">
      <div className="ev-grid" aria-hidden="true" />
      <div className="ev-glow" aria-hidden="true" />

      <div className="ev-pipeline">
        <div className="ev-input" data-ev-reveal>
          <span className="ev-mail-icon" aria-hidden="true">✉</span>
          <div>
            <strong>info@business.com</strong>
            <small>Incoming address</small>
          </div>
          <span className="ev-badge ev-badge-uncertain">Uncertain</span>
        </div>

        <div className="ev-stages" aria-hidden="true">
          {STAGES.map((stage, index) => (
            <div className="ev-stage" data-ev-step key={stage.key}>
              <span className="ev-stage-dot" />
              <span className="ev-stage-label">{stage.label}</span>
              {index < STAGES.length - 1 && <span className="ev-stage-line" />}
            </div>
          ))}
        </div>

        <div className="ev-scan" aria-hidden="true" />

        <div className="ev-result" data-ev-reveal>
          <div className="ev-result-head">
            <span className="ev-live-dot" aria-hidden="true" />
            <span>VERIFICATION RESULT</span>
            <span className="ev-badge ev-badge-resolved">Resolved</span>
          </div>
          <div className="ev-result-address">info@business.com</div>
          <div className="ev-signal-grid">
            {SIGNALS.map((signal) => (
              <div className="ev-signal" data-ev-signal key={signal.label}>
                <span className="ev-signal-label">{signal.label}</span>
                <span className={`ev-signal-value ev-tone-${signal.tone}`}>{signal.value}</span>
              </div>
            ))}
          </div>
          <div className="ev-result-foot">
            <span className="ev-confidence">Confidence</span>
            <div className="ev-confidence-bar" aria-hidden="true">
              <i />
            </div>
            <span className="ev-confidence-value">87%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
