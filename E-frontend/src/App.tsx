import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { getUser } from "./redux/api/user.api";
import { userReducerInitialState } from "./types/reducer.types";
import ProtectedRoute from "./components/ProtectedRoute";

// lazy loading concept
const Loader = lazy(() => import("./components/Loader"));
const Cart = lazy(() => import("./components/Cart"));
const Home = lazy(() => import("./pages/Home"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Search = lazy(() => import("./pages/Search"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./components/OrderDetails"));

// admin components
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const Customer = lazy(() => import("./pages/admin/Customer"));
const Product = lazy(() => import("./pages/admin/Product"));
const AdminSidebar = lazy(() => import("./components/admin/AdminSidebar"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const NewProduct = lazy(() => import("./pages/admin/Management/NewProduct"));
const ProductManagement = lazy(
   () => import("./pages/admin/Management/ProductManagement")
);
const TransactionManagement = lazy(
   () => import("./pages/admin/Management/TransactionManagement")
);
const BarCharts = lazy(() => import("./pages/admin/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/admin/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/admin/charts/LineCharts"));

// app Component
const Stopwatch = lazy(() => import("./pages/admin/app/Stopwatch"));
const Coupon = lazy(() => import("./pages/admin/app/Coupon"));
const Toss = lazy(() => import("./pages/admin/app/Toss"));

function App() {
   const { loading, user } = useSelector(
      (state: { userReducer: userReducerInitialState }) => state.userReducer
   );
   const dispatch = useDispatch();

   useEffect(() => {
      // Authentication user on Google
      onAuthStateChanged(auth, async (gUser) => {
         if (gUser) {
            const data = await getUser(gUser.uid);
            dispatch(userExist(data.user));
         } else {
            dispatch(userNotExist());
         }
      });
   }, []);

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
               <Route
                  path='/login'
                  element={
                     <ProtectedRoute isAuthenticated={user ? false : true}>
                        <Login />
                     </ProtectedRoute>
                  }
               />

               {/* Logged In User Routes */}
               <Route
                  element={
                     <ProtectedRoute isAuthenticated={user ? true : false} />
                  }
               >
                  <Route path='/shipping' element={<Shipping />} />
                  <Route path='/orders' element={<Orders />} />
                  <Route path='/order/:id' element={<OrderDetails />} />
               </Route>

               {/* Admin Routes */}
               <Route path='/dashboard' element={<AdminSidebar />} />
               <Route path='/admin/dashboard' element={<Dashboard />} />
               <Route path='/admin/product' element={<Product />} />
               <Route path='/admin/transaction' element={<Transaction />} />
               <Route path='/admin/customer' element={<Customer />} />
               <Route path='/admin/product/new' element={<NewProduct />} />
               <Route
                  path='/admin/product/:id'
                  element={<ProductManagement />}
               />

               <Route
                  path='/admin/transaction/:id'
                  element={<TransactionManagement />}
               />
               <Route path='/admin/chart/bar' element={<BarCharts />} />
               <Route path='/admin/chart/pie' element={<PieCharts />} />
               <Route path='/admin/chart/line' element={<LineCharts />} />
               <Route path='/admin/app/stopwatch' element={<Stopwatch />} />
               <Route path='/admin/app/coupon' element={<Coupon />} />
               <Route path='/admin/app/toss' element={<Toss />} />

               {/* <Route
                  element={
                     <ProtectedRoute
                        isAuthenticated={user ? true : false}
                        isAdmin={user?.role === "admin" ? true : false}
                        adminRoute={true}
                     />
                  }
               ></Route> */}
            </Routes>
         </Suspense>
         <Toaster position='bottom-center' />
      </BrowserRouter>
   );
}

export default App;
