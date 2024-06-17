import express from "express";
import {
   deleteCoupon,
   getAllCoupons,
   newCoupon,
   updateCoupon,
   verifyCouponCode,
} from "../controllers/coupon.controller.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const app = express.Router();

app.post("/coupon/new", adminOnly, newCoupon);
app.get("/verify-coupon", verifyCouponCode);
app.get("/coupon/all", adminOnly, getAllCoupons);
app.route("/coupon/:id")
   .delete(adminOnly, deleteCoupon)
   .put(adminOnly, updateCoupon);

export default app;
