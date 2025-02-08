"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Loader2 } from "lucide-react";
import { BsCart3 } from "react-icons/bs";

import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

type AddToCartButtonProps = { product: Product };

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { cartId, addItem, open } = useCartStore(
    useShallow((state) => ({
      cartId: state.cartId,
      addItem: state.addItem,
      open: state.open,
    })),
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!product.title || product.price === undefined || !product.image) {
      return;
    }

    setIsLoading(true);
    // Add item to the cart
    await new Promise((resolve) => setTimeout(resolve, 600));

    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: urlFor(product.image).url(),
      quantity: 1,
    });

    /** Umami Tracking*/
    try {
      const anyWindow = window as any;

      if (anyWindow.umami) {
        anyWindow.umami.track("add_to_cart", {
          cartId: cartId,
          productId: product._id,
          productName: product.title,
          price: product.price,
          currency: "USD",
        });
      }
    } catch (e) {}

    setIsLoading(false);
    open();
  };

  if (!product.price) {
    return null;
  }

  return (
    <button
      disabled={isLoading}
      onClick={handleAddToCart}
      className={`mt-6 flex w-full transform items-center justify-center gap-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 py-4 text-xl font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:scale-100 disabled:hover:from-red-500 disabled:hover:to-red-600 disabled:active:scale-100`}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-6 animate-spin" />
          <span className="">Adding to Cart...</span>
        </>
      ) : (
        <>
          <BsCart3 className="size-6" />
          Add to Cart - {formatPrice(product.price)}
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
