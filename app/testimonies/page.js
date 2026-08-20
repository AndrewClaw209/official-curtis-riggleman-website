import Image from "next/image";

const stories = [
  {
    name: "Matt",
    role: "From New Jersey",
    image: "/testimonials/Matt_from_NJ---3d02d263-cfdb-4a00-8380-477fd61a1d8a.avif",
    quote:
      "I started implementing Curtis' write up strategy and my gross has sky rocketed. The strategy of giving customers hope really helps immensely! He lives this every day and is in the trenches as well and that's what makes it so real."
  },
  {
    name: "Carlos Campos",
    role: "Sales Manager",
    image: "/testimonials/Carlos_Campos_Sales_Manager---b8e3f51a-e225-439e-9b11-aa528b45ae68.avif",
    quote:
      "I have been following Curtis for a while now and his methods for selling and learning the car business are by far the best out there. In the past, making phone calls was viewed as a chore by my sales staff, and we did not receive much response. Ever since we started training with Curtis' methods for phone calls, there has been an increase of sales of repeat customers and service customers. This has brought the morale and expectations for our store to another level."
  },
  {
    name: "Matt Zapien",
    role: "General Manager",
    image: "/testimonials/Matt_Zapien_General_Manager---9d855d03-6308-4e31-96e2-333a71cdb1f6.avif",
    quote:
      "Curtis helped me take my leadership to the next level. His coaching gave me the structure, confidence, and clarity I needed to elevate my team's performance. He's taught me how to lead with purpose, communicate with impact, and bring out the best in every team member. One of the things I value most is how Curtis encourages us to train and mentor others daily, using his proven sales techniques to help everyone win. With his guidance, I've become more intentional, resilient, and consistent. We've continued to grow year after year, even while others in the industry are falling behind. That's a direct reflection of the mindset and strategy Curtis instills."
  },
  {
    name: "Adam Martinez",
    role: "Sales Manager",
    image: "/testimonials/Adam_Martinez_Sales_Manager---798f1b58-9ab8-482e-a826-720a0f494e30.avif",
    quote:
      "Curtis Riggleman is a master of his craft. His word tracks always lead to sales and income! Customer benefits and building value works! I've learned a lot over the 7 years with him. I recommend his training. His methods have brought me much success!"
  },
  {
    name: "Aaron",
    role: "Sales Manager",
    image: "/testimonials/Aaron_Sales_Manager---20ad31c5-eb65-473e-afbc-68e21a5f2c41.avif",
    quote:
      "When I first came to Hanford Hyundai, I was content with the money I made and was just there for a paycheck only. After training with Curtis, my whole mindset changed. As a manager, I still need to invest in my team and train them up. With Curtis' guidance I have leveled up as a salesman and as a trainer of my team. My guys have been selling more!! Thank you Curtis! Always trust the process even if it makes you uncomfortable."
  },
  {
    name: "Robert Tucker",
    role: "Assistant Manager",
    image: "/testimonials/Robert_Tucker_Asst_Manager---8b2f82c6-d09e-4303-b3d2-4c798adc5795.avif",
    quote:
      "Serve yourself these training techniques daily like you would a daily meal! They are vital for success in the auto industry. Great leaders and successful athletes train daily to become the best at their craft. That's what these sales strategies will do for your confidence and income. It's important that we stay knowledgeable of the way in which today's buyer thinks and reacts when they enter a dealership. He addresses how to deal with smoke screens, back door objections, and contingencies that arise during the sales process, moving forward smoothly."
  },
  {
    name: "Cody Warren",
    role: "Sales Manager",
    image: "/testimonials/Cody_Warren_Sales_Manager---aed66eef-6c30-4cac-905e-1936464b283d.avif",
    quote:
      "Curtis' training has had a lasting impact on my growth. He has helped me strengthen my management skills, but more importantly, he challenged me to think and act like a true leader. Because of his training, I've grown into a stronger manager and a more confident leader. I've been able to apply those lessons not only to my career, but to my life."
  },
  {
    name: "John Meredith",
    role: "General Manager",
    image: "/testimonials/John_Meredith_General_Manager---ea77f72c-117c-464a-b94d-6206c78b046b.avif",
    quote:
      "Curtis' methods of reframing the customer objections or smoke screens to the customer's benefit works to move the deal forward. It makes the customer feel like they are in charge while moving through the sales process. These methods empower the customer and create repeat customers. Objections are less frequent with Curtis' method."
  },
  {
    name: "Gurdeep",
    role: "Sales Manager",
    quote:
      "This training has definitely assisted me by giving me new tools to advance my skills. The car business has changed and will continue to change. It is not the same as it was when I started. I don't know of any other dealership where the general manager offers training to help his employees. Thank goodness for this training. It has helped me stay sharp and be better at my craft and adjust to the new type of buyer."
  },
  {
    name: "Matt",
    role: "Curtis community member",
    quote: "This channel is amazing!! The sales training is phenomenal...and the off the job side...cool man...truly appreciate the time put in! Thank you"
  }
];

function Initials({ name }) {
  return <span className="testimony-initials">{name.slice(0, 1)}</span>;
}

export default function TestimoniesPage() {
  return (
    <main className="testimonies-page">
      <header className="testimonies-header">
        <a className="home-button" href="/#top" aria-label="Home">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 10.8 9-7.3 9 7.3v9.2a1 1 0 0 1-1 1h-5.2v-6.4H9.2V21H4a1 1 0 0 1-1-1v-9.2Z" />
          </svg>
        </a>
      </header>

      <section className="testimonies-hero">
        <p className="kicker">Real Results</p>
        <h1>Success Stories</h1>
        <p>See how Curtis&apos; training is helping salespeople and leaders build confidence, improve process, and win more consistently.</p>
      </section>

      <section className="testimonies-list" aria-label="Curtis Riggleman testimonials">
        {stories.map((story, index) => (
          <article className="testimony-card" key={`${story.name}-${index}`}>
            <blockquote>{story.quote}</blockquote>
            <div className="testimony-author">
              <div className="testimony-avatar">
                {story.image ? <Image src={story.image} alt="" width={160} height={160} /> : <Initials name={story.name} />}
              </div>
              <div>
                <strong>{story.name}</strong>
                <span>{story.role}</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
