import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
   AllOrderResponse,
   MessageResponse,
   NewOrderRequest,
   OrderDetailsResponse,
   UpdateDeleteOrderRequest,
} from "../../types/api.types";

export const orderApi = createApi({
   reducerPath: "orderApi",
   baseQuery: fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_SERVER}/v1/order/`,
   }),
   tagTypes: ["orders"],

   endpoints: (builder) => ({
      createOrder: builder.mutation<MessageResponse, NewOrderRequest>({
         query: (order) => ({
            url: "new",
            method: "POST",
            body: order,
         }),
         invalidatesTags: ["orders"],
      }),

      updateOrder: builder.mutation<MessageResponse, UpdateDeleteOrderRequest>({
         query: ({ userId, orderId }) => ({
            url: `${orderId}/?id=${userId}`,
            method: "PUT",
         }),
         invalidatesTags: ["orders"],
      }),

      deleteOrder: builder.mutation<MessageResponse, UpdateDeleteOrderRequest>({
         query: ({ userId, orderId }) => ({
            url: `${orderId}/?id=${userId}`,
            method: "DELETE",
         }),
         invalidatesTags: ["orders"],
      }),

      myOrders: builder.query<AllOrderResponse, string>({
         query: (id) => `my/?id=${id}`,
         providesTags: ["orders"],
      }),

      allOrders: builder.query<AllOrderResponse, string>({
         query: (id) => `admin/all?id=${id}`,
         providesTags: ["orders"],
      }),

      detailsOrder: builder.query<OrderDetailsResponse, string>({
         query: (id) => id,
         providesTags: ["orders"],
      }),
   }),
});

export const {
   useCreateOrderMutation,
   useAllOrdersQuery,
   useMyOrdersQuery,
   useDeleteOrderMutation,
   useDetailsOrderQuery,
   useUpdateOrderMutation,
} = orderApi;
