import { useEffect, useState } from "react";
import { PROTECT, PROTECT_IDS } from "../../data/products";
import Icon from "./Icon";
import Pill from "./Pill";
import Reveal, { Words } from "./Reveal";

/* Small visual for each safeguard. `active` flips on when its row opens, so bars grow and pills pop in. */
function Mini({ id, active }) {
  const d = (ms) => ({ transitionDelay: active ? `${ms}ms` : "0ms" });
  const show = `transition-all duration-500 ${active ? "scale-100 opacity-100" : "scale-75 opacity-0"}`;

  if (id === "score")
    return (
      <div className="space-y-3">
        {[["priya@growthloop", 94], ["tom@shiftly.co", 71], ["info@acmecorp", 31]].map(([n, v], i) => (
          <div key={n} className="flex items-center gap-3 text-xs">
            <span className="pr-mono w-28 flex-none truncate text-[var(--pr-muted)]">{n}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#2a2a2a]">
              <span className={`block h-full rounded-full transition-[width] duration-1000 ease-out ${v > 60 ? "pr-bg-grad-r" : "bg-[var(--pr-red)]"}`}
                style={{ width: active ? `${v}%` : "0%", ...d(150 * i) }} />
            </span>
            <span className="pr-mono w-6 text-right tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    );

  if (id === "dmarc")
    return (
      <div>
        <div className="flex flex-wrap gap-2">
          {[["SPF", true], ["DKIM", true], ["DMARC", false]].map(([n, ok], i) => (
            <span key={n} style={d(120 * i)} className={`${show} pr-chip ${ok ? "pr-chip-ok" : "pr-chip-bad"}`}>
              <Icon name={ok ? "check" : "x"} className="h-3.5 w-3.5" /> {n} {ok ? "pass" : "fail"}
            </span>
          ))}
        </div>
        <ul className="mt-4 space-y-2 text-xs">
          {[["mail.google.com", "ok"], ["sendgrid.net", "ok"], ["unknown-host.ru", "bad"]].map(([h, k], i) => (
            <li key={h} style={d(400 + 120 * i)} className={`flex items-center justify-between rounded-lg border border-[var(--pr-line)] bg-[#141414] px-3 py-2 ${show}`}>
              <span className="pr-mono text-[var(--pr-muted)]">{h}</span>
              <span className={k === "ok" ? "text-[var(--pr-green)]" : "text-[var(--pr-red)]"}>{k === "ok" ? "authorized" : "spoofing?"}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  if (id === "tests")
    return (
      <ul className="space-y-2.5 text-sm">
        {[["Authentication", true], ["Content check", true], ["Spam score 2.1 / 10", true], ["Broken link in footer", false]].map(([n, ok], i) => (
          <li key={n} style={d(140 * i)} className={`flex items-center gap-3 ${show}`}>
            <span className={`grid h-5 w-5 place-items-center rounded-full text-[#06140d] ${ok ? "bg-[var(--pr-green)]" : "bg-[var(--pr-red)]"}`}><Icon name={ok ? "check" : "x"} className="h-3 w-3" /></span>
            <span className={ok ? "" : "text-[var(--pr-red)]"}>{n}</span>
          </li>
        ))}
      </ul>
    );

  // catch-all verdicts
  return (
    <div>
      <p className="pr-mono text-xs text-[var(--pr-muted)]">acmecorp.co accepts every address…</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="pr-chip pr-chip-ca line-through opacity-80">Accept-all · unknown</span>
        <Icon name="arrow" className={`h-4 w-4 text-[var(--pr-dim)] transition-all duration-500 ${active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`} />
        <span style={d(350)} className={show}><Pill kind="ans">✓ Deliverable · 94</Pill></span>
      </div>
      <p className={`pr-script mt-3 text-2xl text-[var(--pr-orange2)] transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`} style={d(600)}>no more “unknown.”</p>
    </div>
  );
}

export default function ProtectList() {
  const [open, setOpen] = useState("catchall");

  useEffect(() => {
    const onSelect = (e) => { if (PROTECT_IDS.includes(e.detail)) setOpen(e.detail); };
    window.addEventListener("product:select", onSelect);
    return () => window.removeEventListener("product:select", onSelect);
  }, []);

  return (
    <section id="protect" className="pr-root relative scroll-mt-20 overflow-hidden bg-[#0e0e0e] px-4 py-20 sm:px-6 lg:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="pr-blob-b absolute -right-40 -top-32 h-[480px] w-[480px] rounded-full bg-[#2a6fb0]/20 blur-[110px]" />
        <div className="pr-blob-a absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full bg-[var(--pr-orange)]/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] gap-10 border-x border-dashed border-[var(--pr-line)] px-4 sm:px-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16">
        <div className="self-start lg:sticky lg:top-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pr-line)] bg-[var(--pr-surface)] px-3 py-1.5 text-[13px] text-[var(--pr-muted)]">
              <i className="h-1.5 w-1.5 rounded-full bg-[var(--pr-orange)]" />Protect
            </span>
          </Reveal>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.025em] sm:text-5xl">
            <Words text="Your sender reputation is" />
            <span className="pr-script text-[1.12em]"><Words text="earned slowly" wordClass="pr-grad" /></span>
            <Words text="and lost fast." />
          </h2>
          <Reveal delay={150}><p className="mt-5 text-lg text-[var(--pr-muted)]">Four safeguards that keep bad addresses, and bad setup, away from your next send.</p></Reveal>
        </div>

        <ul className="space-y-3">
          {PROTECT.map((p, i) => {
            const on = open === p.id;
            return (
              <Reveal as="li" key={p.id} delay={i * 90} id={p.id} className="scroll-mt-24">
                <div className={`pr-spot rounded-2xl border transition-colors duration-300 ${on ? "border-[var(--pr-orange)]/50 bg-[linear-gradient(160deg,rgba(242,107,29,.10),transparent_55%),var(--pr-surface)]" : "border-[var(--pr-line)] bg-[var(--pr-surface)]"}`}
                  onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`); }}>
                  <h3>
                    <button type="button" aria-expanded={on} aria-controls={`protect-${p.id}`} onClick={() => setOpen(on ? null : p.id)}
                      className="flex w-full items-center gap-4 p-5 text-left">
                      <span className="pr-mono w-6 text-xs text-[var(--pr-dim)]">0{i + 1}</span>
                      <span className={`grid h-11 w-11 flex-none place-items-center rounded-xl border transition-all duration-300 ${on ? "border-transparent pr-bg-grad text-[#1a0d05]" : "border-[var(--pr-line)] bg-[var(--pr-surface2)] text-[var(--pr-orange2)]"}`}><Icon name={p.icon} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-semibold">{p.title}</span>
                        <span className="block text-sm text-[var(--pr-muted)]">{p.blurb}</span>
                      </span>
                      <span className={`grid h-8 w-8 flex-none place-items-center rounded-full border transition-all duration-300 ${on ? "rotate-45 border-[var(--pr-orange)] bg-[var(--pr-orange)] text-[#1a0d05]" : "border-[var(--pr-line)] text-[var(--pr-muted)]"}`}><Icon name="plus" className="h-4 w-4" /></span>
                    </button>
                  </h3>
                  <div id={`protect-${p.id}`} aria-hidden={!on} className={`grid transition-[grid-template-rows] duration-500 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="grid gap-6 px-5 pb-6 sm:pl-[4.75rem] md:grid-cols-2">
                        <div>
                          <p className="text-[var(--pr-muted)]">{p.detail}</p>
                          <ul className="mt-4 space-y-2 text-sm">
                            {p.points.map((t) => (
                              <li key={t} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-[var(--pr-orange2)]" />{t}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="self-start rounded-2xl border border-[var(--pr-line)] bg-[#141414] p-4"><Mini id={p.id} active={on} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
