import express from "express";
import {
   deleteCoupon,
   getAllCoupons,
   newCoupon,
   updateCoupon,
   verifyCouponCode,
} from "../controllers/coupon.controller.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import { createPaymentIntent } from "../controllers/payment.controller.js";

const app = express.Router();

// Payment related Route
app.post("/create", createPaymentIntent),
   // coupon related Route
   app.post("/coupon/new", adminOnly, newCoupon);
app.get("/verify-coupon", verifyCouponCode);
app.get("/coupon/all", adminOnly, getAllCoupons);
app.route("/coupon/:id")
   .delete(adminOnly, deleteCoupon)
   .put(adminOnly, updateCoupon);

export default app;
