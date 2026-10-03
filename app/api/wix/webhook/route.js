import { createHmac, createPublicKey, createVerify } from "node:crypto";

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
  "built-to-lead-mindset-principles": "Built To Lead: Mindset Principles",
  "the-first-five": "The First Five: On Board Sales Training",
  "objections-arent-real": "Objections Aren’t Real",
  "dial-for-dollars": "Dial For Dollars",
  "the-road-to-the-sale": "The Road To The Sale"
};
const PRODUCT_IDS = {
  "closing-101": { digital: "WIX_PRODUCT_CLOSING_101_DIGITAL_ID", physical: "WIX_PRODUCT_CLOSING_101_PHYSICAL_ID" },
  "built-to-lead-mindset-principles": { digital: "WIX_PRODUCT_BUILT_TO_LEAD_DIGITAL_ID", physical: "WIX_PRODUCT_BUILT_TO_LEAD_PHYSICAL_ID" },
  "the-first-five": { digital: "WIX_PRODUCT_THE_FIRST_FIVE_DIGITAL_ID", physical: "WIX_PRODUCT_THE_FIRST_FIVE_PHYSICAL_ID" },
  "objections-arent-real": { digital: "WIX_PRODUCT_OBJECTIONS_ARENT_REAL_DIGITAL_ID", physical: "WIX_PRODUCT_OBJECTIONS_ARENT_REAL_PHYSICAL_ID" },
  "dial-for-dollars": { digital: "WIX_PRODUCT_DIAL_FOR_DOLLARS_DIGITAL_ID", physical: "WIX_PRODUCT_DIAL_FOR_DOLLARS_PHYSICAL_ID" },
  "the-road-to-the-sale": { digital: "WIX_PRODUCT_THE_ROAD_TO_THE_SALE_DIGITAL_ID", physical: "WIX_PRODUCT_THE_ROAD_TO_THE_SALE_PHYSICAL_ID" }
};

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url");
}

function verifyWixJwt(token, publicKeyPem) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("Invalid Wix JWT.");
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = JSON.parse(decodeBase64Url(encodedHeader).toString("utf8"));
  if (header.alg !== "RS256") throw new Error("Unsupported Wix JWT algorithm.");
  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();
  if (!verifier.verify(createPublicKey(publicKeyPem.replace(/\\n/g, "\n")), decodeBase64Url(encodedSignature))) {
    throw new Error("Invalid Wix JWT signature.");
  }
  return JSON.parse(decodeBase64Url(encodedPayload).toString("utf8"));
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
  return items.map((item) => {
    if (item.format !== "digital" || !DIGITAL_DOWNLOADS[item.slug]) return item;
    const token = createDownloadToken(item.slug, expiresAt);
    return token ? { ...item, downloadUrl: `${siteUrl}/api/download/${item.slug}?token=${encodeURIComponent(token)}`, downloadExpiresAt: new Date(expiresAt * 1000).toISOString() } : item;
  });
}

function valueAt(object, paths) {
  for (const path of paths) {
    const value = path.split(".").reduce((current, key) => current?.[key], object);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

function normalizeAddress(address) {
  if (!address) return null;
  return {
    line1: valueAt(address, ["addressLine1", "streetAddress", "addressLine"]),
    line2: valueAt(address, ["addressLine2"]),
    city: valueAt(address, ["city"]),
    state: valueAt(address, ["subdivision", "state"]),
    postalCode: valueAt(address, ["postalCode", "zipCode"]),
    country: valueAt(address, ["country"])
  };
}

function getLineItemFormat(lineItem) {
  const catalogId = valueAt(lineItem, ["catalogReference.catalogItemId", "catalogReference.itemId", "productId"]);
  for (const [slug, formats] of Object.entries(PRODUCT_IDS)) {
    for (const format of ["digital", "physical"]) {
      if (process.env[formats[format]] === catalogId) return { slug, format };
    }
  }
  return null;
}

function normalizeItems(order) {
  return (order.lineItems || []).flatMap((lineItem) => {
    const match = getLineItemFormat(lineItem);
    if (!match) return [];
    return [{ ...match, quantity: Number(valueAt(lineItem, ["quantity"]) || 1) }];
  });
}

function summarizeItems(items) {
  return items.map((item) => `${BOOK_TITLES[item.slug] || item.slug} — ${item.format} — quantity ${item.quantity}`).join("\n");
}

function buildDigitalLinkFields(items) {
  return Object.fromEntries(items.filter((item) => item.downloadUrl).slice(0, 6).flatMap((item, index) => {
    const number = index + 1;
    const title = BOOK_TITLES[item.slug] || item.slug;
    return [[`digitalDownloadLink${number}Title`, title], [`digitalDownloadLink${number}Url`, item.downloadUrl], [`digitalDownloadLink${number}Text`, `${title}: ${item.downloadUrl}`]];
  }));
}

async function forwardOrderToGoHighLevel(order) {
  const webhookUrl = process.env.GOHIGHLEVEL_ORDER_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("GoHighLevel webhook is not configured.");
  const response = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event_type: "book_order_paid", ...order }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`GoHighLevel webhook returned ${response.status}`);
}

export async function POST(request) {
  const publicKey = process.env.WIX_WEBHOOK_PUBLIC_KEY;
  if (!publicKey) return Response.json({ error: "Wix webhook is not configured yet." }, { status: 503 });

  let event;
  try {
    event = verifyWixJwt(await request.text(), publicKey);
  } catch (error) {
    console.error("[wix-webhook] verification failed", error.message);
    return Response.json({ error: "Invalid Wix webhook signature." }, { status: 400 });
  }

  const eventType = String(event.eventType || event.type || "").toLowerCase();
  const order = event.data?.order || event.data?.entity || event.data;
  const paymentStatus = String(valueAt(order, ["paymentStatus", "payment.status"]) || "").toUpperCase();
  const isPaidEvent = eventType.includes("order_paid") || eventType.includes("order.paid") || eventType.includes("payment_status_updated") || eventType.includes("payment.status.updated") || eventType.endsWith("paid");
  if (!isPaidEvent || (paymentStatus && !["PAID", "FULLY_PAID"].includes(paymentStatus))) return Response.json({ received: true, ignored: true });

  const rawItems = normalizeItems(order);
  if (!rawItems.length) return Response.json({ received: true, ignored: true, reason: "No mapped book items" });
  const items = addDownloadLinks(rawItems);
  const total = valueAt(order, ["priceSummary.total.amount", "priceSummary.total.value", "total.amount"]);
  const currency = valueAt(order, ["priceSummary.total.currency", "currency"]) || "USD";
  const orderId = valueAt(order, ["id", "orderId"]) || event.entityId || event.id;
  const orderPayload = {
    eventId: event.id || null,
    sessionId: orderId,
    paymentStatus: "paid",
    customerEmail: valueAt(order, ["buyerInfo.email", "buyerInfo.contact.email", "billingInfo.contactDetails.email"]),
    customerName: valueAt(order, ["buyerInfo.name", "billingInfo.contactDetails.fullName"]),
    shippingAddress: normalizeAddress(order.shippingInfo?.shipmentDetails?.address || order.shippingInfo?.address || order.billingInfo?.address),
    items,
    primaryBookSlug: items[0]?.slug || null,
    primaryBookTitle: BOOK_TITLES[items[0]?.slug] || items[0]?.slug || null,
    primaryFormat: items[0]?.format || null,
    primaryQuantity: items[0]?.quantity || 0,
    orderItemsText: summarizeItems(items),
    bookCount: items.reduce((totalCount, item) => totalCount + item.quantity, 0),
    digitalBookCount: items.filter((item) => item.format === "digital").reduce((totalCount, item) => totalCount + item.quantity, 0),
    physicalBookCount: items.filter((item) => item.format === "physical").reduce((totalCount, item) => totalCount + item.quantity, 0),
    total: total === null ? null : Number(total),
    currency: String(currency).toLowerCase(),
    orderDate: valueAt(order, ["createdDate", "dateCreated"]) || new Date().toISOString(),
    digitalDownloadLinks: items.filter((item) => item.downloadUrl).map(({ slug, downloadUrl }) => ({ slug, downloadUrl })),
    digitalDownloadLinksText: items.filter((item) => item.downloadUrl).map(({ slug, downloadUrl, downloadExpiresAt }) => `${BOOK_TITLES[slug] || slug}: ${downloadUrl} (expires ${downloadExpiresAt})`).join("\n\n"),
    ...buildDigitalLinkFields(items),
    hasPhysicalBooks: items.some((item) => item.format === "physical"),
    receivedAt: new Date().toISOString()
  };

  try {
    await forwardOrderToGoHighLevel(orderPayload);
    console.info("[wix-webhook] paid book order forwarded", JSON.stringify({ eventId: orderPayload.eventId, orderId }));
    return Response.json({ received: true });
  } catch (error) {
    console.error("[wix-webhook] GoHighLevel forwarding failed", error.message);
    return Response.json({ error: "Order notification could not be delivered." }, { status: 502 });
  }
}
