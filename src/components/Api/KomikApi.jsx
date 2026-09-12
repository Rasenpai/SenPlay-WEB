import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/AnimeApi.css";

const baseUrl = "https://api.senplay.web.id";
const THEME_STORAGE_KEY = "senplay-komik-api-theme";

// ---------------------------------------------------------------------------
// endpointGroups — sumber data Komik API. Silakan tambah provider baru di
// sini kalau sudah ada; logic di bawah hanya MEMBACA array ini.
// ---------------------------------------------------------------------------
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
    ],
  },

  {
    id: "komiku",
    title: "📖 Komiku",
    items: [
      {
        method: "GET",
        path: "/api/komiku",
        desc: "Info provider Komiku.",
      },
      {
        method: "GET",
        path: "/api/komiku/manga",
        query: "?page=1",
        desc: "Daftar manga.",
      },
      {
        method: "GET",
        path: "/api/komiku/manga/search",
        query: "?q=moimon&page=1",
        desc: "Mencari manga berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/komiku/manga/latest",
        query: "?page=1",
        desc: "Manga terbaru.",
      },
      {
        method: "GET",
        path: "/api/komiku/manga/:slug",
        resolvedPath: "/api/komiku/manga/moimon",
        desc: "Detail manga.",
        note: "Gunakan slug yang diperoleh dari endpoint list/search. Contoh yang sudah diverifikasi: moimon.",
      },
      {
        method: "GET",
        path: "/api/komiku/chapter/:slug",
        resolvedPath: "/api/komiku/chapter/moimon-chapter-1",
        desc: "Detail chapter.",
        note: "Gunakan slug chapter yang diperoleh dari data chapter manga. Contoh yang sudah diverifikasi: moimon-chapter-1.",
      },
      {
        method: "GET",
        path: "/api/komiku/search",
        query: "?q=moimon&page=1",
        desc: "Pencarian global Komiku.",
        note: "Mencari konten berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "bacakomik",
    title: "📗 BacaKomik",
    items: [
      {
        method: "GET",
        path: "/api/bacakomik",
        desc: "Info provider BacaKomik.",
      },
      {
        method: "GET",
        path: "/api/bacakomik/manga",
        query: "?page=1",
        desc: "Daftar manga.",
        note: "Mendukung pagination menggunakan parameter page.",
      },
      {
        method: "GET",
        path: "/api/bacakomik/manga/search",
        query: "?q=moimon&page=1",
        desc: "Mencari manga berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/bacakomik/manga/latest",
        query: "?page=1",
        desc: "Manga terbaru.",
      },
      {
        method: "GET",
        path: "/api/bacakomik/manga/popular",
        query: "?page=1",
        desc: "Manga populer.",
        note: "Mendukung pagination menggunakan parameter page.",
      },
      {
        method: "GET",
        path: "/api/bacakomik/manga/:slug",
        resolvedPath: "/api/bacakomik/manga/moimon",
        desc: "Detail manga.",
        note: "Gunakan slug yang diperoleh dari endpoint list/search. Contoh yang sudah diverifikasi: moimon.",
      },
      {
        method: "GET",
        path: "/api/bacakomik/chapter/:slug",
        resolvedPath: "/api/bacakomik/chapter/moimon-chapter-1",
        desc: "Detail chapter.",
        note: "Gunakan slug chapter yang diperoleh dari data chapter manga. Contoh yang sudah diverifikasi: moimon-chapter-1.",
      },
      {
        method: "GET",
        path: "/api/bacakomik/search",
        query: "?q=moimon&page=1",
        desc: "Pencarian global BacaKomik.",
        note: "Mencari konten berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "komikindo",
    title: "📙 KomikIndo",
    items: [
      {
        method: "GET",
        path: "/api/komikindo",
        desc: "Info provider KomikIndo.",
      },
      {
        method: "GET",
        path: "/api/komikindo/manga",
        query: "?page=1",
        desc: "Daftar manga.",
        note: "Mendukung pagination menggunakan parameter page.",
      },
      {
        method: "GET",
        path: "/api/komikindo/manga/search",
        query: "?q=days&page=1",
        desc: "Mencari manga berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/komikindo/manga/latest",
        query: "?page=1",
        desc: "Manga terbaru.",
      },
      {
        method: "GET",
        path: "/api/komikindo/manga/popular",
        query: "?page=1",
        desc: "Manga populer.",
      },
      {
        method: "GET",
        path: "/api/komikindo/manga/:slug",
        resolvedPath: "/api/komikindo/manga/229848-solo-leveling",
        desc: "Detail manga.",
        note: "Gunakan slug yang diperoleh dari endpoint list/search. Contoh yang sudah diverifikasi: days (76 chapter). Contoh slug lain di KomikIndo: sakamoto-days, watashi-no-oshi-wa-akuyaku-reijou, kimi-to-tsuzuru-utakata, tsue-to-tsurugi-no-wistoria.",
      },
      {
        method: "GET",
        path: "/api/komikindo/chapter/:slug",
        resolvedPath: "/api/komikindo/chapter/days-chapter-1",
        desc: "Detail chapter.",
        note: "Gunakan slug chapter yang diperoleh dari data chapter manga. Contoh yang sudah diverifikasi: days-chapter-1 (61 gambar), days-chapter-2.",
      },
      {
        method: "GET",
        path: "/api/komikindo/search",
        query: "?q=days&page=1",
        desc: "Pencarian global KomikIndo.",
        note: "Mencari konten berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "natsu",
    title: "📕 Natsu",
    items: [
      {
        method: "GET",
        path: "/api/natsu",
        desc: "Info provider Natsu.",
      },
      {
        method: "GET",
        path: "/api/natsu/manga",
        query: "?page=1",
        desc: "Daftar manga.",
        note: "Mendukung pagination menggunakan parameter page.",
      },
      {
        method: "GET",
        path: "/api/natsu/manga/search",
        query: "?q=sakamoto&page=1",
        desc: "Mencari manga berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/natsu/manga/latest",
        query: "?page=1",
        desc: "Manga terbaru.",
      },
      {
        method: "GET",
        path: "/api/natsu/manga/popular",
        query: "?page=1",
        desc: "Manga populer.",
      },
      {
        method: "GET",
        path: "/api/natsu/manga/:slug",
        resolvedPath: "/api/natsu/manga/sakamoto-days",
        desc: "Detail manga.",
        note: "Gunakan slug yang diperoleh dari endpoint list/search. Contoh yang sudah diverifikasi: sakamoto-days, one-piece, black-clover, the-beginning-after-the-end.",
      },
      {
        method: "GET",
        path: "/api/natsu/chapter/:manga/:slug",
        resolvedPath: "/api/natsu/chapter/sakamoto-days/chapter-1.31984",
        desc: "Detail chapter (reader).",
        note: "Manga slug dan chapter slug wajib disertakan. Contoh yang sudah PASS: /api/natsu/chapter/sakamoto-days/chapter-1.31984, /api/natsu/chapter/sakamoto-days/chapter-274.408500, /api/natsu/chapter/sakamoto-days/chapter-273.404196, /api/natsu/chapter/sakamoto-days/chapter-272.400733. Hasil test chapter-1.31984: totalImages 52, gambar pertama https://cdn.natsu.id/img/S/sakamoto-days/1/1.jpg, gambar terakhir https://cdn.natsu.id/img/S/sakamoto-days/1/52.jpg.",
      },
      {
        method: "GET",
        path: "/api/natsu/search",
        query: "?q=sakamoto&page=1",
        desc: "Pencarian global Natsu.",
        note: "Mencari konten berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "kiryuu",
    title: "🐉 Kiryuu",
    items: [
      {
        method: "GET",
        path: "/api/kiryuu",
        desc: "Info provider Kiryuu.",
      },
      {
        method: "GET",
        path: "/api/kiryuu/manga",
        query: "?page=1",
        desc: "Daftar manga.",
      },
      {
        method: "GET",
        path: "/api/kiryuu/manga/search",
        query: "?q=one+piece&page=1",
        desc: "Mencari manga berdasarkan kata kunci.",
        note: "Contoh query menggunakan kata kunci one piece, mengarah ke slug one-piece.",
      },
      {
        method: "GET",
        path: "/api/kiryuu/manga/latest",
        query: "?page=1",
        desc: "Manga terbaru.",
      },
      {
        method: "GET",
        path: "/api/kiryuu/manga/popular",
        query: "?page=1",
        desc: "Manga populer.",
      },
      {
        method: "GET",
        path: "/api/kiryuu/manga/popular-today",
        desc: "Manga populer hari ini.",
        note: "Sumber slug yang sudah diverifikasi antara lain: one-piece, solo-farming-in-the-tower, magic-emperor, god-of-martial-arts, number-one-star-instructor-master-baek, god-level-assassin, im-really-not-the-demon-gods-lackey, return-of-the-frozen-player, a-beast-hunters-way-of-life, kimi-ni-koisuru-sanshimai, martial-peak, return-of-the-devourer, jungle-juice, nano-machine, my-lucky-encounter-from-the-game-turned-into-reality, sakamoto-days.",
      },
      {
        method: "GET",
        path: "/api/kiryuu/manga/:slug",
        resolvedPath: "/api/kiryuu/manga/one-piece",
        desc: "Detail manga.",
        note: "Gunakan slug yang diperoleh dari endpoint list/search/popular-today. Contoh yang sudah diverifikasi: one-piece, magic-emperor.",
      },
      {
        method: "GET",
        path: "/api/kiryuu/chapter/:manga/:slug",
        resolvedPath: "/api/kiryuu/chapter/one-piece/chapter-100.149301",
        desc: "Detail chapter.",
        note: "Path membutuhkan dua parameter: slug manga lalu slug chapter. Slug chapter Kiryuu memakai format nomor+suffix ID (bukan cuma nomor chapter), mis. chapter-100.149301. Contoh lain yang terverifikasi untuk one-piece: chapter-1076.439073, chapter-1053.372756, chapter-814.162950, chapter-249.150867.",
      },
      {
        method: "GET",
        path: "/api/kiryuu/search",
        query: "?q=one+piece&page=1",
        desc: "Pencarian global Kiryuu.",
        note: "Mencari konten berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "shinigami",
    title: "💀 Shinigami",
    items: [
      {
        method: "GET",
        path: "/api/shinigami",
        desc: "Info provider Shinigami.",
      },
      {
        method: "GET",
        path: "/api/shinigami/manga",
        query: "?page=1",
        desc: "Semua manga/project.",
      },
      {
        method: "GET",
        path: "/api/shinigami/manga/search",
        query: "?q=one+piece&page=1",
        desc: "Mencari manga berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/shinigami/manga/latest",
        query: "?page=1",
        desc: "Manga update terbaru.",
      },
      {
        method: "GET",
        path: "/api/shinigami/manga/popular",
        query: "?page=1&filter=all_time",
        desc: "Manga populer.",
      },
      {
        method: "GET",
        path: "/api/shinigami/manga/update",
        query: "?page=1",
        desc: "Gabungan update Project + Mirror.",
      },
      {
        method: "GET",
        path: "/api/shinigami/manga/update/project",
        query: "?page=1",
        desc: "Update Project.",
      },
      {
        method: "GET",
        path: "/api/shinigami/manga/update/mirror",
        query: "?page=1",
        desc: "Update Mirror.",
      },
      {
        method: "GET",
        path: "/api/shinigami/manga/:id",
        resolvedPath:
          "/api/shinigami/manga/c0f1d049-ff7f-474d-8c6a-3a55e4c44147",
        desc: "Detail manga beserta daftar chapter.",
        note: "Shinigami memakai UUID sebagai id manga, bukan slug. Contoh yang sudah diverifikasi: c0f1d049-ff7f-474d-8c6a-3a55e4c44147 (Demonic Emperor, chapter terbaru 908), 48270276-bd79-4a46-b15e-fdd2cf5655b1 (One Piece, chapter terbaru 1193), 37e72b5f-6a11-4603-9b35-738e4a1d9997 (Lazy Prince Becomes A Genius, chapter terbaru 159), 854d243b-a912-4ce6-9a48-507911b55085 (A Beast Hunter's Way Of Life, chapter terbaru 34).",
      },
      {
        method: "GET",
        path: "/api/shinigami/chapter/:mangaId/:chapterId",
        resolvedPath:
          "/api/shinigami/chapter/c0f1d049-ff7f-474d-8c6a-3a55e4c44147/c7805577-bcc6-4af9-b6cf-26f9a8e6d08d",
        desc: "Baca chapter beserta gambar.",
        note: "Path membutuhkan dua UUID: id manga lalu id chapter. Contoh yang sudah divalidasi: Demonic Emperor chapter 908 (chapterId c7805577-bcc6-4af9-b6cf-26f9a8e6d08d), totalImages 10.",
      },
      {
        method: "GET",
        path: "/api/shinigami/search",
        query: "?q=one+piece&page=1",
        desc: "Pencarian global Shinigami.",
        note: "Mencari konten berdasarkan kata kunci dan mendukung pagination.",
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
  "/api/komiku/manga?page=1",
  "/api/komiku/chapter/moimon-chapter-1",
];

const STABLE_PROVIDER_IDS = ["kiryuu", "bacakomik", "komikindo"];
const RECOMMENDED_PROVIDER_ID = "shinigami";

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

export default function KomikApi() {
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
      id="komik-api"
      data-theme={theme}
      className="api"
      aria-labelledby="komik-api-heading"
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
          <h2 id="komik-api-heading" className="api__heading">
            SENP4II Komik API
          </h2>
          <p className="api__description">
            REST API yang menyuplai data manga/komik dari beberapa provider,
            dimulai dengan Komiku.
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
                ?.title.replace(/^\S+\s/, "") ?? "Komiku"}
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
              placeholder="Cari provider berdasarkan id — mis. komiku..."
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
