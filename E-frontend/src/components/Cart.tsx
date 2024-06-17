import { VscError } from "react-icons/vsc";
import cover from "../assets/cover.jpg";
import Head from "../assets/images/heads.png";
import Tel from "../assets/images/tails.png";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";

const cartItem = [
  { _id: "1", name: "Canon m50 mark II", price: 59999, img: Tel, stock: 2 },
  { _id: "2", name: "abcd", price: 69982, img: Head, stock: 0 },
  { _id: "3", name: "xyz", price: 6000, img: cover, stock: 1 },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const discount = 400;
const total = subtotal + tax + shippingCharges - discount;

export default function Cart() {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);


  return (
    <div className='cart'>
      <main>
        {/* Product section */}
        {cartItem.length > 0 ? (
          cartItem.map((item) => (
            <CartItem
              productId={item._id}
              name={item.name}
              photo={item.img}
              price={item.price}
              stock={item.stock}
              key={item._id}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>

      <aside>
        <p>Subtotal:&#x20b9;{subtotal}</p>
        <p>Shipping Charges:&#x20b9;{shippingCharges}</p>
        <p>Tax:&#x20b9;{tax}</p>
        <p>
          Discount: <em className='red'> - &#x20b9;{discount}</em>
        </p>
        <p>
          <b>Total:&#x20b9;{total}</b>
        </p>
        <input
          type='text'
          value={couponCode}
          placeholder='Coupon Code...'
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {couponCode &&
          (isValidCouponCode ? (
            <span className='green'>
              &#x20b9;{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className='red'>
              Invalid Coupon <VscError />
            </span>
          ))}
        <Link to={"/shipping"}>
          <button>Shipping</button>
        </Link>
      </aside>
    </div>
  );
}
