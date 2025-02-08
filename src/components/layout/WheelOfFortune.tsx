"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import { Product } from "@/sanity.types";
import { ImSpinner9 } from "react-icons/im";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/stores/cart-store";
import { addWinningItemToCart } from "@/actions/cart-actions";
import { urlFor } from "@/sanity/lib/image";
import { Loader2, ShoppingCartIcon } from "lucide-react";

const COLOURS = [
  ["#dc2626", "#ef4444"], // red gradient (deeper)
  ["#ea580c", "#f97316"], // orange gradient (deeper)
  ["#eab308", "#facc15"], // yellow gradient (deeper)
  ["#65a30d", "#84cc16"], // lime gradient (deeper)
  ["#059669", "#10b981"], // emerald gradient (deeper)
  ["#0891b2", "#06b6d4"], // cyan gradient (deeper)
  ["#2563eb", "#3b82f6"], // blue gradient (deeper)
  ["#4f46e5", "#6366f1"], // indigo gradient (deeper)
  ["#9333ea", "#a855f7"], // purple gradient (deeper)
  ["#db2777", "#ec4899"], // pink gradient (deeper)
] as const;

const getSliceStyle = (length: number, index: number): React.CSSProperties => {
  const degrees = 360 / length;
  const rotate = degrees * index;

  const angle = (2 * Math.PI) / length;
  const r = 100;
  const startAngle = -angle / 2;
  const endAngle = angle / 2;

  const numPoints = 10;
  const points = [];

  points.push("50% 50%");

  for (let i = 0; i <= numPoints; i++) {
    const currentAngle = startAngle + (endAngle - startAngle) * (i / numPoints);
    const x = 50 + r * Math.cos(currentAngle);
    const y = 50 + r * Math.sin(currentAngle);

    points.push(`${x}% ${y}%`);
  }

  const [colourStart, colourEnd] = COLOURS[index % COLOURS.length];

  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    transformOrigin: "50% 50%",
    transform: `rotate(${rotate}deg)`,
    background: `linear-gradient(115deg, ${colourStart} 0%, ${colourEnd} 100%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.2) 100%)`,
    backgroundBlendMode: "overlay",
    clipPath: `polygon(${points.join(", ")})`,
  };
};

const getTextStyle = (): React.CSSProperties => {
  const midAngle = 0;
  const radian = midAngle * Math.PI;

  const radius = 35;
  const x = Math.cos(radian) * radius - 20;
  const y = Math.sin(radian) * radius - 5;

  return {
    position: "absolute",
    width: "200px",
    height: "80px",
    wordWrap: "break-word",
    left: `calc(50% + ${x}%)`,
    top: `calc(50% + ${y}%)`,
    color: "white",
    fontSize: "13px",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    whiteSpace: "wrap",
    display: "flex",
    flexDirection: "column",
  };
};

const WinningItem = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const router = useRouter();

  const {
    cartId,
    setStore,
    open: openCart,
  } = useCartStore(
    useShallow((state) => ({
      cartId: state.cartId,
      setStore: state.setStore,
      open: state.open,
    })),
  );

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!cartId) {
      return;
    }

    setIsAdding(true);

    const updatedCart = await addWinningItemToCart(cartId, product);
    localStorage.setItem("has-played-wheel-of-fortune", "true");

    setStore(updatedCart);

    await new Promise((resolve) => setTimeout(resolve, 500));
    router.refresh();
    openCart();
    onClose();

    setIsAdding(false);
  };

  return (
    <div className="animate-[slideUp_0.5s_ease-out] text-center">
      <div
        className={`transform rounded-xl border border-white/20 bg-white bg-opacity-90 p-8 shadow-2xl backdrop-blur-lg transition-all duration-500 hover:scale-[1.01] hover:shadow-emerald-500/20`}
      >
        <div className="relative p-4">
          <div className="absolute inset-0 animate-pulse rounded-lg bg-gradient-to-r from-emerald-500/10 to-sky-500/10" />

          <h3
            className={`mb-8 animate-[pulse_2s_ease-in-out_infinite] p-4 text-2xl font-bold text-emerald-600 [text-shadow:_0_1px_2px_rgb(0_0_0_/_10%)]`}
          >
            🎉 Congratulations 🎉
          </h3>

          <div className="flex flex-col items-center gap-6">
            {product.image && (
              <div className="group relative">
                {/*Sparkle Effects*/}
                <div
                  className={`absolute -inset-4 animate-pulse rounded-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-75 blur-lg transition-opacity duration-500 group-hover:opacity-100`}
                />

                {/*Main Product Content*/}
                <div className="relative rounded-xl bg-gradient-to-br from-white to-gray-50 p-4 shadow-2xl">
                  {/*Price tag*/}
                  <div className="absolute -right-3 -top-3 z-10 rounded-full bg-red-600 px-4 py-1 text-lg font-black text-white shadow-lg">
                    FREE!
                  </div>

                  {/*Image*/}
                  <div className="relative overflow-hidden rounded-lg border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    <Image
                      src={urlFor(product.image).width(256).url()}
                      alt={product.title || "Winning product!"}
                      className="transform object-cover transition-all duration-500 group-hover:scale-105"
                      width={256}
                      height={256}
                    />

                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-transparent" />

                    <div className="absolute bottom-2 left-2 rounded-full bg-yellow-500/90 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      Limited Time Only!
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 text-center">
              <h4 className="text-xl font-bold text-gray-800">You won:</h4>
              <p className="text-lg font-semibold text-emerald-600">
                {product.title}
              </p>
              {product.description && (
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`mt-6 flex w-full transform items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isAdding ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Adding to Cart...
            </>
          ) : (
            <>
              <ShoppingCartIcon className="size-5" />
              Claim Your Prize!
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const PriceTag = ({ price }: { price: number }) => {
  return (
    <div className="flex items-center">
      <span className="text-base font-extrabold text-white drop-shadow-lg [text-shadow:_-2px_-2px_0_#22C55E,_2px_-2px_0_#22C55E,-2px_2px_0_#22C55E,_2px_2px_0_#22C55E]">
        ${price.toFixed(2)}
      </span>
    </div>
  );
};

type WheelOfFortuneProps = { products: Product[]; winningIndex: number };

const WheelOfFortune = ({ products, winningIndex }: WheelOfFortuneProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [showWinningItem, setShowWinningItem] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);

  const [wheelStyle, setWheelStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const hasPlayed = localStorage.getItem("has-played-wheel-of-fortune");

    if (!hasPlayed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  });

  const handleSpin = () => {
    if (isSpinning || hasSpun) {
      return;
    }

    setIsSpinning(true);
    setHasSpun(true);
    setShowWinningItem(false);

    setWheelStyle({ animation: "none" });

    requestAnimationFrame(() => {
      const numberOfSpins = 5;
      const degreesPerProduct = 360 / products.length;

      const spinToIndex = winningIndex;
      const randomOffset = degreesPerProduct * (0.2 + Math.random() * 0.6);

      const degrees =
        numberOfSpins * 360 +
        spinToIndex * degreesPerProduct -
        degreesPerProduct / 2 +
        randomOffset;

      setWheelStyle({
        transform: `rotate(-${degrees}deg)`,
        transition: `transform 4s cubic-bezier(0.17, 0.67,0.08,0.99)`,
        animation: "none",
      });

      setTimeout(() => {
        setIsSpinning(false);

        setTimeout(() => {
          setShowWinningItem(true);
        }, 500);
      }, 4000);
    });
  };
  //
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        // aria-describedby="A Spin and Win Wheel"
        className="p-0 sm:max-w-[800px]"
      >
        <DialogTitle>
          <div className="relative overflow-hidden p-6 text-center">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-red-500/20 to-orange-500/20" />
            <h2 className="mb-2 animate-bounce text-2xl font-bold">
              Spin & Win! 🎁{" "}
            </h2>
            <p className="relative mb-4 animate-pulse text-muted-foreground">
              Try your luck! Spin the wheel for a chance to win amazing prices
            </p>
            <div className="absolute -left-10 top-1/2 h-8 w-40 rotate-45 animate-[shine_2s_infinite] bg-white/20" />
          </div>
        </DialogTitle>

        <div className="flex flex-col items-center justify-center gap-4 bg-gray-50 p-8">
          <div
            className={`relative size-[350px] transform transition-all duration-1000 ease-in-out md:size-[600px] ${showWinningItem ? "rotate-180 scale-0 opacity-0" : "scale-100 opacity-100"}`}
          >
            {/*Red Pointer*/}
            <div
              className={`absolute right-0 top-1/2 z-20 size-0 -translate-y-1/2 translate-x-2 border-b-[20px] border-r-[40px] border-t-[20px] border-b-transparent border-r-red-600 border-t-transparent`}
            />

            {/*Wheel*/}
            <div
              className={`shadow-[0_0_20px_rgba(0,0,0, 0.2)] absolute inset-0 overflow-hidden rounded-full border-8 border-gray-200 ${!isSpinning && !hasSpun && "animate-[float_3s_ease_in_out_infinite]"}`}
              style={{
                ...wheelStyle,
                animation:
                  !isSpinning && !hasSpun
                    ? "spin 30s linear infinite"
                    : undefined,
              }}
            >
              {products.map((product, index) => (
                <div
                  className="absolute inset-0"
                  key={product._id}
                  style={getSliceStyle(products.length, index)}
                >
                  <div style={getTextStyle()} className="truncate px-2">
                    <span className="truncate">{product.title}</span>
                    <PriceTag price={(product.price || 0) * 3.33} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`absolute inset-0 flex transform items-center justify-center p-8 transition-all duration-1000 ease-in-out ${!showWinningItem ? "translate-y-full scale-0 opacity-0" : "translate-y-0 scale-100 opacity-100"} `}
          >
            {hasSpun && !isSpinning && (
              <WinningItem
                product={products[winningIndex]}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>

          {/*Wheel button*/}
          <button
            onClick={handleSpin}
            disabled={isSpinning || hasSpun}
            className={`shadow-[0_0_20px_rgba(234,179,8, 0.5)] relative animate-[gradient-x_2s_linear_infinite] rounded-full border-4 border-yellow-300 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-[length:200%_100%] px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.8)] disabled:cursor-not-allowed disabled:opacity-50 ${showWinningItem ? "-translate-y-full scale-0 opacity-0" : ""} before:absolute before:inset-0 before:animate-[pulse_1s_ease-in-out_infinite] before:bg-white/20`}
          >
            {isSpinning ? (
              <span className="inline-flex items-center gap-2">
                <ImSpinner9 className="size-5 animate-spin text-white" />
                Spinning...
              </span>
            ) : hasSpun ? (
              "🎉 Congratulations! 🎉"
            ) : (
              <>
                <span className="animate-[pulse_1s_ease-in-out_infinite]">
                  🎁
                </span>
                {"SPIN NOW!"}
                <span className="animate-[pulse_1s_ease-in-out_infinite]">
                  🎁
                </span>
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WheelOfFortune;
