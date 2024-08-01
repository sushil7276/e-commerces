import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/user.api";
import { userReducer } from "./reducer/userReducer";
import { ProductAPI } from "./api/product.api";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/order.api";
import { dashboardApi } from "./api/dashboard.api";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
   reducer: {
      [userAPI.reducerPath]: userAPI.reducer,
      [userReducer.name]: userReducer.reducer,
      [ProductAPI.reducerPath]: ProductAPI.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
      [cartReducer.name]: cartReducer.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
   },

   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
         userAPI.middleware,
         ProductAPI.middleware,
         orderApi.middleware,
         dashboardApi.middleware,
      ]),
});

export type RootState = ReturnType<typeof store.getState>;
