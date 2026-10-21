import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { VERIFY, VERIFY_IDS } from "../../data/products";
import Icon from "./Icon";
import Pill from "./Pill";
import Reveal, { Words } from "./Reveal";
import { prefersReduced, useInView } from "./hooks";
import { ApiDemo, BulkDemo, CrmDemo, SingleDemo } from "./Demos";

const DEMOS = { single: SingleDemo, bulk: BulkDemo, crm: CrmDemo, api: ApiDemo };
const AUTOPLAY_MS = 8000;

const TICKER = [
  ["alex@finstack.io", "send"], ["priya@growthloop.com", "ans"], ["info@acmecorp.co", "dont"], ["tom@shiftly.co", "ans"],
  ["nina@corecloud.ai", "send"], ["sales@oldco.biz", "dont"], ["sarah.k@northwind.io", "ans"], ["d.lee@oldvendor.net", "dont"],
];

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="pr-marquee mt-10" aria-hidden="true">
      <div className="pr-marquee-track">
        {items.map(([e, k], i) => (
          <span key={i} className="flex items-center gap-3 rounded-full border border-[var(--pr-line)] bg-[var(--pr-surface)] py-1.5 pl-4 pr-1.5">
            <span className="pr-mono text-xs text-[var(--pr-muted)]">{e}</span><Pill kind={k} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  const [active, setActive] = useState("single");
  const [touched, setTouched] = useState(false);   // the user took over: stop auto-advancing
  const [hover, setHover] = useState(false);
  const [secRef, inView] = useInView({ threshold: 0.25, once: false });
  const tabs = useRef({});
  const [bar, setBar] = useState({ top: 0, height: 0 });
  const reduced = prefersReduced();
  const autoplay = inView && !touched && !hover && !reduced;

  // react to the navbar menu
  useEffect(() => {
    const onSelect = (e) => { if (VERIFY_IDS.includes(e.detail)) { setActive(e.detail); setTouched(true); } };
    window.addEventListener("product:select", onSelect);
    return () => window.removeEventListener("product:select", onSelect);
  }, []);

  // slide the highlight to the active tab
  useLayoutEffect(() => {
    const place = () => { const el = tabs.current[active]; if (el) setBar({ top: el.offsetTop, height: el.offsetHeight }); };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  const choose = (id) => { setActive(id); setTouched(true); };
  const next = () => setActive((a) => VERIFY_IDS[(VERIFY_IDS.indexOf(a) + 1) % VERIFY_IDS.length]);
  const onKey = (e) => {
    const i = VERIFY_IDS.indexOf(active);
    let n = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = VERIFY_IDS[(i + 1) % VERIFY_IDS.length];
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = VERIFY_IDS[(i - 1 + VERIFY_IDS.length) % VERIFY_IDS.length];
    if (n) { e.preventDefault(); choose(n); tabs.current[n]?.focus(); }
  };

  const current = VERIFY.find((p) => p.id === active);
  const Demo = DEMOS[active];

  return (
    <section id="product" ref={secRef} className="pr-root relative scroll-mt-20 overflow-hidden bg-[var(--pr-bg)] px-4 py-20 sm:px-6 lg:py-28">
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="pr-plus absolute inset-0" />
        <div className="pr-blob-a absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-[#2a6fb0]/25 blur-[110px]" />
        <div className="pr-blob-b absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full bg-[var(--pr-orange)]/25 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] border-x border-dashed border-[var(--pr-line)] px-4 sm:px-10">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pr-line)] bg-[var(--pr-surface)] px-3 py-1.5 text-[13px] text-[var(--pr-muted)]">
            <i className="h-1.5 w-1.5 rounded-full bg-[var(--pr-orange)]" />Product
          </span>
        </Reveal>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
          <Words text="One list in." />
          <span className="pr-script text-[1.12em]"><Words text="A verdict" wordClass="pr-grad" /></span>
          <Words text="on every address out." />
        </h2>
        <Reveal delay={150}><p className="mt-5 max-w-xl text-lg text-[var(--pr-muted)]">
          Four ways to feed us addresses. Pick one — each demo plays itself, or take over and try your own.
        </p></Reveal>

        <Ticker />

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:gap-10">
          <Reveal delay={100}>
            <div role="tablist" aria-label="Ways to verify" aria-orientation="vertical" onKeyDown={onKey}
              className="relative flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              <span aria-hidden="true" className="pointer-events-none absolute left-0 right-0 pr-tabbar hidden rounded-2xl transition-all duration-500 ease-out lg:block"
                style={{ top: bar.top, height: bar.height }} />
              {VERIFY.map((p, i) => {
                const on = p.id === active;
                return (
                  <button key={p.id} ref={(el) => (tabs.current[p.id] = el)} role="tab" id={`tab-${p.id}`} aria-selected={on}
                    aria-controls="product-panel" tabIndex={on ? 0 : -1} onClick={() => choose(p.id)}
                    className={`group relative z-10 flex min-w-[210px] flex-1 items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-colors lg:min-w-0 lg:flex-none ${
                      on ? "border-[var(--pr-orange)]/60 bg-[#2a1a10] lg:border-transparent lg:bg-transparent" : "border-[var(--pr-line)] bg-[var(--pr-surface)] hover:border-[#444] lg:bg-transparent"}`}>
                    <span className={`grid h-10 w-10 flex-none place-items-center rounded-xl border transition-all duration-300 ${on ? "border-transparent pr-bg-grad text-[#1a0d05] shadow-[0_6px_20px_-6px_rgba(242,107,29,.8)]" : "border-[var(--pr-line)] bg-[var(--pr-surface2)] group-hover:-translate-y-0.5"}`}>
                      <Icon name={p.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2 text-base font-semibold">
                        <span className="pr-mono text-[11px] text-[var(--pr-dim)]">0{i + 1}</span>
                        {p.short}
                        {p.tag && <span className="rounded-md bg-[var(--pr-orange)]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--pr-orange2)]">{p.tag}</span>}
                      </span>
                      <span className="mt-1 hidden text-sm text-[var(--pr-muted)] lg:block">{p.blurb}</span>
                    </span>
                    {on && !touched && !reduced && (
                      <span key={`pg-${active}-${touched}`} className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[var(--pr-orange2)]"
                        style={{ animation: `pr-fill ${AUTOPLAY_MS}ms linear forwards`, animationPlayState: autoplay ? "running" : "paused" }}
                        onAnimationEnd={next} />
                    )}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={200} className="min-w-0">
            <div id="product-panel" role="tabpanel" aria-labelledby={`tab-${active}`} key={active}
              onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onPointerDown={() => setTouched(true)} onFocus={() => setTouched(true)}
              className="pr-rise pr-spot min-w-0 rounded-3xl border border-[var(--pr-line)] bg-[var(--pr-surface)] p-5 sm:p-8"
              onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`); }}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="max-w-lg text-lg leading-snug">{current.lead}</p>
                <span className="pr-mono rounded-full border border-[var(--pr-line)] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[var(--pr-muted)]">Simulated demo</span>
              </div>
              <div className="mt-6"><Demo /></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
