import "./Footer.css";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Explore", href: "#explore" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
];

const NAVBAR_OFFSET_REM = 4;

function scrollToSection(event, href) {
  const targetId = href.replace("#", "");
  const target = document.getElementById(targetId);

  if (target) {
    event.preventDefault();
    const navbarOffsetPx =
      NAVBAR_OFFSET_REM *
      parseFloat(getComputedStyle(document.documentElement).fontSize);
    const top =
      target.getBoundingClientRect().top + window.scrollY - navbarOffsetPx;
    window.scrollTo({ top, behavior: "smooth" });
    return;
  }

  // Section isn't on this page (e.g. viewing /terms) — go back to the homepage section.
  event.preventDefault();
  window.location.href = `/${href}`;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <p className="footer__logo">
              <span aria-hidden="true">▶</span> SenPlay
            </p>
            <p className="footer__tagline">Entertainment, in one place.</p>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <ul className="footer__nav-list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="footer__nav-link"
                    onClick={(e) => scrollToSection(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__divider" role="presentation" />

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} SenPlay. All rights reserved.
          </p>
          <a href="/terms" className="footer__legal-link">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
