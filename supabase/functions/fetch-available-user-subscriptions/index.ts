import Stripe from "stripe";
import type {
  TSubscription,
  TSubscriptionMetadata,
  TSubscriptionPrice,
  TSubscriptionType,
} from "../../../types/subscription.type.ts";
import { reverseFormatAmountForStripe } from "../../../utilities/payment-gateway.ts";

console.log("Fetch Available User Subscriptions - Starting...");

Deno.serve(async (_req) => {
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeKey) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-12-15.clover",
    });

    console.log("Searching for products...");

    const products = await stripe.products.search({
      query: "active:'true' AND metadata['role']:'user'",
      expand: ["data.default_price"],
    });

    console.log(`Found ${products.data.length} products`);

    const productsWithPrices = await Promise.all(
      products.data.map(async (product: Stripe.Product) => {
        const prices = await listPricesByProduct(stripe, product.id);

        return {
          ...product,
          prices: prices.data,
        };
      }),
    );

    const subscriptions: TSubscription[] = productsWithPrices.map(
      (product: Stripe.Product & { prices: Stripe.Price[] }) => ({
        id: product.id,
        title: product.name,
        description: product.description,
        prices: product.prices.map(
          (price: Stripe.Price): TSubscriptionPrice => ({
            id: price.id,
            period: (price.metadata?.period || "monthly") as TSubscriptionType,
            price: reverseFormatAmountForStripe(
              price.unit_amount || 0,
              price.currency,
            ),
          }),
        ),
        metadata: product.metadata as TSubscriptionMetadata,
      }),
    );

    console.log("Fetch Available User Subscriptions - Finished");

    return new Response(
      JSON.stringify({
        success: true,
        data: subscriptions,
        count: subscriptions.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (err) {
    console.error("Fetch Available User Subscriptions - Error:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        data: [],
        count: 0,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
});

async function listPricesByProduct(
  stripe: Stripe,
  productId: string,
): Promise<Stripe.ApiList<Stripe.Price>> {
  try {
    return await stripe.prices.list({
      product: productId,
      active: true,
    });
  } catch (error) {
    console.error(`Error fetching prices for product ${productId}:`, error);
    throw error;
  }
}
