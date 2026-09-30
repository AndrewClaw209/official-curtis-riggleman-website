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
