import { baseApi } from "../../utils/ApiBaseQuery";

export const ProductManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    getAllProduct: builder.query({
      query: (params) => {
        const { searchTerm = '', category = '', location = '', page = 1 } = params || {};
        return {
          url: `/admin/product-managments/?${searchTerm ? `searchTerm=${searchTerm}&` : ''}${category ? `category=${category}&` : ''}${location ? `location=${location}&` : ''}page=${page}`,
          method: "GET",
        };
      },
    }),

    getProductsAnalysis: builder.query({
      query: ({ location, year }) => ({
        url: `/admin/product-managments/product-stats?location=${location}&year=${year}`,
        method: "GET",
      }),
    }),

    getParticularProduct: builder.query({
      query: (id) => ({
        url: `/admin/product-managments/${id}`,
        method: "GET",
      }),
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/product-managments/${id}`,
        method: "DELETE", // Removed space after DELETE
      }),
    }),

    deleteMultipleProduct: builder.mutation({
      query: (data) => ({
        url: `/admin/product-managments/delete-multiple`,
        method: "POST", // Removed space after DELETE
        body: data, // { "productIds": ["dksjfidshgdfhgjfdhgkfdjhg","dksjfidshgdfhgjfdhgkfdjhg"]}
      }),
    }),

    topCategories: builder.query({
      query: (body) => ({
        url: `/admin/product-managments/top-category?year=${body.year}${body.month ? `&month=${body.month}` : ''}`,
        method: "GET",
      }),
    }),


  }),
});

// Export hooks
export const {
  useGetAllProductQuery,
  useGetParticularProductQuery,
  useDeleteProductMutation,
  useDeleteMultipleProductMutation,
  useGetProductsAnalysisQuery,
  useTopCategoriesQuery
} = ProductManagementApi;