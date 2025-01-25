import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import ProductGrid from "@/components/product/ProductGrid";
import { searchProducts } from "@/sanity/lib/client";

type SearchPageProps = { searchParams: Promise<{ query: string }> };

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { query } = await searchParams;

  const products = await searchProducts(query);

  return (
    <div>
      <SalesCampaignBanner />

      <div className="bg-red-50 p-4">
        <div className="container mx-auto">
          <h1 className="mb-2 text-center text-2xl font-bold text-red-600 md:text-3xl">
            Search Results for &quot;{query}&quot; - UP TO 70% OFF! 🔥
          </h1>
          <p className="animate-pulse text-center text-sm text-red-500 md:text-base">
            ⚡️Flash Sale Ending Soon! ⏰ Limited Time Only
          </p>
          <p className="mt-2 text-center text-xs text-gray-600">
            Discover amazing deals!
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">🚚</span>
              <span className="">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">⭐️</span>
              <span className="text-">Top Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">💰</span>
              <span className="text-">Best Prices</span>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-500">
            🎉 {products.length} Amazing Deals Available Now!
          </p>
        </div>

        <ProductGrid products={products} />
      </section>
    </div>
  );
};

export default SearchPage;
