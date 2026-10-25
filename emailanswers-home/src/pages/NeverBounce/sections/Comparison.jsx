import { useEffect, useRef, useState } from "react";
import "./Comparison.css";

/* Copy matches neverbounce-alternative_1.html. status: "y" yes, "n" no, "p" partial. */
const ROWS = [
  { feature: "Catch-all email verification",
    nb: { status: "n", text: "Marked “Accept-all (Unverifiable)”" },
    us: { status: "y", text: "Resolved to deliverable or undeliverable" } },
  { feature: "Final verdict for every address",
    nb: { status: "p", label: "Partial", text: "Catch-all and unknown need your judgment" },
    us: { status: "y", text: "Send or don't send, every time" } },
  { feature: "Invalid, disposable, typo detection", nb: { status: "y" }, us: { status: "y" } },
  { feature: "Bulk list cleaning", nb: { status: "y" }, us: { status: "y" } },
  { feature: "Real-time API", nb: { status: "y" }, us: { status: "y" } },
  { feature: "Built for",
    nb: { text: "Broad email marketing, CRM hygiene" },
    us: { text: "Cold outreach, demand gen, lead gen agencies" } },
  { feature: "Sequencer integrations (Instantly, Smartlead, lemlist)",
    nb: { status: "p", label: "Via Zapier / n8n" },
    us: { status: "y", text: "Native" } },
  { feature: "Pay-as-you-go pricing",
    nb: { text: "$8 per 1,000 credits, expire after 12 months" },
    us: { text: "$5 per 1,000 credits, never expire" } },
  { feature: "Subscription",
    nb: { text: "Growth from $49/mo for up to 10,000 emails" },
    us: { text: "$25/mo for up to 10,000 emails" } },
  { feature: "Free trial",
    nb: { text: "Free list analysis and test credits" },
    us: { text: "100 free verifications, no card" } },
];

const MARK = { y: "✓", n: "✕" };
const WORD = { y: "Yes", n: "No", p: "Partial" };

function Cell({ cell, us }) {
  const { status, label, text } = cell;
  return (
    <td className={us ? "nb-cmp__us" : undefined}>
      {status && (
        <span className={`nb-cmp__mark nb-cmp__mark--${status}`}>
          <span aria-hidden="true">{label || MARK[status]}</span>
          <span className="nb-cmp__sr">{WORD[status]}</span>
        </span>
      )}
      {status && text ? " " : null}
      {text}
    </td>
  );
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Comparison() {
  const root = useRef(null);
  const [inView, setInView] = useState(
    () => prefersReducedMotion() || typeof IntersectionObserver === "undefined"
  );

  const [hot, setHot] = useState(-1);

  /* play the entrance every time the section scrolls into view (and reset when it leaves) */
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined" || prefersReducedMotion()) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* a spotlight walks down the table, one row at a time, while the section is on screen */
  useEffect(() => {
    if (!inView || prefersReducedMotion()) {
      setHot(-1);
      return undefined;
    }
    let id;
    const start = setTimeout(() => {
      setHot(0);
      id = setInterval(() => setHot((h) => (h + 1) % ROWS.length), 1500);
    }, 2400);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [inView]);

  return (
    <section
      className={`nb-section nb-cmp-section${inView ? " is-in" : ""}`}
      id="compare"
      ref={root}
    >
      <div className="nb-cmp__glow" aria-hidden="true" />

      <span className="nb-cmp__eyebrow nb-cmp__a" style={{ "--i": 0 }}><i />Side by side</span>
      <h2 className="nb-cmp__title nb-cmp__a" style={{ "--i": 1 }}>
        NeverBounce vs <span className="nb-cmp__accent">EmailAnswers AI</span>
      </h2>
      <p className="nb-cmp__lead nb-cmp__a" style={{ "--i": 2 }}>
        A feature-by-feature look at what each tool gives you, based on NeverBounce's
        public pricing and documentation.
      </p>

      <div className="nb-cmp__wrap nb-cmp__a" style={{ "--i": 3 }} tabIndex={0} role="region" aria-label="Feature comparison table">
        <table className="nb-cmp__table">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">NeverBounce</th>
              <th scope="col" className="nb-cmp__us">EmailAnswers AI</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.feature} className={`nb-cmp__row${hot === i ? " is-hot" : ""}`} style={{ "--r": i }}>
                <th scope="row">{r.feature}</th>
                <Cell cell={r.nb} />
                <Cell cell={r.us} us />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="nb-cmp__note nb-cmp__a" style={{ "--i": 5 }}>
        <span className="nb-cmp__note-ico" aria-hidden="true">i</span>
        <span>
          <b>Sources.</b> NeverBounce details are from neverbounce.com pricing and help
          desk pages, checked September 2026. Pricing and features may change.
        </span>
      </p>
    </section>
  );
}
