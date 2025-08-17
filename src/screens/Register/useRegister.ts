import { useState } from "react";
import { useRegisterMutation } from "services/authApi";
import { useTranslation } from "react-i18next";
import { Messages } from "constants/messages";
import { createValidationWithMessages } from "utils/validate";
import { RegisterRequest } from "types/auth";
import { showInfo } from "@components/CustomModal";
import { useNavigation } from "@react-navigation/native";
import navigatorName from "constants/navigatorName";

export const useRegister = () => {
  const navigation = useNavigation();
  const { LOGIN } = navigatorName;
  const [error, setError] = useState<string | null>(null);
  const [registerApi, { isLoading }] = useRegisterMutation();
  const { t } = useTranslation();
  const validation = createValidationWithMessages(t);

  const handleRegister = async (
    credentials: RegisterRequest
  ): Promise<boolean> => {
    setError(null);
    try {
      const result = await registerApi(credentials).unwrap();
      if (result.success) {
        showInfo(t("register.registerSuccess"), t("modal.success"), () => {
          navigation.navigate(LOGIN as never);
        });
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

  const validateForm = (
    name: string,
    email: string,
    password: string
  ): string | null => {
    return validation.validateRegisterForm(name, email, password);
  };

  const clearError = () => setError(null);

  return {
    register: handleRegister,
    isLoading,
    error,
    validateForm,
    clearError,
  };
};
