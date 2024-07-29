import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import TableHOC from "../../components/admin/TableHOC";
import { userReducerInitialState } from "../../types/reducer.types";
import { useAllOrdersQuery } from "../../redux/api/order.api";
import { CustomError } from "../../types/api.types";

interface DataType {
   user: string;
   amount: number;
   discount: number;
   quantity: number;
   status: ReactElement;
   action: ReactElement;
}

const columns: Column<DataType>[] = [
   {
      Header: "Avatar",
      accessor: "user",
   },
   {
      Header: "Amount",
      accessor: "amount",
   },
   {
      Header: "Discount",
      accessor: "discount",
   },
   {
      Header: "Quantity",
      accessor: "quantity",
   },
   {
      Header: "Status",
      accessor: "status",
   },
   {
      Header: "Action",
      accessor: "action",
   },
];

function Transaction() {
   const { user } = useSelector(
      (state: { userReducer: userReducerInitialState }) => state.userReducer
   );

   const { isError, isLoading, error, data } = useAllOrdersQuery(
      (user ?? {})._id!
   );

   const [rows, setRows] = useState<DataType[]>([]);

   if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
   }

   useEffect(() => {
      if (data) {
         setRows(
            data.orders.map((i) => ({
               user: i.user.name,
               quantity: i.orderItems?.length,
               discount: i.discount,
               amount: i.total,
               status: (
                  <span
                     className={
                        i.status === "Processing"
                           ? "red"
                           : i.status === "Shipped"
                           ? "green"
                           : "purple"
                     }
                  >
                     {i.status}
                  </span>
               ),
               action: (
                  <Link to={`/admin/transaction/${i._id}`} key={i._id}>
                     Manage
                  </Link>
               ),
            }))
         );
      }
   }, [data]);

   const Table = TableHOC<DataType>(
      columns,
      rows,
      "dashboard-product-box",
      "Transactions",
      rows.length > 6
   )();
   return (
      <div className='admin-container'>
         <AdminSidebar />
         <main>{isLoading ? <Loader /> : Table}</main>
      </div>
   );
}

export default Transaction;
