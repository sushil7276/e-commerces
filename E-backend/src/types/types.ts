import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
   _id: string;
   name: string;
   email: string;
   photo: string;
   gender: "male" | "female";
   dob: Date;
}

export interface NewProductRequest {
   name: string;
   price: number;
   stock: number;
   category: string;
}

// Error Handle Controller Type
export type ControllerType = {
   (req: Request, res: Response, next: NextFunction): Promise<void | Response<
      any,
      Record<string, any>
   >>;
};

// Product Search Request Type
export type SearchRequestQuery = {
   search?: string;
   price?: string;
   category?: string;
   sort?: string;
   page?: string;
};

// Product Search Query Type
export interface BaseQuery {
   name?: {
      $regex: string;
      $options: string;
   };
   price?: { $lte: number };
   category?: string;
}

// Cache Type
export type invalidateCacheProp = {
   product?: boolean;
   order?: boolean;
   admin?: boolean;
   coupon?: boolean;
   userId?: string;
   orderId?: string;
   productId?: string | string[];
};

export type OrderItem = {
   name: string;
   price: number;
   quantity: number;
   photo: string;
   productId: string;
};

export type ShippingInfo = {
   address: string;
   city: string;
   state: string;
   country: string;
   pinCode: number;
};

export interface NewOrderRequest {
   shippingInfo: ShippingInfo;
   user: string;
   subtotal: number;
   tax: number;
   discount: number;
   shippingCharges: number;
   total: number;
   orderItems: OrderItem[];
}
