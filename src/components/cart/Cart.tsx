"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useShallow } from "zustand/shallow";
import { Loader2, ShoppingCart, X } from "lucide-react";
import Image from "next/image";

import {
  useCartStore,
  type CartItem as CartItemType,
} from "@/stores/cart-store";
import { createCheckoutSession } from "@/actions/stripe-actions";
import { formatPrice } from "@/lib/utils";

const freeShippingAmount = 50; // $15 for free shipping

// This CartItem allows the creation of a functionality that limit wheel product win to only one item, preventing users from increasing the quantity of the product they win
const CartItem = ({ item }: { item: CartItemType }) => {
  const { updateQuantity, remoteItem } = useCartStore(
    useShallow((state) => ({
      updateQuantity: state.updateQuantity,
      remoteItem: state.removeItem,
    })),
  );

  const isFreeItem = item.price === 0;

  return (
    <div
      key={`cart-item-${item.id}`}
      className="flex gap-4 p-4 hover:bg-gray-50"
    >
      <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-lg border">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium text-gray-900">{item.title}</h3>

        <div className="mt-1 text-sm text-gray-500">
          {isFreeItem ? (
            <span className="font-medium text-emerald-600">FREE</span>
          ) : (
            formatPrice(item.price)
          )}
        </div>

        <div className="mt-2 flex items-center gap-3">
          {isFreeItem ? (
            <div className="text-sm font-medium text-emerald-600">
              Prise Item
            </div>
          ) : (
            <>
              <select
                value={item.quantity}
                onChange={(event) =>
                  updateQuantity(item.id, Number(event.target.value))
                }
                className="rounded-md border px-2 py-1"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option
                    key={`cart-quantity-select-${item.id}-${num}`}
                    value={num}
                  >
                    {num}
                  </option>
                ))}
              </select>

              <button
                className="text-sm text-red-500 hover:text-red-600"
                onClick={() => remoteItem(item.id)}
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const {
    cartId,
    items,
    close,
    isOpen,
    syncWithUser,
    setLoaded,
    getTotalItems,
    updateQuantity,
    remoteItem,
    getTotalPrice,
  } = useCartStore(
    useShallow((state) => ({
      cartId: state.cartId,
      items: state.items,
      close: state.close,
      isOpen: state.isOpen,
      syncWithUser: state.syncWithUser,
      setLoaded: state.setLoaded,
      getTotalItems: state.getTotalItems,
      updateQuantity: state.updateQuantity,
      remoteItem: state.removeItem,
      getTotalPrice: state.getTotalPrice,
    })),
  );

  useEffect(() => {
    const initCart = async () => {
      await useCartStore.persist.rehydrate();
      await syncWithUser();
      setLoaded(true);
    };

    initCart();
  }, [setLoaded, syncWithUser]);

  const [loadingProceed, setLoadingProceed] = useState<boolean>(false);

  const handleProceedToCheckout = async () => {
    if (!cartId || loadingProceed) {
      return;
    }

    setLoadingProceed(true);

    const checkoutUrl = await createCheckoutSession(cartId);

    /** Umami Tracking*/
    try {
      const anyWindow = window as any;

      if (anyWindow.umami) {
        anyWindow.umami.track("proceed_to_checkout", {
          cartId: cartId,
          totalPrice: getTotalPrice(),
          currency: "USD",
        });
      }
    } catch (e) {}

    window.location.href = checkoutUrl;

    setLoadingProceed(false);
  };

  const totalPrice = getTotalPrice();

  const remainingForFreeShipping = useMemo(() => {
    return Math.max(0, freeShippingAmount - totalPrice);
  }, [totalPrice]);

  return (
    <>
      {/*  Backdrop*/}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={close}
        ></div>
      )}

      {/*  Cart Drawer*/}
      <div
        className={`fixed right-0 top-0 z-50 size-full transform bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[400px] ${isOpen ? "translate-x-0" : "translate-x-full"} `}
      >
        <div className="flex h-full flex-col">
          {/*  Cart Header*/}
          <div className="flex items-center justify-between border-b bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <span className="rounded-full bg-gray-200 px-2 py-1 text-sm font-medium">
                {getTotalItems()}
              </span>
            </div>

            <button
              onClick={close}
              className="rounded-full p-2 transition-colors hover:bg-gray-200"
            >
              <X className="size-5" />
            </button>
          </div>

          {/*  Cart Items*/}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
                  <ShoppingCart className="size-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Your cart is empty
                </h3>
                <p className="mb-6 text-gray-500">
                  Looks like you have not added any items to your cart yet!
                </p>
                <Link
                  onClick={close}
                  href="/"
                  className="rounded-full bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-900"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={"cart-item-" + item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/*  Cart Footer*/}
          {items.length > 0 && (
            <div className="border-t">
              {/*Shipping progress*/}
              {remainingForFreeShipping > 0 ? (
                <div className="border-b bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-blue-800">
                    <span className="">🚚</span>
                    <span className="font-medium">
                      Add {formatPrice(remainingForFreeShipping)} more for FREE
                      shipping
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-blue-200">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (totalPrice / freeShippingAmount) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="border-b bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <span className="">✨</span>
                    <span className="font-medium">
                      You have unlocked FREE shipping!
                    </span>
                  </div>
                </div>
              )}

              {/*Order summary and checkout*/}
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">
                      {remainingForFreeShipping > 0
                        ? "Calculated at checkout"
                        : "FREE"}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-bold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    disabled={loadingProceed}
                    className="flex w-full items-center justify-center rounded-full bg-black py-4 font-bold text-white transition-colors hover:bg-gray-900"
                  >
                    {loadingProceed ? (
                      <div className="flex items-center gap-1">
                        Navigating to checkout...
                        <Loader2 className="size-4 animate-spin" />
                      </div>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </button>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="">🔐</span>
                      <span className="">Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="">🔄</span>
                      <span className="">30-day returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="">💳</span>
                      <span className="">
                        All major payment methods accepted
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
