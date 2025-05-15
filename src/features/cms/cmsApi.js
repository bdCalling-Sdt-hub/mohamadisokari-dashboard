import { baseApi } from "../../utils/ApiBaseQuery";

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllCms: builder.query({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
    }),

    addPrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: "/settings/",
        method: "PUT",
        body: { privacyPolicy: `${data}` }
      }),
    }),

    addAbout: builder.mutation({
      query: (data) => ({
        url: "/settings/",
        method: "PUT",
        body: { aboutUs: `${data}` }
      }),
    }),

    addTerms: builder.mutation({
      query: (data) => ({
        url: "/settings/",
        method: "PUT",
        body: { termsOfService: `${data}` }
      }),
    }),

    addSupport: builder.mutation({
      query: (data) => ({
        url: "/settings/",
        method: "PUT",
        body: { support: `${data}`, }
      }),
    }),



  }),
});

// Export hooks
export const {
  useAddPrivacyPolicyMutation,
  useAddAboutMutation,
  useAddTermsMutation,
  useAddSupportMutation,
  useGetAllCmsQuery
} = cmsApi;
