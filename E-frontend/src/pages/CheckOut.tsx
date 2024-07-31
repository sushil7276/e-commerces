import {
   Elements,
   PaymentElement,
   useElements,
   useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
   CartReducerInitialState,
   userReducerInitialState,
} from "../types/reducer.types";
import { NewOrderRequest } from "../types/api.types";
import { useCreateOrderMutation } from "../redux/api/order.api";
import { responseToast } from "../utils/features";
import { resetCart } from "../redux/reducer/cartReducer";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CardNumber = "4000 0035 6000 0008";

const CheckoutForm = () => {
   const stripe = useStripe();
   const elements = useElements();
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const { user } = useSelector(
      (state: { userReducer: userReducerInitialState }) => state.userReducer
   );

   const {
      shippingInfo,
      cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
   } = useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
   );

   const [isProcessing, setIsProcessing] = useState<boolean>(false);

   const [createOrder] = useCreateOrderMutation();

   const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setIsProcessing(true);

      const order: NewOrderRequest = {
         shippingInfo,
         orderItems: cartItems,
         tax,
         discount,
         shippingCharges,
         total,
         subtotal,
         user: (user ?? {})._id!,
      };

      //     const result = await stripe.confirmCardPayment(client_secret, {
      //       payment_method: {
      //           card: elements.getElement.getElement(CardNumberElement),
      //           billing_details: {
      //               name: user.name,
      //               email: user.email,
      //               address: {
      //                   line1: shippingInfo.address,
      //                   city: shippingInfo.city,
      //                   state: shippingInfo.state,
      //                   postal_code: shippingInfo.pinCode,
      //                   country: shippingInfo.country,
      //               }
      //           }
      //       }
      //   });

      const { paymentIntent, error } = await stripe.confirmPayment({
         elements,
         confirmParams: {
            return_url: window.location.origin,
         },
         redirect: "if_required",
      });

      if (error) {
         toast.error(error.message || "Something Went Wrong in stripe");
         setIsProcessing(false);
         return;
      }
      if (paymentIntent.status === "succeeded") {
         const res = await createOrder(order);
         dispatch(resetCart());
         responseToast(res, navigate, "/orders");
      }
      setIsProcessing(false);
   };

   const copyHandle = async () => {
      await window.navigator.clipboard.writeText(CardNumber);
      toast.success("Copied Card Number");
   };

   return (
      <div className='checkout-container'>
         <form onSubmit={submitHandler}>
            <PaymentElement />
            <button
               type='submit'
               disabled={isProcessing}
               style={{ opacity: isProcessing ? "0.5" : 1 }}
            >
               {isProcessing ? "Processing" : "Pay"}
            </button>
         </form>
         <button className='copyButton' onClick={copyHandle}>
            Copy Test Card: {CardNumber}
         </button>
      </div>
   );
};

const CheckOut = () => {
   const location = useLocation();

   const clientSecret: string | undefined = location.state;

   if (!clientSecret) {
      <Navigate to={"/shipping"} />;
   }

   return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
         <CheckoutForm />
      </Elements>
   );
};

export default CheckOut;
