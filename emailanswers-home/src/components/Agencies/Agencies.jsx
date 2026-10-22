
import { useEffect, useRef, useState } from "react";
import "./Agencies.css";

const agencyStats = [
  {
    label: "Contacts verified",
    detail: "In three months",
    number: 1.2,
    suffix: "M",
    decimals: 1,
  },
  {
    label: "Catch-all leads recovered",
    detail: "Classified as deliverable",
    number: 38,
    suffix: "%",
    decimals: 0,
  },
  {
    label: "Bounce rate",
    detail: "Across campaigns",
    number: 1.4,
    suffix: "%",
    decimals: 1,
  },
];

const testimonialStats = [
  {
    label: "Usable leads per client list",
    number: 2,
    suffix: "×",
    decimals: 0,
  },
  {
    label: "Domains burned since switching",
    number: 0,
    suffix: "",
    decimals: 0,
  },
];

const integrations = [
  { name: "Instantly", category: "Sequencer" },
  { name: "Smartlead", category: "Sequencer" },
  { name: "lemlist", category: "Sequencer" },
  { name: "Apollo", category: "Data" },
  { name: "Clay", category: "Enrichment" },
  { name: "HubSpot", category: "CRM" },
  { name: "Salesforce", category: "CRM" },
  { name: "Zapier", category: "Automation" },
];

const resources = [
  {
    word: "catch-all",
    meta: "Guides · 6 min read",
    title:
      "What is a catch-all email, and why your verifier can't handle it",
  },
  {
    word: "bounce",
    meta: "Deliverability · 5 min read",
    title: "The real cost of a 5% bounce rate on your sending domain",
  },
  {
    word: "agencies",
    meta: "Agencies · 7 min read",
    title:
      "How agencies deliver bigger lists without burning client domains",
  },
];

const faqItems = [
  {
    question: "How can agencies use EmailAnswers AI?",
    answer:
      "Agencies can use email verification to assess contact lists, identify potentially usable leads, and support cleaner campaign reporting.",
  },
  {
    question: "Can it help with catch-all email addresses?",
    answer:
      "Catch-all addresses can require additional analysis. Verification results should be interpreted according to the status and confidence returned by your verification workflow.",
  },
  {
    question: "Will it integrate with our existing tools?",
    answer:
      "The design reference lists popular outreach, data, enrichment, CRM, and automation platforms. Confirm current integration availability before relying on a particular connection.",
  },
];

function useInView(ref, threshold = 0.1) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return visible;
}

function useCountUp(target, enabled, duration = 1600, decimals = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || duration <= 0) {
      setCount(target);
      return undefined;
    }

    let frameId;
    let startTime;

    const animate = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Number((target * eased).toFixed(decimals)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    setCount(0);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [target, enabled, duration, decimals]);

  return count;
}

function AnimatedStat({
  stat,
  visible,
  className = "",
  duration = 1600,
}) {
  const count = useCountUp(
    stat.number,
    visible,
    duration,
    stat.decimals ?? 0
  );

  return (
    <span className={className}>
      {count.toFixed(stat.decimals ?? 0)}
      {stat.suffix}
    </span>
  );
}

function IntegrationTick({ index, visible }) {
  return (
    <span
      className={`agencies-integration-indicator ${
        visible ? "integration-tick-visible" : ""
      }`}
      style={{ "--tick-delay": `${index * 100}ms` }}
      aria-hidden="true"
    >
      <svg
        className="agencies-integration-tick-svg"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="integration-tick-ring"
          cx="12"
          cy="12"
          r="10"
        />
        <path
          className="agencies-integration-tick-path"
          d="m6.5 12.5 3.5 3.5 7.5-8"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function AgenciesTheme() {
  return (
    <style>{`
      #agencies {
        --agency-orange: #ff6b1a;
        --agency-orange-light: #ff914d;
        --agency-black: #080808;
        --agency-white: #ffffff;
      }

      /* Animated orange heading */

      #agencies .agency-story-heading {
        width: 100%;
        max-width: 850px;
        margin: 0 auto 38px;
        text-align: center;
      }

      #agencies .agency-story-heading h3 {
        color: #ffffff;
        margin: 20px auto 12px;
        text-align: center;
      }

      #agencies .agency-story-heading h3 span {
        background: linear-gradient(
          100deg,
          #ff6b1a,
          #ffc49f,
          #ff6b1a
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: agencyOrangeGradient 5s linear infinite;
      }

      #agencies .agency-story-heading > p {
        color: rgba(255, 255, 255, 0.75);
        text-align: center;
      }

      /* Balanced testimonial and campaign metrics */

      #agencies .agency-story-layout {
        width: 100%;
        max-width: 1120px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
        gap: 24px;
        align-items: stretch;
      }

      #agencies .agency-quote-card,
      #agencies .agency-metrics-panel {
        min-width: 0;
        box-sizing: border-box;
      }

      #agencies .agency-quote-card {
        border-color: rgba(255, 107, 26, 0.3);
        transition:
          transform 300ms ease,
          border-color 300ms ease,
          box-shadow 300ms ease;
      }

      #agencies .agency-quote-card:hover {
        transform: translateY(-5px);
        border-color: rgba(255, 107, 26, 0.8);
        box-shadow: 0 20px 55px rgba(255, 107, 26, 0.12);
      }

      #agencies .agency-quote-icon,
      #agencies .agency-quote-tag,
      #agencies .agency-metric-chip {
        color: #ff914d;
      }

      #agencies .agency-quote-divider {
        background: rgba(255, 107, 26, 0.3);
      }

      /* RK avatar: orange instead of blue */

      #agencies .agency-avatar-wrap .agency-story-avatar {
        background: linear-gradient(
          135deg,
          #ff782b,
          #c84300
        ) !important;
        color: #ffffff !important;
        border: 1px solid rgba(255, 177, 122, 0.7);
        box-shadow: 0 0 24px rgba(255, 107, 26, 0.25);
      }

      /* Orange campaign metrics */

      #agencies .agency-metric-primary {
        border-color: rgba(255, 107, 26, 0.55);
      }

      #agencies .agency-metric-number {
        color: #ff7a2f;
      }

      /* Animated integration checkmarks */

      #agencies .agencies-integration-indicator {
        color: #ff782b;
        border-color: rgba(255, 107, 26, 0.4);
        background: rgba(255, 107, 26, 0.08);
      }

      #agencies .agencies-integration-tick-svg {
        overflow: visible;
      }

      #agencies .agencies-integration-tick-path {
        stroke: #ff782b;
        stroke-dasharray: 24;
        stroke-dashoffset: 24;
      }

      #agencies .integration-tick-visible .agencies-integration-tick-path {
        animation: agencyDrawOrangeTick 650ms ease-out forwards;
        animation-delay: var(--tick-delay, 0ms);
      }

      #agencies .agencies-integration-card {
        transition:
          transform 300ms ease,
          border-color 300ms ease,
          box-shadow 300ms ease;
      }

      #agencies .agencies-integration-card:hover {
        transform: translateY(-6px);
        border-color: rgba(255, 107, 26, 0.7);
        box-shadow: 0 14px 35px rgba(255, 107, 26, 0.1);
      }

      /* Integration note: Times New Roman, readable and centered */

      #agencies .agencies-integration-note {
        width: 100%;
        max-width: 650px;
        box-sizing: border-box;
        margin: 24px auto 0;
        padding: 0 18px;
        text-align: center;
        font-family: "Times New Roman", Times, serif;
        font-size: 17px;
        line-height: 1.7;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.72);
        white-space: normal;
        overflow-wrap: break-word;
      }

      @keyframes agencyOrangeGradient {
        to {
          background-position: 200% center;
        }
      }

      @keyframes agencyDrawOrangeTick {
        to {
          stroke-dashoffset: 0;
        }
      }

      @media (max-width: 760px) {
        #agencies .agency-story-layout {
          grid-template-columns: minmax(0, 1fr);
        }

        #agencies .agency-story-heading h3 {
          font-size: clamp(1.8rem, 7vw, 2.6rem);
        }

        #agencies .agencies-integration-note {
          font-size: 17px;
          padding: 0 12px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #agencies .agency-story-heading h3 span {
          animation: none;
        }

        #agencies .integration-tick-visible .agencies-integration-tick-path {
          animation: none;
          stroke-dashoffset: 0;
        }

        #agencies .agency-quote-card,
        #agencies .agencies-integration-card {
          transition: none;
        }
      }
    `}</style>
  );
}

function Agencies() {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialRef = useRef(null);
  const integrationsRef = useRef(null);

  const isVisible = useInView(sectionRef, 0.02);
  const statsVisible = useInView(statsRef, 0.1);
  const testimonialVisible = useInView(testimonialRef, 0.1);
  const integrationsVisible = useInView(integrationsRef, 0.1);

  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <>
      <AgenciesTheme />

      <section
        ref={sectionRef}
        id="agencies"
        className={`agencies-section ${
          isVisible ? "agencies-visible" : ""
        }`}
      >
        <div className="agencies-background-glow" aria-hidden="true" />
        <div
          className="agencies-background-orb agencies-background-orb-one"
          aria-hidden="true"
        />
        <div
          className="agencies-background-orb agencies-background-orb-two"
          aria-hidden="true"
        />

        <div className="agencies-container">
          <header className="agencies-heading agencies-reveal-item">
            <span className="agencies-eyebrow">
              <span className="agencies-eyebrow-dot" />
              BUILT FOR LEAD GENERATION
            </span>

            <h2>
              Built on accuracy.
              <br />
              <span>Proven in client campaigns.</span>
            </h2>

            <p className="agencies-description">
              Agencies use EmailAnswers AI to deliver bigger usable lists,
              protect client domains, and show clean numbers in every report.
            </p>
          </header>

          <section className="agencies-case-study agencies-reveal-item">
            <div className="agencies-case-content">
              <span className="agencies-case-label">
                <span className="agencies-case-dot" />
                CUSTOMER SUCCESS STORY
              </span>

              <h3>
                How Nexus Commerce recovered 38% of a list their old verifier
                told them to discard.
              </h3>

              <p className="agencies-case-author">
                Head of Demand Gen <span>·</span> Nexus Commerce
              </p>

              <a
                className="agencies-case-link"
                href="mailto:hello@emailanswers.ai?subject=Nexus%20Commerce%20case%20study"
              >
                Ask about the case study{" "}
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="agencies-case-visual" aria-hidden="true">
              <div className="agencies-visual-orbit agencies-orbit-one" />
              <div className="agencies-visual-orbit agencies-orbit-two" />
              <div className="agencies-visual-orbit agencies-orbit-three" />

              <div className="agencies-visual-card">
                <span className="agencies-visual-icon">✓</span>
                <div>
                  <span className="agencies-visual-caption">
                    CATCH-ALL ANALYSIS
                  </span>
                  <strong>Potential leads found</strong>
                </div>
                <span className="agencies-visual-arrow">↗</span>
              </div>

              <div className="agencies-visual-badge">
                <span>+</span> More opportunities
              </div>

              <span className="agencies-floating-particle agencies-particle-one" />
              <span className="agencies-floating-particle agencies-particle-two" />
              <span className="agencies-floating-particle agencies-particle-three" />
            </div>
          </section>

          <div className="agencies-results-heading agencies-reveal-item">
            <span>THE IMPACT</span>
            <p>Better insights. More usable leads. Healthier campaigns.</p>
          </div>

          <div className="agencies-stats" ref={statsRef}>
            {agencyStats.map((stat, index) => (
              <article
                className="agencies-stat-card agencies-reveal-item"
                key={stat.label}
                style={{ "--reveal-delay": `${index * 100}ms` }}
              >
                <AnimatedStat
                  stat={stat}
                  visible={statsVisible}
                  className="agencies-stat-value"
                  duration={1700 + index * 150}
                />
                <h3>{stat.label}</h3>
                <p>{stat.detail}</p>
                <span className="agencies-stat-accent" aria-hidden="true" />
              </article>
            ))}
          </div>

          <p className="agencies-disclaimer">
            Figures shown are from the supplied design content and have not
            been independently verified.
          </p>

          <section
            ref={testimonialRef}
            className={`agencies-extra agencies-testimonial agencies-reveal-item ${
              testimonialVisible ? "agency-story-visible" : ""
            }`}
          >
            <div className="agency-story-heading">
              <span className="agencies-extra-tag">
                THE AGENCY SUCCESS STORY
              </span>

              <h3>
                From uncertain leads to <span>confident campaigns.</span>
              </h3>

              <p>
                Less guesswork. Better conversations. Healthier campaigns.
              </p>
            </div>

            <div className="agency-story-layout">
              <article className="agencies-testimonial-card agency-quote-card">
                <div className="agency-quote-decoration" aria-hidden="true">
                  “
                </div>

                <div className="agency-quote-topline">
                  <span className="agency-quote-icon" aria-hidden="true">
                    ✳
                  </span>
                  <span>CLIENT PERSPECTIVE</span>
                </div>

                <span className="agency-quote-tag">
                  CATCH-ALL VERIFICATION
                </span>

                <blockquote>
                  We needed a smarter way to evaluate our lists without
                  throwing away potential opportunities. A clearer
                  verification workflow changed how we approach campaign
                  preparation and client reporting.
                </blockquote>

                <div className="agency-quote-divider" />

                <div className="agencies-person agency-story-person">
                  <div className="agency-avatar-wrap">
                    <span className="agencies-avatar agency-story-avatar">
                      RK
                    </span>
                  </div>

                  <div className="agency-person-info">
                    <strong>Robert K.</strong>
                    <p>Founder · Outbound Lead Generation</p>
                  </div>
                </div>
              </article>

              <aside className="agency-metrics-panel">
                <div className="agency-metrics-intro">
                  <span>CAMPAIGN SNAPSHOT</span>
                  <h4>
                    Better inputs.
                    <br />
                    Smarter outreach.
                  </h4>
                </div>

                {testimonialStats.map((stat, index) => (
                  <article
                    className={`agency-metric-card ${
                      index === 0
                        ? "agency-metric-primary"
                        : "agency-metric-secondary"
                    }`}
                    key={stat.label}
                  >
                    <div className="agency-metric-top">
                      <span className="agency-metric-chip">
                        {index === 0 ? "LEAD POTENTIAL" : "SENDER HEALTH"}
                      </span>
                    </div>

                    <div className="agency-metric-number">
                      <AnimatedStat
                        stat={stat}
                        visible={testimonialVisible}
                        duration={1500 + index * 150}
                      />
                    </div>

                    <h5>{stat.label}</h5>
                    <p>
                      {index === 0
                        ? "Illustrative comparison of usable leads per client list."
                        : "Monitor deliverability risks before campaigns go live."}
                    </p>
                  </article>
                ))}

                <p className="agency-metrics-footnote">
                  Illustrative design figures; independently unverified.
                </p>
              </aside>
            </div>
          </section>

          <section
            ref={integrationsRef}
            className={`agencies-extra agencies-integrations agencies-reveal-item ${
              integrationsVisible ? "integrations-visible" : ""
            }`}
          >
            <div className="agencies-extra-heading">
              <span className="agencies-extra-tag">INTEGRATIONS</span>

              <h3>
                Works where your campaigns <span>live.</span>
              </h3>

              <p>
                Verify inside the tools you already use for outreach,
                enrichment, and CRM.
              </p>
            </div>

            <div className="agencies-integration-grid">
              {integrations.map((integration, index) => (
                <article
                  className="agencies-integration-card"
                  key={integration.name}
                  style={{ "--reveal-delay": `${index * 80}ms` }}
                >
                  <IntegrationTick
                    index={index}
                    visible={integrationsVisible}
                  />

                  <span className="agencies-integration-name">
                    {integration.name}
                  </span>

                  <small>{integration.category}</small>

                  <span
                    className="agencies-integration-card-glow"
                    aria-hidden="true"
                  />
                </article>
              ))}
            </div>

            <p className="agencies-integration-note">
              Integration availability may vary. Confirm supported connections
              before use.
            </p>
          </section>

          <section className="agencies-extra agencies-resources agencies-reveal-item">
            <div className="agencies-resources-heading">
              <div>
                <span className="agencies-extra-tag">RESOURCES</span>
                <h3>
                  Deliverability, <em>demystified.</em>
                </h3>
              </div>

              <a
                href="mailto:hello@emailanswers.ai?subject=EmailAnswers%20resources"
                className="agencies-resources-link"
              >
                View all articles <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="agencies-resource-grid">
              {resources.map((article, index) => (
                <article
                  className="agencies-resource-card"
                  key={article.word}
                  style={{ "--reveal-delay": `${index * 100}ms` }}
                >
                  <div className="agencies-resource-art">
                    <span>{article.word}</span>
                    <span
                      className="agencies-resource-art-orbit"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="agencies-resource-body">
                    <small>{article.meta}</small>
                    <h4>{article.title}</h4>
                    <span
                      className="agencies-resource-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="agencies-extra agencies-mini-faq agencies-reveal-item">
            <div className="agencies-extra-heading">
              <span className="agencies-extra-tag">FOR AGENCIES</span>
              <h3>Questions before your next campaign?</h3>
              <p>
                Quick answers to help you understand the agency workflow.
              </p>
            </div>

            {faqItems.map((item, index) => (
              <div className="agencies-faq-item" key={item.question}>
                <button
                  type="button"
                  className="agencies-faq-question"
                  aria-expanded={activeFaq === index}
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <span>{item.question}</span>
                  <span className="agencies-faq-icon" aria-hidden="true">
                    {activeFaq === index ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={`agencies-faq-answer ${
                    activeFaq === index ? "agencies-faq-answer-open" : ""
                  }`}
                  aria-hidden={activeFaq !== index}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </section>
    </>
  );
}

export default Agencies;
