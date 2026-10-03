# Official Curtis Riggleman Website

Marketing site, book storefront, digital-book delivery, and physical-book fulfillment integration for Official Curtis Riggleman. The application is maintained by AWEVO Software Solutions.

## Start here

- Full developer and operations guide: [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md)
- Stripe and GoHighLevel setup notes: [`docs/STRIPE_WEBHOOK_SETUP.md`](docs/STRIPE_WEBHOOK_SETUP.md)
- Wix Headless checkout migration notes: [`docs/WIX_HEADLESS_SETUP.md`](docs/WIX_HEADLESS_SETUP.md)

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Before testing checkout or fulfillment locally, configure the environment variables described in the developer guide. The site can render without Stripe configured, but checkout and signed-download fulfillment cannot complete without their secrets and price IDs.

## Production commands

```bash
npm run build
npm run start
```

Production is deployed through Vercel. The production Stripe webhook endpoint is:

`https://officialcurtisriggleman.com/api/stripe/webhook`

Do not place Stripe secrets, download secrets, or private PDFs in `public/` or in source control.
