import { getBook } from "../../../training-courses/books";

const priceIds = {
  digital: {
    "closing-101": process.env.STRIPE_PRICE_CLOSING_101_DIGITAL,
    "built-to-lead-mindset-principles": process.env.STRIPE_PRICE_BUILT_TO_LEAD_DIGITAL,
    "the-first-five": process.env.STRIPE_PRICE_THE_FIRST_FIVE_DIGITAL,
    "objections-arent-real": process.env.STRIPE_PRICE_OBJECTIONS_ARENT_REAL_DIGITAL,
    "dial-for-dollars": process.env.STRIPE_PRICE_DIAL_FOR_DOLLARS_DIGITAL
  },
  physical: {
    "closing-101": process.env.STRIPE_PRICE_CLOSING_101_PHYSICAL,
    "built-to-lead-mindset-principles": process.env.STRIPE_PRICE_BUILT_TO_LEAD_PHYSICAL,
    "the-first-five": process.env.STRIPE_PRICE_THE_FIRST_FIVE_PHYSICAL,
    "objections-arent-real": process.env.STRIPE_PRICE_OBJECTIONS_ARENT_REAL_PHYSICAL,
    "dial-for-dollars": process.env.STRIPE_PRICE_DIAL_FOR_DOLLARS_PHYSICAL
  }
};

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Stripe checkout is not configured yet." }, { status: 503 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (items.length > 20) {
    return Response.json({ error: "Too many items in checkout." }, { status: 400 });
  }

  const lineItems = items.map((item) => {
    const { slug, format = "digital", quantity } = item && typeof item === "object" ? item : {};
    const book = getBook(slug);
    const price = priceIds[format]?.[slug];
    const count = Number(quantity);
    if (!book || !["digital", "physical"].includes(format) || !price || !Number.isInteger(count) || count < 1 || count > 20) return null;
    return { price, quantity: count, format };
  });

  if (!lineItems.length || lineItems.length !== items.length) {
    return Response.json({ error: "One or more books are not available for purchase yet." }, { status: 400 });
  }

  let origin;
  try {
    origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin;
  } catch {
    return Response.json({ error: "Checkout site URL is not configured correctly." }, { status: 500 });
  }
  const hasPhysicalBooks = lineItems.some((item) => item.format === "physical");
  if (hasPhysicalBooks && !process.env.STRIPE_PHYSICAL_SHIPPING_RATE_ID) {
    return Response.json({ error: "Physical-book shipping is not configured yet." }, { status: 503 });
  }

  const body = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/training-courses?purchase=success`,
    cancel_url: `${origin}/training-courses?purchase=cancelled`,
    "automatic_tax[enabled]": "true"
  });
  if (hasPhysicalBooks) {
    body.set("shipping_address_collection[allowed_countries][0]", "US");
    body.set("shipping_options[0][shipping_rate]", process.env.STRIPE_PHYSICAL_SHIPPING_RATE_ID);
  }
  body.set("metadata[order_items]", JSON.stringify(items.map(({ slug, format, quantity }) => ({ slug, format, quantity }))));
  body.set("metadata[has_physical_books]", String(hasPhysicalBooks));
  lineItems.forEach((item, index) => {
    body.set(`line_items[${index}][price]`, item.price);
    body.set(`line_items[${index}][quantity]`, String(item.quantity));
  });

  let stripeResponse;
  try {
    stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body,
      signal: AbortSignal.timeout(10000)
    });
  } catch {
    return Response.json({ error: "Stripe checkout is temporarily unavailable." }, { status: 502 });
  }
  const session = await stripeResponse.json();
  if (!stripeResponse.ok) return Response.json({ error: session.error?.message || "Stripe checkout failed." }, { status: 502 });
  return Response.json({ url: session.url });
}
