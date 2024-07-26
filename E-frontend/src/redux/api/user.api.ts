import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
   AllUserResponse,
   DeleteUserRequest,
   MessageResponse,
   UserResponse,
} from "../../types/api.types";
import { User } from "../../types/types";
import axios from "axios";

export const userAPI = createApi({
   reducerPath: "userApi",
   baseQuery: fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_SERVER}/v1/user/`,
   }),
   tagTypes: ["users"],
   endpoints: (builder) => ({
      login: builder.mutation<MessageResponse, User>({
         query: (user) => ({
            url: "new",
            method: "POST",
            body: user,
         }),
      }),

      allUsers: builder.query<AllUserResponse, string>({
         query: (id) => `all/?id=${id}`,
         providesTags: ["users"],
      }),

      deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
         query: ({ userId, adminId }) => ({
            url: `${userId}/?id=${adminId}`,
            method: "DELETE",
         }),
         invalidatesTags: ["users"],
      }),
   }),
});

export const getUser = async (id: string) => {
   const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/v1/user/${id}`
   );

   return data;
};

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } =
   userAPI;
