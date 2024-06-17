import express from "express";
import {
   allProduct,
   createProduct,
   deleteProduct,
   getAllProduct,
   getCategories,
   getLatestProduct,
   getProductDetails,
   updateProduct,
} from "../controllers/product.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import { get } from "http";
import { adminOnly } from "../middlewares/adminOnly.js";

const app = express.Router();

app.post("/new", adminOnly, singleUpload, createProduct);

// Latest Product
app.get("/latest", getLatestProduct);

// Unique Categories
app.get("/categories", getCategories);

// Get All Filter Product With Pagination
app.get("/all", getAllProduct);

app.get("/admin/products", adminOnly, allProduct);
// Product Details || Product Update || Product Delete
app.route("/:id")
   .get(getProductDetails)
   .delete(adminOnly, deleteProduct)
   .put(adminOnly, singleUpload, updateProduct);

export default app;
