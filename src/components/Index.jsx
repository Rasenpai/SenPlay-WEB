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

// ---------------------------------------------------------------------------
// Icons untuk information cards.
// ---------------------------------------------------------------------------
function IconBattery() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="7" width="17" height="10" rx="2" />
      <path d="M21 10v4" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function IconServer() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  );
}

function IconChartLine() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 19h16" />
      <path d="M4 15l4-5 4 3 6-8" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sumber data information cards.
//
// - STATS_API_URL: endpoint stats SENP4II sendiri (server-side: uptime,
//   total endpoint, total request, visitor).
// - IP_GEO_API_URL: layanan publik pihak ketiga untuk membaca IP & kota
//   PENGUNJUNG (client-side), karena stats API di atas hanya tahu sisi
//   server, bukan IP orang yang membuka halaman. Ganti kalau punya
//   layanan IP-geolocation sendiri.
// ---------------------------------------------------------------------------
const STATS_API_URL = "https://api.senplay.web.id/api/stats";
const IP_GEO_API_URL = "https://ipapi.co/json/";
const STATS_REFRESH_MS = 30000;
const HOSTING_LABEL = "VPS";

const numberFormatter = new Intl.NumberFormat("en-US");
const formatNumber = (value) =>
  typeof value === "number" ? numberFormatter.format(value) : null;

// Baca User-Agent untuk tebak jenis perangkat, OS, dan browser. Best-effort
// saja — User-Agent bisa disamarkan, jadi ini bukan sumber yang 100% akurat.
function detectUserAgent() {
  if (typeof navigator === "undefined") {
    return { device: "Desktop", os: "Unknown", browser: "Unknown" };
  }
  const ua = navigator.userAgent || "";

  let os = "Unknown";
  if (/Windows/i.test(ua)) os = "Win";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Mac OS X/i.test(ua)) os = "Mac";
  else if (/Linux/i.test(ua)) os = "Linux";

  const device = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
    ? "Mobile"
    : "Desktop";

  let browser = "Unknown";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "Opera";
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua) && /Version\//i.test(ua)) browser = "Safari";

  return { device, os, browser };
}

// ---------------------------------------------------------------------------
// Info sisi client pengunjung: battery, kota (dari IP), IP publik, OS,
// browser. Battery pakai Battery Status API kalau didukung browser;
// perangkat tanpa baterai (PC/desktop) atau browser yang tidak mendukung
// API ini otomatis ditampilkan 100%.
// ---------------------------------------------------------------------------
function useClientInfo() {
  const [info, setInfo] = useState({
    status: "loading",
    battery: null,
    city: null,
    ip: null,
    device: null,
    os: null,
    browser: null,
  });

  useEffect(() => {
    let cancelled = false;
    const { device, os, browser } = detectUserAgent();

    const readBattery = async () => {
      try {
        if ("getBattery" in navigator) {
          const battery = await navigator.getBattery();
          return Math.round(battery.level * 100);
        }
      } catch {
        // Battery API ditolak/tidak tersedia — pakai fallback di bawah.
      }
      // Tidak ada Battery API (umum di desktop/browser non-Chromium) ->
      // anggap perangkat tanpa baterai nyata, tampilkan 100%.
      return 100;
    };

    const readGeo = async () => {
      try {
        const res = await fetch(IP_GEO_API_URL);
        if (!res.ok) throw new Error("geo lookup failed");
        const json = await res.json();
        return { ip: json.ip ?? null, city: json.city ?? null };
      } catch {
        return { ip: null, city: null };
      }
    };

    Promise.all([readBattery(), readGeo()]).then(([battery, geo]) => {
      if (cancelled) return;
      setInfo({
        status: "success",
        battery,
        city: geo.city,
        ip: geo.ip,
        device,
        os,
        browser,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return info;
}

// ---------------------------------------------------------------------------
// Stats server SENP4II — fetch awal + refresh berkala, dengan cleanup
// (AbortController + flag cancelled) supaya tidak ada request menggantung
// setelah component unmount.
// ---------------------------------------------------------------------------
function useServerStats(url, intervalMs) {
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;
    let intervalId;

    const load = () => {
      const controller = new AbortController();
      fetch(url, { signal: controller.signal })
        .then((res) => res.json())
        .then((json) => {
          if (!cancelled) {
            setState({ status: "success", data: json?.data ?? null });
          }
        })
        .catch((err) => {
          if (!cancelled && err.name !== "AbortError") {
            setState((prev) => ({ status: "error", data: prev.data }));
          }
        });
      return controller;
    };

    let controller = load();
    intervalId = setInterval(() => {
      controller.abort();
      controller = load();
    }, intervalMs);

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(intervalId);
    };
  }, [url, intervalMs]);

  return state;
}

// Jam berjalan (WIB) untuk card kedua — satu interval aktif, dibersihkan
// saat unmount.
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const formatWIBTime = (date) =>
  date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });

const formatWIBDate = (date) =>
  date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });

function StatCard({ icon, lines }) {
  return (
    <div className="home__stat-card">
      <div className="home__stat-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="home__stat-lines">
        {lines.map((line, index) => (
          <p className="home__stat-line" key={index}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function IconRefresh() {
  return (
    <svg
      className="quote__icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 12a9 9 0 0 1 15.5-6.2M21 12a9 9 0 0 1-15.5 6.2" />
      <path d="M17.5 3v4.5H13M6.5 21v-4.5H11" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Quotes Of Today — ambil daftar kutipan sekali dari API, lalu pilih acak
// di sisi client. Klik "Kutipan Lain" tidak fetch ulang, cukup acak ulang
// dari daftar yang sudah ada (dan hindari kutipan yang sama persis
// dua kali berturut-turut).
// ---------------------------------------------------------------------------
const QUOTES_API_URL =
  "https://quotes.liupurnomo.com/api/quotes?category=motivasi&page=1&limit=60";

function pickRandomQuote(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function useQuoteOfToday(url) {
  const [state, setState] = useState({
    status: "loading",
    quotes: [],
    quote: null,
  });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const quotes = Array.isArray(json?.data) ? json.data : [];
        setState({
          status: quotes.length ? "success" : "empty",
          quotes,
          quote: quotes.length ? pickRandomQuote(quotes) : null,
        });
      })
      .catch((err) => {
        if (!cancelled && err.name !== "AbortError") {
          setState({ status: "error", quotes: [], quote: null });
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url]);

  const nextQuote = () => {
    setState((prev) => {
      if (prev.quotes.length <= 1) return prev;
      let candidate = pickRandomQuote(prev.quotes);
      while (prev.quote && candidate.id === prev.quote.id) {
        candidate = pickRandomQuote(prev.quotes);
      }
      return { ...prev, quote: candidate };
    });
  };

  return { ...state, nextQuote };
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

  const clientInfo = useClientInfo();
  const stats = useServerStats(STATS_API_URL, STATS_REFRESH_MS);
  const now = useClock();
  const {
    status: quoteStatus,
    quote,
    nextQuote,
  } = useQuoteOfToday(QUOTES_API_URL);

  const statsData = stats.data;
  const placeholder = "…";

  const batteryText =
    clientInfo.battery != null ? `${clientInfo.battery}%` : placeholder;
  const cityText = clientInfo.city ?? placeholder;
  const visitorText =
    formatNumber(
      statsData?.visitors?.total ??
        statsData?.visitors?.lifetime ??
        statsData?.visitors?.today,
    ) ?? placeholder;

  const ipText = clientInfo.ip ?? placeholder;
  const osText = clientInfo.device
    ? `${clientInfo.device} (${clientInfo.os})`
    : placeholder;
  const browserText = clientInfo.browser ?? placeholder;

  const uptimeText = statsData?.server?.uptimeFormatted ?? placeholder;
  const endpointText = formatNumber(statsData?.endpoints?.total) ?? placeholder;
  const requestText =
    formatNumber(statsData?.requests?.lifetime) ?? placeholder;

  const statCards = [
    {
      icon: <IconBattery />,
      lines: [`Battery: ${batteryText}`, cityText, `Visitor: ${visitorText}`],
    },
    {
      icon: <IconClock />,
      lines: [
        `${formatWIBTime(now)} WIB`,
        formatWIBDate(now),
        `Run On: ${HOSTING_LABEL}`,
      ],
    },
    {
      icon: <IconServer />,
      lines: [`IP: ${ipText}`, `OS: ${osText}`, `Browser: ${browserText}`],
    },
    {
      icon: <IconChartLine />,
      lines: [
        `Uptime: ${uptimeText}`,
        `Endpoint: ${endpointText}`,
        `Request: ${requestText}`,
      ],
    },
  ];

  return (
    <>
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

        <div className="home__stats-wrap">
          <div className="home__stats-grid">
            {statCards.map((card, index) => (
              <StatCard icon={card.icon} lines={card.lines} key={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="quote" aria-labelledby="quote-heading">
        <div className="quote__card">
          <h2 id="quote-heading" className="quote__title">
            Kata Mutiara Hari Ini
          </h2>

          {quoteStatus === "loading" && (
            <p className="quote__status">Memuat kutipan…</p>
          )}

          {quoteStatus === "error" && (
            <p className="quote__status">
              Kutipan tidak tersedia saat ini. Coba lagi nanti.
            </p>
          )}

          {quoteStatus === "empty" && (
            <p className="quote__status">Belum ada kutipan untuk saat ini.</p>
          )}

          {quoteStatus === "success" && quote && (
            <>
              <blockquote className="quote__body">
                <p className="quote__text">“{quote.text}”</p>
              </blockquote>
              <p className="quote__author">~ {quote.author}</p>
            </>
          )}

          <button
            type="button"
            className="quote__btn"
            onClick={nextQuote}
            disabled={quoteStatus !== "success"}
          >
            <IconRefresh />
            <span>Kutipan Lain</span>
          </button>
        </div>
      </section>
    </>
  );
}
