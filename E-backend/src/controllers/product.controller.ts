import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
   BaseQuery,
   NewProductRequest,
   SearchRequestQuery,
} from "../types/types.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { getCache, invalidateCache, setCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";

// Create new Product ---> Admin
export const createProduct = TryCatch(
   async (req: Request<{}, {}, NewProductRequest>, res, next) => {
      const { name, price, stock, category } = req.body;
      const photo = req.file;

      if (!photo) return next(new ErrorHandler("Please add Photo", 400));

      if (!name || !price || !stock || !category) {
         rm(photo.path, () => {
            console.log("Deleted");
         });

         return next(new ErrorHandler("Please enter All Fields", 400));
      }

      await Product.create({
         name,
         price,
         stock,
         category: category.toLowerCase(),
         photo: photo?.path,
      });

      // Delete Cache Product
      await invalidateCache({ product: true });

      return res.status(201).json({
         success: true,
         message: "Product Created Successfully",
      });
   }
);

// Update Product Details
export const updateProduct = TryCatch(async (req, res, next) => {
   const id = req.params.id;
   const { name, price, stock, category } = req.body;
   console.log(req.body);
   const photo = req.file;

   console.log(photo?.path);
   let product = await Product.findById(id);

   if (!product) return next(new ErrorHandler("Invalid Product ID", 400));

   if (photo) {
      rm(product.photo!, () => {
         console.log("Old photo deleted");
      });

      product.photo = photo.path;
   }

   if (name) product.name = name;
   if (price) product.price = price;
   if (stock) product.stock = stock;
   if (category) product.category = category;

   await product.save();

   // Delete Cache Product
   await invalidateCache({ product: true, productId: String(product._id) });

   return res.status(200).json({
      success: true,
      message: "Product Update Successfully",
      product,
   });
});

// Delete Product
export const deleteProduct = TryCatch(async (req, res, next) => {
   const id = req.params.id;

   let product = await Product.findById(id);

   if (!product) {
      return next(new ErrorHandler("Invalid Product ID", 400));
   }

   // Remove Product Pic
   rm(product.photo, () => {
      console.log("Product Pic Delete");
   });

   await product.deleteOne();

   // Delete Cache Product
   await invalidateCache({ product: true, productId: String(product._id) });

   return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
   });
});

// Get All Product --> Admin
export const allProduct = TryCatch(async (req, res, next) => {
   let products;

   const key = "all-product";
   products = getCache(key);

   if (!products) {
      products = await Product.find();
      setCache(key, products);
   }

   const totalProducts = products.length;

   return res.status(200).json({
      success: true,
      totalProducts,
      products,
   });
});

// Latest Product
export const getLatestProduct = TryCatch(async (req, res, next) => {
   let products;

   const key = "latest-products";

   products = getCache(key);

   if (!products) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
      setCache(key, products);
   }

   return res.status(200).json({
      success: true,
      products,
   });
});

// Product Categories
export const getCategories = TryCatch(async (req, res, next) => {
   let categories;
   const key = "categories";

   categories = getCache(key);
   if (!categories) {
      categories = await Product.distinct("category"); // "distinct" means unique value return
      setCache(key, categories);
   }

   return res.status(200).json({
      success: true,
      categories,
   });
});

// get single Product
export const getProductDetails = TryCatch(async (req, res, next) => {
   const id = req.params.id;
   let product;

   const key = `product-${id}`;

   product = getCache(key);
   if (!product) {
      product = await Product.findById(id);
      if (!product) {
         return next(new ErrorHandler("Product not found", 404));
      }
      setCache(key, product);
   }

   return res.status(200).json({
      success: true,
      product,
   });
});

// Get All Product in Filter
export const getAllProduct = TryCatch(
   async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
      const { search, price, category, sort } = req.query;

      const page = Number(req.query.page) || 1;
      const limit = Number(process.env.PAGE_LIMIT) || 8;
      const skip = (page - 1) * limit;

      const baseQuery: BaseQuery = {};
      if (search) baseQuery.name = { $regex: search, $options: "i" }; // "$options:'i' " means case Sensitive
      if (price) baseQuery.price = { $lte: Number(price) }; // less than or equal to
      if (category) baseQuery.category = category; // Exact Match

      const productsPromise = await Product.find(baseQuery)
         .sort(sort && { price: sort === "asc" ? 1 : -1 }) // sort by price in ascending or descending order
         .limit(limit)
         .skip(skip);

      const [products, filteredTotalProducts] = await Promise.all([
         productsPromise,
         Product.find(baseQuery), // const filteredTotalProducts = await Product.find(baseQuery);
      ]);

      const totalPage = Math.ceil(filteredTotalProducts.length / limit);

      return res.status(200).json({
         success: true,
         products,
         totalPage,
      });
   }
);

/*
// Dummy Data Created

const addProducts = async (count: number) => {
   let products = [];

   for (let i = 0; i <= count; i++) {
      const product = new Product({
         name: faker.commerce.productName(),
         price: faker.commerce.price({ min: 100, max: 80000, dec: 0 }),
         stock: faker.commerce.price({ min: 1, max: 100 }),
         category: faker.commerce.department(),
         photo: "uploadse757b079-3139-4ace-b6a0-3f98f7a58416.jpg",
         createdAt: new Date(faker.date.past()),
         updatedAt: new Date(faker.date.recent()),
      });

      products.push(product);
   }

   await Product.create(products);

   console.log({ success: true });
};

// Deleted Dummy Data
const deleteProducts = async (count: number) => {
   const products = await Product.find().skip(3);

   for (let i = 0; i <= count; i++) {
      const product = products[i];
      await product.deleteOne();
   }

   console.log({ success: true });
}; 
*/
