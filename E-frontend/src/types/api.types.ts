import { Product, User } from "./types";

export type CustomError = {
   status: number;
   data: {
      message: string;
      success: boolean;
   };
};

export type MessageResponse = {
   success: boolean;
   message: string;
};

export type UserResponse = {
   success: boolean;
   user: User;
};

export type AllProductResponse = {
   success: boolean;
   products: Product[];
};

export type AllCategories = {
   success: true;
   categories: string[];
};

// search product is equal to All Product response and additional one more field total page
export type SearchProductResponse = AllProductResponse & {
   totalPage: number;
};

export type SearchProductRequest = {
   price: number;
   page: number;
   category: string;
   sort: string;
   search: string;
};
