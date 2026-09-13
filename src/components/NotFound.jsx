import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

const REDIRECT_SECONDS = 5;

function IconHome() {
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
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export default function NotFound() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate("/", { replace: true });
      return undefined;
    }
    const timer = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, navigate]);

  const handleGoHomeNow = () => {
    navigate("/", { replace: true });
  };

  return (
    <section className="notfound" aria-labelledby="notfound-heading">
      <div className="notfound__glow" aria-hidden="true" />

      <div className="notfound__container">
        <div className="notfound__signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <p className="notfound__code">404</p>

        <h1 id="notfound-heading" className="notfound__title">
          Halaman tidak ditemukan
        </h1>

        <p className="notfound__desc">
          Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau
          alamatnya salah ketik.
        </p>

        <p className="notfound__countdown" role="status" aria-live="polite">
          Otomatis kembali ke home dalam <strong>{secondsLeft}</strong> detik…
        </p>

        <div className="notfound__actions">
          <button
            type="button"
            className="notfound__btn notfound__btn--primary"
            onClick={handleGoHomeNow}
          >
            <IconHome />
            <span>Kembali ke Home</span>
          </button>
        </div>
      </div>
    </section>
  );
}
