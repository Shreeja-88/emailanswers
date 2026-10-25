
import { useEffect, useRef, useState } from "react";
import HeroProblem from "./sections/HeroProblem";
import Navbar from "../../components/Navbar/Navbar";
import "./NeverBounce.css";
import logo from "../../assets/emailanswers-logo.png";
import TeamFitTestimonial from "./sections/TeamFitTestimonial";
import Comparison from "./sections/Comparison";

const pageSections = [
  { id: "tldr", label: "The short answer" },
  { id: "problem", label: "Where NeverBounce falls short" },
  { id: "compare", label: "Feature comparison" },
  { id: "fair", label: "Which one fits you" },
  { id: "switch", label: "How to switch" },
  { id: "faq", label: "FAQ" },
];

function PageFooter() {
  return (
    <footer className="nb-footer">
      <div className="nb-footer-hero">
        <h2>
          Know which emails
          <br />
          <span>are worth reaching.</span>
        </h2>

        <a className="nb-footer-cta-button" href="/signup">
          Get 250 credits <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* Continuous scrolling wordmark */}
      <div className="nb-footer-watermark" aria-hidden="true">
        <div className="nb-footer-marquee-track">
          {[0, 1].map((group) => (
            <div className="nb-footer-marquee-group" key={group}>
              <span>VERIFY.</span>
              <span>VALIDATE.</span>
              <span>REACH.</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stationary divider */}
      <div className="nb-footer-divider" />

      <div className="nb-footer-top">
        <div className="nb-footer-brand">
          <a
            className="nb-footer-logo"
            href="/"
            aria-label="EmailAnswers AI home"
          >
            <img
              src={logo}
              alt="EmailAnswers AI"
              className="nb-footer-logo-image"
            />
          </a>

          <p>
            Smarter email verification.
            <br />
            Better answers for every address.
          </p>
        </div>
      </div>

      <div className="nb-footer-links">
        <div className="nb-footer-column">
          <h3>Company</h3>
          <a href="/#about">About us</a>
          <a href="/#contact">Contact</a>
          <a href="/#faq">FAQ</a>
        </div>

        <div className="nb-footer-column">
          <h3>Product</h3>
          <a href="/#product">Features</a>
          <a href="/#how">How it works</a>
          <a href="/#pricing">Pricing</a>
        </div>

        <div className="nb-footer-column">
          <h3>Resources</h3>
          <a href="/alternatives/neverbounce">NeverBounce</a>
        </div>
      </div>

      <div className="nb-footer-bottom">
        <p>
          © {new Date().getFullYear()} EmailAnswers AI. All rights reserved.
        </p>

        <a className="nb-footer-back-to-top" href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}

function TLDR() {
  const [activeSection, setActiveSection] = useState("tldr");
  const [hasEntered, setHasEntered] = useState(false);
  const [countedPoints, setCountedPoints] = useState([0, 0, 0]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || hasEntered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return;

    const targets = [1, 2, 3];
    const duration = 700;
    let animationFrame;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCountedPoints(
        targets.map((target) => Math.floor(target * progress))
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasEntered]);

  const handleNavigation = (id) => {
    setActiveSection(id);
  };

  return (
    <section
      className="nb-section nb-tldr-section"
      id="tldr"
      ref={sectionRef}
    >
      <div className="nb-tldr-layout">
        <aside className="nb-toc">
          <span className="nb-toc-label">QUICK NAVIGATION</span>
          <h3>On this page</h3>

          <nav aria-label="On this page">
            {pageSections.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={
                  activeSection === item.id
                    ? "nb-toc-link active"
                    : "nb-toc-link"
                }
                onClick={() => handleNavigation(item.id)}
              >
                <span className="nb-toc-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
                <span className="nb-toc-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </nav>

          <div className="nb-toc-help">
            <span className="nb-help-icon">✳</span>
            <p>Looking for a specific answer?</p>
            <a href="#faq">Explore the FAQs ↗</a>
          </div>
        </aside>

        <div className="nb-summary">
          <div className="nb-summary-top">
            <span className="nb-eyebrow">
              <span className="nb-dot" />
              THE QUICK VERDICT
            </span>
            <span className="nb-reading-time">3 MIN READ</span>
          </div>

          <h2>
            The short <span className="nb-script">answer.</span>
          </h2>

          <p className="nb-summary-intro">
            Both tools approach email verification differently. The right
            choice depends on your list, your workflow, and how you handle
            uncertain results.
          </p>

          <div className="nb-summary-points">
            <article className="nb-summary-point">
              <span className="nb-point-icon">
                {String(countedPoints[0]).padStart(2, "0")}
              </span>
              <div>
                <h3>NeverBounce handles standard verification</h3>
                <p>
                  It identifies invalid, disposable and other email
                  addresses, while catch-all results can remain unverifiable.
                </p>
              </div>
            </article>

            <article className="nb-summary-point">
              <span className="nb-point-icon">
                {String(countedPoints[1]).padStart(2, "0")}
              </span>
              <div>
                <h3>Catch-all results need extra attention</h3>
                <p>
                  An accept-all response does not confirm that a specific
                  recipient mailbox exists.
                </p>
              </div>
            </article>

            <article className="nb-summary-point">
              <span className="nb-point-icon">
                {String(countedPoints[2]).padStart(2, "0")}
              </span>
              <div>
                <h3>Choose based on your workflow</h3>
                <p>
                  If you work with B2B lists, investigate how EmailAnswers AI
                  handles catch-all results before choosing a solution.
                </p>
              </div>
            </article>
          </div>

          <div className="nb-recommendations">
            <article className="nb-recommendation">
              <div className="nb-recommendation-icon">↗</div>
              <span className="nb-recommendation-label">OPTION 01</span>
              <h3>Stay with NeverBounce</h3>
              <p>
                A reasonable choice if your current verification workflow
                meets your needs and catch-all results are uncommon.
              </p>
              <a href="#compare">
                Explore its features <span aria-hidden="true">→</span>
              </a>
            </article>

            <article className="nb-recommendation nb-recommendation-featured">
              <div className="nb-recommendation-icon">✳</div>
              <span className="nb-recommendation-label">OPTION 02</span>
              <h3>Evaluate EmailAnswers AI</h3>
              <p>
                Worth evaluating if catch-all results are a recurring
                challenge in your B2B outreach workflow.
              </p>
              <a href="#switch">
                Explore your options <span aria-hidden="true">→</span>
              </a>
            </article>
          </div>

          <p className="nb-disclaimer">
            Verification results vary by provider and recipient domain.
            Confirm product capabilities and pricing before making a decision.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionPlaceholder({ id, number, eyebrow, title, description }) {
  return (
    <section className="nb-section nb-placeholder-section" id={id}>
      <div className="nb-placeholder-number">{number}</div>

      <div className="nb-placeholder-content">
        <span className="nb-eyebrow">
          <span className="nb-dot" />
          {eyebrow}
        </span>

        <h2>{title}</h2>
        <p>{description}</p>

        <span className="nb-coming-soon">
          Section component will be added here
        </span>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="nb-cta-section" id="cta">
      <div className="nb-cta-card">
        <span className="nb-eyebrow">
          <span className="nb-dot" />
          MAKE AN INFORMED DECISION
        </span>

        <h2>
          Know which emails{" "}
          <span className="nb-script">are worth reaching.</span>
        </h2>

        <p>
          Explore EmailAnswers AI and decide whether it fits your email
          verification workflow.
        </p>

        <a className="nb-button nb-button-dark" href="/#pricing">
          Explore EmailAnswers AI <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

export default function NeverBounce() {
  return (
    <div className="nb-page" id="top">
      <Navbar variant="comparison" />

      <main className="nb-main">
        <HeroProblem />
        <TLDR />

        <SectionPlaceholder
          id="compare"
          number="03"
          eyebrow="SIDE BY SIDE"
          title="Compare the features"
          description="Review verification capabilities, integrations, pricing, and the workflows supported by each platform."
        />

        <Comparison />

        <TeamFitTestimonial />

        <SectionPlaceholder
          id="switch"
          number="05"
          eyebrow="YOUR NEXT STEPS"
          title="Explore your options"
          description="Review how to assess your existing verification workflow and evaluate an alternative."
        />

        <FinalCTA />

        <SectionPlaceholder
          id="faq"
          number="06"
          eyebrow="COMMON QUESTIONS"
          title="Frequently asked questions"
          description="Answers about catch-all verification, switching tools, integrations, and pricing will appear here."
        />
      </main>

      <PageFooter />
    </div>
  );
}
