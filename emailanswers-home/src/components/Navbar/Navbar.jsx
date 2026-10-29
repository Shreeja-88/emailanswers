
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/emailanswers-logo.png";

const homeNavLinks = [
  { name: "How it works", href: "/#how" },
  { name: "Product", href: "/#product" },
  { name: "For agencies", href: "/#agencies" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
  { name: "Compare", href: "/alternatives/neverbounce" },
];

const comparisonNavLinks = [
  { name: "How it works", href: "#how" },
  { name: "Product", href: "#product" },
  { name: "Compare", href: "#compare" },
  { name: "For agencies", href: "#agencies" },
  { name: "Pricing", href: "#pricing" },
  { name: "Team fit", href: "#fair" },
  { name: "Switch", href: "#switch" },
  { name: "FAQ", href: "#faq" },
];

function Navbar({ variant = "default" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isComparison = variant === "comparison";
  const navLinks = isComparison
    ? comparisonNavLinks
    : homeNavLinks;

  // Scroll to the requested section after route navigation.
  useEffect(() => {
    if (!location.hash) return;

    const sectionId = decodeURIComponent(
      location.hash.slice(1)
    );

    let attempts = 0;
    let timeoutId;

    const scrollToSection = () => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      // Retry briefly while page sections are mounting.
      if (attempts < 10) {
        attempts += 1;
        timeoutId = setTimeout(scrollToSection, 100);
      }
    };

    requestAnimationFrame(scrollToSection);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [location.pathname, location.hash]);

  // Close the mobile menu when pressing Escape.
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

  const renderNavLink = (link, mobile = false) => {
    const className = mobile
      ? "navbar-mobile-link"
      : "navbar-link";

    const commonProps = {
      className,
      onClick: mobile ? closeMenu : undefined,
      ...(mobile ? { tabIndex: menuOpen ? 0 : -1 } : {}),
    };

    const content = (
      <>
        {link.name}
        {mobile && (
          <span aria-hidden="true">↗</span>
        )}
      </>
    );

    // Same-page section links.
    if (link.href.startsWith("#")) {
      return (
        <a
          key={link.name}
          href={link.href}
          {...commonProps}
        >
          {content}
        </a>
      );
    }

    // Internal React Router navigation.
    return (
      <Link
        key={link.name}
        to={link.href}
        {...commonProps}
      >
        {content}
      </Link>
    );
  };

  return (
    <header className="navbar" id="top">
      <nav
        className="navbar-inner"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          to="/"
          className="navbar-brand"
          aria-label="EmailAnswers AI home"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt=""
            className="navbar-logo"
            aria-hidden="true"
          />

          <span className="brand-name">
            EmailAnswers
            <span className="brand-ai">AI</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="navbar-content">
          <div className="navbar-links">
            {navLinks.map((link) =>
              renderNavLink(link)
            )}
          </div>

          <div className="navbar-actions">
            {!isComparison && (
              <a
                href="https://app.emailanswers.ai/login"
                className="navbar-login"
              >
                Login
              </a>
            )}

            <a
              href="https://app.emailanswers.ai/signup"
              className="navbar-cta"
            >
              {isComparison
                ? "Get 250 credits"
                : "Verify 100 emails free"}
              {" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`navbar-menu-toggle ${
            menuOpen ? "is-open" : ""
          }`}
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
        >
          <span />
          <span />
          <span />
        </button>

        {/* Mobile navigation */}
        <div
          id="mobile-navigation"
          className={`navbar-mobile ${
            menuOpen ? "is-open" : ""
          }`}
          inert={!menuOpen}
        >
          <div className="navbar-mobile-links">
            {navLinks.map((link) =>
              renderNavLink(link, true)
            )}
          </div>

          <div className="navbar-mobile-actions">
            {!isComparison && (
              <a
                href="https://app.emailanswers.ai/login"
                className="navbar-mobile-login"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                Login
              </a>
            )}

            <a
              href="https://app.emailanswers.ai/signup"
              className="navbar-mobile-cta"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              {isComparison
                ? "Get 250 credits"
                : "Verify 100 emails free"}
              {" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
