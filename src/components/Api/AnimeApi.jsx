import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/AnimeApi.css";

const baseUrl = "https://api.senplay.web.id";
const THEME_STORAGE_KEY = "senplay-api-theme";

// ---------------------------------------------------------------------------
// endpointGroups — SUMBER DATA ASLI, TIDAK DIUBAH.
// Silakan tempel ulang backup `endpointGroups` Anda persis di sini
// (isi, urutan, id, title, items — semuanya sama seperti sebelumnya).
// Semua logic di bawah ini hanya MEMBACA array ini, tidak pernah menulis
// atau memodifikasinya.
//
// Catatan: emoji di awal setiap `title` diganti agar tiap provider punya
// ikon unik & relevan (bukan lagi pola lingkaran warna berulang). ID, nama
// provider, endpoint, query, note — semuanya tetap sama persis.
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
        path: "/api/otakudesu/anime/ongoing",
        query: "?page=1",
        desc: "Daftar anime yang sedang tayang.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/anime/completed",
        query: "?page=1",
        desc: "Daftar anime yang sudah tamat.",
        note: "Pagination tersedia di endpoint ini.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
        note: "Search Otakudesu saat ini tidak benar-benar melakukan pagination upstream (upstreamPaginated: false), jangan menganggap page=2 sebagai halaman berbeda.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/anime/latest",
        desc: "Episode terbaru.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/anime/genres",
        desc: "Daftar genre yang tersedia.",
      },
      {
        method: "GET",
        path: "/api/otakudesu/anime/genre/:slug",
        query: "?page=1",
        resolvedPath: "/api/otakudesu/anime/genre/action",
        desc: "Anime berdasarkan genre.",
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
        path: "/api/otakudesu/anime/:slug/batch",
        resolvedPath: "/api/otakudesu/anime/1piece-sub-indo/batch",
        desc: "Link batch download anime.",
        note: "Tidak semua anime punya batch, jangan jadikan itu patokan error.",
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

  {
    id: "animasu",
    title: "🎬 Animasu",
    items: [
      {
        method: "GET",
        path: "/api/animasu",
        desc: "Info provider Animasu.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime",
        query: "?page=1",
        desc: "Daftar anime.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/latest",
        desc: "Anime episode terbaru.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/ongoing",
        query: "?page=1",
        desc: "Daftar anime yang sedang tayang.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/completed",
        query: "?page=1",
        desc: "Daftar anime yang sudah tamat.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/upcoming",
        query: "?page=1",
        desc: "Daftar anime yang akan tayang.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/movies",
        query: "?page=1",
        desc: "Daftar anime movie.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/genres",
        desc: "Daftar genre yang tersedia.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/genre/:slug",
        query: "?page=1",
        resolvedPath: "/api/animasu/anime/genre/aksi",
        desc: "Anime berdasarkan genre.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/donghua",
        query: "?page=1",
        desc: "Daftar donghua.",
      },
      {
        method: "GET",
        path: "/api/animasu/anime/:slug",
        resolvedPath: "/api/animasu/anime/raised-by-demons-panda-li",
        desc: "Detail anime.",
        note: "Slug sebaiknya diambil dari response list/search, jangan di-hardcode karena format slug upstream bisa berbeda.",
      },
      {
        method: "GET",
        path: "/api/animasu/episode/:slug",
        resolvedPath:
          "/api/animasu/episode/nonton-raised-by-demons-panda-li-episode-1",
        desc: "Detail episode.",
        note: "Gunakan slug episode yang diperoleh dari response detail/list.",
      },
      {
        method: "GET",
        path: "/api/animasu/episode/:slug/stream",
        resolvedPath:
          "/api/animasu/episode/nonton-raised-by-demons-panda-li-episode-1/stream",
        desc: "Data stream dan mirror episode.",
      },
      {
        method: "GET",
        path: "/api/animasu/schedule",
        desc: "Jadwal tayang mingguan.",
      },
    ],
  },

  {
    id: "kusonime",
    title: "🗑️ Kusonime",
    items: [
      {
        method: "GET",
        path: "/api/kusonime",
        desc: "Info provider Kusonime.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime",
        query: "?page=1",
        desc: "Daftar anime.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/latest",
        query: "?page=1",
        desc: "Anime episode terbaru.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/genres",
        desc: "Daftar genre yang tersedia.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/genre/:slug",
        query: "?page=1",
        resolvedPath: "/api/kusonime/anime/genre/action",
        desc: "Anime berdasarkan genre.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/season/:slug",
        query: "?page=1",
        resolvedPath: "/api/kusonime/anime/season/spring-2026",
        desc: "Anime berdasarkan musim rilis.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/:slug",
        resolvedPath:
          "/api/kusonime/anime/jikuu-bouken-nuumamonjaa-subtitle-indonesia",
        desc: "Detail anime.",
        note: "Slug sebaiknya diambil dari response list/search, jangan di-hardcode karena format slug upstream bisa berbeda.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/bd",
        query: "?page=1",
        desc: "Daftar rilisan BD.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/movies",
        query: "?page=1",
        desc: "Daftar anime movie.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/ova",
        query: "?page=1",
        desc: "Daftar anime OVA.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/ona",
        query: "?page=1",
        desc: "Daftar anime ONA.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/special",
        query: "?page=1",
        desc: "Daftar anime special.",
      },
      {
        method: "GET",
        path: "/api/kusonime/anime/live-action",
        query: "?page=1",
        desc: "Daftar live-action.",
      },
    ],
  },
  {
    id: "oploverz",
    title: "📺 Oploverz",
    items: [
      {
        method: "GET",
        path: "/api/oploverz",
        desc: "Info provider Oploverz.",
      },
      {
        method: "GET",
        path: "/api/oploverz/anime",
        query: "?page=1",
        desc: "Daftar anime.",
      },
      {
        method: "GET",
        path: "/api/oploverz/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci, termasuk poster.",
      },
      {
        method: "GET",
        path: "/api/oploverz/anime/latest",
        desc: "Episode terbaru.",
      },
      {
        method: "GET",
        path: "/api/oploverz/anime/:slug",
        resolvedPath: "/api/oploverz/anime/naruto",
        desc: "Detail anime.",
        note: "Gunakan slug yang diperoleh dari endpoint list/search. Slug contoh dapat berubah mengikuti provider.",
      },
      {
        method: "GET",
        path: "/api/oploverz/episode/:slug",
        resolvedPath: "/api/oploverz/episode/naruto-episode-1",
        desc: "Detail episode.",
        note: "Gunakan slug episode yang diperoleh dari data episode.",
      },
      {
        method: "GET",
        path: "/api/oploverz/episode/:slug/stream",
        resolvedPath: "/api/oploverz/episode/naruto-episode-1/stream",
        desc: "Data stream episode.",
        note: "Gunakan slug episode yang diperoleh dari endpoint detail anime.",
      },
    ],
  },
  {
    id: "anoboy",
    title: "👦 AnoBoy",
    items: [
      {
        method: "GET",
        path: "/api/anoboy",
        desc: "Info provider AnoBoy.",
      },
      {
        method: "GET",
        path: "/api/anoboy/anime",
        query: "?page=1",
        desc: "Daftar anime.",
      },
      {
        method: "GET",
        path: "/api/anoboy/anime/search",
        query: "?q=one%20piece&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
      },
      {
        method: "GET",
        path: "/api/anoboy/anime/latest",
        desc: "15 episode terbaru.",
      },
      {
        method: "GET",
        path: "/api/anoboy/anime/:slug",
        resolvedPath: "/api/anoboy/anime/one-piece-indonesia",
        desc: "Detail anime.",
        note: "Slug sebaiknya diambil dari response list/search, jangan di-hardcode karena format slug upstream bisa berbeda.",
      },
      {
        method: "GET",
        path: "/api/anoboy/episode/:slug",
        resolvedPath: "/api/anoboy/episode/one-piece-episode-1177",
        desc: "Detail episode.",
        note: "Gunakan slug episode yang diperoleh dari data episode.",
      },
      {
        method: "GET",
        path: "/api/anoboy/episode/:slug/stream",
        resolvedPath: "/api/anoboy/episode/one-piece-episode-1177/stream",
        desc: "Data stream episode.",
        note: "Gunakan slug episode yang diperoleh dari endpoint detail anime.",
      },
      {
        method: "GET",
        path: "/api/anoboy/schedule",
        desc: "Jadwal tayang anime.",
      },
      {
        method: "GET",
        path: "/api/anoboy/random",
        desc: "Anime acak.",
      },
    ],
  },
  {
    id: "animekuindo",
    title: "🇮🇩 AnimeKuindo",

    items: [
      {
        method: "GET",
        path: "/api/animekuindo",
        desc: "Info provider AnimeKuindo.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/anime",
        query: "?page=1",
        desc: "Daftar anime.",
        note: "Mendukung filter genre dan season. Contoh: ?genre=action atau ?season=winter-2026.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/anime/search",
        query: "?q=fate&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/anime/latest",
        desc: "Episode terbaru dari AnimeKuindo.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/anime/popular",
        desc: "Anime populer dari homepage AnimeKuindo.",
        note: "Data popular mengikuti struktur homepage source AnimeKuindo.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/anime/new",
        desc: "Anime baru dirilis.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/anime/top-rating",
        desc: "Anime dengan rating tertinggi.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/anime/recommendations",
        desc: "Daftar kategori rekomendasi beserta hasil default.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/anime/recommendations/:category",
        resolvedPath: "/api/animekuindo/anime/recommendations/cgdct",
        desc: "Rekomendasi anime berdasarkan kategori.",
        note: "Gunakan slug kategori yang tersedia pada response endpoint recommendations.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/anime/:slug",
        resolvedPath: "/api/animekuindo/anime/fate-strange-fake",
        desc: "Detail anime.",
        note: "Slug sebaiknya diambil dari response endpoint anime/search atau anime list.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/episode/:slug",
        resolvedPath:
          "/api/animekuindo/episode/fate-strange-fake-episode-13-subtitle-indonesia",
        desc: "Detail episode.",
        note: "Gunakan slug episode yang diperoleh dari data episode.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/episode/:slug/stream",
        resolvedPath:
          "/api/animekuindo/episode/fate-strange-fake-episode-13-subtitle-indonesia/stream",
        desc: "Data stream episode.",
        note: "Menggunakan slug episode yang sama dengan endpoint detail episode.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/filters",
        desc: "Daftar genre dan season yang tersedia sebagai filter.",
        note: "Filter genre menggunakan slug seperti action. Filter season menggunakan slug seperti winter-2026.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/random",
        desc: "Mengambil satu anime secara acak.",
      },

      {
        method: "GET",
        path: "/api/animekuindo/schedule",
        desc: "Jadwal rilis anime AnimeKuindo.",
        note: "Response berisi jadwal berdasarkan hari serta daftar anime dengan waktu dan episode jika tersedia.",
      },
    ],
  },
  {
    id: "nimegami",
    title: "🎴 Nimegami",

    items: [
      {
        method: "GET",
        path: "/api/nimegami",
        desc: "Info provider Nimegami.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime",
        query: "?page=1",
        desc: "Daftar anime Nimegami.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
        note: "Contoh query menggunakan kata kunci naruto.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/latest",
        desc: "Daftar episode terbaru dari Nimegami.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/popular",
        desc: "Daftar anime populer dari Nimegami.",
        note: "Data mengikuti struktur popular yang tersedia pada source Nimegami.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/new",
        query: "?page=1",
        desc: "Daftar anime baru dari Nimegami.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/top-rating",
        desc: "Daftar anime dengan rating tertinggi dari Nimegami.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/recommendations",
        desc: "Daftar rekomendasi anime dari Nimegami.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/:slug",
        resolvedPath:
          "/api/nimegami/anime/argonavis-movie-ryuusei-no-obligato-sub-indo",
        desc: "Detail anime.",
        note: "Slug sebaiknya diambil dari response endpoint anime, search, atau archive.",
      },

      {
        method: "GET",
        path: "/api/nimegami/episode/:slug",
        resolvedPath:
          "/api/nimegami/episode/argonavis-movie-ryuusei-no-obligato-sub-indo",
        desc: "Detail episode.",
        note: "Gunakan slug episode yang diperoleh dari data episode anime.",
      },

      {
        method: "GET",
        path: "/api/nimegami/episode/:slug/stream",
        resolvedPath:
          "/api/nimegami/episode/argonavis-movie-ryuusei-no-obligato-sub-indo/stream",
        desc: "Data stream episode.",
        note: "Menggunakan slug episode yang sama dengan endpoint detail episode.",
      },

      {
        method: "GET",
        path: "/api/nimegami/filters",
        desc: "Daftar genre dan type yang tersedia sebagai filter.",
        note: "Genre menggunakan slug seperti action atau drama. Type menggunakan slug seperti movie atau tv.",
      },

      {
        method: "GET",
        path: "/api/nimegami/random",
        desc: "Mengambil satu anime secara acak.",
      },

      {
        method: "GET",
        path: "/api/nimegami/schedule",
        desc: "Jadwal rilis anime Nimegami.",
        note: "Response berisi jadwal berdasarkan hari serta daftar anime yang tersedia.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/az",
        query: "?letter=A&page=1",
        desc: "Daftar anime berdasarkan huruf A-Z.",
        note: "Gunakan parameter letter seperti A, B, C, dan seterusnya. Mendukung pagination.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/category/:category",
        resolvedPath: "/api/nimegami/anime/category/action",
        desc: "Daftar anime berdasarkan kategori/genre.",
        note: "Gunakan slug kategori yang tersedia pada response endpoint filters. Contoh: action atau drama.",
      },

      {
        method: "GET",
        path: "/api/nimegami/anime/type/:type",
        resolvedPath: "/api/nimegami/anime/type/movie",
        desc: "Daftar anime berdasarkan type.",
        note: "Gunakan slug type yang tersedia pada response endpoint filters. Contoh: movie atau tv.",
      },
    ],
  },
  {
    id: "winbu",
    title: "🏆 Winbu",

    items: [
      {
        method: "GET",
        path: "/api/winbu",
        desc: "Info provider Winbu.",
      },

      {
        method: "GET",
        path: "/api/winbu/anime",
        query: "?page=1",
        desc: "Daftar anime dan donghua dari Winbu.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/winbu/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
        note: "Mendukung pencarian dan pagination menggunakan parameter q dan page.",
      },

      {
        method: "GET",
        path: "/api/winbu/anime/latest",
        query: "?page=1",
        desc: "Daftar anime terbaru dari Winbu.",
        note: "Mengambil data terbaru dari archive Winbu, menyaring film dan episode, serta mendukung pagination.",
      },

      {
        method: "GET",
        path: "/api/winbu/anime/popular",
        query: "?page=1",
        desc: "Daftar anime populer dari Winbu.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/winbu/anime/:slug",
        resolvedPath: "/api/winbu/anime/thunder-3",
        desc: "Detail anime.",
        note: "Contoh menggunakan slug anime Thunder 3 yang telah diverifikasi dari Winbu.",
      },

      {
        method: "GET",
        path: "/api/winbu/episode/:slug",
        resolvedPath: "/api/winbu/episode/thunder-3-episode-1",
        desc: "Detail episode.",
        note: "Contoh menggunakan slug episode Thunder 3 yang telah diverifikasi dari Winbu.",
      },

      {
        method: "GET",
        path: "/api/winbu/episode/:slug/stream",
        resolvedPath: "/api/winbu/episode/thunder-3-episode-1/stream",
        desc: "Data stream episode.",
        note: "Mengambil player/iframe dari server streaming yang tersedia pada halaman episode Winbu.",
      },

      {
        method: "GET",
        path: "/api/winbu/film",
        query: "?page=1",
        desc: "Daftar film dari Winbu.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/winbu/film/latest",
        query: "?page=1",
        desc: "Daftar film terbaru dari Winbu.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/winbu/series",
        query: "?page=1",
        desc: "Daftar series dari Winbu.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/winbu/series/:slug",
        resolvedPath: "/api/winbu/series/perfect-crown",
        desc: "Detail series.",
        note: "Contoh menggunakan slug series Perfect Crown yang telah diverifikasi dari Winbu.",
      },

      {
        method: "GET",
        path: "/api/winbu/schedule",
        desc: "Jadwal rilis anime dari Winbu.",
        note: "Response berisi jadwal berdasarkan hari dari Senin sampai Minggu.",
      },

      {
        method: "GET",
        path: "/api/winbu/search",
        query: "?q=perfect%20crown&page=1",
        desc: "Pencarian global pada Winbu.",
        note: "Mencari konten berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "nontonanimeid",
    title: "👁️ NontonAnimeID",

    items: [
      {
        method: "GET",
        path: "/api/nontonanimeid",
        desc: "Info provider NontonAnimeID.",
      },

      {
        method: "GET",
        path: "/api/nontonanimeid/anime",
        query: "?page=1",
        desc: "Daftar anime NontonAnimeID.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/nontonanimeid/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
        note: "Contoh query menggunakan kata kunci naruto.",
      },

      {
        method: "GET",
        path: "/api/nontonanimeid/anime/latest",
        query: "?page=1",
        desc: "Daftar episode terbaru dari NontonAnimeID.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/nontonanimeid/anime/popular",
        query: "?page=1",
        desc: "Daftar anime populer dari NontonAnimeID.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/nontonanimeid/schedule",
        desc: "Jadwal rilis anime NontonAnimeID.",
        note: "Response berisi anime, episode, waktu rilis WIB, rating, views, dan genre.",
      },

      {
        method: "GET",
        path: "/api/nontonanimeid/anime/:slug",
        resolvedPath:
          "/api/nontonanimeid/anime/isekai-wa-smartphone-to-tomo-ni",
        desc: "Detail anime.",
        note: "Slug sebaiknya diambil dari response endpoint anime, search, latest, popular, atau schedule.",
      },

      {
        method: "GET",
        path: "/api/nontonanimeid/episode/:slug",
        resolvedPath:
          "/api/nontonanimeid/episode/isekai-wa-smartphone-to-tomo-ni-episode-1",
        desc: "Detail episode.",
        note: "Gunakan slug episode yang diperoleh dari data episode anime.",
      },

      {
        method: "GET",
        path: "/api/nontonanimeid/episode/:slug/stream",
        resolvedPath:
          "/api/nontonanimeid/episode/isekai-wa-smartphone-to-tomo-ni-episode-1/stream",
        desc: "Data stream episode.",
        note: "Menggunakan slug episode yang sama dengan endpoint detail episode.",
      },

      {
        method: "GET",
        path: "/api/nontonanimeid/search",
        query: "?q=naruto&page=1",
        desc: "Pencarian global NontonAnimeID.",
        note: "Mencari anime berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "animeindo",
    title: "🏝️ Animeindo",

    items: [
      {
        method: "GET",
        path: "/api/animeindo",
        desc: "Info provider Animeindo.",
      },

      {
        method: "GET",
        path: "/api/animeindo/anime",
        query: "?page=1",
        desc: "Daftar anime Animeindo.",
        note: "Berisi katalog anime Animeindo dan mendukung parameter page.",
      },

      {
        method: "GET",
        path: "/api/animeindo/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
        note: "Contoh query menggunakan kata kunci naruto.",
      },

      {
        method: "GET",
        path: "/api/animeindo/anime/latest",
        query: "?page=1",
        desc: "Daftar episode anime terbaru dari Animeindo.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/animeindo/anime/popular",
        query: "?page=1",
        desc: "Daftar anime populer dari Animeindo.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/animeindo/anime/:slug",
        resolvedPath:
          "/api/animeindo/anime/tensei-shitara-slime-datta-ken-4th-season",
        desc: "Detail anime Animeindo.",
        note: "Slug sebaiknya diambil dari response endpoint anime, search, latest, atau popular.",
      },

      {
        method: "GET",
        path: "/api/animeindo/episode/:slug",
        resolvedPath:
          "/api/animeindo/episode/tensei-shitara-slime-datta-ken-4th-season-episode-1",
        desc: "Detail episode Animeindo.",
        note: "Gunakan slug episode yang diperoleh dari data episode anime.",
      },

      {
        method: "GET",
        path: "/api/animeindo/episode/:slug/stream",
        resolvedPath:
          "/api/animeindo/episode/tensei-shitara-slime-datta-ken-4th-season-episode-1/stream",
        desc: "Data stream episode Animeindo.",
        note: "Menggunakan slug episode yang sama dengan endpoint detail episode.",
      },

      {
        method: "GET",
        path: "/api/animeindo/search",
        query: "?q=naruto&page=1",
        desc: "Pencarian global Animeindo.",
        note: "Mencari anime berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "animekompi",
    title: "💻 AnimeKompi",

    items: [
      {
        method: "GET",
        path: "/api/animekompi",
        desc: "Info provider AnimeKompi.",
      },

      {
        method: "GET",
        path: "/api/animekompi/anime",
        query: "?page=1",
        desc: "Daftar anime AnimeKompi.",
        note: "Berisi katalog anime AnimeKompi dan mendukung parameter page.",
      },

      {
        method: "GET",
        path: "/api/animekompi/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
        note: "Contoh query menggunakan kata kunci naruto.",
      },

      {
        method: "GET",
        path: "/api/animekompi/anime/latest",
        query: "?page=1",
        desc: "Daftar anime terbaru dari AnimeKompi.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/animekompi/anime/popular",
        query: "?page=1",
        desc: "Daftar anime populer dari AnimeKompi.",
        note: "Mendukung pagination menggunakan parameter page.",
      },

      {
        method: "GET",
        path: "/api/animekompi/anime/:slug",
        resolvedPath:
          "/api/animekompi/anime/tensei-shitara-slime-datta-ken-4th-season",
        desc: "Detail anime AnimeKompi.",
        note: "Slug sebaiknya diambil dari response endpoint anime, search, latest, atau popular.",
      },

      {
        method: "GET",
        path: "/api/animekompi/episode/:slug",
        resolvedPath:
          "/api/animekompi/episode/tensei-shitara-slime-datta-ken-4th-season-episode-21-subtitle-indonesia",
        desc: "Detail episode AnimeKompi.",
        note: "Gunakan slug episode yang diperoleh dari data episode anime.",
      },

      {
        method: "GET",
        path: "/api/animekompi/episode/:slug/stream",
        resolvedPath:
          "/api/animekompi/episode/tensei-shitara-slime-datta-ken-4th-season-episode-21-subtitle-indonesia/stream",
        desc: "Data stream episode AnimeKompi.",
        note: "Menggunakan slug episode yang sama dengan endpoint detail episode.",
      },

      {
        method: "GET",
        path: "/api/animekompi/schedule",
        desc: "Jadwal rilis anime AnimeKompi.",
        note: "Mengembalikan jadwal anime berdasarkan hari.",
      },

      {
        method: "GET",
        path: "/api/animekompi/search",
        query: "?q=naruto&page=1",
        desc: "Pencarian global AnimeKompi.",
        note: "Mencari anime berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "gomunime",
    title: "🎈 Gomunime",

    items: [
      {
        method: "GET",
        path: "/api/gomunime",
        desc: "Info provider Gomunime.",
      },
      {
        method: "GET",
        path: "/api/gomunime/anime",
        query: "?page=1",
        desc: "Daftar anime Gomunime.",
        note: "Berisi katalog anime Gomunime dan mendukung parameter page.",
      },
      {
        method: "GET",
        path: "/api/gomunime/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
        note: "Contoh query menggunakan kata kunci naruto.",
      },
      {
        method: "GET",
        path: "/api/gomunime/anime/latest",
        query: "?page=1",
        desc: "Daftar anime terbaru dari Gomunime.",
        note: "Mendukung pagination menggunakan parameter page.",
      },
      {
        method: "GET",
        path: "/api/gomunime/anime/popular",
        query: "?page=1",
        desc: "Daftar anime populer dari Gomunime.",
        note: "Mendukung pagination menggunakan parameter page.",
      },
      {
        method: "GET",
        path: "/api/gomunime/anime/:slug",
        resolvedPath:
          "/api/gomunime/anime/tensei-shitara-slime-datta-ken-4th-season",
        desc: "Detail anime Gomunime.",
        note: "Slug sebaiknya diambil dari response endpoint anime, search, latest, atau popular.",
      },
      {
        method: "GET",
        path: "/api/gomunime/episode/:slug",
        resolvedPath:
          "/api/gomunime/episode/tensei-shitara-slime-datta-ken-4th-season-episode-21",
        desc: "Detail episode Gomunime.",
        note: "Gunakan slug episode yang diperoleh dari data episode anime.",
      },
      {
        method: "GET",
        path: "/api/gomunime/episode/:slug/stream",
        resolvedPath:
          "/api/gomunime/episode/tensei-shitara-slime-datta-ken-4th-season-episode-21/stream",
        desc: "Data stream episode Gomunime.",
        note: "Menggunakan slug episode yang sama dengan endpoint detail episode.",
      },
      {
        method: "GET",
        path: "/api/gomunime/schedule",
        desc: "Jadwal rilis anime Gomunime.",
        note: "Endpoint jadwal Gomunime.",
      },
      {
        method: "GET",
        path: "/api/gomunime/search",
        query: "?q=naruto&page=1",
        desc: "Pencarian global Gomunime.",
        note: "Mencari anime berdasarkan kata kunci dan mendukung pagination.",
      },
    ],
  },
  {
    id: "nekopoi",
    title: "🔞 NekoPoi",

    items: [
      {
        method: "GET",
        path: "/api/nekopoi",
        desc: "Info provider NekoPoi.",
      },
      {
        method: "GET",
        path: "/api/nekopoi/anime",
        query: "?page=1",
        desc: "Daftar anime NekoPoi.",
        note: "Berisi katalog anime NekoPoi dan mendukung parameter page.",
      },
      {
        method: "GET",
        path: "/api/nekopoi/anime/search",
        query: "?q=naruto&page=1",
        desc: "Mencari anime berdasarkan kata kunci.",
        note: "Contoh query menggunakan kata kunci naruto.",
      },
      {
        method: "GET",
        path: "/api/nekopoi/anime/latest",
        query: "?page=1",
        desc: "Daftar anime terbaru dari NekoPoi.",
        note: "Mendukung pagination menggunakan parameter page.",
      },
      {
        method: "GET",
        path: "/api/nekopoi/anime/popular",
        query: "?page=1",
        desc: "Daftar anime populer dari NekoPoi.",
        note: "Mendukung pagination menggunakan parameter page.",
      },
      {
        method: "GET",
        path: "/api/nekopoi/anime/:slug",
        resolvedPath: "/api/nekopoi/anime/ano-ko-no-kawari-ni-suki-na-dake",
        desc: "Detail anime NekoPoi.",
        note: "Slug sebaiknya diambil dari response endpoint anime, search, latest, atau popular.",
      },
      {
        method: "GET",
        path: "/api/nekopoi/episode/:slug",
        resolvedPath:
          "/api/nekopoi/episode/ano-ko-no-kawari-ni-suki-na-dake-episode-2-subtitle-indonesia",
        desc: "Detail episode NekoPoi.",
        note: "Gunakan slug episode yang diperoleh dari data episode anime.",
      },
      {
        method: "GET",
        path: "/api/nekopoi/episode/:slug/stream",
        resolvedPath:
          "/api/nekopoi/episode/ano-ko-no-kawari-ni-suki-na-dake-episode-2-subtitle-indonesia/stream",
        desc: "Data stream episode NekoPoi.",
        note: "Menggunakan slug episode yang sama dengan endpoint detail episode.",
      },
      {
        method: "GET",
        path: "/api/nekopoi/schedule",
        desc: "Jadwal rilis anime NekoPoi.",
        note: "Endpoint jadwal NekoPoi.",
      },
      {
        method: "GET",
        path: "/api/nekopoi/search",
        query: "?q=naruto&page=1",
        desc: "Pencarian global NekoPoi.",
        note: "Mencari anime berdasarkan kata kunci dan mendukung pagination.",
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
  "/api/otakudesu/anime?page=1",
  "/api/otakudesu/episode/mskmctn-episode-11-sub-indo/stream",
];

// Provider yang dianggap stabil, dan satu yang jadi rekomendasi utama.
// Diambil berdasarkan `id` pada endpointGroups — tidak menyalin/menduplikasi
// data endpoint itu sendiri.
const STABLE_PROVIDER_IDS = ["otakudesu", "animasu", "winbu", "nontonanimeid"];
const RECOMMENDED_PROVIDER_ID = "nontonanimeid";

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
// Endpoint row (accordion item) — menggantikan grid card lama.
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
// Provider section — selalu tampil penuh, tidak ada dropdown/accordion.
// Setiap provider memakai pola tampilan yang sama persis.
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

export default function AnimeApi() {
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

  // Search membaca langsung dari endpointGroups berdasarkan `id`, tanpa
  // pernah memodifikasi array aslinya.
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
      id="anime-api"
      data-theme={theme}
      className="api"
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
        {/* ---------------------------------------------------------- Hero */}
        <header className="api__hero">
          <div className="api__hero-signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h2 id="anime-api-heading" className="api__heading">
            SENP4II Anime API
          </h2>
          <p className="api__description">
            REST API yang menyuplai data anime dari beberapa provider, dimulai
            dengan Samehadaku dan Otakudesu.
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
                ?.title.replace(/^\S+\s/, "") ?? "Nonton Anime ID"}
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
              placeholder="Cari provider berdasarkan id — mis. otaku, winbu, nekopoi..."
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
          endpoint dokumentasi dan health.
        </p>
      </div>
    </section>
  );
}
