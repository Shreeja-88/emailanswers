import { useEffect, useState } from "react";
import "./Navbar.css";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Product", href: "#products" },
  { label: "For agencies", href: "#agencies" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header
      className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
    >
      <nav className="navbar-inner" aria-label="Main navigation">

        {/* Brand */}
        <a
          href="#"
          className="navbar-brand"
          aria-label="EmailAnswers AI home"
          onClick={closeMenu}
        >
          <span className="brand-name">
            EmailAnswers
            <span className="brand-ai"> AI</span>
          </span>
        </a>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`navbar-toggle ${menuOpen ? "active" : ""}`}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Navigation */}
        <div
          id="primary-navigation"
          className={`navbar-content ${menuOpen ? "menu-active" : ""}`}
        >
          <div className="navbar-links">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="navbar-link"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            <a
              href="/login"
              className="navbar-login"
              onClick={closeMenu}
            >
              Login
            </a>

            <a
              href="/"
              className="navbar-cta"
              onClick={closeMenu}
            >
              Get 250 credits
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>

      </nav>
    </header>
  );
}

export default Navbar;