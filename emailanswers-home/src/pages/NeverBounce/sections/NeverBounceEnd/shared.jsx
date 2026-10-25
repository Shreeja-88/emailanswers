import { useEffect, useRef, useState } from "react";

export const prefersReduced = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function useInView({ threshold = 0.2 } = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

/** smoothly animates a number from wherever it is now to `target` */
export function useTween(target, ms = 600) {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    if (prefersReduced()) { cur.current = target; setV(target); return; }
    const from = cur.current;
    let raf, t0;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / ms);
      cur.current = from + (target - from) * (1 - Math.pow(1 - p, 3));
      setV(Math.round(cur.current));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/** counts up from 0 to `to` when it appears (and again whenever `to` changes) */
export function CountNum({ to, prefix = "", suffix = "", ms = 1400 }) {
  const [t, setT] = useState(0);
  useEffect(() => { setT(to); }, [to]);
  const v = useTween(t, ms);
  return <>{prefix}{v.toLocaleString("en-US")}{suffix}</>;
}

export function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, seen] = useInView({ threshold: 0.12 });
  return (
    <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`ne-reveal ${seen ? "in" : ""} ${className}`} {...rest}>{children}</Tag>
  );
}

export function Words({ text, className = "", wordClass = "" }) {
  const [ref, seen] = useInView({ threshold: 0.3 });
  return (
    <span ref={ref} className={`${seen ? "in" : ""} ${className}`}>
      {text.split(" ").map((w, i) => (
        <span key={i} className={`ne-word ${wordClass}`} style={{ "--i": i }}>{w}&nbsp;</span>
      ))}
    </span>
  );
}

const PATHS = {
  arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></>,
  file: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></>,
  filter: <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />,
};

export function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{PATHS[name]}</svg>
  );
}

export function Chip({ kind, children }) {
  return <span key={kind} className={`ne-chip ne-chip-${kind} ${kind === "ans" || kind === "dont" || kind === "ok" ? "ne-pop" : ""}`}>{children}</span>;
}

export function Eyebrow({ children }) {
  return (
    <span className="inline-flex w-max items-center gap-2 rounded-full border border-[var(--ne-line)] bg-[var(--ne-surface)] px-3 py-1.5 text-[13px] text-[var(--ne-muted)]">
      <i className="h-1.5 w-1.5 rounded-full bg-[var(--ne-orange)]" />{children}
    </span>
  );
}
