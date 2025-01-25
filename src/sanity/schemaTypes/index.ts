import { type SchemaTypeDefinition } from "sanity";
import { productCategory } from "@/sanity/schemaTypes/schemas/product-category";
import { product } from "@/sanity/schemaTypes/schemas/product";
import { promotionCode } from "@/sanity/schemaTypes/schemas/promotion-codes";
import { promotionCampaign } from "@/sanity/schemaTypes/schemas/promotion-campaign";
import { banner } from "@/sanity/schemaTypes/schemas/banner";
import {
  order,
  orderItem,
  shippingAddress,
} from "@/sanity/schemaTypes/schemas/order";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    promotionCode,
    promotionCampaign,
    banner,

    product,
    productCategory,

    shippingAddress,
    orderItem,
    order,
],
};
