// "use client";

import Link from "next/link";
import { getBanner } from "@/sanity/lib/client";
// import { useRouter } from "next/navigation";
// import dayjs from "dayjs";
// import duration from "dayjs/plugin/duration";
// import relativeTime from "dayjs/plugin/relativeTime";

// dayjs.extend(duration);
// dayjs.extend(relativeTime);

const SalesCampaignBanner = async () => {
  // const router = useRouter();
  const banner = await getBanner();

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-red-600 py-3">
      <div className="container mx-auto px-4">
        {banner.map((banner) => (
          <div
            key={banner._id}
            className="flex flex-col items-center justify-center gap-2 text-white sm:flex-row sm:gap-6"
          >
            <div className="flex items-center gap-2">
              <span className="animate-bounce text-xl font-bold sm:text-2xl">
                {banner.emoji_1}
              </span>
              <p className="text-sm font-bold sm:text-base">{banner.text_1}</p>
              <p className="rounded bg-white/20 px-2 py-1 font-mono font-bold">
                23:59:59
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{banner.emoji_2}️</span>
              <p className="animate-pulse text-xl font-bold text-yellow-200">
                {banner.text_2}
              </p>
            </div>

            {/*<button*/}
            {/*  onClick={() => {*/}
            {/*    router.push("/products");*/}
            {/*  }}*/}
            {/*  className="rounded-full bg-white px-4 py-1 text-sm font-bold text-red-600 shadow-lg transition-colors hover:bg-yellow-100"*/}
            {/*>*/}
            {/*  SHOP NOW*/}
            {/*</button>*/}
            <Link
              href="/products"
              className="rounded-full bg-white px-4 py-1 text-sm font-bold text-red-600 shadow-lg transition-colors hover:bg-yellow-100"
            >
              {banner.button}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesCampaignBanner;
