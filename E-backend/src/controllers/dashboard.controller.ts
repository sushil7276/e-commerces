import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.model.js";
import { getCache, percentage, setCache } from "../utils/features.js";

export const stats = TryCatch(async (req, res, next) => {
   let stats;
   const key = "admin-stats";

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
         quantity: i.orderItem.length,
         stats: i.status,
      }));

      // Create Array for past 6 month value store
      let orderMonthCount = new Array(6).fill(0);
      let orderMonthRevenue = new Array(6).fill(0);

      lastSixMonthOrders.forEach((order) => {
         const createDate = order.createdAt;
         const monthDifference = today.getMonth() - createDate.getMonth();

         if (monthDifference < 6) {
            orderMonthCount[5 - monthDifference] += 1;
            orderMonthRevenue[5 - monthDifference] += order.total;
         }
      });

      // Categories
      const categoriesPromise = categories.map((category) =>
         Product.countDocuments({ category })
      );

      const categoryCount = await Promise.all(categoriesPromise);

      let categoriesObj: Record<string, number>[] = [];
      // categories.forEach((category, index) =>
      //    categoriesObj.push({
      //       [category]: Math.round((categoryCount[index] / productCount) * 100),
      //    })
      // );

      for (let i = 0; i < categories.length; i++) {
         categoriesObj.push({
            [categories[i]]: Math.round(
               (categoryCount[i] / productCount) * 100
            ),
         });
      }

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

      setCache(key, stats);
   }

   return res.status(200).json({
      success: true,
      stats,
   });
});

const stt = async () => {};
