import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="site-footer-logo-link" href="/#top" aria-label="Return to the Curtis Riggleman homepage">
        <Image
          src="/assets/logo-curtis-riggleman-clean.png"
          alt="Official Curtis Riggleman"
          width={967}
          height={400}
          className="site-footer-logo"
        />
      </Link>
      <p className="site-footer-name">Official Curtis Riggleman</p>
      <p className="site-footer-credit">
        <a href="https://www.awevosoftware.com" target="_blank" rel="noreferrer">
          AWEVO Software Solutions
        </a>
      </p>
    </footer>
  );
}
