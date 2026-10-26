import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TLDR.css";
import EmailVerificationVisual from "./EmailVerificationVisual";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { id: "tldr", number: "01", label: "The short answer" },
  { id: "problem", number: "02", label: "Where NeverBounce falls short" },
  { id: "compare", number: "03", label: "Feature comparison" },
  { id: "fair", number: "04", label: "Which fits your team?" },
  { id: "switch", number: "05", label: "Switch in minutes" },
  { id: "faq", number: "06", label: "FAQs" },
];

const INSIGHTS = [
  {
    number: "01",
    label: "THE FOUNDATION",
    title: "Know what is valid.",
    description:
      "Start by identifying invalid addresses before they reach your campaigns and sales workflows.",
    icon: "✳",
    tone: "orange",
    tag: "VALIDATION",
  },
  {
    number: "02",
    label: "THE GREY AREA",
    title: "Understand what is uncertain.",
    description:
      "Catch-all results need more context. A result alone does not always tell you whether to send.",
    icon: "◎",
    tone: "amber",
    tag: "INTELLIGENCE",
  },
  {
    number: "03",
    label: "THE REAL GOAL",
    title: "Choose your next move.",
    description:
      "Compare verification results, integrations, workflow fit, and cost against your real requirements.",
    icon: "↗",
    tone: "green",
    tag: "DECISION",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="tldr-eyebrow">
      <span className="tldr-eyebrow-dot" />
      {children}
    </span>
  );
}

function InsightCard({ item, index, active, onActivate }) {
  return (
    <article
      className={`tldr-insight-card tldr-tone-${item.tone} ${
        active ? "is-selected" : ""
      }`}
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      tabIndex={0}
    >
      <div className="tldr-insight-top">
        <span className="tldr-insight-number">{item.number}</span>
        <span className="tldr-insight-icon" aria-hidden="true">
          {item.icon}
        </span>
      </div>

      <span className="tldr-insight-label">{item.label}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>

      <div className="tldr-insight-bottom">
        <span>{item.tag}</span>
        <span className="tldr-insight-arrow">
          <ArrowIcon />
        </span>
      </div>

      <span className="tldr-insight-progress" />
    </article>
  );
}

function WorkflowGraphic() {
  return (
    <div className="tldr-workflow-graphic" aria-hidden="true">
      <div className="tldr-workflow-orbit orbit-a" />
      <div className="tldr-workflow-orbit orbit-b" />
      <div className="tldr-workflow-orbit orbit-c" />

      <div className="tldr-workflow-core">
        <span>@</span>
        <small>EMAIL</small>
      </div>

      <div className="tldr-workflow-node node-verify">
        <span>01</span>
        <b>Verify</b>
      </div>
      <div className="tldr-workflow-node node-understand">
        <span>02</span>
        <b>Understand</b>
      </div>
      <div className="tldr-workflow-node node-decide">
        <span>03</span>
        <b>Decide</b>
      </div>

      <div className="tldr-workflow-caption">FROM DATA TO DECISION</div>
    </div>
  );
}

export default function TLDR() {
  const rootRef = useRef(null);
  const [activeId, setActiveId] = useState("tldr");
  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const titleLines = root.querySelectorAll(".tldr-title-line-inner");
      const introItems = root.querySelectorAll(".tldr-intro-reveal");
      const visual = root.querySelector(".tldr-visual-shell");

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .fromTo(
          titleLines,
          { yPercent: 115, rotateX: -8, opacity: 0 },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
          }
        )
        .fromTo(
          introItems,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
          "-=0.45"
        )
        .fromTo(
          visual,
          { y: 45, scale: 0.97, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.95 },
          "-=0.3"
        );

      gsap.to(root.querySelector(".tldr-ambient-orb"), {
        y: -40,
        x: 15,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      root.querySelectorAll("[data-tldr-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        root.querySelectorAll(".tldr-insight-card"),
        { y: 42, opacity: 0, rotateX: 3 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.75,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".tldr-insights"),
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        root.querySelectorAll(".tldr-insight-progress"),
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 0.95,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".tldr-insights"),
            start: "top 80%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        root.querySelector(".tldr-bottom-line"),
        { y: 35, opacity: 0, scale: 0.99 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".tldr-bottom-line"),
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        root.querySelectorAll(".tldr-workflow-node"),
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: root.querySelector(".tldr-workflow-graphic"),
            start: "top 85%",
            once: true,
          },
        }
      );
    }, root);

    const visualShell = root.querySelector(".tldr-visual-shell");
    const visualInner = root.querySelector(".tldr-visual-inner");

    const moveVisual = (event) => {
      if (
        !visualShell ||
        !visualInner ||
        window.matchMedia("(pointer: coarse)").matches
      ) {
        return;
      }

      const rect = visualShell.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(visualInner, {
        rotateY: px * 2.5,
        rotateX: py * -2.5,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const resetVisual = () => {
      if (!visualInner) return;
      gsap.to(visualInner, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
      });
    };

    visualShell?.addEventListener("pointermove", moveVisual);
    visualShell?.addEventListener("pointerleave", resetVisual);

    return () => {
      visualShell?.removeEventListener("pointermove", moveVisual);
      visualShell?.removeEventListener("pointerleave", resetVisual);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const targets = NAV_ITEMS
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  function navigate(event, id) {
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    setActiveId(id);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${id}`);
  }

  function handleButtonMove(event) {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    gsap.to(button, {
      x: (event.clientX - rect.left - rect.width / 2) * 0.07,
      y: (event.clientY - rect.top - rect.height / 2) * 0.1,
      duration: 0.25,
      ease: "power2.out",
      overwrite: true,
    });
  }

  function handleButtonLeave(event) {
    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "elastic.out(1, 0.45)",
      overwrite: true,
    });
  }

  return (
    <section
      id="tldr"
      ref={rootRef}
      className="nb-section tldr-section"
      aria-labelledby="tldr-title"
    >
      <div className="tldr-background-grid" aria-hidden="true" />
      <div className="tldr-ambient-orb" aria-hidden="true" />
      <div className="tldr-ambient-line" aria-hidden="true" />

      <div className="tldr-layout">
        <aside className="tldr-sidebar">
          <div className="tldr-sidebar-heading">
            <Eyebrow>THE FIELD GUIDE</Eyebrow>
            <h2>
              Less guesswork.
              <br />
              <em>Better decisions.</em>
            </h2>
            <p>
              A practical guide to choosing an email verification workflow
              that fits your team.
            </p>
          </div>

          <nav className="tldr-nav" aria-label="Comparison page navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => navigate(event, item.id)}
                className={`tldr-nav-link ${
                  activeId === item.id ? "is-active" : ""
                }`}
                aria-current={
                  activeId === item.id ? "location" : undefined
                }
              >
                <span className="tldr-nav-number">{item.number}</span>
                <span className="tldr-nav-label">{item.label}</span>
                <span className="tldr-nav-arrow"><ArrowIcon /></span>
              </a>
            ))}
          </nav>

          <a
            href="#compare"
            className="tldr-sidebar-cta"
            onClick={(event) => navigate(event, "compare")}
          >
            <span className="tldr-sidebar-cta-icon"><CheckIcon /></span>
            <span>
              <small>YOUR NEXT STEP</small>
              <strong>Compare the features</strong>
            </span>
            <ArrowIcon />
          </a>
        </aside>

        <div className="tldr-main">
          <header className="tldr-hero-copy">
            <div className="tldr-hero-meta tldr-intro-reveal">
              <Eyebrow>01 / THE SHORT ANSWER</Eyebrow>
              <span className="tldr-read-time">2 MIN READ</span>
            </div>

            <h2 id="tldr-title" className="tldr-display-title">
              <span className="tldr-title-line">
                <span className="tldr-title-line-inner">
                  It's not just about{" "}
                  <span className="tldr-gradient-text">valid emails.</span>
                </span>
              </span>

              <span className="tldr-title-line">
                <span className="tldr-title-line-inner">
                  It's about what{" "}
                  <span className="tldr-gradient-text">comes next.</span>
                </span>
              </span>
            </h2>


            <div className="tldr-hero-bottom tldr-intro-reveal">
              <p className="tldr-hero-description">
                Email verification is only the beginning. When your B2B list
                contains uncertain addresses, what matters is how clearly a
                platform helps you interpret results and choose your next step.
              </p>
              <div className="tldr-hero-index">
                <span>THE BIGGER PICTURE</span>
                <strong>01 <i /> 03</strong>
              </div>
            </div>
          </header>

          <div className="tldr-visual-shell">
            <div className="tldr-visual-inner">
              <div className="tldr-visual-caption">
                <span><i className="tldr-live-dot" /> EMAIL INTELLIGENCE</span>
                <span>VERIFICATION OVERVIEW <b>↗</b></span>
              </div>
              <EmailVerificationVisual />
              <div className="tldr-visual-bottom-label">
                <span>01 — VALIDATE</span>
                <span>02 — UNDERSTAND</span>
                <span>03 — DECIDE</span>
              </div>
            </div>
          </div>

          <section
            className="tldr-insights-section"
            aria-labelledby="tldr-insights-title"
          >
            <div className="tldr-section-heading" data-tldr-reveal>
              <div>
                <Eyebrow>THE THREE THINGS THAT MATTER</Eyebrow>
                <h2 id="tldr-insights-title">
                  Here's the <span className="tldr-gradient-text">bigger picture.</span>
                </h2>
              </div>
              <p>Better decisions start with better questions.</p>
            </div>

            <div className="tldr-insights">
              {INSIGHTS.map((item, index) => (
                <InsightCard
                  key={item.number}
                  item={item}
                  index={index}
                  active={activeInsight === index}
                  onActivate={setActiveInsight}
                />
              ))}
            </div>
          </section>

          <section className="tldr-bottom-line">
            <div className="tldr-bottom-copy">
              <Eyebrow>THE BOTTOM LINE</Eyebrow>
              <h2>
                Don't just compare features.
                <br />
                <span className="tldr-gradient-text">
                  Compare the decisions they enable.
                </span>
              </h2>
              <p>
                Evaluate catch-all handling, integrations, pricing, and the
                outcomes your team cares about. Test the tools against
                representative data before deciding which fits your workflow.
              </p>
              <a
                className="tldr-primary-button"
                href="#compare"
                onClick={(event) => navigate(event, "compare")}
                onPointerMove={handleButtonMove}
                onPointerLeave={handleButtonLeave}
              >
                Explore the comparison
                <span><ArrowIcon /></span>
              </a>
            </div>
            <WorkflowGraphic />
          </section>

          <div className="tldr-footer-note" data-tldr-reveal>
            <span className="tldr-footer-rule" />
            <p>THE RIGHT TOOL IS THE ONE THAT FITS YOUR REAL WORKFLOW.</p>
            <span className="tldr-footer-rule" />
          </div>
        </div>
      </div>
    </section>
  );
}
