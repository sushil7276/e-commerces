import ProductCard from "../components/ProductCard";

// temp Images
import Tel from "../assets/images/tails.png";
import Head from "../assets/images/heads.png";
import cover from "../assets/cover.jpg";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const data = [
  { _id: "1", name: "Canon m50 mark II", price: 59999, img: Tel, stock: 2 },
  { _id: "2", name: "abcd", price: 69982, img: Head, stock: 0 },
  { _id: "3", name: "xyz", price: 6000, img: cover, stock: 1 },
];
export default function Search() {
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const addToCart = () => {};

  const isPrevPage = 1 < page;
  const isNextPage = 4 > page;
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
            <option value=''>All</option>
            <option value='camera'>Camera</option>
            <option value='laptop'>laptop</option>
          </select>
        </div>
      </aside>

      <main>
        <h1 className='heading'>Product</h1>
        <input
          type='text'
          placeholder='Search by name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className='card'>
          {data.length > 0 &&
            data?.map((item) => (
              <ProductCard
                name={item.name}
                photo={item.img}
                productId={item._id}
                stock={item.stock}
                price={item.price}
                handler={addToCart}
                key={item._id}
              />
            ))}
        </div>

        <article>
          <button
            disabled={!isPrevPage}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <IoIosArrowBack /> Prev
          </button>
          <span>
            {page} of {4}
          </span>
          <button
            disabled={!isNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next <IoIosArrowForward />
          </button>
        </article>
      </main>
    </div>
  );
}
