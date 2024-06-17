import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
   {
      couponCode: {
         type: String,
         required: [true, "Please Enter Coupon Code."],
      },
      amount: {
         type: Number,
         require: true,
      },
   },
   {
      timestamps: true,
   }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
