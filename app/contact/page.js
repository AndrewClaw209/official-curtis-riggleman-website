import Image from "next/image";
import ContactForm from "../../components/ContactForm";

export const metadata = {
  title: "Get in Touch",
  description: "Connect with Curtis Riggleman about dealership sales coaching, leadership training, speaking, and team development.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Get in Touch with Curtis Riggleman",
    description: "Start a conversation about sales coaching, leadership training, speaking, and dealership team development.",
    url: "/contact"
  }
};

export default function ContactPage() {
  return (
    <main id="main-content" className="contact-page">
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero-copy">
          <p className="kicker">Let&apos;s build what&apos;s next</p>
          <h1 id="contact-title">Get in touch with Curtis.</h1>
          <p className="contact-hero-lede">
            Whether you&apos;re leading a sales team, building your own career, or planning your next event,
            start the conversation here.
          </p>
          <div className="contact-hero-details">
            <a href="mailto:info@officialcurtisriggleman.com">info@officialcurtisriggleman.com <span aria-hidden="true">↗</span></a>
            <span>Sales leadership. Real conversations. Better results.</span>
          </div>
        </div>
        <div className="contact-hero-portrait">
          <div className="contact-portrait-glow" aria-hidden="true" />
          <Image
            src="/assets/curtis-contact.png"
            alt="Curtis Riggleman standing with his arms crossed"
            width={400}
            height={600}
            priority
          />
          <Image
            src="/assets/logo-curtis-riggleman-clean.png"
            alt="Official Curtis Riggleman"
            width={967}
            height={400}
            className="contact-portrait-logo"
          />
        </div>
      </section>

      <section className="contact-content" aria-labelledby="contact-form-title">
        <div className="contact-form-card">
          <p className="kicker">Start here</p>
          <h2 id="contact-form-title">Tell us what you&apos;re working on.</h2>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
