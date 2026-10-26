import "./end.css";
import { useRef } from "react";
import { Eyebrow, Icon, Reveal, Words, prefersReduced } from "./shared";

const OTHERS = [
  { name: "ZeroBounce", href: "/alternatives/zerobounce", letter: "Z" },
  { name: "Scrubby", href: "/alternatives/scrubby", letter: "S" },
  { name: "MillionVerifier", href: "/alternatives/millionverifier", letter: "M" },
];

function TiltCard({ o, i }) {
  const el = useRef(null);
  const move = (e) => {
    const r = el.current.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.current.style.setProperty("--mx", `${x}px`);
    el.current.style.setProperty("--my", `${y}px`);
    if (prefersReduced()) return;
    const rx = ((y / r.height) - 0.5) * -8, ry = ((x / r.width) - 0.5) * 8;
    el.current.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
  };
  const leave = () => { el.current.style.transform = ""; };
  return (
    <Reveal delay={i * 110}>
      <a ref={el} href={o.href} onMouseMove={move} onMouseLeave={leave}
        className="ne-spot ne-beam group flex items-center gap-4 rounded-2xl border border-[var(--ne-line)] bg-[var(--ne-surface)] p-6 transition-[transform,border-color,background] duration-200 hover:bg-[linear-gradient(160deg,rgba(242,107,29,.10),transparent_60%),var(--ne-surface)]">
        <i className="beam" aria-hidden="true" /><i className="sheen" aria-hidden="true" />
        <span className="ne-script relative grid h-14 w-14 flex-none place-items-center rounded-2xl border border-[var(--ne-line)] bg-[var(--ne-bg)] text-3xl text-[var(--ne-orange2)] transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:border-transparent group-hover:bg-[var(--ne-orange)] group-hover:text-[#1a0d05]">{o.letter}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-semibold">{o.name} alternative</span>
          <span className="block text-sm text-[var(--ne-muted)] transition-colors group-hover:text-[var(--ne-orange2)]">See the comparison</span>
        </span>
        <span className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-full border border-[var(--ne-line)] text-[var(--ne-orange2)] transition-all duration-300 group-hover:border-transparent group-hover:bg-[var(--ne-orange)] group-hover:text-[#1a0d05]">
          <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px]" />
        </span>
      </a>
    </Reveal>
  );
}

export default function CompareOthers() {
  return (
    <section id="more-comparisons" className="ne-root relative overflow-hidden border-b border-dashed border-[var(--ne-line)] bg-[var(--ne-bg)] px-5 py-20 sm:px-12 lg:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="ne-blob-b absolute -right-24 -top-20 h-[360px] w-[360px] rounded-full bg-[var(--ne-orange)]/15 blur-[110px]" />
      </div>
      <div className="relative">
        <Reveal><Eyebrow>More comparisons</Eyebrow></Reveal>
        <h2 className="pt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
          <Words text="Compare other" /><span className="ne-script text-[1.1em]"><Words text="verifiers" wordClass="ne-shimmer" /></span>
        </h2>
        <div className="grid gap-4 pt-10 md:grid-cols-3">
          {OTHERS.map((o, i) => <TiltCard key={o.name} o={o} i={i} />)}
        </div>
      </div>
    </section>
  );
}
