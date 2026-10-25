
import { useState } from "react";
import "./NeverBounce.css";

const pageSections = [
  { id: "tldr", label: "The short answer" },
  { id: "problem", label: "Where NeverBounce falls short" },
  { id: "compare", label: "Feature comparison" },
  { id: "fair", label: "Which one fits you" },
  { id: "switch", label: "How to switch" },
  { id: "faq", label: "FAQ" },
];

function PageNavbar() {
  return (
    <nav className="nb-nav">
      <a className="nb-logo" href="/">
        <span className="nb-logo-mark">@</span>
        <span>EmailAnswers <span className="nb-ai">AI</span></span>
      </a>

      <div className="nb-nav-links">
        <a href="/#how">How it works</a>
        <a href="/#product">Product</a>
        <a href="/alternatives/neverbounce" aria-current="page">
          Compare
        </a>
        <a href="/#pricing">Pricing</a>
      </div>

      <a className="nb-button nb-button-primary" href="/#pricing">
        Try it free <span aria-hidden="true">↗</span>
      </a>
    </nav>
  );
}

function PageFooter() {
  return (
    <footer className="nb-footer">
      <div className="nb-footer-grid">
        <div>
          <a className="nb-logo nb-footer-logo" href="/">
            <span className="nb-logo-mark">@</span>
            <span>EmailAnswers AI</span>
          </a>
          <p>
            Email verification that helps you make better decisions about
            the leads you contact.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <a href="/#how">How it works</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#faq">FAQs</a>
        </div>

        <div>
          <h3>Compare</h3>
          <a href="/alternatives/neverbounce">NeverBounce alternative</a>
          <a href="/alternatives/zerobounce">ZeroBounce alternative</a>
          <a href="/alternatives/scrubby">Scrubby alternative</a>
        </div>

        <div>
          <h3>Company</h3>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </div>
      </div>

      <div className="nb-footer-bottom">
        <span>© {new Date().getFullYear()} EmailAnswers AI</span>
        <a href="/">Back to EmailAnswers AI ↗</a>
      </div>
    </footer>
  );
}

function HeroPlaceholder() {
  return (
    <section className="nb-hero" aria-label="NeverBounce comparison introduction">
      <div className="nb-hero-content">
        <div className="nb-breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/alternatives">Alternatives</a>
          <span>/</span>
          <span>NeverBounce</span>
        </div>

        <span className="nb-eyebrow">
          <span className="nb-dot" />
          EMAIL VERIFICATION COMPARISON
        </span>

        <h1>
          A NeverBounce alternative that{" "}
          <span className="nb-script">answers catch-alls.</span>
        </h1>

        <p className="nb-hero-description">
          Compare NeverBounce and EmailAnswers AI to understand how each
          tool handles catch-all email addresses and B2B lead verification.
        </p>

        <div className="nb-hero-actions">
          <a className="nb-button nb-button-dark" href="/#pricing">
            Explore EmailAnswers AI <span aria-hidden="true">↗</span>
          </a>
          <a className="nb-button nb-button-outline" href="#compare">
            View comparison ↓
          </a>
        </div>

        <div className="nb-hero-points">
          <span>✓ B2B-focused comparison</span>
          <span>✓ Catch-all verification</span>
          <span>✓ Feature breakdown</span>
        </div>

        <div className="nb-hero-preview">
          <div className="nb-preview-column">
            <span className="nb-preview-label">STANDARD VERIFIER</span>
            <h3>NeverBounce</h3>
            <div className="nb-preview-row">
              <span>Contact A</span>
              <span className="nb-status nb-status-warning">Accept-all</span>
            </div>
            <div className="nb-preview-row">
              <span>Contact B</span>
              <span className="nb-status nb-status-warning">Accept-all</span>
            </div>
          </div>

          <div className="nb-preview-divider">VS</div>

          <div className="nb-preview-column nb-preview-highlight">
            <span className="nb-preview-label">CATCH-ALL ANALYSIS</span>
            <h3>EmailAnswers AI</h3>
            <div className="nb-preview-row">
              <span>Contact A</span>
              <span className="nb-status nb-status-orange">Analysis</span>
            </div>
            <div className="nb-preview-row">
              <span>Contact B</span>
              <span className="nb-status nb-status-orange">Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TLDR() {
  const [activeSection, setActiveSection] = useState("tldr");

  const handleNavigation = (id) => {
    setActiveSection(id);
  };

  return (
    <section className="nb-section nb-tldr-section" id="tldr">
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
                  activeSection === item.id ? "nb-toc-link active" : "nb-toc-link"
                }
                onClick={() => handleNavigation(item.id)}
              >
                <span className="nb-toc-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
                <span className="nb-toc-arrow" aria-hidden="true">↗</span>
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
              <span className="nb-point-icon">01</span>
              <div>
                <h3>NeverBounce handles standard verification</h3>
                <p>
                  It identifies invalid, disposable and other email
                  addresses, while catch-all results can remain unverifiable.
                </p>
              </div>
            </article>

            <article className="nb-summary-point">
              <span className="nb-point-icon">02</span>
              <div>
                <h3>Catch-all results need extra attention</h3>
                <p>
                  An accept-all response does not confirm that a specific
                  recipient mailbox exists.
                </p>
              </div>
            </article>

            <article className="nb-summary-point">
              <span className="nb-point-icon">03</span>
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
          Make every lead <span className="nb-script">count.</span>
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
    <div className="nb-page">
      <PageNavbar />

      <main className="nb-main">
        <HeroPlaceholder />

        <TLDR />

        <SectionPlaceholder
          id="problem"
          number="02"
          eyebrow="THE CHALLENGE"
          title="Where standard verification falls short"
          description="Understand catch-all domains, unverifiable results, and the limitations of standard mailbox checks."
        />

        <SectionPlaceholder
          id="compare"
          number="03"
          eyebrow="SIDE BY SIDE"
          title="Compare the features"
          description="Review verification capabilities, integrations, pricing, and the workflows supported by each platform."
        />

        <SectionPlaceholder
          id="fair"
          number="04"
          eyebrow="FIND YOUR FIT"
          title="Which tool fits your team?"
          description="Evaluate the trade-offs based on your audience, campaign type, and verification requirements."
        />

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
