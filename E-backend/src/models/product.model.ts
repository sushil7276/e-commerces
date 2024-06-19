import mongoose from "mongoose";
import { trim } from "validator";

const productSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Please Enter Product Name"],
      },

      photo: {
         type: String,
         required: [true, "Please Enter Product Image"],
      },
      price: {
         type: Number,
         required: [true, "please Enter Price"],
      },
      stock: {
         type: Number,
         required: [true, "Please Enter Stock"],
      },
      category: {
         type: String,
         required: [true, "Please Enter Category"],
         trim: true, // White space Remove
      },
   },
   { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
