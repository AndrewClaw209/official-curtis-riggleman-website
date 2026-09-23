const classHighlights = [
  {
    number: "01",
    title: "Two hours live every week",
    detail: "Show up, learn the skill, ask the question, and leave with a plan you can use on the next customer."
  },
  {
    number: "02",
    title: "Sales technique that works",
    detail: "Build a repeatable process for conversations, presentations, follow-up, and moving deals forward."
  },
  {
    number: "03",
    title: "Lead handling + objections",
    detail: "Learn how to respond with confidence when a customer hesitates, ghosts, or says the words every salesperson hears."
  },
  {
    number: "04",
    title: "Role-play in a real room",
    detail: "Practice the moments that matter with Curtis and other students before you have to perform with a live customer."
  }
];

const ghlUniversityFormUrl =
  process.env.NEXT_PUBLIC_GHL_RIGGLEMAN_UNIVERSITY_FORM_URL ||
  process.env.NEXT_PUBLIC_GHL_SALES_COACHING_FORM_URL ||
  "https://links.officialcurtisriggleman.com/widget/form/ZAA3ACp8Yq2p0LIBZgyL";

export default function RigglemanUniversityPage() {
  return (
    <main className="riggleman-university-page">
      <section className="university-video-section" aria-labelledby="university-video-title">
        <div className="university-video-shell">
          <video
            src="/riggleman-university-video.mp4"
            title="Learn about Riggleman University"
            controls
            autoPlay
            playsInline
            preload="auto"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="university-video-copy">
          <p className="kicker">The next class starts here</p>
          <h1 id="university-video-title">Welcome to Riggleman University.</h1>
          <p>
            A live online sales coaching program for people who want more confidence, more consistency, and more income from every opportunity.
          </p>
          <div className="university-actions" aria-label="Riggleman University next steps">
            <a className="university-primary" href="#university-signup">Join the next class <span aria-hidden="true">↗</span></a>
            <a className="university-secondary" href="#university-curriculum">See what you&apos;ll learn <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section className="university-intro" aria-labelledby="university-intro-title">
        <div>
          <p className="kicker">Built from the questions Curtis kept hearing</p>
          <h2 id="university-intro-title">Stop watching from the sidelines. Get in the room.</h2>
        </div>
        <p>
          Riggleman University was created for the people who asked Curtis to teach them how to sell. Every week, you get direct instruction, live examples, and a chance to work through the situations that make salespeople freeze up.
        </p>
      </section>

      <section className="university-curriculum" id="university-curriculum" aria-labelledby="university-curriculum-title">
        <div className="university-section-heading">
          <p className="kicker">What happens inside the university</p>
          <h2 id="university-curriculum-title">Learn it. Practice it. Use it.</h2>
        </div>
        <div className="university-highlight-grid">
          {classHighlights.map((highlight) => (
            <article className="university-highlight" key={highlight.number}>
              <span className="university-highlight-number">{highlight.number}</span>
              <h3>{highlight.title}</h3>
              <p>{highlight.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="university-fit" aria-labelledby="university-fit-title">
        <div>
          <p className="kicker">This is for you if...</p>
          <h2 id="university-fit-title">You&apos;re ready to sharpen your game.</h2>
        </div>
        <ul>
          <li>You are new to sales and want the right foundation.</li>
          <li>You have experience but know there is another level.</li>
          <li>You want feedback, accountability, and reps—not another video to watch alone.</li>
        </ul>
      </section>

      <section className="university-signup" id="university-signup" aria-labelledby="university-signup-title">
        <p className="kicker">Your next move</p>
        <h2 id="university-signup-title">Ready for the next class?</h2>
        <p>Send a request for the next Riggleman University class and Curtis&apos; team will follow up with the schedule and enrollment details.</p>
        <a
          className="university-primary university-signup-button"
          href={ghlUniversityFormUrl}
          target="_blank"
          rel="noreferrer"
        >
          Request class information <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
