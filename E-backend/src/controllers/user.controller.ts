import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { invalidateCache } from "../utils/features.js";

// Create new User
export const newUser = TryCatch(
   async (req: Request<{}, {}, NewUserRequestBody>, res, next) => {
      const { name, email, photo, gender, dob, _id } = req.body;

      let user = await User.findById(_id);

      // if user Exist then direct show
      if (user) {
         return res.status(200).json({
            success: true,
            message: `Welcome, ${user.name}`,
         });
      }

      if (!name || !email || !gender || !dob || !_id) {
         return next(new ErrorHandler("Please Enter all field", 400));
      }

      user = await User.create({
         _id,
         name,
         email,
         photo,
         gender,
         dob: new Date(dob), // Convert string to Date
      });

      invalidateCache({ admin: true });

      return res.status(201).json({
         success: true,
         message: `Welcome, ${user.name}`,
      });
   }
);

// Get All User
export const getAllUser = TryCatch(async (req, res, next) => {
   const users = await User.find();

   return res.status(200).json({
      success: true,
      users,
   });
});

// Get User By ID
export const getUser = TryCatch(async (req, res, next) => {
   const id = req.params.id;

   const user = await User.findById(id);

   if (!user) {
      return next(new ErrorHandler("Invalid User", 400));
   }

   return res.status(200).json({
      success: true,
      user,
   });
});

export const deleteUser = TryCatch(async (req, res, next) => {
   const id = req.params.id;

   let user = await User.findById(id);

   if (!user) {
      return next(new ErrorHandler("Invalid User", 400));
   }

   await user.deleteOne();

   invalidateCache({ admin: true });

   res.status(200).json({
      success: true,
      message: "Deleted user Successfully",
   });
});
