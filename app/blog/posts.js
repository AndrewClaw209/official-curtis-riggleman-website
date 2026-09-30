export const posts = [
  {
    slug: "why-dealership-sales-teams-need-deliberate-practice",
    title: "Why Dealership Sales Teams Need Deliberate Practice",
    excerpt:
      "The strongest sales teams do not wait for the next customer to practice. They build repeatable habits, rehearse the hard moments, and coach the process every week.",
    category: "Sales Leadership",
    tags: ["dealership training", "sales coaching", "leadership"],
    datePublished: "2026-09-30",
    dateModified: "2026-09-30",
    readTime: "5 min read",
    sections: [
      {
        heading: "Practice before the pressure arrives",
        paragraphs: [
          "A live customer should not be the first place a salesperson tries a new word track, works through an objection, or learns how to ask for the next step. The showroom is where preparation gets applied—not where preparation begins.",
          "Deliberate practice gives a team a place to slow down, try the conversation again, and receive useful feedback before the moment carries a real customer relationship and a real deal with it."
        ]
      },
      {
        heading: "Make the process repeatable",
        paragraphs: [
          "Good sales training is more than motivation. It gives a salesperson a process they can repeat: how to start the conversation, how to build value, how to uncover what matters, and how to move forward when the customer hesitates.",
          "When managers coach the same process consistently, the team gets a common language. That makes one-on-one coaching clearer and helps new salespeople become productive faster."
        ]
      },
      {
        heading: "Coach the moments that decide the deal",
        paragraphs: [
          "The most valuable coaching often happens around the moments teams tend to avoid: the first five minutes, the phone call, the internet lead, the customer who says they need to think, and the point where a salesperson asks for commitment.",
          "Use role-play to rehearse those moments. Keep the feedback specific. Then give the salesperson another repetition immediately so the correction becomes a usable skill instead of a note they forget."
        ]
      },
      {
        heading: "Build a Wednesday rhythm",
        paragraphs: [
          "A weekly training rhythm creates accountability without requiring a team to become perfect overnight. Pick one skill, teach the reason behind it, practice it, and decide how the team will apply it before the next session.",
          "That is the purpose of Curtis Riggleman’s Wednesday live training: turn practical dealership experience into skills salespeople and leaders can use in the real world."
        ]
      }
    ]
  }
];

export function getPost(slug) {
  return posts.find((post) => post.slug === slug);
}
