
import "./Footer.css";
import logo from "../../assets/emailanswers-logo.png";

function Footer() {
  const companyLinks = [
    { name: "About us", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "FAQ", href: "#faq" },
  ];

  const productLinks = [
    { name: "Features", href: "#product" },
    { name: "How it works", href: "#how" },
    { name: "Pricing", href: "#pricing" },
  ];

  const resourceLinks = [
    {
      name: "NeverBounce",
      href: "/alternatives/neverbounce",
    },
  ];

  const linkGroups = [
    { title: "Company", links: companyLinks },
    { title: "Product", links: productLinks },
    { title: "Resources", links: resourceLinks },
  ];

  return (
    <footer className="ea-footer" id="footer">
      <div className="ea-footer-card">
        {/* Top CTA */}
        <div className="ea-footer-cta">
          <div className="ea-footer-cta-content">
            <span className="ea-footer-eyebrow">
              EMAIL VERIFICATION, REIMAGINED
            </span>

            <h2>
              Make every email
              <br />
              <span>count.</span>
            </h2>
          </div>

          <a href="/signup" className="ea-footer-cta-button">
            Get 250 credits
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Animated Background Wordmark */}
        <div className="ea-footer-marquee" aria-hidden="true">
          <div className="ea-footer-marquee-track">
            <span>EmailAnswers AI</span>
            <span>EmailAnswers AI</span>
          </div>
        </div>

        <div className="ea-footer-divider" />

        {/* Footer Main Content */}
        <div className="ea-footer-main">
          {/* Brand Logo */}
          <div className="ea-footer-brand">
            <a
              href="/"
              className="ea-footer-logo"
              aria-label="EmailAnswers AI home"
            >
              <img
                src={logo}
                alt="EmailAnswers AI"
                className="ea-footer-logo-image"
              />
            </a>

            <p>
              Smarter email verification.
              <br />
              Better answers for every address.
            </p>
          </div>

          {/* Navigation */}
          {linkGroups.map((group) => (
            <div className="ea-footer-column" key={group.title}>
              <h3>{group.title}</h3>

              <ul>
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href}>
                      {link.name}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ea-footer-divider" />

        {/* Footer Bottom */}
        <div className="ea-footer-bottom">
          <p>
            © {new Date().getFullYear()} EmailAnswers AI.
            All rights reserved.
          </p>

          <button
            type="button"
            className="ea-footer-back-top"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
