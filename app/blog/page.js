import Link from "next/link";
import { posts } from "./posts";

export default function BlogPage() {
  return (
    <main id="main-content" className="blog-page">
      <section className="blog-hero">
        <p className="kicker">Wednesday Training Notes</p>
        <h1>Practical sales training for the showroom floor.</h1>
        <p>
          Ideas from Curtis Riggleman&apos;s live Wednesday trainings, turned into useful lessons for salespeople,
          managers, and dealership leaders.
        </p>
      </section>

      <section className="blog-list" aria-labelledby="latest-posts-title">
        <div className="blog-section-heading">
          <p className="kicker">Latest from Curtis</p>
          <h2 id="latest-posts-title">Sales, leadership, and the next customer.</h2>
        </div>
        <div className="blog-card-grid">
          {posts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <p className="blog-card-category">{post.category}</p>
              <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
              <p>{post.excerpt}</p>
              <div className="blog-card-meta">
                <time dateTime={post.datePublished}>{new Date(`${post.datePublished}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span>{post.readTime}</span>
              </div>
              <Link className="blog-read-link" href={`/blog/${post.slug}`}>Read the training note <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="blog-cta" aria-labelledby="blog-cta-title">
        <p className="kicker">Keep building your edge</p>
        <h2 id="blog-cta-title">Want the full training library?</h2>
        <p>Explore Curtis&apos; books and practical systems for closing, leadership, objections, and phone skills.</p>
        <Link className="btn btn-gold" href="/training-courses">Explore the training books <span aria-hidden="true">→</span></Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Official Curtis Riggleman Sales Training Blog",
            description: "Weekly sales training and dealership leadership insights from Curtis Riggleman.",
            url: "https://www.officialcurtisriggleman.com/blog",
            publisher: {
              "@type": "Person",
              name: "Curtis Riggleman",
              url: "https://www.officialcurtisriggleman.com/"
            },
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: `https://www.officialcurtisriggleman.com/blog/${post.slug}`,
              datePublished: post.datePublished,
              dateModified: post.dateModified,
              description: post.excerpt
            }))
          })
        }}
      />
    </main>
  );
}
