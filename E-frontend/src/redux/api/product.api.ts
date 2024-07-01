import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
   AllCategories,
   AllProductResponse,
   SearchProductRequest,
   SearchProductResponse,
} from "../../types/api.types";

export const ProductAPI = createApi({
   reducerPath: "productApi",
   baseQuery: fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_SERVER}/v1/product/`,
   }),
   endpoints: (builder) => ({
      latestProduct: builder.query<AllProductResponse, string>({
         query: () => "latest",
      }),

      categories: builder.query<AllCategories, string>({
         query: () => "categories",
      }),

      searchProduct: builder.query<SearchProductResponse, SearchProductRequest>(
         {
            query: ({ page, category, price, search, sort }) => {
               let base = `all?page=${page}&search=${search}`;

               if (price) base += `&price=${price}`;
               if (category) base += `&category=${category}`;
               if (sort) base += `&sort=${sort}`;
               return base;
            },
         }
      ),
   }),
});

export const {
   useLatestProductQuery,
   useSearchProductQuery,
   useCategoriesQuery,
} = ProductAPI;
