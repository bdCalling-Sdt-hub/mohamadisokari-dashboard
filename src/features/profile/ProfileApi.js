import { baseApi } from "../../utils/ApiBaseQuery";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PATCH",
        body: data
      }),
    }),

  }),
});

// Export hooks
export const {
  useGetProfileQuery,
  useUpdateProfileMutation
} = profileApi;
