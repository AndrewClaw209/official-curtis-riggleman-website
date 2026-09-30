import { createHmac, timingSafeEqual } from "node:crypto";

const SIGNATURE_TOLERANCE_SECONDS = 300;

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
    const order = {
      eventId: event.id,
      sessionId: session.id,
      paymentStatus: session.payment_status || "unknown",
      customerEmail: session.customer_details?.email || session.customer_email || null,
      customerName: session.customer_details?.name || null,
      shippingAddress: session.shipping_details?.address || session.customer_details?.address || null,
      items: parseOrderItems(session.metadata?.order_items),
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
