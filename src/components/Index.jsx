import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

function IconShowcase() {
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
      <rect x="3" y="4.5" width="18" height="14" rx="1.5" />
      <path d="M3 8.5h18" />
      <path d="m8.5 13 2 2 4-4.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Quotes Of Today — pakai API internal SenPlay. Ditulis dengan .then()/
// .catch() (BUKAN async/await), meniru pola useServerStats di atas: agar
// setiap setState benar-benar terjadi di dalam callback function literal
// yang dilewatkan ke Promise, bukan sebagai "lanjutan" dari fungsi async
// yang dipanggil langsung dari badan effect — ini akar masalah lint
// "Avoid calling setState() directly within an effect" sebelumnya.
// ---------------------------------------------------------------------------
const SENPLAY_QUOTES_API_URL = "https://api.senplay.web.id/api/quotes";

function useSenplayQuote(url) {
  const [state, setState] = useState({ status: "loading", quote: null });
  const controllerRef = useRef(null);

  // Fungsi biasa (bukan async) — badannya hanya memasang rantai
  // .then()/.catch(). Semua setState ada di dalam callback .then/.catch,
  // bukan di badan fungsi ini sendiri.
  const fetchQuote = useCallback(
    (signal) => {
      fetch(url, { signal })
        .then((res) => {
          if (!res.ok) throw new Error(`status ${res.status}`);
          return res.json();
        })
        .then((json) => {
          const payload = json?.data ?? json;
          const text =
            payload?.text ?? payload?.quote ?? payload?.content ?? null;
          const author =
            payload?.author ?? payload?.by ?? payload?.source ?? "Anonim";

          if (!text) {
            setState({ status: "error", quote: null });
            return;
          }

          setState({ status: "success", quote: { text, author } });
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error("Gagal memuat quote:", err);
          setState({ status: "error", quote: null });
        });
    },
    [url],
  );

  // Dipakai oleh tombol "Kutipan Lain" (event handler) — boleh setState
  // sinkron di sini karena tidak dijalankan dari badan effect.
  const load = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: "loading", quote: null });
    fetchQuote(controller.signal);
  }, [fetchQuote]);

  // Effect mount: hanya memanggil fetchQuote (fungsi tanpa setState
  // sinkron di badannya) — state awal ("loading") sudah benar dari
  // useState, jadi effect ini murni "berlangganan" hasil fetch.
  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    fetchQuote(controller.signal);
    return () => controller.abort();
  }, [fetchQuote]);

  return { ...state, reload: load };
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

const YOUTUBE_ALLOWED_HOSTS = new Set(["youtube.com", "youtu.be"]);
const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function extractYouTubeVideoId(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.trim() === "") return null;

  let parsed;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");
  if (!YOUTUBE_ALLOWED_HOSTS.has(host)) return null;

  let candidateId = null;

  if (host === "youtu.be") {
    candidateId = parsed.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (parsed.pathname === "/watch") {
    candidateId = parsed.searchParams.get("v");
  } else if (parsed.pathname.startsWith("/shorts/")) {
    candidateId = parsed.pathname.split("/").filter(Boolean)[1] ?? null;
  } else if (parsed.pathname.startsWith("/live/")) {
    candidateId = parsed.pathname.split("/").filter(Boolean)[1] ?? null;
  }

  if (!candidateId) return null;
  return YOUTUBE_VIDEO_ID_PATTERN.test(candidateId) ? candidateId : null;
}

// -----------------------------------------------------------------------
// Loader resmi YouTube IFrame API. src selalu konstan ke domain YouTube,
// tidak pernah berasal dari input user — ini mekanisme resmi yang
// didokumentasikan Google untuk memuat IFrame Player API di browser.
// -----------------------------------------------------------------------
const YOUTUBE_IFRAME_API_SRC = "https://www.youtube.com/iframe_api";
let youtubeApiLoadPromise = null;

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API hanya tersedia di browser"));
  }

  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiLoadPromise) return youtubeApiLoadPromise;

  youtubeApiLoadPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT);
    };

    const alreadyInjected = document.querySelector(
      `script[src="${YOUTUBE_IFRAME_API_SRC}"]`,
    );
    if (alreadyInjected) return;

    const script = document.createElement("script");
    script.src = YOUTUBE_IFRAME_API_SRC;
    script.async = true;
    script.onerror = () => reject(new Error("Gagal memuat YouTube IFrame API"));
    document.head.appendChild(script);
  });

  return youtubeApiLoadPromise;
}

const YOUTUBE_ERROR_MESSAGES = {
  2: "URL video tidak valid.",
  5: "Video tidak bisa diputar di pemutar ini.",
  100: "Video tidak ditemukan atau sudah dihapus.",
  101: "Pemilik video menonaktifkan pemutaran di situs lain.",
  150: "Pemilik video menonaktifkan pemutaran di situs lain.",
};

// -----------------------------------------------------------------------
// Hook pengelola instance YT.Player. Semua perubahan status (playing,
// paused, buffering, ended, error, autoplay diblokir) diperbarui lewat
// callback event resmi YouTube — bukan disetel paksa dari kode kita —
// supaya effect yang mensinkronkan video hanya memanggil method player
// (tanpa setState sinkron di badan effect).
// -----------------------------------------------------------------------
function useYouTubePlayer(containerRef) {
  const playerRef = useRef(null);
  const pendingLoadRef = useRef(null);

  const [isApiReady, setIsApiReady] = useState(false);
  const [playerState, setPlayerState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const [videoTitle, setVideoTitle] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeIframeApi()
      .then(() => {
        if (!cancelled) setIsApiReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage("Gagal memuat YouTube Player API.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isApiReady || !containerRef.current || playerRef.current) {
      return undefined;
    }

    const flushPendingLoad = () => {
      if (!pendingLoadRef.current || !playerRef.current) return;
      const { videoId, autoplay } = pendingLoadRef.current;
      pendingLoadRef.current = null;
      if (autoplay && typeof playerRef.current.loadVideoById === "function") {
        playerRef.current.loadVideoById(videoId);
      } else {
        playerRef.current.cueVideoById(videoId);
      }
    };

    playerRef.current = new window.YT.Player(containerRef.current, {
      height: "100%",
      width: "100%",
      playerVars: {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        origin:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
      events: {
        onReady: () => {
          setPlayerState((prev) => (prev === "idle" ? "idle" : prev));
          flushPendingLoad();
        },
        onStateChange: (event) => {
          const data =
            typeof playerRef.current?.getVideoData === "function"
              ? playerRef.current.getVideoData()
              : null;
          if (data?.title) setVideoTitle(data.title);

          const YTState = window.YT.PlayerState;
          switch (event.data) {
            case YTState.PLAYING:
              setPlayerState("playing");
              setErrorMessage(null);
              break;
            case YTState.PAUSED:
              setPlayerState("paused");
              break;
            case YTState.BUFFERING:
              setPlayerState("buffering");
              break;
            case YTState.ENDED:
              setPlayerState("ended");
              break;
            case YTState.CUED:
              setPlayerState("cued");
              setErrorMessage(null);
              break;
            default:
              break;
          }
        },
        onAutoplayBlocked: () => {
          // Browser menolak autoplay — biarkan diam di "paused", user
          // tinggal tekan tombol Play. Bukan error.
          setPlayerState("paused");
        },
        onError: (event) => {
          setErrorMessage(
            YOUTUBE_ERROR_MESSAGES[event.data] ?? "Video gagal dimainkan.",
          );
          setPlayerState("error");
        },
      },
    });

    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [isApiReady, containerRef]);

  // Murni delegasi ke player eksternal — tidak ada setState di sini.
  // Status ditangkap dari event YouTube sendiri (lihat handler di atas).
  const loadVideo = useCallback((videoId, { autoplay = false } = {}) => {
    const player = playerRef.current;
    if (!player || typeof player.cueVideoById !== "function") {
      pendingLoadRef.current = { videoId, autoplay };
      return;
    }
    if (autoplay && typeof player.loadVideoById === "function") {
      player.loadVideoById(videoId);
    } else {
      player.cueVideoById(videoId);
    }
  }, []);

  const play = useCallback(() => {
    playerRef.current?.playVideo?.();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo?.();
  }, []);

  return {
    isApiReady,
    playerState,
    errorMessage,
    videoTitle,
    loadVideo,
    play,
    pause,
  };
}

// -----------------------------------------------------------------------
// Daftar lagu untuk mode Random — dikonfigurasi di frontend, BUKAN hasil
// scraping. Lima video lofi/chill dari channel Lofi Girl.
// -----------------------------------------------------------------------
const MUSIC_LIBRARY = [
  {
    id: "5qap5aO4i9A",
    title: "Lofi Girl — lofi hip hop radio (beats to relax/study to)",
  },
  { id: "CFGLoQIhmow", title: "Lofi Girl — lofi hip hop mix, Pt. 1" },
  { id: "n61ULEU7CO0", title: "Lofi Girl — Best of lofi hip hop 2021" },
  { id: "i43tkaTXtwI", title: "Lofi Girl — Best of lofi hip hop 2022" },
  { id: "mmKguZohAck", title: "Lofi Girl — Best of lofi hip hop 2023" },
];

function pickRandomTrack(excludeId) {
  const candidates = MUSIC_LIBRARY.filter((track) => track.id !== excludeId);
  const pool = candidates.length > 0 ? candidates : MUSIC_LIBRARY;
  return pool[Math.floor(Math.random() * pool.length)];
}

const MUSIC_STATUS_LABELS = {
  idle: "Belum ada video dimuat",
  cued: "Siap diputar",
  buffering: "Buffering…",
  playing: "Sedang diputar",
  paused: "Dijeda",
  ended: "Video selesai",
  error: "Terjadi kesalahan",
};

function IconMusicNote() {
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
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  );
}

function IconSkipBack() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 5h2v14H6z" />
      <path d="M20 5v14l-11-7z" />
    </svg>
  );
}

function IconSkipForward() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 5h2v14h-2z" />
      <path d="M4 5v14l11-7z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 4v16l14-8z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function IconShuffle() {
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
      <path d="M3 6h4l10 12h4" />
      <path d="M17 4l4 3-4 3" />
      <path d="M3 18h4l3-4.5" />
      <path d="M13.5 8.5 15 6.5" />
      <path d="M17 20l4-3-4-3" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 15l6-6" />
      <path d="M10 6l1-1a4 4 0 0 1 6 6l-1 1" />
      <path d="M14 18l-1 1a4 4 0 0 1-6-6l1-1" />
    </svg>
  );
}

function MusicPlayerSection() {
  const playerContainerRef = useRef(null);
  const {
    isApiReady,
    playerState,
    errorMessage,
    videoTitle,
    loadVideo,
    play,
    pause,
  } = useYouTubePlayer(playerContainerRef);

  // { history: [{ id, title, source }], index } — index -1 berarti belum
  // ada video yang pernah dimuat. Previous/Next menavigasi history ini
  // seperti riwayat browser; Next di ujung history mengambil lagu acak
  // baru dari MUSIC_LIBRARY.
  const [playlistState, setPlaylistState] = useState({
    history: [],
    index: -1,
  });
  const [showUrlForm, setShowUrlForm] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState(null);
  const [resolvedTitles, setResolvedTitles] = useState({});

  const currentEntry =
    playlistState.index >= 0
      ? playlistState.history[playlistState.index]
      : null;

  // Ambil judul dari endpoint metadata publik YouTube (oEmbed) — bukan
  // scraping, bukan proxy backend kita, hanya fetch client-side langsung
  // ke domain youtube.com untuk melengkapi judul video hasil input URL.
  const fetchOembedTitle = useCallback(async (videoId) => {
    try {
      const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`,
      )}&format=json`;
      const res = await fetch(endpoint);
      if (!res.ok) return;
      const json = await res.json();
      if (json?.title) {
        setResolvedTitles((prev) => ({ ...prev, [videoId]: json.title }));
      }
    } catch {
      // Diamkan — judul tetap fallback ke metadata player / label generik.
    }
  }, []);

  // Sinkronkan video "aktif" (state React) ke player eksternal. Ini
  // effect yang benar: hanya memanggil method imperatif player, tidak
  // ada setState di badan effect ini sendiri.
  useEffect(() => {
    if (currentEntry) {
      loadVideo(currentEntry.id, { autoplay: true });
    }
  }, [currentEntry, loadVideo]);

  const handleUrlSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const videoId = extractYouTubeVideoId(urlInput);
      if (!videoId) {
        setUrlError(
          "URL tidak valid. Gunakan format youtube.com/watch?v=..., youtu.be/..., atau youtube.com/shorts/...",
        );
        return;
      }
      setUrlError(null);
      setPlaylistState((prev) => {
        const truncated = prev.history.slice(0, prev.index + 1);
        const nextHistory = [
          ...truncated,
          { id: videoId, title: null, source: "custom" },
        ];
        return { history: nextHistory, index: nextHistory.length - 1 };
      });
      fetchOembedTitle(videoId);
      setUrlInput("");
      setShowUrlForm(false);
    },
    [urlInput, fetchOembedTitle],
  );

  const handleRandomClick = useCallback(() => {
    setPlaylistState((prev) => {
      const excludeId = prev.index >= 0 ? prev.history[prev.index]?.id : null;
      const track = pickRandomTrack(excludeId);
      const truncated = prev.history.slice(0, prev.index + 1);
      const nextHistory = [
        ...truncated,
        { id: track.id, title: track.title, source: "library" },
      ];
      return { history: nextHistory, index: nextHistory.length - 1 };
    });
    setShowUrlForm(false);
  }, []);

  const handleNextClick = useCallback(() => {
    setPlaylistState((prev) => {
      if (prev.index >= 0 && prev.index < prev.history.length - 1) {
        return { ...prev, index: prev.index + 1 };
      }
      const excludeId = prev.index >= 0 ? prev.history[prev.index]?.id : null;
      const track = pickRandomTrack(excludeId);
      const nextHistory = [
        ...prev.history,
        { id: track.id, title: track.title, source: "library" },
      ];
      return { history: nextHistory, index: nextHistory.length - 1 };
    });
    setShowUrlForm(false);
  }, []);

  const handlePreviousClick = useCallback(() => {
    setPlaylistState((prev) =>
      prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev,
    );
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (playerState === "playing") {
      pause();
    } else {
      play();
    }
  }, [playerState, play, pause]);

  const handleShowUrlForm = useCallback(() => {
    setUrlError(null);
    setUrlInput("");
    setShowUrlForm(true);
  }, []);

  const handleCancelUrlForm = useCallback(() => {
    setUrlError(null);
    setShowUrlForm(false);
  }, []);

  const displayedTitle = currentEntry
    ? (resolvedTitles[currentEntry.id] ??
      currentEntry.title ??
      videoTitle ??
      "Video YouTube")
    : "Belum ada video";

  const statusText = errorMessage
    ? errorMessage
    : !isApiReady
      ? "Menyiapkan pemutar YouTube…"
      : (MUSIC_STATUS_LABELS[playerState] ?? "");

  const controlsDisabled = !isApiReady;

  return (
    <section className="music" aria-labelledby="music-heading">
      <div className="music__card">
        <div className="music__header">
          <h2 id="music-heading" className="music__title">
            <IconMusicNote />
            <span>Music Player</span>
          </h2>
          <p className="music__subtitle">
            Diputar langsung lewat embed resmi YouTube
          </p>
        </div>

        <div className="music__body">
          <div className="music__stage">
            <div ref={playerContainerRef} className="music__frame" />

            {showUrlForm && (
              <div className="music__overlay">
                <form className="music__url-form" onSubmit={handleUrlSubmit}>
                  <label htmlFor="music-url-input" className="music__url-label">
                    URL YouTube
                  </label>
                  <input
                    id="music-url-input"
                    type="text"
                    inputMode="url"
                    autoComplete="off"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={urlInput}
                    onChange={(event) => setUrlInput(event.target.value)}
                    className="music__url-input"
                  />
                  {urlError && <p className="music__url-error">{urlError}</p>}
                  <div className="music__url-actions">
                    <button type="submit" className="music__url-submit">
                      Putar
                    </button>
                    {currentEntry && (
                      <button
                        type="button"
                        className="music__url-cancel"
                        onClick={handleCancelUrlForm}
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="music__panel">
            <p className="music__now-playing-label">Sedang diputar</p>
            <p className="music__now-playing-title">{displayedTitle}</p>
            <p className="music__status">{statusText}</p>

            <div className="music__controls">
              <button
                type="button"
                className="music__control-btn"
                onClick={handlePreviousClick}
                disabled={controlsDisabled || playlistState.index <= 0}
                aria-label="Video sebelumnya"
              >
                <IconSkipBack />
              </button>

              <button
                type="button"
                className="music__control-btn music__control-btn--primary"
                onClick={handleTogglePlay}
                disabled={
                  controlsDisabled || !currentEntry || playerState === "error"
                }
                aria-label={playerState === "playing" ? "Jeda" : "Putar"}
              >
                {playerState === "playing" ? <IconPause /> : <IconPlay />}
              </button>

              <button
                type="button"
                className="music__control-btn"
                onClick={handleNextClick}
                disabled={controlsDisabled}
                aria-label="Video berikutnya"
              >
                <IconSkipForward />
              </button>

              <button
                type="button"
                className="music__control-btn"
                onClick={handleRandomClick}
                disabled={controlsDisabled}
                aria-label="Putar acak"
              >
                <IconShuffle />
              </button>
            </div>

            <button
              type="button"
              className="music__change-url-btn"
              onClick={handleShowUrlForm}
            >
              <IconLink />
              <span>Masukkan URL baru</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
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

  // Route internal — dirender lewat <Link> react-router-dom (lihat CTA di
  // bawah), bukan lagi <a href> biasa, supaya navigasi tanpa full reload.
  const ctaLinks = [
    { label: "SENP4II Anime API", href: "/anime", icon: <IconAnime /> },
    { label: "SENP4II Komik API", href: "/komik", icon: <IconKomik /> },
    { label: "SENP4II Donghua API", href: "/donghua", icon: <IconDonghua /> },
    {
      label: "Showcase",
      href: "/showcase",
      icon: <IconShowcase />,
    },
  ];

  const clientInfo = useClientInfo();
  const stats = useServerStats(STATS_API_URL, STATS_REFRESH_MS);
  const now = useClock();
  const {
    status: quoteStatus,
    quote,
    reload: nextQuote,
  } = useSenplayQuote(SENPLAY_QUOTES_API_URL);

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
              <Link className="home__cta-btn" to={item.href} key={item.href}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            <a
              href="https://link.senplay.web.id"
              className="home__cta-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconSenPlay />
              <span>Web SenPlay</span>
            </a>
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

      <MusicPlayerSection />
    </>
  );
}
