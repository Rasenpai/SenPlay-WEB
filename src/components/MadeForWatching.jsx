import { useEffect, useRef, useState } from "react";
import "./MadeForWatching.css";
import ScreenshootWatchingLibrary from "../assets/screenshot-watching-library.jpeg";
import Detail from "../assets/detail.jpeg";
import Watch from "../assets/Watch.jpeg";

const DEVICES = [
  {
    id: "left",
    variant: "left",
    src: ScreenshootWatchingLibrary,
    alt: "SenPlay library screen showing saved anime",
  },
  {
    id: "primary",
    variant: "primary",
    src: Watch,
    alt: "SenPlay video player with playback controls",
  },
  {
    id: "right",
    variant: "right",
    src: Detail,
    alt: "SenPlay home screen showing recommended titles",
  },
];

function DeviceMock({ src, alt, variant }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`device device--${variant}`}>
      <div className="device__frame">
        <div className="device__screen">
          <div aria-hidden="true" className="device__island" />
          {!imgError ? (
            <img
              src={src}
              alt={alt}
              className="device__image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="device__placeholder">
              <span>Add screenshot at</span>
              <code>{src}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MadeForWatching() {
  const sectionRef = useRef(null);

  // Reduced-motion users start already "visible" — no animation to skip mid-effect.
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

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
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className={`mfw${visible ? " mfw--visible" : ""}`}
    >
      <div className="mfw__header">
        <p className="mfw__eyebrow">MADE FOR WATCHING</p>
        <h2 className="mfw__heading">Made for watching.</h2>
        <p className="mfw__description">
          Everything you need to discover, watch, and keep track of your
          favorite anime — without the clutter.
        </p>
      </div>

      <div className="mfw__devices">
        <DeviceMock {...DEVICES[0]} />
        <DeviceMock {...DEVICES[1]} />
        <DeviceMock {...DEVICES[2]} />

        <p className="mfw__caption mfw__caption--right">
          <strong>Easy discovery</strong>
          Find what to watch next.
        </p>
      </div>
    </section>
  );
}
