import { useCallback, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import {
  ABOUT_ROUTE,
  API_DOCS_ROUTE,
  DISCORD_URL,
  SUPPORT_URL,
} from "../config/SidebarLinks";

// ---------------------------------------------------------------------------
// Icons — mengikuti pola project (inline SVG buatan sendiri), tidak
// menambah dependency icon library baru.
// ---------------------------------------------------------------------------
function IconLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="6"
        fill="currentColor"
        opacity="0.12"
      />
      <rect x="6" y="13" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="10.5" y="8" width="3" height="11" rx="1" fill="currentColor" />
      <rect x="15" y="10.5" width="3" height="8.5" rx="1" fill="currentColor" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  );
}

function IconDiscord() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8.5 3.5c-1.9.3-3.7 1-5.2 2C1.6 8.6 1 12.4 1.3 16.1c1.7 1.3 3.6 2.2 5.6 2.8.4-.6.8-1.3 1.1-2-.6-.2-1.2-.5-1.7-.9.1-.1.3-.2.4-.3 3.4 1.6 7.1 1.6 10.5 0 .1.1.3.2.4.3-.5.4-1.1.7-1.7.9.3.7.7 1.4 1.1 2 2-.6 3.9-1.5 5.6-2.8.4-4.4-.8-8.1-2.9-11.6-1.5-1-3.3-1.7-5.2-2l-.3.7c1.6.3 3 .9 4.3 1.6-2.7-1.4-5.7-2.1-8.9-2.1s-6.2.7-8.9 2.1c1.3-.8 2.7-1.4 4.3-1.6z" />
      <circle cx="8.5" cy="12.5" r="1.6" />
      <circle cx="15.5" cy="12.5" r="1.6" />
    </svg>
  );
}

function IconHeartHandshake() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 20.5s-7-4.4-9.3-8.8C1.4 9 2.5 5.8 5.5 5c2-.5 3.7.3 4.9 1.8L12 8.5l1.6-1.7C14.8 5.3 16.5 4.5 18.5 5c3 .8 4.1 4 2.8 6.7C19 16.1 12 20.5 12 20.5z" />
    </svg>
  );
}

function IconTerminal() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="m7.5 9.5 3 3-3 3" />
      <path d="M13 15.5h4" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Reusable pieces — SidebarSection & SidebarItem.
// SidebarItem menerima "external" untuk membedakan link keluar (Discord,
// Support -> <a> biasa) dari route internal (-> <NavLink> react-router).
// ---------------------------------------------------------------------------
function SidebarSection({ label, children }) {
  return (
    <div className="sidebar__section">
      <p className="sidebar__section-label">{label}</p>
      <ul className="sidebar__section-list">{children}</ul>
    </div>
  );
}

function SidebarItem({ icon, label, href, external = false, onNavigate }) {
  const content = (
    <>
      <span className="sidebar__item-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="sidebar__item-label">{label}</span>
    </>
  );

  if (external) {
    return (
      <li>
        <a href={href} className="sidebar__item" onClick={onNavigate}>
          {content}
        </a>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={href}
        end
        className={({ isActive }) =>
          "sidebar__item" + (isActive ? " sidebar__item--active" : "")
        }
        onClick={onNavigate}
      >
        {content}
      </NavLink>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Sidebar — dirender sekali secara global (lihat App.jsx). Active state
// sekarang ditentukan react-router sendiri lewat NavLink, jadi tidak
// perlu prop currentPath lagi.
// ---------------------------------------------------------------------------
export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((prev) => !prev), []);

  // Kunci scroll body saat drawer mobile terbuka + tutup dengan Escape.
  useEffect(() => {
    if (!isMobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileOpen, closeMobile]);

  // Tutup drawer otomatis kalau layar diperbesar melewati breakpoint mobile.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 900px)");
    const handleChange = (event) => {
      if (event.matches) closeMobile();
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [closeMobile]);

  const navigationContent = (
    <>
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">
          <IconLogo />
        </span>
        <span className="sidebar__brand-name">SenPlay</span>
      </div>

      <nav className="sidebar__nav" aria-label="Navigasi utama SenPlay">
        <SidebarSection label="Account">
          <SidebarItem
            icon={<IconUser />}
            label="My Profile"
            href={ABOUT_ROUTE}
            onNavigate={closeMobile}
          />
        </SidebarSection>

        <SidebarSection label="Community">
          <SidebarItem
            icon={<IconDiscord />}
            label="Discord"
            href={DISCORD_URL}
            external
            onNavigate={closeMobile}
          />
          <SidebarItem
            icon={<IconHeartHandshake />}
            label="Support SenPlay"
            href={SUPPORT_URL}
            external
            onNavigate={closeMobile}
          />
        </SidebarSection>

        <SidebarSection label="Developer">
          <SidebarItem
            icon={<IconTerminal />}
            label="API Docs"
            href={API_DOCS_ROUTE}
            onNavigate={closeMobile}
          />
        </SidebarSection>
      </nav>

      <div className="sidebar__footer">
        <p className="sidebar__footer-text">SENP4II Universe</p>
      </div>
    </>
  );

  return (
    <>
      <div className="sidebar__topbar">
        <button
          type="button"
          className="sidebar__menu-btn"
          onClick={toggleMobile}
          aria-label={isMobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMobileOpen}
          aria-controls="senplay-sidebar-drawer"
        >
          {isMobileOpen ? <IconClose /> : <IconMenu />}
        </button>
        <Link to="/" className="sidebar__topbar-brand" onClick={closeMobile}>
          <IconLogo />
          <span>SenPlay</span>
        </Link>
      </div>

      <aside className="sidebar sidebar--desktop" aria-label="Sidebar SenPlay">
        {navigationContent}
      </aside>

      <div
        className={
          "sidebar__scrim" + (isMobileOpen ? " sidebar__scrim--visible" : "")
        }
        onClick={closeMobile}
        aria-hidden="true"
      />

      <aside
        id="senplay-sidebar-drawer"
        className={
          "sidebar sidebar--drawer" + (isMobileOpen ? " sidebar--open" : "")
        }
        aria-label="Sidebar SenPlay"
        aria-hidden={!isMobileOpen}
      >
        {navigationContent}
      </aside>
    </>
  );
}
