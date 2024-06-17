import express from "express";
import {
   deleteOrder,
   getAllOrders,
   getOrderDetails,
   myOrders,
   newOrder,
   updateOrderStatus,
} from "../controllers/order.controller.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const app = express.Router();

app.post("/new", newOrder);

app.get("/my", myOrders);

// Admin route
app.get("/all", adminOnly, getAllOrders);

app.route("/:id")
   .get(getOrderDetails)
   .delete(adminOnly, deleteOrder)
   .put(adminOnly, updateOrderStatus);

export default app;
