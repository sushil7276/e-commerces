import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";

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
  return (
    <BrowserRouter>
      {/* Header */}
      <Header />

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
    </BrowserRouter>
  );
}

export default App;
