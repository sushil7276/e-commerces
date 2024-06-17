import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { TryCatch } from "./error.js";

// Middleware for Admin Authentication
export const adminOnly = TryCatch(async (req, res, next) => {
   //    const id = req.query.id;
   const { id } = req.query;

   if (!id) {
      return next(new ErrorHandler("Please Send Admin ID", 401));
   }

   const user = await User.findById(id);

   if (!user) {
      return next(new ErrorHandler("Invalid ID", 401));
   }

   if (user.role !== "admin") {
      return next(new ErrorHandler("Only Admin Authentication", 403));
   }

   next();
});
