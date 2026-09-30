# Developer Guide

This document explains the current implementation of the Official Curtis Riggleman website for developers joining the project later.

## 1. Product and architecture

The project is a Next.js 15 App Router application with three responsibilities:

1. Present Curtis Riggleman’s brand, training, media, coaching, university, and contact content.
2. Sell digital and physical editions of training books through Stripe Checkout.
3. Convert successful Stripe payments into a structured order payload for GoHighLevel (GHL), where contacts, notifications, opportunities, and shipping follow-up are managed.

There is no application database in this repository. Stripe stores payment/session records, Vercel serves the application and protected download route, and GHL stores CRM and operational fulfillment state.

### Technology

- Next.js `^15.5.24`
- React `19.1.0`
- Node.js APIs for cryptography and private-file access
- Vercel deployment
- Stripe Checkout and Stripe webhooks
- GoHighLevel inbound webhook/workflows

### Repository map

```text
app/
  layout.js                         Root layout, fonts, nav, cart, footer
  page.js                           Homepage
  globals.css                       App-level CSS import
  contact/page.js                   Contact page
  media/page.js                     YouTube/media page
  riggleman-university/page.js      University landing page
  sales-coaching/page.js            R U Ready sales coaching page
  testimonies/page.js               Testimonials page
  training-courses/page.js          Book catalog and purchase status
  training-courses/books.js         Book catalog metadata and slugs
  training-courses/[slug]/          Individual book detail pages
  api/stripe/checkout/route.js      Creates Stripe Checkout Sessions
  api/stripe/webhook/route.js       Verifies paid events and forwards orders
  api/download/[slug]/route.js      Validates tokens and serves PDFs
components/                         Client UI building blocks
public/                              Public images, videos, logos, covers
private/downloads/                   Digital PDFs; intentionally not public
docs/                                Operational and developer documentation
styles.css                           Shared site stylesheet
next.config.mjs                      Security headers and image formats
package.json                         Scripts and dependencies
```

## 2. Pages and routes

| URL | Source | Purpose |
| --- | --- | --- |
| `/` | `app/page.js` | Branded homepage, social links, webinar modal, featured video |
| `/contact` | `app/contact/page.js` | Contact information and FormSubmit lead form |
| `/media` | `app/media/page.js` | YouTube channel, shorts carousel, video, podcast form |
| `/riggleman-university` | `app/riggleman-university/page.js` | University offer, Circle checkout, GHL form |
| `/sales-coaching` | `app/sales-coaching/page.js` | R U Ready offer and early-access form |
| `/testimonies` | `app/testimonies/page.js` | Testimonial cards and booking modal |
| `/training-courses` | `app/training-courses/page.js` | Book catalog, cart, checkout status |
| `/training-courses/[slug]` | `BookDetail.js` | Book video, cover, description, cart, related books |
| `/api/stripe/checkout` | `api/stripe/checkout/route.js` | `POST`; validates cart and creates Stripe session |
| `/api/stripe/webhook` | `api/stripe/webhook/route.js` | `POST`; verifies event and forwards normalized order |
| `/api/download/[slug]` | `api/download/[slug]/route.js` | `GET`; branded landing page or protected PDF |

### Catalog caveat

The backend supports six books, including `the-road-to-the-sale`. The customer-facing `app/training-courses/books.js` array currently contains five books, so only five have storefront/detail pages. To release The Road to the Sale for purchase, add it to that array, add checkout Price IDs, and add its cover/video metadata. Download support alone does not make it purchasable.

## 3. Global frontend architecture

`app/layout.js` wraps every page with Google `Anton` and `Manrope` fonts, `SiteNav`, the active page, a global `BookCart` modal instance, and `SiteFooter`.

Pages are mostly server components. Client components are used only where browser state is required: localStorage, modals, video controls, carousel animation, forms, and checkout redirects.

The active brand asset is `public/assets/logo-curtis-riggleman-clean.png`. It is referenced by the homepage, contact page, media page, footer, and download landing page. Older logo files remain in `public/assets` but are not the active site logo.

External content includes YouTube embeds, the Curtis AI mobile link, the webinar signup, Circle checkout for University, GHL-hosted forms, and FormSubmit for the contact form.

## 4. Book catalog and cart

`app/training-courses/books.js` is the source of truth for customer-facing metadata:

```js
{ slug, title, videoSrc, image, description }
```

`getBook(slug)` is also used by the checkout API to reject unknown products.

`components/BookCart.js`:

- Stores items in localStorage under `curtis-book-cart`.
- Synchronizes instances with `curtis-book-cart-updated`.
- Opens the global cart with `curtis-book-cart-open` after adding an item.
- Supports `digital` and `physical` formats.
- Enforces a browser-side range of 0–20 per line item.
- Displays `$19.95` digital, `$29.95` physical, and `$11.95` physical shipping per order.
- Sends only `{ slug, format, quantity }` to `/api/stripe/checkout`.

The browser prices are presentation values only. Server-side Stripe Price IDs determine the actual charge.

`PurchaseStatus` processes `/training-courses?purchase=success` and `?purchase=cancelled`. Success clears the cart; cancellation preserves it. The query string is removed after processing.

## 5. Checkout lifecycle

```text
Customer selects format/quantity
  -> BookCart POST /api/stripe/checkout
  -> server validates slug, format, quantity, Price ID
  -> Stripe Checkout Session
  -> success or cancel redirect
  -> Stripe checkout.session.completed or async_payment_succeeded
  -> POST /api/stripe/webhook
```

The checkout route:

1. Requires `STRIPE_SECRET_KEY`.
2. Requires a non-empty items array and no more than 20 submitted line items.
3. Validates every slug against the catalog, format against `digital|physical`, configured Price ID, and integer quantity 1–20.
4. Enables automatic tax.
5. Collects a US shipping address and applies `STRIPE_PHYSICAL_SHIPPING_RATE_ID` when any physical item exists.
6. Stores `order_items` and `has_physical_books` in Stripe metadata.
7. Returns the Stripe Checkout URL.

Stripe is authoritative for final amount, currency, email, shipping details, and payment status. Never use a browser total for fulfillment.

## 6. Stripe webhook and order contract

The webhook reads the raw body, verifies the Stripe signature with a five-minute tolerance, and compares the HMAC timing-safely. It handles `checkout.session.completed` and `checkout.session.async_payment_succeeded`.

For each event it parses `order_items`, adds seven-day signed download URLs to digital items, builds a normalized order, logs it, and POSTs `{ event_type: "book_order_paid", ...order }` to GHL. A failed GHL response returns HTTP 502 so the failure is visible to Stripe delivery monitoring.

### Normalized fields

```text
eventId, sessionId, paymentStatus
customerEmail, customerName, shippingAddress
items
primaryBookSlug, primaryBookTitle, primaryFormat, primaryQuantity
orderItemsText, bookCount, digitalBookCount, physicalBookCount
total, currency, orderDate
digitalDownloadLinks, digitalDownloadLinksText
digitalDownloadLink1Title/Url/Text through digitalDownloadLink6Title/Url/Text
hasPhysicalBooks, receivedAt
```

Each item retains `slug`, `format`, and `quantity`. Digital items also contain `downloadUrl` and `downloadExpiresAt`.

`orderItemsText` is the safe human-readable field for GHL emails and notes. It contains lines such as `Closing 101 — physical — quantity 2`.

### GHL email formatting

`digitalDownloadLinksText` contains blank lines, but some GHL editors collapse newlines inside one merge field. For dependable formatting, use separate paragraphs:

```text
{{inboundWebhookRequest.digitalDownloadLink1Text}}

{{inboundWebhookRequest.digitalDownloadLink2Text}}

{{inboundWebhookRequest.digitalDownloadLink3Text}}

{{inboundWebhookRequest.digitalDownloadLink4Text}}

{{inboundWebhookRequest.digitalDownloadLink5Text}}

{{inboundWebhookRequest.digitalDownloadLink6Text}}
```

The numbered fields are populated in order and support up to six digital links.

## 7. Protected digital delivery

PDFs live in `private/downloads`, not `public/`, so they are not static public files.

The webhook signs `slug.expiresAtUnixSeconds` with HMAC-SHA256 using `DIGITAL_DOWNLOAD_SECRET` and encodes `slug.expires.signature` as base64url. The token expires after seven days.

`GET /api/download/[slug]` validates the slug, secret, token, expiration, and signature. A normal token URL returns a Curtis-branded HTML page with the logo, book cover, title, automatic redirect, and fallback button. The route adds `download=1` for the final request, reads the PDF, and returns it as an attachment with private/no-store caching.

These are bearer links: anyone with a valid URL can use it until expiration. Do not publish live tokens. Single-use or customer-bound downloads would require persistent storage.

When adding a book, update the catalog, Stripe products/Price IDs, webhook `DIGITAL_DOWNLOADS` and `BOOK_TITLES`, download route `DOWNLOADS`/`TITLES`/`COVERS`, private PDF, public cover, and GHL mappings together.

## 8. Physical fulfillment in GoHighLevel

The website emits the paid order event; GHL owns operational fulfillment:

```text
Paid physical webhook
  -> create/update contact
  -> paid-order tag and saved order details
  -> customer confirmation email
  -> Curtis internal fulfillment alert
  -> opportunity: Physical Book Sales / Order Received

Opportunity moved to Physical Book Sales / Order Shipped
  -> customer shipping-confirmation email
```

### First workflow

- Trigger on the inbound webhook.
- Map the exact webhook customer email; never append test text.
- Branch on `hasPhysicalBooks == true`.
- Use `orderItemsText` for readable items and quantities.
- Persist event ID, session ID, order summary, shipping data, total, and customer email.
- Create the opportunity in the exact `Physical Book Sales` pipeline and `Order Received` stage.

### Shipping workflow

- Trigger on an opportunity pipeline/stage change.
- Filter specifically for `Physical Book Sales` and `Order Shipped`, not merely a generic open status.
- Use fields saved to the contact/opportunity by the first workflow. A later workflow does not automatically inherit the original inbound webhook object, so `{{inboundWebhookRequest.orderItemsText}}` will not be available there unless GHL explicitly persists it.
- Add a tracking-number custom field if shipping tracking is part of the process.

### Mixed orders

An order can have `hasPhysicalBooks: true` and `digitalBookCount > 0`. The top-level digital-only condition (`hasPhysicalBooks == false`) does not cover this case. Add a nested mixed-order branch or separately send digital fulfillment whenever `digitalBookCount > 0`.

## 9. Environment variables

### Checkout and fulfillment

```text
NEXT_PUBLIC_SITE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
DIGITAL_DOWNLOAD_SECRET
STRIPE_PHYSICAL_SHIPPING_RATE_ID
GOHIGHLEVEL_ORDER_WEBHOOK_URL
```

### Stripe Price IDs

```text
STRIPE_PRICE_CLOSING_101_DIGITAL / STRIPE_PRICE_CLOSING_101_PHYSICAL
STRIPE_PRICE_BUILT_TO_LEAD_DIGITAL / STRIPE_PRICE_BUILT_TO_LEAD_PHYSICAL
STRIPE_PRICE_THE_FIRST_FIVE_DIGITAL / STRIPE_PRICE_THE_FIRST_FIVE_PHYSICAL
STRIPE_PRICE_OBJECTIONS_ARENT_REAL_DIGITAL / STRIPE_PRICE_OBJECTIONS_ARENT_REAL_PHYSICAL
STRIPE_PRICE_DIAL_FOR_DOLLARS_DIGITAL / STRIPE_PRICE_DIAL_FOR_DOLLARS_PHYSICAL
```

The Road to the Sale currently has no checkout Price ID mapping because it is not in the storefront catalog.

### Public form URLs

```text
NEXT_PUBLIC_GHL_CALENDAR_URL
NEXT_PUBLIC_GHL_FORM_URL
NEXT_PUBLIC_GHL_PUBLIC_APPEARANCE_FORM_URL
NEXT_PUBLIC_GHL_RIGGLEMAN_UNIVERSITY_FORM_URL
NEXT_PUBLIC_GHL_SALES_COACHING_FORM_URL
NEXT_PUBLIC_GHL_TESTIMONY_FORM_URL
NEXT_PUBLIC_GHL_BOOK_COPY_FORM_URL
```

Public form URLs may be exposed to the browser. Never expose Stripe or HMAC secrets as `NEXT_PUBLIC_*` variables.

## 10. Deployment

### Vercel

1. Connect the GitHub repository and production branch.
2. Configure environment variables for the intended Vercel environments.
3. Confirm `NEXT_PUBLIC_SITE_URL` is the canonical HTTPS domain.
4. Redeploy after environment changes.

### Stripe

1. Create one Price for each purchasable book/format combination.
2. Set the matching Price ID variables.
3. Create a Live-mode webhook for `https://officialcurtisriggleman.com/api/stripe/webhook`.
4. Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
5. Store its signing secret as `STRIPE_WEBHOOK_SECRET`.

### GHL

1. Create and publish the inbound webhook workflow.
2. Store its webhook URL as `GOHIGHLEVEL_ORDER_WEBHOOK_URL`.
3. Map contact email exactly and persist fields needed by later workflow stages.
4. Publish the physical order workflow and shipping-stage workflow.
5. Test a digital order, a physical order, a mixed order, and a shipped opportunity.

## 11. Testing and troubleshooting

There are currently no automated unit or integration tests. The production build is the baseline check:

```bash
npm run build
git status --short --branch
```

Manual smoke test:

1. Add a digital book and a physical book at `/training-courses`.
2. Confirm cart quantities, formats, and shipping.
3. Complete Stripe Checkout in the correct Stripe mode.
4. Confirm cart clearing after success.
5. Confirm Stripe delivered the webhook and Vercel logs contain the normalized order.
6. Confirm GHL received and routed the payload.
7. Verify a digital link opens the branded page and downloads the PDF.
8. Verify physical confirmation, internal alert, opportunity, and shipping email.

Common failures:

- **Checkout not configured:** missing Stripe secret, Price ID, or physical shipping rate.
- **Webhook HTTP 400:** wrong endpoint secret, missing signature, stale event, or changed raw body.
- **Webhook HTTP 502:** GHL rejected or failed to receive the order; inspect both Vercel and GHL logs.
- **No email:** inspect GHL skipped conditions, contact mapping, suppression, spam, and delivery status.
- **Email ending in `test`:** GHL contact mapping appended a literal test suffix.
- **Invalid/blank download:** token is expired, altered, or signed with a secret containing accidental quotes/whitespace.
- **Quantities missing:** map `orderItemsText`, not only a title list or raw `items` object.
- **Digital links run together:** use numbered link fields as separate GHL paragraphs.
- **Shipping email lacks order details:** persist fields during the first workflow; do not depend on the original webhook object.
- **Mixed order misses digital delivery:** add a branch based on `digitalBookCount > 0`.

## 12. Security and maintenance rules

- Keep PDFs in `private/downloads`.
- Keep Stripe and HMAC secrets only in Vercel environment variables.
- Treat emailed download URLs as temporary bearer credentials.
- Never commit `.env` files, customer payloads, or live download tokens.
- Preserve raw-body Stripe verification and timing-safe comparisons.
- Use `eventId` as the future idempotency key. The current route forwards accepted events; GHL should deduplicate retries.
- GHL definitions are external and not version-controlled here; export or document them after major changes.
- Keep a book slug consistent across catalog, Stripe metadata, PDF, cover, download map, and GHL fields.

## 13. Recommended future improvements

1. Add automated tests for checkout validation, signature verification, payload normalization, token expiry, and protected PDF responses.
2. Add persistent orders and idempotency keyed by Stripe `eventId`.
3. Add canonical `shippingAddressText` and formatted order summary in the webhook.
4. Add a tracking-number field to the opportunity contract.
5. Add The Road to the Sale to the storefront and checkout.
6. Version-control GHL workflow exports or create a documented backup process.
7. Add monitoring for failed GHL forwarding.
8. Consider single-use or customer-bound downloads if seven-day bearer links are not sufficient.
