import { baseApi } from "../../utils/ApiBaseQuery";



export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    createAdmin: builder.mutation({
      query: (body) => ({
        url: "/admin/create-admin",
        method: "POST",
        body: body, /* {
    "name": "rakib",
    "email": "rakibhassan3005@gmail.com",
    "contactNumber":"+8801749183977",
    "password": "rakib123"
} */
      }),
    }),


    getAllAdmin: builder.query({
      query: () => ({
        url: "/admin/get-admin",
        method: "GET",
      }),
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "DELETE",
      }),
    }),

    changePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body: body, /* {
    "currentPassword":"admin12345",
    "newPassword": "rakib1234",
    "confirmPassword": "rakib1234"
} */
      }),
    }),

  }),
});

// Export hooks
export const {
  useCreateAdminMutation,
  useGetAllAdminQuery,
  useDeleteAdminMutation,
  useChangePasswordMutation
} = adminApi;
