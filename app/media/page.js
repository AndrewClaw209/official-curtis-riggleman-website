"use client";

import { useEffect, useRef, useState } from "react";

const youtubeChannelUrl = "https://www.youtube.com/@OfficialCurtisRiggleman";
const featuredMediaVideoUrl = "https://www.youtube.com/watch?v=d9vqxQWuzSs";
const featuredMediaVideoEmbedUrl = "https://www.youtube.com/embed/d9vqxQWuzSs?rel=0";
const shortsVideoIds = [
  "-3NURmSXqN8",
  "0O3PIhYK_Bs",
  "0TGZyWT9eD8",
  "1Pd1dC8k5cY",
  "2iBndcq_eMQ",
  "66nGMIXZlQA",
  "6Ht2KX-bTDU",
  "6gPpfSbBEac",
  "6hwIwjZRzC0",
  "8ExKnB5TjCs",
  "8ggYhIqdb9k",
  "9A7te9P8pRo"
];

function getShortEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}`;
}

const loopingShorts = [...shortsVideoIds, ...shortsVideoIds];

export default function MediaPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const carouselViewportRef = useRef(null);

  useEffect(() => {
    const viewport = carouselViewportRef.current;
    if (!viewport) return undefined;

    let animationFrame;
    let lastTime = performance.now();
    let isPaused = false;

    const animate = (time) => {
      const elapsed = time - lastTime;
      lastTime = time;

      if (!isPaused && viewport.scrollWidth > viewport.clientWidth) {
        viewport.scrollLeft += elapsed * 0.035;
        // The second copy follows the first, so moving back by one track width
        // keeps the carousel moving continuously without a visible reset.
        const loopPoint = viewport.scrollWidth / 2;
        if (viewport.scrollLeft >= loopPoint) {
          viewport.scrollLeft -= loopPoint;
        }
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const pause = () => { isPaused = true; };
    const resume = () => {
      isPaused = false;
      lastTime = performance.now();
    };

    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", resume);
    viewport.addEventListener("focusin", pause);
    viewport.addEventListener("focusout", resume);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      viewport.removeEventListener("mouseenter", pause);
      viewport.removeEventListener("mouseleave", resume);
      viewport.removeEventListener("focusin", pause);
      viewport.removeEventListener("focusout", resume);
    };
  }, []);

  useEffect(() => {
    if (!isBookingModalOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsBookingModalOpen(false);
    };

    document.body.classList.add("media-modal-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("media-modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isBookingModalOpen]);

  return (
    <>
      <main className="media-page-main">
        <a className="home-button media-home-button" href="/#top" aria-label="Home">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 10.8 9-7.3 9 7.3v9.2a1 1 0 0 1-1 1h-5.2v-6.4H9.2V21H4a1 1 0 0 1-1-1v-9.2Z" />
          </svg>
        </a>

        <img
          className="media-top-logo"
          src="/assets/logo-curtis-transparent.png"
          alt="Official Curtis Riggleman"
        />

        <section className="media-hero" aria-labelledby="media-title">
          <div className="media-hero-content">
            <p className="kicker">Curtis Riggleman Media</p>
            <h1 id="media-title">Watch Curtis In Action</h1>
            <p>Sales leadership, dealership training, and straight-to-the-point lessons from the showroom floor.</p>
            <div className="media-hero-cta">
              <a className="btn btn-gold" href={youtubeChannelUrl} target="_blank" rel="noreferrer">
                Visit YouTube Channel
              </a>
              <a className="btn btn-outline" href={featuredMediaVideoUrl} target="_blank" rel="noreferrer">
                Watch Featured Video
              </a>
            </div>
          </div>
        </section>

        <section className="media-shorts" aria-label="Curtis Riggleman YouTube Shorts">
          <div className="media-carousel" aria-roledescription="carousel" aria-label="Curtis shorts carousel">
            <div className="media-carousel-viewport" ref={carouselViewportRef}>
              <div className="media-carousel-track">
                {loopingShorts.map((videoId, index) => (
                  <div className="media-short-video-shell" key={`${videoId}-${index}`}>
                    <iframe
                      src={getShortEmbedUrl(videoId)}
                      title={`Curtis Riggleman short ${index + 1}`}
                      allow="autoplay; encrypted-media; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="media-feature" aria-labelledby="featured-title">
          <div className="media-section-heading">
            <p className="kicker">Featured</p>
            <h2 id="featured-title">The Curtis Riggleman Show</h2>
          </div>
          <div className="media-feature-video-shell">
            <iframe
              src={featuredMediaVideoEmbedUrl}
              title="Featured Curtis Riggleman video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </section>

        <section className="media-book-cta" aria-label="Book Curtis for podcast appearances">
          <p className="kicker">Bring Curtis To Your Show</p>
          <h2 className="media-book-title">BOOK CURTIS FOR FREE</h2>
          <p className="media-book-subtext">Podcast? Hell Yeah! Send me a message.</p>
          <button type="button" className="btn btn-gold" onClick={() => setIsBookingModalOpen(true)}>
            Book Podcast Appearance
          </button>
        </section>
      </main>

      {isBookingModalOpen ? (
        <div className="media-book-modal" role="dialog" aria-modal="true" aria-label="Podcast booking form placeholder">
          <div className="media-book-modal-backdrop" onClick={() => setIsBookingModalOpen(false)} />
          <div className="media-book-modal-panel">
            <button type="button" className="media-book-modal-close" onClick={() => setIsBookingModalOpen(false)} aria-label="Close booking form">
              ×
            </button>
            <p className="kicker">Podcast Booking Form</p>
            <h2>Placeholder Form</h2>
            <p>This is a temporary modal placeholder until the new GoHighLevel podcast form is ready.</p>
            <div className="placeholder-shell" role="img" aria-label="Podcast booking form placeholder preview">
              <div className="placeholder-head"><strong>Podcast Guest Request</strong><span>V1 Preview</span></div>
              <div className="placeholder-fields"><div>Name</div><div>Email</div><div>Podcast Name</div><div>Preferred Recording Date</div></div>
              <button type="button" className="btn btn-gold placeholder-submit">Submit Booking Request</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
