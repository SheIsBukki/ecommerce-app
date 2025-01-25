import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";
import { getCurrentSession } from "@/actions/auth";
import Header from "@/components/layout/Header";
import HeaderCategorySelector from "@/components/layout/HeaderCategorySelector";
import Cart from "@/components/cart/Cart";

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
        {children}

        <Cart />
        <SanityLive />
      </body>
    </html>
  );
}
