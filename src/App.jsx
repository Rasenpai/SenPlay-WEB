import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MadeForWatching from "./components/MadeForWatching";
import ContentSection from "./components/ContentSection";
import DownloadSection from "./components/DownloadSection";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import TermsOfService from "./components/TermsOfService";
import AnimeApi from "./components/Api/AnimeApi";
import SEO from "./components/SEO";
import {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  websiteJsonLd,
} from "./lib/seo-config";
import KomikApi from "./components/Api/KomikApi";

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

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (path === "/" && window.location.hash) {
      const timer = setTimeout(() => scrollToHash(window.location.hash), 50);
      return () => clearTimeout(timer);
    }
  }, [path]);

  if (path === "/terms") {
    return <TermsOfService />;
  }

  if (path === "/anime") {
    return <AnimeApi />;
  }

  if (path === "/komik") {
    return <KomikApi />;
  }

  return (
    <>
      <SEO
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        path="/"
        jsonLd={websiteJsonLd}
      />
      <Navbar />
      <main>
        <Hero />
        <MadeForWatching />
        <ContentSection />
        <DownloadSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
