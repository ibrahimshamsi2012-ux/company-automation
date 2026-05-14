# AI Company Automation App

A powerful AI-driven platform for companies to automate their emails, tasks, and meetings.

## Features

- **AI Email Manager**: Automatically filter spam, organize real emails, and get AI reviews.
- **AI Task Automation**: Turn complex instructions into hours of saved work.
- **AI Support**: 24/7 Voice (robot-like speaking) and Chat assistance.
- **Live Meetings**: Built-in livestream and meeting rooms using LiveKit.
- **Subscription Model**: 7-day free trial, followed by $20/month.
- **Verification**: Built-in AI and Stripe verification for accounts.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide React
- **Backend**: Next.js API Routes, Stripe, OpenAI, LiveKit
- **Auth**: Clerk

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Set up your `.env.local` file with the following keys:
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
    - `STRIPE_API_KEY`
    - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    - `OPENAI_API_KEY`
    - `LIVEKIT_API_KEY`
    - `LIVEKIT_API_SECRET`
    - `NEXT_PUBLIC_LIVEKIT_URL`
    - `GOOGLE_API_KEY` (optional - used to call Google Gemini / PaLM generative API)
    - `GOOGLE_GEMINI_MODEL` (optional - defaults to `models/text-bison-001`)
    - `PREFERRED_AI_PROVIDER` (optional - `openai`, `google`, or `auto`. Defaults to `auto`.)

    ## Integrations

    This project can integrate with external providers for auth, AI, realtime meetings, payments, analytics, email, storage and database. Add the following environment variables and follow the provider docs to obtain keys.

    - Google Cloud (OAuth / Authentication):
        - `GOOGLE_CLIENT_ID`
        - `GOOGLE_CLIENT_SECRET`
        - `GOOGLE_OAUTH_REDIRECT` (your app URL + callback)

    - OpenAI (AI):
        - `OPENAI_API_KEY`

    - LiveKit (Realtime meetings):
        - `NEXT_PUBLIC_LIVEKIT_URL` (e.g. wss://your-livekit.server)
        - `LIVEKIT_API_KEY`
        - `LIVEKIT_API_SECRET`

    - Stripe (Payments):
        - `STRIPE_SECRET_KEY`
        - `STRIPE_WEBHOOK_SECRET`

    - PostHog (Product analytics):
        - `POSTHOG_API_KEY`
        - `POSTHOG_API_HOST` (optional, defaults to https://app.posthog.com)

    - Resend (Transactional email):
        - `RESEND_API_KEY`

    - MongoDB (Database):
        - `MONGODB_URI`

    - Cloudinary (Media hosting):
        - `CLOUDINARY_CLOUD_NAME`
        - `CLOUDINARY_API_KEY`
        - `CLOUDINARY_API_SECRET`

    Minimal server-side helpers are provided under `src/app/api/integrations/` as lightweight REST wrappers that call provider HTTP APIs. These are meant as examples — replace or extend them to match production needs and secure secrets in your hosting provider (Vercel, etc.).

    Google sign-in (Clerk):
    - To enable Google sign-in, go to your Clerk dashboard -> Your Application -> OAuth & Connections, enable Google, and provide the OAuth client ID/secret. Then set the following env vars in Vercel or your `.env.local`:
        - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
        - `CLERK_SECRET_KEY`
        - Configure Google OAuth in Clerk with your app's redirect URI (e.g., https://aiautomatedcompany2.vercel.app/* or http://localhost:3000/*)

    Project Assessor API & UI:
    - A new assessor endpoint exists at `/api/ai/assess`. Authenticated users can submit a `projectUrl`, `description`, and `email` to get an automated AI assessment. A simple frontend component is available at `src/components/project-assessor.tsx` for quick integration into your dashboard.

    Security note: The assessor uses your configured AI provider keys; ensure `OPENAI_API_KEY` and any `GOOGLE_API_KEY` are set in your environment for real evaluations. There's a dev bypass available in the chat API for quick testing only; remove it before production.
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Application routes and pages.
- `src/components`: Reusable UI components.
- `src/lib`: Shared libraries (Stripe, OpenAI, etc.).
- `src/api`: Backend API routes for AI and payments.
