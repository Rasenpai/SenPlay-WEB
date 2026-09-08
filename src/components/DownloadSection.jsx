import { useEffect, useRef, useState } from "react";
import "./DownloadSection.css";

// Replace with the actual SenPlay APK download URL.
const downloadUrl =
  "https://expo.dev/artifacts/eas/PhkYGdbIiiUiRr7s6Ttq4PFagEJiWyx3gnS7YI9Xn3M.apk";

function AndroidIcon() {
  return (
    <svg
      className="dl__button-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M17.523 15.34c-.5 0-.906-.406-.906-.906s.406-.906.906-.906.906.406.906.906-.406.906-.906.906zm-11.046 0c-.5 0-.906-.406-.906-.906s.406-.906.906-.906.906.406.906.906-.406.906-.906.906zm11.404-6.02l1.548-2.682a.32.32 0 0 0-.117-.437.32.32 0 0 0-.437.117l-1.567 2.715a9.53 9.53 0 0 0-3.808-.77c-1.386 0-2.678.279-3.808.77L7.125 6.318a.32.32 0 0 0-.437-.117.32.32 0 0 0-.117.437l1.548 2.682C6.02 10.6 4.5 12.72 4.5 15.17h15c0-2.45-1.52-4.57-3.619-5.85zM9 12.7a.72.72 0 1 1 0-1.44.72.72 0 0 1 0 1.44zm6 0a.72.72 0 1 1 0-1.44.72.72 0 0 1 0 1.44zM4.5 16.34v4.32c0 .55.45 1 1 1h1v2.16c0 .65.53 1.18 1.18 1.18s1.18-.53 1.18-1.18v-2.16h2.28v2.16c0 .65.53 1.18 1.18 1.18s1.18-.53 1.18-1.18v-2.16h1.18v2.16c0 .65.53 1.18 1.18 1.18s1.18-.53 1.18-1.18v-2.16h1c.55 0 1-.45 1-1v-4.32h-15z"
      />
    </svg>
  );
}

export default function DownloadSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <section
      id="download"
      ref={sectionRef}
      className={`dl${visible ? " dl--visible" : ""}`}
      aria-labelledby="download-heading"
    >
      <div className="dl__container">
        <p className="dl__eyebrow">GET SENPLAY</p>
        <h2 id="download-heading" className="dl__heading">
          Ready to start watching?
        </h2>
        <p className="dl__description">
          Get SenPlay and keep your entertainment in one place.
        </p>

        <div className="dl__cta">
          <a
            href={downloadUrl}
            className="dl__button"
            aria-label="Download SenPlay for Android"
          >
            <AndroidIcon />
            <span>Download SenPlay</span>
          </a>
        </div>

        <p className="dl__meta">Android · APK</p>
      </div>
    </section>
  );
}
