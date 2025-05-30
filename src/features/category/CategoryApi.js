import { baseApi } from "../../utils/ApiBaseQuery";

export const CategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getCategory: builder.query({
      query: () => ({
        url: "/admin/category",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // Create a new category
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/admin/category/create-service",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    // Update an existing category
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    // Delete a category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

// Export hooks
export const {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = CategoryApi;