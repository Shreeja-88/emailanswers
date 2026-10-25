import { useEffect, useRef, useState } from "react";
import "./TeamFitTestimonial.css";

const PRICING_URL = "/#pricing";
const AUTO_MS = 4500; // how long each option stays on screen before the picker moves on

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- effects helpers ---------- */

/* feeds the cursor position to CSS (--mx / --my) so a soft spotlight follows the pointer */
const trackPointer = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

/* counts up to a number once "run" turns true */
function Count({ to, run, prefix = "", suffix = "" }) {
  const [v, setV] = useState(prefersReducedMotion() ? to : 0);

  useEffect(() => {
    if (!run || prefersReducedMotion()) {
      if (run) setV(to);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / 1400, 1);
      setV(to * (1 - Math.pow(1 - p, 3))); // ease-out
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);

  return (
    <span className="nb-tst-num">
      {prefix}
      {v === to ? to : v.toFixed(1)}
      {suffix}
    </span>
  );
}

/* ---------- "Which tool fits your team?" content (easy to edit) ---------- */

const OPTIONS = [
  { id: "b2b", title: "B2B cold outreach", hint: "Prospect lists, sequencers, outbound" },
  { id: "consumer", title: "Consumer or newsletter lists", hint: "Mostly free-mail addresses" },
  { id: "agency", title: "I run an agency", hint: "Sending on behalf of clients" },
  { id: "both", title: "I already like my verifier", hint: "Just want the catch-alls handled" },
];

/* tone: "go" = orange, "stay" = green. on: which card below lights up. */
const TAKES = {
  b2b: {
    verdict: "Try it.",
    tone: "go",
    on: "ea",
    cta: true,
    why: "Catch-all addresses are common in B2B outreach, so how a tool treats them matters more for your lists.",
    points: [
      "A clear send or don\u2019t-send answer for catch-all addresses",
      "Fewer leads set aside or sent blind",
    ],
  },
  agency: {
    verdict: "Try it.",
    tone: "go",
    on: "ea",
    cta: true,
    why: "You answer for other people\u2019s sending domains, so guessing on uncertain addresses is a risk worth avoiding.",
    points: [
      "Answers you can explain to clients",
      "Start from your current verifier\u2019s export",
    ],
  },
  consumer: {
    verdict: "Stay put.",
    tone: "stay",
    on: "nb",
    cta: false,
    why: "With mostly consumer or free-mail addresses, catch-alls are less common, and NeverBounce handles standard verification well.",
    points: [
      "A long list of native ESP integrations, such as Mailchimp or Marketo",
      "Little reason to switch right now",
    ],
  },
  both: {
    verdict: "Run both.",
    tone: "go",
    on: "both",
    cta: true,
    why: "Keep the verifier you trust and send only the catch-all and unknown results through EmailAnswers AI.",
    points: [
      "Recover leads you would otherwise discard",
      "No change to how you handle standard results",
    ],
  },
};

const NB_FIT = [
  "Your list is mostly consumer or free-mail addresses",
  "You need a long list of native ESP integrations like Mailchimp or Marketo",
  "Catch-all addresses are a small share of what you send",
  "You already have a process for handling accept-all results",
];

const EA_FIT = [
  "You send cold outreach to B2B contacts, where catch-alls are common",
  "You\u2019re tired of discarding leads you paid to source or enrich",
  "You run an agency and need to protect client sending domains",
  "You want a clear answer, not a caution flag",
];

/* ---------- testimonial content ---------- */
/* TODO: replace with a real, approved customer quote and name before publishing. */

const QUOTE = [
  "NeverBounce was fine until we moved into B2B outbound. ",
  { mark: "Almost half of every list came back accept-all." },
  " EmailAnswers gave us answers on those, and ",
  { mark: "our usable list nearly doubled." },
];

const PERSON = { initials: "RK", name: "Robert K.", role: "Founder, outbound lead gen agency" };

/* ---------- helpers ---------- */

function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -25% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

/* ---------- sections ---------- */

function FitSection() {
  const [selected, setSelected] = useState("b2b");
  const [auto, setAuto] = useState(() => !prefersReducedMotion()); // stops for good once the visitor picks one
  const [hold, setHold] = useState(false); // pointer or keyboard focus is inside the picker
  const [onScreen, setOnScreen] = useState(false);
  const wrapRef = useRef(null);
  const take = TAKES[selected];

  /* only run the timer while the picker is on screen */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* the progress line's CSS animation is the timer; when it ends, show the next option */
  const advance = () =>
    setSelected((cur) => {
      const i = OPTIONS.findIndex((o) => o.id === cur);
      return OPTIONS[(i + 1) % OPTIONS.length].id;
    });

  const choose = (id) => {
    setSelected(id);
    setAuto(false);
  };

  return (
    <section className="nb-section nb-fit-section" id="fair">
      <div className="nb-fit-head">
        <span className="nb-eyebrow">
          <span className="nb-dot" />
          FIND YOUR FIT
        </span>
        <h2>
          Which tool fits <span className="nb-script">your team?</span>
        </h2>
        <p>
          Pick the line that sounds most like you. Evaluate the trade-offs
          based on your audience, campaign type, and verification
          requirements.
        </p>
      </div>

      <div
        className="nb-fit"
        ref={wrapRef}
        data-paused={hold || !onScreen}
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
      >
        <div>
          <p className="nb-fit-q" id="nb-fit-q">What does your sending look like?</p>
          <div className="nb-fit-pick" role="radiogroup" aria-labelledby="nb-fit-q">
            {OPTIONS.map((o) => (
              <label className="nb-fit-opt" key={o.id}>
                <input
                  type="radio"
                  name="nb-fit"
                  value={o.id}
                  checked={selected === o.id}
                  onChange={() => choose(o.id)}
                />
                <span className="nb-fit-opt-card">
                  <span>
                    <b>{o.title}</b>
                    <small>{o.hint}</small>
                  </span>
                  {auto && selected === o.id && (
                    <i
                      className="nb-fit-prog"
                      style={{ animationDuration: `${AUTO_MS}ms` }}
                      onAnimationEnd={advance}
                      aria-hidden="true"
                    />
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="nb-fit-out" data-tone={take.tone} aria-live="polite" onMouseMove={trackPointer}>
          <div className="nb-fit-body" key={selected}>
            <span className="nb-fit-tag">OUR HONEST TAKE</span>
            <div className="nb-fit-verdict nb-script">{take.verdict}</div>
            <p className="nb-fit-why">{take.why}</p>
            <ul className="nb-fit-list">
              {take.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="nb-fit-cta">
              {take.cta ? (
                <a className="nb-button nb-button-primary" href={PRICING_URL}>
                  Try it free <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span className="nb-fit-quiet">Worth another look if your lists change.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* the full lists stay on the page; the one matching the pick lights up */}
      <div className="nb-fit-sides" data-on={take.on}>
        <div className="nb-fit-card nb-fit-card-nb">
          <h3>NeverBounce is a good fit if</h3>
          <ul>
            {NB_FIT.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="nb-fit-card nb-fit-card-ea">
          <h3>EmailAnswers AI is a better fit if</h3>
          <ul>
            {EA_FIT.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const [ref, inView] = useReveal();

  return (
    <section className="nb-section nb-tst-section" id="testimonial">
      <div className="nb-tst-head">
        <span className="nb-eyebrow">
          <span className="nb-dot" />
          WHAT CLIENTS SAY
        </span>
        <h2>
          In their <span className="nb-script">own words.</span>
        </h2>
      </div>

      <div className={`nb-tst${inView ? " is-in" : ""}`} ref={ref} onMouseMove={trackPointer}>
        <span className="nb-tst-q nb-script" aria-hidden="true">“</span>

        <div className="nb-tst-main">
          <blockquote>
            {QUOTE.map((part, i) =>
              typeof part === "string" ? part : <mark key={i}>{part.mark}</mark>
            )}
          </blockquote>
          <div className="nb-tst-who">
            <span className="nb-tst-avatar">{PERSON.initials}</span>
            <div>
              <b>{PERSON.name}</b>
              <small>{PERSON.role}</small>
            </div>
          </div>
        </div>

        <div className="nb-tst-stats">
          <div className="nb-tst-tile">
            <small>Usable leads per list</small>
            <b><Count to={2} run={inView} suffix="x" /></b>
            <div className="nb-tst-bars" aria-hidden="true">
              <div><span>Before</span><em><i style={{ "--w": "50%" }} /></em></div>
              <div className="after"><span>After</span><em><i style={{ "--w": "100%" }} /></em></div>
            </div>
            <span className="nb-tst-note">Bars show the 2x ratio, not exact counts.</span>
          </div>

          <div className="nb-tst-tile">
            <small>Bounce rate after switching</small>
            <b><Count to={2} run={inView} prefix="<" suffix="%" /></b>
            <div className="nb-tst-dots" aria-hidden="true">
              {Array.from({ length: 100 }, (_, i) => (
                <i key={i} className={i === 37 ? "b" : undefined} style={{ "--i": i }} />
              ))}
            </div>
            <span className="nb-tst-note">Each dot is one email out of 100. Fewer than 2 bounced.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TeamFitTestimonial() {
  return (
    <>
      <FitSection />
      <TestimonialSection />
    </>
  );
}
