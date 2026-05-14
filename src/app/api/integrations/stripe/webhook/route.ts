import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const sigSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const body = await req.text();

    // If secret is configured, verify signature server-side (stripe lib recommended).
    if (sigSecret) {
      // We intentionally keep this minimal to avoid adding stripe dependency here.
      // For production, install `stripe` npm package and verify using stripe.webhooks.constructEvent
      console.warn("STRIPE_WEBHOOK_SECRET is set but signature verification is not implemented. Install stripe package to enable verification.");
    }

    // Parse event and handle known types
    let event: any = null;
    try {
      event = JSON.parse(body);
    } catch (e) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }

    // Handle checkout.session.completed as example
    if (event.type === "checkout.session.completed") {
      const session = event.data?.object;
      // TODO: Fulfill order, update DB, etc.
      console.log("Checkout completed for", session?.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
