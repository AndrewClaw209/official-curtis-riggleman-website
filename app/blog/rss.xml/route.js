import { posts } from "../posts";

export const dynamic = "force-static";

export function GET() {
  const siteUrl = "https://www.officialcurtisriggleman.com";
  const items = posts.map((post) => `<item>
    <title><![CDATA[${post.title}]]></title>
    <link>${siteUrl}/blog/${post.slug}</link>
    <guid>${siteUrl}/blog/${post.slug}</guid>
    <description><![CDATA[${post.excerpt}]]></description>
    <pubDate>${new Date(`${post.datePublished}T12:00:00Z`).toUTCString()}</pubDate>
  </item>`).join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Official Curtis Riggleman Sales Training Blog</title>
  <link>${siteUrl}/blog</link>
  <description>Weekly sales training and dealership leadership insights from Curtis Riggleman.</description>
  <language>en-us</language>
  ${items}
</channel></rss>`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
}
