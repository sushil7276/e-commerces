import { Document } from "mongoose";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { getCache, percentage, setCache } from "../utils/features.js";

export const keySet = [
   "admin-stats",
   "admin-pie-charts",
   "admin-bar-charts",
   "admin-line-charts",
];

// All Stats
export const stats = TryCatch(async (req, res, next) => {
   let stats;
   const key = keySet[0];

   stats = getCache(key);
   if (!stats) {
      const today = new Date();
      const sixMonthAgo = new Date(
         today.getFullYear(),
         today.getMonth() - 5,
         1
      );

      const thisMonth = {
         start: new Date(today.getFullYear(), today.getMonth(), 1),
         end: today,
      };

      const lastMonth = {
         start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
         end: new Date(today.getFullYear(), today.getMonth(), 0),
      };

      // Save Last Month Users
      const lastMonthUserPromise = User.find({
         createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      });
      // Save This Moth Users
      const thisMonthUsersPromise = User.find({
         createdAt: { $gte: thisMonth.start },
      });

      // Save last Month Product Count
      const lastMonthProductsPromise = Product.find({
         createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      });
      // Save This month Product Count
      const thisMonthProductsPromise = Product.find({
         createdAt: { $gte: thisMonth.start },
      });

      // Save Last Month transaction
      const lastMonthOrdersPromise = Order.find({
         createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      });
      const thisMonthOrdersPromise = Order.find({
         createdAt: { $gte: thisMonth.start },
      });

      const lastSixMonthOrdersPromise = Order.find({
         createdAt: { $gte: sixMonthAgo },
      });

      const latestTransactionPromise = Order.find()
         .select(["discount", "total", "status", "orderItem"])
         .limit(4);

      const [
         lastMonthUsers,
         thisMonthUsers,
         lastMonthProducts,
         thisMonthProducts,
         lastMonthOrders,
         thisMonthOrders,
         userCount,
         productCount,
         allOrder,
         lastSixMonthOrders,
         categories,
         femaleCount,
         latestTransaction,
      ] = await Promise.all([
         lastMonthUserPromise,
         thisMonthUsersPromise,
         lastMonthProductsPromise,
         thisMonthProductsPromise,
         lastMonthOrdersPromise,
         thisMonthOrdersPromise,
         User.countDocuments(),
         Product.countDocuments(),
         Order.find().select("total"),
         lastSixMonthOrdersPromise,
         Product.distinct("category"),
         User.countDocuments({ gender: "female" }),
         latestTransactionPromise,
      ]);

      const thisMothRevenue = thisMonthOrders.reduce(
         (total, order) => total + (order.total || 0),
         0
      );
      const lastMonthRevenue = lastMonthOrders.reduce(
         (total, order) => total + (order.total || 0),
         0
      );

      const percent = {
         revenue: percentage(thisMothRevenue, lastMonthRevenue),
         user: percentage(thisMonthUsers.length, lastMonthUsers.length),
         product: percentage(
            thisMonthProducts.length,
            lastMonthProducts.length
         ),
         order: percentage(thisMonthOrders.length, lastMonthOrders.length),
      };

      const revenue = allOrder.reduce(
         (total, order) => total + (order.total || 0),
         0
      );

      const count = {
         user: userCount,
         product: productCount,
         order: allOrder.length,
         userRatio: {
            male: userCount - femaleCount,
            female: femaleCount,
         },
      };

      //modify Latest Transaction
      const modifyLatestTransaction = latestTransaction.map((i) => ({
         id: i._id,
         discount: i.discount,
         amount: i.total,
         quantity: i.orderItems.length,
         stats: i.status,
      }));

      // Create Array for past 6 month value store
      let orderMonthCount = new Array(6).fill(0);
      let orderMonthRevenue = new Array(6).fill(0);

      lastSixMonthOrders.forEach((order) => {
         const createDate = order.createdAt;
         const monthDifference =
            (today.getMonth() - createDate.getMonth() + 12) % 12;

         if (monthDifference < 6) {
            orderMonthCount[5 - monthDifference] += 1;
            orderMonthRevenue[5 - monthDifference] += order.total;
         }
      });

      // Calculate Category wise Product Count
      const categoriesObj = await categoryWiseProductCountRatio({
         categories,
         productCount,
      });

      stats = {
         revenue,
         percent,
         count,
         chart: {
            order: orderMonthCount,
            revenue: orderMonthRevenue,
         },
         categoriesObj,
         latestTransaction: modifyLatestTransaction,
      };

      // Cache set
      setCache(key, stats);
   }

   return res.status(200).json({
      success: true,
      stats,
   });
});

// Pie - Charts
export const pieCharts = TryCatch(async (req, res, next) => {
   let charts;
   const key = keySet[1];
   charts = getCache(key);

   if (!charts) {
      const allOrderPromise = Order.find().select([
         "total",
         "discount",
         "shippingCharges",
         "tax",
         "subtotal",
      ]);

      const [
         orders,
         categories,
         productCount,
         productOutOfStock,
         allOrder,
         allUsers,
         allRoleAdmin,
         allRoleUsers,
      ] = await Promise.all([
         Order.find(),
         Product.distinct("category"),
         Product.countDocuments(),
         Product.countDocuments({ stock: 0 }),
         allOrderPromise,
         User.find().select("dob"),
         User.find({ role: "admin" }),
         User.find({ role: "user" }),
      ]);

      /* orderFulfillment Start */
      let totalShipped = 0;
      let totalDelivered = 0;
      let totalProcessing = 0;

      orders.forEach((order) => {
         if (order.status === "Delivered") {
            totalDelivered++;
         } else if (order.status === "Shipped") {
            totalShipped++;
         } else {
            totalProcessing++;
         }
      });

      const orderFulfillment = {
         shipped: totalShipped,
         delivered: totalDelivered,
         processing: totalProcessing,
      };
      /* orderFulfillment  End */

      const categoryCount = await categoryWiseProductCountRatio({
         categories,
         productCount,
      });

      /* 
       @ Calculating amount Totals of orders start 

      */
      let grossTotal = allOrder.reduce(
         (prev, order) => prev + (order.subtotal || 0),
         0
      );
      let totalAmount = allOrder.reduce(
         (prev, order) => prev + (order.total || 0),
         0
      );
      let totalTax = allOrder.reduce(
         (prev, order) => prev + (order.tax || 0),
         0
      );
      let totalDiscount = allOrder.reduce(
         (prev, order) => prev + (order.discount || 0),
         0
      );
      let totalShippingCharges = allOrder.reduce(
         (prev, order) => prev + (order.shippingCharges || 0),
         0
      );

      // for (let i = 0; i < orders.length; i++) {
      //    grossTotal += orders[i].subtotal;
      //    totalAmount += orders[i].total;
      //    totalTax += orders[i].tax;
      //    totalDiscount += orders[i].discount;
      //    totalShippingCharges += orders[i].shippingCharges;
      // }

      const amount = {
         grossTotal,
         totalTax,
         totalShippingCharges,
         totalDiscount,
         totalAmount,
      };

      /* 
       @ Calculating amount Totals of orders End 
       
      */

      const userAgeGroup = {
         teen: allUsers.filter((i) => i.age < 20).length,
         adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
         old: allUsers.filter((i) => i.age >= 40).length,
      };
      const adminCustomer = {
         admin: allRoleAdmin.length,
         customer: allRoleUsers.length,
      };

      charts = {
         amount,
         orderFulfillment,
         productStock: {
            outOfStock: productOutOfStock,
            inStock: productCount - productOutOfStock,
         },
         userAgeGroup,
         adminCustomer,
         categoryCount,
      };

      // Cache set
      setCache(key, charts);
   }

   res.status(200).json({
      success: true,
      charts,
   });
});

// Bar - Charts
export const barCharts = TryCatch(async (req, res, next) => {
   let charts;
   const key = keySet[2];

   charts = getCache(key);

   if (!charts) {
      const today = new Date();

      const sixMonthAgo = new Date(
         today.getFullYear(),
         today.getMonth() - 5,
         1
      );

      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);

      const lastSixMonthUserPromise = User.find({
         createdAt: { $gte: sixMonthAgo },
      }).select("createdAt");

      const lastSixMonthProductPromise = Product.find({
         createdAt: { $gte: sixMonthAgo },
      }).select("createdAt");

      const twelveMonthOrderPromise = Order.find({
         createdAt: { $gte: oneYearAgo },
      }).select("createdAt");

      const [sixMonthUser, sixMonthProduct, twelveMonthOrder] =
         await Promise.all([
            lastSixMonthUserPromise,
            lastSixMonthProductPromise,
            twelveMonthOrderPromise,
         ]);

      const productCount = pastMonthCounting({
         length: 6,
         docArr: sixMonthProduct,
         today,
      });

      const userCount = pastMonthCounting({
         length: 6,
         docArr: sixMonthUser,
         today,
      });

      const orderCount = pastMonthCounting({
         length: 12,
         docArr: twelveMonthOrder,
         today,
      });

      charts = {
         users: userCount,
         products: productCount,
         orders: orderCount,
      };

      // Cache set
      setCache(key, charts);
   }

   return res.status(200).json({
      success: true,
      charts,
   });
});

// Line - Charts
export const lineCharts = TryCatch(async (req, res, next) => {
   let charts;
   const key = keySet[3];

   charts = getCache(key);

   if (!charts) {
      const today = new Date();
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);

      const baseQuery = {
         createdAt: { $gte: oneYearAgo },
      };

      const [lastYearUser, lastYearProduct, lastYearOrder] = await Promise.all([
         User.find(baseQuery).select("createdAt"),
         Product.find(baseQuery).select("createdAt"),
         Order.find(baseQuery).select(["createdAt", "discount", "total"]),
      ]);

      const userCount = pastMonthCounting({
         length: 12,
         docArr: lastYearUser,
         today,
      });

      const productCount = pastMonthCounting({
         length: 12,
         docArr: lastYearProduct,
         today,
      });

      const discount = pastMonthCounting({
         length: 12,
         docArr: lastYearOrder,
         today,
         property: "discount",
      });

      const revenue = pastMonthCounting({
         length: 12,
         docArr: lastYearOrder,
         today,
         property: "total",
      });

      charts = {
         user: userCount,
         product: productCount,
         discount,
         revenue,
      };

      // Cache set
      setCache(key, charts);
   }

   return res.status(200).json({
      success: true,
      charts,
   });
});

/*
Category wise product Count and return array
Array of [{category:productCount}]
*/
const categoryWiseProductCountRatio = async ({
   categories,
   productCount,
}: {
   categories: string[];
   productCount: number;
}) => {
   // Categories
   const categoriesPromise = categories.map((category) =>
      Product.countDocuments({ category })
   );

   const categoryCount = await Promise.all(categoriesPromise);

   let categoryWiseProductCount: Record<string, number>[] = [];

   categories.forEach((category, index) =>
      categoryWiseProductCount.push({
         [category]: Math.round((categoryCount[index] / productCount) * 100),
      })
   );

   return categoryWiseProductCount;
};

interface MyDocument extends Document {
   createdAt: Date;
   discount?: number;
   total?: number;
}

type PastMonthArrayType = {
   length: number;
   docArr: MyDocument[];
   today: Date;
   property?: "discount" | "total";
};

// Create Array for past month wise value store
const pastMonthCounting = ({
   length,
   docArr,
   today,
   property,
}: PastMonthArrayType) => {
   let data: number[] = new Array(length).fill(0);

   docArr.forEach((i) => {
      const createDate = i.createdAt;
      const monthDiff = (today.getMonth() - createDate.getMonth() + 12) % 12;

      // if (monthDiff < length) {
      //    data[length - monthDiff - 1] += property ? i[property]! : 1;
      // }

      if (monthDiff < length) {
         if (property) {
            data[length - monthDiff - 1] += i[property]!;
         } else {
            data[length - monthDiff - 1] += 1;
         }
      }
   });
   return data;
};
