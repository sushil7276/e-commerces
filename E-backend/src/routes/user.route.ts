import express from "express";
import {
   deleteUser,
   getAllUser,
   getUser,
   newUser,
} from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const app = express.Router();

// Base Route = "http://localhost:4000/v1/user"

// Create new User
app.post("/new", singleUpload, newUser);

// Get all Users ---> Admin
app.get("/all", adminOnly, getAllUser);

// Get user by id
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);

export default app;
