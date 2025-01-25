"use client";

import React, { useActionState } from "react";
import Form from "next/form";
import { Loader2 } from "lucide-react";

const initialState = { message: "" };

type SignUpProps = {
  action: (
    previousState: any,
    formData: FormData,
  ) => Promise<{ message: string } | undefined>;
};

const SignUp = ({ action }: SignUpProps) => {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Form
      action={formAction}
      className="mx-auto my-16 max-w-md rounded-lg bg-white p-8 shadow-md"
    >
      <h1 className="mb-2 text-center text-2xl font-bold">
        Join the DEAL Revolution!
      </h1>

      <p className="mb-2 text-center text-sm font-semibold text-rose-200">
        🔥LIMITED TIME OFFER 🔥
      </p>
      <p className="mb-2 text-center text-sm text-gray-600">
        Sign up now and get 90% OFF your first order!
      </p>

      <div className="space-y-6">
        {/*Email*/}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="w-full rounded-md border border-gray-200 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-black"
            name="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
          />
        </div>

        {/*Password*/}
        <div className="">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-gray-200 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-black"
            name="password"
            autoComplete="new-password"
            required
            placeholder="Create a password"
          />
        </div>

        {/* Copywriting */}
        <div className="text-center">
          <p className="mb-2 text-xs text-gray-500">
            ⚡️Only 127 welcome bonus packages remaining!
          </p>
          <p className="mb-4 text-xs text-gray-500">
            🕒 Offer expires in: 13:45
          </p>
        </div>

        {/*Submit button*/}
        <button
          type="submit"
          disabled={isPending}
          className={`${isPending ? "cursor-not-allowed" : ""} flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 py-3 font-medium text-white transition-colors hover:bg-rose-700`}
        >
          {isPending ? (
            <React.Fragment>
              <Loader2 className="size-4 animate-spin" />
              CREATING ACCOUNT...
            </React.Fragment>
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>

        {state?.message && state.message.length > 0 && (
          <p className="text-center text-sm text-red-600">{state.message}</p>
        )}
      </div>
    </Form>
  );
};

export default SignUp;
