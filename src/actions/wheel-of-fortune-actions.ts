"user server";

import { Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
// import { createClient } from "next-sanity";

export const getWheelOfFortuneConfiguration = async () => {
  /**
   * I will uncomment this if the client imported from @/sanity/lib/client doesn't work, and import client directly from next-sanity
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    useCdn: true, // Set tofalse if statically generating pages, using ISR or tag-based revalidation
  });
   */

  const randomProducts = await client.fetch<Product[]>(
    `*[_type == 'product'][0..6] `,
  );

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  const winningIndex = (day * 31 + month * 12 + year) % randomProducts.length;

  return { randomProducts, winningIndex };
};
