import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
   AllCategories,
   AllProductResponse,
   DeleteProductRequest,
   MessageResponse,
   NewProductRequest,
   ProductResponse,
   SearchProductRequest,
   SearchProductResponse,
   UpdateProductRequest,
} from "../../types/api.types";

export const ProductAPI = createApi({
   reducerPath: "productApi",
   baseQuery: fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_SERVER}/v1/product/`,
   }),
   tagTypes: ["product"],
   endpoints: (builder) => ({
      latestProduct: builder.query<AllProductResponse, string>({
         query: () => "latest",
         providesTags: ["product"],
      }),

      categories: builder.query<AllCategories, string>({
         query: () => "categories",
         providesTags: ["product"],
      }),

      allProducts: builder.query<AllProductResponse, string>({
         query: (id) => `/admin/products?id=${id}`,
         providesTags: ["product"],
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
            providesTags: ["product"],
         }
      ),

      productDetails: builder.query<ProductResponse, string>({
         query: (id) => id,
         providesTags: ["product"],
      }),

      newProduct: builder.mutation<MessageResponse, NewProductRequest>({
         query: ({ formData, id }) => ({
            url: `new?id=${id}`,
            method: "POST",
            body: formData,
         }),
         invalidatesTags: ["product"],
      }),

      updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
         query: ({ formData, productId, userId }) => ({
            url: `${productId}/?id=${userId}`,
            method: "PUT",
            body: formData,
         }),
         invalidatesTags: ["product"],
      }),

      deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
         query: ({ productId, userId }) => ({
            url: `${productId}/?id=${userId}`,
            method: "DELETE",
         }),
         invalidatesTags: ["product"],
      }),
   }),
});

export const {
   useLatestProductQuery,
   useSearchProductQuery,
   useCategoriesQuery,
   useNewProductMutation,
   useAllProductsQuery,
   useProductDetailsQuery,
   useUpdateProductMutation,
   useDeleteProductMutation,
} = ProductAPI;
