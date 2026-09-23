import Link from "next/link";

export default function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Site navigation">
      <Link className="site-nav-home" href="/#top" aria-label="Home">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 10.8 9-7.3 9 7.3v9.2a1 1 0 0 1-1 1h-5.2v-6.4H9.2V21H4a1 1 0 0 1-1-1v-9.2Z" />
        </svg>
        <span>Home</span>
      </Link>
    </nav>
  );
}
