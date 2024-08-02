import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
   BarResponse,
   LineResponse,
   PieResponse,
   StatsResponse,
} from "../../types/api.types";

export const dashboardApi = createApi({
   reducerPath: "dashboardApi",
   baseQuery: fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_SERVER}/v1/dashboard`,
   }),

   endpoints: (builder) => ({
      stats: builder.query<StatsResponse, string>({
         query: (id) => `stats?id=${id}`,
         keepUnusedDataFor: 0,
      }),
      pie: builder.query<PieResponse, string>({
         query: (id) => `pie-chart?id=${id}`,
         keepUnusedDataFor: 0,
      }),
      line: builder.query<LineResponse, string>({
         query: (id) => `line-chart?id=${id}`,
         keepUnusedDataFor: 0,
      }),

      bar: builder.query<BarResponse, string>({
         query: (id) => `bar-chart?id=${id}`,
         keepUnusedDataFor: 0, // This for No Caching
      }),
   }),
});

export const { useStatsQuery, usePieQuery, useLineQuery, useBarQuery } =
   dashboardApi;
