import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { getUser } from "./redux/api/userAPI";
import { userReducerInitialState } from "./types/reducer.types";

// lazy loading concept
const Loader = lazy(() => import("./components/Loader"));
const Cart = lazy(() => import("./components/Cart"));
const Home = lazy(() => import("./pages/Home"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Search = lazy(() => import("./pages/Search"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./components/OrderDetails"));

function App() {
   const { loading, user } = useSelector(
      (state: { userReducer: userReducerInitialState }) => state.userReducer
   );
   const dispatch = useDispatch();

   useEffect(() => {
      // Authentication user on Google
      onAuthStateChanged(auth, async (user) => {
         if (user) {
            const data = await getUser(user.uid);
            dispatch(userExist(data.user));
         } else {
            dispatch(userNotExist());
         }
      });
   });

   return loading ? (
      <Loader />
   ) : (
      <BrowserRouter>
         {/* Header */}
         <Header user={user} />

         <Suspense fallback={<Loader />}>
            <Routes>
               <Route path='/' element={<Home />} />
               <Route path='/cart' element={<Cart />} />
               <Route path='/search' element={<Search />} />

               {/* Not Logged In Route */}
               <Route path='/login' element={<Login />} />

               {/* Logged In User Routes */}
               <Route>
                  <Route path='/shipping' element={<Shipping />} />
                  <Route path='/orders' element={<Orders />} />
                  <Route path='/order/:id' element={<OrderDetails />} />
               </Route>

               {/* Admin Routes */}
            </Routes>
         </Suspense>
         <Toaster position='bottom-center' />
      </BrowserRouter>
   );
}

export default App;
