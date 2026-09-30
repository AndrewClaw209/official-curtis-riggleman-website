import { createHmac, timingSafeEqual } from "node:crypto";

const SIGNATURE_TOLERANCE_SECONDS = 300;
const DOWNLOAD_LIFETIME_SECONDS = 7 * 24 * 60 * 60;
const DIGITAL_DOWNLOADS = {
  "closing-101": "/downloads/closing-101.pdf",
  "built-to-lead-mindset-principles": "/downloads/built-to-lead-mindset-principles.pdf",
  "the-first-five": "/downloads/the-first-five.pdf",
  "objections-arent-real": "/downloads/objections-arent-real.pdf",
  "dial-for-dollars": "/downloads/dial-for-dollars.pdf",
  "the-road-to-the-sale": "/downloads/the-road-to-the-sale.pdf"
};
const BOOK_TITLES = {
  "closing-101": "Closing 101",
  "built-to-lead-mindset-principles": "Built to Lead: Mindset Principles",
  "the-first-five": "The First Five: On Board Sales Training",
  "objections-arent-real": "Objections Aren’t Real",
  "dial-for-dollars": "Dial for Dollars",
  "the-road-to-the-sale": "The Road to the Sale"
};

function isValidStripeSignature(rawBody, signatureHeader, webhookSecret) {
  if (!signatureHeader) return false;

  let timestamp;
  const signatures = [];
  for (const part of signatureHeader.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key === "t") timestamp = Number(value);
    if (key === "v1" && value) signatures.push(value);
  }

  if (!Number.isInteger(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > SIGNATURE_TOLERANCE_SECONDS) {
    return false;
  }

  const expected = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return signatures.some((signature) => {
    const receivedBuffer = Buffer.from(signature, "utf8");
    return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
  });
}

function parseOrderItems(value) {
  try {
    const items = JSON.parse(value || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function createDownloadToken(slug, expiresAt) {
  const secret = process.env.DIGITAL_DOWNLOAD_SECRET;
  if (!secret) return null;
  const payload = `${slug}.${expiresAt}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

function addDownloadLinks(items) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://officialcurtisriggleman.com").replace(/\/$/, "");
  const expiresAt = Math.floor(Date.now() / 1000) + DOWNLOAD_LIFETIME_SECONDS;
  return items.map((item) => ({
    ...item,
    ...(item.format === "digital" && DIGITAL_DOWNLOADS[item.slug]
      ? (() => {
          const token = createDownloadToken(item.slug, expiresAt);
          return token ? { downloadUrl: `${siteUrl}/api/download/${item.slug}?token=${encodeURIComponent(token)}`, downloadExpiresAt: new Date(expiresAt * 1000).toISOString() } : {};
        })()
      : {})
  }));
}

function summarizeItems(items) {
  return items.map((item) => `${BOOK_TITLES[item.slug] || item.slug} — ${item.format} — quantity ${item.quantity}`).join("\n");
}

async function forwardOrderToGoHighLevel(order) {
  const webhookUrl = process.env.GOHIGHLEVEL_ORDER_WEBHOOK_URL;
  if (!webhookUrl) return;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_type: "book_order_paid", ...order }),
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) throw new Error(`GoHighLevel webhook returned ${response.status}`);
}

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json({ error: "Stripe webhook is not configured yet." }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!isValidStripeSignature(rawBody, request.headers.get("stripe-signature"), webhookSecret)) {
    return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
    const session = event.data?.object || {};
    const items = addDownloadLinks(parseOrderItems(session.metadata?.order_items));
    const order = {
      eventId: event.id,
      sessionId: session.id,
      paymentStatus: session.payment_status || "unknown",
      customerEmail: session.customer_details?.email || session.customer_email || null,
      customerName: session.customer_details?.name || null,
      shippingAddress: session.shipping_details?.address || session.customer_details?.address || null,
      items,
      primaryBookSlug: items[0]?.slug || null,
      primaryBookTitle: BOOK_TITLES[items[0]?.slug] || items[0]?.slug || null,
      primaryFormat: items[0]?.format || null,
      primaryQuantity: items[0]?.quantity || 0,
      orderItemsText: summarizeItems(items),
      bookCount: items.reduce((total, item) => total + Number(item.quantity || 0), 0),
      digitalBookCount: items.filter((item) => item.format === "digital").reduce((total, item) => total + Number(item.quantity || 0), 0),
      physicalBookCount: items.filter((item) => item.format === "physical").reduce((total, item) => total + Number(item.quantity || 0), 0),
      total: typeof session.amount_total === "number" ? session.amount_total / 100 : null,
      currency: session.currency || "usd",
      orderDate: new Date().toISOString(),
      digitalDownloadLinks: items.filter((item) => item.downloadUrl).map(({ slug, downloadUrl }) => ({ slug, downloadUrl })),
      digitalDownloadLinksText: items.filter((item) => item.downloadUrl).map(({ slug, downloadUrl, downloadExpiresAt }) => `${slug}: ${downloadUrl} (expires ${downloadExpiresAt})`).join("\n"),
      hasPhysicalBooks: session.metadata?.has_physical_books === "true",
      receivedAt: new Date().toISOString()
    };

    console.info("[stripe-webhook] paid book order", JSON.stringify(order));
    try {
      await forwardOrderToGoHighLevel(order);
    } catch (error) {
      console.error("[stripe-webhook] GoHighLevel forwarding failed", error.message);
      return Response.json({ error: "Order notification could not be delivered." }, { status: 502 });
    }
  }

  return Response.json({ received: true });
}
