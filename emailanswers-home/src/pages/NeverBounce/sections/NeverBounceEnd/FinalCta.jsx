import "./end.css";
import { useState } from "react";
import { Eyebrow, Icon, Reveal, Words, useTween } from "./shared";

const FLOATERS = [
  { left: "2.5%", top: "58%", delay: "0s", a: "priya@growthloop.com", b: "✓ Deliverable" },
  { left: "80%", top: "62%", delay: "-1.8s", a: "tom@shiftly.co", b: "✓ Deliverable" },
  { left: "3%", top: "30%", delay: "-3.5s", a: "info@acmecorp.co", b: "✕ Don't send" },
  { left: "78%", top: "28%", delay: "-5.2s", a: "nina@corecloud.ai", b: "✕ Don't send" },
];

// Same assumptions as the example on this page: about 4 in 10 leads are accept-all, about 7 in 10 of those get recovered.
const CATCH_ALL_SHARE = 0.4;
const RECOVERY_SHARE = 0.7;
// 10 x 10 map = 100 leads. First 40 are accept-all; 28 of them flip to "recovered", 12 to "don't send".
const DOTS = Array.from({ length: 100 }, (_, i) => {
  if (i >= 40) return { i, k: 0, cls: "ne-dot-std" };
  return { i, k: i, cls: i % 10 >= 7 ? "ne-dot-bad" : "ne-dot-ok" };
});
const fmt = (n) => n.toLocaleString("en-US");

export default function FinalCta({ href = "#" }) {
  const [size, setSize] = useState(10000);
  const catchAll = useTween(Math.round(size * CATCH_ALL_SHARE));
  const recovered = useTween(Math.round(size * CATCH_ALL_SHARE * RECOVERY_SHARE));
  const pctCatch = CATCH_ALL_SHARE * 100;

  return (
    <section id="try-it" className="ne-root relative overflow-hidden border-b border-dashed border-[var(--ne-line)] bg-[var(--ne-bg)] px-5 py-20 sm:px-12 lg:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-[var(--ne-line)] bg-[radial-gradient(70%_90%_at_50%_100%,rgba(242,107,29,.5),transparent_70%),#181818] px-5 py-16 text-center sm:px-10 sm:py-20">
          {/* chips that float up and flip from "Accept-all" to a verdict */}
          <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden="true">
            {FLOATERS.map((f) => (
              <span key={f.a} className="ne-float ne-mono text-[11px]" style={{ left: f.left, top: f.top, animationDelay: f.delay }}>
                <span className="a ne-chip ne-chip-ca">{f.a}</span>
                <span className={`b ne-chip ${f.b.startsWith("✓") ? "ne-chip-ans" : "ne-chip-dont"}`}>{f.b}</span>
              </span>
            ))}
          </div>

          <div className="relative">
            <div className="flex justify-center"><Eyebrow>Try it on your own list</Eyebrow></div>
            <h2 className="mx-auto max-w-3xl pt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.025em] sm:text-5xl">
              <Words text="Find out how many of your" />
              <span className="ne-script text-[1.1em]"><Words text="accept-all leads are real." wordClass="ne-shimmer" /></span>
            </h2>
            <p className="mx-auto max-w-xl pt-4 text-lg text-[var(--ne-muted)]">
              Upload the catch-alls NeverBounce couldn't verify. See your recovered leads before you pay a thing.
            </p>

            {/* estimator: a dot map of 100 leads + a slider */}
            <div className="mx-auto mt-8 grid max-w-3xl gap-5 rounded-2xl border border-[var(--ne-line)] bg-[rgba(18,18,18,.82)] p-5 text-left backdrop-blur sm:grid-cols-[auto_1fr] sm:p-6">
              <div>
                <div className="grid w-[168px] grid-cols-10 gap-[5px]" role="img" aria-label="Map of 100 leads: 40 accept-all, of which 28 are recovered as deliverable and 12 are marked don't send">
                  {DOTS.map((d) => <i key={d.i} className={`ne-dot ${d.cls}`} style={{ "--i": d.i, "--k": d.k }} />)}
                </div>
                <ul className="pt-3 text-[11px] text-[var(--ne-muted)]">
                  <li className="flex items-center gap-2"><i className="ne-dot-key bg-[#34393a]" />Standard result</li>
                  <li className="flex items-center gap-2"><i className="ne-dot-key bg-[var(--ne-amber)]" />Accept-all</li>
                  <li className="flex items-center gap-2"><i className="ne-dot-key bg-[var(--ne-orange2)]" />Recovered</li>
                  <li className="flex items-center gap-2"><i className="ne-dot-key bg-[var(--ne-red)]" />Don't send</li>
                </ul>
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor="ne-size" className="text-sm font-medium">How big is your list?</label>
                  <span className="ne-mono text-lg font-semibold tabular-nums text-[var(--ne-orange2)]">{fmt(size)} <span className="text-xs font-normal text-[var(--ne-muted)]">leads</span></span>
                </div>
                <input id="ne-size" type="range" min="1000" max="100000" step="1000" value={size} onChange={(e) => setSize(+e.target.value)} className="ne-range mt-4" />
                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl border border-[var(--ne-line)] bg-[#141414] p-3">
                    <div className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--ne-amber)]">~{fmt(catchAll)}</div>
                    <div className="text-xs text-[var(--ne-muted)]">likely come back accept-all</div>
                  </div>
                  <div className="rounded-xl border border-[var(--ne-orange)]/40 bg-[rgba(242,107,29,.08)] p-3 shadow-[0_0_28px_-10px_rgba(242,107,29,.7)]">
                    <div className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--ne-orange2)]">~{fmt(recovered)}</div>
                    <div className="text-xs text-[var(--ne-muted)]">recoverable as deliverable</div>
                  </div>
                </div>
                <p className="pt-3 text-[11px] leading-snug text-[var(--ne-dim)]">Illustrative estimate using the example figures on this page (about {pctCatch}% accept-all, about {Math.round(RECOVERY_SHARE * 100)}% of those recovered). Your own results will vary.</p>
              </div>
            </div>

            <div className="pt-8">
              <a href={href} className="ne-btn">Verify 100 emails free <Icon name="arrow" className="ne-arrow h-4 w-4" /></a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-5 text-[13px] text-[var(--ne-muted)]">
              <span>✓ No credit card</span><span>✓ GDPR compliant</span><span>✓ Works with NeverBounce exports</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
