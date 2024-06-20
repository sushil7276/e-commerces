import express from "express";
import {
   barCharts,
   lineCharts,
   pieCharts,
   stats,
} from "../controllers/dashboard.controller.js";

const app = express.Router();

app.get("/stats", stats);
app.get("/pie-chart", pieCharts);
app.get("/bar-chart", barCharts);
app.get("/line-chart", lineCharts);

export default app;
