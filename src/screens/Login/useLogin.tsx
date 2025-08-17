import { useState } from "react";
import { useLoginMutation, useGoogleAuthMutation } from "services/authApi";
import { useTranslation } from "react-i18next";
import { Messages } from "constants/messages";
import { createValidationWithMessages } from "utils/validate";
import { useDispatch } from "react-redux";
import { setUser } from "store/userSlice";
import { useNavigation } from "@react-navigation/native";
import googleSignInService from "services/googleSignIn";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
  const { t } = useTranslation();
  const validation = createValidationWithMessages(t);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const handleLogin = async (
    credentials: LoginCredentials
  ): Promise<boolean> => {
    setError(null);

    try {
      const result = await login(credentials).unwrap();

      if (result.success) {
        if (result.response && result.response.userInfo) {
          dispatch(
            setUser({
              accessToken: result.response.accessToken || "",
              refreshToken: result.response.refreshToken || "",
              userInfo: result.response.userInfo || undefined,
            })
          );
        }
        return true;
      } else {
        setError(result.message || Messages.ERROR.LOGIN_FAILED);
        return false;
      }
    } catch (err: any) {
      console.error("=== LOGIN ERROR ===");
      console.error("Error details:", {
        error: err,
        status: err?.status,
        data: err?.data,
        message: err?.message,
        originalError: err?.error,
      });

      // Xử lý lỗi tài khoản chưa active
      if (
        err?.status === 403 &&
        err?.data?.message === "ERROR_DATA_NOT_ACTIVE"
      ) {
        // Chuyển hướng đến màn hình OTP verification
        navigation.navigate("OTPVerification", {
          email: credentials.email,
          password: credentials.password,
        });
        return false;
      }

      // Xử lý lỗi từ RTK Query
      if (err?.status === "FETCH_ERROR") {
        if (err?.error?.includes("Network request failed")) {
          setError(t(Messages.ERROR.NETWORK_FAILED));
        } else {
          setError(t(Messages.ERROR.NETWORK_FAILED));
        }
      } else if (err?.status === "TIMEOUT_ERROR") {
        setError(t(Messages.ERROR.NETWORK_TIMEOUT));
      } else if (err?.data?.message) {
        setError(err.data.message);
      } else if (err?.error) {
        setError(err.error);
      } else {
        setError(t(Messages.ERROR.UNKNOWN_ERROR));
      }

      return false;
    }
  };

  const handleGoogleLogin = async (
    forceLogout: boolean = false
  ): Promise<boolean> => {
    setError(null);

    try {
      // Force logout if requested
      if (forceLogout) {
        await googleSignInService.forceSignOut();
      }

      // Sign in with Google
      const googleToken = await googleSignInService.signIn();

      // Send Google data to backend
      const result = await googleAuth({
        idToken: googleToken,
      }).unwrap();

      if (result.success) {
        if (result.response && result.response.userInfo) {
          dispatch(
            setUser({
              accessToken: result.response.accessToken || "",
              refreshToken: result.response.refreshToken || "",
              userInfo: result.response.userInfo || undefined,
            })
          );
        }
        return true;
      } else {
        setError(result.message || Messages.ERROR.GOOGLE_LOGIN_FAILED);
        return false;
      }
    } catch (err: any) {
      console.error("=== GOOGLE LOGIN ERROR ===");
      console.error("Error details:", {
        error: err,
        status: err?.status,
        data: err?.data,
        message: err?.message,
        originalError: err?.error,
      });

      // Handle Google Sign-In specific errors
      if (err?.message?.includes("User cancelled")) {
        // User cancelled the sign-in flow, don't show error
        return false;
      }

      // Handle backend errors
      if (err?.status === "FETCH_ERROR") {
        if (err?.error?.includes("Network request failed")) {
          setError(t(Messages.ERROR.NETWORK_FAILED));
        } else {
          setError(t(Messages.ERROR.NETWORK_FAILED));
        }
      } else if (err?.status === "TIMEOUT_ERROR") {
        setError(t(Messages.ERROR.NETWORK_TIMEOUT));
      } else if (err?.data?.message) {
        setError(err.data.message);
      } else if (err?.error) {
        setError(err.error);
      } else {
        setError(t(Messages.ERROR.GOOGLE_LOGIN_FAILED));
      }

      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login: handleLogin,
    googleLogin: handleGoogleLogin,
    isLoading: isLoading || isGoogleLoading,
    error,
    clearError,
    validateForm: validation.validateLoginForm,
    validateEmail: validation.validateEmail,
    validatePassword: validation.validatePassword,
  };
};
