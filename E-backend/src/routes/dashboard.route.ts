import express from "express";
import {
   barCharts,
   pieCharts,
   stats,
} from "../controllers/dashboard.controller.js";

const app = express.Router();

app.get("/stats", stats);
app.get("/pie-chart", pieCharts);
app.get("/bar-chart", barCharts);

export default app;
