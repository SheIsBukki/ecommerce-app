import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ChevronRight, Home } from "lucide-react";
import { getProductById } from "@/sanity/lib/client";
import { formatPrice } from "@/lib/utils";
import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import AddToCartButton from "@/components/product/AddToCartButton";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product.price) {
    return <p>Product not found</p>;
  }

  const originalPrice = product.price * 3;

  return (
    <div className="bg-gray-50">
      <SalesCampaignBanner />

      {/*  Breadcrumb*/}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-600 transition-colors hover:text-red-600"
            >
              <Home className="h-4 w-4" />
              <span className="">Home</span>
            </Link>

            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="truncate text-gray-400">{product.title}</span>
          </div>
        </div>
      </div>

      {/*  Product Sale Banner*/}
      <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 px-4 py-6">
        <div className="container mx-auto">
          <h1 className="mb-3 text-center text-2xl font-bold text-red-600 md:text-4xl">
            🔥 FLASH SALE - 70% OFF 🔥
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="animate-pulse text-center text-sm font-semibold text-red-500 md:text-base">
              ⚡️ Only {Math.floor(Math.random() * 10) + 1} items left at this
              price!
            </p>
            <p className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
              ⏰ Offer ends soon!
            </p>
          </div>
        </div>
      </div>

      {/*  Guarantee Items*/}
      <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 px-4 py-6">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl text-yellow-600">🚚</span>
              <span className="font-medium dark:text-gray-900">
                Free Express Shipping
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-yellow-600">✨</span>
              <span className="font-medium dark:text-gray-900">
                Satisfaction Guaranteed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-yellow-600">🔐</span>
              <span className="font-medium dark:text-gray-900">
                Secure Checkout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/*  Product Details*/}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/*Product image*/}
          {product.image && (
            <div className="aspect-square overflow-hidden rounded-2xl bg-white p-4 shadow-lg">
              <figure className="relative aspect-square">
                <Image
                  fill
                  priority
                  alt={product.title ?? "Product image"}
                  src={urlFor(product.image).url()}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </figure>
            </div>
          )}

          {/*  Product information*/}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              {product.title}
            </h1>
            <p className="text-gray-600">{product.description}</p>

            {/*Price */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-red-600">US</span>
                  <span className="text-5xl font-black tracking-tight text-red-600">
                    {formatPrice(product.price).replace("$", "")}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-lg text-gray-400 line-through decoration-red-500/50 decoration-2">
                    {formatPrice(originalPrice)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse rounded bg-red-600 px-2 py-0.5 text-sm font-bold text-white">
                      -70%
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      MEGA SAVINGS
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2">
                <span className="font-bold text-red-600">💰</span>
                <span className="text-sm font-medium text-red-600">
                  You save {formatPrice(originalPrice - product.price)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-block size-2 animate-pulse rounded-full bg-green-500"></span>
                <span className="">
                  {Math.floor(Math.random() * 50) + 20} people bought in the
                  last hour
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <span className="text-xl">⚡️</span>
                <span className="font-bold">Limited Time Offer!</span>
              </div>

              <div className="mt-1 text-sm font-medium text-yellow-700">
                Order now before price changes!
              </div>
            </div>

            <AddToCartButton product={product} />

            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm shadow-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <span className="rounded-full bg-green-100 p-2">✅</span>
                <span className="font-medium">
                  In stock - Ships within 24 hours
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="rounded-full bg-green-100 p-2">🔄</span>
                <span className="font-medium">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="rounded-full bg-green-100 p-2">🛡️</span>
                <span className="font-medium">Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
