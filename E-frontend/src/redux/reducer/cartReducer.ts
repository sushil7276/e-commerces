import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer.types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
   loading: false,
   cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems")!)
      : [],
   subtotal: 0,
   discount: 0,
   tax: 0,
   shippingCharges: 0,
   total: 0,
   shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo")!)
      : { address: "", city: "", state: "", country: "", pinCode: "" },
};

export const cartReducer = createSlice({
   name: "cartReducer",
   initialState,
   reducers: {
      addFromCart: (state, action: PayloadAction<CartItem>) => {
         state.loading = true;

         const index = state.cartItems.findIndex(
            (i) => i.productId === action.payload.productId
         );

         if (index !== -1) state.cartItems[index] = action.payload;
         else state.cartItems.push(action.payload);

         state.loading = false;

         localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      },

      removeCartItem: (state, action: PayloadAction<string>) => {
         state.loading = true;
         state.cartItems = state.cartItems.filter(
            (i) => i.productId !== action.payload
         );
         state.loading = false;

         localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      },

      calculatePrice: (state) => {
         const subTotal = state.cartItems.reduce(
            (total, i) => total + i.price * i.quantity,
            0
         );

         // for (let i = 0; i < state.cartItems.length; i++) {
         //    const item = state.cartItems[i];
         //    subTotal += item.price * item.quantity;
         // }

         state.subtotal = subTotal;
         state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
         state.tax = Math.round(state.subtotal * 0.18);
         state.total =
            state.subtotal + state.tax + state.shippingCharges - state.discount;
      },

      discountApply: (state, action: PayloadAction<number>) => {
         state.discount = action.payload;
      },

      saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
         state.shippingInfo = action.payload;

         localStorage.setItem(
            "shippingInfo",
            JSON.stringify(state.shippingInfo)
         );
      },

      resetCart: () => {
         localStorage.removeItem("cartItems");
         initialState;
      },
   },
});

export const {
   addFromCart,
   removeCartItem,
   calculatePrice,
   discountApply,
   saveShippingInfo,
   resetCart,
} = cartReducer.actions;
