import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Pill from "./Pill";
import { prefersReduced, useCountUp, useInView } from "./hooks";
import { STEP_LABELS, verifyEmail } from "../../data/products";

/* ---------- 1. Single check: plays by itself when scrolled into view ---------- */
function Ring({ value, good, run }) {
  const R = 34, C = 2 * Math.PI * R;
  const v = useCountUp(value, { start: run, duration: 1000 });
  return (
    <div className="relative h-28 w-28 flex-none">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="var(--pr-line)" strokeWidth="7" />
        <circle cx="40" cy="40" r={R} fill="none" strokeWidth="7" strokeLinecap="round"
          stroke={good ? "var(--pr-green)" : "var(--pr-red)"} strokeDasharray={C} strokeDashoffset={C * (1 - v / 100)}
          style={{ filter: `drop-shadow(0 0 6px ${good ? "rgba(62,207,142,.6)" : "rgba(255,91,91,.6)"})` }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><div className="text-3xl font-semibold leading-none tracking-tight tabular-nums">{v}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-[var(--pr-dim)]">score</div></div>
      </div>
    </div>
  );
}

export function SingleDemo() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const [value, setValue] = useState("priya@growthloop.com");
  const [result, setResult] = useState(null);
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);

  const run = useCallback((email) => {
    clearInterval(timer.current);
    const r = verifyEmail(email);
    setResult(r); setShown(0); setRunning(true);
    if (prefersReduced()) { setShown(r.steps.length); setRunning(false); return; }
    let i = 0;
    timer.current = setInterval(() => {
      i += 1; setShown(i);
      if (i >= r.steps.length) { clearInterval(timer.current); setRunning(false); }
    }, 480);
  }, []);

  useEffect(() => { if (seen && !result) run("priya@growthloop.com"); }, [seen, result, run]);

  const steps = result?.steps ?? STEP_LABELS.map((label) => ({ label, state: "skip", note: "" }));
  const done = !!result && !running && shown >= steps.length;
  const pick = (e) => { setValue(e); run(e); };

  return (
    <div ref={ref}>
      <form onSubmit={(e) => { e.preventDefault(); run(value); }}
        className="flex items-center gap-2 rounded-2xl border border-[var(--pr-line)] bg-[#141414] p-2 pl-4 transition focus-within:border-[var(--pr-orange)]/70 focus-within:shadow-[0_0_0_4px_rgba(242,107,29,.12)]">
        <label htmlFor="demo-email" className="sr-only">Email address to check</label>
        <input id="demo-email" value={value} onChange={(e) => setValue(e.target.value)} spellCheck={false}
          className="pr-mono min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--pr-dim)]" placeholder="name@company.com" />
        <button type="submit" disabled={running} className="pr-btn">Check <Icon name="arrow" className="h-4 w-4" /></button>
      </form>
      <p className="mt-2 text-xs text-[var(--pr-muted)]">
        Try{" "}
        {["info@acmecorp.co", "tom@gmial.com", "sarah.k@northwind.io"].map((e, i) => (
          <span key={e}><button type="button" onClick={() => pick(e)} className="underline decoration-dotted underline-offset-2 hover:text-[var(--pr-text)]">{e}</button>{i < 2 ? ", " : ""}</span>
        ))}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.15fr_1fr]">
        <ol className="relative overflow-hidden rounded-2xl border border-[var(--pr-line)] bg-[#141414] p-4" aria-live="polite">
          {running && <span className="pr-scan" />}
          {steps.map((s, i) => {
            const vis = i < shown;
            return (
              <li key={s.label} className={`flex items-center gap-3 py-2 text-sm transition-opacity duration-300 ${vis ? "opacity-100" : "opacity-30"}`}>
                <span className={`grid h-6 w-6 flex-none place-items-center rounded-full border text-[11px] transition-colors ${
                  !vis ? "border-[var(--pr-line)] text-[var(--pr-dim)]"
                    : s.state === "fail" ? "border-transparent bg-[var(--pr-red)] text-[#1a0d05]"
                    : s.state === "pass" ? "border-transparent bg-[var(--pr-green)] text-[#06140d]" : "border-[var(--pr-line)] text-[var(--pr-dim)]"}`}>
                  {vis && s.state === "pass" ? <span className="pr-pop"><Icon name="check" className="h-3.5 w-3.5" /></span>
                    : vis && s.state === "fail" ? <span className="pr-pop"><Icon name="x" className="h-3.5 w-3.5" /></span> : i + 1}
                </span>
                <span className="font-medium">{s.label}</span>
                <span className="truncate text-xs text-[var(--pr-muted)]">{vis ? s.note : ""}</span>
              </li>
            );
          })}
        </ol>

        <div className={`flex items-center gap-5 rounded-2xl border p-5 transition-all duration-500 ${done ? "border-[var(--pr-orange)]/40 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(242,107,29,.16),transparent_60%),#141414]" : "border-dashed border-[var(--pr-line)] bg-[#141414] opacity-60"}`}>
          {done ? (
            <>
              <Ring value={result.score} good={result.verdict === "send"} run={done} />
              <div className="min-w-0">
                <Pill kind={result.verdict} />
                <p className="mt-3 text-sm leading-snug">{result.reason}</p>
                {result.catchAll && <p className="pr-script mt-1 text-xl text-[var(--pr-orange2)]">a catch-all, answered.</p>}
              </div>
            </>
          ) : <p className="text-sm text-[var(--pr-muted)]">Running {STEP_LABELS.length} checks…</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- 2. Bulk list ---------- */
const ROWS = [
  ["sarah.k@northwind.io", "send", 94, "Valid mailbox"],
  ["m.ross@brightlabs.com", "send", 88, "Valid mailbox"],
  ["info@acmecorp.co", "dont", 31, "Catch-all, role address"],
  ["j.patel@lumenhq.com", "send", 81, "Catch-all resolved"],
  ["tom@gmial.com", "dont", 9, "Likely typo of gmail.com"],
  ["nina@corecloud.ai", "send", 90, "Valid mailbox"],
  ["sales@oldco.biz", "dont", 4, "Mailbox does not exist"],
  ["dev@pixelforge.io", "send", 77, "Catch-all resolved"],
];
const TOTAL = 48210;

export function BulkDemo() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const [done, setDone] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);

  const run = useCallback(() => {
    clearInterval(timer.current);
    if (prefersReduced()) { setDone(ROWS.length); setRunning(false); return; }
    setDone(0); setRunning(true);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1; setDone(i);
      if (i >= ROWS.length) { clearInterval(timer.current); setRunning(false); }
    }, 420);
  }, []);
  useEffect(() => { if (seen) run(); }, [seen, run]);

  const finished = ROWS.slice(0, done);
  const sends = finished.filter((r) => r[1] === "send").length;
  const dont = done - sends;
  const resolved = finished.filter((r) => r[3].includes("resolved")).length;
  const processed = Math.round((done / ROWS.length) * TOTAL);

  return (
    <div ref={ref}>
      <div className="overflow-hidden rounded-2xl border border-[var(--pr-line)] bg-[#141414]">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--pr-line)] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden gap-1.5 sm:flex">{[0, 1, 2].map((i) => <i key={i} className="h-2 w-2 rounded-full bg-[#333]" />)}</span>
            <span className="pr-mono truncate text-xs text-[var(--pr-muted)]">q4_outbound.csv</span>
          </div>
          <span className="pr-mono hidden text-xs tabular-nums text-[var(--pr-muted)] sm:block">{processed.toLocaleString()} / {TOTAL.toLocaleString()}</span>
          <button type="button" onClick={run} disabled={running} className="pr-btn" style={{ padding: "6px 12px", fontSize: 12 }}>{running ? "Verifying…" : "Run again"}</button>
        </div>
        <div className="h-[3px] bg-[var(--pr-line)]"><div className="h-full pr-bg-grad-r transition-all duration-300" style={{ width: `${(done / ROWS.length) * 100}%` }} /></div>
        <ul>
          {ROWS.map(([email, kind, score, why], i) => {
            const ready = i < done;
            return (
              <li key={email} className={`grid grid-cols-[1fr_auto] items-center gap-x-3 border-b border-[#222] px-4 py-2.5 last:border-b-0 sm:grid-cols-[1.4fr_1fr_auto] ${ready && i === done - 1 ? "pr-flash" : ""}`}>
                <span className="pr-mono truncate text-[13px]">{email}</span>
                <span className="hidden truncate text-xs text-[var(--pr-muted)] sm:block">{ready ? `${why} · ${score}` : ""}</span>
                <Pill kind={ready ? (why.includes("resolved") ? "ans" : kind) : i === done && running ? "wait" : "idle"} />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[["Send", sends, "var(--pr-green)"], ["Don't send", dont, "var(--pr-red)"], ["Catch-alls resolved", resolved, "var(--pr-orange2)"]].map(([l, n, c]) => (
          <div key={l} className="rounded-xl border border-[var(--pr-line)] bg-[#141414] px-2 py-3">
            <div className="text-2xl font-semibold tabular-nums tracking-tight" style={{ color: c }}>{n}</div>
            <div className="text-[11px] text-[var(--pr-muted)]">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 3. CRM sync ---------- */
const FIRST = [
  { name: "Ava Morgan", email: "ava@northwind.io", s: "send" },
  { name: "Raj Menon", email: "raj@lumenhq.com", s: "send" },
  { name: "Lee Park", email: "lee@gmial.com", s: "dont" },
];
const INCOMING = [
  ["Maya Iyer", "maya@pixelforge.io", "send"],
  ["Sam Cole", "info@acmecorp.co", "dont"],
  ["Dan Ortiz", "dan@corecloud.ai", "ans"],
];

export function CrmDemo() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const [rows, setRows] = useState(() => FIRST.map((r) => ({ ...r, k: r.email })));
  const n = useRef(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const add = useCallback(() => {
    const [name, email, s] = INCOMING[n.current % INCOMING.length];
    const k = `${email}-${n.current}`;
    n.current += 1;
    setRows((r) => [{ name, email, s: "wait", k }, ...r].slice(0, 5));
    timers.current.push(setTimeout(() => setRows((r) => r.map((x) => (x.k === k ? { ...x, s } : x))), 1300));
  }, []);

  useEffect(() => {
    if (!seen || prefersReduced()) return;
    [500, 3200, 5900].forEach((t) => timers.current.push(setTimeout(add, t)));
  }, [seen, add]);

  return (
    <div ref={ref}>
      <div className="rounded-2xl border border-[var(--pr-line)] bg-[#141414] px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex-none text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[var(--pr-line)] bg-[var(--pr-surface2)] text-xs font-bold">CRM</span>
            <span className="mt-1.5 block text-[10px] uppercase tracking-widest text-[var(--pr-dim)]">your data</span>
          </div>
          <div className="relative h-14 flex-1">
            <span className="absolute inset-x-0 top-3 border-t-2 border-dotted border-[#444]" />
            <span className="absolute inset-x-0 bottom-3 border-t-2 border-dotted border-[#444]" />
            {[0, 0.8, 1.6].map((d) => <i key={`o${d}`} className="pr-packet top-[7px] bg-[var(--pr-orange2)] shadow-[0_0_10px_var(--pr-orange)]" style={{ animationDelay: `${d}s` }} />)}
            {[0.4, 1.2, 2].map((d) => <i key={`g${d}`} className="pr-packet pr-packet-rev bottom-[7px] bg-[var(--pr-green)] shadow-[0_0_10px_var(--pr-green)]" style={{ animationDelay: `${d}s` }} />)}
          </div>
          <div className="flex-none text-center">
            <span className="pr-float grid h-14 w-14 place-items-center rounded-2xl pr-bg-grad text-[#1a0d05] shadow-[0_8px_30px_-8px_rgba(242,107,29,.7)]"><Icon name="check" className="h-6 w-6" /></span>
            <span className="mt-1.5 block text-[10px] uppercase tracking-widest text-[var(--pr-dim)]">verified</span>
          </div>
        </div>
        <p className="pr-mono mt-3 text-center text-xs text-[var(--pr-muted)]">new contacts out · verdicts back</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Contacts</h4>
        <button type="button" onClick={add} className="pr-btn-ghost"><Icon name="plus" className="h-3.5 w-3.5" /> Simulate new signup</button>
      </div>
      <ul className="mt-3 divide-y divide-[#222] overflow-hidden rounded-2xl border border-[var(--pr-line)] bg-[#141414]">
        {rows.map((r) => (
          <li key={r.k} className="pr-slide flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{r.name}</div>
              <div className="pr-mono truncate text-xs text-[var(--pr-muted)]">{r.email}</div>
            </div>
            <Pill kind={r.s} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 4. Real-time API: types the request, then streams the response ---------- */
const SNIPPETS = {
  curl: `curl https://api.example.com/v1/verify \\
  -H "Authorization: Bearer $API_KEY" \\
  -d email=tom@shiftly.co`,
  js: `const res = await fetch("https://api.example.com/v1/verify", {
  method: "POST",
  headers: { Authorization: \`Bearer \${API_KEY}\` },
  body: JSON.stringify({ email: "tom@shiftly.co" }),
});
const verdict = await res.json();`,
};

const RES_LINES = [
  [["{", ""]],
  [["  ", ""], ['"email"', "k"], [": ", ""], ['"tom@shiftly.co"', "s"], [",", ""]],
  [["  ", ""], ['"verdict"', "k"], [": ", ""], ['"send"', "g"], [",", ""]],
  [["  ", ""], ['"score"', "k"], [": ", ""], ["94", "o"], [",", ""]],
  [["  ", ""], ['"catch_all"', "k"], [": ", ""], ["true", "o"], [",", ""]],
  [["  ", ""], ['"reason"', "k"], [": ", ""], ['"Catch-all domain resolved as deliverable"', "s"]],
  [["}", ""]],
];
const TOK = { k: "text-[var(--pr-orange2)]", s: "text-[#cfcfcc]", g: "text-[var(--pr-green)]", o: "text-[var(--pr-amber)]", "": "" };

export function ApiDemo() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const [lang, setLang] = useState("curl");
  const [typed, setTyped] = useState(0);
  const [stage, setStage] = useState("idle"); // idle | typing | wait | done
  const [replay, setReplay] = useState(0);
  const [copied, setCopied] = useState(false);
  const text = SNIPPETS[lang];

  useEffect(() => {
    if (!seen) return;
    if (prefersReduced()) { setTyped(text.length); setStage("done"); return; }
    setTyped(0); setStage("typing");
    let i = 0, t2;
    const id = setInterval(() => {
      i += 3;
      if (i >= text.length) { clearInterval(id); setTyped(text.length); setStage("wait"); t2 = setTimeout(() => setStage("done"), 650); }
      else setTyped(i);
    }, 16);
    return () => { clearInterval(id); clearTimeout(t2); };
  }, [seen, lang, replay, text]);

  const ms = useCountUp(412, { start: stage === "done", duration: 800 });
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { /* clipboard blocked */ }
  };

  return (
    <div ref={ref}>
      <div className="overflow-hidden rounded-2xl border border-[var(--pr-line)] bg-[#0c0c0c]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <div role="tablist" aria-label="Language" className="flex gap-1">
            {["curl", "js"].map((l) => (
              <button key={l} role="tab" aria-selected={lang === l} onClick={() => setLang(l)}
                className={`pr-mono rounded-md px-2.5 py-1 text-xs transition ${lang === l ? "bg-[var(--pr-orange)]/20 text-[var(--pr-orange2)]" : "text-white/50 hover:text-white"}`}>
                {l === "js" ? "JavaScript" : "cURL"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setReplay((r) => r + 1)} className="text-xs text-white/60 hover:text-white">Replay</button>
            <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white">
              <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <pre className="pr-mono min-h-[9.5rem] overflow-x-auto p-4 text-[12.5px] leading-6 text-[#e6e6e3]"><code>{text.slice(0, typed)}{stage === "typing" && <span className="pr-caret" />}</code></pre>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--pr-line)] bg-[#141414]">
        <div className="pr-mono flex items-center justify-between border-b border-[#222] px-4 py-2 text-xs text-[var(--pr-muted)]">
          <span className="flex items-center gap-2">
            <i className={`h-2 w-2 rounded-full ${stage === "done" ? "bg-[var(--pr-green)]" : "pr-dot bg-[var(--pr-amber)]"}`} />
            {stage === "done" ? "200 OK" : stage === "idle" ? "ready" : "waiting…"}
          </span>
          <span className="tabular-nums">{stage === "done" ? `${ms} ms` : "—"}</span>
        </div>
        <pre className="pr-mono min-h-[10.5rem] overflow-x-auto p-4 text-[12.5px] leading-6"><code>
          {stage === "done"
            ? RES_LINES.map((line, i) => (
                <span key={i} className="pr-rise block" style={{ animationDelay: `${i * 90}ms` }}>
                  {line.map(([t, c], j) => <span key={j} className={TOK[c]}>{t}</span>)}
                </span>
              ))
            : <span className="text-[var(--pr-dim)]">// response appears here</span>}
        </code></pre>
      </div>
      <p className="mt-2 text-xs text-[var(--pr-dim)]">Sample endpoint and response, shown for illustration.</p>
    </div>
  );
}
