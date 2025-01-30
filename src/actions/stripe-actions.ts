"use server";

import Stripe from "stripe";
import { getCurrentSession } from "@/actions/auth";
import { getOrCreateCart } from "@/actions/cart-actions";

// Adding the exclamation mark tells TypeScript that key has definitely been set to something and is not undefined.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export const createCheckoutSession = async (cartId: string) => {
  const { user } = await getCurrentSession();
  const cart = await getOrCreateCart(cartId);

  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title, images: [item.image] },
        unit_amount: Math.round(item.price * 100), // Stripe uses the lowest unit of a currency, and in this, it is cents, since 100 cents make a dollar, the price is multiplied by 100 to get the cents equivalent — Hence, $100.5 is $1.005 in cents
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL!}`,
    customer_email: user?.email,
    metadata: { cartId: cart.id, userId: user?.id?.toString() || "-" },
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            currency: "usd",
            amount: totalPrice >= 50 ? 0 : 3 * 100,
          },
          display_name: totalPrice >= 50 ? "Free Shipping" : "Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
    ],
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
};
