"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";

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
      <header className="hero" id="top">
        <div className="hero-shell">
          <a className="home-button" href="#top" aria-label="Home">
            Home
          </a>

          <div className="hero-topbar reveal" aria-label="Primary navigation">
            <Image
              src="/assets/logo-curtis-primary-hd.png"
              alt="Official Curtis Riggleman logo"
              width={2400}
              height={1061}
              className="hero-logo"
              priority
            />
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
            <div className="hero-center-art" aria-hidden="true">
              <Image
                src="/assets/cutouts/curtis-hero-center.png"
                alt="Curtis Riggleman"
                width={1366}
                height={2048}
                className="hero-center-curtis"
                priority
              />
              <Image
                src="/assets/cutouts/curtis-logo-across.png"
                alt=""
                width={1024}
                height={1024}
                className="hero-center-logo"
              />
            </div>
          </div>

          <div className="hero-cta-row reveal">
            <a
              className="btn btn-gold"
              href={hasCalendar ? ghlCalendarUrl : "#"}
              target={hasCalendar ? "_blank" : undefined}
              rel={hasCalendar ? "noreferrer" : undefined}
              onClick={(e) => {
                if (hasCalendar) return;
                e.preventDefault();
                window.alert("Calendar is not configured yet. Set NEXT_PUBLIC_GHL_CALENDAR_URL.");
              }}
            >
              Book Strategy Call
            </a>
            <a
              className="btn btn-outline"
              href={hasForm ? ghlFormUrl : "#"}
              target={hasForm ? "_blank" : undefined}
              rel={hasForm ? "noreferrer" : undefined}
              onClick={(e) => {
                if (hasForm) return;
                e.preventDefault();
                window.alert("Lead form is not configured yet. Set NEXT_PUBLIC_GHL_FORM_URL.");
              }}
            >
              Apply For Coaching
            </a>
          </div>

          <div className="bottom-tabs" aria-label="Primary navigation">
            {topTabs.map((tab) => (
              <a key={tab.label} href={tab.href}>
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </header>

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
    </>
  );
}
