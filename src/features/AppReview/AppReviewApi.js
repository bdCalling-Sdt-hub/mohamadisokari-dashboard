import { baseApi } from "../../utils/ApiBaseQuery";



export const AppReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    getReview: builder.query({
      query: () => ({
        url: "/admin/feedback",
        method: "GET",
      }),
    }),

    getReviewAnalysis: builder.query({
      query: () => ({
        url: "/admin/feedback/analysis",
        method: "GET",
      }),
    }),



    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/admin/feedback/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

// Export hooks
export const {
  useGetReviewQuery,
  useGetReviewAnalysisQuery,
  useDeleteReviewMutation

} = AppReviewApi;
