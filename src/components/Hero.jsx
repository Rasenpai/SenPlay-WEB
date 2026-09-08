import { useState } from "react";
import "./Hero.css";
import HeroImage from "../assets/hero-image.jpeg";

const NAVBAR_OFFSET_REM = 4;

function scrollToSection(event, href) {
  const targetId = href.replace("#", "");
  const target = document.getElementById(targetId);
  if (!target) return;

  event.preventDefault();

  const navbarOffsetPx =
    NAVBAR_OFFSET_REM *
    parseFloat(getComputedStyle(document.documentElement).fontSize);
  const top =
    target.getBoundingClientRect().top + window.scrollY - navbarOffsetPx;

  window.scrollTo({ top, behavior: "smooth" });
}

const PARTICLES = [
  { top: "18%", left: "12%", delay: "0s", duration: "22s" },
  { top: "32%", left: "78%", delay: "-4s", duration: "26s" },
  { top: "62%", left: "22%", delay: "-9s", duration: "20s" },
  { top: "75%", left: "65%", delay: "-13s", duration: "28s" },
  { top: "45%", left: "48%", delay: "-6s", duration: "24s" },
  { top: "12%", left: "58%", delay: "-17s", duration: "23s" },
];

export default function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="home" className="hero">
      <div className="hero__background" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__ambient hero__ambient--a" />
        <div className="hero__ambient hero__ambient--b" />
        <div className="hero__sweep" />
        <div className="hero__particles">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="hero__particle"
              style={{
                top: p.top,
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>
      </div>

      <div className="hero__container">
        <div className="hero__content">
          <p className="hero__eyebrow">SENPLAY</p>
          <h1 className="hero__headline">Watch. Discover. Enjoy.</h1>
          <p className="hero__description">
            A simple way to discover and enjoy the things you want to watch.
          </p>

          <div className="hero__actions">
            <a
              href="#download"
              className="hero__cta-primary"
              onClick={(e) => scrollToSection(e, "#download")}
            >
              Download SenPlay
            </a>
            <a
              href="#explore"
              className="hero__cta-secondary"
              onClick={(e) => scrollToSection(e, "#explore")}
            >
              Explore
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="phone-frame">
            <div className="phone-frame__screen">
              <div aria-hidden="true" className="phone-frame__island" />
              {!imgError ? (
                <img
                  src={HeroImage}
                  alt="SenPlay app showing titles to discover and watch"
                  className="phone-frame__image"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="phone-frame__placeholder">
                  <span>Add your app screenshot at</span>
                  <code>/public/screenshot-app.png</code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
