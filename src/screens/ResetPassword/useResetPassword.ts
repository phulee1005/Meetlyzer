import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Messages } from "constants/messages";
import { createValidationWithMessages } from "utils/validate";
import { showInfo } from "@components/CustomModal";
import { useNavigation } from "@react-navigation/native";
import { useResetPasswordMutation } from "services/authApi";

interface ResetPasswordParams {
  email: string;
  accessKey: string;
}

export const useResetPassword = ({ email, accessKey }: ResetPasswordParams) => {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const validation = createValidationWithMessages(t);
  const [resetPasswordApi, { isLoading }] = useResetPasswordMutation();

  const handleResetPassword = async (): Promise<boolean> => {
    setError(null);

    try {
      const validationError = validation.validateResetPasswordForm(
        newPassword,
        confirmPassword
      );

      if (validationError) {
        setError(validationError);
        return false;
      }

      const response = await resetPasswordApi({
        email,
        accessKey,
        newPassword,
      }).unwrap();

      if (response.success) {
        showInfo(
          t("resetPassword.resetPasswordSuccess"),
          t("modal.success"),
          () => {
            setNewPassword("");
            setConfirmPassword("");
            navigation.goBack();
          }
        );
        return true;
      } else {
        setError(response?.message || t(Messages.ERROR.UNKNOWN_ERROR));
        return false;
      }
    } catch (err: any) {
      setError(
        err?.data?.message || err?.message || t(Messages.ERROR.UNKNOWN_ERROR)
      );
      return false;
    }
  };

  const validateForm = (
    newPassword: string,
    confirmPassword: string
  ): string | null => {
    return validation.validateResetPasswordForm(newPassword, confirmPassword);
  };

  const clearError = () => setError(null);

  return {
    newPassword,
    confirmPassword,
    setNewPassword,
    setConfirmPassword,
    handleResetPassword,
    isLoading,
    error,
    validateForm,
    clearError,
  };
};
