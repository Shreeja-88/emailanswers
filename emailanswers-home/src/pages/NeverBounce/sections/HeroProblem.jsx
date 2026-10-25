import { useEffect, useRef, useState } from "react";

function AnimatedStat({ target, prefix = "", suffix = "", label }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }

    let frameId = null;
    let hasAnimatedThisVisit = false;
    let startTime = 0;

    const duration = 1800;

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.round(target * eased));

      if (progress < 1 && hasAnimatedThisVisit) {
        frameId = requestAnimationFrame(animate);
      } else if (progress >= 1) {
        setCount(target);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate again whenever the card re-enters the viewport.
          if (hasAnimatedThisVisit) return;

          hasAnimatedThisVisit = true;

          if (frameId !== null) {
            cancelAnimationFrame(frameId);
          }

          setCount(0);
          startTime = performance.now();
          frameId = requestAnimationFrame(animate);
        } else {
          // Keep the completed number visible while away.
          // Allow another animation on the next visit.
          hasAnimatedThisVisit = false;
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [target]);

  return (
    <article className="nb-stat-card" ref={ref}>
      <strong className="nb-stat-number" aria-live="off">
        {prefix}
        {count.toLocaleString("en-US")}
        {suffix}
      </strong>
      <p>{label}</p>
    </article>
  );
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function SignalGraphic() {
  return (
    <div className="nb-signal-graphic" aria-hidden="true">
      <div className="nb-signal-orbit nb-signal-orbit-one" />
      <div className="nb-signal-orbit nb-signal-orbit-two" />

      <div className="nb-signal-node nb-signal-node-start">
        <span className="nb-signal-node-icon">@</span>
      </div>

      <div className="nb-signal-track">
        <span className="nb-signal-pulse" />
        <span className="nb-signal-pulse nb-signal-pulse-two" />
      </div>

      <div className="nb-signal-node nb-signal-node-end">
        <span className="nb-signal-node-icon">?</span>
      </div>

      <span className="nb-signal-caption nb-signal-caption-left">
        EMAIL INPUT
      </span>
      <span className="nb-signal-caption nb-signal-caption-right">
        NEEDS CONTEXT
      </span>
    </div>
  );
}

function SignalLabHero() {
  return (
    <section className="signal-hero">
      <div className="signal-hero__atmosphere" aria-hidden="true" />
      <div className="signal-hero__grid" aria-hidden="true" />

      <div className="signal-hero__content">
        <nav className="nb-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span>Alternatives</span>
          <span aria-hidden="true">/</span>
          <span>NeverBounce</span>
        </nav>

        <div className="signal-hero__eyebrow">
          <span className="signal-hero__live-dot" />
          NEVERBOUNCE ALTERNATIVE
        </div>

        <h1>
          The NeverBounce alternative that{" "}
          <span>answers catch-all.</span>
        </h1>

        <p className="signal-hero__description">
          Catch-all addresses can be difficult to verify because a domain
          may accept messages without confirming individual mailboxes.
          EmailAnswers AI provides additional insights to help teams make
          more informed sending decisions.
        </p>

        <div className="signal-hero__actions">
          <a className="signal-hero__cta" href="#comparison">
            Verify 100 emails free <span>→</span>
          </a>
          <a className="signal-hero__secondary" href="#comparison">
            See the full comparison
          </a>
        </div>

        <div className="signal-hero__benefits">
          <span><b>✓</b> No credit card</span>
          <span><b>✓</b> Upload your NeverBounce export directly</span>
          <span><b>✓</b> Results in minutes</span>
        </div>

        <div className="nb-insight-card">
          <div className="nb-insight-top">
            <span className="nb-insight-icon">✳</span>
            <div>
              <span className="nb-insight-label">
                THE IDEA BEHIND EMAILANSWERS AI
              </span>
              <h3>From uncertainty to clarity.</h3>
            </div>
            <span className="nb-insight-badge">AI-powered</span>
          </div>

          <p className="nb-insight-description">
            A catch-all result doesn't have to be the end of the road.
            Get deeper insights to make a more informed sending decision.
          </p>

          <div className="nb-insight-flow">
            <div className="nb-insight-step">
              <span className="nb-step-number">01</span>
              <span className="nb-step-title">Detect</span>
              <span className="nb-step-caption">Catch-all email</span>
            </div>

            <span className="nb-insight-arrow">→</span>

            <div className="nb-insight-step">
              <span className="nb-step-number">02</span>
              <span className="nb-step-title">Analyze</span>
              <span className="nb-step-caption">AI verification</span>
            </div>

            <span className="nb-insight-arrow">→</span>

            <div className="nb-insight-step">
              <span className="nb-step-number">03</span>
              <span className="nb-step-title">Decide</span>
              <span className="nb-step-caption">Clearer next step</span>
            </div>
          </div>

          <div className="nb-insight-footer">
            <span className="nb-insight-pulse" />
            Less guesswork. More informed decisions.
          </div>
        </div>

        <div className="signal-hero__proof">
          <span className="signal-hero__proof-line" />
          <span>FROM UNCERTAINTY TO CLARITY</span>
        </div>
      </div>

      <div
        className="signal-stage"
        role="group"
        aria-label="Illustrative comparison of NeverBounce and EmailAnswers AI"
      >
        <div className="signal-stage__orbit signal-stage__orbit--one" />
        <div className="signal-stage__orbit signal-stage__orbit--two" />
        <div className="signal-stage__orbit signal-stage__orbit--three" />

        <div className="signal-stage__node signal-stage__node--a" />
        <div className="signal-stage__node signal-stage__node--b" />
        <div className="signal-stage__node signal-stage__node--c" />

        <div className="signal-card signal-card--email">
          <div className="signal-card__top">
            <span className="signal-card__icon">✳</span>
            <span>SAMPLE CATCH-ALL RESULTS</span>
          </div>

          <h2 className="signal-card__address">NeverBounce</h2>

          <div className="signal-compare-row">
            <span>priya@growthloop.com</span>
            <b>Accept-all</b>
          </div>
          <div className="signal-compare-row">
            <span>tom@shiftly.co</span>
            <b>Accept-all</b>
          </div>
          <div className="signal-compare-row">
            <span>nina@corecloud.ai</span>
            <b>Accept-all</b>
          </div>

          <div className="signal-card__wave" aria-hidden="true">
            {Array.from({ length: 34 }, (_, i) => (
              <span
                key={i}
                style={{
                  "--bar": `${12 + ((i * 17) % 37)}px`,
                  "--delay": `${(i % 11) * -0.13}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="signal-core">
          <div className="signal-core__ring" />
          <div className="signal-core__ring signal-core__ring--inner" />
          <div className="signal-core__symbol">✳</div>
          <span className="signal-core__label">AI ANALYSIS</span>
        </div>

        <div className="signal-card signal-card--result">
          <div className="signal-result__heading">EMAILANSWERS AI</div>

          <div className="signal-compare-row">
            <span>priya@growthloop.com</span>
            <b className="signal-result__live">✓ Example result</b>
          </div>
          <div className="signal-compare-row">
            <span>tom@shiftly.co</span>
            <b className="signal-result__live">✓ Example result</b>
          </div>
          <div className="signal-compare-row">
            <span>nina@corecloud.ai</span>
            <b className="signal-result__dont-send">! Review needed</b>
          </div>

          <div className="signal-result__meter">
            <span />
          </div>

          <div className="signal-result__footer">
            <span>ILLUSTRATIVE RESULTS</span>
            <span className="signal-result__live">SIGNAL MAPPED</span>
          </div>
        </div>

        <div className="signal-float signal-float--left">
          <span className="signal-float__dot" />
          CATCH-ALL DETECTED
        </div>

        <div className="signal-float signal-float--right">
          <span>↗</span> CLEARER NEXT STEP
        </div>

        <div className="signal-stage__caption">
          <span>01</span>
          <span>FROM UNCERTAINTY TO CLARITY</span>
          <span className="signal-stage__caption-line" />
        </div>
      </div>
    </section>
  );
}

export default function HeroProblem() {
  const [problemRef, problemVisible] = useReveal();

  return (
    <>
      <SignalLabHero />

      <section
        className="nb-section nb-problem-section"
        id="problem"
        aria-labelledby="nb-problem-title"
        ref={problemRef}
      >
        <div
          className={`nb-problem-inner ${
            problemVisible ? "nb-is-visible" : ""
          }`}
        >
          <div className="nb-problem-heading">
            <p className="nb-eyebrow nb-problem-eyebrow">
              <span className="nb-live-dot" aria-hidden="true" />
              02 · THE CHALLENGE
            </p>

            <h2 id="nb-problem-title">
              <span className="nb-problem-title-main">
                “Proceed with caution”
              </span>
              <span className="nb-problem-title-accent">
                isn't a verdict.
              </span>
            </h2>

            <p className="nb-problem-intro">
              Some email domains are configured to accept messages for
              many addresses, making it difficult to confirm whether one
              specific mailbox exists from a standard verification check
              alone.
            </p>
          </div>

          <SignalGraphic />

          <div className="nb-problem-grid">
            <article className="nb-problem-card">
              <span className="nb-problem-number">01</span>
              <span className="nb-problem-card-line" aria-hidden="true" />
              <h3>Catch-all domains add uncertainty</h3>
              <p>
                A domain may accept mail at the server level without
                confirming that every individual recipient mailbox exists.
              </p>
              <span className="nb-problem-card-arrow" aria-hidden="true">↗</span>
            </article>

            <article className="nb-problem-card">
              <span className="nb-problem-number">02</span>
              <span className="nb-problem-card-line" aria-hidden="true" />
              <h3>A result may not be a clear answer</h3>
              <p>
                Labels such as accept-all, risky, or unknown can leave
                teams unsure how to handle an address in their outreach
                workflow.
              </p>
              <span className="nb-problem-card-arrow" aria-hidden="true">↗</span>
            </article>

            <article className="nb-problem-card">
              <span className="nb-problem-card-line" aria-hidden="true" />
              <span className="nb-problem-number">03</span>
              <h3>Teams need a considered next step</h3>
              <p>
                Rather than treating uncertainty as proof that an address
                is valid or invalid, teams can assess the result alongside
                their data quality and campaign requirements.
              </p>
              <span className="nb-problem-card-arrow" aria-hidden="true">↗</span>
            </article>
          </div>

          <div
            className="nb-stats-grid"
            aria-label="Illustrative campaign statistics"
          >
            <AnimatedStat
              target={10000}
              label="B2B leads bought or enriched for a campaign"
            />
            <AnimatedStat
              target={4000}
              prefix="~"
              label="may return a catch-all result in this illustrative example"
            />
            <AnimatedStat
              target={2800}
              prefix="~"
              suffix="+"
              label="illustrative addresses requiring further assessment"
            />
          </div>
        </div>
      </section>
    </>
  );
}
