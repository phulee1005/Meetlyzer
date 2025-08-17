import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Messages } from "constants/messages";
import { useVerifyOTPMutation, useResendOTPMutation } from "services/authApi";
import { showError } from "@components/CustomModal";

export const useOTPVerification = () => {
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const [verifyOTPApi, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resendOTPApi, { isLoading: isResending }] = useResendOTPMutation();

  const verifyOTP = async (
    email: string,
    otpCode: string
  ): Promise<boolean> => {
    setError(null);

    try {
      const result = await verifyOTPApi({ email, otpCode }).unwrap();

      if (result.success) {
        return true;
      } else {
        return false;
      }
    } catch (err: any) {
      console.error("=== OTP VERIFICATION ERROR ===");
      console.error("Error details:", err);

      if (err?.data?.message) {
        showError(t("validation." + err?.data?.message));
      } else if (err?.error) {
        showError(t("validation." + err.error));
      } else {
        showError(t(Messages.ERROR.UNKNOWN_ERROR));
      }
      return false;
    }
  };

  const resendOTP = async (email: string): Promise<boolean> => {
    setError(null);

    try {
      const result = await resendOTPApi({ email }).unwrap();

      if (result.success) {
        return true;
      } else {
        setError(result.message || t(Messages.ERROR.UNKNOWN_ERROR));
        return false;
      }
    } catch (err: any) {
      console.error("=== RESEND OTP ERROR ===");
      console.error("Error details:", err);

      if (err?.data?.message) {
        setError(err.data.message);
      } else if (err?.error) {
        setError(err.error);
      } else {
        setError(t(Messages.ERROR.UNKNOWN_ERROR));
      }
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    verifyOTP,
    resendOTP,
    isLoading: isVerifying || isResending,
    error,
    clearError,
  };
};
