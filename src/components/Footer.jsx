import { Link } from "react-router-dom";
import "../styles/Footer.css";
import {
  ABOUT_ROUTE,
  API_DOCS_ROUTE,
  DISCORD_URL,
  SUPPORT_URL,
} from "../config/SidebarLinks";

// Sama seperti daftar menu di Sidebar — internal pakai react-router <Link>,
// eksternal (Discord, Support) pakai <a> biasa dengan target blank.
const footerLinks = [
  { label: "My Profile", href: ABOUT_ROUTE, external: false },
  { label: "API Docs", href: API_DOCS_ROUTE, external: false },
  { label: "Discord", href: DISCORD_URL, external: true },
  { label: "Support SenPlay", href: SUPPORT_URL, external: true },
];

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
              {footerLinks.map((link) =>
                link.external ? (
                  <li key={link.href}>
                    <a href={link.href} className="footer__nav-link">
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link to={link.href} className="footer__nav-link">
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        <div className="footer__divider" role="presentation" />

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} SenPlay. All rights reserved.
          </p>
          <Link to="/terms" className="footer__legal-link">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
