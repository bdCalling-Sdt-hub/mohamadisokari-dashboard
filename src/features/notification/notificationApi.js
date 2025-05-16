import { baseApi } from "../../utils/ApiBaseQuery";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allNotifications: builder.query({
      query: () => ({
        url: "/notifications/admin",
        method: "GET",
      }),
      providesTags: ['Notifications'],
    }),

    readNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/single/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

// Export hooks
export const {
  useAllNotificationsQuery,
  useReadNotificationMutation,
} = notificationApi;