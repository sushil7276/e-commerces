import { Link } from "react-router-dom";

// temp Images
import Tel from "../assets/images/tails.png";
import Head from "../assets/images/heads.png";
import cover from "../assets/cover.jpg";
import ProductCard from "../components/ProductCard";

const data = [
  { _id: "1", name: "Canon m50 mark II", price: 59999, img: Tel, stock: 2 },
  { _id: "2", name: "abcd", price: 69982, img: Head, stock: 0 },
  { _id: "3", name: "xyz", price: 6000, img: cover, stock: 1 },
];

export default function Home() {
  const addToCart = () => {};

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
        {data?.map((item) => (
          <ProductCard
            productId={item._id}
            name={item.name}
            photo={item.img}
            price={item.price}
            stock={item.stock}
            handler={addToCart}
            key={item._id}
          />
        ))}
      </main>
    </div>
  );
}
