import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer.types";
import CartItemCard from "./CartItems";
import {
   addFromCart,
   calculatePrice,
   removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import toast from "react-hot-toast";

export default function Cart() {
   const { cartItems, discount, shippingCharges, subtotal, tax, total } =
      useSelector(
         (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
      );

   const dispatch = useDispatch();

   const incrementHandler = (cartItem: CartItem) => {
      if (cartItem.stock === cartItem.quantity) {
         toast.error("Max Quantity Limit.");
         return;
      } else {
         dispatch(
            addFromCart({ ...cartItem, quantity: cartItem.quantity + 1 })
         );
      }
   };

   const decrementHandler = (cartItem: CartItem) => {
      if (cartItem.quantity <= 1) {
         toast.error("Minimum Quantity.");
         return;
      } else {
         dispatch(
            addFromCart({ ...cartItem, quantity: cartItem.quantity - 1 })
         );
      }
   };

   const removeHandler = (id: string) => {
      dispatch(removeCartItem(id));
      toast.success("Remove Item From Cart.");
   };

   const [couponCode, setCouponCode] = useState<string>("");
   const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

   useEffect(() => {
      dispatch(calculatePrice());
   }, [dispatch, cartItems]);

   useEffect(() => {
      const timeOutId = setTimeout(() => {
         if (Math.random() > 0.5) setIsValidCouponCode(true);
         else setIsValidCouponCode(false);
      }, 1000);

      return () => {
         clearTimeout(timeOutId);
         setIsValidCouponCode(false);
      };
   }, [couponCode]);

   return (
      <div className='cart'>
         <main>
            {/* Product section */}
            {cartItems.length > 0 ? (
               cartItems.map((item) => (
                  <CartItemCard
                     cartItem={item}
                     incrementHandler={incrementHandler}
                     decrementHandler={decrementHandler}
                     removeHandler={removeHandler}
                     key={item.productId}
                  />
               ))
            ) : (
               <h1>No Items Added</h1>
            )}
         </main>

         <aside>
            <p>Subtotal: &#x20b9;{subtotal}</p>
            <p>Shipping Charges: &#x20b9;{shippingCharges}</p>
            <p>
               <span>18%</span> Tax: &#x20b9;{tax}
            </p>
            <p>
               Discount: <em className='red'> - &#x20b9;{discount}</em>
            </p>
            <p>
               <b>Total: &#x20b9;{total}</b>
            </p>
            <input
               type='text'
               value={couponCode}
               placeholder='Coupon Code...'
               onChange={(e) => setCouponCode(e.target.value)}
            />
            {couponCode &&
               (isValidCouponCode ? (
                  <span className='green'>
                     &#x20b9;{discount} off using the <code>{couponCode}</code>
                  </span>
               ) : (
                  <span className='red'>
                     Invalid Coupon <VscError />
                  </span>
               ))}
            <Link to={"/shipping"}>
               <button>Shipping</button>
            </Link>
         </aside>
      </div>
   );
}
