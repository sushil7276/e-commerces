import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { RootState } from "../../../redux/store";
import { useLineQuery } from "../../../redux/api/dashboard.api";
import toast from "react-hot-toast";
import { CustomError } from "../../../types/api.types";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import { getLastMonths } from "../../../utils/features";

const { last12Month: months } = getLastMonths();

const LineCharts = () => {
   const { user } = useSelector((state: RootState) => state.userReducer);

   const { isError, isLoading, data, error } = useLineQuery((user ?? {})._id!);

   const [charts, setCharts] = useState(
      (data ?? {}).charts! || {
         user: [],
         product: [],
         discount: [],
         revenue: [],
      }
   );

   useEffect(() => {
      if (data) {
         setCharts((data ?? {}).charts);
      }
   }, [data]);

   const product = charts.product;
   const users = charts.user;
   const revenue = charts.revenue;
   const discount = charts.discount;

   if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
   }

   return (
      <div className='admin-container'>
         <AdminSidebar />
         <main className='chart-container'>
            <h1>Line Charts</h1>

            {isLoading ? (
               <Loader />
            ) : (
               <>
                  <section>
                     <LineChart
                        data={users}
                        label='Users'
                        borderColor='rgb(53, 162, 255)'
                        labels={months}
                        backgroundColor='rgba(53, 162, 255, 0.5)'
                        filler={false}
                     />
                     <h2>Active Users</h2>
                  </section>

                  <section>
                     <LineChart
                        data={product}
                        backgroundColor={"hsla(269,80%,40%,0.4)"}
                        borderColor={"hsl(269,80%,40%)"}
                        labels={months}
                        label='Products'
                     />
                     <h2>Total Products (SKU)</h2>
                  </section>

                  <section>
                     <LineChart
                        data={revenue}
                        backgroundColor={"hsla(129,80%,40%,0.4)"}
                        borderColor={"hsl(129,80%,40%)"}
                        label='Revenue'
                        labels={months}
                     />
                     <h2>Total Revenue </h2>
                  </section>

                  <section>
                     <LineChart
                        data={discount}
                        backgroundColor={"hsla(29,80%,40%,0.4)"}
                        borderColor={"hsl(29,80%,40%)"}
                        label='Discount'
                        labels={months}
                     />
                     <h2>Discount Allotted </h2>
                  </section>
               </>
            )}
         </main>
      </div>
   );
};

export default LineCharts;
