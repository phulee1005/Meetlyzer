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

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

interface ForgotPasswordRequest {
  email: string;
  redirectUri: string;
  backendUri: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

interface ResetPasswordRequest {
  email: string;
  accessKey: string;
  newPassword: string;
}

interface ResetPasswordResponse {
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
    changePassword: builder.mutation<
      RTKResponse<ChangePasswordResponse>,
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<
      RTKResponse<ForgotPasswordResponse>,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      RTKResponse<ResetPasswordResponse>,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/verify-change-password",
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
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
