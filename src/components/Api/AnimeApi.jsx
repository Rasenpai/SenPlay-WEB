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
    title: "🟣 Animasu",
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
    title: "🟠 Kusonime",
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
    title: "🟢 Oploverz",
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
    title: "🔵 AnoBoy",
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
    title: "🟡 AnimeKuindo",

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
    title: "🟣 Nimegami",

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
    title: "🟢 Winbu",

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
    title: "🟢 NontonAnimeID",

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

  // FIX: default ke true. Sebelumnya default-nya bergantung pada
  // prefers-reduced-motion + IntersectionObserver, dan kalau observer-nya
  // gagal trigger (mis. section sudah full-height saat mount pertama),
  // `visible` tidak akan pernah jadi true -> .api__container permanen
  // opacity: 0 di CSS -> halaman terlihat blank walau semua elemen ada.
  const [visible, setVisible] = useState(true);

  const [baseCopied, setBaseCopied] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) || "dark";
    } catch {
      // localStorage bisa saja diblokir (private mode / storage penuh).
      return "dark";
    }
  });

  // Animasi fade-in tetap dipertahankan sebagai progressive enhancement:
  // konten sudah default visible, observer ini cuma dipakai kalau nanti
  // mau bikin efek "muncul saat di-scroll ke section lain" — sekarang
  // tidak dipakai untuk menyembunyikan konten di awal.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Abaikan kalau localStorage tidak bisa ditulis.
    }
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
