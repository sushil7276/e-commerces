import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.model.js";
import { getCache, percentage } from "../utils/features.js";

export const stats = TryCatch(async (req, res, next) => {
   let stats;
   const key = "admin-stats";

   stats = getCache(key);
   if (!stats) {
      const today = new Date();

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

      const [
         lastMonthUsers,
         thisMonthUsers,
         lastMonthProducts,
         thisMonthProducts,
         lastMonthOrders,
         thisMonthOrders,
      ] = await Promise.all([
         lastMonthUserPromise,
         thisMonthUsersPromise,
         lastMonthProductsPromise,
         thisMonthProductsPromise,
         lastMonthOrdersPromise,
         thisMonthOrdersPromise,
      ]);
   }
});

const stt = async () => {
   const today = new Date();

   const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
   const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
   );
   const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

   console.log(lastMonthStart + " " + lastMonthEnd);
   ///
};

stt();
