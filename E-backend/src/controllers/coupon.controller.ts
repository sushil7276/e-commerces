import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { getCache, invalidateCache, setCache } from "../utils/features.js";

// Create new Coupon --> Admin
export const newCoupon = TryCatch(async (req, res, next) => {
   const { couponCode, amount } = req.body;

   if (!couponCode || !amount) {
      return next(
         new ErrorHandler("Please Enter Both Field Coupon and Amount", 400)
      );
   }

   const coupon = await Coupon.create({
      couponCode,
      amount,
   });

   await invalidateCache({ coupon: true, product: false, order: false });

   return res.status(201).json({
      success: true,
      message: "Coupon Created Successfully",
      coupon,
   });
});

// Verify Coupon Code
export const verifyCouponCode = TryCatch(async (req, res, next) => {
   const { couponCode } = req.query;

   const coupon = await Coupon.findOne({ couponCode });
   if (!coupon) {
      return next(new ErrorHandler("Invalid Coupon Code", 400));
   }
   return res.status(200).json({
      success: true,
      message: "Coupon Code is Valid",
      amount: coupon.amount,
   });
});

// Get All Coupon --> Admin
export const getAllCoupons = TryCatch(async (req, res, next) => {
   let coupons;
   const key = "coupons-all";

   coupons = getCache(key);
   if (!coupons) {
      coupons = await Coupon.find();

      setCache(key, coupons);
   }

   return res.status(200).json({
      success: true,
      coupons,
   });
});

// Delete Coupon --> Admin
export const deleteCoupon = TryCatch(async (req, res, next) => {
   const { id } = req.params;
   console.log(req.params);

   const coupon = await Coupon.findByIdAndDelete(id);

   if (!coupon) {
      return next(new ErrorHandler("Invalid Coupon ID.", 400));
   }

   await invalidateCache({ coupon: true, product: false, order: false });

   return res.status(200).json({
      success: true,
      message: `Coupon "${coupon.couponCode}" deleted successfully`,
   });
});

// Update Coupon --> Admin
export const updateCoupon = TryCatch(async (req, res, next) => {
   const { id } = req.params;
   const { amount, couponCode } = req.body;

   const coupon = await Coupon.findById(id);
   if (!coupon) {
      return next(new ErrorHandler("Invalid Coupon ID.", 400));
   }

   if (amount) coupon.amount = amount;
   if (couponCode) coupon.couponCode = couponCode;

   coupon.save();
   await invalidateCache({ coupon: true, product: false, order: false });

   return res.status(200).json({
      success: true,
      message: "Coupon update successfully.",
   });
});
