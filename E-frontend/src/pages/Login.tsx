import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/user.api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api.types";
import { useNavigate } from "react-router-dom";

export default function Login() {
   const [gender, setGender] = useState<string>("");
   const [date, setDate] = useState<string>("");

   const navigate = useNavigate();

   const [login] = useLoginMutation();

   const loginHandler = async () => {
      try {
         const provider = new GoogleAuthProvider();

         const { user } = await signInWithPopup(auth, provider);

         const res = await login({
            name: user.displayName!,
            email: user.email!,
            photo: user.photoURL!,
            gender,
            role: "user",
            dob: date,
            _id: user.uid,
         });

         if ("data" in res) {
            toast.success(res.data?.message as string);
            navigate("/");
         } else {
            const error = res.error as FetchBaseQueryError;
            const { message } = error.data as MessageResponse;
            toast.error(message);
         }
      } catch (error) {
         toast.error("Sign In Failed.");
      }
   };

   return (
      <div className='login'>
         <main>
            <h1 className='heading'>Login</h1>
            <div>
               <label htmlFor='gender'>Gender</label>
               <select
                  name='gender'
                  value={gender}
                  required
                  onChange={(e) => setGender(e.target.value)}
               >
                  <option value=''>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
               </select>
            </div>
            <div>
               <label htmlFor='date'>Date of birth</label>
               <input
                  type='date'
                  name='date'
                  value={date}
                  required
                  onChange={(e) => setDate(e.target.value)}
               />
            </div>

            <div>
               <p>Already Signed In Once</p>
               <button onClick={loginHandler}>
                  <FcGoogle /> <span>Sign in with Google</span>
               </button>
            </div>
         </main>
      </div>
   );
}
