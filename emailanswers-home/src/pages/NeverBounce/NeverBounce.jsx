
import Navbar from "../../components/Navbar/Navbar";
import HeroProblem from "./sections/HeroProblem";
import TLDR from "./sections/TLDR";
import Comparison from "./sections/Comparison";
import TeamFitTestimonial from "./sections/TeamFitTestimonial";
import SwitchingCTA from "./sections/SwitchingCTA";
import FAQ from "./sections/FAQ";
import "./NeverBounce.css";
import logo from "../../assets/emailanswers-logo.png";

function PageFooter() {
  return (
    <footer className="nb-footer">
      <div className="nb-footer-hero">
        <h2>
          Know which emails
          <br />
          <span>are worth reaching.</span>
        </h2>

        <a
          className="nb-footer-cta-button"
          href="https://app.emailanswers.ai/signup"
        >
          Get 250 credits <span aria-hidden="true">↗</span>
        </a>
      </div>

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
          <a href="#faq">FAQ</a>
        </div>

        <div className="nb-footer-column">
          <h3>Product</h3>
          <a href="/#product">Features</a>
          <a href="/#how">How it works</a>
          <a href="#pricing">Pricing</a>
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

export default function NeverBounce() {
  return (
    <div className="nb-page" id="top">
      <Navbar variant="comparison" />

      <main className="nb-main">
        {/* Person 1: Hero + problem */}
        <HeroProblem />

        {/* Person 2: TL;DR + sticky sidebar */}
        <TLDR />

        {/* Person 3: Feature comparison */}
        <Comparison />

        {/* Person 4: Team fit + testimonial */}
        <div id="fair">
          <TeamFitTestimonial />
        </div>

        {/* Person 5: Switching guide + final CTA */}
        <SwitchingCTA />

        {/* Person 6: FAQs */}
        <FAQ />
      </main>

      <PageFooter />
    </div>
  );
}
