import { baseApi } from "../../utils/ApiBaseQuery";



export const PushNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendPushNotification: builder.mutation({
      query: (body) => ({
        url: `/admin/notifications/send-notification`,
        method: "POST",
        body: body,
      }),
    }),
  }),
});

// Export hooks
export const {
  useSendPushNotificationMutation
} = PushNotificationApi;
