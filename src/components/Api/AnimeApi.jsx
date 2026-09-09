import { useEffect, useRef, useState } from "react";
import "../../styles/AnimeApi.css";

const baseUrl = "https://api.senplay.web.id";
const THEME_STORAGE_KEY = "senplay-api-theme";

const endpointGroups = [
  {
    id: "docs",
    title: "📚 Dokumentasi API",
    items: [
      {
        method: "GET",
        path: "/api",
        desc: "Dokumentasi utama API.",
      },
      {
        method: "GET",
        path: "/api/providers",
        desc: "Daftar semua provider.",
      },
      {
        method: "GET",
        path: "/api/providers/:provider",
        resolvedPath: "/api/providers/otakudesu",
        desc: "Detail dan capability provider.",
      },
      {
        method: "GET",
        path: "/api/health",
        desc: "Cek kesehatan API.",
      },
      {
        method: "GET",
        path: "/api/health/cache",
        desc: "Cek status dan cache.",
      },
    ],
  },

  {
    id: "samehadaku",
    title: "🎌 Samehadaku",
    items: [
      {
        method: "GET",
        path: "/api/samehadaku",
        desc: "Info provider Samehadaku.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/anime",
        query: "?page=1",
        desc: "Daftar anime.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/anime/latest",
        desc: "Anime episode terbaru.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/anime/:slug",
        resolvedPath: "/api/samehadaku/anime/one-piece",
        desc: "Detail anime.",
        note: "Gunakan slug yang diperoleh dari endpoint list/search. Slug contoh dapat berubah mengikuti provider.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/episode/:slug",
        resolvedPath: "/api/samehadaku/episode/one-piece-episode-1-sub-indo",
        desc: "Detail episode.",
        note: "Gunakan slug episode yang diperoleh dari data episode.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/episode/:slug/stream",
        resolvedPath:
          "/api/samehadaku/episode/one-piece-episode-1-sub-indo/stream",
        desc: "Data stream dan mirror episode.",
        note: "Gunakan slug episode yang diperoleh dari endpoint detail anime.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/rss-search",
        query: "?q=naruto",
        desc: "Mencari anime melalui RSS Samehadaku.",
      },
    ],
  },

  {
    id: "otakudesu",
    title: "🇯🇵 Otakudesu",
    items: [
      {
        method: "GET",
        path: "/api/otakudesu",
        desc: "Info provider Otakudesu.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/anime",
        query: "?page=1",
        desc: "Daftar anime ongoing.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/anime/latest",
        desc: "Episode terbaru.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/anime/:slug",
        resolvedPath: "/api/otakudesu/anime/mujikaku-seijo-nagasu-sub-indo",
        desc: "Detail anime beserta daftar episode.",
        note: "Slug harus diambil dari hasil endpoint list atau search. Jangan menebak slug secara manual.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/episode/:slug",
        resolvedPath: "/api/otakudesu/episode/mskmctn-episode-11-sub-indo",
        desc: "Detail episode, stream, dan mirror.",
        note: "Slug episode harus diambil dari daftar episode pada detail anime.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/episode/:slug/stream",
        resolvedPath:
          "/api/otakudesu/episode/mskmctn-episode-11-sub-indo/stream",
        desc: "Khusus data stream, mirror, dan download.",
        note: "Endpoint ini menggunakan slug episode dari endpoint detail anime.",
      },
    ],
  },
];

const totalEndpoints = endpointGroups.reduce(
  (sum, group) => sum + group.items.length,
  0,
);

const baseUrlExamples = [
  "/api/otakudesu/anime?page=1",
  "/api/otakudesu/episode/mskmctn-episode-11-sub-indo/stream",
];

function CopyIcon() {
  return (
    <svg
      className="api__copy-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M8 4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8.83a2 2 0 0 0-.586-1.414l-3.83-3.83A2 2 0 0 0 13.17 3H8a2 2 0 0 0-2 1zm0 2h5v3a1 1 0 0 0 1 1h3v9H8V6zM5 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2h-2v.001L5 20V10h1V8H5z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="api__copy-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM4.22 5.64a1 1 0 0 1 1.42 0l.7.71a1 1 0 1 1-1.41 1.41l-.71-.7a1 1 0 0 1 0-1.42zm14.44 14.44a1 1 0 0 1-1.42 0l-.7-.71a1 1 0 1 1 1.41-1.41l.71.7a1 1 0 0 1 0 1.42zM3 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm16 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1zM4.22 18.36a1 1 0 0 1 0-1.42l.7-.7a1 1 0 1 1 1.41 1.41l-.7.71a1 1 0 0 1-1.41 0zM18.36 4.22a1 1 0 0 1 1.42 0 1 1 0 0 1 0 1.42l-.71.7a1 1 0 1 1-1.41-1.41z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M20.742 13.045a8.088 8.088 0 0 1-2.077.267c-4.476 0-8.106-3.63-8.106-8.106 0-1.176.25-2.293.702-3.302a.75.75 0 0 0-.919-1.02A10.096 10.096 0 0 0 2.5 10.75c0 5.66 4.59 10.25 10.25 10.25a10.096 10.096 0 0 0 9.866-7.842.75.75 0 0 0-1.014-.855 8.052 8.052 0 0 1-.86.742z"
      />
    </svg>
  );
}

function EndpointCard({ item }) {
  const [copied, setCopied] = useState(false);
  const requestPath = item.resolvedPath ?? item.path;
  const fullPath = `${requestPath}${item.query ?? ""}`;
  const fullUrl = `${baseUrl}${fullPath}`;

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard not available; ignore silently.
    }
  };

  const openEndpoint = () => {
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEndpoint();
    }
  };

  return (
    <li
      className="api__card"
      role="button"
      tabIndex={0}
      onClick={openEndpoint}
      onKeyDown={handleKeyDown}
      aria-label={`Buka ${fullPath} di tab baru`}
    >
      <p className="api__card-title">{item.desc}</p>
      <div className="api__card-endpoint">
        <span className="api__method">{item.method}</span>
        <code className="api__path">{item.path}</code>
        <button
          type="button"
          className="api__copy"
          onClick={handleCopy}
          aria-label={`Salin endpoint ${fullPath}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      {item.query && (
        <p className="api__card-meta">
          Query: <code>{item.query}</code>
        </p>
      )}
      {item.resolvedPath && (
        <p className="api__card-meta">
          Contoh: <code>{item.resolvedPath}</code>
        </p>
      )}
      {item.note && <p className="api__card-note">{item.note}</p>}
    </li>
  );
}

function BaseUrlExample({ path }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `${baseUrl}${path}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard not available; ignore silently.
    }
  };

  return (
    <li className="api__base-example">
      <code className="api__base-example-url">{fullUrl}</code>
      <button
        type="button"
        className="api__copy"
        onClick={handleCopy}
        aria-label={`Salin contoh URL ${fullUrl}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </li>
  );
}

export default function AnimeApi() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [baseCopied, setBaseCopied] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  });

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
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleCopyBase = async () => {
    try {
      await navigator.clipboard.writeText(baseUrl);
      setBaseCopied(true);
      setTimeout(() => setBaseCopied(false), 1500);
    } catch {
      // Clipboard not available; ignore silently.
    }
  };

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <section
      id="anime-api"
      ref={sectionRef}
      data-theme={theme}
      className={`api${visible ? " api--visible" : ""}`}
      aria-labelledby="anime-api-heading"
    >
      <button
        type="button"
        className="api__theme-toggle"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap"
        }
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="api__container">
        <p className="api__eyebrow">DOKUMENTASI API</p>
        <h2 id="anime-api-heading" className="api__heading">
          Anime API
        </h2>
        <p className="api__description">
          REST API yang menyuplai data anime SenPlay dari beberapa provider,
          dimulai dengan Samehadaku dan Otakudesu.
        </p>

        <div className="api__warning">
          <p className="api__warning-title">⚠️ PERINGATAN RATE LIMIT</p>
          <p className="api__warning-line">
            <strong>Rate Limit:</strong> 30 Request per menit
          </p>
          <p className="api__warning-line">
            <strong>Pelanggaran:</strong> Jika Anda melewati batas, Anda akan
            mendapatkan 3 kali peringatan sebelum <strong>BAN PERMANEN</strong>
          </p>
          <p className="api__warning-line">
            ⚡ Gunakan API dengan bijak dan jangan spamming!
          </p>
          <p className="api__warning-line">
            🛡️ <strong>Tujuan Rate Limit:</strong> Melindungi server dari
            serangan Hama DDoS dan aktivitas spammer yang dapat mengganggu
            layanan untuk pengguna lain.
          </p>
          <hr className="api__warning-divider" />
          <p className="api__warning-line">
            💼 <strong>Ingin Di Whitelist dari Rate Limit?</strong> Silahkan
            Hubungi kami
          </p>
          <p className="api__warning-line">
            🔓 <strong>Terkena Ban?</strong> Hubungi kami untuk unban{" "}
            <strong>GRATIS</strong>
          </p>
        </div>

        <div className="api__base">
          <div className="api__base-label">🌐 Base URL Production</div>
          <div className="api__base-row">
            <code className="api__base-url">{baseUrl}</code>
            <button
              type="button"
              className="api__copy api__copy--base"
              onClick={handleCopyBase}
              aria-label="Salin base URL"
            >
              {baseCopied ? <CheckIcon /> : <CopyIcon />}
              <span>{baseCopied ? "Tersalin" : "Salin"}</span>
            </button>
          </div>
          <p className="api__base-hint">Contoh:</p>
          <ul className="api__base-examples">
            {baseUrlExamples.map((path) => (
              <BaseUrlExample path={path} key={path} />
            ))}
          </ul>
        </div>

        {endpointGroups.map((group) => (
          <div className="api__group" key={group.id}>
            <h3 className="api__group-title">{group.title}</h3>
            <ul className="api__grid">
              {group.items.map((item) => (
                <EndpointCard item={item} key={item.path} />
              ))}
            </ul>
          </div>
        ))}

        <p className="api__total">
          Total {totalEndpoints} endpoint yang sudah kita definisikan, termasuk
          endpoint dokumentasi dan health.
        </p>
      </div>
    </section>
  );
}
