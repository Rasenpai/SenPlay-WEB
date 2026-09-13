import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import AnimeApi from "./components/Api/AnimeApi";
import SEO from "./components/SEO";
import {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  websiteJsonLd,
} from "./lib/seo-config";
import KomikApi from "./components/Api/KomikApi";
import DonghuaApi from "./components/Api/DonghuaApi";
import Index from "./components/Index";
import Docs from "./components/Docs";
import About from "./components/About";
import Showcase from "./components/Showcase";
import Sidebar from "./components/Sidebar";
import NotFound from "./components/NotFound";

const NAVBAR_OFFSET_REM = 4;

function scrollToHash(hash) {
  if (!hash) return;
  const id = hash.replace("#", "");
  const target = document.getElementById(id);
  if (!target) return;

  const navbarOffsetPx =
    NAVBAR_OFFSET_REM *
    parseFloat(getComputedStyle(document.documentElement).fontSize);
  const top =
    target.getBoundingClientRect().top + window.scrollY - navbarOffsetPx;
  window.scrollTo({ top, behavior: "smooth" });
}

function HomePage() {
  return (
    <>
      <SEO
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        path="/"
        jsonLd={websiteJsonLd}
      />
      <main>
        <Index />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const timer = setTimeout(() => scrollToHash(location.hash), 50);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="senplay-shell">
      {isHome && <Sidebar />}
      <div
        className={`senplay-shell__main${isHome ? " senplay-shell__main--with-sidebar" : ""}`}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime" element={<AnimeApi />} />
          <Route path="/komik" element={<KomikApi />} />
          <Route path="/donghua" element={<DonghuaApi />} />
          <Route path="/documentation" element={<Docs />} />
          <Route path="/about" element={<About />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
