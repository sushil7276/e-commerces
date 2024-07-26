import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type CartProps = {
   cartItem: CartItem;
   incrementHandler: (cartItem: CartItem) => void;
   decrementHandler: (cartItem: CartItem) => void;
   removeHandler: (id: string) => void;
};

export default function CartItems({
   cartItem,
   incrementHandler,
   decrementHandler,
   removeHandler,
}: CartProps) {
   const { productId, photo, quantity, name, price } = cartItem;

   return (
      <div>
         <div className='product'>
            <img src={`${server}/${photo}`} alt={name} />
            <article>
               <Link to={`/product/${productId}`}>{name}</Link>
               <span className='price'>&#x20b9;{price}</span>
            </article>
         </div>
         {/* Add Or Remove Section */}
         <div className='action-button'>
            <button onClick={() => decrementHandler(cartItem)}>-</button>
            {quantity}
            <button onClick={() => incrementHandler(cartItem)}>+</button>
            <button
               className='delete-button'
               onClick={() => removeHandler(productId)}
            >
               <MdDelete />
            </button>
         </div>
      </div>
   );
}
