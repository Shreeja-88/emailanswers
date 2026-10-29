import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FAQ.css";

const faqs = [
  {
    question: "What is NeverBounce?",
    answer:
      "NeverBounce is an email verification service that helps businesses identify invalid, risky, and undeliverable email addresses before sending campaigns.",
  },
  {
    question: "Why consider an alternative to NeverBounce?",
    answer:
      "Teams may explore alternatives based on their verification workflow, pricing, integrations, scalability, or reporting requirements. The best option depends on your team's needs.",
  },
  {
    question: "How does EmailAnswers AI verify email addresses?",
    answer:
      "EmailAnswers AI helps users check email addresses and understand verification results. Review the product documentation for the exact checks and supported workflows.",
  },
  {
    question: "Can I verify email addresses in bulk?",
    answer:
      "Bulk verification availability depends on the plan and features supported by the service. Check the current EmailAnswers AI product details for the available options.",
  },
  {
    question: "Is email verification 100% accurate?",
    answer:
      "No email verification service can guarantee perfect accuracy. Mail servers, temporary failures, and privacy protections can affect verification results.",
  },
  {
    question: "How do I choose the right email verification tool?",
    answer:
      "Compare verification quality, speed, pricing, API support, integrations, data handling, and ease of use. Choose the service that best matches your team's workflow.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="nb-faq" id="faq">

        {/* Animated orange background */}
        <div className="nb-faq-background" aria-hidden="true">
            <div className="nb-faq-glow nb-faq-glow-one" />
            <div className="nb-faq-glow nb-faq-glow-two" />
            <div className="nb-faq-glow nb-faq-glow-three" />
        </div>
      <div className="nb-faq-container">

        <motion.div
          className="nb-faq-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="nb-faq-label">
            GOT QUESTIONS?
          </span>

          <h2>
            Frequently asked <span>questions.</span>
          </h2>

          <p>
            Everything you need to know before choosing
            your email verification solution.
          </p>
        </motion.div>

        <div className="nb-faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                className={`nb-faq-item ${isOpen ? "active" : ""}`}
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
              >
                <button
                  type="button"
                  className="nb-faq-question"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                >
                  <span className="nb-faq-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="nb-faq-question-text">
                    {faq.question}
                  </span>

                  <motion.span
                    className="nb-faq-icon"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    aria-hidden="true"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="nb-faq-answer-wrapper"
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: {
                          duration: 0.35,
                          ease: "easeInOut",
                        },
                        opacity: { duration: 0.25 },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="nb-faq-answer">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="nb-faq-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>Still have questions?</p>
          <a href="#contact">
            Talk to our team <span aria-hidden="true">↗</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}

export default FAQ;
