const ghlSalesCoachingFormUrl =
  process.env.NEXT_PUBLIC_GHL_SALES_COACHING_FORM_URL ||
  "https://links.officialcurtisriggleman.com/widget/form/ZAA3ACp8Yq2p0LIBZgyL";
const curtisBio =
  "Curtis Riggleman is a successful Director of Operations who currently manages several dealerships in Central California. He is the ONLY sales trainer who is currently working in the auto industry. He came from a background of poverty. Through determination and a winning attitude, he made his way to the top of his field. His passion is to empower new salesmen and sales managers to confidently engage customers and level up their income.";

export default function SalesCoachingPage() {
  return (
    <main className="sales-coaching-page">
      <section className="sales-coaching-hero">
        <p className="kicker">Sales Coaching With Curtis Riggleman</p>
        <h1>Build a Sales Team That Wins</h1>
        <p className="sales-coaching-lede">
          Learn the real-world systems, mindset, and word tracks Curtis uses in the dealership every day to help salespeople and managers perform at a higher level.
        </p>
        <div className="sales-coaching-video">
          <video
            src="/sales-coaching-video.mp4"
            title="Curtis Riggleman explains his sales coaching program"
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
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
            style={{ height: "1184px" }}
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
