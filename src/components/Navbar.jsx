import { useEffect, useState } from "react";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Explore", href: "#explore" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
];

const NAVBAR_OFFSET_REM = 4;

function PlayMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 4.5c0-.9.98-1.45 1.75-.99l11 6.5a1.15 1.15 0 0 1 0 1.98l-11 6.5C7.98 19.45 7 18.9 7 18V4.5Z" />
    </svg>
  );
}

function scrollToSection(event, href) {
  const targetId = href.replace("#", "");
  const target = document.getElementById(targetId);
  if (!target) return;

  event.preventDefault();

  const navbarOffsetPx =
    NAVBAR_OFFSET_REM *
    parseFloat(getComputedStyle(document.documentElement).fontSize);
  const top =
    target.getBoundingClientRect().top + window.scrollY - navbarOffsetPx;

  window.scrollTo({ top, behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleLinkClick = (e, href) => scrollToSection(e, href);

  const handleMobileLinkClick = (e, href) => {
    scrollToSection(e, href);
    setMenuOpen(false);
  };

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <nav aria-label="Main" className="navbar__inner">
        <a
          href="#home"
          className="navbar__logo"
          onClick={(e) => handleLinkClick(e, "#home")}
        >
          <PlayMark className="navbar__logo-icon" />
          SenPlay
        </a>

        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="navbar__link"
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar__cta">
          <a
            href="#download"
            className="navbar__cta-button"
            onClick={(e) => handleLinkClick(e, "#download")}
          >
            Download
          </a>
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="navbar__menu-button"
        >
          <span className="navbar__burger" aria-hidden="true">
            <span className="navbar__burger-line navbar__burger-line--top" />
            <span className="navbar__burger-line navbar__burger-line--middle" />
            <span className="navbar__burger-line navbar__burger-line--bottom" />
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`navbar__mobile-menu${menuOpen ? " navbar__mobile-menu--open" : ""}`}
      >
        <ul className="navbar__mobile-list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleMobileLinkClick(e, link.href)}
                className="navbar__mobile-link"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="navbar__mobile-cta-wrap">
            <a
              href="#download"
              onClick={(e) => handleMobileLinkClick(e, "#download")}
              className="navbar__mobile-cta"
            >
              Download
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
