import { useEffect, useRef, useState } from "react";
import "../../styles/AnimeApi.css";

const baseUrl = "https://api.senplay.web.id";

const endpointGroups = [
  {
    id: "general",
    title: "Umum",
    items: [
      {
        method: "GET",
        path: "/api/health",
        desc: "Cek status API.",
      },
      {
        method: "GET",
        path: "/api/health/cache",
        desc: "Cek statistik cache.",
      },
    ],
  },
  {
    id: "samehadaku",
    title: "Samehadaku",
    items: [
      {
        method: "GET",
        path: "/api/samehadaku",
        desc: "Info provider dan kapabilitasnya.",
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
        desc: "Episode anime terbaru.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/anime/:slug",
        desc: "Detail anime.",
        note: "Beberapa halaman detail bisa terkena Cloudflare Managed Challenge — endpoint tetap tersedia, scraper gagal dengan aman bila diblokir.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/episode/:slug",
        desc: "Detail episode, termasuk player dan link download.",
      },
      {
        method: "GET",
        path: "/api/samehadaku/rss-search",
        query: "?q=naruto",
        desc: "Mencari anime melalui RSS Samehadaku.",
      },
    ],
  },
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

function EndpointRow({ item }) {
  const [copied, setCopied] = useState(false);
  const fullPath = `${item.path}${item.query ?? ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}${fullPath}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard not available; ignore silently.
    }
  };

  return (
    <li className="api__row">
      <div className="api__row-main">
        <span className="api__method">{item.method}</span>
        <code className="api__path">
          {item.path}
          {item.query && <span className="api__query">{item.query}</span>}
        </code>
        <button
          type="button"
          className="api__copy"
          onClick={handleCopy}
          aria-label={`Salin endpoint ${fullPath}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <p className="api__row-desc">{item.desc}</p>
      {item.note && <p className="api__row-note">{item.note}</p>}
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

  const handleCopyBase = async () => {
    try {
      await navigator.clipboard.writeText(baseUrl);
      setBaseCopied(true);
      setTimeout(() => setBaseCopied(false), 1500);
    } catch {
      // Clipboard not available; ignore silently.
    }
  };

  return (
    <section
      id="anime-api"
      ref={sectionRef}
      className={`api${visible ? " api--visible" : ""}`}
      aria-labelledby="anime-api-heading"
    >
      <div className="api__container">
        <p className="api__eyebrow">DOKUMENTASI API</p>
        <h2 id="anime-api-heading" className="api__heading">
          Anime API
        </h2>
        <p className="api__description">
          REST API yang menyuplai data anime SenPlay dari beberapa provider,
          dimulai dengan Samehadaku.
        </p>

        <div className="api__base">
          <div className="api__base-label">Base URL</div>
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
        </div>

        {endpointGroups.map((group) => (
          <div className="api__group" key={group.id}>
            <h3 className="api__group-title">{group.title}</h3>
            <ul className="api__list">
              {group.items.map((item) => (
                <EndpointRow item={item} key={item.path} />
              ))}
            </ul>
          </div>
        ))}

        <div className="api__notice">
          <p className="api__notice-text">
            Endpoint episode berhasil mengambil data halaman episode secara
            konsisten, termasuk player options dan download links. Untuk detail
            anime, sebagian halaman Samehadaku dapat memicu Cloudflare Managed
            Challenge; pada kondisi ini scraper gagal dengan aman alih-alih
            memberi data yang salah.
          </p>
        </div>
      </div>
    </section>
  );
}
