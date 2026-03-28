export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settingsUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/dashboard";
    
    // Build-time safety check
    if (!process.env.STRIPE_API_KEY || process.env.STRIPE_API_KEY.includes('YOUR_')) {
      return new Response(JSON.stringify({ skip: true }), { status: 200 });
    }

    // Move Clerk inside to prevent build-time crashes
    const { auth, currentUser } = await import("@clerk/nextjs");
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Dynamic import to prevent build-time crashes
    const { stripe } = await import("@/lib/stripe");

    // Replace with your actual price ID from Stripe dashboard
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "AI Company Automation Pro",
              description: "Full access to AI automation features",
            },
            unit_amount: 2000, // $20.00
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          userId,
        },
      },
      metadata: {
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
