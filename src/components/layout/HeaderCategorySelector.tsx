import React from "react";
import { getAllCategories } from "@/sanity/lib/client";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

export default async function HeaderCategorySelector() {
  const categories = await getAllCategories();

  return (
    <div className="relative inline-block">
      <button className="group peer flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900">
        Categories
        <IoIosArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-100 hover:visible hover:opacity-100 peer-hover:visible peer-hover:opacity-100">
        <div className="w-64 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl">
          <div className="py-2">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category?.slug?.current}`}
                prefetch
                className="block px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-100 hover:bg-gray-50 hover:text-gray-900"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
