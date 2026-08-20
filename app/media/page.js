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
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1`;
}

export default function MediaPage() {
  const [activeShort, setActiveShort] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [visibleShorts, setVisibleShorts] = useState(5);
  const carouselViewportRef = useRef(null);

  const maxShortIndex = shortsVideoIds.length - visibleShorts;

  useEffect(() => {
    const updateVisibleShorts = () => {
      const nextVisibleShorts = window.innerWidth <= 700 ? 2 : window.innerWidth <= 1000 ? 3 : 5;
      setVisibleShorts(nextVisibleShorts);
      setActiveShort((current) => Math.min(current, shortsVideoIds.length - nextVisibleShorts));
    };

    updateVisibleShorts();
    window.addEventListener("resize", updateVisibleShorts);
    return () => window.removeEventListener("resize", updateVisibleShorts);
  }, []);

  useEffect(() => {
    const viewport = carouselViewportRef.current;
    const card = viewport?.querySelectorAll(".media-short-video-shell")[activeShort];
    if (!viewport || !card) return;

    viewport.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, [activeShort, visibleShorts]);

  const showPrevious = () => {
    setActiveShort((current) => current <= 0 ? maxShortIndex : current - 1);
  };

  const showNext = () => {
    setActiveShort((current) => current >= maxShortIndex ? 0 : current + 1);
  };

  useEffect(() => {
    const carouselTimer = window.setInterval(() => {
      setActiveShort((current) => current >= maxShortIndex ? 0 : current + 1);
    }, 6500);

    return () => window.clearInterval(carouselTimer);
  }, [maxShortIndex]);

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

        <section className="media-shorts" aria-labelledby="shorts-title">
          <div className="media-section-heading media-shorts-heading">
            <div>
              <p className="kicker">Quick Hits</p>
              <h2 id="shorts-title">Curtis Shorts</h2>
            </div>
            <a className="media-inline-link" href={youtubeChannelUrl} target="_blank" rel="noreferrer">
              All shorts on YouTube
            </a>
          </div>

          <div
            className="media-carousel"
            aria-roledescription="carousel"
            aria-label="Curtis shorts carousel"
          >
            <button type="button" className="media-carousel-arrow" onClick={showPrevious} aria-label="Previous short">
              <span aria-hidden="true">&#8592;</span>
            </button>
            <div className="media-carousel-stage">
              <div className="media-carousel-viewport" ref={carouselViewportRef}>
                <div className="media-carousel-track">
                  {shortsVideoIds.map((videoId, index) => (
                    <div className={`media-short-video-shell${activeShort === index ? " is-active" : ""}`} key={videoId}>
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
              <p className="media-carousel-count">
                Showing {String(activeShort + 1).padStart(2, "0")}–{String(Math.min(activeShort + visibleShorts, shortsVideoIds.length)).padStart(2, "0")} <span>/</span> {String(shortsVideoIds.length).padStart(2, "0")}
              </p>
            </div>
            <button type="button" className="media-carousel-arrow" onClick={showNext} aria-label="Next short">
              <span aria-hidden="true">&#8594;</span>
            </button>
          </div>

          <div className="media-carousel-dots" role="tablist" aria-label="Choose a short group">
            {Array.from({ length: maxShortIndex + 1 }, (_, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeShort === index}
                aria-label={`Show shorts ${index + 1} through ${Math.min(index + visibleShorts, shortsVideoIds.length)}`}
                className={`media-carousel-dot${activeShort === index ? " is-active" : ""}`}
                key={index}
                onClick={() => setActiveShort(index)}
              />
            ))}
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
