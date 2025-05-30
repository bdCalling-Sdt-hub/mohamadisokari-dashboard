import { baseApi } from "../../utils/ApiBaseQuery";



export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    getCategory: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),

    // Email Verification
    createCategory: builder.mutation({
      query: (data) => ({
        url: "",
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
} = settingsApi;
