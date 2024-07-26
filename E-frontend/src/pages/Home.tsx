import { Link } from "react-router-dom";

// temp Images
import ProductCard from "../components/ProductCard";
import { useLatestProductQuery } from "../redux/api/product.api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addFromCart } from "../redux/reducer/cartReducer";

export default function Home() {
   const { data, isError, isLoading } = useLatestProductQuery("");

   const dispatch = useDispatch();

   const addToCart = (cartItem: CartItem) => {
      if (cartItem.stock < 1) return toast.error("Out Of Stock.");

      dispatch(addFromCart(cartItem));
      toast.success("Add To Cart");
   };

   if (isError) toast.error("Product Fetching Problem.");

   return (
      <div className='home'>
         {/* cover Image section */}
         <section></section>

         {/* Product Heading  */}
         <h1>
            LATEST PRODUCT
            <Link to={"/search"} className='findMore'>
               MORE
            </Link>
         </h1>

         {/* Product Show Section */}
         <main className='main'>
            {isLoading ? (
               <Loader />
            ) : (
               data?.products.map((item) => (
                  <ProductCard
                     productId={item._id}
                     name={item.name}
                     photo={item.photo}
                     price={item.price}
                     stock={item.stock}
                     handler={addToCart}
                     key={item._id}
                  />
               ))
            )}
         </main>
      </div>
   );
}
