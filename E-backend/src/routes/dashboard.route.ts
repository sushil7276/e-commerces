import express from "express";
import {
   barCharts,
   lineCharts,
   pieCharts,
   stats,
} from "../controllers/dashboard.controller.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const app = express.Router();

app.get("/stats", adminOnly, stats);
app.get("/pie-chart", adminOnly, pieCharts);
app.get("/bar-chart", adminOnly, barCharts);
app.get("/line-chart", adminOnly, lineCharts);

export default app;
