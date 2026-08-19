export const books = [
  {
    slug: "closing-101",
    title: "Closing 101",
    image: "/books/closing_101---4b0c2195-82ef-40d2-869f-10b9037ef58e.avif",
    description:
      "There is an art to closing deals. Whether you have a closer, or a sales manager that closes, you will find my real life, time-tested, techniques for salesmen, and their closers, to close awesome deals."
  },
  {
    slug: "built-to-lead-mindset-principles",
    title: "Built To Lead: Mindset Principles",
    image: "/books/Built_to_lead---535a5aab-d631-4b68-84ad-3ab3b6f2e26a.avif",
    description:
      "These are my top 50 mindset principles for leadership. Everything in this book comes from what I've learned, applied, failed at, and improved over time. If you will commit to applying even a few of these principles consistently, you will separate yourself from the majority."
  },
  {
    slug: "the-first-five",
    title: "The First Five: On Board Sales Training",
    image: "/books/The_First_Five---35d79151-6de9-4af3-8579-c3f775fee980.avif",
    description:
      "When salespeople are properly trained, they have a much better chance of succeeding in their first three months of employment. This effectiveness is crucial to a thriving dealership. Say goodbye to high employee turnover."
  },
  {
    slug: "objections-arent-real",
    title: "Objections Aren't Real",
    image: "/books/Objections_Arent_Real---35f496a6-274c-43f3-a55f-2f74ffcdd334.avif",
    description:
      "Learn how to proactively neutralize objections by solving the underlying issues that cause customers to raise objections. Learn about the most common objections, and how to handle inside and outside objections. Learn how to avoid objections by using proactive set ups."
  },
  {
    slug: "dial-for-dollars",
    title: "Dial For Dollars",
    image: "/books/Dial_For_Dollars---6e31d2c7-e0ec-4623-a9cf-f34a472c8b20.avif",
    description:
      "Learn how to make inbound and outbound sales calls, how to proactively set appointments, and a system for obtaining referrals."
  }
];

export function getBook(slug) {
  return books.find((book) => book.slug === slug);
}
