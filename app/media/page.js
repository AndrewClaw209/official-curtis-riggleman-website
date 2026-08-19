"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const leftTabs = [
  { label: "Merch Store", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Events", href: "/#offers" }
];

const rightTabs = [
  { label: "Programs", href: "/#offers" },
  { label: "Sales Coaching", href: "/#book-call" },
  { label: "Media", href: "/media" }
];

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

const shortsTrackIds = [...shortsVideoIds, ...shortsVideoIds];

function getShortEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}`;
}

function getShortThumbUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function ShortsCard({ videoId, index, rootRef }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    const root = rootRef.current;
    if (!element || !root) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { root, threshold: 0.35, rootMargin: "120px 0px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootRef]);

  return (
    <article className="media-short-card" ref={cardRef}>
      {isVisible ? (
        <iframe
          src={getShortEmbedUrl(videoId)}
          title={`Curtis Riggleman short ${index + 1}`}
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <a
          className="media-short-poster"
          href={`https://www.youtube.com/shorts/${videoId}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open Curtis Riggleman short ${index + 1} on YouTube`}
        >
          <img src={getShortThumbUrl(videoId)} alt="" loading="lazy" decoding="async" />
          <span>Loading short...</span>
        </a>
      )}
    </article>
  );
}

export default function MediaPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const shortsMaskRef = useRef(null);

  useEffect(() => {
    if (!isBookingModalOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsBookingModalOpen(false);
      }
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
      <header className="media-page-header" id="top">
        <div className="media-header-shell">
          <a className="home-button media-home-button" href="/#top" aria-label="Home">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3 10.8 9-7.3 9 7.3v9.2a1 1 0 0 1-1 1h-5.2v-6.4H9.2V21H4a1 1 0 0 1-1-1v-9.2Z" />
            </svg>
          </a>

          <div className="hero-topbar media-topbar" aria-label="Primary navigation">
            <nav className="hero-nav hero-nav-left">
              {leftTabs.map((tab) => (
                <a key={tab.label} href={tab.href}>
                  {tab.label}
                </a>
              ))}
            </nav>

            <a href="/#top" aria-label="Back to homepage">
              <Image
                src="/assets/logo-curtis-transparent.png"
                alt="Official Curtis Riggleman logo"
                width={1024}
                height={1024}
                className="hero-logo"
                priority
              />
            </a>

            <nav className="hero-nav hero-nav-right">
              {rightTabs.map((tab) => (
                <a key={tab.label} href={tab.href} className={tab.label === "Media" ? "is-active" : undefined}>
                  {tab.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="media-page-main">
        <section className="media-hero">
          <div className="media-hero-content">
            <p className="kicker">Curtis Media</p>
            <h1>Watch Curtis In Action</h1>
            <p>
              Straight from the studio to the showroom floor. Tap into training clips, full episodes, and high-impact
              content built for sales teams.
            </p>
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

        <section className="media-shorts" aria-label="Curtis YouTube shorts">
          <div className="media-shorts-head">
            <p className="kicker">Curtis Shorts</p>
            <a className="media-inline-link" href={youtubeChannelUrl} target="_blank" rel="noreferrer">
              See All Shorts On YouTube
            </a>
          </div>
          <div className="media-shorts-mask" ref={shortsMaskRef}>
            <div className="media-shorts-track">
              {shortsTrackIds.map((videoId, index) => (
                <ShortsCard key={`${videoId}-${index}`} videoId={videoId} index={index} rootRef={shortsMaskRef} />
              ))}
            </div>
          </div>
        </section>

        <section className="media-book-cta" aria-label="Book Curtis for podcast appearances">
          <h2 className="media-book-title">BOOK CURTIS FOR FREE</h2>
          <p className="media-book-subtext">Podcast? Hell Yeah! Send me a message</p>
          <button type="button" className="btn btn-gold" onClick={() => setIsBookingModalOpen(true)}>
            Book Podcast Appearance
          </button>
        </section>

        <section className="media-layout">
          <article className="media-feature-card">
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
            <div className="media-feature-body">
              <h2>Featured Episode</h2>
              <p>
                Watch the full episode right here without leaving the site. For more content drops, clips, and
                interviews, follow Curtis on YouTube.
              </p>
              <a className="media-inline-link" href={featuredMediaVideoUrl} target="_blank" rel="noreferrer">
                Open This Video on YouTube
              </a>
              <a className="media-inline-link" href={youtubeChannelUrl} target="_blank" rel="noreferrer">
                Follow The Channel
              </a>
            </div>
          </article>
        </section>
      </main>

      {isBookingModalOpen ? (
        <div className="media-book-modal" role="dialog" aria-modal="true" aria-label="Podcast booking form placeholder">
          <div className="media-book-modal-backdrop" onClick={() => setIsBookingModalOpen(false)} />
          <div className="media-book-modal-panel">
            <button
              type="button"
              className="media-book-modal-close"
              onClick={() => setIsBookingModalOpen(false)}
              aria-label="Close booking form"
            >
              x
            </button>
            <p className="kicker">Podcast Booking Form</p>
            <h2>Placeholder Form</h2>
            <p>This is a temporary modal placeholder until the new GoHighLevel podcast form is ready.</p>
            <div className="placeholder-shell" role="img" aria-label="Podcast booking form placeholder preview">
              <div className="placeholder-head">
                <strong>Podcast Guest Request</strong>
                <span>V1 Preview</span>
              </div>
              <div className="placeholder-fields">
                <div>Name</div>
                <div>Email</div>
                <div>Podcast Name</div>
                <div>Preferred Recording Date</div>
              </div>
              <button type="button" className="btn btn-gold placeholder-submit">
                Submit Booking Request
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="footer">
        <Image
          src="/assets/logo-curtis-transparent.png"
          alt="Official Curtis Riggleman logo"
          width={1024}
          height={1024}
          className="footer-logo"
        />
        <p>Official Curtis Riggleman</p>
        <p>Built by AWEVO Software Solutions</p>
      </footer>
    </>
  );
}
