import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
   const { amount } = req.body;

   if (!amount) {
      return next(new ErrorHandler("Please Enter Amount.", 400));
   }

   const paymentIntent = stripe.paymentIntents.create({
      amount: Number(amount * 100),
      currency: "inr",
   });

   return res.status(201).json({
      success: true,
      message: "Payment Intent Created Successfully.",
      clientSecret: (await paymentIntent).client_secret,
   });
});
