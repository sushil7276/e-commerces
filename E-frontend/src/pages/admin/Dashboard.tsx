import toast from "react-hot-toast";
import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import { useStatsQuery } from "../../redux/api/dashboard.api";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api.types";
import { useEffect, useState } from "react";
import { Stats } from "../../types/types";
import DashboardTable from "../../components/admin/DashboardTable";
import Loader from "../../components/Loader";

const userImg =
   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

function Dashboard() {
   const { user } = useSelector((state: RootState) => state.userReducer);

   const { isError, data, error, isLoading } = useStatsQuery((user ?? {})._id!);

   const [stats, setStats] = useState<Stats>(
      (data ?? {}).stats! || {
         revenue: 0,
         changePercent: {
            revenue: 0,
            user: 0,
            product: 0,
            order: 0,
         },
         count: {
            user: 0,
            product: 0,
            order: 0,
         },
         chart: {
            order: [],
            revenue: [],
         },
         userRatio: {
            male: 0,
            female: 0,
         },
         categoryCount: [],
         latestTransaction: [],
      }
   );

   if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
   }

   useEffect(() => {
      if (data) {
         setStats(data.stats);
      }
   }, [data]);

   return (
      <div className='admin-container'>
         <AdminSidebar />
         <main className='dashboard'>
            <main>
               {isLoading ? (
                  <Loader />
               ) : (
                  <>
                     <div className='bar'>
                        <BsSearch />
                        <input
                           type='text'
                           placeholder='Search for data, users, docs'
                        />
                        <FaRegBell />
                        <img src={user?.photo || userImg} alt='User' />
                     </div>

                     {/* Counting Section Start */}
                     <section className='widget-container'>
                        <WidgetItem
                           percent={stats.changePercent.revenue}
                           amount={true}
                           value={stats.count.revenue}
                           heading='Revenue'
                           color='rgb(0, 115, 255)'
                        />
                        <WidgetItem
                           percent={stats.changePercent.user}
                           value={stats.count.user}
                           color='rgb(0 198 202)'
                           heading='Users'
                        />
                        <WidgetItem
                           percent={stats.changePercent.order}
                           value={stats.count.order}
                           color='rgb(255 196 0)'
                           heading='Transactions'
                        />

                        <WidgetItem
                           percent={stats.changePercent.product}
                           value={stats.count.product}
                           color='rgb(76 0 255)'
                           heading='Products'
                        />
                     </section>
                     {/* Counting Section End */}

                     <section className='graph-container'>
                        {/* Revenue In Bar Chart */}
                        <div className='revenue-chart'>
                           <h2>Revenue & Transaction</h2>
                           {/* <BarChart
                        labels={months}
                        data_1={stats.chart.revenue}
                        data_2={stats.chart.order}
                        title_1='Revenue'
                        title_2='Transaction'
                        bgColor_1='rgb(0, 115, 255)'
                        bgColor_2='rgba(53, 162, 235, 0.8)'
                     /> */}
                           <BarChart
                              data_1={stats.chart.revenue}
                              data_2={stats.chart.order}
                              title_1='Revenue'
                              title_2='Transaction'
                              bgColor_1='rgb(0, 115, 255)'
                              bgColor_2='rgba(53, 162, 235, 0.8)'
                           />
                        </div>
                        {/* Revenue In Bar Chart */}

                        {/* Categories Name wise Count */}
                        <div className='dashboard-categories'>
                           <h2>Inventory</h2>

                           <div>
                              {stats?.categoryCount.map((i) => {
                                 const [heading, value] = Object.entries(i)[0];
                                 return (
                                    <CategoryItem
                                       key={heading}
                                       value={value}
                                       heading={heading}
                                       color={`hsl(${
                                          value * 4
                                       }, ${value}%, 50%)`}
                                    />
                                 );
                              })}
                           </div>
                        </div>
                        {/* Categories Name wise Count */}
                     </section>

                     <section className='transaction-container'>
                        {/* User Ratio Chart */}
                        <div className='gender-chart'>
                           <h2>Gender Ratio</h2>
                           <DoughnutChart
                              labels={["Female", "Male"]}
                              data={[
                                 stats.userRatio.female,
                                 stats.userRatio.male,
                              ]}
                              backgroundColor={[
                                 "hsl(340, 82%, 56%)",
                                 "rgba(53, 162, 235, 0.8)",
                              ]}
                              cutout={80}
                           />
                           <p>
                              <BiMaleFemale />
                           </p>
                        </div>
                        {/* User Ratio Chart */}

                        {<DashboardTable data={stats.latestTransaction} />}
                     </section>
                  </>
               )}
            </main>
         </main>
      </div>
   );
}

interface WidgetItemProps {
   heading: string;
   value: number;
   percent: number;
   color: string;
   amount?: boolean;
}

const WidgetItem = ({
   heading,
   value,
   percent,
   color,
   amount = false,
}: WidgetItemProps) => (
   <article className='widget'>
      <div className='widget-info'>
         <p>{heading}</p>
         <h4>{amount ? `₹${value}` : value}</h4>
         {percent > 0 ? (
            <span className='green'>
               <HiTrendingUp /> +{`${percent > 10000 ? 9999 : percent}%`}
            </span>
         ) : (
            <span className='red'>
               <HiTrendingDown /> {`${percent < -10000 ? -9999 : percent}%`}
            </span>
         )}
      </div>

      <div
         className='widget-circle'
         style={{
            background: `conic-gradient(
         ${color} ${(Math.abs(percent) / 100) * 360}deg,
         rgb(255, 255, 255) 0
       )`,
         }}
      >
         <span
            style={{
               color,
            }}
         >
            {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
            {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}
         </span>
      </div>
   </article>
);

interface CategoryItemProps {
   color: string;
   value: number;
   heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
   <div className='category-item'>
      <h5>{heading}</h5>
      <div>
         <div
            style={{
               backgroundColor: color,
               width: `${value}%`,
            }}
         ></div>
      </div>
      <span>{value}%</span>
   </div>
);

export default Dashboard;
