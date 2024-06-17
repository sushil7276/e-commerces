import express from "express";
import { stats } from "../controllers/dashboard.controller.js";

const app = express.Router();

app.get("/stats", stats);

export default app;
