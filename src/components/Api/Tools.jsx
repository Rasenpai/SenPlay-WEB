import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/ToolsApi.css";

const API_BASE = "https://api.senplay.web.id";
const THEME_STORAGE_KEY = "senplay-tools-api-theme";

// Host TikTok yang diizinkan. Frontend TIDAK boleh mengirim URL selain ini
// ke API — kita hanya meneruskan URL TikTok apa adanya ke masing-masing
// endpoint POST /api/tools/<slug>. Tidak ada apikey yang dikirim dari client.
const ALLOWED_TIKTOK_HOSTS = [
  "tiktok.com",
  "www.tiktok.com",
  "vm.tiktok.com",
  "vt.tiktok.com",
  "m.tiktok.com",
];

// Katalog tool. Tambah entri baru di sini untuk menambah kartu + modal baru
// tanpa mengubah mekanisme lainnya.
const TOOLS = [
  {
    slug: "tiktok",
    name: "Tiktok",
    description: "Downloader tiktok",
    endpoint: `${API_BASE}/api/tools/tiktok`,
    status: "active",
  },
  {
    slug: "tiktok-hd",
    name: "Tiktok HD",
    description: "Downloader Tiktok HD",
    endpoint: `${API_BASE}/api/tools/tiktok-hd`,
    status: "active",
  },
  {
    slug: "tiktok-v2",
    name: "Tiktok V2",
    description: "Downloader tiktok v2",
    endpoint: `${API_BASE}/api/tools/tiktok-v2`,
    status: "active",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidTikTokUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
  const host = parsed.hostname.toLowerCase();
  return ALLOWED_TIKTOK_HOSTS.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`),
  );
}

async function readResponseBody(response) {
  const raw = await response.text();
  try {
    const data = JSON.parse(raw);
    return { data, pretty: JSON.stringify(data, null, 2) };
  } catch {
    return { data: null, pretty: raw };
  }
}

function formatDuration(seconds) {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) {
    return null;
  }
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatBytes(bytes) {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unitIndex]}`;
}

// ---------------------------------------------------------------------------
// Icons — generik (bukan reproduksi logo resmi pihak ketiga manapun).
// ---------------------------------------------------------------------------

function ClipIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M14 3a1 1 0 0 1 1 1v7.17a5.5 5.5 0 1 1-2-4.24V8.5a3.5 3.5 0 1 0 1 2.46V4a1 1 0 0 1 1-1zm-4.5 12.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
      />
      <path
        fill="currentColor"
        opacity="0.55"
        d="M15 4c1.5 2 3.4 3.1 5.5 3.3V9c-2 .1-3.9-.5-5.5-1.6V4z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M7 5.3c0-.83.9-1.34 1.6-.9l10.2 6.2a1 1 0 0 1 0 1.7L8.6 18.5c-.7.44-1.6-.07-1.6-.9V5.3z"
      />
    </svg>
  );
}

function CloseIcon() {
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
        d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M9 3a2 2 0 0 0-2 2v1H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H9zm7 15H6V8h10v10zm3-3h-1V8a2 2 0 0 0-2-2H9V5h9v10z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20 8.4l-1.4-1.4z"
      />
    </svg>
  );
}

function DownloadIcon() {
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
        d="M12 3a1 1 0 0 1 1 1v9.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V4a1 1 0 0 1 1-1zM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="tools__spinner"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8z" />
    </svg>
  );
}

function WarningIcon() {
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
        d="M12 3 1 21h22L12 3zm0 5.5a1 1 0 0 1 1 1V14a1 1 0 1 1-2 0V9.5a1 1 0 0 1 1-1zM12 17a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ToolsApi() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) || "dark";
    } catch {
      return "dark";
    }
  });

  const [activeTool, setActiveTool] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [endpointCopied, setEndpointCopied] = useState(false);
  const [resultCopied, setResultCopied] = useState(false);

  const requestIdRef = useRef(0);
  const urlInputRef = useRef(null);
  const resultRef = useRef(null);

  const streamUrl = useMemo(() => {
    if (!result?.data?.stream) return null;
    return `${API_BASE}${result.data.stream}`;
  }, [result]);

  const durationLabel = useMemo(
    () => formatDuration(result?.data?.duration) ?? "—",
    [result],
  );
  const resolutionLabel = useMemo(() => {
    const { width, height } = result?.data || {};
    return width && height ? `${width} × ${height}` : "—";
  }, [result]);
  const formatLabel = useMemo(
    () => (result?.data?.ext ? result.data.ext.toUpperCase() : "MP4"),
    [result],
  );
  const filesizeLabel = useMemo(
    () => formatBytes(result?.data?.filesize),
    [result],
  );
  const aspectRatio = useMemo(() => {
    const { width, height } = result?.data || {};
    return width && height ? `${width} / ${height}` : "9 / 16";
  }, [result]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Abaikan kalau localStorage tidak bisa ditulis.
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const openTool = useCallback((tool) => {
    requestIdRef.current += 1;
    setActiveTool(tool);
    setUrl("");
    setError(null);
    setResult(null);
    setPreviewReady(false);
    setLoading(false);
    setEndpointCopied(false);
    setResultCopied(false);
  }, []);

  const closeTool = useCallback(() => {
    setActiveTool(null);
  }, []);

  // Fokus ke input url begitu modal terbuka.
  useEffect(() => {
    if (activeTool && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [activeTool]);

  // Tutup modal dengan tombol Escape.
  useEffect(() => {
    if (!activeTool) return undefined;
    function onKeyDown(e) {
      if (e.key === "Escape") closeTool();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTool, closeTool]);

  const handleCopyEndpoint = useCallback(() => {
    if (!activeTool || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(activeTool.endpoint)
      .then(() => {
        setEndpointCopied(true);
        setTimeout(() => setEndpointCopied(false), 1500);
      })
      .catch(() => {});
  }, [activeTool]);

  const handleCopyResult = useCallback(() => {
    if (!result || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(result.pretty)
      .then(() => {
        setResultCopied(true);
        setTimeout(() => setResultCopied(false), 1500);
      })
      .catch(() => {});
  }, [result]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading || !activeTool) return;

      const trimmed = url.trim();
      if (!trimmed) {
        setError("Masukkan URL TikTok terlebih dahulu.");
        return;
      }
      if (!isValidTikTokUrl(trimmed)) {
        setError(
          "URL tidak valid. Gunakan link TikTok dari tiktok.com, vm.tiktok.com, atau vt.tiktok.com.",
        );
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      setLoading(true);
      setError(null);
      setResult(null);
      setPreviewReady(false);

      try {
        const response = await fetch(activeTool.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ url: trimmed }),
        });

        // Kalau modal sudah ditutup / ganti tool / submit ulang sebelum
        // request ini selesai, abaikan hasil yang basi.
        if (requestIdRef.current !== requestId) return;

        const { data, pretty } = await readResponseBody(response);

        if (!response.ok) {
          throw new Error(
            (data && (data.message || data.error)) ||
              `Request gagal (status ${response.status}).`,
          );
        }

        setResult({ data, pretty });
      } catch (err) {
        if (requestIdRef.current !== requestId) return;
        const message =
          err instanceof Error && err.message
            ? err.message
            : "Unable to process this TikTok URL.";
        setError(message);
      } finally {
        if (requestIdRef.current === requestId) setLoading(false);
      }
    },
    [loading, url, activeTool],
  );

  const handleDownload = useCallback(() => {
    if (!streamUrl) return;
    const link = document.createElement("a");
    link.href = streamUrl;
    link.download = `senplay-${activeTool?.slug ?? "video"}.mp4`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [streamUrl, activeTool]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [result]);

  const canSubmit = url.trim().length > 0 && !loading;

  return (
    <section
      id="tools-tiktok"
      data-theme={theme}
      className="tools"
      aria-labelledby="tools-heading"
    >
      <button
        type="button"
        className="tools__theme-toggle"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap"
        }
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="tools__container">
        {/* ---------------------------------------------------------- Hero */}
        <header className="tools__hero">
          <div className="tools__hero-icon" aria-hidden="true">
            <ClipIcon />
          </div>
          <h2 id="tools-heading" className="tools__heading">
            SenPlay Tools
          </h2>
          <p className="tools__description">
            Pilih salah satu tool di bawah, lalu coba langsung API-nya.
          </p>
        </header>

        {/* --------------------------------------------------- Tools grid */}
        <div className="tools__grid">
          {TOOLS.map((tool) => (
            <article key={tool.slug} className="tools__tool-card">
              <div className="tools__tool-card-top">
                <div className="tools__tool-card-info">
                  <h3 className="tools__tool-name">{tool.name}</h3>
                  <p className="tools__tool-desc">{tool.description}</p>
                </div>
                <button
                  type="button"
                  className="tools__try-btn"
                  onClick={() => openTool(tool)}
                >
                  <PlayIcon />
                  <span>Try API</span>
                </button>
              </div>
              <span className={`tools__status tools__status--${tool.status}`}>
                {tool.status === "active" ? "Active" : "Inactive"}
              </span>
            </article>
          ))}
        </div>

        <p className="tools__footnote">
          Video diputar &amp; diunduh lewat proxy SenPlay, bukan URL CDN TikTok
          langsung.
        </p>
      </div>

      {/* ----------------------------------------------------------- Modal */}
      {activeTool && (
        <div
          className="tools__modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeTool();
          }}
        >
          <div
            className="tools__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tools-modal-title"
          >
            <div className="tools__modal-header">
              <div>
                <h3 id="tools-modal-title" className="tools__modal-title">
                  {activeTool.name}
                </h3>
                <p className="tools__modal-subtitle">
                  {activeTool.description}
                </p>
              </div>
              <button
                type="button"
                className="tools__modal-close"
                onClick={closeTool}
                aria-label="Tutup"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="tools__endpoint-row">
              <code className="tools__endpoint">
                POST {activeTool.endpoint}
              </code>
              <button
                type="button"
                className="tools__copy-btn"
                onClick={handleCopyEndpoint}
                aria-label="Salin endpoint"
              >
                {endpointCopied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>

            <form className="tools__modal-form" onSubmit={handleSubmit}>
              <label className="tools__label" htmlFor="tool-url">
                Url
              </label>
              <input
                id="tool-url"
                ref={urlInputRef}
                type="text"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                className="tools__input"
                placeholder="Enter url"
                value={url}
                disabled={loading}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
              />

              {error && (
                <p className="tools__error" role="alert">
                  <WarningIcon />
                  <span>{error}</span>
                </p>
              )}

              <button
                type="submit"
                className="tools__submit tools__submit--block"
                disabled={!canSubmit}
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </form>

            {loading && !result && (
              <div className="tools__result-skeleton" aria-hidden="true">
                <span className="tools__skeleton-line tools__skeleton-line--wide" />
                <span className="tools__skeleton-line tools__skeleton-line--mid" />
                <span className="tools__skeleton-line tools__skeleton-line--narrow" />
              </div>
            )}

            {result && (
              <div className="tools__result" ref={resultRef}>
                {streamUrl && (
                  <div className="tools__preview-card">
                    <div className="tools__preview" style={{ aspectRatio }}>
                      {!previewReady && (
                        <div
                          className="tools__preview-skeleton"
                          aria-hidden="true"
                        />
                      )}
                      <video
                        key={streamUrl}
                        className="tools__video"
                        src={streamUrl}
                        controls
                        playsInline
                        preload="metadata"
                        onLoadedData={() => setPreviewReady(true)}
                      />
                    </div>

                    <div className="tools__meta">
                      <p className="tools__meta-title">
                        {result.data?.title?.trim() || "TikTok Video"}
                      </p>
                      {result.data?.uploader && (
                        <p className="tools__meta-uploader">
                          @{result.data.uploader}
                        </p>
                      )}
                      <div className="tools__meta-chips">
                        <span className="tools__chip">{durationLabel}</span>
                        <span className="tools__chip">{resolutionLabel}</span>
                        <span className="tools__chip">{formatLabel}</span>
                        {filesizeLabel && (
                          <span className="tools__chip">{filesizeLabel}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="tools__download"
                      onClick={handleDownload}
                    >
                      <DownloadIcon />
                      <span>Download Video</span>
                    </button>
                  </div>
                )}

                <div className="tools__json">
                  <div className="tools__json-toolbar">
                    <span>Response</span>
                    <button
                      type="button"
                      className="tools__copy-btn tools__copy-btn--light"
                      onClick={handleCopyResult}
                      aria-label="Salin response"
                    >
                      {resultCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <pre className="tools__json-body">
                    <code>{result.pretty}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
