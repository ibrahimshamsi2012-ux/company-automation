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
