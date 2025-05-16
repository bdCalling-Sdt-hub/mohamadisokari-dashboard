import { baseApi } from "../../utils/ApiBaseQuery";



export const ReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    getAllReport: builder.query({
      query: (page) => ({
        url: `/admin/reports?page=${page}`,
        method: "GET",
      }),
    }),

    getPerticularReport: builder.query({
      query: (id) => ({
        url: `/admin/reports/${id}`,
        method: "GET",
      }),
    }),

    updateStatus: builder.mutation({
      query: ({ status, id }) => ({
        url: `/admin/reports/${id}/status`,
        method: "PUT",
        body: { status: status },
      }),
    }),

    deleteReport: builder.mutation({
      query: (id) => ({
        url: `/admin/reports/${id}`,
        method: "DELETE",
      }),
    }),


    getReportChart: builder.query({
      query: (params) => {
        // Handle parameters properly
        const { location, month } = params;

        // Build the URL with query parameters
        let url = '/admin/reports/statistics';
        const queryParams = [];

        if (location) {
          queryParams.push(`location=${encodeURIComponent(location)}`);
        }

        if (month) {
          queryParams.push(`month=${encodeURIComponent(month)}`);
        }

        // Append query parameters if they exist
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }

        return {
          url,
          method: 'GET',
        };
      },
    }),

  }),
});

// Export hooks
export const {
  useGetAllReportQuery,
  useGetPerticularReportQuery,
  useUpdateStatusMutation,
  useDeleteReportMutation,
  useGetReportChartQuery
} = ReportApi;
