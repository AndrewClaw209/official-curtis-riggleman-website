import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "../posts";

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: ["Curtis Riggleman"],
      section: post.category,
      tags: post.tags
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.excerpt
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main id="main-content" className="blog-post-page">
      <article className="blog-post" itemScope itemType="https://schema.org/BlogPosting">
        <header className="blog-post-header">
          <Link className="blog-back-link" href="/blog">← Back to the training blog</Link>
          <p className="blog-card-category">{post.category}</p>
          <h1 itemProp="headline">{post.title}</h1>
          <p className="blog-post-excerpt" itemProp="description">{post.excerpt}</p>
          <div className="blog-card-meta">
            <time itemProp="datePublished" dateTime={post.datePublished}>{new Date(`${post.datePublished}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            <span>{post.readTime}</span>
            <span itemProp="author">Curtis Riggleman</span>
          </div>
        </header>

        <div className="blog-post-content" itemProp="articleBody">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>
      </article>

      <section className="blog-cta blog-post-cta" aria-labelledby="blog-post-cta-title">
        <p className="kicker">Put it into practice</p>
        <h2 id="blog-post-cta-title">Build your next skill.</h2>
        <Link className="btn btn-gold" href="/training-courses">Explore Curtis&apos; training books <span aria-hidden="true">→</span></Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            url: `https://www.officialcurtisriggleman.com/blog/${post.slug}`,
            datePublished: post.datePublished,
            dateModified: post.dateModified,
            author: {
              "@type": "Person",
              name: "Curtis Riggleman",
              url: "https://www.officialcurtisriggleman.com/"
            },
            publisher: {
              "@type": "Person",
              name: "Curtis Riggleman",
              url: "https://www.officialcurtisriggleman.com/"
            },
            mainEntityOfPage: `https://www.officialcurtisriggleman.com/blog/${post.slug}`,
            keywords: post.tags.join(", ")
          })
        }}
      />
    </main>
  );
}
