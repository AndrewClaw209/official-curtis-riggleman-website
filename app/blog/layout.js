export const metadata = {
  title: "Sales Training Blog",
  description: "Weekly sales training, dealership leadership, closing, objection-handling, and coaching insights from Curtis Riggleman.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Sales Training Blog | Curtis Riggleman",
    description: "Practical weekly insights for dealership salespeople, managers, and leaders.",
    url: "/blog"
  }
};

export default function BlogLayout({ children }) {
  return children;
}
