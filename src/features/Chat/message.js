import { baseApi } from "../../utils/ApiBaseQuery";


export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    messageSend: builder.mutation({
      query: ({ id, body }) => ({
        url: `/messages/send-message/${id}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["chat"],
    }),

    getAllChat: builder.query({
      query: (value) => ({
        url: `/chat?searchTerm=${value}`,
        method: "GET",
      }),
      providesTags: ["chat", "profile"],
      transformResponse: (res) => {
        return res.data
      }
    }),

    getAllMassage: builder.query({
      query: (id) => ({
        url: `/messages/${id}?limit=${2000}`,
        method: "GET",
      }),
      providesTags: ["chat"],
      transformResponse: (res) => {
        return res.data
      }
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/chat/mark-chat-as-read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["chat"],
    }),

    reactMessage: builder.mutation({
      query: (data) => ({
        url: `/messages/react/${data.messageId}`,
        method: "POST",
        body: { reactionType: data.reaction },
      }),
      invalidatesTags: ["chat"],
    }),


    DeleteMessage: builder.mutation({
      query: (id) => ({
        url: `/messages/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["chat"],
    }),



  }),
});

export const {
  useMessageSendMutation,
  useGetAllChatQuery,
  useGetAllMassageQuery,
  useMarkAsReadMutation,
  useReactMessageMutation,
  useDeleteMessageMutation
} = commentApi;
