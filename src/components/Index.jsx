import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/Home.css";

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
      </div>
    </section>
  );
}
