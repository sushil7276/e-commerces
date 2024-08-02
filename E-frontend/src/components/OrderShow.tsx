import { IoMdClose } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDetailsOrderQuery } from "../redux/api/order.api";
import { server } from "../redux/store";
import { Order, OrderItem } from "../types/types";
import Loader from "./Loader";

const defaultData: Order = {
   shippingInfo: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
   },
   status: "",
   subtotal: 0,
   discount: 0,
   shippingCharges: 0,
   tax: 0,
   total: 0,
   orderItems: [],
   user: { name: "", _id: "" },
   _id: "",
};

const OrderShow = () => {
   const params = useParams();
   const navigate = useNavigate();

   const { isError, isLoading, data } = useDetailsOrderQuery(params.id!);

   const {
      shippingInfo: { address, city, state, country, pinCode },
      orderItems,
      user: { name },
      status,
      tax,
      subtotal,
      total,
      discount,
      shippingCharges,
   } = data?.order || defaultData;

   const deleteHandler = () => {
      navigate("/orders");
   };

   if (isError) return navigate("/");

   return (
      <div className='order-details-container'>
         <main className='order-management-details'>
            {isLoading ? (
               <Loader />
            ) : (
               <>
                  <section
                     style={{
                        padding: "2rem",
                     }}
                  >
                     <h2>Order Items</h2>

                     {orderItems.map((i) => (
                        <ProductCard
                           _id={i._id}
                           name={i.name}
                           photo={`${server}/${i.photo}`}
                           price={i.price}
                           productId={i.productId}
                           quantity={i.quantity}
                           key={i._id}
                        />
                     ))}
                  </section>

                  <article className='shipping-info-card'>
                     <button
                        className='product-delete-btn'
                        onClick={deleteHandler}
                     >
                        <IoMdClose />
                     </button>
                     <h1>Order Info</h1>
                     <h5>User Info</h5>
                     <p>Name: {name}</p>
                     <p>
                        Address:{" "}
                        {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
                     </p>
                     <h5>Amount Info</h5>
                     <p>Subtotal: {subtotal}</p>
                     <p>Shipping Charges: {shippingCharges}</p>
                     <p>Tax: {tax}</p>
                     <p>Discount: {discount}</p>
                     <p>Total: {total}</p>

                     <h5>Status Info</h5>
                     <p>
                        Status:{" "}
                        <span
                           className={
                              status === "Delivered"
                                 ? "purple"
                                 : status === "Shipped"
                                 ? "green"
                                 : "red"
                           }
                        >
                           {status}
                        </span>
                     </p>
                  </article>
               </>
            )}
         </main>
      </div>
   );
};

const ProductCard = ({
   name,
   photo,
   price,
   quantity,
   productId,
}: OrderItem) => (
   <div className='transaction-product-card'>
      <img src={photo} alt={name} />
      <Link to={`/product/${productId}`}>{name}</Link>
      <span>
         ₹{price} X {quantity} = ₹{price * quantity}
      </span>
   </div>
);

export default OrderShow;
