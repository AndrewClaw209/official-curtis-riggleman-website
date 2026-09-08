import { getBook } from "../../../training-courses/books";

const priceIds = {
  "closing-101": process.env.STRIPE_PRICE_CLOSING_101,
  "built-to-lead-mindset-principles": process.env.STRIPE_PRICE_BUILT_TO_LEAD,
  "the-first-five": process.env.STRIPE_PRICE_THE_FIRST_FIVE,
  "objections-arent-real": process.env.STRIPE_PRICE_OBJECTIONS_ARENT_REAL,
  "dial-for-dollars": process.env.STRIPE_PRICE_DIAL_FOR_DOLLARS
};

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Stripe checkout is not configured yet." }, { status: 503 });
  }

  const { items = [] } = await request.json();
  const lineItems = items.map(({ slug, quantity }) => {
    const book = getBook(slug);
    const price = priceIds[slug];
    const count = Number(quantity);
    if (!book || !price || !Number.isInteger(count) || count < 1 || count > 20) return null;
    return { price, quantity: count };
  });

  if (!lineItems.length || lineItems.length !== items.length) {
    return Response.json({ error: "One or more books are not available for purchase yet." }, { status: 400 });
  }

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;
  const body = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/training-courses?purchase=success`,
    cancel_url: `${origin}/training-courses?purchase=cancelled`,
    "shipping_address_collection[allowed_countries][0]": "US",
    "automatic_tax[enabled]": "true"
  });
  lineItems.forEach((item, index) => {
    body.set(`line_items[${index}][price]`, item.price);
    body.set(`line_items[${index}][quantity]`, String(item.quantity));
  });

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  const session = await stripeResponse.json();
  if (!stripeResponse.ok) return Response.json({ error: session.error?.message || "Stripe checkout failed." }, { status: 502 });
  return Response.json({ url: session.url });
}
