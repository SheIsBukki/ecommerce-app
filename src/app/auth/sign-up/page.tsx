import React from "react";
import { getCurrentSession, loginUser, registerUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import SignUp from "@/components/auth/SignUp";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

const SignUpPage = async () => {
  const { user } = await getCurrentSession();

  if (user) {
    return redirect("/");
  }

  const action = async (previousState: any, formData: FormData) => {
    "use server";

    const parsed = SignUpSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
      return { message: "Invalid email or password" };
    }

    const { email, password } = parsed.data;
    const { user, error } = await registerUser(email, password);

    if (error) {
      return { message: error };
    } else if (user) {
      await loginUser(email, password);
      return redirect("/");
    }
  };

  return <SignUp action={action} />;
};

export default SignUpPage;
