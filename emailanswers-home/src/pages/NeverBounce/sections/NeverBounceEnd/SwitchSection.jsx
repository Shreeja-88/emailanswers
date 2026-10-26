import "./end.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chip, CountNum, Eyebrow, Icon, Reveal, Words, prefersReduced, useInView, useTween } from "./shared";

// What the example list looks like at each step
const LIST = [
  { email: "priya@growthloop.com", type: "ca", label: "Accept-all", result: ["ans", "✓ Deliverable"] },
  { email: "alex@finstack.io", type: "ok", label: "Valid", result: ["ok", "✓ Valid"] },
  { email: "tom@shiftly.co", type: "ca", label: "Accept-all", result: ["ans", "✓ Deliverable"] },
  { email: "sales@oldco.biz", type: "bad", label: "Invalid", result: ["bad", "✕ Invalid"] },
  { email: "nina@corecloud.ai", type: "ca", label: "Accept-all", result: ["dont", "✕ Don't send"] },
];
const isCatchAll = (r) => r.type === "ca";

const STEPS = [
  { n: "01", title: "Export from NeverBounce", text: "Download your results CSV, or filter just the accept-all and unknown rows." },
  { n: "02", title: "Upload to EmailAnswers AI", text: "Drop the file in or connect your sequencer. No reformatting needed." },
  { n: "03", title: "Get a verdict on every lead", text: "Each address comes back send or don't send. Push clean leads straight into your campaign." },
];

function ExportVisual({ mode }) {
  const kept = mode === "switch" ? LIST.length : LIST.filter(isCatchAll).length;
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--ne-line)] bg-[#141414] p-3">
      <div className="ne-mono mb-2 flex items-center justify-between text-[11px] text-[var(--ne-muted)]">
        <span className="flex min-w-0 items-center gap-1.5 truncate"><Icon name="file" className="h-3.5 w-3.5 flex-none" />nb_results.csv</span>
        <span className="flex items-center gap-2 whitespace-nowrap">
          {mode === "both"
            ? <span className="ne-chip ne-chip-ans ne-pop" style={{ padding: "2px 8px" }}><Icon name="filter" className="h-3 w-3" />{kept} of {LIST.length} · filtered</span>
            : <span className="tabular-nums">{kept} rows</span>}
        </span>
      </div>
      <ul>
        {LIST.map((r, i) => {
          const keep = mode === "switch" || isCatchAll(r);
          return (
            <li key={r.email} className="overflow-hidden transition-all duration-700 ease-in-out" style={{ maxHeight: keep ? 44 : 0, opacity: keep ? 1 : 0, transform: keep ? "none" : "translateX(24px)" }}>
              <div className="ne-rise mb-1.5 flex items-center justify-between gap-2 rounded-lg border-l-2 border-[var(--ne-orange)] bg-[rgba(242,107,29,.07)] px-2 py-1.5" style={{ animationDelay: `${i * 70}ms` }}>
                <span className="ne-mono truncate text-[11px]">{r.email}</span>
                <Chip kind={r.type}>{r.label}</Chip>
              </div>
            </li>
          );
        })}
      </ul>
      <span key={mode} className="pointer-events-none absolute inset-x-0 h-10 bg-[linear-gradient(180deg,transparent,rgba(255,154,77,.18),transparent)]" style={{ animation: "ne-scan 1.4s ease-in-out .3s both" }} />
    </div>
  );
}

function UploadVisual({ active, mode }) {
  const on = active >= 1;
  const target = mode === "both" ? 4000 : 10000;
  const rows = useTween(on ? target : 0, 1600);
  return (
    <div className="rounded-xl border border-[var(--ne-line)] bg-[#141414] p-3">
      <div className={`relative grid h-[148px] place-items-center overflow-hidden rounded-lg border-2 border-dashed transition-colors duration-500 ${on ? "border-[var(--ne-orange)]/70 bg-[rgba(242,107,29,.06)]" : "border-[#383838]"}`}>
        {on && <span key={`ring-${mode}`} className="ne-landring" style={{ animationDelay: ".75s" }} />}
        <div className="flex flex-col items-center gap-2" style={{ transform: on ? "none" : "translate(-70px,-60px) rotate(-18deg)", opacity: on ? 1 : 0, transition: "transform .9s cubic-bezier(.2,.8,.2,1), opacity .5s" }}>
          <span className={`grid h-11 w-11 place-items-center rounded-xl text-[#1a0d05] ${on ? "ne-bg-grad" : "bg-[#2c2c2c]"}`}><Icon name="upload" /></span>
          <span className="ne-mono text-[11px] text-[var(--ne-muted)]">nb_results.csv · <span className="tabular-nums text-[var(--ne-text)]">{rows.toLocaleString("en-US")}</span> rows</span>
        </div>
        {!on && <span className="absolute text-xs text-[var(--ne-dim)]">drop your file here</span>}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#2c2c2c]">
        <div className="h-full rounded-full ne-bg-grad" style={{ width: on ? "100%" : "0%", transition: "width 1.6s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <p className={`pt-2 text-xs transition-colors duration-500 ${active >= 2 ? "text-[var(--ne-green)]" : "text-[var(--ne-dim)]"}`}>
        {active >= 2 ? "✓ Uploaded. Verifying…" : on ? "Uploading…" : "Waiting for file"}
      </p>
    </div>
  );
}

function VerdictVisual({ active }) {
  const done = active >= 3;
  const rows = LIST.filter(isCatchAll);
  const got = useTween(done ? 2 : 0, 900);
  return (
    <div className="rounded-xl border border-[var(--ne-line)] bg-[#141414] p-3">
      <ul className="space-y-1.5">
        {rows.map((r, i) => (
          <li key={r.email} className="flex items-center justify-between gap-2 rounded-lg px-2 py-2">
            <span className="ne-mono truncate text-[11px]">{r.email}</span>
            {done
              ? <span key="v" className="ne-flipin" style={{ animationDelay: `${i * 260}ms` }}><Chip kind={r.result[0]}>{r.result[1]}</Chip></span>
              : <span key="p"><Chip kind="ca">Accept-all</Chip></span>}
          </li>
        ))}
      </ul>
      <div className={`mt-3 flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all duration-500 ${done ? "border-[var(--ne-orange)]/50 bg-[rgba(242,107,29,.08)] shadow-[0_0_24px_-8px_rgba(242,107,29,.6)]" : "border-[var(--ne-line)]"}`}>
        <span className="text-[var(--ne-muted)]">Recovered as deliverable</span>
        <b className="ne-mono text-sm tabular-nums text-[var(--ne-orange2)]">{got} of 3</b>
      </div>
    </div>
  );
}

function Node({ children, tone = "plain", className = "", seq }) {
  const tones = {
    plain: "border-[var(--ne-line)] bg-[var(--ne-surface2)]",
    us: "border-transparent ne-bg-grad text-[#1a0d05] ne-node-live",
    good: "border-[var(--ne-green)]/40 bg-[rgba(62,207,142,.08)]",
    amber: "border-[var(--ne-amber)]/40 bg-[rgba(245,184,61,.08)]",
  };
  return (
    <div className={`flex-none rounded-xl border px-3 py-2 text-center text-xs font-semibold leading-tight ${tones[tone]} ${seq !== undefined && tone !== "us" ? "ne-seq" : ""} ${className}`} style={seq !== undefined ? { "--sd": `${seq * 0.7}s` } : undefined}>
      {children}
    </div>
  );
}
function Wire({ color = "var(--ne-orange2)", delay = 0 }) {
  return <span className="ne-wire"><i className="ne-packet" style={{ background: color, boxShadow: `0 0 10px ${color}`, animationDelay: `${delay}s` }} /></span>;
}

function Flow({ mode }) {
  if (mode === "switch")
    return (
      <div key="switch" className="ne-rise flex items-center gap-3 overflow-x-auto py-2">
        <Node seq={0}>Your list<br /><span className="ne-mono text-[var(--ne-muted)]"><CountNum to={10000} /> leads</span></Node>
        <Wire />
        <Node tone="us">EmailAnswers AI</Node>
        <Wire color="var(--ne-green)" delay={0.6} />
        <Node tone="good" seq={2}>Send or don't send<br /><span className="font-normal text-[var(--ne-muted)]">on every address</span></Node>
      </div>
    );
  return (
    <div key="both" className="ne-rise flex min-w-[560px] items-stretch gap-3 overflow-x-auto py-2">
      <Node seq={0} className="flex flex-col justify-center">Your list<br /><span className="ne-mono text-[var(--ne-muted)]"><CountNum to={10000} /></span><br /><span className="mt-1 inline-block text-[var(--ne-orange2)]">NeverBounce</span></Node>
      <div className="flex flex-1 flex-col justify-around gap-4">
        <div className="flex items-center gap-3">
          <Wire color="var(--ne-green)" />
          <Node tone="good" seq={1}>~<CountNum to={6000} /> valid or invalid<br /><span className="font-normal text-[var(--ne-muted)]">already answered</span></Node>
        </div>
        <div className="flex items-center gap-3">
          <Wire color="var(--ne-amber)" delay={0.4} />
          <Node tone="amber" seq={1}>~<CountNum to={4000} /> accept-all<br />+ unknown</Node>
          <Wire delay={0.9} />
          <Node tone="us">EmailAnswers AI</Node>
          <Wire color="var(--ne-green)" delay={1.4} />
          <Node tone="good" seq={3}>~<CountNum to={2800} />+<br /><span className="font-normal text-[var(--ne-muted)]">recovered</span></Node>
        </div>
      </div>
    </div>
  );
}

export default function SwitchSection() {
  const [ref, seen] = useInView({ threshold: 0.25 });
  const [mode, setMode] = useState("switch");
  const [active, setActive] = useState(0);        // 0..3 : how far the little story has played
  const [manual, setManual] = useState(false);
  const timer = useRef(null);

  const play = useCallback(() => {
    clearInterval(timer.current);
    if (prefersReduced()) { setActive(3); return; }
    setActive(0);
    let i = 0;
    timer.current = setInterval(() => { i += 1; setActive(i); if (i >= 3) clearInterval(timer.current); }, 1700);
  }, []);
  useEffect(() => { if (seen && !manual) play(); return () => clearInterval(timer.current); }, [seen, manual, play]);

  const jump = (i) => { clearInterval(timer.current); setManual(true); setActive(i + 1); };

  return (
    <section id="switch" ref={ref} className="ne-root relative overflow-hidden border-b border-dashed border-[var(--ne-line)] bg-[var(--ne-bg)] px-5 py-20 sm:px-12 lg:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="ne-blob-a absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#2a6fb0]/20 blur-[110px]" />
        <div className="ne-blob-b absolute -right-24 bottom-0 h-[460px] w-[460px] rounded-full bg-[var(--ne-orange)]/20 blur-[120px]" />
      </div>

      <div className="relative">
        <Reveal><Eyebrow>Switching from NeverBounce</Eyebrow></Reveal>
        <h2 className="max-w-3xl pt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.025em] sm:text-5xl">
          <Words text="Switch in minutes." />
          <span className="ne-script text-[1.1em]"><Words text="Or run both." wordClass="ne-shimmer" /></span>
        </h2>
        <Reveal delay={120}>
          <p className="max-w-2xl pt-4 text-lg text-[var(--ne-muted)]">
            You don't have to rip anything out. Many teams keep NeverBounce for standard checks and send only their accept-all and unknown results through EmailAnswers AI.
          </p>
        </Reveal>

        <Reveal delay={200} className="pt-8">
          <div role="tablist" aria-label="Choose how you switch" className="relative inline-grid grid-cols-2 rounded-full border border-[var(--ne-line)] bg-[var(--ne-surface)] p-1">
            <span aria-hidden="true" className="ne-bg-grad absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-[0_6px_20px_-6px_rgba(242,107,29,.7)] transition-transform duration-500 ease-out"
              style={{ transform: mode === "both" ? "translateX(100%)" : "none" }} />
            {[["switch", "Switch fully"], ["both", "Run both"]].map(([id, label]) => (
              <button key={id} role="tab" aria-selected={mode === id} onClick={() => { setMode(id); if (!manual) play(); }}
                className={`relative z-10 rounded-full px-5 py-2 text-sm! font-semibold transition-colors ${mode === id ? "text-[#1a0d05]" : "text-[var(--ne-muted)] hover:text-[var(--ne-text)]"}`}>
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* progress line across the three steps */}
        <div className="relative mt-10 hidden lg:block" aria-hidden="true">
          <div className="absolute left-[16.66%] right-[16.66%] top-4 h-0.5 bg-[var(--ne-line)]" />
          <div className="ne-bg-grad absolute left-[16.66%] top-4 h-0.5 transition-all duration-[1400ms] ease-out" style={{ width: `${(Math.min(active, 3) / 3) * 66.66}%` }} />
          <div className="relative grid grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="grid place-items-center">
                <span className={`grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold transition-all duration-500 ${active > i ? "border-transparent ne-bg-grad text-[#1a0d05]" : active === i ? "border-[var(--ne-orange)] bg-[var(--ne-bg)] text-[var(--ne-orange2)]" : "border-[var(--ne-line)] bg-[var(--ne-bg)] text-[var(--ne-dim)]"}`}>
                  {active > i ? <Icon name="check" className="h-4 w-4" /> : i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 pt-6 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div role="button" tabIndex={0} onClick={() => jump(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(i); } }} aria-label={`Show step ${s.n}`}
                className={`ne-spot block h-full w-full cursor-pointer rounded-2xl border p-6 text-left transition-colors duration-500 ${active > i || active === i ? "border-[var(--ne-orange)]/40 bg-[linear-gradient(160deg,rgba(242,107,29,.09),transparent_60%),var(--ne-surface)]" : "border-[var(--ne-line)] bg-[var(--ne-surface)]"}`}>
                <span className="ne-mono text-[13px] font-semibold text-[var(--ne-orange)]">{s.n}</span>
                <h3 className="pt-2 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="pt-2 pb-5 text-[15px] text-[var(--ne-muted)]">{s.text}</p>
                {i === 0 && <ExportVisual mode={mode} />}
                {i === 1 && <UploadVisual active={active} mode={mode} />}
                {i === 2 && <VerdictVisual active={active} />}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="pt-10">
          <div className="rounded-2xl border border-[var(--ne-line)] bg-[var(--ne-surface)] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-5">
              <h3 className="text-base font-semibold">{mode === "switch" ? "Switch fully: one tool, every address answered" : "Run both: NeverBounce first, then only the leftovers"}</h3>
              <button type="button" onClick={() => { setManual(false); play(); }} className="ne-mono rounded-full border border-[var(--ne-line)] px-3 py-1 text-[11px]! text-[var(--ne-muted)] hover:text-[var(--ne-text)]">Replay</button>
            </div>
            <Flow mode={mode} />
            <p className="pt-4 text-xs text-[var(--ne-dim)]">Illustrative numbers based on the 10,000-lead example earlier on this page.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
