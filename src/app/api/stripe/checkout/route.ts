import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const settingsUrl = process.env.NEXT_PUBLIC_APP_URL + "/dashboard";

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
