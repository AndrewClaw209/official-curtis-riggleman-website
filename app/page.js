"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import RevealOnScroll from "../components/RevealOnScroll";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/officialcurtisriggleman/",
    icon: "instagram"
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/curtis.riggleman.5",
    icon: "facebook"
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@curtisriggleman?lang=en",
    icon: "tiktok"
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@OfficialCurtisRiggleman",
    icon: "youtube"
  }
];

const topTabs = [
  { label: "Merch Store", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#offers" },
  { label: "Programs", href: "#offers" },
  { label: "Sales Coaching", href: "#book-call" },
  { label: "Media", href: "/media" }
];
const leftTabs = topTabs.slice(0, 3);
const rightTabs = topTabs.slice(3);

const offers = [
  {
    title: "Sales Team Coaching",
    body: "Live training systems for sales teams that need better process, cleaner word tracks, and higher close rates.",
    bullets: ["In-store or remote", "Manager + sales rep tracks", "Weekly accountability cadence"]
  },
  {
    title: "Leadership Intensives",
    body: "High-pressure leadership sessions built to sharpen desk control, culture, and ownership standards.",
    bullets: ["GM and sales manager focus", "Objection leadership scripts", "Execution scorecards"]
  },
  {
    title: "Events + Workshops",
    body: "High-energy event format for stores and groups ready to move from motivation to measurable production.",
    bullets: ["Live role-play format", "Market-specific strategy", "On-floor implementation plans"]
  }
];

const testimonials = [
  {
    quote:
      "Curtis' training classes have greatly improved my ability to sell and close. Going with Curtis was a game changer.",
    cite: "Nick, Sales Manager"
  },
  {
    quote: "I started implementing Curtis' write-up strategy and my gross has skyrocketed.",
    cite: "Matt, New Jersey"
  },
  {
    quote:
      "Ever since we started training with Curtis' methods for phone calls, there has been an increase in repeat and service-customer sales.",
    cite: "Carlos Campos, Sales Manager"
  }
];

const ghlCalendarUrl = process.env.NEXT_PUBLIC_GHL_CALENDAR_URL;
const ghlFormUrl = process.env.NEXT_PUBLIC_GHL_FORM_URL;
const hasCalendar = Boolean(ghlCalendarUrl);
const hasForm = Boolean(ghlFormUrl);
const stickyVideoUrl =
  "https://www.youtube.com/embed/maTgs6UR_b0?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=maTgs6UR_b0";
const youtubeChannelUrl = "https://www.youtube.com/@OfficialCurtisRiggleman";
const featuredMediaVideoUrl = "https://www.youtube.com/watch?v=d9vqxQWuzSs";
const featuredMediaVideoThumb = "https://img.youtube.com/vi/d9vqxQWuzSs/maxresdefault.jpg";

function CursorPushText({ text, className = "hero-push-line" }) {
  const charsRef = useRef([]);
  const pushRadius = 160;
  const maxPush = 18;

  const resetPush = useCallback(() => {
    charsRef.current.forEach((char) => {
      if (!char) return;
      char.style.setProperty("--push-x", "0px");
      char.style.setProperty("--push-y", "0px");
    });
  }, []);

  const onPointerMove = useCallback((event) => {
    const cursorX = event.clientX;
    const cursorY = event.clientY;

    charsRef.current.forEach((char) => {
      if (!char) return;

      const rect = char.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - cursorX;
      const dy = centerY - cursorY;
      const distance = Math.hypot(dx, dy);

      if (distance > pushRadius) {
        char.style.setProperty("--push-x", "0px");
        char.style.setProperty("--push-y", "0px");
        return;
      }

      const normalizedDistance = distance / pushRadius;
      const force = (1 - normalizedDistance) ** 2;
      const unitX = dx / Math.max(distance, 0.001);
      const unitY = dy / Math.max(distance, 0.001);
      const pushX = unitX * force * maxPush;
      const pushY = unitY * force * maxPush;

      char.style.setProperty("--push-x", `${pushX.toFixed(2)}px`);
      char.style.setProperty("--push-y", `${pushY.toFixed(2)}px`);
    });
  }, []);

  return (
    <span className={className} aria-label={text} onMouseMove={onPointerMove} onMouseLeave={resetPush}>
      {Array.from(text).map((char, index) => (
        <span
          key={`${text}-${index}`}
          className="hero-push-char"
          ref={(el) => {
            charsRef.current[index] = el;
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

function SocialIcon({ type }) {
  switch (type) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-instagram">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="3.4" />
          <circle cx="16.8" cy="7.3" r="0.9" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-facebook">
          <path d="M13.9 21v-7.3h2.5l.4-3h-2.9V8.8c0-.9.3-1.5 1.6-1.5h1.4V4.7C16.2 4.6 15.7 4.6 15 4.6c-2.9 0-4.8 1.8-4.8 5v1.1H7.8v3h2.4V21h3.7Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-tiktok">
          <path d="M15.2 3.6c.7 1.2 1.8 2 3.2 2.2V8c-1.3 0-2.5-.4-3.5-1.1v5.8c0 3.3-2.6 5.7-5.9 5.7a5.8 5.8 0 0 1 0-11.6c.4 0 .9 0 1.3.1v2.7a3.1 3.1 0 0 0-1.3-.3c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.2 3-3V3.6h3.2Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-youtube">
          <rect x="3" y="6" width="18" height="12" rx="3" />
          <path d="m10 9 5 3-5 3V9Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Home() {
  return (
    <>
      <RevealOnScroll />

      <header className="hero" id="top">
        <div className="hero-shell">
          <div className="hero-topbar reveal" aria-label="Primary navigation">
            <nav className="hero-nav hero-nav-left">
              {leftTabs.map((tab) => (
                <a key={tab.label} href={tab.href}>
                  {tab.label}
                </a>
              ))}
            </nav>

            <Image
              src="/assets/logo-curtis-primary-hd.png"
              alt="Official Curtis Riggleman logo"
              width={2400}
              height={1061}
              className="hero-logo"
              priority
            />

            <nav className="hero-nav hero-nav-right">
              {rightTabs.map((tab) => (
                <a key={tab.label} href={tab.href}>
                  {tab.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="hero-stage reveal">
            <h1 className="hero-title">
              <span className="hero-title-stack">
                <span className="hero-line hero-line-accent">
                  <CursorPushText text="GET READY" />
                </span>
                <span className="hero-line hero-line-subhead">
                  <CursorPushText text="FOR CHANGE " className="hero-push-line hero-push-line-inline" />
                  <span className="hero-line-with">
                    <CursorPushText text="WITH" className="hero-push-line hero-push-line-inline" />
                  </span>
                </span>
                <span className="hero-line hero-line-name">
                  <CursorPushText text="CURTIS" />
                </span>
              </span>
              <span className="hero-line hero-line-surname">
                <CursorPushText text="RIGGLEMAN" />
              </span>
            </h1>
            <Image
              src="/assets/cutouts/curtis-hero-primary.png"
              alt="Curtis Riggleman"
              width={1365}
              height={2047}
              className="hero-cutout"
              priority
            />
          </div>

          <div className="hero-cta-row reveal">
            <a className="btn btn-gold" href="#book-call">
              Book Strategy Call
            </a>
            <a className="btn btn-outline" href="#apply-now">
              Apply For Coaching
            </a>
          </div>

          <div className="hero-social-row reveal" aria-label="Curtis social media links">
            {socialLinks.map((link) => (
              <a key={link.label} className="hero-social-link" href={link.href} target="_blank" rel="noreferrer">
                <SocialIcon type={link.icon} />
                <span className="sr-only">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      <main>
        <section className="section band reveal" id="about">
          <div className="band-grid">
            <article>
              <h2>In The Trenches, Not The Sidelines</h2>
              <p>
                Curtis leads inside real dealership operations while coaching teams nationwide. That means every
                framework is pressure-tested, not theory.
              </p>
            </article>
            <article>
              <h2>Built For Results</h2>
              <p>More appointments, tighter process, stronger confidence, higher gross, and better leadership standards.</p>
            </article>
          </div>
        </section>

        <section className="section reveal" id="offers">
          <p className="kicker">Core Offers</p>
          <h2>How Curtis Helps Teams Win</h2>
          <div className="offer-grid">
            {offers.map((offer) => (
              <article key={offer.title} className="card">
                <h3>{offer.title}</h3>
                <p>{offer.body}</p>
                <ul>
                  {offer.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section cta-band reveal" id="book-call">
          <p className="kicker">{hasCalendar ? "GO High Level Calendar" : "Calendar Placeholder"}</p>
          <h2>Book A Strategy Call</h2>
          <p>
            {hasCalendar
              ? "Live booking is active via GO High Level."
              : "Placeholder calendar is active for V1 testing. Swap in the live GHL URL when ready."}
          </p>
          {hasCalendar ? (
            <div className="embed-shell">
              <iframe
                src={ghlCalendarUrl}
                title="Book a strategy call"
                loading="lazy"
                allow="clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <div className="placeholder-shell" role="img" aria-label="Calendar placeholder preview">
              <div className="placeholder-head">
                <strong>Curtis Strategy Session</strong>
                <span>45 min</span>
              </div>
              <div className="placeholder-grid">
                <button type="button">Tue 10:00 AM</button>
                <button type="button">Tue 1:30 PM</button>
                <button type="button">Wed 9:00 AM</button>
                <button type="button">Wed 3:00 PM</button>
              </div>
              <p>Connect `NEXT_PUBLIC_GHL_CALENDAR_URL` to replace this placeholder.</p>
            </div>
          )}
        </section>

        <section className="section reveal" id="proof">
          <p className="kicker">Media</p>
          <h2>Studio Content + Social Proof</h2>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <blockquote key={item.cite}>
                <p>&quot;{item.quote}&quot;</p>
                <cite>{item.cite}</cite>
              </blockquote>
            ))}
          </div>
          <div className="media-feature-grid">
            <article className="media-card">
              <Image
                src="/assets/curtis-podcast.jpg"
                alt="Curtis in the studio"
                width={1800}
                height={1012}
                className="media-card-image"
              />
              <div className="media-card-body">
                <h3>Curtis In The Studio</h3>
                <p>Follow Curtis on YouTube for training clips, media drops, and fresh content.</p>
                <a className="btn btn-outline media-card-link" href={youtubeChannelUrl} target="_blank" rel="noreferrer">
                  Visit YouTube Channel
                </a>
              </div>
            </article>

            <article className="media-card">
              <a href={featuredMediaVideoUrl} target="_blank" rel="noreferrer" className="media-card-thumb-link">
                <img
                  src={featuredMediaVideoThumb}
                  alt="Thumbnail for Curtis Riggleman YouTube video"
                  className="media-card-image"
                  loading="lazy"
                />
              </a>
              <div className="media-card-body">
                <h3>Featured YouTube Video</h3>
                <p>Watch this highlight video with one of Curtis&apos; best thumbnails.</p>
                <a className="btn btn-gold media-card-link" href={featuredMediaVideoUrl} target="_blank" rel="noreferrer">
                  Watch This Video
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="section reveal" id="process">
          <p className="kicker">Engagement Process</p>
          <h2>Simple Path To Execution</h2>
          <ol className="steps">
            <li>
              <span>1</span>
              <div>
                <h3>Schedule The Call</h3>
                <p>Review your current process, goals, and leadership bottlenecks.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <h3>Get Your Plan</h3>
                <p>Receive a clear rollout plan for training cadence and store-level implementation.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <h3>Execute + Measure</h3>
                <p>Install word tracks, accountability, and performance checkpoints that compound over time.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="section cta-band reveal" id="apply-now">
          <p className="kicker">{hasForm ? "GO High Level Form" : "Form Placeholder"}</p>
          <h2>Apply For Coaching</h2>
          <p>
            {hasForm
              ? "Live lead capture is active via GO High Level."
              : "Placeholder lead form is active for V1 testing. Swap in the live GHL URL when ready."}
          </p>
          {hasForm ? (
            <div className="embed-shell">
              <iframe
                src={ghlFormUrl}
                title="Coaching application form"
                loading="lazy"
                allow="clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <div className="placeholder-shell" role="img" aria-label="Lead form placeholder preview">
              <div className="placeholder-head">
                <strong>Coaching Application</strong>
                <span>V1 Preview</span>
              </div>
              <div className="placeholder-fields">
                <div>Full Name</div>
                <div>Best Phone</div>
                <div>Dealership / Team</div>
                <div>Biggest Sales Bottleneck</div>
              </div>
              <button type="button" className="btn btn-gold placeholder-submit">
                Submit Application
              </button>
              <p>Connect `NEXT_PUBLIC_GHL_FORM_URL` to replace this placeholder.</p>
            </div>
          )}
        </section>
      </main>

      <aside className="sticky-video" aria-label="Featured Curtis video">
        <iframe
          src={stickyVideoUrl}
          title="Curtis Riggleman featured video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </aside>

      <footer className="footer">
        <Image
          src="/assets/logo-curtis-primary-hd.png"
          alt="Official Curtis Riggleman logo"
          width={2400}
          height={1061}
          className="footer-logo"
        />
        <p>Official Curtis Riggleman</p>
        <p>Built by AWEVO Software Solutions</p>
      </footer>
    </>
  );
}
