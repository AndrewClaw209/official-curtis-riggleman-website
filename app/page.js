"use client";

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
  { label: "Training Courses", href: "/training-courses" },
  { label: "Testimonies", href: "/testimonies" },
  { label: "Merch", href: "#offers" },
  { label: "Sales Coaching", href: "/sales-coaching" },
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
          <a className="home-button" href="#top" aria-label="Home">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3 10.8 9-7.3 9 7.3v9.2a1 1 0 0 1-1 1h-5.2v-6.4H9.2V21H4a1 1 0 0 1-1-1v-9.2Z" />
            </svg>
          </a>

          <div className="hero-stage reveal">
            <div className="hero-center-art">
              <Image
                src="/assets/cutouts/curtis-center-user-upload.png"
                alt="Curtis Riggleman"
                width={1366}
                height={2048}
                className="hero-center-curtis"
                priority
              />
              <Image
                src="/assets/logo-curtis-across.png"
                alt="Official Curtis Riggleman"
                width={1024}
                height={1024}
                className="hero-center-logo-across"
                priority
              />
            </div>
          </div>

        </div>
      </header>

      <nav className="bottom-tabs" aria-label="Primary navigation">
        {topTabs.map((tab) => (
          <a key={tab.label} href={tab.href}>
            {tab.label}
          </a>
        ))}
      </nav>

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
