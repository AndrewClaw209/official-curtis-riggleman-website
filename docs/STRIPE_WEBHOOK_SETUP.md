# Stripe webhook setup

The production webhook endpoint is:

`https://officialcurtisriggleman.com/api/stripe/webhook`

In Stripe Dashboard **Live mode**:

1. Open **Developers → Webhooks**.
2. Add an endpoint using the URL above.
3. Subscribe to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
4. Copy the endpoint signing secret (`whsec_...`).
5. Add it to Vercel Production as `STRIPE_WEBHOOK_SECRET`.
6. Redeploy the site.

The webhook verifies Stripe's signature and records a structured fulfillment record in the Vercel function logs. The Checkout Session metadata also retains the order items, payment status, customer email, and shipping address in Stripe for fulfillment reference. The event ID should be used for deduplication if a database or email notification sink is added later.

## GoHighLevel order automation

Create a GoHighLevel workflow with an inbound webhook trigger, then add its webhook URL to Vercel Production as `GOHIGHLEVEL_ORDER_WEBHOOK_URL`. The Stripe webhook forwards the event/session IDs, payment status, customer details, shipping address, and order items. The workflow can then notify the team, create a fulfillment task, and send customer follow-up messages.

Digital book orders include a `downloadUrl` on each digital item, a `digitalDownloadLinks` list, and an email-ready `digitalDownloadLinksText` field. Each link is signed and expires seven days after the paid order. PDFs are kept outside `public/` and served only through the signed download route.
