import { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/emailanswers-logo.png";

const navLinks = [
  { name: "How it works", href: "#how" },
  { name: "Product", href: "#product" },
  { name: "For agencies", href: "#agencies" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu when Escape is pressed.
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Prevent background scrolling while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar" id="top">
      <nav className="navbar-inner" aria-label="Main navigation">

        {/* Brand */}
        <a href="/" className="navbar-brand" aria-label="EmailAnswers AI home">
          <img
            src={logo}
            alt=""
            className="navbar-logo"
            aria-hidden="true"
          />

          <span className="brand-name">
            EmailAnswers<span className="brand-ai">AI</span>
          </span>
        </a>


        {/* Desktop Navigation */}
        <div className="navbar-content">
          <div className="navbar-links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="navbar-link"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            <a href="/login" className="navbar-login">
              Login
            </a>

            <a href="/signup" className="navbar-cta">
              Get 250 credits <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className={`navbar-menu-toggle ${
            menuOpen ? "is-open" : ""
          }`}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation */}
        <div
          id="mobile-navigation"
          className={`navbar-mobile ${
            menuOpen ? "is-open" : ""
          }`}
          inert={!menuOpen}
        >
          <div className="navbar-mobile-links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="navbar-mobile-link"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.name}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>

          <div className="navbar-mobile-actions">
            <a
              href="/login"
              className="navbar-mobile-login"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              Login
            </a>

            <a
              href="/signup"
              className="navbar-mobile-cta"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              Get 250 credits <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

      </nav>
    </header>
  );
}

export default Navbar;
