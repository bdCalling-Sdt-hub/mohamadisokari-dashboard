import { baseApi } from "../../utils/ApiBaseQuery";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getBanner: builder.query({
      query: () => ({
        url: "/admin/banner",
        method: "GET",
      }),
      providesTags: ["banner"],
    }),

    // Create a new category
    createBanner: builder.mutation({
      query: (data) => ({
        url: "/admin/banner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["banner"],
    }),

    // Update an existing category
    updateBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/banner/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["banner"],
    }),

    // Delete a category
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/admin/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banner"],
    }),
  }),
});

// Export hooks
export const {
  useGetBannerQuery, 
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation
} = bannerApi;