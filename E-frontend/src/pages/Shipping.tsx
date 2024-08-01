import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";

export default function Shipping() {
   const { cartItems, total } = useSelector(
      (state: RootState) => state.cartReducer
   );

   const [shippingInfo, setShippingInfo] = useState({
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
   });

   const navigate = useNavigate();
   const dispatch = useDispatch();

   const changeHandler = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
   };

   useEffect(() => {
      if (cartItems.length <= 0) {
         return navigate("/cart");
      }

      if (localStorage.getItem("shippingInfo")) {
         setShippingInfo(JSON.parse(localStorage.getItem("shippingInfo")!));
      }
   }, [cartItems, navigate]);

   const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      dispatch(saveShippingInfo(shippingInfo));
      try {
         const { data } = await axios.post(
            `${server}/v1/payment/create`,
            {
               amount: total,
            },
            {
               headers: { "Content-Type": "application/json" },
            }
         );
         toast.success(data.message);
         navigate("/pay", { state: data.clientSecret });
      } catch (error) {
         console.log(error);
         toast.error("Something Went Wrong For Payment Create.");
      }
   };

   return (
      <div className='shipping'>
         <button onClick={() => navigate("/cart")}>
            <BiArrowBack />
         </button>
         <form onSubmit={submitHandler}>
            <h1>Shipping Address</h1>
            <input
               required
               type='text'
               placeholder='Address'
               name='address'
               value={shippingInfo.address}
               onChange={changeHandler}
            />
            <input
               required
               type='text'
               placeholder='City'
               name='city'
               value={shippingInfo.city}
               onChange={changeHandler}
            />
            <input
               required
               type='text'
               placeholder='State'
               name='state'
               value={shippingInfo.state}
               onChange={changeHandler}
            />
            <select
               name='country'
               required
               value={shippingInfo.country}
               onChange={changeHandler}
            >
               <option value={""}>Choose Country</option>
               <option value={"India"}>India</option>
            </select>
            <input
               required
               type='number'
               placeholder='Pin Code'
               name='pinCode'
               value={shippingInfo.pinCode}
               onChange={changeHandler}
            />

            <button type='submit'>PAY NOW</button>
         </form>
      </div>
   );
}
