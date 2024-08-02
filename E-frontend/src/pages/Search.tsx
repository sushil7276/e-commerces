// temp Images
import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import {
   useCategoriesQuery,
   useSearchProductQuery,
} from "../redux/api/product.api";
import { CustomError } from "../types/api.types";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addFromCart } from "../redux/reducer/cartReducer";

export default function Search() {
   const {
      data: categoriesResponse,
      isLoading: isLoadingCategories,
      isError,
      error,
   } = useCategoriesQuery("");

   const [search, setSearch] = useState<string>("");
   const [sort, setSort] = useState<string>("");
   const [maxPrice, setMaxPrice] = useState<number>(100000);
   const [category, setCategory] = useState<string>("");
   const [page, setPage] = useState<number>(1);

   const dispatch = useDispatch();

   const {
      isLoading: isProductLoading,
      data: productResponse,
      isError: productIsError,
      error: productError,
   } = useSearchProductQuery({
      category,
      page,
      price: maxPrice,
      search,
      sort,
   });

   const addToCart = (cartItem: CartItem) => {
      if (cartItem.stock < 1) return toast.error("Out Of Stock.");

      dispatch(addFromCart(cartItem));
      toast.success("Add To Cart");
   };

   const isPrevPage = 1 < page;

   let totalPage = 2;
   if (productResponse?.totalPage) {
      totalPage = productResponse.totalPage;
   }

   const isNextPage = page < totalPage;

   if (isError) {
      // toast.error((error as CustomError).data.message)
      const err = error as CustomError;
      toast.error(err.data.message);
   }

   if (productIsError) toast.error((productError as CustomError).data.message);

   return (
      <div className='search'>
         <aside>
            <h1 className='heading'>Filters</h1>
            <div>
               <label htmlFor='sort'>Sort</label>
               <select
                  name='sort'
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
               >
                  <option value=''>None</option>
                  <option value='asc'>Price (Low to High)</option>
                  <option value='dsc'>Price (High to Low)</option>
               </select>
            </div>

            <div>
               <label htmlFor='price'>Max Price: {maxPrice}</label>
               <input
                  type='range'
                  min={0}
                  max={100000}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
               />
            </div>

            <div>
               <label htmlFor='category'>Category</label>
               <select
                  name='category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
               >
                  <option value=''>ALL</option>
                  {!isLoadingCategories &&
                     categoriesResponse?.categories.map((category, index) => (
                        <option key={index} value={category}>
                           {category.toUpperCase()}
                        </option>
                     ))}
               </select>
            </div>
         </aside>

         <main>
            <h1 className='heading'>Products</h1>
            <input
               type='text'
               placeholder='Search by name...'
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
            {isProductLoading ? (
               <Loader />
            ) : (
               <div className='card'>
                  {productResponse?.products.map((item) => (
                     <ProductCard
                        name={item.name}
                        photo={item.photo}
                        productId={item._id}
                        stock={item.stock}
                        price={item.price}
                        handler={addToCart}
                        key={item._id}
                     />
                  ))}
               </div>
            )}

            {/* Total Page is greater than 1 then render page */}
            {productResponse && productResponse.totalPage > 1 && (
               <article>
                  <button
                     disabled={!isPrevPage}
                     onClick={() => setPage((prev) => prev - 1)}
                  >
                     <IoIosArrowBack /> Prev
                  </button>
                  <span>
                     {page} of
                     {totalPage}
                  </span>
                  <button
                     disabled={!isNextPage}
                     onClick={() => setPage((prev) => prev + 1)}
                  >
                     Next <IoIosArrowForward />
                  </button>
               </article>
            )}
         </main>
      </div>
   );
}
