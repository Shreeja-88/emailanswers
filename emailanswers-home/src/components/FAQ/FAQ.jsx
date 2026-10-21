import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FAQ.css";

gsap.registerPlugin(ScrollTrigger);

const categories = ["All Topics", "Tech & Catch-All", "Security & Billing"];

const faqs = [
  {
    category: "Tech & Catch-All",
    question: "What is a catch-all email?",
    answer: "A catch-all domain accepts mail for any address, real or not. Standard SMTP checks always get a 'yes', so most verifiers can’t tell you whether the person actually exists and label it unknown or risky.",
  },
  {
    category: "Tech & Catch-All",
    question: "How is EmailAnswers different from NeverBounce?",
    answer: "They verify standard addresses well, but stop at catch-alls. EmailAnswers AI goes further and resolves catch-all and risky addresses into a clear deliverable or undeliverable verdict, so you don't discard leads you paid for.",
  },
  {
    category: "Tech & Catch-All",
    question: "Is the single email checker really free?",
    answer: "Yes! You can run instant single-email verifications directly on our platform at zero cost to test our catch-all resolution accuracy before upgrading.",
  },
  {
    category: "Tech & Catch-All",
    question: "How do you verify a catch-all address?",
    answer: "Every verdict is backed by multiple proprietary signals beyond the basic SMTP handshake, ensuring your cleaned lists run consistently under a 2% bounce rate.",
  },
  {
    category: "Security & Billing",
    question: "Do credits expire?",
    answer: "No, your verification credits never expire. Buy what you need when you need it and use them at your own pace across your campaigns.",
  },
  {
    category: "Security & Billing",
    question: "Is my data safe?",
    answer: "Data is encrypted in transit and at rest, never shared or resold, and handled strictly in line with GDPR standards.",
  },
];

function FAQ() {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [activeIndices, setActiveIndices] = useState({ left: null, right: null });
  const [feedbackState, setFeedbackState] = useState({});

  // Filter logic based on category selection
  const filteredFaqs = faqs.filter((item) => {
    return activeCategory === "All Topics" || item.category === activeCategory;
  });

  // Split filtered into Left and Right columns (3 & 3)
  const leftFaqs = filteredFaqs.filter((_, idx) => idx % 2 === 0);
  const rightFaqs = filteredFaqs.filter((_, idx) => idx % 2 !== 0);

  // Inject JSON-LD FAQ Schema for SEO
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Cinematic GSAP Scroll Animations & Timeline
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

        tl.from(".faq-pill-badge", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" })
          .from(".faq-title-main", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
          .from(".faq-subtitle-main", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
          .from(".faq-category-pills", { y: 15, opacity: 0, duration: 0.5 }, "-=0.3")
          .from(".faq-neon-hero-art", { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.6");

        gsap.from(".faq-column-box", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".faq-split-grid",
            start: "top 80%",
            once: true,
          },
        });

        // Continuous floating motion
        gsap.to(".faq-neon-hero-art", {
          y: -12,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".faq-glow-orb", {
          scale: 1.25,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      return () => motion.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Interactive 3D Mouse Parallax Tilt on Neon Art
  const handleMouseMove = (e) => {
    const art = document.querySelector(".faq-neon-hero-art");
    if (!art) return;
    const rect = art.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(art, {
      rotationY: x * 0.05,
      rotationX: -y * 0.05,
      ease: "power2.out",
      duration: 0.5,
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = () => {
    const art = document.querySelector(".faq-neon-hero-art");
    if (!art) return;
    gsap.to(art, {
      rotationY: 0,
      rotationX: 0,
      ease: "power3.out",
      duration: 0.8,
    });
  };

  const toggleFAQ = (column, index) => {
    setActiveIndices((prev) => ({
      ...prev,
      [column]: prev[column] === index ? null : index,
    }));
  };

  const handleFeedback = (id, val) => {
    setFeedbackState((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <section className="faq-section-wrapper" id="faq" ref={sectionRef}>
      {/* Background Atmosphere */}
      <div className="faq-bg-atmosphere" aria-hidden="true">
        <div className="faq-cyber-grid" />
        <div className="faq-glow-orb orb-1" />
        <div className="faq-glow-orb orb-2" />
      </div>

      <div className="faq-main-container">
        {/* Modern Hero Header with 3D Mouse Parallax Neon Art */}
        <header
          className="faq-header-hero"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="faq-header-content">
            <div className="faq-pill-badge">
              <span className="dot" /> FAQ
            </div>
            <h2 className="faq-title-main">
              Your questions?
              <br />
              <span>Solved instantly.</span>
            </h2>
            <p className="faq-subtitle-main">
              Everything you need to know about catch-all credits, data security, and protecting your sender reputation.
            </p>

            {/* Category Filter Pills */}
            <div className="faq-category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`pill-btn ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Code-Built Neon Question Mark Graphic */}
          <div className="faq-neon-hero-art">
            <div className="cyber-ring ring-outer" />
            <div className="cyber-ring ring-inner" />
            <div className="spark s1" />
            <div className="spark s2" />
            <div className="spark s3" />
            
            <div className="custom-neon-q-container">
              <svg className="neon-svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.09 9C9.3251 8.33167 9.78914 7.76811 10.4009 7.40913C11.0127 7.05015 11.7351 6.91942 12.4336 7.03873C13.132 7.15804 13.7634 7.51928 14.2127 8.06243C14.6621 8.60558 14.9002 9.29749 14.9 10C14.9 12 11.9 13 11.9 15M12 19H12.01"
                  stroke="#ff6b35"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="neon-core-glow" />
            </div>
          </div>
        </header>

        {/* Split 3 & 3 Accordion Grid */}
        <div className="faq-split-grid">
          {/* Left Column (3 items) */}
          <div className="faq-column-box">
            {leftFaqs.length === 0 ? (
              <p className="no-results">No matching questions in this category.</p>
            ) : (
              leftFaqs.map((item, index) => {
                const isOpen = activeIndices.left === index;
                const uniqueId = `left-${index}`;
                return (
                  <div className={`faq-row-item ${isOpen ? "open" : ""}`} key={index}>
                    <button
                      className="faq-question-trigger"
                      type="button"
                      onClick={() => toggleFAQ("left", index)}
                      aria-expanded={isOpen}
                    >
                      <span className="q-text">{item.question}</span>
                      <span className="plus-icon">{isOpen ? "−" : "+"}</span>
                    </button>

                    <div className="faq-answer-container">
                      <div className="faq-answer-body">
                        <p>{item.answer}</p>
                        <div className="faq-feedback-widget">
                          <span>Was this helpful?</span>
                          {feedbackState[uniqueId] ? (
                            <span className="feedback-thanks">✓ Thanks!</span>
                          ) : (
                            <div className="feedback-btns">
                              <button onClick={() => handleFeedback(uniqueId, "yes")}> ✔ Yes</button>
                              <button onClick={() => handleFeedback(uniqueId, "no")}>✘ No</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column (3 items) */}
          <div className="faq-column-box">
            {rightFaqs.length === 0 ? (
              <p className="no-results">No matching questions in this category.</p>
            ) : (
              rightFaqs.map((item, index) => {
                const isOpen = activeIndices.right === index;
                const uniqueId = `right-${index}`;
                return (
                  <div className={`faq-row-item ${isOpen ? "open" : ""}`} key={index}>
                    <button
                      className="faq-question-trigger"
                      type="button"
                      onClick={() => toggleFAQ("right", index)}
                      aria-expanded={isOpen}
                    >
                      <span className="q-text">{item.question}</span>
                      <span className="plus-icon">{isOpen ? "−" : "+"}</span>
                    </button>

                    <div className="faq-answer-container">
                      <div className="faq-answer-body">
                        <p>{item.answer}</p>
                        <div className="faq-feedback-widget">
                          <span>Was this helpful?</span>
                          {feedbackState[uniqueId] ? (
                            <span className="feedback-thanks">✓ Thanks!</span>
                          ) : (
                            <div className="feedback-btns">
                              <button onClick={() => handleFeedback(uniqueId, "yes")}> ✔ Yes</button>
                              <button onClick={() => handleFeedback(uniqueId, "no")}>✘ No</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="faq-support-bar">
          <div className="support-info">
            <span className="terminal-dot" />
            <span>Have custom enterprise or technical inquiries?</span>
          </div>
          <a href="mailto:support@emailanswers.ai" className="support-cta-btn">
            Contact Support ↗
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQ;