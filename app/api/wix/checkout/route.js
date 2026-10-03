import { ApiKeyStrategy, createClient } from "@wix/sdk";
import { checkout } from "@wix/ecom";
import { getBook } from "../../../training-courses/books";

const WIX_STORES_APP_ID = "1380b703-ce81-ff05-f115-39571d94dfcd";
const PRODUCT_IDS = {
  digital: {
    "closing-101": process.env.WIX_PRODUCT_CLOSING_101_DIGITAL_ID,
    "built-to-lead-mindset-principles": process.env.WIX_PRODUCT_BUILT_TO_LEAD_DIGITAL_ID,
    "the-first-five": process.env.WIX_PRODUCT_THE_FIRST_FIVE_DIGITAL_ID,
    "objections-arent-real": process.env.WIX_PRODUCT_OBJECTIONS_ARENT_REAL_DIGITAL_ID,
    "dial-for-dollars": process.env.WIX_PRODUCT_DIAL_FOR_DOLLARS_DIGITAL_ID,
    "the-road-to-the-sale": process.env.WIX_PRODUCT_THE_ROAD_TO_THE_SALE_DIGITAL_ID
  },
  physical: {
    "closing-101": process.env.WIX_PRODUCT_CLOSING_101_PHYSICAL_ID,
    "built-to-lead-mindset-principles": process.env.WIX_PRODUCT_BUILT_TO_LEAD_PHYSICAL_ID,
    "the-first-five": process.env.WIX_PRODUCT_THE_FIRST_FIVE_PHYSICAL_ID,
    "objections-arent-real": process.env.WIX_PRODUCT_OBJECTIONS_ARENT_REAL_PHYSICAL_ID,
    "dial-for-dollars": process.env.WIX_PRODUCT_DIAL_FOR_DOLLARS_PHYSICAL_ID,
    "the-road-to-the-sale": process.env.WIX_PRODUCT_THE_ROAD_TO_THE_SALE_PHYSICAL_ID
  }
};

function getWixClient() {
  const apiKey = process.env.WIX_API_KEY;
  const siteId = process.env.WIX_SITE_ID;
  if (!apiKey || !siteId) return null;
  return createClient({
    auth: ApiKeyStrategy({ apiKey, siteId }),
    modules: { checkout }
  });
}

export async function POST(request) {
  if (!process.env.WIX_API_KEY || !process.env.WIX_SITE_ID) {
    return Response.json({ error: "Wix checkout is not configured yet." }, { status: 503 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (!items.length || items.length > 20) {
    return Response.json({ error: "Your cart is empty or contains too many items." }, { status: 400 });
  }

  const lineItems = items.map((item) => {
    const { slug, format = "digital", quantity } = item && typeof item === "object" ? item : {};
    const count = Number(quantity);
    const productId = PRODUCT_IDS[format]?.[slug];
    if (!getBook(slug) || !productId || !["digital", "physical"].includes(format) || !Number.isInteger(count) || count < 1 || count > 20) return null;
    return {
      quantity: count,
      catalogReference: { appId: WIX_STORES_APP_ID, catalogItemId: productId }
    };
  });

  if (lineItems.some((item) => !item)) {
    return Response.json({ error: "One or more books are not configured in Wix yet." }, { status: 400 });
  }

  try {
    const wixClient = getWixClient();
    const created = await wixClient.checkout.createCheckout({ channelType: "WEB", lineItems });
    const checkoutId = created?._id;
    if (!checkoutId) throw new Error("Wix did not return a checkout ID.");
    const checkoutUrlResponse = await wixClient.checkout.getCheckoutUrl(checkoutId);
    if (!checkoutUrlResponse?.checkoutUrl) throw new Error("Wix did not return a checkout URL.");
    return Response.json({ url: checkoutUrlResponse.checkoutUrl, checkoutId });
  } catch (error) {
    console.error("[wix-checkout] failed", error?.message || error);
    return Response.json({ error: "Wix checkout is temporarily unavailable." }, { status: 502 });
  }
}
