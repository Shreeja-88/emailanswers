import "./product.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PROTECT, VERIFY } from "../../data/products";
import Icon from "./Icon";
import Pill from "./Pill";
import { goToProduct } from "./navigate";

function Item({ p, i, onPick }) {
  return (
    <li className="pr-rise" style={{ animationDelay: `${i * 45}ms` }}>
      <a href={`#${p.id}`} onClick={(e) => { e.preventDefault(); onPick(p.id); }}
        className="group flex items-start gap-3.5 rounded-xl p-2.5 outline-none transition hover:bg-[var(--pr-surface2)] focus-visible:bg-[var(--pr-surface2)] focus-visible:ring-2 focus-visible:ring-[var(--pr-orange)]">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-[var(--pr-line)] bg-[var(--pr-bg)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-transparent group-hover:[background:linear-gradient(180deg,var(--pr-orange2),var(--pr-orange))] group-hover:text-[#1a0d05]"><Icon name={p.icon} /></span>
        <span>
          <span className="block text-[15px] font-semibold">{p.title}</span>
          <span className="block text-[13px] leading-snug text-[var(--pr-muted)]">{p.blurb}</span>
        </span>
      </a>
    </li>
  );
}

/** Drop this inside the Navbar where the "Product" link used to be. */
export default function ProductMenu({ label = "Product" }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const closeTimer = useRef(null);
  const [pos, setPos] = useState({ left: 0, width: 960 });

  const show = () => { clearTimeout(closeTimer.current); setOpen(true); };
  const hideSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(false), 140); };
  const pick = (id) => { setOpen(false); goToProduct(id); };

  // keep the panel inside the screen wherever the link sits in the navbar
  useLayoutEffect(() => {
    if (!open || !wrap.current) return;
    const place = () => {
      const r = wrap.current.getBoundingClientRect();
      const width = Math.min(960, window.innerWidth - 32);
      const ideal = r.left + r.width / 2 - width / 2;
      const left = Math.max(16, Math.min(ideal, window.innerWidth - 16 - width));
      setPos({ left: left - r.left, width });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => !wrap.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <div ref={wrap} className="pr-root relative" onMouseEnter={show} onMouseLeave={hideSoon}>
      <button type="button" aria-expanded={open} aria-haspopup="true" aria-controls="product-menu" onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-md px-1 py-1.5 text-sm text-[var(--pr-muted)] outline-none transition hover:text-[var(--pr-text)] focus-visible:ring-2 focus-visible:ring-[var(--pr-orange)]">
        {label}
        <Icon name="chev" className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div id="product-menu"
          className="pr-pop fixed inset-x-4 top-16 z-50 max-h-[80vh] overflow-y-auto rounded-3xl border border-[var(--pr-line)] bg-[var(--pr-surface)] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] md:absolute md:inset-x-auto md:top-full md:mt-3 md:overflow-visible"
          style={window.innerWidth >= 768 ? { left: pos.left, width: pos.width, transformOrigin: "top center" } : undefined}>
          <div className="grid gap-6 md:grid-cols-[1fr_1fr_270px]">
            <div>
              <p className="pr-mono mb-2 px-2.5 text-[11px] uppercase tracking-[0.16em] text-[var(--pr-dim)]">Verify</p>
              <ul>{VERIFY.map((p, i) => <Item key={p.id} p={p} i={i} onPick={pick} />)}</ul>
            </div>
            <div>
              <p className="pr-mono mb-2 px-2.5 text-[11px] uppercase tracking-[0.16em] text-[var(--pr-dim)]">Protect</p>
              <ul>{PROTECT.map((p, i) => <Item key={p.id} p={p} i={i + 2} onPick={pick} />)}</ul>
            </div>
            <div className="relative flex flex-col overflow-hidden rounded-2xl bg-[linear-gradient(160deg,var(--pr-orange2),var(--pr-orange)_55%,var(--pr-deep))] p-5 text-[#1a0d05]">
              <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
              <p className="relative text-2xl font-semibold leading-tight tracking-tight">Same list. <span className="pr-script text-[1.15em]">Different answer.</span></p>
              <p className="relative mt-3 text-sm opacity-85">Where other verifiers stop at accept-all, you get a verdict.</p>
              <div className="relative mt-4 flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="rounded-full bg-black/15 px-2.5 py-1 line-through opacity-80">Accept-all · unknown</span>
                <span className="rounded-full bg-[#1a0d05] px-2.5 py-1 text-[var(--pr-orange2)]">✓ Send · score 94</span>
              </div>
              <a href="#product" onClick={(e) => { e.preventDefault(); pick("single"); }}
                className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold hover:underline">
                Try a free check <Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
