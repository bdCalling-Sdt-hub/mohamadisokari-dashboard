import { baseApi } from "../../utils/ApiBaseQuery";



export const UserManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    getAllUser : builder.query({
      query: (page) => ({
        url: `/admin/users-managments?page=${page}`,
        method: "GET",
      }),
    }),

    getPerticularUser : builder.query({
      query: (id) => ({
        url: `/admin/users-managments/${id}`,
        method: "GET",
      }),
    }),


    userAnalysis : builder.query({
      query: (location , year ) => ({
        url: `/admin/users-managments/user-analytics?location=${location}&year=${year}`,
        method: "GET",
      }),
    }),

   districtWiseUsers: builder.query({
  query: (body) => ({
    url: `/admin/users-managments/top-districts?year=${body.year}${body.month ? `&month=${body.month}` : ''}`,
    method: "GET",
  }),
  }),


    getSellerHistory : builder.query({
      query: (id) => ({
        url: `/admin/users-managments/seller-history/${id}`,
        method: "GET",
      }),
    }),


      getBuyerHistory : builder.query({
      query: (id) => ({
        url: `/admin/users-managments/buyer-history/${id}`,
        method: "GET",
      }),
    }),

    updateUserStatus: builder.mutation({
      query: (data) => ({
        url: `/admin/users-managments/status/${data.id}`,
        method: "PUT",
        body: {status: data.status}, // {"status": "active"} // status active or banned
      }),
    }),
  }),
});

// Export hooks
export const {
    useDistrictWiseUsersQuery,
    useGetAllUserQuery,
    useGetPerticularUserQuery,
    useGetSellerHistoryQuery,
    useUpdateUserStatusMutation,
    useUserAnalysisQuery,
    useGetBuyerHistoryQuery
} = UserManagementApi;
