import { baseApi } from "../../utils/ApiBaseQuery";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransaction: builder.query({
      query: (page) => ({
        url: `/orders/transaction?page=${page}`,
        method: "GET",
      }),
    }),

     getPerticularTransaction: builder.query({
      query: (id) => ({
        url: `/orders/transaction/${id}`,
        method: "GET",
      }),
    }),

  }),
});

// Export hooks
export const {
  useGetTransactionQuery,
  useGetPerticularTransactionQuery
} = transactionApi;
