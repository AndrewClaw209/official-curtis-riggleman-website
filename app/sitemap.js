import { books } from "./training-courses/books";

const siteUrl = "https://officialcurtisriggleman.com";

export default function sitemap() {
  const pages = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/training-courses", priority: 0.9, changeFrequency: "weekly" },
    { path: "/riggleman-university", priority: 0.8, changeFrequency: "monthly" },
    { path: "/sales-coaching", priority: 0.8, changeFrequency: "monthly" },
    { path: "/media", priority: 0.7, changeFrequency: "weekly" },
    { path: "/testimonies", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" }
  ];

  return [
    ...pages,
    ...books.map((book) => ({
      path: `/training-courses/${book.slug}`,
      priority: 0.8,
      changeFrequency: "monthly"
    }))
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority
  }));
}
