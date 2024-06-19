import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { OrderItem, invalidateCacheProp } from "../types/types.js";

// Database Connection
export const connectDB = (url: string) => {
   mongoose
      .connect(url, { dbName: "Ecommerce_24" })
      .then((c) => console.log(`DB connected to ${c.connection.host}`))
      .catch((e) => console.log(e));
};

// Revalidate Cache || Delete Cache
export const invalidateCache = async ({
   product,
   order,
   admin,
   userId,
   orderId,
   productId,
   coupon,
}: invalidateCacheProp) => {
   if (product) {
      const productKeys: string[] = [
         "all-product",
         "latest-products",
         "categories",
      ];

      if (typeof productId === "string") {
         productKeys.push(`product-${productId}`);
      }
      if (typeof productId === "object") {
         productId.forEach((i) => productKeys.push(`product-${i}`));
      }

      myCache.del(productKeys);
   }

   if (order) {
      const orderKeys: string[] = [
         "all-orders",
         `my-orders-${userId}`,
         `order-${orderId}`,
      ];

      myCache.del(orderKeys);
   }

   if (coupon) {
      myCache.del("coupons-all");
   }
};

export const setCache = (key: string, data: any) => {
   myCache.set(key, JSON.stringify(data));
};

export const getCache = (key: string) => {
   if (myCache.has(key)) {
      return JSON.parse(myCache.get(key) as string);
   }
};

// Reduce Stock
export const reduceStock = async (orderItem: OrderItem[]) => {
   for (let i = 0; i < orderItem.length; i++) {
      const order = orderItem[i];

      // Find Product
      let product = await Product.findById(order.productId);
      if (!product) throw new Error("Product Not Found");

      // reduce stock
      product.stock -= order.quantity;

      // Update Product
      product.save();
   }
};

// Percentage
export const percentage = (thisMonthCount: number, lastMonthCount: number) => {
   if (lastMonthCount === 0) {
      return thisMonthCount * 100;
   }
   return Number(
      (((thisMonthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(0)
   );
};
