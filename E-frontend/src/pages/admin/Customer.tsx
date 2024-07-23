import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { ReactElement, useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { FaTrash } from "react-icons/fa";
import { CustomError } from "../../types/api.types";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import e_commerce from "../../assets/images/ecommerce.png";
import TableHOC from "../../components/admin/TableHOC";

interface DataType {
   avatar: ReactElement;
   name: string;
   email: string;
   gender: string;
   role: string;
   action: ReactElement;
}

const columns: Column<DataType>[] = [
   {
      Header: "Avatar",
      accessor: "avatar",
   },
   {
      Header: "Name",
      accessor: "name",
   },
   {
      Header: "Gender",
      accessor: "gender",
   },
   {
      Header: "Email",
      accessor: "email",
   },
   {
      Header: "Role",
      accessor: "role",
   },
   {
      Header: "Action",
      accessor: "action",
   },
];

const arr: DataType[] = [
   {
      avatar: <img src={e_commerce} alt='Shoes'></img>,
      name: "Puma Shoes Air Jordan Cook Nigga 2023",
      email: "abcd@gmail.com",
      gender: "male",
      role: "user",
      action: <Link to='/admin/product/sajknaskd'>Manage</Link>,
   },
   {
      avatar: <img src={e_commerce} alt='Shoes'></img>,
      name: "Puma Shoes Air Jordan Cook Nigga 2023",
      email: "abcd@gmail.com",
      gender: "female",
      role: "user",
      action: <Link to='/admin/product/sajknaskd'>Manage</Link>,
   },
   {
      avatar: <img src={e_commerce} alt='Shoes'></img>,
      name: "Puma Shoes Air Jordan Cook Nigga 2023",
      email: "abcd@gmail.com",
      gender: "male",
      role: "admin",
      action: <Link to='/admin/product/sajknaskd'>Manage</Link>,
   },
];

function Customer() {
   // const { user } = useSelector((state: RootState) => state.userReducer);

   // const { isLoading, data, isError, error } = useAllUsersQuery(user?._id!);

   // const [rows, setRows] = useState<DataType[]>([]);

   // const [deleteUser] = useDeleteUserMutation();

   // const deleteHandler = async (userId: string) => {
   //    const res = await deleteUser({ userId, adminUserId: user?._id! });
   //    responseToast(res, null, "");
   // };

   // if (isError) {
   //    const err = error as CustomError;
   //    toast.error(err.data.message);
   // }

   // useEffect(() => {
   //    if (data)
   //       setRows(
   //          data.users.map((i) => ({
   //             avatar: (
   //                <img
   //                   style={{
   //                      borderRadius: "50%",
   //                   }}
   //                   src={i.photo}
   //                   alt={i.name}
   //                />
   //             ),
   //             name: i.name,
   //             email: i.email,
   //             gender: i.gender,
   //             role: i.role,
   //             action: (
   //                <button onClick={() => deleteHandler(i._id)}>
   //                   <FaTrash />
   //                </button>
   //             ),
   //          }))
   //       );
   // }, [data]);

   const [data] = useState<DataType[]>(arr);

   const Table = TableHOC<DataType>(
      columns,
      data,
      "dashboard-product-box",
      "Customers",
      data.length > 6
   )();

   return (
      <div className='admin-container'>
         <AdminSidebar />
         <main>{Table}</main>
      </div>
   );
}

export default Customer;
