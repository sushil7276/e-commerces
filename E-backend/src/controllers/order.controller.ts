import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequest } from "../types/types.js";
import { Order } from "../models/order.model.js";
import {
   getCache,
   invalidateCache,
   reduceStock,
   setCache,
} from "../utils/features.js";
import ErrorHandler from "../utils/ErrorHandler.js";
// import { faker } from "@faker-js/faker";

export const newOrder = TryCatch(
   async (req: Request<{}, {}, NewOrderRequest>, res, next) => {
      const {
         shippingInfo,
         orderItem,
         user,
         subtotal,
         discount,
         tax,
         total,
         shippingCharges,
      } = req.body;

      if (!shippingInfo || !orderItem || !user || !subtotal || !tax || !total)
         return next(new ErrorHandler("Please Enter All Field ", 400));
      await Order.create({
         shippingInfo,
         orderItem,
         user,
         subtotal,
         discount,
         tax,
         shippingCharges,
         total,
      });

      await reduceStock(orderItem);

      await invalidateCache({
         product: true,
         order: true,
         admin: true,
         userId: user,
         productId: orderItem.map((i) => String(i.productId)),
      });

      return res.status(200).json({
         success: true,
         message: "Order created successfully",
      });
   }
);

// Update Order Status
export const updateOrderStatus = TryCatch(async (req, res, next) => {
   const id = req.params.id;

   const order = await Order.findById(id);
   if (!order) return next(new ErrorHandler("Order Not Found", 400));

   switch (order.status) {
      case "Processing":
         order.status = "Shipped";
         break;
      case "Shipped":
         order.status = "Delivered";
         break;
      default:
         order.status = "Delivered";
         break;
   }

   order.save();

   await invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
   });

   return res.status(200).json({
      success: true,
      message: "Order Status Updated Successfully!!!",
   });
});

// Delete Order --> Admin
export const deleteOrder = TryCatch(async (req, res, next) => {
   const id = req.params.id;
   const order = await Order.findById(id);

   if (!order) return next(new ErrorHandler("Order not found", 404));

   await order.deleteOne();

   await invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
   });

   return res.status(200).json({
      success: true,
      message: "Order Deleted Successfully!!!",
   });
});

// Get All Order --> Admin
export const getAllOrders = TryCatch(async (req, res, next) => {
   let orders = [];

   const key = "all-orders";

   orders = getCache(key);
   if (!orders) {
      orders = await Order.find();
      setCache(key, orders);
   }

   const totalOrders = orders.length;

   return res.status(200).json({
      success: true,
      totalOrders,
      orders,
   });
});

// Get Order Details
export const getOrderDetails = TryCatch(async (req, res, next) => {
   const id = req.params.id;
   const key = `order-${id}`;

   let order;
   order = getCache(key);
   if (!order) {
      order = await Order.findById(id);
      if (!order) return next(new ErrorHandler("Order Not Found", 400));
      setCache(key, order);
   }

   return res.status(200).json({
      success: true,
      order,
   });
});

// My Order
export const myOrders = TryCatch(async (req, res, next) => {
   const { id } = req.query;

   const key = `my-orders-${id}`;

   let orders = [];

   orders = getCache(key);
   if (!orders) {
      orders = await Order.find({ user: id }).populate("user", "name");
      setCache(key, orders);
   }

   return res.status(200).json({
      success: true,
      orders,
   });
});

/* 

* @desc   Create Fake Orders 


const fakeOrders = async (count: number) => {
   let orders = [];

   for (let i = 0; i <= count; i++) {
      const order = new Order({
         shippingInfo: {
            address: faker.location.street(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
            pinCode: 416115,
         },
         user: "asdasd",

         subtotal: faker.commerce.price({ min: 100, max: 100000 }),
         tax: faker.commerce.price({ min: 100, max: 300 }),
         shippingCharges: faker.commerce.price({ min: 100, max: 100 }),
         discount: faker.commerce.price({ min: 100, max: 1000 }),
         total: faker.commerce.price({ min: 100, max: 100000 }),

         orderItem: [
            {
               name: faker.commerce.productName(),
               photo: "uploadse757b079-3139-4ace-b6a0-3f98f7a58416.jpg",
               price: faker.commerce.price({ min: 100, max: 80000 }),
               quantity: faker.commerce.price({ min: 100, max: 100 }),
               productId: "66672bafff162c3332ebae69",
            },
         ],
      });
      orders.push(order);
   }

   await Order.create(orders);
   console.log({ success: true });
};

 */
