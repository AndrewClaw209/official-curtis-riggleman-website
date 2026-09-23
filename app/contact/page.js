import Image from "next/image";
import ContactForm from "../../components/ContactForm";

const contactOptions = [
  {
    number: "01",
    title: "Sales coaching",
    detail: "Bring Curtis into your dealership, team, or leadership group."
  },
  {
    number: "02",
    title: "Speaking + events",
    detail: "Build an unforgettable room around the habits that move production."
  },
  {
    number: "03",
    title: "Training questions",
    detail: "Ask about books, courses, Riggleman University, or R U READY."
  }
];

export const metadata = {
  title: "Get in Touch | Official Curtis Riggleman",
  description: "Connect with Curtis Riggleman about sales coaching, speaking, and training."
};

export default function ContactPage() {
  return (
    <main className="contact-page">
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
            src="/assets/logo-curtis-ai.png"
            alt="Official Curtis Riggleman"
            width={993}
            height={347}
            className="contact-portrait-logo"
          />
        </div>
      </section>

      <section className="contact-content" aria-labelledby="contact-form-title">
        <div className="contact-reasons">
          <p className="kicker">What can we help with?</p>
          <h2>Make the next move count.</h2>
          <div className="contact-option-list">
            {contactOptions.map((option) => (
              <article className="contact-option" key={option.number}>
                <span>{option.number}</span>
                <div>
                  <h3>{option.title}</h3>
                  <p>{option.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="contact-form-card">
          <p className="kicker">Start here</p>
          <h2 id="contact-form-title">Tell us what you&apos;re working on.</h2>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
