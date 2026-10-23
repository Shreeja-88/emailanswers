import { useEffect, useRef, useState } from "react";
import "./HowItWorks.css";

const SIGNUP_URL = "https://app.emailanswers.ai/signup";

/* Illustrative sample rows (same ones the Hero uses). Labelled "sample" in the UI, not real results. */
const ROWS = [
  { email: "m.ross@brightlabs.com", sc: "ok", server: "Standard server", v: "ok", label: "Valid" },
  { email: "sarah.k@northwind.io", sc: "ca", server: "Catch-all", v: "ans", label: "Deliverable" },
  { email: "info-2019@acmecorp.co", sc: "ca", server: "Catch-all", v: "bad", label: "Don't send" },
  { email: "j.patel@lumenhq.com", sc: "ca", server: "Catch-all", v: "ans", label: "Deliverable" },
  { email: "d.lee@oldvendor.net", sc: "bad", server: "Dead server", v: "bad", label: "Invalid" },
  { email: "alex@finstack.io", sc: "ok", server: "Standard server", v: "ok", label: "Valid" },
];

const N = ROWS.length;
const TICK = 1100; // ms per step of the demo
const UP = 2; // ticks spent "uploading"
const HOLD = 3; // ticks the finished result stays on screen
const TOTAL = UP + N + HOLD;

const STEPS = [
  { title: "Upload your list", text: "Drop in the CSV of leads you paid for.", start: 0, ticks: UP },
  {
    title: "We check each address",
    text: "Standard servers answer directly. Catch-all servers get resolved, not left as “unknown.”",
    start: UP,
    ticks: N,
  },
  {
    title: "Get a clear verdict",
    text: "Every address comes back as send or don't send, so you only email people you can reach.",
    start: UP + N,
    ticks: HOLD,
  },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const icon = (v) => (v === "bad" ? "✕" : "✓");

const ICONS = [
  /* upload */
  <svg key="u" viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>,
  /* check each address */
  <svg key="s" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>,
  /* verdict */
  <svg key="v" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>,
];

export default function HowItWorks() {
  const ref = useRef(null);
  const reduce = prefersReducedMotion();
  const [tick, setTick] = useState(reduce ? UP + N : 0);
  const [run, setRun] = useState(false);
  const [jump, setJump] = useState(0); // bumps when a step is clicked, restarts the progress bars

  /* only animate while the section is on screen */
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setRun(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setRun(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !run) return undefined;
    const id = setInterval(() => setTick((t) => (t + 1) % TOTAL), TICK);
    return () => clearInterval(id);
  }, [run, reduce]);

  const phase = tick < UP ? 0 : tick < UP + N ? 1 : 2;
  const cur = phase === 1 ? tick - UP : -1;
  const doneCount = phase === 0 ? 0 : phase === 1 ? tick - UP : N;
  const done = ROWS.slice(0, doneCount);
  const send = done.filter((r) => r.v !== "bad");
  const dont = done.filter((r) => r.v === "bad");
  const resolved = done.filter((r) => r.sc === "ca").length;
  const row = cur >= 0 ? ROWS[cur] : null;

  const goTo = (start) => {
    setTick(start);
    setJump((j) => j + 1);
  };

  return (
    <section className={`ea-how${run ? "" : " is-paused"}`} id="how" ref={ref}>
      <div className="ea-how__bg" aria-hidden="true" />
      <span className="ea-how__rail ea-how__rail--l" aria-hidden="true" />
      <span className="ea-how__rail ea-how__rail--r" aria-hidden="true" />

      <div className="ea-how__inner">
        <header className="ea-how__head">
          <div className="ea-how__copy">
            <h2 className="ea-how__title">
              <span className="ea-how__line">Upload a list.</span>{" "}
              <span className="ea-how__line"><em>Get your answers.</em></span>
            </h2>
            <p className="ea-how__sub">
              Three steps from the leads you paid for to a list you can actually send to.
            </p>
          </div>
          <div className="ea-how__cta">
            <a className="ea-how__btn" href={SIGNUP_URL}>
              Get 250 free credits <span aria-hidden="true">↗</span>
            </a>
            <span className="ea-how__note">No credit card</span>
          </div>
        </header>

        {/* steps are a tab strip on top of the demo card; they double as its progress bar and can be clicked */}
        <div className="ea-how__card">
        <ol className="ea-how__steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                className={`ea-how__step${phase === i ? " is-active" : ""}${phase > i ? " is-past" : ""}`}
                style={{ "--dur": `${s.ticks * TICK}ms` }}
                onClick={() => goTo(s.start)}
                aria-current={phase === i ? "step" : undefined}
              >
                <span className="ea-how__prog" aria-hidden="true"><i key={jump} /></span>
                <span className="ea-how__ico2" aria-hidden="true">{ICONS[i]}</span>
                <span className="ea-how__txt">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </span>
                <span className="ea-how__n" aria-hidden="true">{`0${i + 1}`}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* the live demo (decorative, so hidden from screen readers; the steps above carry the meaning) */}
        <div className="ea-how__stage" aria-hidden="true">
          {/* input */}
          <div className={`ea-how__in${phase === 0 ? " is-loading" : ""}`}>
            <div className="ea-how__cap">Your list</div>
            <div className="ea-how__file">
              <span className="ea-how__ico">CSV</span>
              <div>
                <b>q3_outbound_leads.csv</b>
                <small>Sample data</small>
              </div>
            </div>
            <div className="ea-how__bar">
              <i
                key={`b${jump}-${phase === 0 ? "run" : "full"}`}
                className={phase === 0 ? "is-run" : ""}
                style={{ animationDuration: `${UP * TICK}ms` }}
              />
            </div>
            <ul className="ea-how__list">
              {ROWS.map((r, i) => (
                <li key={r.email} className={i < doneCount ? "is-done" : i === cur ? "is-cur" : ""}>
                  <span className="ea-how__mail">{r.email}</span>
                  <span className="ea-how__ok">{i < doneCount ? "✓" : ""}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* engine */}
          <div className={`ea-how__core${phase === 1 ? " is-live" : ""}`}>
            <div className="ea-how__orb"><span>@</span></div>
            <div className="ea-how__status">
              {phase === 0 && (
                <>
                  <span className="ea-how__cur is-dim">Waiting for your list</span>
                  <span className="ea-how-chip ea-how-chip--queued">Idle</span>
                </>
              )}
              {phase === 1 && row && (
                <>
                  <span className="ea-how__cur">{row.email}</span>
                  <span className={`ea-how-chip ea-how-chip--${row.sc}`} key={row.email}>
                    {row.sc === "ca" && <i className="ea-how-spin" />}
                    {row.sc === "ca" ? "Catch-all, resolving" : row.server}
                  </span>
                </>
              )}
              {phase === 2 && (
                <>
                  <span className="ea-how__cur">All {N} checked</span>
                  <span className="ea-how-chip ea-how-chip--ans">{resolved} catch-alls resolved</span>
                </>
              )}
            </div>
          </div>

          {/* output */}
          <div className="ea-how__out">
            <div className="ea-how__cap">Your answers</div>
            <div className="ea-how__bucket ea-how__bucket--send">
              <header><span>Send</span><b>{send.length}</b></header>
              <ul>
                {send.map((r) => (
                  <li key={r.email}>
                    <span className="ea-how__mail">{r.email}</span>
                    <span className={`ea-how-chip ea-how-chip--${r.v}`}>{icon(r.v)} {r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ea-how__bucket ea-how__bucket--dont">
              <header><span>Don't send</span><b>{dont.length}</b></header>
              <ul>
                {dont.map((r) => (
                  <li key={r.email}>
                    <span className="ea-how__mail">{r.email}</span>
                    <span className={`ea-how-chip ea-how-chip--${r.v}`}>{icon(r.v)} {r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        </div>
      </div>
    </section>
  );
}
