import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";

const months = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "Aug",
   "Sept",
   "Oct",
   "Nov",
   "Dec",
];

const LineCharts = () => {
   // const { user } = useSelector((state: RootState) => state.userReducer);

   // const { isLoading, data, error, isError } = useLineQuery(user?._id!);

   // const products = data?.charts.products || [];
   // const users = data?.charts.users || [];
   // const revenue = data?.charts.revenue || [];
   // const discount = data?.charts.discount || [];

   // if (isError) {
   //    const err = error as CustomError;
   //    toast.error(err.data.message);
   // }

   return (
      <div className='admin-container'>
         <AdminSidebar />
         <main className='chart-container'>
            <h1>Line Charts</h1>

            {/* {isLoading ? (
               <Skeleton length={15} />
            ) : (
               <>
                  <section>
                     <LineChart
                        data={users}
                        label='Users'
                        borderColor='rgb(53, 162, 255)'
                        labels={months}
                        backgroundColor='rgba(53, 162, 255, 0.5)'
                     />
                     <h2>Active Users</h2>
                  </section>

                  <section>
                     <LineChart
                        data={products}
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
            )} */}

            <section>
               <LineChart
                  data={[40, 60, 244, 100, 143, 120, 41, 47, 50, 56, 32]}
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
                  data={[
                     240000, 14400, 24100, 34300, 90000, 2000, 51211, 1231312,
                     44700, 900901, 1444400, 10000, 120000,
                  ]}
                  backgroundColor={"hsla(269,80%,40%,0.4)"}
                  borderColor={"hsl(269,80%,40%)"}
                  labels={months}
                  label='Products'
               />
               <h2>Total Products (SKU)</h2>
            </section>

            <section>
               <LineChart
                  data={[
                     240000, 14400, 24100, 34300, 90000, 2000, 51211, 1231312,
                     44700, 900901, 1444400, 10000, 120000,
                  ]}
                  backgroundColor={"hsla(129,80%,40%,0.4)"}
                  borderColor={"hsl(129,80%,40%)"}
                  label='Revenue'
                  labels={months}
               />
               <h2>Total Revenue </h2>
            </section>

            <section>
               <LineChart
                  data={[
                     900, 1200, 12000, 9000, 1000, 5000, 4000, 12000, 1100,
                     1500, 2000, 5000,
                  ]}
                  backgroundColor={"hsla(29,80%,40%,0.4)"}
                  borderColor={"hsl(29,80%,40%)"}
                  label='Discount'
                  labels={months}
               />
               <h2>Discount Allotted </h2>
            </section>
         </main>
      </div>
   );
};

export default LineCharts;
