import { useEffect, useRef, useState } from "react";
import "./Hero.css";

const SIGNUP_URL = "https://app.emailanswers.ai/signup";

/* Illustrative sample rows. They are labelled "sample" in the UI, not real results. */
const SAMPLE = [
  { email: "sarah.k@northwind.io", server: "Catch-all", sc: "ca", verdict: "Deliverable", vc: "ans", icon: "✓" },
  { email: "m.ross@brightlabs.com", server: "Standard", sc: "ok", verdict: "Valid", vc: "ok", icon: "✓" },
  { email: "info-2019@acmecorp.co", server: "Catch-all", sc: "ca", verdict: "Don't send", vc: "bad", icon: "✕" },
  { email: "j.patel@lumenhq.com", server: "Catch-all", sc: "ca", verdict: "Deliverable", vc: "ans", icon: "✓" },
  { email: "d.lee@oldvendor.net", server: "Dead", sc: "bad", verdict: "Invalid", vc: "bad", icon: "✕" },
];

/* Optional: set to "/hero-visual.png" (file in /public) to show a real image instead of the coded cards. */
const HERO_IMAGE = "";

const STACK = [
  { id: "c1", note: "Standard server", mail: "alex@finstack.io", chip: "ok", label: "✓ Valid" },
  { id: "c2", note: "Catch-all", mail: "priya@growthloop.com", chip: "ans", label: "✓ Deliverable" },
  { id: "c3", note: "Catch-all", mail: "nina@corecloud.ai", chip: "bad", label: "✕ Don't send" },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Flowing ribbons + glowing comets that drift on their own and bend around the cursor. */
function FlowField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const reduce = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINES = 44;
    let w = 0;
    let h = 0;
    let t = 0;
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999 };
    const comets = Array.from({ length: 11 }, (_, k) => ({
      p: 0.5 + ((k * 0.173) % 0.5),
      x: Math.random(),
      v: 0.0007 + Math.random() * 0.0012,
      s: 1.5 + Math.random() * 1.8,
    }));

    const yAt = (p, x) => {
      const n = x / w;
      const base = h * (0.28 + p * 0.64);
      const amp = 26 + p * 74;
      let y =
        base +
        Math.sin(n * 3.2 + t * 0.55 + p * 2.6) * amp +
        Math.sin(n * 7.1 - t * 0.35 + p * 5.2) * amp * 0.32 +
        Math.cos(n * 1.6 + t * 0.25 + p * 1.3) * 34 * (0.4 + p);
      const dx = x - mouse.sx;
      const dy = y - mouse.sy;
      y -= Math.exp(-(dx * dx + dy * dy) / (2 * 160 * 160)) * 46;
      return y;
    };

    function draw() {
      ctx.clearRect(0, 0, w, h);
      mouse.sx += (mouse.x - mouse.sx) * 0.08;
      mouse.sy += (mouse.y - mouse.sy) * 0.08;
      ctx.globalCompositeOperation = "lighter";

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(242,107,29,0)");
      grad.addColorStop(0.2, "rgba(242,107,29,1)");
      grad.addColorStop(0.62, "rgba(255,154,77,1)");
      grad.addColorStop(1, "rgba(242,107,29,0)");
      ctx.strokeStyle = grad;

      for (let i = 0; i < LINES; i++) {
        const p = i / (LINES - 1);
        const accent = i % 7 === 3;
        ctx.globalAlpha = (accent ? 0.5 : 0.09) + 0.3 * Math.pow(p, 1.2) * (accent ? 0.9 : 1);
        ctx.lineWidth = accent ? 1.8 : 1.1;
        ctx.shadowColor = "rgba(242,107,29,.9)";
        ctx.shadowBlur = accent ? 14 : 0;
        ctx.beginPath();
        for (let x = -10; x <= w + 10; x += 10) {
          const y = yAt(p, x);
          if (x === -10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      /* comets: bright heads with fading trails, riding the ribbons */
      for (const c of comets) {
        const hx = c.x * w;
        const trail = 110;
        const tg = ctx.createLinearGradient(hx - trail, 0, hx, 0);
        tg.addColorStop(0, "rgba(255,154,77,0)");
        tg.addColorStop(1, "rgba(255,210,170,.95)");
        ctx.strokeStyle = tg;
        ctx.globalAlpha = 0.65;
        ctx.lineWidth = c.s * 0.6;
        ctx.beginPath();
        for (let k = 0; k <= 11; k++) {
          const x = hx - trail * (1 - k / 11);
          const y = yAt(c.p, x);
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        const hy = yAt(c.p, hx);
        const rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 9);
        rg.addColorStop(0, "rgba(255,235,215,1)");
        rg.addColorStop(0.25, "rgba(255,154,77,.8)");
        rg.addColorStop(1, "rgba(242,107,29,0)");
        ctx.fillStyle = rg;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(hx, hy, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const loop = () => {
      t += 0.012;
      for (const c of comets) {
        c.x += c.v;
        if (c.x > 1.18) c.x = -0.18;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !reduce && visible) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    start();

    if (!reduce) {
      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerleave", onLeave);
    }
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="ea-hero__flow" />;
}

/* Animated sample list: rows go queued -> checking -> verdict, then loop. */
function VerdictPanel() {
  const reduce = prefersReducedMotion();
  const N = SAMPLE.length;
  const [tick, setTick] = useState(reduce ? N + 1 : 0);

  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => setTick((v) => (v + 1) % (N + 4)), 1000);
    return () => clearInterval(id);
  }, [reduce, N]);

  const checking = tick - 1; // index of the row being checked
  const statusOf = (i) => (checking >= N || i < checking ? "done" : i === checking ? "checking" : "queued");

  const done = SAMPLE.filter((_, i) => statusOf(i) === "done");
  const send = done.filter((r) => r.vc !== "bad").length;
  const dont = done.filter((r) => r.vc === "bad").length;
  const resolved = done.filter((r) => r.sc === "ca").length;

  return (
    <div className="ea-panel">
      <div className="ea-panel__top">
        <span className="ea-panel__dots"><i /><i /><i /></span>
        <span>q3_outbound_leads.csv</span>
        <span className="ea-panel__tag">Sample data</span>
      </div>

      <div className="ea-panel__head">
        <span>Email</span>
        <span>Server</span>
        <span>Answer</span>
      </div>

      {SAMPLE.map((r, i) => {
        const s = statusOf(i);
        return (
          <div key={r.email} className={`ea-row is-${s}`}>
            <span className="ea-row__mail">{r.email}</span>
            <span className={`ea-chip ea-chip--${r.sc}`}>{r.server}</span>
            <span className="ea-row__ans">
              {s === "done" && (
                <span key="d" className={`ea-chip ea-chip--${r.vc} ea-pop`}>
                  {r.icon} {r.verdict}
                </span>
              )}
              {s === "checking" && (
                <span className="ea-chip ea-chip--wait"><i className="ea-spin" />Checking…</span>
              )}
              {s === "queued" && <span className="ea-chip ea-chip--queued">Queued</span>}
            </span>
          </div>
        );
      })}

      <div className="ea-panel__stats">
        <div><b className="g">{send}</b><small>Send</small></div>
        <div><b className="r">{dont}</b><small>Don't send</small></div>
        <div><b className="o">{resolved}</b><small>Catch-alls resolved</small></div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const artRef = useRef(null);

  /* gentle 3D tilt of the artwork toward the cursor (mouse only, skipped for reduced motion) */
  const onTilt = (e) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion() || !artRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    artRef.current.style.setProperty("--ry", `${(nx * 12).toFixed(2)}deg`);
    artRef.current.style.setProperty("--rx", `${(-ny * 9).toFixed(2)}deg`);
  };
  const onTiltEnd = () => {
    if (!artRef.current) return;
    artRef.current.style.setProperty("--ry", "0deg");
    artRef.current.style.setProperty("--rx", "0deg");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMsg("invalid");
      return;
    }
    /* Visual only until the real verification API is connected. Never shows a result. */
    setMsg("soon");
  };

  return (
    <section className="ea-hero" id="hero">
      <div className="ea-hero__bg" aria-hidden="true">
        <span className="ea-blob ea-blob--1" />
        <span className="ea-blob ea-blob--2" />
        <FlowField />
      </div>
      <span className="ea-hero__rail ea-hero__rail--l" aria-hidden="true" />
      <span className="ea-hero__rail ea-hero__rail--r" aria-hidden="true" />

      <div className="ea-hero__inner">
        <div className="ea-hero__copy">
          <span className="ea-hero__pill ea-rise" style={{ "--i": 0 }}>
            <i />Catch-all verification, solved
          </span>

          <h1 className="ea-hero__title ea-rise" style={{ "--i": 1 }}>
            <span className="ea-line">No more “unknown.”</span> <span className="ea-line"><em>Just answers.</em></span>
          </h1>

          <p className="ea-hero__sub ea-rise" style={{ "--i": 2 }}>
            EmailAnswers AI turns catch-all addresses into a clear send or don't-send verdict,
            so every lead you paid for is one you can actually reach, with your sender
            reputation intact.
          </p>

          <div className="ea-hero__actions ea-rise" style={{ "--i": 3 }}>
            <a className="ea-btn ea-btn--primary" href={SIGNUP_URL}>
              Get 250 free credits <span className="ea-btn__arr">↗</span>
            </a>
            <a className="ea-btn ea-btn--ghost" href="#how">See how it works</a>
          </div>

          <form className="ea-check ea-rise" style={{ "--i": 4 }} onSubmit={onSubmit} noValidate>
            <label htmlFor="ea-hero-email"><span aria-hidden="true">✉</span> Try an email check</label>
            <div className="ea-check__row">
              <input
                id="ea-hero-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setMsg(null); }}
                placeholder="name@company.com"
                autoComplete="email"
              />
              <button type="submit">Check email →</button>
            </div>
            <div className="ea-check__out" role="status" aria-live="polite">
              {msg === "invalid" && "Please enter a valid email address."}
              {msg === "soon" && (
                <>Single-email checks are coming soon. <a href={SIGNUP_URL}>Get 250 free credits to verify now →</a></>
              )}
            </div>
          </form>

          <ul className="ea-hero__perks ea-rise" style={{ "--i": 5 }}>
            <li>No credit card</li>
            <li>Results in minutes</li>
            <li>A verdict, not a maybe</li>
          </ul>
          

          {/* NEW: how-it-works strip */}
          <ol className="ea-steps ea-rise" style={{ "--i": 6 }}>
            <li><b>Upload your list</b>Drop in the leads you paid for</li>
            <li><b>We check each address</b>Catch-alls get resolved</li>
            <li><b>Get a clear verdict</b>Send or don't send</li>
          </ol>
        
        </div>

        <div
          className="ea-hero__visual ea-rise has-img"
          style={{ "--i": 3 }}
          onPointerMove={onTilt}
          onPointerLeave={onTiltEnd}
        >
          <div className="ea-hero__glow" />
          <div className="ea-art" ref={artRef}>
            <div className="ea-art__float">
              {HERO_IMAGE ? (
                <>
                  <img src={HERO_IMAGE} alt="" />
                  <span
                    className="ea-art__sheen"
                    aria-hidden="true"
                    style={{ WebkitMaskImage: `url(${HERO_IMAGE})`, maskImage: `url(${HERO_IMAGE})` }}
                  />
                </>
              ) : (
                <div className="ea-stack" aria-hidden="true">
                  {STACK.map((s) => (
                    <div key={s.id} className={`ea-card ea-card--${s.id}`}>
                      <small>{s.note}</small>
                      <b>{s.mail}</b>
                      <span className={`ea-chip ea-chip--${s.chip}`}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="ea-art__ground" aria-hidden="true" />
          </div>
          <VerdictPanel />

          <div className="ea-float ea-float--b" aria-hidden="true">
            <span className="ea-float__ico">⚡</span>
            <div><b>One verdict per address</b><small>Send or don't send</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}
