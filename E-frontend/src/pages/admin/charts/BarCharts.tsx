import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";

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

const BarCharts = () => {
   // const { user } = useSelector((state: RootState) => state.userReducer);

   // const { isLoading, data, error, isError } = useBarQuery(user?._id!);

   // const products = data?.charts.products || [];
   // const orders = data?.charts.orders || [];
   // const users = data?.charts.users || [];

   // if (isError) {
   //    const err = error as CustomError;
   //    toast.error(err.data.message);
   // }

   return (
      <div className='admin-container'>
         <AdminSidebar />
         <main className='chart-container'>
            <h1>Bar Charts</h1>
            {/* {isLoading ? (
               <Loader />
            ) : (
            <>
               <section>
                  <BarChart
                     data_1={products}
                     data_2={users}
                     labels={last6Months}
                     title_1='Products'
                     title_2='Users'
                     bgColor_1={`hsl(260, 50%, 30%)`}
                     bgColor_2={`hsl(360, 90%, 90%)`}
                  />
                  <h2>Top Products & Top Customers</h2>
               </section>

               <section>
                  <BarChart
                     horizontal={true}
                     data_1={orders}
                     data_2={[]}
                     title_1='Orders'
                     title_2=''
                     bgColor_1={`hsl(180, 40%, 50%)`}
                     bgColor_2=''
                     labels={last12Months}
                  />
                  <h2>Orders throughout the year</h2>
               </section>
            </>
            )} */}

            <section>
               <BarChart
                  data_1={[200, 44, 556, 778, 455, 990]}
                  data_2={[300, 144, 433, 655, 237, 755, 190]}
                  title_1='Products'
                  title_2='Users'
                  bgColor_1={`hsl(260, 50%, 30%)`}
                  bgColor_2={`hsl(360, 90%, 90%)`}
               />
               <h2>Top Products & Top Customers</h2>
            </section>

            <section>
               <BarChart
                  horizontal={true}
                  data_1={[200, 44, 556, 778, 455, 990]}
                  data_2={[300, 144, 433, 655, 237, 755, 190]}
                  title_1='Orders'
                  title_2=''
                  bgColor_1={`hsl(180, 40%, 50%)`}
                  bgColor_2=''
                  labels={months}
               />
               <h2>Orders throughout the year</h2>
            </section>
         </main>
      </div>
   );
};

export default BarCharts;