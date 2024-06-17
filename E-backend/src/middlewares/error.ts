import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware = (
   err: ErrorHandler,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   if (err.name === "CastError") {
      err.message = "Invalid ID.";
   }
   err.message ||= "Internal server Error"; // sort form  for `err.message = err.message || "";`
   err.statusCode ||= 500;

   return res.status(err.statusCode).json({
      success: false,
      message: err.message,
   });
};

// Controller Error Handle Function
export const TryCatch = (fun: ControllerType) => {
   return (req: Request, res: Response, next: NextFunction) => {
      return Promise.resolve(fun(req, res, next).catch(next));
   };
};
