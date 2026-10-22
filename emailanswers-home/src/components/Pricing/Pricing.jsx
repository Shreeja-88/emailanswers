import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import anime from "animejs/lib/anime.es.js";
import "./Pricing.css";

gsap.registerPlugin(ScrollTrigger);

const validityPlans = [
  { credits: "5,000 credits", price: 16, perEmail: "$0.00320 / credit", popular: false },
  { credits: "10,000 credits", price: 25, perEmail: "$0.00250 / credit", popular: false },
  { credits: "25,000 credits", price: 49, perEmail: "$0.00196 / credit", popular: false },
  { credits: "50,000 credits", price: 89, perEmail: "$0.00178 / credit", popular: true },
  { credits: "100,000 credits", price: 168, perEmail: "$0.00168 / credit", popular: false },
];

const sliderSteps = [
  { label: "1k", value: 1000, price: 5 },
  { label: "5k", value: 5000, price: 17 },
  { label: "10k", value: 10000, price: 27 },
  { label: "25k", value: 25000, price: 54 },
  { label: "50k", value: 50000, price: 98 },
  { label: "100k", value: 100000, price: 186 },
  { label: "250k", value: 250000, price: 384 },
  { label: "500k", value: 500000, price: 494 },
  { label: "1M", value: 1000000, price: 659 },
];

const comparisonRows = [
  { volume: "1,000 emails", emailanswers: "$5", neverbounce: "$8", diff: "Save $3" },
  { volume: "10,000 emails", emailanswers: "$27", neverbounce: "$50", diff: "Save $23" },
  { volume: "100,000 emails", emailanswers: "$186", neverbounce: "$400", diff: "Save $214" },
  { volume: "Credit expiry", emailanswers: "Never", neverbounce: "12 months after purchase", diff: "Keep every credit" },
  { volume: "Catch-all results", emailanswers: "Send or don't send", neverbounce: "Accept all (Unverifiable)", diff: "An answer" },
  { volume: "Monthly plan for 10,000", emailanswers: "$25 a month", neverbounce: "Growth plan, $49 a month", diff: "Save $24 a month" },
];

const perksData = [
  {
    tag: "0% EXPIRE",
    heading: "Credits that never expire",
    desc: "Pay-as-you-go credits stay securely in your account until deployment. NeverBounce credits burn out after 12 months.",
    iconPath: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
  {
    tag: "$0 UNKNOWNS",
    heading: "Unknowns are always on us",
    desc: "If a target mail server times out or greylists, our neural engine re-checks later automatically without depleting your balance.",
    iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    tag: "UNLIMITED FREE",
    heading: "Single verifications stay free",
    desc: "Inspect individual high-value prospect endpoints anytime, anywhere, with instantaneous diagnostic debugging.",
    iconPath: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3",
  },
];

function Pricing() {
  const sectionRef = useRef(null);
  const priceRef = useRef(null);
  const [billingMode, setBillingMode] = useState("validity");
  const [sliderIndex, setSliderIndex] = useState(0); // PAYG starts at 1,000 verifications

  const currentStep = sliderSteps[sliderIndex];
  const calculatedPrice = currentStep.price;
  const benchmark = {
    1000: { price: 8, savings: 3 },
    10000: { price: 50, savings: 23 },
    100000: { price: 400, savings: 214 },
  }[currentStep.value];
  const neverbouncePrice = benchmark?.price ?? null;
  const savings = benchmark?.savings ?? null;
  const pricePerThousand = calculatedPrice / (currentStep.value / 1000);
  const pricePerEmail = calculatedPrice / currentStep.value;

  // Inject SaaS JSON-LD Schema for SEO
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EmailAnswers.ai Pricing",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "5",
        highPrice: "1200",
        offerCount: "14",
      },
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Premium motion system: restrained reveals, dashboard telemetry and ambient particles.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
        hero
          .from(".pricing-pill-badge", { y: 12, autoAlpha: 0, duration: 0.5 })
          .from(".hero-banner-title", { y: 24, autoAlpha: 0, duration: 0.75 }, "-=0.22")
          .from(".hero-banner-desc", { y: 14, autoAlpha: 0, duration: 0.55 }, "-=0.35")
          .from(".hero-banner-btn", { y: 10, autoAlpha: 0, duration: 0.5 }, "-=0.25")
          .from(".hero-banner-trust span", { y: 8, autoAlpha: 0, stagger: 0.07, duration: 0.35 }, "-=0.22");

        gsap.from(".hero-banner-visuals", {
          x: 26, autoAlpha: 0, scale: 0.975, duration: 0.95,
          ease: "power3.out", delay: 0.2,
        });

        gsap.from(".node-svg-graphic circle, .node-svg-graphic path", {
          scale: 0.92,
          transformOrigin: "50% 50%",
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          delay: 0.55,
          clearProps: "opacity,transform",
        });

        gsap.from(".pricing-switcher-container", {
          y: 18, autoAlpha: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".pricing-switcher-wrapper", start: "top 82%", once: true },
        });

        gsap.from(".validity-card, .payg-layout-grid", {
          y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pricing-content-box", start: "top 82%", once: true },
        });

        gsap.from(".comp-table-row", {
          y: 14, autoAlpha: 0, duration: 0.45, stagger: 0.055, ease: "power2.out",
          scrollTrigger: { trigger: ".comparison-table-wrapper", start: "top 82%", once: true },
        });

        gsap.from(".pricing-bento-card", {
          y: 20, autoAlpha: 0, duration: 0.65, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".pricing-bento-grid", start: "top 84%", once: true },
        });

        gsap.to(".pricing-glow-orb", {
          x: (index) => index === 0 ? 18 : -16,
          y: (index) => index === 0 ? -14 : 18,
          scale: 1.06,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".floating-preview-badge", {
          y: -6, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut",
        });
        gsap.to(".pricing-radar-wave", {
          scale: 1.16, opacity: 0.25, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut",
        });
        gsap.to(".ember-wave-a, .ember-wave-c", {
          x: 18, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut",
          stagger: { each: 0.35, from: "random" },
        });
        gsap.to(".ember-wave-b, .ember-wave-d", {
          x: -14, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut",
          stagger: { each: 0.4, from: "random" },
        });
        gsap.to(".node-pulse-core", {
          scale: 1.15, opacity: 0.75, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut",
        });
      });

      const particles = section.querySelectorAll(".pricing-particle");
      const particleAnimation = anime({
        targets: particles,
        translateY: () => anime.random(-10, 10),
        translateX: () => anime.random(-7, 7),
        opacity: [0.18, 0.75],
        delay: anime.stagger(90),
        duration: 2400,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine",
      });

      return () => {
        mm.revert();
        particleAnimation.pause();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  // Smoothly transition the pricing panel when switching between plan types.
  const previousBillingMode = useRef(billingMode);
  useEffect(() => {
    if (previousBillingMode.current === billingMode) return;
    previousBillingMode.current = billingMode;

    const panel = sectionRef.current?.querySelector(".pricing-content-box > *");
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      panel,
      { autoAlpha: 0, y: 14, filter: "blur(4px)" },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.48,
        ease: "power3.out",
        clearProps: "filter",
      }
    );
  }, [billingMode]);

  // GSAP Odometer rolling effect when price changes
  useEffect(() => {
    if (priceRef.current) {
      gsap.fromTo(
        priceRef.current,
        { y: 15, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [calculatedPrice]);

  // Spotlight Mouse Glow
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCalculatorMouseMove = (e) => {
    handleMouseMove(e);
  };

  const handleCalculatorMouseLeave = () => {
    const card = sectionRef.current?.querySelector(".payg-layout-grid");
    if (card) {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  return (
    <section className="pricing-section-wrapper" id="pricing" ref={sectionRef}>
      {/* Hidden SEO Microdata */}
      <div className="sr-only" itemScope itemType="https://schema.org/SoftwareApplication">
        <meta itemProp="name" content="EmailAnswers.ai" />
        <meta itemProp="applicationCategory" content="Email Verification SaaS" />
        <meta itemProp="description" content="High-accuracy catch-all email verification with zero expiry credits." />
      </div>

      {/* Background Cyber Atmosphere */}
      <div className="pricing-bg-atmosphere" aria-hidden="true">
        <div className="pricing-cyber-grid" />
        <div className="pricing-radar-wave" />
        <div className="pricing-ember-waves">
          <svg viewBox="0 0 1600 520" preserveAspectRatio="none" role="presentation">
            <path className="ember-wave ember-wave-a" d="M-100 170 C140 20 330 340 570 175 S970 20 1200 175 S1490 310 1700 120" />
            <path className="ember-wave ember-wave-b" d="M-100 215 C160 75 350 370 600 220 S970 65 1230 215 S1490 355 1700 165" />
            <path className="ember-wave ember-wave-c" d="M-100 260 C150 130 360 410 630 260 S1000 110 1250 260 S1500 390 1700 210" />
            <path className="ember-wave ember-wave-d" d="M-100 125 C140 -20 360 280 620 125 S1000 -10 1260 125 S1500 260 1700 75" />
            <path className="ember-wave ember-wave-e" d="M-100 390 C150 240 360 530 640 390 S1010 240 1260 390 S1510 520 1700 340" />
            <path className="ember-wave ember-wave-f" d="M-100 455 C150 315 370 600 650 455 S1020 305 1270 455 S1510 585 1700 405" />
            <path className="ember-wave ember-wave-g" d="M-100 545 C160 400 380 700 660 545 S1030 390 1280 545 S1530 675 1700 495" />
            <path className="ember-wave ember-wave-h" d="M-100 625 C160 485 390 775 680 625 S1040 475 1300 625 S1530 755 1700 575" />
            <path className="ember-wave ember-wave-i" d="M-100 710 C170 565 400 860 700 710 S1060 560 1320 710 S1540 835 1700 660" />
            <path className="ember-wave ember-wave-j" d="M-100 790 C170 645 410 940 720 790 S1080 640 1340 790 S1550 920 1700 740" />
            <path className="ember-wave ember-wave-k" d="M-100 875 C180 730 420 1010 740 875 S1100 725 1360 875 S1560 995 1700 820" />
            <path className="ember-wave ember-wave-teal" d="M-100 350 C180 200 390 500 660 350 S1030 190 1280 350 S1520 475 1700 300" />
          </svg>
        </div>
        <div className="pricing-glow-orb orb-1" />
        <div className="pricing-glow-orb orb-2" />
        {Array.from({ length: 18 }, (_, index) => (
          <span
            className="pricing-particle"
            key={index}
            style={{ left: `${(index * 37 + 9) % 100}%`, top: `${(index * 53 + 7) % 100}%` }}
          />
        ))}
      </div>
      

      <div className="pricing-main-container">
        {/* --- TOP HERO BANNER --- */}
        <div className="pricing-hero-banner" onMouseMove={handleMouseMove}>
          <div className="spotlight-glow" />
          <div className="hero-banner-content">
            <div className="pricing-pill-badge">
              <span className="dot" /> TRANSPARENT PRICING
            </div>
            <h2 className="hero-banner-title">
              Stop paying for <span>“unknown.”</span>
            </h2>
            <p className="hero-banner-desc">
              Upload a test list and observe how many risky catch-all addresses our AI engine recovers into verified leads.
            </p>
            <div className="hero-cta-group">
              <a href="https://app.emailanswers.ai/signup" className="hero-banner-btn">
                Verify 100 Emails Free ↗
              </a>
            </div>
            <div className="hero-banner-trust">
              <span>◆ Zero credit card required</span>
              <span>◆ Strict GDPR compliance</span>
              <span>◆ Pay strictly for verified results</span>
            </div>
          </div>

          <div className="hero-banner-visuals">
            <div className="email-health-dashboard" aria-label="Email verification dashboard preview">
              <div className="email-dashboard-topbar">
                <span className="dashboard-live-dot" />
                <span>EMAIL HEALTH OVERVIEW</span>
                <span className="dashboard-window-dots"><i /><i /><i /></span>
              </div>
              <div className="dashboard-score-row">
                <div className="dashboard-score-ring"><span>99.4<small>%</small></span></div>
                <div className="dashboard-score-copy">
                  <strong>Deliverability score</strong>
                  <span>Excellent sender health</span>
                </div>
                <span className="dashboard-status-pill">Healthy</span>
              </div>
              <div className="dashboard-mini-stats">
                <div className="dashboard-stat"><span>Verified</span><strong>8,492</strong><div className="stat-meter"><i style={{ width: "84%" }} /></div></div>
                <div className="dashboard-stat"><span>Catch-all resolved</span><strong>1,284</strong><div className="stat-meter stat-meter-green"><i style={{ width: "66%" }} /></div></div>
              </div>
              <div className="dashboard-bottom-row">
                <span className="dashboard-check-icon">✓</span>
                <span><strong>Unknowns re-checked</strong><small>AI verification engine active</small></span>
                <span className="dashboard-live-label">LIVE</span>
              </div>
              <div className="dashboard-pipeline" aria-label="Verification pipeline: syntax, domain, mailbox">
                <span className="pipeline-label">VERIFICATION FLOW</span>
                <div className="pipeline-track">
                  <span className="pipeline-step"><i>01</i><b>Syntax</b></span>
                  <span className="pipeline-connector" />
                  <span className="pipeline-step"><i>02</i><b>Domain</b></span>
                  <span className="pipeline-connector" />
                  <span className="pipeline-step"><i>03</i><b>Mailbox</b></span>
                </div>
              </div>
            </div>
            <div className="cyber-3d-node-card">
              <div className="node-grid-lines" />
              <div className="node-pulse-core" />
              <svg className="node-svg-graphic" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="70" stroke="rgba(255,107,53,0.3)" strokeWidth="1.5" strokeDasharray="6 6" />
                <circle cx="100" cy="100" r="45" stroke="#ff6b35" strokeWidth="2" />
                <path d="M70 100L90 120L130 80" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="visual-glow-overlay" />
            </div>
            <div className="floating-preview-badge badge-top">
              <span className="badge-icon">⚡</span>
              <div>
                <strong>Neural Catch-All Resolver</strong>
                <span className="badge-sub">99.4% Verified Accuracy</span>
              </div>
            </div>
            <div className="floating-credit-badge">
              <span className="credit-badge-check">✓</span>
              <span><strong>250 free credits</strong><small>No card required</small></span>
            </div>
          </div>
        </div>

        {/* --- PLAN SWITCHER --- */}
        <div className="pricing-switcher-wrapper">
          <div className="pricing-switcher-container" role="tablist" aria-label="Choose a pricing model">
            <button
              type="button"
              role="tab"
              aria-selected={billingMode === "validity"}
              className={`switcher-btn ${billingMode === "validity" ? "active" : ""}`}
              onClick={() => setBillingMode("validity")}
            >
              Validity plans <span className="tag-count">5 tiers</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={billingMode === "pay-as-you-go"}
              className={`switcher-btn ${billingMode === "pay-as-you-go" ? "active" : ""}`}
              onClick={() => setBillingMode("pay-as-you-go")}
            >
              Pay as you go
            </button>
          </div>
        </div>

        {/* --- DYNAMIC PRICING CONTENT --- */}
        <div className="pricing-content-box">
          {billingMode === "validity" ? (
            <div className="validity-plans-grid">
              {validityPlans.map((plan, index) => (
                <div
                  className={`validity-card ${plan.popular ? "power-core-card popular-card" : ""}`}
                  key={index}
                  onMouseMove={handleMouseMove}
                >
                  <div className="spotlight-glow" />
                  {plan.popular && (
                    <span className="most-popular-badge">Power Core</span>
                  )}
                  <div className="card-top-info">
                    <div className="plan-icon-node" />
                    <h3 className="plan-credits">{plan.credits}</h3>
                  </div>
                  <div className="plan-pricing-row">
                    <span className="currency">$</span>
                    <span className="amount">{plan.price}</span>
                    <span className="interval">/ mo</span>
                  </div>
                  <div className="plan-details-text">
                    <p className="per-email">{plan.perEmail}</p>
                    <p className="validity-note">30-day rolling validity</p>
                  </div>
                  <a
                    className={`plan-action-btn ${plan.popular ? "primary-btn" : "secondary-btn"}`}
                    href="https://app.emailanswers.ai/signup"
                  >
                    Choose plan <span aria-hidden="true">↗</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="payg-layout-grid power-core-card"
              onMouseMove={handleCalculatorMouseMove}
              onMouseLeave={handleCalculatorMouseLeave}
            >
              <div className="spotlight-glow" />
              <div className="payg-calculator-pane">
                <div className="payg-top-label-row">
                  <div>
                    <span className="payg-sub-heading">Target Volume Pipeline</span>
                    <h3 className="payg-volume-title">{currentStep.value.toLocaleString()} verifications</h3>
                  </div>
                  <span className="expiry-pill">Zero Expiry Guarantee</span>
                </div>

                <div className="payg-price-display">
                  <span className="payg-currency">$</span>
                  <span className="payg-big-number odometer-num" ref={priceRef}>{calculatedPrice}</span>
                </div>
                <p className="payg-rate-breakdown">
                  ${pricePerThousand.toFixed(2)} per 1,000 &nbsp;·&nbsp; ${pricePerEmail.toFixed(4)} per email
                </p>

                <div className="slider-control-group">
                  <input
                    type="range"
                    min="0"
                    max={sliderSteps.length - 1}
                    step="1"
                    value={sliderIndex}
                    onChange={(e) => setSliderIndex(Number(e.target.value))}
                    className="pricing-range-input"
                    aria-label="Number of email verifications"
                    aria-valuetext={`${currentStep.value.toLocaleString()} verifications for $${calculatedPrice}`}
                    style={{ "--range-progress": `${(sliderIndex / (sliderSteps.length - 1)) * 100}%` }}
                  />
                  <div className="slider-ticks-row">
                    {sliderSteps.map((step, idx) => (
                      <button
                        key={idx}
                        className={`tick-label ${sliderIndex === idx ? "active-tick" : ""}`}
                        onClick={() => setSliderIndex(idx)}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="payg-cta-row">
                  <a href="https://app.emailanswers.ai/signup" className="payg-signup-btn">
                    Try it free ↗
                  </a>
                  <span className="payg-card-note">Start with 250 free credits. No card.</span>
                </div>
              </div>

              <div className="payg-perks-pane">
                <div className="comparison-card-box">
                  <span className="comp-header-title">BENCHMARK COMPARISON // NEVERBOUNCE</span>
                  <div className="comp-row">
                    <span>EmailAnswers AI</span>
                    <strong className="brand-price">${calculatedPrice}</strong>
                  </div>
                  <div className="comp-row">
                    <span>NeverBounce Standard</span>
                    {neverbouncePrice !== null ? (
                      <strong className="competitor-price">${neverbouncePrice}</strong>
                    ) : (
                      <strong className="competitor-price benchmark-unavailable">Not published</strong>
                    )}
                  </div>
                  {savings !== null ? (
                    <div className="comp-savings-banner pulse-badge">
                      Save ${savings}. NeverBounce credits expire after 12 months. Ours don’t.
                    </div>
                  ) : (
                    <div className="comp-savings-banner benchmark-note">
                      NeverBounce publishes pay-as-you-go prices at 1k, 10k and 100k. Slide to one of those volumes to compare.
                    </div>
                  )}
                </div>

                <div className="perks-checklist-box">
                  <span className="perks-header-title">PIPELINE INCLUSIONS</span>
                  <ul className="perks-list">
                    <li><span>◆</span> AI deep-signal score and diagnostic reasons</li>
                    <li><span>◆</span> Instant CSV bulk sync and API endpoints</li>
                    <li><span>◆</span> Unresolvable catch-alls re-checked free</li>
                    <li><span>◆</span> Unlimited single verification lookups</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- COMPETITOR COMPARISON MATRIX TABLE --- */}
        <div className="comparison-section-container">
          <div className="comparison-section-header">
            <div>
              <div className="pricing-pill-badge">
                <span className="dot" /> ECONOMIC AUDIT
              </div>
              <h3 className="section-title-sub">
                Same volume. Less money. <span>Zero expiration.</span>
              </h3>
            </div>
            <p className="section-subtitle-sub">
              Direct market evaluation against standard enterprise tiers. Measured across high-volume cold outreach pipelines.
            </p>
          </div>

          <div className="comparison-table-wrapper">
            <div className="comp-table-header">
              <span>VOLUME MATRIX</span>
              <span className="highlight-col-title">EMAILANSWERS AI</span>
              <span>NEVERBOUNCE</span>
              <span>EFFICIENCY GAIN</span>
            </div>
            <div className="comp-table-body">
              {comparisonRows.map((row, idx) => (
                <div className="comp-table-row" key={idx}>
                  <div className="col-vol">{row.volume}</div>
                  <div className="col-brand">{row.emailanswers}</div>
                  <div className="col-comp">{row.neverbounce}</div>
                  <div className="col-diff">{row.diff}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- BENTO 3D VECTOR VALUE GRID --- */}
        <div className="pricing-bento-section">
          <div className="pricing-bento-header">
            <div>
              <div className="pricing-pill-badge">
                <span className="dot" /> ARCHITECTURAL ADVANTAGE
              </div>
              <h3 className="section-title-sub">
                Three hidden costs <span>we eliminated.</span>
              </h3>
            </div>
            <p className="section-subtitle-sub">
              Traditional verification models penalize growth. We engineered our engine to protect sender reputation without friction.
            </p>
          </div>

          <div className="pricing-bento-grid">
            {perksData.map((item, idx) => (
              <div className="pricing-bento-card" key={idx} onMouseMove={handleMouseMove}>
                <div className="spotlight-glow" />
                <div className="bento-vector-art-wrap">
                  <div className="cyber-node-circle" />
                  <svg className="bento-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.iconPath} />
                  </svg>
                  <span className="bento-floating-tag">{item.tag}</span>
                </div>
                <div className="bento-text-content">
                  <h4 className="bento-card-heading">{item.heading}</h4>
                  <p className="bento-card-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Pricing;
