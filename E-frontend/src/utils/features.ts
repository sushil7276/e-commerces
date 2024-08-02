import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api.types";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

type ResType =
   | {
        data: MessageResponse;
     }
   | {
        error: FetchBaseQueryError | SerializedError;
     };

export const responseToast = (
   res: ResType,
   navigate: NavigateFunction | null,
   url: string
) => {
   if ("data" in res) {
      toast.success(res.data.message);
      if (navigate) {
         navigate(url);
      }
   } else {
      const error = res.error as FetchBaseQueryError;
      const MessageResponse = error.data as MessageResponse;
      toast.error(MessageResponse.message);
   }
};

export const getLastMonths = () => {
   const currentDate = moment();
   currentDate.date(1);

   const last6Month: string[] = [];
   const last12Month: string[] = [];

   // last 6 Month Name
   for (let i = 0; i < 6; i++) {
      const monthDate = currentDate.clone().subtract(i, "months");
      const monthName = monthDate.format("MMMM");
      last6Month.unshift(monthName);
   }

   // Last 12 Month Name
   for (let i = 0; i < 12; i++) {
      const monthDate = currentDate.clone().subtract(i, "months");
      const monthName = monthDate.format("MMMM");
      last12Month.unshift(monthName);
   }

   return {
      last6Month,
      last12Month,
   };
};
