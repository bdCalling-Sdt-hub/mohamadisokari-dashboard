import { baseApi } from "../../utils/ApiBaseQuery";



export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    dashboardAnalysis: builder.query({
      query: (filter) => ({
        url: `/admin/dashboard?filter=${filter}`,
        method: "GET",
      }),
    }),


    revenueAnalysis: builder.query({
      query: (year) => ({
        url: `/admin/dashboard/revenue?year=${year}`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks
export const {
  useDashboardAnalysisQuery,
  useRevenueAnalysisQuery
} = overviewApi;
