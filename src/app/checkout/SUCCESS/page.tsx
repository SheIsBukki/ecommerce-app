import { redirect } from "next/navigation";
import Stripe from "stripe";
import { FaCheck } from "react-icons/fa6";

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
            <FaCheck />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
