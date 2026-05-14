Integration helpers and lightweight examples live in `src/app/api/integrations/`.

Files added:
- `src/app/api/integrations/resend/route.ts` — POST endpoint to send an email via Resend. POST `{ to, subject, html }`.
- `src/app/api/integrations/posthog/route.ts` — POST endpoint to forward events to PostHog. POST `{ event, properties }`.

Next steps:
- Add the environment variables from `.env.example` to your deployment (Vercel / other host).
- Replace the `from` address in the Resend example before using in production.
- For MongoDB, Cloudinary, LiveKit server-side integrations and Stripe webhooks, I can scaffold remaining routes and helpers if you want — tell me which to prioritize.
