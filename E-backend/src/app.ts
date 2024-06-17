import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import morgan from "morgan";
import { config } from "dotenv";

config({
   path: "./.env",
});
const port = process.env.PORT || 4000;
const mongoURl = process.env.MONGO_URL || "";

// Database Call
connectDB(mongoURl);
const app = express();

// middleware for json config
app.use(express.json());

// Middleware for form-encode
app.use(express.urlencoded({ extended: true }));

// response status for development use.
app.use(morgan("dev"));

// Middleware for Node-Cache (Performance Optimization)
export const myCache = new NodeCache();

app.get("/", (req, res) => {
   res.send("This is just message");
});

// Imports Routes
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import oderRouter from "./routes/order.route.js";
import paymentRouter from "./routes/payment.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

app.use("/v1/user", userRouter);
app.use("/v1/product", productRouter);
app.use("/v1/order", oderRouter);
app.use("/v1/payment", paymentRouter);
app.use("/v1/dashboard", dashboardRouter);

// Photo Uploads Middleware
app.use("/uploads", express.static("uploads"));

// Error Handler middleware use
app.use(errorMiddleware);

app.listen(port, () => {
   console.log(`Server is working on http://localhost:${port}`);
});
