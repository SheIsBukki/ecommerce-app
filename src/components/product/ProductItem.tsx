import Image from "next/image";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

type ProductItemProps = { product: Product };

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="absolute right-2 top-2 z-10">
        <span className="animate-bounce rounded-full bg-red-500 px-2 py-1 text-xl font-bold text-white">
          HOT
        </span>
      </div>

      <figure className="relative h-48 w-full">
        {product.image && (
          <Image
            fill
            alt={product?.title || "Product image"}
            src={urlFor(product?.image).width(256).url()}
            className="object-contain p-2"
            loading="lazy"
          />
        )}
      </figure>

      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 h-10 text-sm font-medium">
          {product.title}
        </h3>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-500">
              ${(product.price || 0).toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ${((product.price || 0) * 3).toFixed(2)}
            </span>
          </div>

          <div className="mb-2 text-sm font-semibold text-green-500">
            🔥
            {100 +
              Math.abs(
                product._id
                  .split("")
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 500,
              )}
            + sold in the last 24h
          </div>

          <Link
            href={`/product/${product._id}`}
            className="w-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 py-2 text-center text-sm font-bold text-white transition-all hover:brightness-100"
          >
            GRAB IT NOW
          </Link>

          <div className="mt-1 animate-pulse text-center text-xs text-red-500">
            ⚡️Limited time offer
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
