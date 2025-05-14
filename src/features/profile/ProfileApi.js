import { baseApi } from "../../utils/ApiBaseQuery";



export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    getCategory: builder.query({
      query: () => ({
        url: "/admin/category",
        method: "GET",
      }),
    }),

    // Email Verification
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/admin/category/create-service",
        method: "POST",
        body: data,
      }),
    }),

    updateCategory: builder.mutation({
      query: (data, Id) => ({
        url: `/admin/category/${Id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    // Forgot Password
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/category/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

// Export hooks
export const {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = profileApi;
