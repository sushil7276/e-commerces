import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";

type ProductProps = {
   productId: string;
   photo: string;
   name: string;
   price: number;
   stock: number;
   handler: () => void;
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
            <button onClick={() => handler()}>
               <FaPlus />
            </button>
         </div>
      </div>
   );
}
