import { useState, useCallback } from "react";
import "../styles/About.css";
import { DISCORD_URL } from "../config/SidebarLinks";
import aboutIcon from "../assets/About/icon.png";

// TODO: ganti dengan URL asli kamu.
const GITHUB_URL = "https://github.com/Rasenpai";
const TIKTOK_URL = "https://tiktok.com/@your-username";

// Semua file .mp4 di assets/About di-scan otomatis lewat fitur glob Vite.
// Nambah file baru (mis. Tiktok6.mp4) ke folder ini otomatis ikut masuk
// ke daftar tanpa perlu ubah kode sama sekali.
const videoModules = import.meta.glob("../assets/About/*.mp4", {
  eager: true,
});
const VIDEO_SOURCES = Object.values(videoModules).map((mod) => mod.default);

// Tanggal lahir dipakai untuk menghitung umur secara dinamis — otomatis
// bertambah setiap ulang tahun tanpa perlu diubah manual tiap tahun.
const BIRTH_DATE = new Date(2008, 5, 28); // 28 Juni 2008

function calculateAge(now) {
  let age = now.getFullYear() - BIRTH_DATE.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > BIRTH_DATE.getMonth() ||
    (now.getMonth() === BIRTH_DATE.getMonth() &&
      now.getDate() >= BIRTH_DATE.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

function formatWIBClock(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
}

import { useEffect } from "react";
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function IconGithub() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.3 6.84 9.65.5.1.68-.22.68-.49 0-.24-.01-1.03-.01-1.87-2.78.62-3.37-1.22-3.37-1.22-.46-1.19-1.11-1.51-1.11-1.51-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.33 1.1 2.9.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.38-2.02 1-2.73-.1-.26-.44-1.31.1-2.73 0 0 .83-.27 2.72 1.04a9.2 9.2 0 0 1 4.96 0c1.89-1.31 2.72-1.04 2.72-1.04.54 1.42.2 2.47.1 2.73.62.71 1 1.62 1 2.73 0 3.91-2.34 4.77-4.57 5.02.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.19C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function IconDiscord() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8.5 3.5c-1.9.3-3.7 1-5.2 2C1.6 8.6 1 12.4 1.3 16.1c1.7 1.3 3.6 2.2 5.6 2.8.4-.6.8-1.3 1.1-2-.6-.2-1.2-.5-1.7-.9.1-.1.3-.2.4-.3 3.4 1.6 7.1 1.6 10.5 0 .1.1.3.2.4.3-.5.4-1.1.7-1.7.9.3.7.7 1.4 1.1 2 2-.6 3.9-1.5 5.6-2.8.4-4.4-.8-8.1-2.9-11.6-1.5-1-3.3-1.7-5.2-2l-.3.7c1.6.3 3 .9 4.3 1.6-2.7-1.4-5.7-2.1-8.9-2.1s-6.2.7-8.9 2.1c1.3-.8 2.7-1.4 4.3-1.6z" />
      <circle cx="8.5" cy="12.5" r="1.6" />
      <circle cx="15.5" cy="12.5" r="1.6" />
    </svg>
  );
}

function IconTiktok() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.5 2h-3v13.2a2.8 2.8 0 1 1-2-2.68V9.4a5.8 5.8 0 1 0 5 5.75V9.1a7.5 7.5 0 0 0 4.5 1.5V7.6a4.5 4.5 0 0 1-4.5-4.5z" />
    </svg>
  );
}

function IconSpotify() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0"
      />
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.4 14.4a.6.6 0 0 1-.83.2c-2.3-1.4-5.2-1.7-8.6-.9a.6.6 0 1 1-.28-1.17c3.7-.85 6.9-.5 9.5 1.05a.6.6 0 0 1 .21.82zm1.2-2.7a.76.76 0 0 1-1.04.25c-2.6-1.6-6.6-2.06-9.7-1.13a.76.76 0 1 1-.44-1.45c3.5-1.06 7.9-.55 10.9 1.3a.76.76 0 0 1 .28 1.03zm.1-2.8c-3.1-1.85-8.3-2.02-11.3-1.12a.9.9 0 1 1-.52-1.73c3.5-1.05 9.2-.85 12.8 1.3a.9.9 0 1 1-.98 1.55z" />
    </svg>
  );
}

function IconMovie() {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m9 9 5 3-5 3z" />
    </svg>
  );
}

function IconShuffle() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
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

// ---------------------------------------------------------------------------
// Daftar Spotify — album/track dipetakan ke embed src resmi Spotify.
// ---------------------------------------------------------------------------
const SPOTIFY_ITEMS = [
  { type: "album", id: "7A38wbAswxuZGB5aFvK9Qn", height: 352 },
  { type: "track", id: "0bKzjP0DzD02Zmcm9qNoJQ", height: 152 },
  { type: "track", id: "03fkIoNyruY4N2Pa5CqTvv", height: 152 },
  { type: "track", id: "4rcRcX35Bw3kkOYqVcjbkd", height: 152 },
  { type: "track", id: "2pC4GbI7nxoiEWUB7nUIDG", height: 152 },
];

function buildSpotifyEmbedUrl(item) {
  return `https://open.spotify.com/embed/${item.type}/${item.id}?utm_source=generator`;
}

function pickRandom(list, excludeItem) {
  const candidates = list.filter((item) => item !== excludeItem);
  const pool = candidates.length > 0 ? candidates : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function About() {
  const now = useClock();
  const age = calculateAge(now);

  const [mode, setMode] = useState("audio"); // "audio" | "video"
  const [currentSpotify, setCurrentSpotify] = useState(() =>
    pickRandom(SPOTIFY_ITEMS),
  );
  const [currentVideo, setCurrentVideo] = useState(() =>
    pickRandom(VIDEO_SOURCES),
  );

  const toggleMode = () => setMode((m) => (m === "video" ? "audio" : "video"));

  const handleShuffle = useCallback(() => {
    if (mode === "audio") {
      setCurrentSpotify((prev) => pickRandom(SPOTIFY_ITEMS, prev));
    } else {
      setCurrentVideo((prev) => pickRandom(VIDEO_SOURCES, prev));
    }
  }, [mode]);

  return (
    <section className="about" aria-labelledby="about-heading">
      <div className="about__glow" aria-hidden="true" />

      <div className="about__container">
        <header className="about__header">
          <h1 id="about-heading" className="about__name">
            SENP4II
          </h1>
          <p className="about__tagline">IT Student &amp; Network Enthusiast</p>
        </header>

        <div className="about__card">
          <div className="about__avatar">
            <img
              src={aboutIcon}
              alt="Foto profil SENPAI"
              className="about__avatar-img"
            />
          </div>

          <div className="about__card-body">
            <h2 className="about__card-title">About Me</h2>

            <p className="about__bio">
              Hey! I'm Rasena, but you can call me SENPAI.
            </p>
            <p className="about__bio">
              I'm {age} years old and currently studying Computer Science.
            </p>
            <p className="about__bio">
              I'm passionate about technology, building things, and continuously
              improving SenPlay to make your experience better.
            </p>
            <p className="about__bio">
              Thanks for being here and supporting SenPlay!
            </p>

            <div className="about__socials">
              <a
                href={GITHUB_URL}
                className="about__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <IconGithub />
              </a>
              <a
                href={DISCORD_URL}
                className="about__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
              >
                <IconDiscord />
              </a>
              <a
                href={TIKTOK_URL}
                className="about__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <IconTiktok />
              </a>
            </div>
          </div>
        </div>

        <p className="about__clock" role="status" aria-live="off">
          {formatWIBClock(now)}
        </p>

        <button type="button" className="about__mode-btn" onClick={toggleMode}>
          {mode === "video" ? "Switch to Audio Mode" : "Switch to Video Mode"}
        </button>

        <div className="about__player">
          <div className={`about__player-header about__player-header--${mode}`}>
            <span className="about__player-live">
              {mode === "audio" ? <IconSpotify /> : <IconMovie />}
              {mode === "audio" ? "Now Playing on Spotify" : "Now Playing"}
            </span>

            <button
              type="button"
              className="about__shuffle-btn"
              onClick={handleShuffle}
              disabled={mode === "video" && VIDEO_SOURCES.length <= 1}
              aria-label={
                mode === "audio"
                  ? "Ganti lagu Spotify secara acak"
                  : "Ganti video secara acak"
              }
            >
              <IconShuffle />
              <span>Acak</span>
            </button>
          </div>

          <div className="about__player-body">
            {mode === "audio" ? (
              <iframe
                key={`${currentSpotify.type}-${currentSpotify.id}`}
                className="about__spotify-frame"
                title="Spotify player"
                src={buildSpotifyEmbedUrl(currentSpotify)}
                width="100%"
                height={currentSpotify.height}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            ) : VIDEO_SOURCES.length > 0 ? (
              <video
                key={currentVideo}
                className="about__video-frame"
                src={currentVideo}
                controls
                playsInline
              />
            ) : (
              <p className="about__bio">
                Belum ada video di assets/About — tambahkan file .mp4 untuk
                menampilkannya di sini.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
