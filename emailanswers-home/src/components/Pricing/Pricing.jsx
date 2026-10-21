import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  { label: "1k", value: 1000, pricePerThousand: 5.0 },
  { label: "5k", value: 5000, pricePerThousand: 4.8 },
  { label: "10k", value: 10000, pricePerThousand: 4.5 },
  { label: "25k", value: 25000, pricePerThousand: 4.2 },
  { label: "50k", value: 50000, pricePerThousand: 3.9 },
  { label: "100k", value: 100000, pricePerThousand: 1.86 },
  { label: "250k", value: 250000, pricePerThousand: 1.6 },
  { label: "500k", value: 500000, pricePerThousand: 1.4 },
  { label: "1M", value: 1000000, pricePerThousand: 1.2 },
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
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=85",
    tag: "0 Expiry",
    heading: "Credits that never expire",
    desc: "Pay-as-you-go credits stay securely in your account until you use them. NeverBounce credits expire after 12 months.",
  },
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=85",
    tag: "$0 Unknowns",
    heading: "Unknowns are always on us",
    desc: "If a mail server times out or cannot be reached, we re-check later automatically without charging your balance.",
  },
  {
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=85",
    tag: "Free Single Checks",
    heading: "Single verifications stay free",
    desc: "Inspect individual high-value prospect addresses anytime, anywhere, without requiring an active subscription.",
  },
];

function Pricing() {
  const sectionRef = useRef(null);
  const [billingMode, setBillingMode] = useState("pay-as-you-go");
  const [sliderIndex, setSliderIndex] = useState(5); // Default to 100k

  const currentStep = sliderSteps[sliderIndex];
  const calculatedPrice = Math.round((currentStep.value / 1000) * currentStep.pricePerThousand);
  const neverbouncePrice = Math.round((currentStep.value / 1000) * 4.0);
  const savings = Math.max(0, neverbouncePrice - calculatedPrice);

  // Cinematic GSAP Scroll Triggers & Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const motion = gsap.matchMedia();

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });

        tl.from(".pricing-hero-banner", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out" })
          .from(".pricing-switcher-container", { scale: 0.9, opacity: 0, duration: 0.5 }, "-=0.4");

        gsap.from(".pricing-content-box", {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pricing-switcher-container",
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(".comparison-table-wrapper", {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".comparison-section-header",
            start: "top 80%",
            once: true,
          },
        });

        gsap.from(".pricing-bento-card", {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pricing-bento-header",
            start: "top 82%",
            once: true,
          },
        });

        gsap.to(".pricing-glow-orb", {
          scale: 1.3,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".floating-preview-badge", {
          y: -10,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      return () => motion.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Active Mouse-Tracking Spotlight Glow Function for Cards
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  // Interactive 3D Parallax Tilt for Pay-As-You-Go Box
  const handleCalculatorMouseMove = (e) => {
    handleMouseMove(e);
    const card = document.querySelector(".payg-layout-grid");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      rotationY: x * 0.006,
      rotationX: -y * 0.006,
      ease: "power2.out",
      duration: 0.4,
      transformPerspective: 1000,
    });
  };

  const handleCalculatorMouseLeave = () => {
    const card = document.querySelector(".payg-layout-grid");
    if (!card) return;
    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      ease: "power3.out",
      duration: 0.8,
    });
  };

  return (
    <section className="pricing-section-wrapper" id="pricing" ref={sectionRef}>
      {/* Animated Background Atmosphere */}
      <div className="pricing-bg-atmosphere" aria-hidden="true">
        <div className="pricing-cyber-grid" />
        <div className="pricing-radar-wave" />
        <div className="pricing-glow-orb orb-1" />
        <div className="pricing-glow-orb orb-2" />
      </div>

      <div className="pricing-main-container">
        {/* --- TOP HERO BANNER WITH SPOTLIGHT --- */}
        <div className="pricing-hero-banner" onMouseMove={handleMouseMove}>
          <div className="spotlight-glow" />
          <div className="hero-banner-content">
            <div className="pricing-pill-badge">
              <span className="dot" /> SECURE YOUR SENDER SCORE
            </div>
            <h2 className="hero-banner-title">
              Stop paying for <span>“unknown.”</span>
            </h2>
            <p className="hero-banner-desc">
              Upload a test list and observe how many risky catch-all addresses our AI engine recovers into verified leads.
            </p>
            <div className="hero-cta-group">
              <a href="#verify" className="hero-banner-btn">
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
            <div className="visual-image-card">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85"
                alt="Email verification analytics dashboard"
                loading="lazy"
              />
              <div className="visual-glow-overlay" />
            </div>
            <div className="floating-preview-badge badge-top">
              <span className="badge-icon">◆</span>
              <div>
                <strong>Catch-All Resolution</strong>
                <span className="badge-sub">99.4% Verified Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- PLAN SWITCHER --- */}
        <div className="pricing-switcher-wrapper">
          <div className="pricing-switcher-container">
            <button
              className={`switcher-btn ${billingMode === "validity" ? "active" : ""}`}
              onClick={() => setBillingMode("validity")}
            >
              Validity plans <span className="tag-count">5 tiers</span>
            </button>
            <button
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
                  className={`validity-card ${plan.popular ? "popular-card" : ""}`}
                  key={index}
                  onMouseMove={handleMouseMove}
                >
                  <div className="spotlight-glow" />
                  {plan.popular && <span className="most-popular-badge">Recommended</span>}
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
                  <button className={`plan-action-btn ${plan.popular ? "primary-btn" : "secondary-btn"}`}>
                    Deploy Plan
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="payg-layout-grid"
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
                  <span className="payg-big-number">{calculatedPrice}</span>
                </div>
                <p className="payg-rate-breakdown">
                  ${(calculatedPrice / (currentStep.value / 1000)).toFixed(2)} per 1k checks &nbsp;·&nbsp; ${(calculatedPrice / currentStep.value).toFixed(4)} per email
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
                  <a href="#signup" className="payg-signup-btn">
                    Initialize Free Test ↗
                  </a>
                  <span className="payg-card-note">Includes 250 test credits. No credit card required.</span>
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
                    <strong className="competitor-price">${neverbouncePrice}</strong>
                  </div>
                  <div className="comp-savings-banner pulse-badge">
                    Net Savings: ${savings}. Competitor credits expire in 12 months. Ours remain active forever.
                  </div>
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

        {/* --- BENTO IMAGE-RICH VALUE GRID --- */}
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
                <div className="bento-image-wrap">
                  <img src={item.image} alt={item.heading} loading="lazy" />
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