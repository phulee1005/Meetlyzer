import { useState } from "react";
import {
  useForgotPasswordMutation,
  useRegisterMutation,
} from "services/authApi";
import { useTranslation } from "react-i18next";
import { Messages } from "constants/messages";
import { createValidationWithMessages } from "utils/validate";
import { RegisterRequest } from "types/auth";
import { showInfo } from "@components/CustomModal";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "@env";
import * as Linking from "expo-linking";

export const useForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordApi, { isLoading }] = useForgotPasswordMutation();
  const { t } = useTranslation();
  const validation = createValidationWithMessages(t);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (email: string) => {
    setError(null);
    try {
      const result = await forgotPasswordApi({
        email,
        redirectUri: Linking.createURL("/"),
        backendUri: BACKEND_URL,
      }).unwrap();
      if (result.success) {
        showInfo(t("resetPassword.resetPasswordSuccess"), t("modal.success"));
        return true;
      } else {
        setError(result.message || t(Messages.ERROR.UNKNOWN_ERROR));
        return false;
      }
    } catch (err: any) {
      setError(
        err?.data?.message || err?.message || t(Messages.ERROR.UNKNOWN_ERROR)
      );
      return false;
    }
  };

  const validateForm = (email: string): string | null => {
    return validation.validateEmail(email);
  };

  const clearError = () => setError(null);

  return {
    handleForgotPassword,
    isLoading,
    error,
    validateForm,
    clearError,
    email,
    setEmail,
  };
};
