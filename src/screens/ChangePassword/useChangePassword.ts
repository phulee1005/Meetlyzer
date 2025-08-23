import { useState } from "react";
import { useChangePasswordMutation } from "services/authApi";
import { useTranslation } from "react-i18next";
import { Messages } from "constants/messages";
import { createValidationWithMessages } from "utils/validate";
import { showInfo } from "@components/CustomModal";
import { useNavigation } from "@react-navigation/native";

export const useChangePassword = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { t } = useTranslation();
  const validation = createValidationWithMessages(t);

  const handleChangePassword = async (): Promise<boolean> => {
    setError(null);

    try {
      const validationError = validation.validateChangePasswordForm(
        oldPassword,
        newPassword,
        confirmPassword
      );

      if (validationError) {
        setError(validationError);
        return false;
      }

      const response = await changePassword({
        oldPassword,
        newPassword,
      }).unwrap();

      if (response.success) {
        showInfo(
          t("changePassword.changePasswordSuccess"),
          t("modal.success"),
          () => {
            setOldPassword("");
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
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): string | null => {
    return validation.validateChangePasswordForm(
      oldPassword,
      newPassword,
      confirmPassword
    );
  };

  const clearError = () => setError(null);

  return {
    oldPassword,
    newPassword,
    confirmPassword,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
    handleChangePassword,
    isLoading,
    error,
    validateForm,
    clearError,
  };
};
