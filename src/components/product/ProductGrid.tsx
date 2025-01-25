import { Product } from "@/sanity.types";
import ProductItem from "@/components/product/ProductItem";

type ProductGridProps = {
  products: Product[];
};

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product: Product) => (
        <ProductItem key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
