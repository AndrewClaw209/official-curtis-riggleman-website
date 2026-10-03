# Wix Headless checkout

The site now contains a feature-flagged Wix Headless checkout adapter. Stripe remains the default until the Wix catalog and account credentials are verified.

## Current flow

```text
BookCart
  -> POST /api/wix/checkout (only when NEXT_PUBLIC_PAYMENT_PROVIDER=wix)
  -> Wix eCommerce Checkout API
  -> Wix-hosted checkout URL
  -> Wix payment/order processing
  -> Wix order webhook (to be configured)
  -> normalized order payload
  -> GoHighLevel fulfillment workflow
```

The Wix checkout route is intentionally server-only. The API key and site ID must never be exposed to the browser.

## Required Wix values

Add these as Vercel Production environment variables after confirming them in Curtis's Wix account:

- `WIX_API_KEY`: Wix API key with eCommerce checkout permissions.
- `WIX_SITE_ID`: Curtis's Wix site ID.
- `WIX_PRODUCT_CLOSING_101_DIGITAL_ID`
- `WIX_PRODUCT_CLOSING_101_PHYSICAL_ID`
- `WIX_PRODUCT_BUILT_TO_LEAD_DIGITAL_ID`
- `WIX_PRODUCT_BUILT_TO_LEAD_PHYSICAL_ID`
- `WIX_PRODUCT_THE_FIRST_FIVE_DIGITAL_ID`
- `WIX_PRODUCT_THE_FIRST_FIVE_PHYSICAL_ID`
- `WIX_PRODUCT_OBJECTIONS_ARENT_REAL_DIGITAL_ID`
- `WIX_PRODUCT_OBJECTIONS_ARENT_REAL_PHYSICAL_ID`
- `WIX_PRODUCT_DIAL_FOR_DOLLARS_DIGITAL_ID`
- `WIX_PRODUCT_DIAL_FOR_DOLLARS_PHYSICAL_ID`
- `WIX_PRODUCT_THE_ROAD_TO_THE_SALE_DIGITAL_ID`
- `WIX_PRODUCT_THE_ROAD_TO_THE_SALE_PHYSICAL_ID`
- `WIX_WEBHOOK_PUBLIC_KEY`: PEM public key shown by Wix when creating the order-paid webhook.

The catalog app ID for Wix Stores is fixed in `app/api/wix/checkout/route.js` as `215238eb-22a5-4c36-9e7b-e7c08025e04e`.

## Product mapping

Each format must be a real Wix Stores catalog item ID. Do not use the Stripe Price ID, Wix product slug, or a display name. Validate every mapping in a Wix test checkout before switching the provider flag.

### Candidate physical mappings from the supplied Wix export

The export contains one physical Books product for each title. These `handleId` values are candidates for the physical catalog IDs, but they still need to be confirmed against the Wix eCommerce API before being added to Vercel:

| Book | Candidate Wix product ID | Export notes |
| --- | --- | --- |
| Closing 101 | `product_829f2c4f-b6fd-5a24-b838-32758fbe68c1` | In stock; export price $29.00 |
| Built To Lead: Mindset Principles | `product_a2a909a3-03b8-78db-4c76-bd49c214a6b5` | In stock; export price $29.00 |
| The First Five: On Board Sales Training | `product_ec9a6073-b68c-8fb9-e3a4-130350e3a84e` | In stock; export price $29.00 |
| Objections Aren't Real | `product_2419aff9-1c86-c029-ea09-3c11947c5cd5` | In stock; export price $29.00 |
| Dial For Dollars | `product_1763c933-3b2a-5a00-3a7c-e6c7ab6c4f96` | In stock; export price $29.00 |
| The Road To The Sale | `product_50413557-0a7d-92b5-f828-f53fb34398c8` | Out of stock; export price $29.00 |

The supplied physical export did not include digital product rows, and the separate digital-only export contained only the CSV header. The Wix catalog screenshot shows that digital products do exist, so those exports should be treated as incomplete rather than proof that the products are missing. Export the complete catalog (or capture the digital rows/IDs from Wix) before activation. The physical pricing discrepancy ($29.00 in Wix versus $29.95 in the current site) and physical shipping/inventory behavior also need to be resolved.

### Digital IDs supplied from Wix product URLs

These IDs were supplied from the Wix product detail URLs. The final ID was subsequently confirmed as Dial For Dollars.

| Book | Digital Wix product ID | Status |
| --- | --- | --- |
| The Road To The Sale | `ddc1a627-c4e4-a17b-46ed-34049c30787d` | Confirmed from URL |
| Closing 101 | `6829518c-1344-c872-e68d-66cfb2b9c4dd` | Confirmed from URL |
| Built To Lead: Mindset Principles | `552ee6ff-cfe7-e94e-b7a7-f8234ec9ab3d` | Confirmed from URL |
| The First Five: On Board Sales Training | `53712507-0a01-31d9-2b51-154b5f6e10fa` | Confirmed from URL |
| Objections Aren't Real | `7305c519-c835-d391-dd59-8f1245fcbfb4` | Confirmed from URL |
| Dial For Dollars | `8fa58f81-6bcc-10ac-30cd-d6ee94db3ccc` | Confirmed from URL |

## Activating Wix checkout

1. Add and verify the Wix credentials and all catalog IDs in Vercel Production.
2. Set `NEXT_PUBLIC_PAYMENT_PROVIDER=wix` in Production.
3. Redeploy the site.
4. Test one digital item and one physical item in Wix test/sandbox mode if available.
5. Confirm Wix calculates shipping and tax correctly for physical orders.
6. Configure Wix order/payment webhooks to `https://www.officialcurtisriggleman.com/api/wix/webhook`.
7. Test a paid Wix order end to end before disabling Stripe.

The current code does not activate Wix automatically when credentials are absent; `/api/wix/checkout` returns a clear 503 instead. This prevents an incomplete Wix configuration from breaking the live Stripe checkout.

## Fulfillment and webhook requirements

The Wix webhook integration must forward the same normalized fields currently emitted by the Stripe webhook: customer email/name, shipping address, item slug/format/quantity, totals, payment status, order ID, and `hasPhysicalBooks`. Digital orders must receive signed download URLs generated by the site before the GoHighLevel email step. Physical orders must continue to create the existing fulfillment opportunity.

The deployed webhook expects Wix's signed JWT in the raw request body, verifies it with `WIX_WEBHOOK_PUBLIC_KEY`, filters paid orders, maps Wix catalog IDs to the normalized order contract, creates signed digital links, and forwards the order to HighLevel. Wix can retry and deliver events out of order; `eventId` is included in the HighLevel payload. A durable event-ID store (Vercel KV/Redis or a database) should be added before live sales if HighLevel does not already deduplicate on `eventId`. Do not treat a checkout-created event as a paid order.
