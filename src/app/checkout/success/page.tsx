import { redirect } from "next/navigation";
import Stripe from "stripe";
import { IoMdCheckmark } from "react-icons/io";

const getCheckoutSession = async (sessionId: string) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
  });

  return stripe.checkout.sessions.retrieve(sessionId);
};

const CheckoutSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) => {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  const session = await getCheckoutSession(session_id);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto w-full max-w-md p-6">
        <div className="rounded-2xl bg-white p-6 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <IoMdCheckmark className="size-8 text-green-500" />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Thank you for your order!
          </h1>
          <p className="mb-6 text-gray-600">
            We have received your order, and will send you a confirmation email
            shortly!
          </p>

          <div className="text-sm text-gray-500">
            Order total:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: session.currency || "USD",
            }).format((session.amount_total || 0) / 100)}
          </div>

          <div className="text-sm text-gray-500">
            Order email: {session.customer_details?.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
