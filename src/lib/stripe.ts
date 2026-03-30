import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_')) {
      throw new Error("Stripe API Key not configured");
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: "2023-10-16",
      typescript: true,
    });
  }
  return stripeInstance;
};

// Deprecated: use getStripe() instead for build safety
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get webhooks() { return getStripe().webhooks; },
};
