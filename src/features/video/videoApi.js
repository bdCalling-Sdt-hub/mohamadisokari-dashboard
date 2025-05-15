import { baseApi } from "../../utils/ApiBaseQuery";

export const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getvideo: builder.query({
      query: () => ({
        url: "/admin/tutorials",
        method: "GET",
      }),
      providesTags: ["video"],
    }),


    getSingleVideo: builder.query({
      query: (id) => ({
        url: `/admin/tutorials/${id}`,
        method: "GET",
      }),
      providesTags: ["video"],
    }),

    // Create a new category
    createVideo: builder.mutation({
      query: (data) => ({
        url: "/admin/tutorials",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["video"],
    }),

    // Update an existing category
    updateVideo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/tutorials/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["banner"],
    }),

    // Delete a category
    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/admin/tutorials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["video"],
    }),
  }),
});

// Export hooks
export const {
  useGetSingleVideoQuery,
  useGetvideoQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation
} = videoApi;