import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Loader from "../../components/Loader";
import { CustomError } from "../../types/api.types";

import { useSelector } from "react-redux";
import TableHOC from "../../components/admin/TableHOC";
import {
   useAllUsersQuery,
   useDeleteUserMutation,
} from "../../redux/api/user.api";
import { RootState } from "../../redux/store";
import { responseToast } from "../../utils/features";

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

function Customer() {
   const { user } = useSelector((state: RootState) => state.userReducer);

   const { isLoading, isError, error, data } = useAllUsersQuery(
      (user ?? {})._id!
   );

   const [rows, setRows] = useState<DataType[]>([]);

   const [deleteUser] = useDeleteUserMutation();

   // const [deleteUser] = useDeleteUserMutation();

   const deleteHandler = async (userId: string) => {
      const res = await deleteUser({ userId, adminId: (user ?? {})._id! });

      responseToast(res, null, "");
   };

   if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
   }

   useEffect(() => {
      if (data) {
         setRows(
            data.users.map((i) => ({
               avatar: (
                  <img
                     style={{
                        borderRadius: "50%",
                     }}
                     src={i.photo}
                     alt={i.name}
                  />
               ),
               name: i.name,
               email: i.email,
               gender: i.gender,
               role: i.role,
               action: (
                  <button onClick={() => deleteHandler(i._id)}>
                     <FaTrash />
                  </button>
               ),
            }))
         );
      }
      // eslint-disable-next-line
   }, [data]);

   const Table = TableHOC<DataType>(
      columns,
      rows,
      "dashboard-product-box",
      "Customers",
      rows.length > 6
   )();

   return (
      <div className='admin-container'>
         <AdminSidebar />
         <main>{isLoading ? <Loader /> : Table}</main>
      </div>
   );
}

export default Customer;
