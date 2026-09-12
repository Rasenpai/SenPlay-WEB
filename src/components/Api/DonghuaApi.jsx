import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/Api.css";

const baseUrl = "https://api.senplay.web.id";
const THEME_STORAGE_KEY = "senplay-donghua-api-theme";

// ---------------------------------------------------------------------------
// endpointGroups — sumber data Donghua API. Silakan tambah provider baru di
// sini kalau sudah ada; logic di bawah hanya MEMBACA array ini.
// ---------------------------------------------------------------------------
const endpointGroups = [
  {
    id: "anichin",
    title: "🎬 Anichin",
    items: [
      {
        method: "GET",
        path: "/api/anichin",
        desc: "Info provider Anichin.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga",
        query: "?page=1",
        desc: "Daftar semua anime/donghua.",
        note: "Nama /manga mengikuti struktur route yang dipakai di seluruh API, walaupun Anichin sendiri adalah provider anime/donghua.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/search",
        query: "?q=soul+land&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/latest",
        query: "?page=1",
        desc: "Episode terbaru.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/latest-added",
        query: "?page=1",
        desc: "Anime yang baru ditambahkan.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/ongoing",
        query: "?page=1",
        desc: "Anime yang sedang tayang.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/completed",
        query: "?page=1",
        desc: "Anime yang sudah tamat.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/upcoming",
        query: "?page=1",
        desc: "Anime yang akan datang.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/hiatus",
        query: "?page=1",
        desc: "Anime yang sedang hiatus.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/popular",
        query: "?period=weekly&page=1",
        desc: "Anime populer.",
        note: "Anichin menyediakan kategori Popular Weekly / Monthly / All. Ganti nilai period menjadi weekly, monthly, atau all.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/genre/:genre",
        query: "?page=1",
        resolvedPath: "/api/anichin/manga/genre/action",
        desc: "Anime berdasarkan genre.",
        note: "Gunakan slug genre yang tersedia di Anichin, mis. action.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/season/:season",
        query: "?page=1",
        resolvedPath: "/api/anichin/manga/season/2026",
        desc: "Anime berdasarkan season.",
        note: "Gunakan tahun/season yang tersedia di Anichin, mis. 2026.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/type/:type",
        query: "?page=1",
        resolvedPath: "/api/anichin/manga/type/donghua",
        desc: "Anime berdasarkan type.",
        note: "Gunakan slug type yang tersedia di Anichin, mis. donghua.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/status/:status",
        query: "?page=1",
        resolvedPath: "/api/anichin/manga/status/ongoing",
        desc: "Anime berdasarkan status.",
        note: "Gunakan slug status yang tersedia di Anichin, mis. ongoing.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/sub/:sub",
        query: "?page=1",
        resolvedPath: "/api/anichin/manga/sub/sub",
        desc: "Anime berdasarkan subtitle.",
        note: "Gunakan slug subtitle yang tersedia di Anichin, mis. sub.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/order/:order",
        query: "?page=1",
        resolvedPath: "/api/anichin/manga/order/popular",
        desc: "Anime berdasarkan urutan.",
        note: "Gunakan slug order yang tersedia di Anichin, mis. popular.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/studio/:studio",
        query: "?page=1",
        resolvedPath: "/api/anichin/manga/studio/cg-year",
        desc: "Anime berdasarkan studio.",
        note: "Contoh yang sudah diverifikasi: cg-year.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/az/:letter",
        query: "?page=1",
        resolvedPath: "/api/anichin/manga/az/W",
        desc: "Anime berdasarkan urutan A-Z.",
        note: "Gunakan huruf A sampai Z, mis. W atau A.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/:slug",
        resolvedPath: "/api/anichin/manga/soul-land-2-the-unrivaled-tang-sect",
        desc: "Detail anime.",
        note: "Gunakan slug yang diperoleh dari endpoint list/search. Contoh yang sudah diverifikasi: soul-land-2-the-unrivaled-tang-sect. Slug lain: battle-through-the-heavens-season-5, renegade-immortal, perfect-world, tales-of-herding-gods, swallowed-star-season-4, throne-of-seal, shrouding-the-heavens, 100000-years-of-refining-qi, a-record-of-a-mortals-journey-to-immortality.",
      },
      {
        method: "GET",
        path: "/api/anichin/episode/:slug",
        resolvedPath:
          "/api/anichin/episode/soul-land-2-the-unrivaled-tang-sect-episode-169-subtitle-indonesia",
        desc: "Detail episode.",
        note: "Gunakan slug episode yang diperoleh dari data episode anime. Contoh yang sudah diverifikasi: soul-land-2-the-unrivaled-tang-sect-episode-169-subtitle-indonesia.",
      },
      {
        method: "GET",
        path: "/api/anichin/episode/:manga/:episode",
        resolvedPath:
          "/api/anichin/episode/soul-land-2-the-unrivaled-tang-sect/169",
        desc: "Detail episode (format ringkas).",
        note: "Path membutuhkan dua parameter: slug anime lalu nomor episode. Endpoint compatibility ini sudah diaudit dan menghasilkan HTTP 200.",
      },
      {
        method: "GET",
        path: "/api/anichin/schedule",
        desc: "Jadwal rilis episode.",
        note: "Anichin memiliki halaman schedule tersendiri, dan halaman series-nya menampilkan daftar ongoing series.",
      },
      {
        method: "GET",
        path: "/api/anichin/search",
        query: "?q=renegade+immortal&page=1",
        desc: "Pencarian global Anichin.",
        note: "Mencari konten berdasarkan kata kunci dan mendukung pagination.",
      },
      {
        method: "GET",
        path: "/api/anichin/manga/options",
        desc: "Daftar seluruh opsi filter Anichin.",
        note: "Mengembalikan pilihan Popular (weekly/monthly/all), genre, season, studio, status, type, sub, order, dan daftar huruf A-Z yang dapat digunakan pada endpoint filter Anichin.",
      },
    ],
  },
  {
    id: "donghive",
    title: "🐝 Donghive",
    items: [
      {
        method: "GET",
        path: "/api/donghive",
        desc: "Info provider Donghive.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga",
        query: "?page=1",
        desc: "Daftar semua anime/donghua.",
        note: "Mendukung filter tambahan lewat query: status, type, genre, season, studio, sub, order, page. Contoh: /api/donghive/manga?page=1&status=ongoing.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/options",
        desc: "Semua filter/options yang tersedia.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/latest",
        query: "?page=1",
        desc: "Episode terbaru.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/latest-added",
        query: "?page=1",
        desc: "Anime yang baru ditambahkan.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/ongoing",
        query: "?page=1",
        desc: "Anime yang sedang tayang.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/completed",
        query: "?page=1",
        desc: "Anime yang sudah tamat.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/upcoming",
        query: "?page=1",
        desc: "Anime yang akan datang.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/hiatus",
        query: "?page=1",
        desc: "Anime yang sedang hiatus.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/popular",
        query: "?period=weekly",
        desc: "Anime populer.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/genre/:genre",
        resolvedPath: "/api/donghive/manga/genre/fantasy",
        desc: "Anime berdasarkan genre.",
        note: "Slug genre real yang ditemukan: 2d, action, adventure, cheat-system, comedy, cultivation, demons, drama, fantasy, game, game-world, historical, horor, isekai, martial-arts, mystery, op-mc, psychological, reincarnation, romance, sci-fi, super-power, supranatural, urban-fantasy, war, wuxia. Contoh lain: genre/cultivation, genre/cheat-system, genre/op-mc.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/season/:season",
        resolvedPath: "/api/donghive/manga/season/fall-2025",
        desc: "Anime berdasarkan season.",
        note: "Slug real: fall-2025, season-1 s/d season-7, season-9, season-10, summer-2024. Contoh lain: season/season-10.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/studio/:studio",
        resolvedPath: "/api/donghive/manga/studio/original-force",
        desc: "Anime berdasarkan studio.",
        note: "Beberapa slug real: b-camy-pictures, build-dream, byment, cg-year, cloud-art, dc-impression-vision, foch-film, honglu-technology, huananwei-digital-animation, liliyabi-company-introduction, lx-animation-studio, october-media, original-force, qing-xiang, qiyuan-yinghua, rocen, ruo-hong-culture, sanghai-foch-film-culture-investment, shanghai-foch-film, shanghai-motion-magic, shenman-entertaintment, shenman-entertainment, soyep, suoyi-technology, wawayu-animation, wonder-cat-animation, xiaoming-taiji, yien-animation-studio, yosep. Contoh lain: studio/shenman-entertainment.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/status/:status",
        resolvedPath: "/api/donghive/manga/status/ongoing",
        desc: "Anime berdasarkan status.",
        note: "Slug real: ongoing, completed, upcoming, hiatus. Contoh lain: status/completed.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/type/:type",
        resolvedPath: "/api/donghive/manga/type/ona",
        desc: "Anime berdasarkan type.",
        note: 'Value real dari Donghive: tv, ova, movie, live action, special, bd, ona, music. Perhatikan value "live action" memang mengandung spasi karena itu value asli dari filter Donghive. Contoh lain: type/movie, type/special.',
      },
      {
        method: "GET",
        path: "/api/donghive/manga/order/:order",
        resolvedPath: "/api/donghive/manga/order/title",
        desc: "Anime berdasarkan urutan.",
        note: "Value: title, titlereverse, update, latest, popular, rating.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/az/:letter",
        resolvedPath: "/api/donghive/manga/az/A",
        desc: "Anime berdasarkan urutan A-Z.",
        note: "Gunakan huruf A sampai Z. Contoh lain: az/B, az/Z.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/search",
        query: "?q=apotheosis",
        desc: "Mencari anime berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/donghive/manga/:slug",
        resolvedPath: "/api/donghive/manga/azure-legacy-the-deamon-hunter",
        desc: "Detail anime.",
        note: 'Slug menggunakan slug asli dari URL Donghive. Perhatikan typo bawaan Donghive: azure-legacy-the-deamon-hunter (bukan "demon-hunter") — URL aslinya memang memakai "deamon". Contoh slug lain: 100-000-years-of-refining-qi, a-good-day-to-ascend, apotheosis.',
      },
      {
        method: "GET",
        path: "/api/donghive/episode/:slug",
        resolvedPath:
          "/api/donghive/episode/azure-legacy-the-demon-hunter-episode-94-subtitle-indonesia",
        desc: "Detail episode.",
        note: "Gunakan slug episode yang diperoleh dari data episode anime. Contoh yang sudah diverifikasi: azure-legacy-the-demon-hunter-episode-94-subtitle-indonesia.",
      },
      {
        method: "GET",
        path: "/api/donghive/episode/:slug/stream",
        resolvedPath:
          "/api/donghive/episode/azure-legacy-the-demon-hunter-episode-94-subtitle-indonesia/stream",
        desc: "Link stream episode.",
      },
      {
        method: "GET",
        path: "/api/donghive/schedule",
        desc: "Jadwal rilis episode.",
      },
      {
        method: "GET",
        path: "/api/donghive/search",
        query: "?q=apotheosis",
        desc: "Pencarian global Donghive.",
      },
    ],
  },
];

const totalEndpoints = endpointGroups.reduce(
  (sum, group) => sum + group.items.length,
  0,
);
const totalProviders = endpointGroups.length;

const baseUrlExamples = [
  "/api/anichin/manga?page=1",
  "/api/anichin/episode/soul-land-2-the-unrivaled-tang-sect-episode-169-subtitle-indonesia",
];

const STABLE_PROVIDER_IDS = ["anichin"];
const RECOMMENDED_PROVIDER_ID = "anichin";

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent ?? "");

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function CopyIcon() {
  return (
    <svg
      className="api__icon"
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
      className="api__icon"
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

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
      />
    </svg>
  );
}

function ClearIcon() {
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
        d="M12 10.59 16.59 6 18 7.41 13.41 12 18 16.59 16.59 18 12 13.41 7.41 18 6 16.59 10.59 12 6 7.41 7.41 6z"
      />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`api__chevron${open ? " api__chevron--open" : ""}`}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3zm3 16H5V7h6V5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6h-2z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="api__mark">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard tidak tersedia; abaikan.
    }
  };
  return [copied, copy];
}

// Memisahkan emoji di awal title dari nama provider, tanpa mengubah
// string `title` aslinya di dalam endpointGroups.
function splitTitle(title) {
  const match = title.match(/^(\S+)\s+(.*)$/);
  if (!match) return { emoji: "", name: title };
  return { emoji: match[1], name: match[2] };
}

// ---------------------------------------------------------------------------
// Endpoint row
// ---------------------------------------------------------------------------

function EndpointRow({ item }) {
  const [open, setOpen] = useState(false);
  const [copied, copy] = useCopy();
  const requestPath = item.resolvedPath ?? item.path;
  const fullPath = `${requestPath}${item.query ?? ""}`;
  const fullUrl = `${baseUrl}${fullPath}`;
  const hasDetail = Boolean(item.query || item.resolvedPath || item.note);

  const handleOpen = () => {
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const handleRowKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    copy(fullUrl);
  };

  return (
    <li className={`api__row${open ? " api__row--open" : ""}`}>
      <div
        className="api__row-main"
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleRowKeyDown}
        aria-label={`Buka ${fullPath} di tab baru`}
      >
        <span className="api__row-method">{item.method}</span>
        <code className="api__row-path">{item.path}</code>
        <span className="api__row-desc">{item.desc}</span>

        <span className="api__row-actions">
          {hasDetail && (
            <button
              type="button"
              className="api__iconbtn"
              onClick={handleToggle}
              aria-expanded={open}
              aria-label={open ? "Sembunyikan detail" : "Lihat detail endpoint"}
            >
              <ChevronIcon open={open} />
            </button>
          )}
          <button
            type="button"
            className="api__iconbtn"
            onClick={handleCopy}
            aria-label={`Salin endpoint ${fullPath}`}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <span className="api__iconbtn api__iconbtn--ghost" aria-hidden="true">
            <ExternalIcon />
          </span>
        </span>
      </div>

      {hasDetail && open && (
        <div className="api__row-detail">
          {item.query && (
            <p className="api__row-meta">
              <span>Query</span>
              <code>{item.query}</code>
            </p>
          )}
          {item.resolvedPath && (
            <p className="api__row-meta">
              <span>Contoh</span>
              <code>{item.resolvedPath}</code>
            </p>
          )}
          {item.note && <p className="api__row-note">{item.note}</p>}
        </div>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Provider section — tanpa dropdown, konsisten untuk semua provider.
// ---------------------------------------------------------------------------

function ProviderSection({ group, query }) {
  const isStable = STABLE_PROVIDER_IDS.includes(group.id);
  const isRecommended = group.id === RECOMMENDED_PROVIDER_ID;
  const { emoji, name } = splitTitle(group.title);

  return (
    <section
      className={`api__group${isRecommended ? " api__group--recommended" : ""}`}
    >
      <div className="api__group-header">
        <span className="api__group-title">
          <span className="api__group-emoji" aria-hidden="true">
            {emoji}
          </span>
          {name}
        </span>
        <span className="api__group-id">
          #{highlightMatch(group.id, query)}
        </span>

        {isRecommended && (
          <span className="api__badge api__badge--recommended">
            Rekomendasi utama
          </span>
        )}
        {!isRecommended && isStable && (
          <span className="api__badge api__badge--stable">Stable</span>
        )}

        <span className="api__group-count">{group.items.length} endpoint</span>
      </div>

      <ul className="api__rows">
        {group.items.map((item) => (
          <EndpointRow item={item} key={item.path} />
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Base URL capsule
// ---------------------------------------------------------------------------

function BaseUrlExample({ path }) {
  const [copied, copy] = useCopy();
  const fullUrl = `${baseUrl}${path}`;
  return (
    <li className="api__example">
      <code>{fullUrl}</code>
      <button
        type="button"
        className="api__iconbtn"
        onClick={() => copy(fullUrl)}
        aria-label={`Salin contoh URL ${fullUrl}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DonghuaApi() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) || "dark";
    } catch {
      return "dark";
    }
  });
  const [baseCopied, copyBase] = useCopy();
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Abaikan kalau localStorage tidak bisa ditulis.
    }
  }, [theme]);

  // Ctrl+K / Cmd+K memfokuskan search box.
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isShortcut =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const trimmedQuery = query.trim();

  const filteredGroups = useMemo(() => {
    if (!trimmedQuery) return endpointGroups;
    const q = trimmedQuery.toLowerCase();
    return endpointGroups.filter((group) => group.id.toLowerCase().includes(q));
  }, [trimmedQuery]);

  const resultEndpointCount = useMemo(
    () => filteredGroups.reduce((sum, group) => sum + group.items.length, 0),
    [filteredGroups],
  );

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

  return (
    <section
      id="donghua-api"
      data-theme={theme}
      className="api"
      aria-labelledby="donghua-api-heading"
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
        {/* ---------------------------------------------------------- Hero */}
        <header className="api__hero">
          <div className="api__hero-signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h2 id="donghua-api-heading" className="api__heading">
            SENP4II Donghua API
          </h2>
          <p className="api__description">
            REST API yang menyuplai data anime/donghua dari beberapa provider,
            dimulai dengan Anichin.
          </p>

          <div className="api__base">
            <div className="api__base-row">
              <span className="api__base-label">Base URL</span>
              <code className="api__base-url">{baseUrl}</code>
              <button
                type="button"
                className="api__copy-base"
                onClick={() => copyBase(baseUrl)}
              >
                {baseCopied ? <CheckIcon /> : <CopyIcon />}
                <span>{baseCopied ? "Tersalin" : "Salin"}</span>
              </button>
            </div>
            <ul className="api__examples">
              {baseUrlExamples.map((path) => (
                <BaseUrlExample path={path} key={path} />
              ))}
            </ul>
          </div>
        </header>

        {/* ---------------------------------------------------- Rate limit */}
        <div className="api__warning">
          <p className="api__warning-title">Peringatan rate limit</p>
          <div className="api__warning-grid">
            <p>
              <strong>30</strong> request / menit
            </p>
            <p>
              <strong>3</strong> peringatan sebelum ban permanen
            </p>
          </div>
          <p className="api__warning-line">
            Gunakan API dengan bijak — jangan melakukan spamming. Rate limit
            melindungi server dari serangan DDoS dan aktivitas spammer yang
            dapat mengganggu layanan untuk pengguna lain.
          </p>
          <div className="api__warning-contact">
            <p className="api__warning-contact-title">
              Ingin di-whitelist dari rate limit, atau terkena ban dan butuh
              unban gratis? Hubungi kami.
            </p>
            <div className="api__warning-contact-links">
              <a
                className="api__contact-chip"
                href="https://wa.me/6282260786248"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp · 0822-6078-6248
              </a>
              <span className="api__contact-chip">
                Discord · senpaii._28 (1215281826092810281)
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- Status panel */}
        <div className="api__status">
          <div className="api__status-row">
            <span className="api__status-label">Endpoint stable</span>
            <div className="api__status-chips">
              {STABLE_PROVIDER_IDS.map((id) => {
                const group = endpointGroups.find((g) => g.id === id);
                if (!group) return null;
                return (
                  <span
                    className={`api__chip${id === RECOMMENDED_PROVIDER_ID ? " api__chip--accent" : ""}`}
                    key={id}
                  >
                    {group.title.replace(/^\S+\s/, "")}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="api__status-row api__status-row--highlight">
            <span className="api__status-label">
              Sinyal paling stabil &amp; metadata lengkap
            </span>
            <span className="api__status-pick">
              {endpointGroups
                .find((g) => g.id === RECOMMENDED_PROVIDER_ID)
                ?.title.replace(/^\S+\s/, "") ?? "Anichin"}
            </span>
          </div>
        </div>

        {/* --------------------------------------------------------- Search */}
        <div className="api__search">
          <div className="api__search-field">
            <SearchIcon />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari provider berdasarkan id — mis. anichin..."
              aria-label="Cari endpoint API berdasarkan id provider"
              className="api__search-input"
            />
            {query ? (
              <button
                type="button"
                className="api__search-clear"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
              >
                <ClearIcon />
              </button>
            ) : (
              <kbd className="api__search-kbd">{shortcutLabel}</kbd>
            )}
          </div>
          <p className="api__search-meta">
            {trimmedQuery
              ? `${filteredGroups.length} provider · ${resultEndpointCount} endpoint cocok dengan "${trimmedQuery}"`
              : `${totalProviders} provider · ${totalEndpoints} endpoint total`}
          </p>
        </div>

        {/* --------------------------------------------------------- Groups */}
        {filteredGroups.length > 0 ? (
          <div className="api__directory">
            {filteredGroups.map((group) => (
              <ProviderSection
                key={group.id}
                group={group}
                query={trimmedQuery}
              />
            ))}
          </div>
        ) : (
          <div className="api__empty">
            <p className="api__empty-title">
              Tidak ada provider dengan id "{trimmedQuery}"
            </p>
            <p className="api__empty-hint">
              Coba kata kunci lain, misalnya sebagian nama provider.
            </p>
            <button
              type="button"
              className="api__empty-clear"
              onClick={() => setQuery("")}
            >
              Hapus pencarian
            </button>
          </div>
        )}

        <p className="api__total">
          Total {totalEndpoints} endpoint di {totalProviders} provider, termasuk
          endpoint dokumentasi.
        </p>
      </div>
    </section>
  );
}
