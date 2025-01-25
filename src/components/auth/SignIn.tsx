"use client";

import React, { useActionState } from "react";
import Form from "next/form";
import { Loader2 } from "lucide-react";

const initialState = { message: "" };

type SignInProps = {
  action: (
    previousState: { message: string } | undefined,
    formData: FormData,
  ) => Promise<{ message: string } | undefined>;
};

const SignIn = ({ action }: SignInProps) => {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Form
      action={formAction}
      className="mx-auto my-16 max-w-md rounded-lg bg-white p-8 shadow-md"
    >
      <h1 className="mb-2 text-center text-2xl font-bold">Welcome Back!</h1>

      <p className="mb-2 text-center text-sm font-semibold text-rose-200">
        🔥MEMBER EXCLUSIVE 🔥
      </p>
      <p className="mb-2 text-center text-sm text-gray-600">
        Sign in to access your exclusive member deals!
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
            placeholder="Enter your password"
          />
        </div>

        {/* Copywriting */}
        <div className="text-center">
          <p className="mb-2 text-xs text-gray-500">
            ⚡️Members save an extra 15% on all orders!
          </p>
          <p className="mb-4 text-xs text-gray-500">
            🚀 Plus free shipping on orders over $49
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
              SIGNING IN...
            </React.Fragment>
          ) : (
            "SIGN IN"
          )}
        </button>

        {state?.message && state.message.length > 0 && (
          <p className="text-center text-sm text-red-600">{state.message}</p>
        )}
      </div>
    </Form>
  );
};

export default SignIn;
