import { baseApi } from "../../utils/ApiBaseQuery";

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllCms: builder.query({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
    }),

     getContact : builder.query({
      query: () => ({
        url: "/support",
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


     contact: builder.mutation({
      query: (data) => ({
        url: "/admin/support/",
        method: "PUT",
        body: data
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
  useGetAllCmsQuery,
  useContactMutation,
  useGetContactQuery
} = cmsApi;
