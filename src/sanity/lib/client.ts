import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
import { sanityFetch } from "@/sanity/lib/live";
import { Banner, Product } from "@/sanity.types";
import { ProductCategory } from "@/sanity.types";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export const getAllProducts = async () => {
  const query = `*[_type == "product"]`;

  // Two ways to write the data fetch code — this approach follows the YouTube tutorial
  const products = await sanityFetch({ query: query });
  return products.data as Product[];
};

export const getAllCategories = async () => {
  const query = `*[_type == "productCategory"]`;
  // This approach follows a Sanity course provided by Sanity
  const { data: categories } = await sanityFetch({ query: query });
  return categories as ProductCategory[];
};

export const getCategoryBySlug = async (slug: string) => {
  const query = `*[_type == "productCategory" && slug.current == $slug][0]`;
  const category = await sanityFetch({ query: query, params: { slug } });
  return category.data as ProductCategory;
};

export const getProductsByCategorySlug = async (slug: string) => {
  const query = `*[_type == "product" && references(*[_type == "productCategory" && slug.current == $slug][0]._id)]`;
  const products = await sanityFetch({ query: query, params: { slug } });
  return products.data as Product[];
};

export const getProductById = async (id: string) => {
  const query = `*[_type == "product" && _id == $id][0]`;
  const product = await sanityFetch({ query: query, params: { id } });
  return product.data as Product;
};

export const searchProducts = async (searchQuery: string) => {
  const query = `*[_type == 'product'&&(title match "*" + $searchQuery + "*" || description match "*" + $searchQuery + "*" || category->title match "*" + $searchQuery + "*" || category->slug.current match "*" + $searchQuery + "*")]`;
  const products = await sanityFetch({ query: query, params: { searchQuery } });
  return products.data as Product[];
};

export const getBanner = async () => {
  const query = `*[_type == 'banner']`;
  const banner = await sanityFetch({ query: query });
  return banner.data as Banner[];
};
