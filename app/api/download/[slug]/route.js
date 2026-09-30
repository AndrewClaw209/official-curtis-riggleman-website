import { createHmac, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const DOWNLOADS = {
  "closing-101": "closing-101.pdf",
  "built-to-lead-mindset-principles": "built-to-lead-mindset-principles.pdf",
  "the-first-five": "the-first-five.pdf",
  "objections-arent-real": "objections-arent-real.pdf",
  "dial-for-dollars": "dial-for-dollars.pdf",
  "the-road-to-the-sale": "the-road-to-the-sale.pdf"
};

const TITLES = {
  "closing-101": "Closing 101",
  "built-to-lead-mindset-principles": "Built to Lead: Mindset Principles",
  "the-first-five": "The First Five: On Board Sales Training",
  "objections-arent-real": "Objections Aren't Real",
  "dial-for-dollars": "Dial for Dollars",
  "the-road-to-the-sale": "The Road to the Sale"
};

function escapeHtml(value) {
  return value.replace(/[&<>\"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function validToken(slug, token, secret) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [tokenSlug, expiresAt, signature] = decoded.split(".");
    if (tokenSlug !== slug || !expiresAt || !signature || Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;
    const expected = createHmac("sha256", secret).update(`${tokenSlug}.${expiresAt}`).digest("base64url");
    const receivedBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expected, "utf8");
    return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function GET(request, { params }) {
  const filename = DOWNLOADS[params.slug];
  const secret = process.env.DIGITAL_DOWNLOAD_SECRET;
  const token = new URL(request.url).searchParams.get("token");
  if (!filename || !secret || !token || !validToken(params.slug, token, secret)) {
    return Response.json({ error: "This download link is invalid or expired." }, { status: 403 });
  }

  const requestUrl = new URL(request.url);
  const downloadUrl = `${requestUrl.pathname}?token=${encodeURIComponent(token)}&download=1`;
  const title = TITLES[params.slug];

  if (requestUrl.searchParams.get("download") !== "1") {
    const safeTitle = escapeHtml(title);
    const safeDownloadUrl = escapeHtml(downloadUrl);
    return new Response(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle} | Official Curtis Riggleman</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; background: #0d0d0d; color: #fff8e8; font-family: Arial, Helvetica, sans-serif; display: grid; place-items: center; padding: 24px; }
      main { width: min(680px, 100%); border: 1px solid #9d5100; background: #171717; box-shadow: 0 24px 70px #000b; text-align: center; overflow: hidden; }
      header { background: #0d0d0d; border-bottom: 8px solid #9d5100; padding: 36px 28px 30px; }
      .brand { display: inline-block; background: #e58200; color: #171717; padding: 8px 14px; font-size: 15px; letter-spacing: .02em; }
      h1 { color: #e58200; font-size: clamp(30px, 6vw, 52px); line-height: 1.05; margin: 34px 0 12px; text-transform: uppercase; }
      .rule { width: 130px; height: 4px; background: #e58200; margin: 22px auto; }
      section { padding: 34px 28px 40px; }
      p { color: #f0dfbf; font-size: 18px; line-height: 1.5; margin: 0 auto 26px; }
      a { display: inline-block; background: #e58200; color: #171717; font-weight: 700; text-decoration: none; padding: 15px 24px; }
      a:hover { background: #ff9c18; }
      small { display: block; color: #b9a98e; margin-top: 22px; }
    </style>
    <script>window.setTimeout(function () { window.location.href = ${JSON.stringify(downloadUrl)}; }, 700);</script>
  </head>
  <body>
    <main>
      <header><span class="brand">Official Curtis Riggleman</span><h1>${safeTitle}</h1><div class="rule"></div></header>
      <section><p>Your digital book is ready. Your download will begin automatically.</p><a href="${safeDownloadUrl}">Download your book</a><small>If the download does not start, use the button above.</small></section>
    </main>
  </body>
</html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" } });
  }

  try {
    const file = await readFile(path.join(process.cwd(), "private", "downloads", filename));
    return new Response(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store"
      }
    });
  } catch {
    return Response.json({ error: "The requested book is unavailable." }, { status: 404 });
  }
}
