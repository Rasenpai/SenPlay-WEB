import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/ToolsApi.css";

const API_BASE = "https://api.senplay.web.id";
const TIKTOK_ENDPOINT = `${API_BASE}/api/tools/tiktok`;
const THEME_STORAGE_KEY = "senplay-tools-api-theme";

// Host TikTok yang diizinkan. Frontend TIDAK boleh mengirim URL selain ini
// ke API, dan TIDAK pernah membuat proxy URL bebas dari input user — kita
// hanya meneruskan URL TikTok apa adanya ke endpoint POST /api/tools/tiktok.
const ALLOWED_TIKTOK_HOSTS = [
  "tiktok.com",
  "www.tiktok.com",
  "vm.tiktok.com",
  "vt.tiktok.com",
  "m.tiktok.com",
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

function formatDuration(seconds) {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) {
    return null;
  }
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getFilesizeBytes(data) {
  if (typeof data?.filesize === "number") return data.filesize;
  const fromFormat = data?.formats?.find(
    (f) => typeof f?.filesize === "number",
  );
  return typeof fromFormat?.filesize === "number" ? fromFormat.filesize : null;
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

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Icons — dibuat generik (bukan reproduksi logo resmi TikTok) supaya tetap
// ringan dan tidak bergantung pada aset brand pihak ketiga.
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

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 5V2L7 6l5 4V7a5 5 0 1 1-4.9 6h-2.05A7 7 0 1 0 12 5z"
      />
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

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [previewReady, setPreviewReady] = useState(false);

  const requestIdRef = useRef(0);
  const resultRef = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Abaikan kalau localStorage tidak bisa ditulis.
    }
  }, [theme]);

  useEffect(() => {
    if (videoData && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [videoData]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const streamUrl = useMemo(() => {
    if (!videoData?.stream) return null;
    return `${API_BASE}${videoData.stream}`;
  }, [videoData]);

  const durationLabel = useMemo(
    () => formatDuration(videoData?.duration) ?? "—",
    [videoData],
  );
  const resolutionLabel = useMemo(() => {
    if (!videoData?.width || !videoData?.height) return "—";
    return `${videoData.width} × ${videoData.height}`;
  }, [videoData]);
  const formatLabel = useMemo(
    () => (videoData?.ext ? videoData.ext.toUpperCase() : "MP4"),
    [videoData],
  );
  const filesizeLabel = useMemo(
    () => formatBytes(getFilesizeBytes(videoData)),
    [videoData],
  );
  const aspectRatio = useMemo(() => {
    if (videoData?.width && videoData?.height) {
      return `${videoData.width} / ${videoData.height}`;
    }
    return "9 / 16";
  }, [videoData]);

  const handleReset = useCallback(() => {
    setUrl("");
    setError(null);
    setVideoData(null);
    setPreviewReady(false);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

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
      setVideoData(null);
      setPreviewReady(false);

      try {
        const response = await fetch(TIKTOK_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ url: trimmed }),
        });

        // Kalau user sudah submit ulang sebelum request ini selesai,
        // abaikan hasil yang basi supaya tidak menimpa state terbaru.
        if (requestIdRef.current !== requestId) return;

        const payload = await parseJsonSafely(response);

        if (
          !response.ok ||
          !payload ||
          payload.status !== "success" ||
          payload.ok !== true
        ) {
          throw new Error(
            payload?.message || "Unable to process this TikTok URL.",
          );
        }
        if (!payload.data || !payload.data.stream) {
          throw new Error("Unable to process this TikTok URL.");
        }

        setVideoData(payload.data);
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
    [loading, url],
  );

  const handleDownload = useCallback(() => {
    if (!streamUrl) return;
    const link = document.createElement("a");
    link.href = streamUrl;
    link.download = "senplay-tiktok.mp4";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [streamUrl]);

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
            TikTok Downloader
          </h2>
          <p className="tools__description">
            Download TikTok videos quickly and easily.
          </p>
        </header>

        {/* ----------------------------------------------------- Input card */}
        <form className="tools__card tools__form" onSubmit={handleSubmit}>
          <label className="tools__label" htmlFor="tiktok-url">
            TikTok URL
          </label>
          <div className="tools__input-row">
            <input
              id="tiktok-url"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              className="tools__input"
              placeholder="Paste TikTok URL..."
              value={url}
              disabled={loading}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
            />
            <button
              type="submit"
              className="tools__submit"
              disabled={!canSubmit}
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Get Video</span>
              )}
            </button>
          </div>

          {error && (
            <p className="tools__error" role="alert">
              <WarningIcon />
              <span>{error}</span>
            </p>
          )}

          <p className="tools__hint">
            Mendukung link dari tiktok.com, vm.tiktok.com, dan vt.tiktok.com.
          </p>
        </form>

        {/* ------------------------------------------------- Loading state */}
        {loading && !videoData && (
          <div className="tools__card tools__skeleton" aria-hidden="true">
            <div className="tools__skeleton-preview" />
            <div className="tools__skeleton-lines">
              <span className="tools__skeleton-line tools__skeleton-line--wide" />
              <span className="tools__skeleton-line tools__skeleton-line--mid" />
              <span className="tools__skeleton-line tools__skeleton-line--narrow" />
            </div>
          </div>
        )}

        {/* --------------------------------------------------- Result card */}
        {videoData && streamUrl && (
          <div className="tools__result" ref={resultRef}>
            <div className="tools__card tools__result-card">
              <div className="tools__preview" style={{ aspectRatio }}>
                {!previewReady && (
                  <div className="tools__preview-skeleton" aria-hidden="true" />
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
                  {videoData.title?.trim() || "TikTok Video"}
                </p>
                {videoData.uploader && (
                  <p className="tools__meta-uploader">@{videoData.uploader}</p>
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

              <div className="tools__actions">
                <button
                  type="button"
                  className="tools__download"
                  onClick={handleDownload}
                >
                  <DownloadIcon />
                  <span>Download Video</span>
                </button>
                <button
                  type="button"
                  className="tools__reset"
                  onClick={handleReset}
                >
                  <ResetIcon />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="tools__footnote">
          Video diputar &amp; diunduh lewat proxy SenPlay, bukan URL CDN TikTok
          langsung.
        </p>
      </div>
    </section>
  );
}
