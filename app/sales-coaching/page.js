const ghlSalesCoachingFormUrl =
  process.env.NEXT_PUBLIC_GHL_SALES_COACHING_FORM_URL ||
  "https://links.officialcurtisriggleman.com/widget/form/ZAA3ACp8Yq2p0LIBZgyL";

const platformModules = [
  {
    number: "01",
    title: "A–Z onboarding",
    detail: "Give new sales reps everything they need to know inside five days, before they start practicing on live customers."
  },
  {
    number: "02",
    title: "Dial for dollars",
    detail: "A practical system for 10 outbound calls that drive real traffic back to the store."
  },
  {
    number: "03",
    title: "Objections aren’t real",
    detail: "Two to three ways to work through the most common customer objections and keep the deal moving forward."
  },
  {
    number: "04",
    title: "Mastering internet",
    detail: "A clear process for turning internet leads into showroom opportunities at a higher rate."
  },
  {
    number: "05",
    title: "Social media building",
    detail: "Teach salespeople how to build a personal portfolio of success and create their own opportunities."
  },
  {
    number: "06",
    title: "Closing 101",
    detail: "The core closing skills your team needs to move confidently through the sales process."
  }
];

export default function SalesCoachingPage() {
  return (
    <main className="sales-coaching-page">
      <section className="ru-ready-hero">
        <div className="ru-ready-hero-copy">
          <p className="kicker">AI-powered sales coaching for dealerships</p>
          <h1>Stop letting your sales team practice on live customers.</h1>
          <p className="sales-coaching-lede">
            R U Ready puts 26 years of dealership knowledge and 20 years of high-level training into one AI coaching platform—so your people can get ready before the next customer walks through the door.
          </p>
          <div className="ru-ready-actions">
            <a className="ru-ready-primary" href="#sales-coaching-form">Get early access <span aria-hidden="true">↗</span></a>
            <a className="ru-ready-secondary" href="#platform">Explore the platform <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="ru-ready-hero-brand">
          <img src="/assets/ru-ready-logo.png" alt="R U Ready Sales Coaching" />
        </div>
      </section>

      <section className="ru-ready-video-section" aria-labelledby="ru-ready-video-title">
        <div className="ru-ready-section-heading">
          <p className="kicker">Built for the showroom floor</p>
          <h2 id="ru-ready-video-title">Make every rep ready to sell.</h2>
        </div>
        <div className="sales-coaching-video">
          <video
            src="/sales-coaching-video.mp4"
            title="Learn about the R U Ready sales coaching platform"
            controls
            playsInline
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <section className="ru-ready-problem" aria-labelledby="problem-title">
        <p className="kicker">The cost of being unprepared</p>
        <h2 id="problem-title">Every lost customer costs more than the deal.</h2>
        <p>
          An untrained salesperson can send a perfect customer back to their car in five minutes. The wrong hire can take months—or years—to reach their potential. R U Ready helps your team build the skills before the opportunity is live.
        </p>
      </section>

      <section className="ru-ready-platform" id="platform" aria-labelledby="platform-title">
        <div className="ru-ready-section-heading">
          <p className="kicker">One platform. The full sales process.</p>
          <h2 id="platform-title">Everything your team needs to perform.</h2>
        </div>
        <div className="ru-ready-module-grid">
          {platformModules.map((module) => (
            <article className="ru-ready-module" key={module.number}>
              <span className="ru-ready-module-number">{module.number}</span>
              <h3>{module.title}</h3>
              <p>{module.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ru-ready-hiring" aria-labelledby="hiring-title">
        <div>
          <p className="kicker">Hire with more confidence</p>
          <h2 id="hiring-title">The hiring tool that helps you see the whole candidate.</h2>
        </div>
        <p>
          Learn what is good, what to watch out for, and whether a candidate is a fit for your store. Then get five tailored questions to ask in the interview.
        </p>
      </section>

      <section className="sales-coaching-signup" id="sales-coaching-form" aria-labelledby="sales-coaching-form-title">
        <p className="kicker">Be one of the first</p>
        <h2 id="sales-coaching-form-title">Ready to make your team ready?</h2>
        <p>Fill out your information and Curtis will reach out personally with the next step.</p>
        {ghlSalesCoachingFormUrl ? (
          <iframe
            className="sales-coaching-form"
            src={ghlSalesCoachingFormUrl}
            title="Request early access to R U Ready sales coaching"
            loading="lazy"
            style={{ height: "1184px" }}
          />
        ) : (
          <div className="sales-coaching-form-placeholder">
            <p>Early access form coming soon.</p>
            <small>Add the form URL as NEXT_PUBLIC_GHL_SALES_COACHING_FORM_URL to activate the signup form.</small>
          </div>
        )}
      </section>
    </main>
  );
}
