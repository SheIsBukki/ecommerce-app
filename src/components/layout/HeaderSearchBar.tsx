import React from "react";
import Form from "next/form";
import { CiSearch } from "react-icons/ci";

const HeaderSearchBar = () => {
  // Redirects to /search?query={insert whatever search query}
  return (
    <Form action="/search">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <CiSearch className="h-4 w-4 text-gray-400 hover:text-gray-900 sm:h-6 sm:w-6 dark:text-gray-400" />
        </div>
        <input
          type="text"
          name="query"
          className="w-32 rounded-md border border-gray-200 py-1 pl-8 text-sm transition-colors focus:border-transparent focus:ring-1 focus:ring-black"
          placeholder="Search..."
        />
      </div>
    </Form>
  );
};

export default HeaderSearchBar;
