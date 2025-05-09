import { baseApi } from "../../utils/ApiBaseQuery";



export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Email Verification
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-phone",
        method: "POST",
        body: data,
      }),
    }),

    resendEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        },
      }),
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendEmailMutation
} = authApi;
