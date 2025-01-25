"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useShallow } from "zustand/shallow";
import { VscMenu } from "react-icons/vsc";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/auth";
import HeaderSearchBar from "@/components/layout/HeaderSearchBar";
import { useCartStore } from "@/stores/cart-store";

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-black py-2">
      <div className="container mx-auto flex items-center justify-center px-8">
        <span className="text-center text-sm font-medium tracking-wide text-white">
          FREE SHIPPING ON ORDERS OVER $49!
        </span>
      </div>
    </div>
  );
};

type HeaderProps = {
  user: Omit<User, "passwordHash"> | null;
  categorySelector: React.ReactNode;
};

export default function Header({ user, categorySelector }: HeaderProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [previousScrollY, setPreviousScrollY] = useState<number>(0);

  const { open, getTotalItems } = useCartStore(
    useShallow((state) => ({
      open: state.open,
      getTotalItems: state.getTotalItems,
    })),
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolledUp = currentScrollY < previousScrollY;

      if (scrolledUp) {
        setIsOpen(true);
      } else if (currentScrollY > 100) {
        setIsOpen(false);
      }

      setPreviousScrollY(currentScrollY);
    };

    setPreviousScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [previousScrollY]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={`w-full transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <AnnouncementBar />

        <div className="flex w-full items-center justify-between border-b border-gray-100 bg-white/80 py-3 shadow-sm backdrop-blur-sm sm:py-4">
          <div className="container mx-auto flex items-center justify-between px-8">
            <div className="flex flex-1 items-center justify-start gap-4 sm:gap-6">
              <button className="text-gray-700 md:hidden">
                <VscMenu className="h-5 w-5 text-gray-700 hover:text-gray-900 sm:h-6 sm:w-6 dark:text-gray-400" />
              </button>

              <nav className="hidden gap-4 text-sm font-medium md:flex lg:gap-6">
                {categorySelector}
                <Link href="/">Sale</Link>
              </nav>
            </div>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="text-xl font-bold tracking-tight sm:text-2xl">
                DEAL
              </span>
            </Link>

            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
              <HeaderSearchBar />

              {user ? (
                <React.Fragment>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="hidden text-sm text-gray-700 md:block">
                      {user.email}
                    </span>
                    <Link
                      href="#"
                      className="text-xs font-medium text-gray-700 hover:text-gray-900 md:text-sm"
                      onClick={async (event) => {
                        event.preventDefault();
                        await logoutUser();
                        router.refresh();
                      }}
                    >
                      Sign Out
                    </Link>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Link
                    href="/auth/sign-in"
                    className="text-xs font-medium text-gray-700 hover:text-gray-900 md:text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="text-xs font-medium text-gray-700 hover:text-gray-900 md:text-sm"
                  >
                    Sign Up
                  </Link>
                </React.Fragment>
              )}

              <button
                onClick={() => open()}
                className="relative text-gray-700 hover:text-gray-900"
              >
                <HiOutlineShoppingBag className="h-5 w-5 text-gray-700 hover:text-gray-900 sm:h-6 sm:w-6 dark:text-gray-400" />
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[10px] text-white sm:h-4 sm:w-4 sm:text-xs">
                  {getTotalItems()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
