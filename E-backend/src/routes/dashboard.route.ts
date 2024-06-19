import express from "express";
import { pieCharts, stats } from "../controllers/dashboard.controller.js";

const app = express.Router();

app.get("/stats", stats);
app.get("/pie-chart", pieCharts);

export default app;
