import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

type CartProps = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
};

export default function CartItem({
  name,
  photo,
  price,
  stock,
  productId,
}: CartProps) {
  const [count, setCount] = useState<number>(0);

  const countRemove = () => {
    if (count > 0) {
      setCount((prev) => (prev -= 1));
    }
  };

  const countPlus = () => {
    if (count < stock) {
      setCount((prev) => (prev += 1));
    }
  };

  return (
    <div>
      <div className='product'>
        <img src={photo} alt={name} />
        <article>
          <Link to={`/product/${productId}`}>{name}</Link>
          <span className='price'>&#x20b9;{price}</span>
        </article>
      </div>
      {/* Add Or Remove Section */}
      <div className='action-button'>
        <button onClick={countRemove}>-</button>
        {count}
        <button onClick={countPlus}>+</button>
        <button className='delete-button'>
          <MdDelete />
        </button>
      </div>
    </div>
  );
}
