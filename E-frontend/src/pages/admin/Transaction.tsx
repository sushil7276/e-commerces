import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import TableHOC from "../../components/admin/TableHOC";

interface DataType {
   user: string;
   amount: number;
   discount: number;
   quantity: number;
   status: ReactElement;
   action: ReactElement;
}

const data: DataType[] = [
   {
      user: "aasdasd",
      amount: 123123,
      discount: 123,
      quantity: 23,
      status: <span>Processing</span>,
      action: <Link to={`/admin/transaction/${"asda231231"}`}>Manage</Link>,
   },
   {
      user: "aasdasd",
      amount: 45234,
      discount: 112323,
      quantity: 123,
      status: <span>Processing</span>,
      action: <Link to={`/admin/transaction/${"asda231231"}`}>Manage</Link>,
   },
   {
      user: "aasdasd",
      amount: 3434,
      discount: 4546,
      quantity: 56,
      status: <span>Processing</span>,
      action: <Link to={`/admin/transaction/${"asda231231"}`}>Manage</Link>,
   },
   {
      user: "aasdasd",
      amount: 6767767,
      discount: 78,
      quantity: 56,
      status: <span>Processing</span>,
      action: <Link to={`/admin/transaction/${"asda231231"}`}>Manage</Link>,
   },
   {
      user: "aasdasd",
      amount: 567567,
      discount: 768,
      quantity: 44564,
      status: <span>Processing</span>,
      action: <Link to={`/admin/transaction/${"asda231231"}`}>Manage</Link>,
   },
];

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
   // const { user } = useSelector((state: RootState) => state.userReducer);

   // const { isLoading, data, isError, error } = useAllOrdersQuery(user?._id!);

   // const [rows, setRows] = useState<DataType[]>([]);

   // if (isError) {
   //    const err = error as CustomError;
   //    toast.error(err.data.message);
   // }

   // useEffect(() => {
   //    if (data)
   //       setRows(
   //          data.orders.map((i) => ({
   //             user: i.user.name,
   //             amount: i.total,
   //             discount: i.discount,
   //             quantity: i.orderItems.length,
   //             status: (
   //                <span
   //                   className={
   //                      i.status === "Processing"
   //                         ? "red"
   //                         : i.status === "Shipped"
   //                         ? "green"
   //                         : "purple"
   //                   }
   //                >
   //                   {i.status}
   //                </span>
   //             ),
   //             action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
   //          }))
   //       );
   // }, [data]);

   const [row] = useState<DataType[]>(data);

   const Table = TableHOC<DataType>(
      columns,
      row,
      "dashboard-product-box",
      "Transactions",
      row.length > 6
   )();
   return (
      <div className='admin-container'>
         <AdminSidebar />
         {/* <main>{isLoading ? <Loader/> : Table}</main> */}
         <main>{Table}</main>
      </div>
   );
}

export default Transaction;
