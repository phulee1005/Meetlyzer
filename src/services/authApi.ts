import { RTKResponse } from "types/rtk";
import { api } from "./api";
import { LoginRequest, LoginResponse, RegisterRequest } from "types/auth";

interface OTPVerificationRequest {
  email: string;
  otpCode: string;
}

interface OTPResendRequest {
  email: string;
}

interface OTPResponse {
  success: boolean;
  message?: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<RTKResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<RTKResponse<LoginResponse>, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/sign-up",
        method: "POST",
        body: credentials,
      }),
    }),
    googleAuth: builder.mutation<
      RTKResponse<LoginResponse>,
      { idToken: string }
    >({
      query: (googleData) => ({
        url: "/auth/sign-in-with-google",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${googleData.idToken}`,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyOTP: builder.mutation<
      RTKResponse<OTPResponse>,
      OTPVerificationRequest
    >({
      query: (data) => ({
        url: "/auth/active-account",
        method: "POST",
        body: data,
      }),
    }),
    resendOTP: builder.mutation<RTKResponse<OTPResponse>, OTPResendRequest>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
} = authApi;
