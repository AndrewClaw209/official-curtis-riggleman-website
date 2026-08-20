import Link from "next/link";

const ghlSalesCoachingFormUrl = process.env.NEXT_PUBLIC_GHL_SALES_COACHING_FORM_URL;
const coachingVideoId = "4gLWpkYZCRo";

const curtisBio =
  "Curtis Riggleman is a successful Director of Operations who currently manages several dealerships in Central California. He is the ONLY sales trainer who is currently working in the auto industry. He came from a background of poverty. Through determination and a winning attitude, he made his way to the top of his field. His passion is to empower new salesmen and sales managers to confidently engage customers and level up their income.";

export default function SalesCoachingPage() {
  return (
    <main className="sales-coaching-page">
      <header className="sales-coaching-header">
        <Link className="home-button" href="/#top" aria-label="Home">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 10.8 9-7.3 9 7.3v9.2a1 1 0 0 1-1 1h-5.2v-6.4H9.2V21H4a1 1 0 0 1-1-1v-9.2Z" />
          </svg>
        </Link>
      </header>

      <section className="sales-coaching-hero">
        <p className="kicker">Sales Coaching With Curtis Riggleman</p>
        <h1>Build a Sales Team That Wins</h1>
        <p className="sales-coaching-lede">
          Learn the real-world systems, mindset, and word tracks Curtis uses in the dealership every day to help salespeople and managers perform at a higher level.
        </p>
        <div className="sales-coaching-video">
          <iframe
            src={`https://www.youtube.com/embed/${coachingVideoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1`}
            title="Curtis Riggleman explains his sales coaching program"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section className="sales-coaching-about" aria-labelledby="about-curtis-title">
        <p className="kicker">The Coach Behind the System</p>
        <h2 id="about-curtis-title">Learn From Someone Still In The Arena</h2>
        <p>{curtisBio}</p>
      </section>

      <section className="sales-coaching-signup" id="sales-coaching-form" aria-labelledby="sales-coaching-form-title">
        <p className="kicker">Take the Next Step</p>
        <h2 id="sales-coaching-form-title">Get Started With Curtis</h2>
        <p>Leave your information below and the team will be in touch about the sales coaching program.</p>
        {ghlSalesCoachingFormUrl ? (
          <iframe
            className="sales-coaching-form"
            src={ghlSalesCoachingFormUrl}
            title="Sign up for Curtis Riggleman sales coaching"
            loading="lazy"
          />
        ) : (
          <div className="sales-coaching-form-placeholder">
            <p>GHL signup form coming soon.</p>
            <small>Add the form URL as NEXT_PUBLIC_GHL_SALES_COACHING_FORM_URL to activate the signup form.</small>
          </div>
        )}
      </section>
    </main>
  );
}
