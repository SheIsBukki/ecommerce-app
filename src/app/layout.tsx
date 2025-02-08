import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";

import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { getCurrentSession } from "@/actions/auth";
import Header from "@/components/layout/Header";
import HeaderCategorySelector from "@/components/layout/HeaderCategorySelector";
import Cart from "@/components/cart/Cart";
import AnalyticsTracker from "@/components/layout/AnalyticsTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eCommerce App",
  description: "It's like Temu",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-[125vh] antialiased`}>
        <Header user={user} categorySelector={<HeaderCategorySelector />} />
        <Script
          data-website-id="acceb3d5-ce18-47d4-a951-4e995ff0e4a6"
          src="https://cloud.umami.is/script.js"
          strategy="beforeInteractive"
        />

        <Suspense>
          <AnalyticsTracker user={user} />
        </Suspense>

        {children}
        <Cart />
        <SanityLive />
      </body>
    </html>
  );
}
