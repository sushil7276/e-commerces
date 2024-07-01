import { IconType } from "react-icons";
import { AiFillFileText } from "react-icons/ai";
import {
   FaChartBar,
   FaChartLine,
   FaChartPie,
   FaGamepad,
   FaStopwatch,
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import {
   RiCoupon3Fill,
   RiDashboardFill,
   RiShoppingBag3Fill,
} from "react-icons/ri";
import { Link, Location, useLocation } from "react-router-dom";
import eCommerce from "../../assets/images/ecommerce.png";

function AdminSidebar() {
   const location = useLocation();

   return (
      <>
         <div className='dashboard__sidebar'>
            <aside className='sidebar'>
               <img src={eCommerce} alt='' />
               <div>
                  <DashboardDiv location={location} />
                  <ChartsDiv location={location} />
                  <AppsDiv location={location} />
               </div>
            </aside>
         </div>
      </>
   );
}

export default AdminSidebar;

const DashboardDiv = ({ location }: { location: Location }) => (
   <div>
      <h2>DASHBOARD</h2>
      <ul>
         <Li
            url='/admin/dashboard'
            text='Dashboard'
            Icon={RiDashboardFill}
            location={location}
         />
         <Li
            url='/admin/product'
            text='Product'
            Icon={RiShoppingBag3Fill}
            location={location}
         />
         <Li
            url='/admin/customer'
            text='Customer'
            Icon={IoIosPeople}
            location={location}
         />
         <Li
            url='/admin/transaction'
            text='Transaction'
            Icon={AiFillFileText}
            location={location}
         />
      </ul>
   </div>
);

const ChartsDiv = ({ location }: { location: Location }) => (
   <div>
      <h2>CHARTS</h2>
      <ul>
         <Li
            url='/admin/bar'
            text='Bar'
            Icon={FaChartBar}
            location={location}
         />
         <Li
            url='/admin/pie'
            text='Pie'
            Icon={FaChartPie}
            location={location}
         />
         <Li
            url='/admin/line'
            text='Line'
            Icon={FaChartLine}
            location={location}
         />
      </ul>
   </div>
);

const AppsDiv = ({ location }: { location: Location }) => (
   <div>
      <h2>APPS</h2>
      <ul>
         <Li
            url='/admin/app/stopwatch'
            text='Stopwatch'
            Icon={FaStopwatch}
            location={location}
         />
         <Li
            url='/admin/app/coupon'
            text='Coupon'
            Icon={RiCoupon3Fill}
            location={location}
         />
         <Li
            url='/admin/app/toss'
            text='Toss'
            Icon={FaGamepad}
            location={location}
         />
      </ul>
   </div>
);

interface LiProps {
   url: string;
   text: string;
   location: Location;
   Icon: IconType;
}

const Li = ({ url, text, location, Icon }: LiProps) => (
   <li
      style={{
         backgroundColor: location.pathname.includes(url)
            ? "rgba(0,115,255,0.1)"
            : "white",
      }}
   >
      <Link
         to={url}
         style={{
            color: location.pathname.includes(url) ? "rgb(0,115,255)" : "black",
         }}
      >
         <Icon /> <span>{text}</span>
      </Link>
   </li>
);
