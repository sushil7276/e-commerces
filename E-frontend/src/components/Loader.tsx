import { GridLoader } from "react-spinners";

export default function Loader() {
   return (
      <div className='loader'>
         <GridLoader color='#330202' size={25} />
      </div>
   );
}
