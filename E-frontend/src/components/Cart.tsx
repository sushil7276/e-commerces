import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
   addFromCart,
   calculatePrice,
   discountApply,
   removeCartItem,
} from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { CartItem } from "../types/types";
import CartItemCard from "./CartItems";

export default function Cart() {
   const { cartItems, discount, shippingCharges, subtotal, tax, total } =
      useSelector((state: RootState) => state.cartReducer);

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
   }, [dispatch, cartItems, discount]);

   const couponCheck = async () => {
      axios
         .get(`${server}/v1/payment/verify-coupon?couponCode=${couponCode}`, {})
         .then((res) => {
            setIsValidCouponCode(true);
            dispatch(discountApply(res.data.amount));

            toast.success(res.data.message);
         })
         .catch((e) => {
            setIsValidCouponCode(false);
            dispatch(discountApply(0));
            toast.error(e.response.data.message);
         });
   };

   useEffect(() => {
      setIsValidCouponCode(false);
      dispatch(discountApply(0));
   }, [couponCode, dispatch]);

   /* This Code is direct effect of input field changes
   useEffect(() => {
      const { token, cancel } = axios.CancelToken.source(); // Request cancelation

      const timeOutId = setTimeout(() => {
         axios
            .get(
               `${server}/v1/payment/verify-coupon?couponCode=${couponCode}`,
               { cancelToken: token }
            )
            .then((res) => {
               setIsValidCouponCode(true);
               dispatch(discountApply(res.data.amount));

               toast.success(res.data.message);
            })
            .catch(() => {
               setIsValidCouponCode(false);
               dispatch(discountApply(0));
            });
      }, 1000);

      return () => {
         clearTimeout(timeOutId);
         cancel();
         setIsValidCouponCode(false);
      };
   }, [couponCode, dispatch]);
*/

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
            <span>Above &#x20b9;1000 Shipping Charges Free</span>
            <p>
               <span>18%</span> Tax: &#x20b9;{tax}
            </p>
            <p>
               Discount: <em className='red'> - &#x20b9;{discount}</em>
            </p>
            <p>
               <b>Total: &#x20b9;{total}</b>
            </p>
            <div>
               <input
                  type='text'
                  value={couponCode}
                  placeholder='Coupon Code...'
                  onChange={(e) => setCouponCode(e.target.value)}
               />
               <button id='coupon-code' onClick={couponCheck}>
                  Apply
               </button>
            </div>
            {couponCode &&
               (isValidCouponCode ? (
                  <span className='green'>&#x20b9;{discount} off</span>
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
