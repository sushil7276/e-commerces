import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type ProductProps = {
   productId: string;
   photo: string;
   name: string;
   price: number;
   stock: number;
   handler: (cartItem: CartItem) => string | undefined;
};

export default function ProductCard({
   productId,
   name,
   photo,
   price,
   stock,
   handler,
}: ProductProps) {
   return (
      <div className='product-card'>
         <img src={`${server}/${photo}`} alt={name} />
         <p>{name}</p>
         <span>&#x20b9;{price}</span>

         <div>
            <button
               onClick={() =>
                  handler({ name, photo, price, stock, productId, quantity: 1 })
               }
            >
               <FaPlus />
            </button>
         </div>
      </div>
   );
}
