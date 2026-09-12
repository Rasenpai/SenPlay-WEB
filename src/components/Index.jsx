import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Home.css";

// ---------------------------------------------------------------------------
// Waktu -> sapaan. 05:00–10:59 Pagi, 11:00–14:59 Siang, 15:00–17:59 Sore,
// selain itu (18:00–04:59) Malam. Dihitung sekali saat halaman dibuka.
// ---------------------------------------------------------------------------
function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "Pagi";
  if (hour >= 11 && hour < 15) return "Siang";
  if (hour >= 15 && hour < 18) return "Sore";
  return "Malam";
}

// ---------------------------------------------------------------------------
// Icons untuk CTA buttons — outline style, ukuran & stroke konsisten.
// ---------------------------------------------------------------------------
function IconAnime() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 8.5 5 4h14l2 4.5" />
      <rect x="3" y="8.5" width="18" height="11.5" rx="1.5" />
      <path d="m7 4 2 4.5M13 4l2 4.5M17 4l2 4.5" />
    </svg>
  );
}

function IconKomik() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5z" />
    </svg>
  );
}

function IconDonghua() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" />
      <path d="M19 15.5 19.8 17.5 21.5 18.3 19.8 19.1 19 21 18.2 19.1 16.5 18.3 18.2 17.5z" />
    </svg>
  );
}

function IconSenPlay() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5z" />
    </svg>
  );
}

const TYPING_SPEED_MS = 70;
const DELETING_SPEED_MS = 35;
const HOLD_DURATION_MS = 1900;
const GAP_DURATION_MS = 350;

// ---------------------------------------------------------------------------
// Loop type→hold→delete→next, dengan satu setTimeout aktif per render dan
// dibersihkan lewat cleanup useEffect, jadi tidak ada timer yang menumpuk.
// ---------------------------------------------------------------------------
function useTypingLoop(texts) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (texts.length === 0) return undefined;
    const currentFullText = texts[textIndex % texts.length];

    // Reduced motion: tampilkan teks penuh, jeda, lalu ganti tanpa animasi ketik/hapus.
    if (reducedMotionRef.current) {
      setDisplayText(currentFullText);
      const timeoutId = setTimeout(() => {
        setTextIndex((i) => (i + 1) % texts.length);
      }, HOLD_DURATION_MS);
      return () => clearTimeout(timeoutId);
    }

    let timeoutId;

    if (!isDeleting && displayText === currentFullText) {
      timeoutId = setTimeout(() => setIsDeleting(true), HOLD_DURATION_MS);
    } else if (isDeleting && displayText === "") {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setTextIndex((i) => (i + 1) % texts.length);
      }, GAP_DURATION_MS);
    } else {
      const nextText = isDeleting
        ? currentFullText.slice(0, displayText.length - 1)
        : currentFullText.slice(0, displayText.length + 1);
      timeoutId = setTimeout(
        () => setDisplayText(nextText),
        isDeleting ? DELETING_SPEED_MS : TYPING_SPEED_MS,
      );
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, isDeleting, textIndex, texts]);

  return displayText;
}

export default function Index() {
  const greetingWord = useMemo(() => getTimeGreeting(), []);

  const rotatingTexts = useMemo(
    () => [
      `Hallo, Selamat ${greetingWord}`,
      "Welcome To SENP4II Universe",
      "Layanan REST API Streaming Terlengkap",
    ],
    [greetingWord],
  );

  const typedText = useTypingLoop(rotatingTexts);

  // Ganti <a href> di bawah dengan <Link> dari router project Anda
  // (mis. react-router-dom) kalau ingin navigasi tanpa full page reload.
  const ctaLinks = [
    { label: "SENP4II Anime API", href: "/anime", icon: <IconAnime /> },
    { label: "SENP4II Komik API", href: "/komik", icon: <IconKomik /> },
    { label: "SENP4II Donghua API", href: "/donghua", icon: <IconDonghua /> },
  ];

  return (
    <section className="home" aria-labelledby="home-heading">
      <div className="home__glow" aria-hidden="true" />

      <div className="home__container">
        <div className="home__signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        {/* h1 tersembunyi secara visual untuk SEO/screen reader, karena
            teks yang terlihat berganti-ganti lewat efek mengetik. */}
        <h1 id="home-heading" className="home__sr-heading">
          SENP4II Universe
        </h1>

        <p className="home__typed" aria-hidden="true">
          <span className="home__typed-text">{typedText}</span>
          <span className="home__cursor" />
        </p>

        <p className="home__tagline">
          Selamat Datang di SENP4II publik REST API terbaik, dapatkan akses ke
          API anime, komik, donghua terlengkap, dan nikmati layanan streaming
          SenPlay.
        </p>

        <div className="home__cta">
          {ctaLinks.map((item) => (
            <a className="home__cta-btn" href={item.href} key={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}

          <button
            type="button"
            className="home__cta-btn home__cta-btn--soon"
            disabled
            aria-disabled="true"
          >
            <IconSenPlay />
            <span>Web SenPlay</span>
            <span className="home__cta-badge">Soon</span>
          </button>
        </div>
      </div>
    </section>
  );
}
